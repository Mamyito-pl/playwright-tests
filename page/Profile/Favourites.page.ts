import { Page } from "@playwright/test";
import { isMobile } from '../../utils/utility-methods.ts';

export default class FavouritesPage {
    private mobile: boolean;

    constructor(public page: Page) {
        this.page = page;
        const viewport = page.viewportSize();
        if (!viewport) throw new Error('Viewport is null');
        this.mobile = isMobile(viewport.width);
    }

    get getFavouritesProdutsTitle() {
        return this.page.locator('div[id="profile_details_favourites"]:has-text("Ulubione produkty")');
    }

}