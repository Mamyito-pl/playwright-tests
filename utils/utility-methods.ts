
export async function addGlobalStyles(page) {
  const cssRules = `
  div[data-sentry-element='PromptContainer'] { display: none !important; }
  #onetrust-consent-sdk { display: none !important; }
  #edrone--main--push--container { display: none !important; }
  #edrone--main--popup--container { display: none !important; }
  `;

  await page.addStyleTag({
      content: cssRules
  });
}

export const isMobile = (viewportWidth: number): boolean => {
    return viewportWidth <= 400;
};
