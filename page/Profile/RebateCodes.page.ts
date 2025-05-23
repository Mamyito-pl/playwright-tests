import { Page } from "@playwright/test";
import * as selectors from '../../utils/selectors.json';
import { isMobile } from '../../utils/utility-methods.ts';

export default class RebateCodesPage {
    private mobile: boolean;

    constructor(public page: Page) {
        this.page = page;
        const viewport = page.viewportSize();
        if (!viewport) throw new Error('Viewport is null');
        this.mobile = isMobile(viewport.width);
    }

    get getRebateCodesTitle() {
        return this.page.locator('#profile_details_delivery_addresses').getByText('Kody rabatowe');
    }

    get getRebateCodesAllFilterButton() {
        return this.page.locator('div[data-sentry-element="FilterWrapper"]').getByText('Wszystkie');
    }

    get getRebateCodesNotUsedFilterButton() {
        return this.page.locator('div[data-sentry-element="FilterWrapper"]').getByText('Niezrealizowane');
    }

    get getRebateCodesUsedFilterButton() {
        return this.page.locator('div[data-sentry-element="FilterWrapper"]').getByText('Zrealizowane', { exact: true });
    }

    get getRebateCodesNotActiveFilterButton() {
        return this.page.locator('div[data-sentry-element="FilterWrapper"]').getByText('Nieaktywne');
    }
}