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
        await this.getAddNewInvoiceAddressButton.click({ force: true, delay: 300 });
    }

    async clickEditInvoiceAddressButton(addressName: string) {
        return this.page.getByText(addressName).locator('..').locator('..').locator('svg[class*="tabler-icon tabler-icon-pencil "]').click();
    }

    async clickDeleteInvoiceAddressButton(addressName: string) {
        return this.page.getByText(addressName).locator('..').locator('..').locator('..').locator('svg[class*="tabler-icon tabler-icon-trash "]').click();
    }

    async clickCompanyInvoiceButton() {
        await this.getCompanyInvoiceButton.click({ force: true, delay: 300 });
    }

    async clickPersonalInvoiceButton() {
        await this.getPersonalInvoiceButton.click({ force: true, delay: 300 });
    }

    async selectInvoiceAddressType(type: string) {
        await this.getInvoiceAddressTypeDropdown.click({ force: true, delay: 300 });
        await this.page.waitForTimeout(2000);
        await this.getInvoiceAddressModal.getByText(type).click({ force: true, delay: 300 });
    }

    getMainInvoiceAddressInfo(addressName: string) {
        return this.page.getByText(addressName).locator('..').locator('..').locator('div[data-cy="default-info-tag"]');
    }

    get getCurrentMainInvoiceAddressModalInfo() {
        return this.page.getByText('Obecnie wybrany adres główny');
    }

    get getCompanyInvoiceButton() {
        return this.page.locator('#faktury-firmowe');
    }

    get getPersonalInvoiceButton() {
        return this.page.locator('#faktury-imienne');
    }

    get getInvoiceAddressTypeDropdown() {
        return this.page.locator('#invoice_address_type');
    }

    async EmptyCompanyInvoicesListNotificationIsVisible() {
        return this.page.getByText('Nie dodano jeszcze żadnych danych do faktury firmowej.').isVisible();
    }

    async EmptyPersonalInvoicesListNotificationIsVisible() {
        return this.page.getByText('Nie dodano jeszcze żadnych danych do faktury imiennej.').isVisible();
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
        return this.page.locator('div[data-sentry-element="Modal"]');
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

    get getPersonalInvoiceAddressModalAddressFirstName() {
        return this.page.locator('#invoice_address_first_name');
    }

    get getPersonalInvoiceAddressModalAddressLastName() {
        return this.page.locator('#invoice_address_last_name');
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