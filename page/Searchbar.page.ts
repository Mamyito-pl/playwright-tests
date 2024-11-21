import { Page } from "@playwright/test";
import * as selectors from '../utils/selectors.json';
import { isMobile } from '../utils/utility-methods.ts';


export default class SearchbarPage {
    private mobile: boolean;

    constructor(public page: Page) {
        this.page = page;
        const viewport = page.viewportSize();
        if (!viewport) throw new Error('Viewport is null');
        this.mobile = isMobile(viewport.width);
    }

    async enterProduct(product: string) {
        await this.page.locator(this.mobile ? selectors.Searchbar.mobile.searchbarInput : selectors.Searchbar.web.searchbarInput).fill(product);
    }

    async clickSearchbar() {
        await this.page.click(this.mobile ? selectors.Searchbar.mobile.searchbarInput : selectors.Searchbar.web.searchbarInput);
    }

    async clickIncreaseProductButton() {
        return this.page.locator(selectors.Searchbar.common.searchbarProductCardIncreaseButton).click()
    }

    async clickDecreaseProductButton() {
        return this.page.locator(selectors.Searchbar.common.searchbarProductCardDecreaseButton).click()
    }

    get getProductItemCount() {
        return this.page.locator(selectors.Searchbar.common.searchbarProductItemCount)
    }
}