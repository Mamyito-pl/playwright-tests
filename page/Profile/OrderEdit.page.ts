import { Page } from "@playwright/test";
import * as selectors from '../../utils/selectors.json';
import { isMobile } from '../../utils/utility-methods.ts';

export default class OrderEditPage {
    private mobile: boolean;

    constructor(public page: Page) {
        this.page = page;
        const viewport = page.viewportSize();
        if (!viewport) throw new Error('Viewport is null');
        this.mobile = isMobile(viewport.width);
    }

    async clickApplyEditOrderModalButton() {
        return this.getApplyEditOrderModalButton.click();
    }

    async clickApplyEditOrderCartButton() {
        return this.getApplyEditOrderCartButton.click();
    }

    async clickCancelEditOrderModalButton() {
        return this.getCancelEditOrderModalButton.click();
    }

    async clickCancelEditOrderCartButton() {
        return this.getCancelEditOrderCartButton.click();
    }

    async clickConfirmationEditOrderCancelCartModalCancelButton() {
        return this.getConfirmationEditOrderCancelCartModalCancelButton.click();
    }

    async clickConfirmationEditOrderCancelCartModalLeaveButton() {
        return this.getConfirmationEditOrderCancelCartModalLeaveButton.click();
    }

    async clickConfirmationEditOrderCartModalCancelButton() {
        return this.getConfirmationEditOrderCartModalCancelButton.click();
    }

    get getEditOrderModalTitle() {
        return this.page.locator('div[data-sentry-element="Modal"] div').first().getByText('Edycja zamówienia');
    }

    get getOrdersTotal() {
        return this.page.locator('#ordersHeadline div')
    }

    get getOrderDetailsButton() {
        return this.page.locator(this.mobile ? '#profile_order_details_button' : 'svg[class="tabler-icon tabler-icon-eye"]');
    }

    get getApplyEditOrderModalButton() {
        return this.page.locator('#repeat_order_add_products_button');
    }

    get getCancelEditOrderModalButton() {
        return this.page.locator('#repeat_order_cancel_button');
    }

    get getApplyEditOrderCartButton() {
        return this.page.getByRole('button', { name: 'Zatwierdź edycję'});
    }

    get getCancelEditOrderCartButton() {
        return this.page.getByRole('button', { name: 'Anuluj edycję'});
    }

    get getConfirmationEditOrderCartModalTitle() {
        return this.mobile ? this.page.locator('#modal-portal').getByText('Zapisz zmiany').nth(0) : this.page.locator('#modal-portal').getByText('Zapisz zmiany').nth(1);
    }

    get getConfirmationEditOrderCartModalCancelButton() {
        return this.mobile ? this.page.locator('#modal-portal').getByText('Anuluj').nth(0) : this.page.locator('#modal-portal').getByText('Anuluj').nth(1);
    }

    get getConfirmationEditOrderCancelCartModalTitle() {
        return this.mobile ? this.page.locator('#modal-portal').getByText('Anuluj edycję').nth(0) : this.page.locator('#modal-portal').getByText('Anuluj edycję').nth(1);
    }

    get getConfirmationEditOrderCancelCartModalCancelButton() {
        return this.mobile ? this.page.locator('#modal-portal').getByRole('button', { name: 'Anuluj'}).nth(0) : this.page.locator('#modal-portal').getByRole('button', { name: 'Anuluj'}).nth(1);
    }

    get getConfirmationEditOrderCancelCartModalLeaveButton() {
        return this.mobile ? this.page.locator('#modal-portal').getByRole('button', { name: 'Wyjdź'}).nth(0) : this.page.locator('#modal-portal').getByRole('button', { name: 'Wyjdź'}).nth(1);
    }

    get getConfirmationEditOrderModal() {
        return this.page.locator('#modal-portal')
    }

    get getEnterBlikCodeModalTitle() {
        return this.page.locator('div[data-sentry-element="Modal"]').getByText('Wpisz kod BLIK');
    }

    get getEnterBlikCodeModalInput() {
        return this.page.locator('div[data-sentry-element="Modal"] input');
    }

    get getEnterBlikCodeModalPayButton() {
        return this.page.locator('div[data-sentry-element="Modal"]').getByRole('button', { name: 'Zapłać'});
    }
}