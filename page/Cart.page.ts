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

    async clickShowCartButton() {
        await this.page.click(selectors.CartPage.web.showCartButton);
    }

    async clickCartButton() {
        await this.page.click(this.mobile ? selectors.CartPage.mobile.cartButton : selectors.CartPage.web.cartButton);
    }

    async clickClearCartButton() {
        await this.page.click(selectors.CartPage.common.clearCartButton);
    }

    async clickClearCartConfirmButton() {
        await this.page.click(selectors.CartPage.common.clearCartConfirmButton);
    }

    async clickDeleteProductCartIcon() {
        await this.page.click(selectors.CartPage.web.deleteProductCartIcon);
    }

    async clickDeleteProductCartDecreaseConfirmButton() {
        await this.page.click(selectors.CartPage.common.deleteProductConfirmButton)
    }

    async clickIncreaseProductButton() {
        await this.page.click(selectors.CartPage.common.productCartIncreaseButton);
    }

    async clickDecreaseProductButton() {
        await this.page.click(selectors.CartPage.common.productCartDecreaseButton);
    }
    async clickCloseDrawerIconButton() {
        await this.page.click(selectors.CartPage.common.cartCloseIconButton);
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
        return this.page.locator(selectors.CartPage.common.cartCloseIconButton);
    }
}