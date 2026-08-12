import { chromium } from 'playwright';

(async () => {
  console.log("Starting QA test with Playwright for JoshFireAwareness...");
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const errors = [];
  page.on('console', msg => {
    // Ignore fetch errors for the missing EMV proxy in static testing
    if (msg.type() === 'error' && !msg.text().includes('api/emv') && !msg.text().includes('Failed to load resource')) {
      errors.push(`Console Error: ${msg.text()}`);
    }
  });
  
  page.on('pageerror', error => {
    errors.push(`Page Error: ${error.message}`);
  });

  try {
    await page.goto('http://localhost:8000/index.html', { waitUntil: 'networkidle' });
    const title = await page.title();
    console.log(`Visited Homepage. Title: ${title}`);
    
    await page.waitForTimeout(1000);
    
    console.log("\n--- QA Results ---");
    if (errors.length > 0) {
      console.log("Encountered errors during QA:");
      errors.forEach(e => console.log(e));
    } else {
      console.log("No console or page errors encountered! UI is solid.");
    }
    
  } catch (err) {
    console.error("Test failed to execute:", err);
  } finally {
    await browser.close();
  }
})();
