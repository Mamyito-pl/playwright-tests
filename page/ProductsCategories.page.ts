import { Page } from "@playwright/test";
import * as selectors from '../utils/selectors.json';
import { isMobile } from '../utils/utility-methods.ts';

export default class ProductsCategoriesPage {
    private mobile: boolean;

    constructor(public page: Page) {
        const viewport = page.viewportSize();
        if (!viewport) throw new Error('Viewport is null');
        this.mobile = isMobile(viewport.width);
    }


    get getProductsCategoriesTitle() {
        return this.page.getByText('Kategorie produktów');
    }

    get getProductsCategoriesTiles() {
        return this.page.locator('div[class*="bNVRiV"]');
    }
}