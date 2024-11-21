import { Page } from "@playwright/test";
import * as selectors from '../utils/selectors.json';

export default class NavigationPage {

    constructor(public page: Page) {
    }

    async clickNavigation() {
        await this.page.locator(selectors.NavigationPage.mainCategoryButton).first().click();
        }
    }
