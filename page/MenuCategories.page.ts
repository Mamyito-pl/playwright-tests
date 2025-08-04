import { Page } from "@playwright/test";
import { isMobile } from '../utils/utility-methods.ts';


export default class MenuCategoriesPage {
    private mobile: boolean;

    constructor(public page: Page) {
        this.page = page;
        const viewport = page.viewportSize();
        if (!viewport) throw new Error('Viewport is null');
        this.mobile = isMobile(viewport.width);
    }

    async clickMenuCategoriesButton() {
        return this.getMenuCategoriesButton.click({ force: true, delay: 100 });
    }

    get getMenuCategoriesButton() {
        return this.page.locator(this.mobile ? 'div[data-sentry-element="TabletContent"] div[data-sentry-element="StyledTabletContent"] svg[class*="tabler-icon tabler-icon-menu-2"]' : 'div[data-sentry-element="WebContent"] div[data-sentry-element="StyledWebContent"]');
    }

    get getMenuCategories() {
        return this.page.locator(this.mobile ? 'li[data-cy=category-menu-item-mobile]' : 'li[role="treeitem"]');
    }

    // Mobile

    async clickMenuCategoriesCloseIconButton() {
        return this.getMenuCategoriesCloseIconButton.click();
    }

    async getMenuCategoriesSubCategoryTitleMobile(subCategoryTitle: string) {
        return this.page.locator('div[data-sentry-element="Column"]').getByText(subCategoryTitle, { exact: true });
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

    get getMenuCategoriesSubCategoryTitleWeb() {
        return this.page.getByTestId('category-title');
    }
}