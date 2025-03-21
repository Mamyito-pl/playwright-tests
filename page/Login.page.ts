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
        await this.page.locator('#login_password').type(password, { delay: 50 });
    }

    async clickLoginButton() {
        await this.getLoginButton.click();
    }

    get getLoginButton() {
        return this.page.locator('#login_submit_button')
    }
}