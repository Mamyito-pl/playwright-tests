import { Page } from "@playwright/test";
import * as selectors from '../../utils/selectors.json';
import { isMobile } from '../../utils/utility-methods.ts';

export default class OrderDetailsPage {
    private mobile: boolean;

    constructor(public page: Page) {
        this.page = page;
        const viewport = page.viewportSize();
        if (!viewport) throw new Error('Viewport is null');
        this.mobile = isMobile(viewport.width);
    }

    get getOrdersTitle() {
        return this.page.locator('#profile_details_my_orders').getByText('Zamówienia');
    }

    get getOrdersTotal() {
        return this.page.locator('#ordersHeadline div')
    }

    get getOrderDetailsButton() {
        return this.page.locator(this.mobile ? '#profile_order_details_button' : 'svg[class="tabler-icon tabler-icon-eye"]');
    }
}