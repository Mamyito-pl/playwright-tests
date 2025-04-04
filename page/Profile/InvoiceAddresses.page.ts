import { Page } from "@playwright/test";
import * as selectors from '../../utils/selectors.json';
import { isMobile } from '../../utils/utility-methods.ts';

export default class InvoiceAddressesPage {
    private mobile: boolean;

    constructor(public page: Page) {
        this.page = page;
        const viewport = page.viewportSize();
        if (!viewport) throw new Error('Viewport is null');
        this.mobile = isMobile(viewport.width);
    }

    async clickAddNewInvoiceAddressButton() {
        await this.getAddNewInvoiceAddressButton.click({ force: true });
    }

    async clickEditInvoiceAddressButton(addressName: string) {
        return this.page.getByText(addressName).locator('..').locator('..').locator('svg[class="tabler-icon tabler-icon-pencil"]').click();
    }

    async clickDeleteInvoiceAddressButton(addressName: string) {
        return this.page.getByText(addressName).locator('..').locator('..').locator('..').locator('svg[class="tabler-icon tabler-icon-trash"]').click();
    }

    getMainInvoiceAddressInfo(addressName: string) {
        return this.page.getByText(addressName).locator('..').locator('..').locator('div[class*="sc-ad97832e-2"]');
    }

    get getCurrentMainInvoiceAddressModalInfo() {
        return this.page.getByText('Obecnie wybrany adres główny');
    }

    // Invoice Address Modal

    async clickSaveInvoiceAdressModalButton() {
        await this.getInvoiceAddressModalSaveButton.click();
    }

    async clickCancelInvoiceAdressModalButton() {
        await this.getInvoiceAddressModalCancelButton.click();
    }

    get getInvoiceAddressTitle() {
        return this.page.locator('div[data-sentry-element="Title"]').getByText('Dane do faktury');
    }

    get getAddNewInvoiceAddressButton() {
        return this.page.locator(`button:has-text('Dodaj nowy podmiot')`)
    }

    get getInvoiceAddressModal() {
        return this.page.locator('div[data-cy="add-delivery-address-modal"]');
    }

    get getInvoiceAddressModalCloseIcon() {
        return this.page.locator(selectors.DeliveryPage.common.AddressModalCloseIcon);
    }

    get getInvoiceAddressModalSaveButton() {
        return this.page.getByRole('button', { name: 'Zapisz' });
    }

    get getInvoiceAddressModalCancelButton() {
        return this.page.getByText('Anuluj');
    }

    get getInvoiceAddressModalConfirmationButton() {
        return this.page.locator(`button:has-text("Potwierdź")`);
    }

    getInvoiceAddressModalDeleteAddressName(addressName: string) {
        return this.page.locator(`div[data-sentry-element="Modal"] div[data-sentry-element="AddressName"]:has-text("${addressName}")`);
    }

    get getInvoiceAddressModalMainAddressCheckbox() {
        return this.page.locator('#invoice_address_default label span');
    }

    get getInvoiceAddressModalAddressName() {
        return this.page.locator('#invoice_address_name');
    }

    get getInvoiceAddressModalAddressSearchAddress() {
        return this.page.locator('#:rku:');
    }

    get getInvoiceAddressModalCompanyName() {
        return this.page.locator('#invoice_address_company_name');
    }

    get getInvoiceAddressModalNIP() {
        return this.page.locator('#invoice_address_tax');
    }

    get getInvoiceAddressModalUserPostalCode() {
        return this.page.locator('#invoice_address_postal');
    }

    get getInvoiceAddressModalUserCity() {
        return this.page.locator('#invoice_address_city');
    }

    get getInvoiceAddressModalUserStreet() {
        return this.page.locator('#invoice_address_street');
    }

    get getInvoiceAddressModalUserHouseNumber() {
        return this.page.locator('#invoice_address_house_number');
    }

    get getInvoiceAddressModalUserFlatNumber() {
        return this.page.locator('#invoice_address_flat_number');
    }
}