import { expect } from "@playwright/test";

export async function addGlobalStyles(page) {
  const cssRules = `
  div[data-sentry-element='PromptContainer'] { display: none !important; }
  #onetrust-consent-sdk { display: none !important; }
  #edrone--main--push--container { display: none !important; }
  #edrone--main--popup--container { display: none !important; }
  div[data-sentry-component="ExternalWidget"] { display: none !important; }
  `;

  try {
    await page.waitForSelector('body', { visible: true });
    await page.addStyleTag({ content: cssRules });
  } catch {
  }
}

export const isMobile = (viewportWidth: number): boolean => {
    return viewportWidth <= 400;
};
