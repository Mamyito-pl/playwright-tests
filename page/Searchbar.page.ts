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
        return this.page.locator(this.mobile ? "div[data-sentry-element='TabletContent'] #search_hub_search_input" : "div[data-sentry-element='WebContent'] #search_hub_search_input");
    }

    get getSearchbarCloseButton() {
        return this.page.locator(this.mobile ? "div[data-sentry-element='TabletContent'] #search_hub_close_button:has-text('Zamknij ')" : "div[data-sentry-element='WebContent'] #search_hub_close_button:has-text('Zamknij ')");
    }

    get getSearchbarClearButton() {
        return this.page.locator(this.mobile ? "div[data-sentry-element='TabletContent'] #search_hub_clear_button:has-text('wyczyść')" : "div[data-sentry-element='WebContent'] #search_hub_clear_button:has-text('wyczyść')");
    }

    get getOurDiscountsTitle() {
        return this.page.getByText('Nasze promocje');
    }

    get getSectionShowAllLink() {
        return this.page.locator(this.mobile ? 'div[data-sentry-element="TabletContent"] div[data-sentry-element="HubContent"] div[data-sentry-element="Controls"] a[href="/promocje"]:has-text("Zobacz wszystkie")' : 'div[data-sentry-element="WebContent"] div[data-sentry-element="HubContent"] div[data-sentry-element="Controls"] a[href="/promocje"]:has-text("Zobacz wszystkie")');
    }

    get getOurDiscountsSection() {
        return this.page.locator(this.mobile ? 'div[data-sentry-element="TabletContent"] #wyszukiwarka-nasze-promocje' : 'div[data-sentry-element="WebContent"] div[data-sentry-element="HubContent"] #wyszukiwarka-nasze-promocje');
    }

    get getBigBanner() {
        return this.page.locator(this.mobile ? 'div[data-sentry-element="TabletContent"] div[data-sentry-element="HubContent"] div[data-sentry-component="BannerListing"]' : 'div[data-sentry-element="WebContent"] div[data-sentry-element="HubContent"] div[data-sentry-component="BannerListing"]');
    }

    get getSearchbarProductTiles() {
        return this.page.locator(this.mobile ? 'div[data-sentry-element="TabletContent"] div[data-testid="search-results"] div[data-sentry-component="ProductCard"]' : 'div[data-sentry-element="WebContent"] div[data-testid="search-results"] div[data-sentry-component="ProductCard"]')
    }

    get getSliderLeftButton() {
        return this.page.locator(this.mobile ? 'div[data-sentry-element="TabletContent"] div[data-sentry-element="Controls"] button svg[class="tabler-icon tabler-icon-arrow-left"]' : 'div[data-sentry-element="WebContent"] div[data-sentry-element="Controls"] button svg[class="tabler-icon tabler-icon-arrow-left"]');
    }

    get getSliderRightButton() {
        return this.page.locator(this.mobile ?'div[data-sentry-element="TabletContent"] div[data-sentry-element="Controls"] button svg[class="tabler-icon tabler-icon-arrow-right"]' : 'div[data-sentry-element="WebContent"] div[data-sentry-element="Controls"] button svg[class="tabler-icon tabler-icon-arrow-right"]');
    }
}