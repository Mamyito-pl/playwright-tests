import { Page } from "@playwright/test";
import * as selectors from '../../utils/selectors.json';
import { isMobile } from '../../utils/utility-methods.ts';

export default class DeliveryAdressesPage {
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

    async clickEditAddressButton(addressName: string) {
        return this.page.getByText(addressName).locator('..').locator('..').locator('div').locator('div').locator('svg[class="tabler-icon tabler-icon-pencil"]').click();
    }

    async clickDeleteAddressButton(addressName: string) {
        return this.page.getByText(addressName).locator('..').locator('..').locator('div').locator('div').locator('svg[class="tabler-icon tabler-icon-trash"]').click();
    }

    get getAddNewAddressButton() {
        return this.page.getByText('Dodaj nowy adres');
    }

    get getDeliveryAddressesTitle() {
        return this.page.locator('#profile_details_delivery_addresses:has-text("Adresy dostaw")');
    }

    get getCurrentMainAddressModalInfo() {
        return this.page.getByText('Obecnie wybrany adres główny');
    }

    getMainAddressInfo(addressName: string) {
        return this.page.getByText(addressName).locator('..').locator('..').locator('div[data-cy="default-info-tag"]');
    }

    // Address Modal

    async clickSaveAdressModalButton() {
        await this.getAddressModalSaveButton.click();
    }

    async clickCancelAdressModalButton() {
        await this.getAddressModalCancelButton.click();
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
        return this.page.locator(`div[data-sentry-element="Modal"] div[data-sentry-element="AddressName"]:has-text("${addressName}")`);
    }

    get getAddressModal() {
        return this.page.locator('div[data-sentry-element="Modal"]');
    }

    get getAddressModalMainAddressCheckbox() {
        return this.page.locator('#delivery_address_default label span');
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
        return this.page.locator('#delivery_address_client_delivery_notes');
    }
}