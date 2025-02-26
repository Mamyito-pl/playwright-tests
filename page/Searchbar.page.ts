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
        await this.getSearchbarInput.fill(product);
    }

    async clickSearchbar() {
        await this.getSearchbarInput.click();
    }

    async clickIncreaseProductButton() {
        return this.page.locator(selectors.Searchbar.common.searchbarProductCardIncreaseButton).click();
    }

    async clickDecreaseProductButton() {
        return this.page.locator(selectors.Searchbar.common.searchbarProductCardDecreaseButton).click();
    }

    get getProductItemCount() {
        return this.page.locator(selectors.Searchbar.common.searchbarProductItemCount);
    }

    get getSearchbarInput() {
        return this.page.locator(this.mobile ? "div[data-sentry-element='TabletContent'] #search_hub_search_input" : "div[data-sentry-element='WebContent'] #search_hub_search_input")
    }

    get getSearchbarCloseButton() {
        return this.page.locator(this.mobile ? "div[data-sentry-element='TabletContent'] #search_hub_close_button" : "div[data-sentry-element='WebContent'] #search_hub_close_button")
    }
}