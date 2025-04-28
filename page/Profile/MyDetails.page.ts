import { title } from 'process';
import { Page } from "@playwright/test";
import { isMobile } from '../../utils/utility-methods.ts';

export default class MyDetailsPage {
    private mobile: boolean;

    constructor(public page: Page) {
        this.page = page;
        const viewport = page.viewportSize();
        if (!viewport) throw new Error('Viewport is null');
        this.mobile = isMobile(viewport.width);
    }

    async clickNameSurnameEditButton() {
        await this.getNameSurnameEditButton.click();
    }
    
    async clickDateBirthEditButton() {
        await this.getDateBirthEditButton.click();
    }

    async clickPhoneNumberEditButton() {
        await this.getPhoneNumberEditButton.click();
    }

    async clickEmailEditButton() {
        await this.getEmailEditButton.click();
    }

    async clickPasswordEditButton() {
        await this.getPasswordEditButton.click();
    }

    async clickDeleteAccountButton() {
        await this.getDeleteAccountButton.click();
    }

    async getModal(titleName: string) {
        return this.page.locator('div[data-sentry-element="Modal"]').getByText(titleName);
    }

    async clickModalSaveButton() {
        return this.getModalSaveButton.click();
    }

    async clickModalConfirmButton() {
        return this.getModalConfirmButton.click();
    }

    async clickNewsletterApprovalSwitch() {
        await this.getNewsletterApprovalSwitch.click();
    }

    async clickSMSApprovalSwitch() {
        await this.getSMSApprovalSwitch.click();
    }

    // Modal inputs

    get getModalNameInput() {
        return this.page.locator('#user_name_update_first_name')
    }

    get getModalSurnameInput() {
        return this.page.locator('#user_name_update_last_name')
    }

    get getModalBirthDateInput() {
        return this.page.locator('#DoB_form_edit_button')
    }

    get getModalPhoneNumberInput() {
        return this.page.locator('#phone_update_new_number')
    }

    get getModalCurrentPasswordInput() {
        return this.page.locator('#password_update_current_password')
    }

    get getModalNewPasswordInput() {
        return this.page.locator('#password_update_new_password')
    }

    get getModalNewPasswordConfirmationInput() {
        return this.page.locator('#password_update_new_password_confirmation')
    }

    get getModalSaveButton() {
        return this.page.locator('div[data-sentry-element="Modal"]').locator('..').locator('..').locator('button[id="DoB_save_button"]');
    }

    get getModalConfirmButton() {
        return this.page.locator('div[data-sentry-element="Modal"]').getByRole('button', { name: 'Potwierdź' });
    }

    // My Details Page

    get getMyDetailsTitle() {
        return this.page.locator('#profile_details_my_data').getByText('Moje dane');
    }

    get getNameSurnameLabel() {
        return this.page.locator('#profile_edit_name div[data-sentry-element="DetailsLabel"]').getByText('Imię i nazwisko');
    }

    get getNameSurnameContent() {
        return this.page.locator('#profile_edit_name div[data-sentry-element="DetailsValue"]')
    }

    get getDateBirthLabel() {
        return this.page.locator('#profile_edit_DoB div[data-sentry-element="DetailsLabel"]').getByText('Data urodzenia');
    }

    get getDateBirthContent() {
        return this.page.locator('#profile_edit_DoB div[data-sentry-element="DetailsValue"]')
    }

    get getPhoneNumberLabel() {
        return this.page.locator('#profile_edit_phone div[data-sentry-element="DetailsLabel"]').getByText('Numer telefonu');
    }

    get getPhoneNumberContent() {
        return this.page.locator('#profile_edit_phone div[data-sentry-element="DetailsValue"]')
    }

    get getEmailLabel() {
        return this.page.locator('#profile_edit_email div[data-sentry-element="DetailsLabel"]').getByText('email');
    }

    get getPasswordLabel() {
        return this.page.locator('#profile_edit_password div[data-sentry-element="DetailsLabel"]').getByText('Hasło');
    }

    get getDeleteAccountLabel() {
        return this.page.locator('#profile_edit_account_removal div[data-sentry-element="InfoText"]').getByText('Usunięcie konta');
    }

    get getNewsletterApprovalLabel() {
        return this.page.locator('div[data-sentry-component="UserNewsletterConsent"] div').getByText('Zgoda na komunikację marketingową poprzez newsletter');
    }

    get getSMSApprovalLabel() {
        return this.page.locator('div[data-sentry-component="UserSMSConsent"] div').getByText('Zgoda na komunikację marketingową poprzez SMS');
    }

    get getNameSurnameEditButton() {
        return this.getNameSurnameLabel.locator('..').locator('..').locator('button');
    }

    get getDateBirthEditButton() {
        return this.getDateBirthLabel.locator('..').locator('..').locator('button');
    }

    get getPhoneNumberEditButton() {
        return this.getPhoneNumberLabel.locator('..').locator('..').locator('button');
    }

    get getEmailEditButton() {
        return this.getEmailLabel.locator('..').locator('..').locator('button');
    }

    get getPasswordEditButton() {
        return this.getPasswordLabel.locator('..').locator('..').locator('button');
    }

    get getDeleteAccountButton() {
        return this.getDeleteAccountLabel.locator('..').locator('..').locator('button');
    }

    get getNewsletterApprovalSwitch() {
        return this.page.locator('div[data-sentry-component="UserNewsletterConsent"] input')
    }

    get getSMSApprovalSwitch() {
        return this.page.locator('div[data-sentry-component="UserSMSConsent"] input')
    }
}