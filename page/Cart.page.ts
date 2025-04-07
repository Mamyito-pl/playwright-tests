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
        await this.page.click(selectors.CartPage.common.cartSummaryButton);
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
        await this.getProductCartConfirmButton.click();
    }

    async clickIncreaseProductButton() {
        return this.page.locator('div[data-sentry-component="CartPage"] button[class*="add_to_cart_increment_button"]').click({ force: true, delay: 300 });
    }

    async clickDecreaseProductButton() {
        return this.page.locator('div[data-sentry-component="CartPage"] button[class*="add_to_cart_decrement_button"]').click({ force: true, delay: 300 });
    }
    
    async clickCloseDrawerIconButton() {
        await this.getCartDrawerCloseIconButton.click();
    }

    get getCartPaymentConfirmationButtonButton() {
        return this.page.locator('#cart_summary_payment_confirmation')
    }

    get getProductCartConfirmButton() {
        return this.page.locator('div[data-sentry-element="ModalContent"]').getByText('Potwierdź');
    }

    get getEmptyCartNotification() {
        return this.page.locator(selectors.CartPage.common.emptyCartNotification)
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
        return this.page.locator(this.mobile ? "div[data-sentry-element='TabletContent'][data-sentry-source-file='Navigation.tsx'] #cart_button_mobile" : "nav[data-sentry-source-file='NavigationWeb.tsx'] #cart_button")
    }

    get getCartDrawerSummaryTitle() {
        return this.page.locator(selectors.CartPage.web.cartDrawerSummaryTitle);
    }

    get getcartDrawerProductsValue() {
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
}