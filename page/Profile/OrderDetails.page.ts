import { Page } from "@playwright/test";
import * as selectors from '../../utils/selectors.json';
import { isMobile } from '../../utils/utility-methods.ts';

export default class OrderDetailsPage {
    private mobile: boolean;

    constructor(public page: Page) {
        this.page = page;
        const viewport = page.viewportSize();
        if (!viewport) throw new Error('Viewport is null');
        this.mobile = isMobile(viewport.width);
    }

    async clickPayButton() {
        await this.page.click(selectors.OrderDetailsPage.common.PayButton);
    }

    async clickCancelOrderButton() {
        await this.getCancelOrderButton.click();
    }

    async clickRepeatOrderButton() {
        await this.getRepeatOrderButton.click();
    }

    async clickBackToOrdersButton() {
        await this.getBackToOrdersButton.click();
    }
    
    get getPrintOrderButton() {
        return this.page.getByRole('button', { name: 'Wydrukuj'});
    }

    get getOrderNumber() {
        return this.page.locator('div[data-sentry-element="OrderNumber"]');
    }

    get getBackToOrdersButton() {
        return this.page.locator(selectors.OrderDetailsPage.common.backToOrdersButton);
    }

    get getRepeatOrderButton() {
        return this.page.locator(selectors.OrderDetailsPage.common.repeatOrderButton);
    }

    get getCancelOrderButton() {
        return this.page.locator(selectors.OrderDetailsPage.common.cancelOrderButton);
    }

    get getPayButton() {
        return this.page.locator(selectors.OrderDetailsPage.common.PayButton);
    }

    get getCancelOrderModal() {
        return this.page.locator('div[data-sentry-element="Modal"]')
    }

    get getCancelConfirmationButton() {
        return this.page.locator('#modal-portal div div').getByRole('button', { name: 'Potwierdź'});
    }

    get getProductNames() {
        return this.page.locator('div[data-sentry-element="ProductName"]');
    }

    get getRepeatOrderModal() {
        return this.page.locator('div[data-sentry-element="Modal"] div[data-sentry-element="ProductName"]');
    }

    get getRepeatOrderModalProductNames() {
        return this.page.locator('div[data-sentry-element="Modal"] div[data-sentry-element="ProductName"]');
    }

    get getRepeatOrderModalAddProductsButton() {
        return this.page.locator('#repeat_order_add_products_button')
    }

    get getRepeatOrderModalCancelButton() {
        return this.page.locator('#repeat_order_cancel_button')
    }

    async getDetailsSectionName(sectionName: string) {
        return this.page.locator('div[data-sentry-element="SectionTitle"]').getByText(sectionName);
    }
}