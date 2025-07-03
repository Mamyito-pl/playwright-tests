import { expect } from '@playwright/test';
import CommonPage from "../../../page/Common.page.ts";
import FavouritesPage from '../../../page/Profile/Favourites.page.ts';
import * as allure from "allure-js-commons";
import { test } from '../../../fixtures/fixtures.ts';
import * as utility from '../../../utils/utility-methods';

test.describe.configure({ mode: 'serial'})

test.setTimeout(80000);

test.describe('Testy ulubionych produktów', async () => {

  let commonPage: CommonPage;
  let favouritesPage : FavouritesPage;

  test.beforeEach(async ({ page }) => {

    await utility.gotoWithRetry(page, '/');

    await utility.addGlobalStyles(page);

    page.on('framenavigated', async () => {
      await utility.addGlobalStyles(page);
    });

    commonPage = new CommonPage(page);
    favouritesPage = new FavouritesPage(page);
  })
  
  test('W | Strona ulubionych produktów pojawia się ze wszystkimi potrzebnymi polami', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Web', 'Profil');
    await allure.epic('Webowe');
    await allure.parentSuite('Profil');
    await allure.suite('Testy ulubionych produktów');
    await allure.subSuite('');
    await allure.allureId('1496');

    await utility.gotoWithRetry(page, 'profil/ulubione-produkty');

    await expect(favouritesPage.getFavouritesProductsTitle).toBeVisible();
  })

  test('W | Możliwość dodania i usunięcia ulubionego produktu', { tag: ['@ProdSmoke', '@Smoke'] }, async ({ page }) => {

    await allure.tags('Web', 'Profil');
    await allure.epic('Webowe');
    await allure.parentSuite('Profil');
    await allure.suite('Testy ulubionych produktów');
    await allure.subSuite('');
    await allure.allureId('1497');

    test.setTimeout(70000);

    const firstItemName = page.locator('[data-cy="promocje-products-list-slider"] h3').first();
    const firstItemNameText = await firstItemName.textContent() || '';

    const clickAddFristItemToFavourites = await firstItemName.locator('..').locator('..').locator('..').locator('..').locator('..').locator('#product_card_favourites_button').click({ force: true, delay: 300 });
    clickAddFristItemToFavourites;
    await page.waitForTimeout(2000);

    await utility.gotoWithRetry(page, 'profil/ulubione-produkty');

    await favouritesPage.getProductName.first().waitFor({ state: 'visible', timeout: 15000 });

    await expect(favouritesPage.getFavouritesProductsTitle).toBeVisible();

    await page.waitForTimeout(1000);

    const allProductNames = await favouritesPage.getProductName.allTextContents();

    const allProductCount = allProductNames.length
    
    const productFound = allProductNames.some(name => name.includes(firstItemNameText));
    expect(productFound).toBe(true);

    const addedFavouriteProductName = page.getByText(firstItemNameText)
    const clickRemoveAddedFavouriteProduct = await addedFavouriteProductName.locator('..').locator('..').locator('..').locator('..').locator('..').locator('#product_card_favourites_button').click({ force: true, delay: 300 });
    clickRemoveAddedFavouriteProduct;

    await expect(commonPage.getMessage).toHaveText('Usunięto produkt z ulubionych', { timeout: 15000 })

    await page.reload()

    await favouritesPage.getProductName.first().waitFor({ state: 'visible', timeout: 10000 })

    const updatedProductNames = await favouritesPage.getProductName.allTextContents();
    expect(updatedProductNames.length).toBe(allProductCount - 1);

    const productNotFound = !updatedProductNames.some(name => name.includes(firstItemNameText));
    expect(productNotFound).toBe(true);
  })

  test('W | Możliwość sortowania po najtańszych produktach', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Web', 'Profil');
    await allure.epic('Webowe');
    await allure.parentSuite('Profil');
    await allure.suite('Testy ulubionych produktów');
    await allure.subSuite('');
    await allure.allureId('1498');

    await utility.gotoWithRetry(page, 'profil/ulubione-produkty');

    await favouritesPage.getProductName.first().waitFor({ state: 'visible', timeout: 15000 });

    await expect(favouritesPage.getSortButton).toBeVisible();
    await favouritesPage.getSortButton.click();
    await favouritesPage.getSortSelect('Najtańsze');

    await page.waitForTimeout(10000);

    const allSortedPrices = await favouritesPage.getProductPrices.allTextContents();

    const sortedPrices = allSortedPrices.map(price => parseFloat(price.replace(/[^0-9,.-]/g, '').replace(',', '.')))

    const expectedSortedPrices = [...sortedPrices].sort((a, b) => a - b);

    const pricesCount = sortedPrices.length;

    expect(sortedPrices).toEqual(expectedSortedPrices);

    expect(pricesCount).toBeGreaterThan(1);
  })
  
  test('W | Możliwość sortowania po najdroższych produktach', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Web', 'Profil');
    await allure.epic('Webowe');
    await allure.parentSuite('Profil');
    await allure.suite('Testy ulubionych produktów');
    await allure.subSuite('');
    await allure.allureId('1499');

    await utility.gotoWithRetry(page, 'profil/ulubione-produkty');

    await favouritesPage.getProductName.first().waitFor({ state: 'visible', timeout: 15000 });

    await expect(favouritesPage.getSortButton).toBeVisible();
    await favouritesPage.getSortButton.click();
    await favouritesPage.getSortSelect('Najdroższe');

    await page.waitForTimeout(10000);

    const allSortedPrices = await favouritesPage.getProductPrices.allTextContents();

    const sortedPrices = allSortedPrices.map(price => parseFloat(price.replace(/[^0-9,.-]/g, '').replace(',', '.')))

    const expectedSortedPrices = [...sortedPrices].sort((a, b) => b - a);

    const pricesCount = sortedPrices.length;

    expect(sortedPrices).toEqual(expectedSortedPrices);

    expect(pricesCount).toBeGreaterThan(1);
  })  

  test('W | Możliwość sortowania po najtańszych produktach za kg/l', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Web', 'Profil');
    await allure.epic('Webowe');
    await allure.parentSuite('Profil');
    await allure.suite('Testy ulubionych produktów');
    await allure.subSuite('');
    await allure.allureId('1500');

    await utility.gotoWithRetry(page, 'profil/ulubione-produkty');

    await favouritesPage.getProductName.first().waitFor({ state: 'visible', timeout: 15000 });
    
    await expect(favouritesPage.getSortButton).toBeVisible();
    await favouritesPage.getSortButton.click();
    await favouritesPage.getSortSelect('Najtańsze za kg/litr');

    await page.waitForTimeout(10000);

    const allSortedPrices = await favouritesPage.getProductPricesPerGrammar.allTextContents();
    console.log('raw prices', allSortedPrices)

    const sortedPrices = allSortedPrices.map(price => parseFloat(price.replace(/[^0-9,.-]/g, '').replace(',', '.')))
    console.log('cleaned raw prices', sortedPrices)

    const expectedSortedPrices = [...sortedPrices].sort((a, b) => a - b);
    console.log('cleaned sorted prices', expectedSortedPrices)

    const pricesCount = sortedPrices.length;

    expect(sortedPrices).toEqual(expectedSortedPrices);

    expect(pricesCount).toBeGreaterThan(1);
  })

  test('W | Możliwość sortowania po najdroższych produktach za kg/l', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Web', 'Profil');
    await allure.epic('Webowe');
    await allure.parentSuite('Profil');
    await allure.suite('Testy ulubionych produktów');
    await allure.subSuite('');
    await allure.allureId('1501');

    await utility.gotoWithRetry(page, 'profil/ulubione-produkty');

    await favouritesPage.getProductName.first().waitFor({ state: 'visible', timeout: 15000 });
    
    await expect(favouritesPage.getSortButton).toBeVisible();
    await favouritesPage.getSortButton.click();
    await favouritesPage.getSortSelect('Najdroższe za kg/litr');

    await page.waitForTimeout(10000);

    const allSortedPrices = await favouritesPage.getProductPricesPerGrammar.allTextContents();

    const sortedPrices = allSortedPrices.map(price => parseFloat(price.replace(/[^0-9,.-]/g, '').replace(',', '.')))

    const expectedSortedPrices = [...sortedPrices].sort((a, b) => b - a);

    const pricesCount = sortedPrices.length;

    expect(sortedPrices).toEqual(expectedSortedPrices);

    expect(pricesCount).toBeGreaterThan(1);
  })

  
  test('W | Możliwość sortowania od A do Z', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Web', 'Profil');
    await allure.epic('Webowe');
    await allure.parentSuite('Profil');
    await allure.suite('Testy ulubionych produktów');
    await allure.subSuite('');
    await allure.allureId('1502');

    await utility.gotoWithRetry(page, 'profil/ulubione-produkty');

    await favouritesPage.getProductName.first().waitFor({ state: 'visible', timeout: 15000 });
    
    await expect(favouritesPage.getSortButton).toBeVisible();
    await favouritesPage.getSortButton.click();
    await favouritesPage.getSortSelect('od A do Z');

    await page.waitForTimeout(5000);
    
    const allProductNames = await favouritesPage.getProductName.allTextContents();
    
    const cleanedProductNames = allProductNames.map(name =>
        name.replace(/\s+/g, ' ').replace(/\s+%/, '%').trim()
    );

    const isSingleLetter = (word: any) => /^[a-zA-Z]$/.test(word);

    const findWordsStartingWith = (str: any, letter: any) => 
        str.split(' ').filter((word: any) => 
            word.toLowerCase().startsWith(letter.toLowerCase()) && 
            word.length > 1
        );

    const extractNumber = (word: any) => {
        const match = word.match(/(\d+(?:,\d+)?)/);
        return match ? parseFloat(match[1].replace(',', '.')) : null;
    };

    const compareNumbers = (wordA: any, wordB: any) => {
        const numA = extractNumber(wordA);
        const numB = extractNumber(wordB);
        
        if (numA === null || numB === null) return null;
        if (Math.abs(numA - numB) < 0.0001) return wordA.length - wordB.length;
        return numA - numB;
    };

    const normalizePolishCharacters = (str: any) => {
        const polishAccentMap = {
            'a': ['a', 'ą', 'Ą'],
            'c': ['c', 'ć', 'Ć'],
            'e': ['e', 'ę', 'Ę'],
            'l': ['l', 'ł', 'Ł'],
            'n': ['n', 'ń', 'Ń'],
            'o': ['o', 'ó', 'Ó'],
            's': ['s', 'ś', 'Ś'],
            'z': ['z', 'ź', 'ż', 'Ż', 'Ź'],
        };
        return str.replace(/[ąĄćĆęĘłŁńŃóÓśŚźŹżŻ]/g, (match: any) => {
            for (const key in polishAccentMap) {
                if (polishAccentMap[key].includes(match)) return key;
            }
            return match;
        }).toLowerCase();
    };

    const compareStrings = (a: any, b: any) => {
        const normalizedA = normalizePolishCharacters(a);
        const normalizedB = normalizePolishCharacters(b);
        const wordsA = normalizedA.split(' ');
        const wordsB = normalizedB.split(' ');

        const minLength = Math.min(wordsA.length, wordsB.length);
        for (let i = 0; i < minLength; i++) {
            const wordA = wordsA[i];
            const wordB = wordsB[i];

            if (wordA !== wordB) {
                const numberComparison = compareNumbers(wordA, wordB);
                if (numberComparison !== null) {
                    if (numberComparison === 0) continue;
                    return numberComparison;
                }

                const aIsSingle = isSingleLetter(wordA);
                const bIsSingle = isSingleLetter(wordB);

                if (aIsSingle && !bIsSingle) {
                    if (findWordsStartingWith(b, wordA).length > 0) return 1;
                }
                if (!aIsSingle && bIsSingle) {
                    if (findWordsStartingWith(a, wordB).length > 0) return -1;
                }

                return wordA.localeCompare(wordB);
            }
        }

        return wordsA.length - wordsB.length;
    };

    const expectedSortedNames = [...cleanedProductNames].sort(compareStrings);

    const productsCount = cleanedProductNames.length;
    
    expect(cleanedProductNames).toEqual(expectedSortedNames);

    expect(productsCount).toBeGreaterThan(1);
  })

  test('W | Możliwość sortowania od Z do A', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Web', 'Profil');
    await allure.epic('Webowe');
    await allure.parentSuite('Profil');
    await allure.suite('Testy ulubionych produktów');
    await allure.subSuite('');
    await allure.allureId('1503');

    await utility.gotoWithRetry(page, 'profil/ulubione-produkty');

    await favouritesPage.getProductName.first().waitFor({ state: 'visible', timeout: 15000 });
    
    await expect(favouritesPage.getSortButton).toBeVisible();
    await favouritesPage.getSortButton.click();
    await favouritesPage.getSortSelect('od Z do A');

    await page.waitForTimeout(5000);
    
    const allProductNames = await favouritesPage.getProductName.allTextContents();
    
    const cleanedProductNames = allProductNames.map(name =>
        name.replace(/\s+/g, ' ').replace(/\s+%/, '%').trim()
    );

    const isSingleLetter = (word: any) => /^[a-zA-Z]$/.test(word);

    const findWordsStartingWith = (str: any, letter: any) => 
        str.split(' ').filter((word: any) => 
            word.toLowerCase().startsWith(letter.toLowerCase()) && 
            word.length > 1
        );

    const extractNumber = (word: any) => {
        const match = word.match(/(\d+(?:,\d+)?)/);
        return match ? parseFloat(match[1].replace(',', '.')) : null;
    };

    const compareNumbers = (wordA: any, wordB: any) => {
        const numA = extractNumber(wordA);
        const numB = extractNumber(wordB);
        
        if (numA === null || numB === null) return null;
        if (Math.abs(numA - numB) < 0.0001) return wordB.length - wordA.length;
        return numB - numA;
    };

    const normalizePolishCharacters = (str: any) => {
        const polishAccentMap = {
            'a': ['a', 'ą', 'Ą'],
            'c': ['c', 'ć', 'Ć'],
            'e': ['e', 'ę', 'Ę'],
            'l': ['l', 'ł', 'Ł'],
            'n': ['n', 'ń', 'Ń'],
            'o': ['o', 'ó', 'Ó'],
            's': ['s', 'ś', 'Ś'],
            'z': ['z', 'ź', 'ż', 'Ż', 'Ź'],
        };
        return str.replace(/[ąĄćĆęĘłŁńŃóÓśŚźŹżŻ]/g, (match: any) => {
            for (const key in polishAccentMap) {
                if (polishAccentMap[key].includes(match)) return key;
            }
            return match;
        }).toLowerCase();
    };

    const compareStrings = (a: any, b: any) => {
        const normalizedA = normalizePolishCharacters(a);
        const normalizedB = normalizePolishCharacters(b);
        const wordsA = normalizedA.split(' ');
        const wordsB = normalizedB.split(' ');

        const minLength = Math.min(wordsA.length, wordsB.length);
        for (let i = 0; i < minLength; i++) {
            const wordA = wordsA[i];
            const wordB = wordsB[i];

            if (wordA !== wordB) {
                const numberComparison = compareNumbers(wordA, wordB);
                if (numberComparison !== null) {
                    if (numberComparison === 0) continue;
                    return numberComparison;
                }

                const aIsSingle = isSingleLetter(wordA);
                const bIsSingle = isSingleLetter(wordB);

                if (aIsSingle && !bIsSingle) {
                    if (findWordsStartingWith(b, wordA).length > 0) return -1;
                }
                if (!aIsSingle && bIsSingle) {
                    if (findWordsStartingWith(a, wordB).length > 0) return 1;
                }

                return wordB.localeCompare(wordA);
            }
        }

        return wordsB.length - wordsA.length;
    };

    const expectedSortedNames = [...cleanedProductNames].sort(compareStrings);

    const productsCount = cleanedProductNames.length;
    
    expect(cleanedProductNames).toEqual(expectedSortedNames);

    expect(productsCount).toBeGreaterThan(1);
  })
})
