import { Page, expect } from "@playwright/test";
import * as selectors from '../utils/selectors.json';
import { isMobile } from '../utils/utility-methods.ts';
import CommonPage from './Common.page.ts';

export default class PaymentsPage {
    private mobile: boolean;
    private commonPage: CommonPage;

    constructor(public page: Page) {
        this.page = page;
        this.commonPage = new CommonPage(page);
        
        const viewport = page.viewportSize();
        if (!viewport) throw new Error('Viewport is null');
        this.mobile = isMobile(viewport.width);
    }

    
    async clickOrderDetailsButton() {
        await this.page.click(selectors.PaymentsPage.common.orderDetailsButton);
    }

    async clickPaymentOnDeliveryButton() {
        await this.page.click(selectors.PaymentsPage.common.paymentOnDeliveryButton);
    }

    async clickRepeatPaymentButton() {
        await this.page.click(selectors.PaymentsPage.common.repeatPaymentButton);
    }

    async clickRepeatOrderButton() {
        await this.page.click(selectors.PaymentsPage.common.repeatOrderButton);
    }

    async clickBackHomeButton() {
        await this.page.click(selectors.PaymentsPage.common.backHomeButton);
    }

    async checkStatue() {
        await this.getStatueCheckbox.check();
    }

    async enterBlikCode(blikCode: string) {
        await this.page.locator(selectors.PaymentsPage.common.blikPaymentInput).fill(blikCode);
    }

    async waitForLoaderAndSelectPaymentMethod(paymentMethod: string) {
      if (await this.commonPage.getLoader.isVisible({ timeout: 5000 })) {
        await expect(this.commonPage.getLoader).toBeHidden({ timeout: 10000 });
        await this.page.getByText(paymentMethod, { exact: true }).click({ force: true });
      } else {
        await this.page.getByText(paymentMethod, { exact: true }).click({ force: true });
      }
    }

    get getOrderNumber() {
        return this.page.locator('div[data-sentry-element="OrderNumber"] span');
    }

    get getOrderDetailsButton() {
        return this.page.locator(selectors.PaymentsPage.common.orderDetailsButton)
    }

    get getRepeatOrderButton() {
        return this.page.locator(selectors.PaymentsPage.common.repeatOrderButton)
    }

    get getBackHomeButton() {
        return this.page.locator(selectors.PaymentsPage.common.backHomeButton)
    }

    get getRepeatPaymentButton() {
        return this.page.locator(selectors.PaymentsPage.common.repeatPaymentButton)
    }

    get getPaymentOnDeliveryButton() {
        return this.page.locator(selectors.PaymentsPage.common.paymentOnDeliveryButton)
    }

    get getBlikTextboxPlaceholder() {
        return this.page.locator(selectors.PaymentsPage.common.blikTextboxPlaceholder);
    }

    get getBlikTextboxHelperText() {
        return this.page.locator('#blikCode-helper-text');
    }

    get getStatueCheckbox() {
        return this.page.getByText('Akceptuję').locator('..').locator('span');
    }

    get getCloseIconButtonRepeatOrderWindow() {
        return this.page.locator(selectors.PaymentsPage.common.closeIconButtonRepeatOrderWindow);
    }

    get getAddProductsButtonRepeatOrderWindow() {
        return this.page.locator(selectors.PaymentsPage.common.addProductsButtonRepeatOrderWindow);
    }

    get getCancelButtonRepeatOrderWindow() {
        return this.page.locator(selectors.PaymentsPage.common.cancelButtonRepeatOrderWindow);
    }
}