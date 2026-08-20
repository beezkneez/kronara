const { chromium } = require('playwright');
const path = require('path');

const APP_URL = 'https://app.kronara.app';
const OUTPUT_DIR = path.join(__dirname, '..', 'docs', 'assets', 'screenshots');

const ADMIN_PIN = '1212';
const STAFF_PIN = '1234';
const STAFF_USER = 'sarah';
const ADMIN_USER = 'admin';

async function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function login(page, username, pin) {
  await page.goto(APP_URL, { waitUntil: 'networkidle' });
  await delay(1500);
  const usernameInput = page.locator('input[name="username"], input[placeholder*="user" i], input[placeholder*="name" i], #username').first();
  if (await usernameInput.isVisible()) await usernameInput.fill(username);
  const pinInput = page.locator('input[name="pin"], input[type="password"], input[placeholder*="pin" i], #pin').first();
  if (await pinInput.isVisible()) await pinInput.fill(pin);
  const loginBtn = page.locator('button:has-text("Log In"), button:has-text("Login"), button:has-text("Sign In"), button[type="submit"]').first();
  if (await loginBtn.isVisible()) await loginBtn.click();
  await delay(3000);
  await page.waitForLoadState('networkidle');
}

async function switchTheme(page, themeName) {
  // Navigate to profile to change theme
  const profileLink = page.locator('a:has-text("Profile"), [href*="profile"], nav a:has-text("Profile")').first();
  if (await profileLink.isVisible().catch(() => false)) {
    await profileLink.click();
    await delay(2000);
    await page.waitForLoadState('networkidle');
  }

  // Click the theme button
  const themeBtn = page.locator(`button#themeBtn_${themeName}, button[onclick*="setTheme_('${themeName}')"]`).first();
  if (await themeBtn.isVisible().catch(() => false)) {
    await themeBtn.click();
    await delay(1500);
    console.log(`  Switched to ${themeName} theme`);
  } else {
    // Try clicking by text
    const themeBtnText = page.locator(`button:has-text("${themeName}")`).first();
    if (await themeBtnText.isVisible().catch(() => false)) {
      await themeBtnText.click();
      await delay(1500);
      console.log(`  Switched to ${themeName} theme (by text)`);
    } else {
      console.log(`  WARNING: Could not find theme button for ${themeName}`);
    }
  }
}

