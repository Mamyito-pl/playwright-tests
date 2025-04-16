import { Page } from "@playwright/test";
import { isMobile } from '../utils/utility-methods.ts';

export default class BrandPage {
    private mobile: boolean;

    constructor(public page: Page) {
        this.page = page;
        const viewport = page.viewportSize();
        if (!viewport) throw new Error('Viewport is null');
        this.mobile = isMobile(viewport.width);
    }

    get getBrandTitle() {
        return this.page.locator('h1[data-sentry-element="Title"]');
    }
}