import { Page } from "@playwright/test";
import * as selectors from '../utils/selectors.json';
import { isMobile } from '../utils/utility-methods.ts';
import { title } from "process";

export default class NonLoggedUserPage {
    private mobile: boolean;

    constructor(public page: Page) {
        this.page = page;
        const viewport = page.viewportSize();
        if (!viewport) throw new Error('Viewport is null');
        this.mobile = isMobile(viewport.width);
    }

    async clickPostalCodeModalButton() {
        await this.getPostalCodeModalButton.click();
    }

    get getDeliveryAvailableLink() {
        return this.page.getByText('Dostępność dostawy')
    }

    get getDeliveryAvailableIcon() {
        return this.page.locator('svg[data-cy="delivery-no-user-icon"]')
    }

    get getLoginLink() {
        return this.mobile ? this.page.locator('div[data-cy="login-button"]').getByText('Logowanie') : this.page.getByRole('link', { name: 'Logowanie' }) 
    }

    get getRegisterLink() {
        return this.page.getByRole('link', { name: 'Rejestracja' })
    }

    get getPostalCodeModalTitle() {
        return this.page.locator('div[data-sentry-component="CheckPostalCodeModal"]').getByText('Podaj swój kod pocztowy')
    }

    get getPostalCodeModalInput() {
        return this.page.locator('#postal_code_area_check')
    }

    get getPostalCodeModalButton() {
        return this.page.locator('#postal_code_area_check_button')
    }

    get getLoginModalTitle() {
        return this.page.locator('div[data-sentry-element="Modal"]').filter({ hasText: 'Zaloguj się' })
    }
}