async function captureScreensForTheme(browser, themeSuffix, themeName) {
  console.log(`\n=== Capturing ${themeName} theme screenshots (${themeSuffix}) ===`);

  // Desktop context
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    ignoreHTTPSErrors: true,
  });

  // --- Staff screenshots ---
  console.log('Logging in as staff (sarah)...');
  const staffPage = await ctx.newPage();
  await login(staffPage, STAFF_USER, STAFF_PIN);

  // Switch theme first
  await switchTheme(staffPage, themeName);

  // Navigate to Home
  const homeLink = staffPage.locator('a:has-text("Home"), nav a:first-child').first();
  if (await homeLink.isVisible().catch(() => false)) {
    await homeLink.click();
    await delay(2000);
    await staffPage.waitForLoadState('networkidle');
  }

  // Staff dashboard
  console.log('  Taking staff dashboard...');
  await delay(1000);
  await staffPage.screenshot({ path: path.join(OUTPUT_DIR, `staff-dashboard${themeSuffix}.png`), fullPage: false });
  console.log(`  -> staff-dashboard${themeSuffix}.png`);

  // Also use this as hero
  await staffPage.screenshot({ path: path.join(OUTPUT_DIR, `hero-dashboard${themeSuffix}.png`), fullPage: false });
  console.log(`  -> hero-dashboard${themeSuffix}.png`);

  // Calendar/entries - try clicking a nav link
  const calendarLink = staffPage.locator('a:has-text("Calendar"), a:has-text("Entries"), [href*="calendar"], [href*="entries"]').first();
  if (await calendarLink.isVisible().catch(() => false)) {
    await calendarLink.click();
    await delay(2000);
    await staffPage.waitForLoadState('networkidle');
    await staffPage.screenshot({ path: path.join(OUTPUT_DIR, `calendar-entries${themeSuffix}.png`), fullPage: false });
    console.log(`  -> calendar-entries${themeSuffix}.png`);
  }

  // Reports
  const reportsLink = staffPage.locator('a:has-text("Reports")').first();
  if (await reportsLink.isVisible().catch(() => false)) {
    await reportsLink.click();
    await delay(2000);
    await staffPage.waitForLoadState('networkidle');
    await staffPage.screenshot({ path: path.join(OUTPUT_DIR, `reports${themeSuffix}.png`), fullPage: false });
    console.log(`  -> reports${themeSuffix}.png`);
  }

  await staffPage.close();

  // --- Admin screenshots ---
  console.log('Logging in as admin...');
  const adminPage = await ctx.newPage();
  await login(adminPage, ADMIN_USER, ADMIN_PIN);
  await switchTheme(adminPage, themeName);

  // Navigate to Home
  const adminHome = adminPage.locator('a:has-text("Home"), nav a:first-child').first();
  if (await adminHome.isVisible().catch(() => false)) {
    await adminHome.click();
    await delay(2000);
    await adminPage.waitForLoadState('networkidle');
  }

  // Admin dashboard
  console.log('  Taking admin dashboard...');
  await delay(1000);
  await adminPage.screenshot({ path: path.join(OUTPUT_DIR, `full-admin-overview${themeSuffix}.png`), fullPage: false });
  console.log(`  -> full-admin-overview${themeSuffix}.png`);

  // Payroll/Reports
  const payrollLink = adminPage.locator('a:has-text("Payroll"), a:has-text("Reports")').first();
  if (await payrollLink.isVisible().catch(() => false)) {
    await payrollLink.click();
    await delay(2000);
    await adminPage.waitForLoadState('networkidle');
    await adminPage.screenshot({ path: path.join(OUTPUT_DIR, `admin-payroll${themeSuffix}.png`), fullPage: false });
    console.log(`  -> admin-payroll${themeSuffix}.png`);
  }

  await adminPage.close();

  // --- Mobile screenshot ---
  console.log('  Taking mobile screenshot...');
  const mobileCtx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    ignoreHTTPSErrors: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
    isMobile: true,
    hasTouch: true,
  });

  const mobilePage = await mobileCtx.newPage();
  await login(mobilePage, STAFF_USER, STAFF_PIN);
  await switchTheme(mobilePage, themeName);

  // Go home
  const mobileHome = mobilePage.locator('a:has-text("Home"), a:has-text("HOME")').first();
  if (await mobileHome.isVisible().catch(() => false)) {
    await mobileHome.click();
    await delay(2000);
  }
  await delay(1000);

  // Dismiss any PWA install banner
  const dismissBtn = mobilePage.locator('button:has-text("Got it"), button:has-text("Dismiss"), button:has-text("Close")').first();
  if (await dismissBtn.isVisible().catch(() => false)) {
    await dismissBtn.click();
    await delay(500);
  }

  await mobilePage.screenshot({ path: path.join(OUTPUT_DIR, `mobile-pwa${themeSuffix}.png`), fullPage: false });
  console.log(`  -> mobile-pwa${themeSuffix}.png`);

  await mobilePage.close();
  await mobileCtx.close();
  await ctx.close();
}

async function takeScreenshots() {
  const browser = await chromium.launch({ headless: true });

  // Capture light theme (current default)
  await captureScreensForTheme(browser, '', 'light');

  // Capture kronara dark theme
  await captureScreensForTheme(browser, '-dark', 'kronara');

  await browser.close();
  console.log('\nDone! All screenshots saved to docs/assets/screenshots/');
}

takeScreenshots().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
