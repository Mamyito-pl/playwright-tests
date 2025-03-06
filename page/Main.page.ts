import { Page } from "@playwright/test";
import * as selectors from '../utils/selectors.json';
import { isMobile } from '../utils/utility-methods.ts';
import { title } from "process";

export default class MainPage {
    private mobile: boolean;

    constructor(public page: Page) {
        this.page = page;
        const viewport = page.viewportSize();
        if (!viewport) throw new Error('Viewport is null');
        this.mobile = isMobile(viewport.width);
    }

    get getLogo() {
        return this.page.locator(this.mobile ? 'div[data-sentry-element="TabletContent"] img[data-sentry-element="Logo"]' : 'div[data-sentry-element="WebContent"] img[data-sentry-element="Logo"]')
    }

    get getDeliveryButton() {
        return this.page.locator(this.mobile ? 'div[data-sentry-element="TabletContent"] svg[data-sentry-element="IconTruckDelivery"]' : 'a[data-sentry-element="TimerWrapper"]')
    }

    get getProfileButton() {
        return this.page.locator(this.mobile ? 'div[data-sentry-element="TabletContent"] #navbar_profile_icon' : 'div[data-sentry-element="WebContent"] #navbar_profile_icon')
    }

    get getFavouritesButton() {
        return this.page.locator(this.mobile ? 'div[data-sentry-element="TabletContent"] svg[class="tabler-icon tabler-icon-heart"]' : 'a[href="/profil/ulubione-produkty"]')
    }

    get getStrefaMamityButton() {
        return this.page.locator(this.mobile ? 'main[data-sentry-element="AppContent"] a[href="/strefa-mamity"] button:has-text("Strefa Mamity")' : 'div[data-sentry-element="WebContent"] a[href="/strefa-mamity"] button:has-text("Strefa Mamity")')
    }

    get getDiscountsButton() {
        return this.page.locator(this.mobile ? 'main[data-sentry-element="AppContent"] a[href="/promocje"] button:has-text("Promocje")' : 'div[data-sentry-element="WebContent"] a[href="/promocje"] button:has-text("Promocje")')
    }

    get getNewProductsButton() {
        return this.page.locator(this.mobile ? 'main[data-sentry-element="AppContent"] a[href="/nowosci"] button:has-text("Nowości")' : 'div[data-sentry-element="WebContent"] a[href="/nowosci"] button:has-text("Nowości")')
    }

    get getBestsellersButton() {
        return this.page.locator(this.mobile ? 'main[data-sentry-element="AppContent"] a[href="/bestsellery"] button:has-text("Bestsellery")' : 'div[data-sentry-element="WebContent"] a[href="/bestsellery"] button:has-text("Bestsellery")')
    }

    get getRecentlyBoughtButton() {
        return this.page.locator(this.mobile ? 'div[data-sentry-element="AppContent"] a[href="/najczesciej-kupowane"] button:has-text("Najczęściej kupowane")' : 'div[data-sentry-element="WebContent"] a[href="/najczesciej-kupowane"] button:has-text("Najczęściej kupowane")')
    }

    get getAboutDeliveryButton() {
        return this.page.locator(this.mobile ? 'div[data-sentry-element="AppContent"] a[href="/o-dostawie/obszary-dostawy"] button:has-text("O dostawie")' : 'div[data-sentry-element="WebContent"] a[href="/o-dostawie/obszary-dostawy"] button:has-text("O dostawie")')
    }

    get getPaymentMethodsButton() {
        return this.page.locator(this.mobile ? 'div[data-sentry-element="AppContent"] a[href="/o-dostawie/metody-platnosci"] button:has-text("Metody płatności")' : 'div[data-sentry-element="WebContent"] a[href="/o-dostawie/metody-platnosci"] button:has-text("Metody płatności")')
    }

    get getBannersSection() {
        return this.page.locator(selectors.MainPage.common.bannersSection);
    }

    get getBanerSlider() {
        return this.page.locator(this.mobile ? 'div[data-sentry-element="BigBannerMobile"] div[data-sentry-component="SliderBanner"]' : 'div[data-sentry-element="BigBannerWeb"] div[data-sentry-component="SliderBanner"]');
    }

    get getBanerSliderLeftButton() {
        return this.page.locator(this.mobile ? 'div[data-sentry-element="BigBannerMobile"] button[class="slick-arrow slick-prev"]' : 'div[data-sentry-element="BigBannerWeb"] button[class="slick-arrow slick-prev"]');
    }

    get getBanerSliderRightButton() {
        return this.page.locator(this.mobile ? 'div[data-sentry-element="BigBannerMobile"] button[class="slick-arrow slick-next"]' : 'div[data-sentry-element="BigBannerWeb"] button[class="slick-arrow slick-next"]');
    }

    get getBannerUpperUp() {
        return this.page.locator('div[data-sentry-element="BannersColumn"] a[href*="/pakiet-powitalny"]');
    }

    get getBannerUpperDown() {
        return this.page.locator('div[data-sentry-element="BannersColumn"] a[href*="o-dostawie/koszty-dostawy"]');
    }

    get getDiscountsSection() {
        return this.page.locator('#promocje');
    }
    
    get getBestsellersSection() {
        return this.page.locator('#bestsellery');
    }

    get getCategoriesSection() {
        return this.page.locator('div[data-sentry-component="CategoriesSection"]');
    }

    get getNewProductsSection() {
        return this.page.locator('#nowosci');
    }

    get getRecentlyBoughtSection() {
        return this.page.locator('#most_frequently_bought');
    }

    get getNewsletterSection() {
        return this.page.locator('section[data-sentry-component="NewsletterSection"]');
    }

    get getNewsletterInput() {
        return this.page.getByPlaceholder('Wpisz swój email')
    }

    get getNewsletterSubscribeButton() {
        return this.page.getByText('Subskrybuj')
    }

    get getNewsletterCheckbox() {
        return this.page.locator('span[data-sentry-element="CheckboxMark"]')
    }

    getSectionTitle(titleName: string) {
        return this.page.locator('section div[data-sentry-element="Header"]').getByText(titleName).filter({ hasText: titleName});
    }

    getSectionShowAllLink(titleName: string) {
        return this.page.locator(`section div[data-sentry-element="Header"] a[href="/${titleName}"]:has-text("Zobacz wszystkie")`);
    }

    get getSectionGetLeftButton() {
        return this.page.locator(`section div[data-sentry-element="Header"] button svg[class="tabler-icon tabler-icon-arrow-left"]`);
    }

    get getSectionGetRightButton() {
        return this.page.locator(`section div[data-sentry-element="Header"] button svg[class="tabler-icon tabler-icon-arrow-right"]`);
    }
}