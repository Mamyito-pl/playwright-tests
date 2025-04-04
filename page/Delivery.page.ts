import { Page } from "@playwright/test";
import * as selectors from '../utils/selectors.json';
import { isMobile } from '../utils/utility-methods.ts';

export default class DeliveryPage {
    private mobile: boolean;

    constructor(public page: Page) {
        this.page = page;
        const viewport = page.viewportSize();
        if (!viewport) throw new Error('Viewport is null');
        this.mobile = isMobile(viewport.width);
    }

    async clickAddNewAddressButton() {
        await this.getAddNewAddressButton.click();
    }

    async clickAddNewInvoiceAddressButton() {
        await this.getAddNewInvoiceAddressButton.click({ force: true });
    }

    async clickEditAddressButton(addressName: string) {
        return this.page.getByText(addressName).locator('..').locator('..').locator('..').locator('div').locator('div').locator('svg[class="tabler-icon tabler-icon-pencil"]').click();
    }

    async clickEditInvoiceAddressButton(addressName: string) {
        return this.page.getByText(addressName).locator('..').locator('..').locator('..').locator('svg[class="tabler-icon tabler-icon-pencil"]').click();
    }

    async clickDeleteAddressButton(addressName: string) {
        return this.page.getByText(addressName).locator('..').locator('..').locator('..').locator('div').locator('div').locator('svg[class="tabler-icon tabler-icon-trash"]').click();
    }

    async clickDeleteInvoiceAddressButton(addressName: string) {
        return this.page.getByText(addressName).locator('..').locator('..').locator('..').locator('svg[class="tabler-icon tabler-icon-trash"]').click();
    }

    get getDeliverySlotButton() {
        return this.page.locator(selectors.DeliveryPage.common.deliverySlot);
    }

    get getDeliveryAddressTitle() {
        return this.page.locator('div[data-sentry-element="Title"]').getByText('Adres dostawy');
    }

    get getInvoiceAddressTitle() {
        return this.page.getByText('Dane podmiotu');
    }

    get getDeliveryAddressSubTitle() {
        return this.page.getByText('Wybierz adres dostawy lub dodaj nowy');
    }

    get getAddNewAddressButton() {
        return this.page.getByText('Dodaj nowy adres');
    }

    get getAddNewInvoiceAddressButton() {
        return this.page.locator(`button:has-text('Dodaj nowy podmiot')`)
    }

    get getDeliveryInvoiceCheckbox() {
        return this.page.locator('span[data-sentry-element="CheckboxMark"]');
    }

    get getDeliveryDateTitle() {
        return this.page.locator('div[data-sentry-element="Title"]').getByText('Termin dostawy');
    }

    // Address/Invoice Modal

    async clickSaveAdressModalButton() {
        await this.getAddressModalSaveButton.click();
    }

    get getAddressModalCloseIcon() {
        return this.page.locator(selectors.DeliveryPage.common.AddressModalCloseIcon);
    }

    get getAddressModalSaveButton() {
        return this.page.getByRole('button', { name: 'Zapisz' });
    }

    get getAddressModalCancelButton() {
        return this.page.getByText('Anuluj');
    }

    get getAddressModalConfirmationButton() {
        return this.page.locator(`button:has-text("Potwierdź")`);
    }

    getAddressModalDeleteAddressName(addressName: string) {
        return this.page.locator(`div[data-cy="add-delivery-address-modal"] div[data-sentry-element="AddressName"]:has-text("${addressName}")`);
    }


    // Address Modal

    get getAddressModal() {
        return this.page.locator('div[data-cy="add-delivery-address-modal"]');
    }

    get getAddressModalAddressName() {
        return this.page.locator('#delivery_address_name');
    }

    get getAddressModalAddressSearchAddress() {
        return this.page.locator('#:r16:');
    }

    get getAddressModalUserName() {
        return this.page.locator('#delivery_address_first_name');
    }

    get getAddressModalUserSurname() {
        return this.page.locator('#delivery_address_last_name');
    }

    get getAddressModalUserPhoneNumber() {
        return this.page.locator('#delivery_address_phone');
    }

    get getAddressModalUserPostalCode() {
        return this.page.locator('#delivery_address_postal');
    }

    get getAddressModalUserCity() {
        return this.page.locator('#delivery_address_city');
    }

    get getAddressModalUserStreet() {
        return this.page.locator('#delivery_address_street');
    }

    get getAddressModalUserHouseNumber() {
        return this.page.locator('#delivery_address_house_number');
    }

    get getAddressModalUserStaircase() {
        return this.page.locator('#delivery_address_staircase');
    }

    get getAddressModalUserFlatNumber() {
        return this.page.locator('#delivery_address_flat_number');
    }

    get getAddressModalUserFloor() {
        return this.page.locator('#delivery_address_floor');
    }

    get getAddressModalUserDeliveryNotes() {
        return this.page.locator('#delivery_address_floor');
    }

    // Invoice Address Modal

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