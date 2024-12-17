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

    async clickDeliverySlotButton() {
        await this.page.click(selectors.DeliveryPage.common.deliverySlot);
    }

    get getDeliverySlotButton() {
        return this.page.locator(selectors.DeliveryPage.common.deliverySlot).first();
    }
}