import { Page } from "@playwright/test";
import * as selectors from '../utils/selectors.json';

export default class LoginPage {

    constructor(public page: Page) {
        this.page = page;
    }

    async enterEmail(email: string) {
        await this.page.locator(selectors.LoginPage.common.emailInput).fill(email);
    }

    async enterPassword(password: string) {
        await this.page.locator(selectors.LoginPage.common.passwordInput).fill(password);
    }

    async clickLoginButton() {
        await this.page.click(selectors.LoginPage.common.loginButton);
    }
}