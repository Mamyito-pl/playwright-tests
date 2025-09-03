import { Frame, Page } from "@playwright/test";

export async function addGlobalStyles(page) {
  const cssRules = `
  div[data-sentry-element='PromptContainer'] { display: none !important; }
  #onetrust-consent-sdk { display: none !important; }
  #edrone--main--push--container { display: none !important; }
  #edrone--main--popup--container { display: none !important; }
  div[data-sentry-component="ExternalWidget"] { display: none !important; }
  #cookiescript_injected_wrapper { display: none !important; }
  `;

  try {
    await page.waitForSelector('body', { visible: true });
    await page.addStyleTag({ content: cssRules });
  } catch {
  }
};

export const isMobile = (viewportWidth: number): boolean => {
    return viewportWidth <= 400;
};

export async function retryUntil200(fn, maxRetries = 10, delay = 1000) {
  let lastResponse;
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fn();
      if (response.status && response.status() === 200) {
        return response;
      }
      lastResponse = response;
    } catch (e) {
    }
    await new Promise(res => setTimeout(res, delay));
  }
  throw new Error(`Nie uzyskano statusu 200 po ${maxRetries} próbach`);
};

export async function tryClickApplyButton(page: any, productsListPage: any, maxAttempts = 3) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    await productsListPage.clickApplyButton();
    await page.waitForTimeout(10000);
    await page.reload();
    
    const isDropdownVisible = await page.locator('.MuiPaper-root').isVisible();
    if (!isDropdownVisible) break;
    
    if (attempt === maxAttempts) {
      console.log(`Nie udało się zamknąć dropdownu po ${maxAttempts} próbach`);
    }
  }
};

export async function gotoWithRetry(page, url, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      if (!page || page.isClosed()) {
        throw new Error('Strona została zamknięta');
      }
      
      await page.goto(url, { 
        waitUntil: 'load'
      });
      return;
    } catch (error) {
      console.log(`Próba ${attempt}/${maxRetries} nieudana: ${error.message}`);
      
      if (attempt === maxRetries) {
        throw new Error(`Nie udało się załadować strony po ${maxRetries} próbach: ${error.message}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

export async function gotoWithoutParameter(page: Page, url: string) {
  const originalGoto = Object.getPrototypeOf(page).goto;
  await originalGoto.call(page, url);
}

export async function addTestParam(page: Page, param = 'testy-automatyczne') {
  const currentUrl = page.url();
  if (!currentUrl.includes(param)) {
    const separator = currentUrl.includes('?') ? '&' : '?';
    const newUrl = `${currentUrl}${separator}${param}`;
    await page.goto(newUrl, { waitUntil: 'domcontentloaded' });
  }
}