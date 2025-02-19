import { Page } from "@playwright/test";
import { isMobile } from '../utils/utility-methods.ts';


export default class MenuCategories {
    private mobile: boolean;

    constructor(public page: Page) {
        this.page = page;
        const viewport = page.viewportSize();
        if (!viewport) throw new Error('Viewport is null');
        this.mobile = isMobile(viewport.width);
    }

    async clickMenuCategoriesButton() {
        return this.getMenuCategoriesButton.click();
    }

    get getMenuCategoriesButton() {
        return this.page.locator(this.mobile ? 'div[data-sentry-element="TabletContent"] div[class*="sc-4f3c45d1-0"]' : 'div[data-sentry-element="WebContent"] div[data-sentry-element="StyledWebContent"]');
    }

    get getMenuCategories() {
        return this.page.locator(this.mobile ? 'div[data-sentry-element="Column"] div[class*="sc-4f3c45d1-4"]' : 'div[maxdepth="4"] div[class*="sc-b0f70adc-9"]');
    }

    // Mobile

    async clickMenuCategoriesCloseIconButton() {
        return this.getMenuCategoriesCloseIconButton.click();
    }

    async getMenuCategoriesSubCategoryTitleMobile(subCategoryTitle: string) {
        return this.page.getByText(subCategoryTitle);
    }

    get getMenuCategoriesTitle() {
        return this.page.getByText('Wybierz kategorię');
    }

    get getMenuCategoriesCloseIconButton() {
        return this.page.locator('div[data-sentry-element="DrawerContent"] svg[data-sentry-element="IconX"]');
    }

    get getMenuCategoriesBackButton() {
        return this.page.locator('button[variant="txtOnlyBlack"]:has-text("Powrót do poprzedniej kategorii")');
    }

    get getMenuCategoriesSubCategoryAllCategoryButton() {
        return this.page.getByText('Zobacz całą kategorię');
    }

    // Web

    get getMenuCategoriesWrapper() {
        return this.page.locator('div[data-sentry-element="WebContent"] div[data-sentry-element="ListWrapper"]');
    }
}