import { Page } from "@playwright/test";
import * as selectors from '../utils/selectors.json';
import { isMobile } from '../utils/utility-methods.ts';

export default class CartPage {
    private mobile: boolean;

    constructor(public page: Page) {
        this.page = page;
        const viewport = page.viewportSize();
        if (!viewport) throw new Error('Viewport is null');
        this.mobile = isMobile(viewport.width);
    }


    async clickCartPaymentConfirmationButtonButton() {
        await this.getCartPaymentConfirmationButtonButton.click({ force: true });
    }
    
    async clickCartSummaryButton() {
        return this.page.locator(this.mobile ? 'div[data-sentry-element="TabletContent"] #cart_summary_proceed_button' : '#cart-floating-div #cart_summary_proceed_button').click({ force: true, delay: 300 });
    }

    async clickCartSummaryPaymentButton() {
        return this.page.locator(this.mobile ? 'div[data-sentry-element="TabletContent"] #cart_summary_proceed_button' : '#delivery-floating-div #cart_summary_proceed_button').click({ force: true, delay: 300 });
    }

    async clickShowCartButton() {
        await this.page.click(selectors.CartPage.web.showCartButton);
    }

    async clickCartDrawerButton() {
        await this.getCartDrawerButton.click();
    }

    async clickClearCartButton() {
        await this.page.click(selectors.CartPage.common.clearCartButton);
    }

    async clickClearCartConfirmButton() {
        await this.page.click(selectors.CartPage.common.clearCartConfirmButton);
    }

    async clickDeleteProductCartIcon() {
        await this.page.click(selectors.CartPage.common.deleteProductCartIcon);
    }

    async clickDeleteProductCartConfirmButton() {
        await this.getProductCartConfirmButton.click({ force: true });
    }

    async clickIncreaseProductButton() {
        return this.page.locator(this.mobile ? 'div[data-sentry-component="CartPage"] div[data-sentry-element="TabletContent"] svg[class*="tabler-icon tabler-icon-plus"]' : 'div[data-sentry-component="CartPage"] div[data-sentry-element="InsideWrapper"] svg[class*="tabler-icon tabler-icon-plus"]').click({ force: true, delay: 300 });
    }

    async clickDecreaseProductButton() {
        return this.page.locator(this.mobile ? 'div[data-sentry-component="CartPage"] div[data-sentry-element="TabletContent"] svg[class*="tabler-icon tabler-icon-minus"]' : 'div[data-sentry-component="CartPage"] div[data-sentry-element="InsideWrapper"] svg[class*="tabler-icon tabler-icon-minus"]').click({ force: true, delay: 300 });
    }
    
    async clickCloseDrawerIconButton() {
        await this.getCartDrawerCloseIconButton.click();
    }

    async clickCartDrawerToCartButton() {
        await this.getCartDrawerToCartButton.click();
    }

    async clickCartExpandCollapseButton() {
        await this.getCartExpandCollapseButton.click();
    }

    get getCartPaymentConfirmationButtonButton() {
        return this.page.locator(this.mobile ? 'div[data-sentry-element="TabletContent"] #cart_summary_payment_confirmation' : '#payment-floating-div #cart_summary_payment_confirmation')
    }

    get getCartPaymentConfirmationDisabledButton() {
        return this.page.locator(this.mobile ? 'div[data-sentry-element="TabletContent"] #cart_summary_proceed_payment_button' : '#payment-floating-div #cart_summary_proceed_payment_button')
    }

    get getProductCartConfirmButton() {
        return this.page.locator('div[data-sentry-element="ModalContent"]').getByText('Potwierdź');
    }

    get getEmptyCartNotification() {
        return this.page.locator('div[data-sentry-component="CartProductsList"]')
    }

    get getProductList() {
        return this.page.locator(selectors.CartPage.common.productCartList);
    }

    get getProductItemCount() {
        return this.page.locator(selectors.CartPage.common.productCartListItemCount)
    }

    get getCartDrawer() {
        return this.page.locator(selectors.CartPage.common.cartDrawer)
    }

