import { Page } from "@playwright/test";
import * as selectors from '../utils/selectors.json';

export default class LoginPage {

    constructor(public page: Page) {
        this.page = page;
    }

    async enterEmail(email: string) {
        await this.page.locator('#login_email').fill(email);
    }

    async enterPassword(text: string, delay = 50) {
        await this.page.locator('#login_password').fill('');
        for (let i = 0; i < text.length; i++) {
          await this.page.locator('#login_password').fill(text.slice(0, i + 1));
          await new Promise(r => setTimeout(r, delay));
        }
    }

    async clickLoginButton() {
        await this.getLoginButton.click({ force: true, delay: 300 });
    }

    get getLoginButton() {
        return this.page.locator('#login_submit_button')
    }
}