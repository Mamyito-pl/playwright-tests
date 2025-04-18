import { Page } from "@playwright/test";
import { isMobile } from '../utils/utility-methods.ts';

export default class FooterPage {
    private mobile: boolean;

    constructor(public page: Page) {
        this.page = page;
        const viewport = page.viewportSize();
        if (!viewport) throw new Error('Viewport is null');
        this.mobile = isMobile(viewport.width);
    }

    async getSectionTitle(titleName: string) {
        return this.page.locator('div[data-sentry-element="SectionTitle"]').getByText(titleName);
    }

    async getFooterSubTitleLink(subTitleLinkName: string) {
        return this.page.locator('div[data-sentry-element="FooterSectionWrapper"] a').getByText(subTitleLinkName, { exact: true });
    }

    get getFooterOpeninHoursInfo() {
        return this.page.locator('div[data-sentry-element="FooterSectionWrapper"] p').getByText('pon. - pt. 8.00 - 18.00', { exact: true });
    }
}