    get getCartTitle() {
        return this.page.locator(selectors.CartPage.common.cartTitle)
    }

    get getCartCodesTitle() {
        return this.page.locator(selectors.CartPage.web.cartCodesTitle)
    }

    get getCartAvailableCodesButton() {
        return this.page.locator(this.mobile ? selectors.CartPage.mobile.cartAvailableCodesButton : selectors.CartPage.web.cartAvailableCodesButton)
    }

    get getCartDrawerToCartButton() {
        return this.page.locator(selectors.CartPage.common.cartDrawerToCartButton)
    }

    get getCartSummaryButton() {
        return this.page.locator(selectors.CartPage.common.cartSummaryButton)
    }

    get getCartReturnButton() {
        return this.page.locator(selectors.CartPage.common.cartReturnButton)
    }

    get getShowCartButton() {
        return this.page.locator(selectors.CartPage.web.showCartButton)
    }

    get getClearCartButton() {
        return this.page.locator(selectors.CartPage.common.clearCartButton)
    }

    get getCartDrawerButton() {
        return this.page.locator(this.mobile ? "div[data-sentry-element='TabletContent'] [data-sentry-source-file='Navigation.tsx'] #cart_button_mobile" : "nav[data-sentry-source-file='NavigationWeb.tsx'] #cart_button")
    }

    get getCartDrawerSummaryTitle() {
        return this.page.locator(selectors.CartPage.web.cartDrawerSummaryTitle);
    }

    get getCartDrawerProductsValue() {
        return this.page.locator(selectors.CartPage.web.cartDrawerProductsValue);
    }

    get cartDrawerDeliveryCosts() {
        return this.page.locator(selectors.CartPage.web.cartDrawerDeliveryCosts);
    }

    get cartDrawerDeliveryMinimalValue() {
        return this.page.locator(selectors.CartPage.web.cartDrawerDeliveryMinimalValue);
    }

    get getCartDrawerCloseIconButton() {
        return this.page.locator('div[data-cy="cart-drawer-close-icon"]');
    }

    get getCartPaymentConfirmationButton() {
        return this.page.locator(selectors.CartPage.common.cartSummaryPaymentConfirmationButton);
    }

    get getCartPaymentButton() {
        return this.page.locator(selectors.CartPage.common.cartSummaryPaymentButton);
    }

    get getCartCodesDrawer() {
        return this.page.getByText('Kody rabatowe nie obejmują napojów alkoholowych.').locator('..');
    }

    get getActiveDiscountCodesTitle() {
        return this.page.locator('div[data-cy="active-codes-description"]')
    }

    get getSummaryDeleteDiscountCodeButton() {
        return this.page.getByRole('button', { name: 'Usuń' });
    }

    get getDiscountCodesTitle() {
        return this.page.locator('div[data-cy="cart-summary-rebate-codes"]')
    }

    get getTotalSummaryValue() {
        return this.page.locator(this.mobile ? '[data-sentry-element="TabletContent"] [data-cy="cart-summary-total-price"]' : '[data-sentry-element="SummaryColumn"] [data-cy="cart-summary-total-price"]')
    }

    get getSummaryExpandButton() {
        return this.page.locator('button[data-cy="cart-expand-button"]');
    }

    get getProductNames() {
        return this.page.locator('div[data-sentry-element="InsideWrapper"] a div[class*="sc-a15683e8-2"]');
    }

    get getProductQuantities() {
        return this.page.locator(this.mobile ? 'div[data-sentry-element="TabletContent"] div[data-sentry-element="StyledProductQuantityInput"] div input' : 'div[data-sentry-element="InsideWrapper"] div[data-sentry-element="StyledProductQuantityInput"] div input');
    }

    get getProductPrices() {
        return this.page.locator(this.mobile ? 'div[data-sentry-element="TabletContent"] #cart_unit_price b' : 'div[data-sentry-element="InsideWrapper"] #cart_unit_price b').last();;
    }

    get getCartExpandCollapseButton() {
        return this.page.locator('button[data-cy="cart-expand-button"]');
    }
}
