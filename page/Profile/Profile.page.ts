import { Page } from "@playwright/test";

export default class ProfilePage {

    constructor(public page: Page) {
        this.page = page;
    }

    get getProfileMenuTitle() {
        return this.page.locator('#profile-menu').getByText('Profil');
    }

    get getProfileMenuLoggedUser() {
        return this.page.locator('div[data-sentry-element="LoggedInUser"]').getByText(`Zalogowany jako:${process.env.EMAIL}`);
    }

    get getProfileMenuOrdersButton() {
        return this.page.locator('#profile_orders');
    }

    get getProfileRebateCodesButton() {
        return this.page.locator('#profile_rebate_codes');
    }

    get getProfileMenuMyDetailsButton() {
        return this.page.locator('#profile_my_details');
    }

    get getProfileMenuDeliveryAddressesButton() {
        return this.page.locator('#profile_delivery_addresses');
    }

    get getProfileMenuInvoiceAddressesButton() {
        return this.page.locator('#profile_invoice_addresses');
    }

    get getProfileMenuFavouritesButton() {
        return this.page.locator('#profile_favorites');
    }

    get getProfileMenuLogOutButton() {
        return this.page.locator('#profile_logout_button');
    }
}