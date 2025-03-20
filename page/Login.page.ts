import { Page } from "@playwright/test";
import * as selectors from '../utils/selectors.json';

export default class LoginPage {

    constructor(public page: Page) {
        this.page = page;
    }

    async enterEmail(email: string) {
        await this.page.locator('#login_email').fill(email);
    }

    async enterPassword(password: string) {
        await this.page.locator('#login_password').fill(password);
    }

    async clickLoginButton() {
        await this.getLoginButton.click({ force: true });
    }

    get getLoginButton() {
        return this.page.getByRole('button', { name: 'Zaloguj się' })
    }
}