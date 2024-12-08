import { expect } from "@playwright/test";

export async function addGlobalStyles(page) {
  const cssRules = `
  div[data-sentry-element='PromptContainer'] { display: none !important; }
  #onetrust-consent-sdk { display: none !important; }
  #edrone--main--push--container { display: none !important; }
  #edrone--main--popup--container { display: none !important; }
  div[class="tm-lemur-sticker-mobile mobile-left-3 size-mobile-medium mobile-position tm-slideModal-change-status-on-mouseclick"]
  div[class="tm-lemur-position left-2"]
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
