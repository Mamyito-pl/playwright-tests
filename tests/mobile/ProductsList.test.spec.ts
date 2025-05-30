import { test, expect } from '@playwright/test';
import ProductsListPage from '../../page/ProductsList.page';
import * as allure from "allure-js-commons";
import * as utility from '../../utils/utility-methods';

test.describe('Testy listy produktów', async () => {

  test.setTimeout(80000);

  let productsListPage: ProductsListPage;

  test.beforeEach(async ({ page }) => {

    productsListPage = new ProductsListPage(page);
    
    await page.goto('/nabial/mleko-i-napoje-mleczne', { waitUntil: 'load' });

    await utility.addGlobalStyles(page);

    page.on('framenavigated', async () => {
      await utility.addGlobalStyles(page);
    });
  })

  test('M | Lista produktów otwiera się ze wszystkimi wymaganymi polami', { tag: ['@Prod', '@Beta', '@Test'] }, async () => {

    await allure.tags('Mobilne', 'Lista produktów');
    await allure.epic('Mobilne');
    await allure.parentSuite('Lista produktów');
    await allure.suite('Testy listy produktów');
    await allure.subSuite('');
    await allure.allureId('1626');

    await expect(productsListPage.getBreadcrumbs).toBeVisible();
    await expect(productsListPage.getBreadcrumbs).toContainText('Mleko i napoje mleczne');
    await expect(productsListPage.getProductCategoryTitle('Mleko i napoje mleczne')).toBeVisible();
    await expect(productsListPage.getFiltersButton).toBeVisible();
    await expect(productsListPage.getSortButton).toBeVisible();
  })

  test('M | Możliwość przejścia do innej kategorii poprzez breadcrumb', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Mobilne', 'Lista produktów');
    await allure.epic('Mobilne');
    await allure.parentSuite('Lista produktów');
    await allure.suite('Testy listy produktów');
    await allure.subSuite('');
    await allure.allureId('1627');

    await expect(productsListPage.getBreadcrumbs).toBeVisible();
    await productsListPage.getBreadcrumbs.getByText('Nabiał').click();
    await expect(page).toHaveURL('/nabial', { timeout: 10000 });
    await expect(productsListPage.getProductCategoryTitle('Nabiał')).toBeVisible();
    await expect(productsListPage.getBreadcrumbs).toBeVisible();
    await expect(productsListPage.getBreadcrumbs).toContainText('Nabiał');
  })

  test('M | Po zescrollowaniu w dół następne produkty są załadowywane', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Mobilne', 'Lista produktów');
    await allure.epic('Mobilne');
    await allure.parentSuite('Lista produktów');
    await allure.suite('Testy listy produktów');
    await allure.subSuite('');
    await allure.allureId('1628');

    const productsBeforeScroll = await productsListPage.getProductTiles.count();
    expect(productsBeforeScroll).toEqual(60);

    await page.evaluate(async () => {
        window.scrollBy(0, 5000)
        await new Promise(r => setTimeout(r, 700));
        window.scrollBy(0, 5000)
        await new Promise(r => setTimeout(r, 700));
        window.scrollBy(0, 5000)
        await new Promise(r => setTimeout(r, 700));
      })

    const productsAfterScroll = await productsListPage.getProductTiles.count();
    expect(productsAfterScroll).toBeGreaterThan(60);
  })
  
  test('M | Możliwość sortowania po najtańszych produktach', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Mobilne', 'Lista produktów');
    await allure.epic('Mobilne');
    await allure.parentSuite('Lista produktów');
    await allure.suite('Testy listy produktów');
    await allure.subSuite('');
    await allure.allureId('1629');

    await expect(productsListPage.getSortButton).toBeVisible();
    await productsListPage.getSortButton.click();
    await productsListPage.getSortSelect('Najtańsze');

    await page.waitForTimeout(10000);

    const allSortedPrices = await productsListPage.getProductPrices.allTextContents();

    const sortedPrices = allSortedPrices.map(price => parseFloat(price.replace(/[^0-9,.-]/g, '').replace(',', '.')))

    const expectedSortedPrices = [...sortedPrices].sort((a, b) => a - b);

    expect(sortedPrices).toEqual(expectedSortedPrices);
  })
  
  test('M | Możliwość sortowania po najdroższych produktach', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Mobilne', 'Lista produktów');
    await allure.epic('Mobilne');
    await allure.parentSuite('Lista produktów');
    await allure.suite('Testy listy produktów');
    await allure.subSuite('');
    await allure.allureId('1630');

    await expect(productsListPage.getSortButton).toBeVisible();
    await productsListPage.getSortButton.click();
    await productsListPage.getSortSelect('Najdroższe');

    await page.waitForTimeout(10000);

    const allSortedPrices = await productsListPage.getProductPrices.allTextContents();

    const sortedPrices = allSortedPrices.map(price => parseFloat(price.replace(/[^0-9,.-]/g, '').replace(',', '.')))

    const expectedSortedPrices = [...sortedPrices].sort((a, b) => b - a);

    const pricesCount = sortedPrices.length;

    expect(sortedPrices).toEqual(expectedSortedPrices);

    expect(pricesCount).toBeGreaterThan(1);
  })  

  test('M | Możliwość sortowania po najtańszych produktach za kg/l', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Mobilne', 'Lista produktów');
    await allure.epic('Mobilne');
    await allure.parentSuite('Lista produktów');
    await allure.suite('Testy listy produktów');
    await allure.subSuite('');
    await allure.allureId('1631');
    
    await expect(productsListPage.getSortButton).toBeVisible();
    await productsListPage.getSortButton.click();
    await productsListPage.getSortSelect('Najtańsze za kg/litr');

    await page.waitForTimeout(10000);

    const allSortedPrices = await productsListPage.getProductPricesPerGrammar.allTextContents();

    const sortedPrices = allSortedPrices.map(price => parseFloat(price.replace(/[^0-9,.-]/g, '').replace(',', '.')))

    const expectedSortedPrices = [...sortedPrices].sort((a, b) => a - b);

    const pricesCount = sortedPrices.length;

    expect(sortedPrices).toEqual(expectedSortedPrices);

    expect(pricesCount).toBeGreaterThan(1);
  })

  test('M | Możliwość sortowania po najdroższych produktach za kg/l', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Mobilne', 'Lista produktów');
    await allure.epic('Mobilne');
    await allure.parentSuite('Lista produktów');
    await allure.suite('Testy listy produktów');
    await allure.subSuite('');
    await allure.allureId('1632');
    
    await expect(productsListPage.getSortButton).toBeVisible();
    await productsListPage.getSortButton.click();
    await productsListPage.getSortSelect('Najdroższe za kg/litr');

    await page.waitForTimeout(10000);

    const allSortedPrices = await productsListPage.getProductPricesPerGrammar.allTextContents();

    const sortedPrices = allSortedPrices.map(price => parseFloat(price.replace(/[^0-9,.-]/g, '').replace(',', '.')))

    const expectedSortedPrices = [...sortedPrices].sort((a, b) => b - a);

    const pricesCount = sortedPrices.length;

    expect(sortedPrices).toEqual(expectedSortedPrices);

    expect(pricesCount).toBeGreaterThan(1);
  })

  test('M | Możliwość sortowania od A do Z', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Mobilne', 'Lista produktów');
    await allure.epic('Mobilne');
    await allure.parentSuite('Lista produktów');
    await allure.suite('Testy listy produktów');
    await allure.subSuite('');
    await allure.allureId('1633');
    
    await expect(productsListPage.getSortButton).toBeVisible();
    await productsListPage.getSortButton.click();
    await productsListPage.getSortSelect('od A do Z');

    await page.waitForTimeout(5000);
    
    const allProductNames = await productsListPage.getProductName.allTextContents();
    console.log("Raw product names:", allProductNames);
    
    const cleanedProductNames = allProductNames.map(name =>
        name.replace(/\s+/g, ' ').replace(/\s+%/, '%').trim()
    );

    console.log("Cleaned product names:", cleanedProductNames);

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
  
  test('M | Możliwość sortowania od Z do A', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Mobilne', 'Lista produktów');
    await allure.epic('Mobilne');
    await allure.parentSuite('Lista produktów');
    await allure.suite('Testy listy produktów');
    await allure.subSuite('');
    await allure.allureId('1634');
    
    await expect(productsListPage.getSortButton).toBeVisible();
    await productsListPage.getSortButton.click();
    await productsListPage.getSortSelect('od Z do A');

    await page.waitForTimeout(5000);
    
    const allProductNames = await productsListPage.getProductName.allTextContents();
    
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
  
  test('M | Możliwość filtrowania po typie produktu', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Mobilne', 'Lista produktów');
    await allure.epic('Mobilne');
    await allure.parentSuite('Lista produktów');
    await allure.suite('Testy listy produktów');
    await allure.subSuite('');
    await allure.allureId('1635');
    
    await productsListPage.getFiltersButton.click();
    await productsListPage.getFilterSelect('Typ produktu','Bez laktozy');
    await productsListPage.clickApplyButton();
    await page.waitForTimeout(7000);
    
    const allProductNames = await productsListPage.getProductName.allTextContents();

    for (const productName of allProductNames) {
      expect(productName.toLocaleLowerCase()).toContain('bez laktozy');
    }

    const productsCount = allProductNames.length;

    expect(productsCount).toBeGreaterThanOrEqual(1);
  })
  
  test.describe('Filtrowanie po cenie', async () => {
    test('M | Możliwość filtrowania po cenie poniżej 10 zł', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

      await allure.tags('Mobilne', 'Lista produktów');
      await allure.epic('Mobilne');
      await allure.parentSuite('Lista produktów');
      await allure.suite('Testy listy produktów');
      await allure.subSuite('');
      await allure.allureId('1636');

      await productsListPage.getFiltersButton.click();
      await productsListPage.getFilterSelect('Cena','poniżej 10zł');
      await productsListPage.clickApplyButton();
      await page.waitForTimeout(7000);

      const allProductPrices = await productsListPage.getProductPrices.allTextContents();
      console.log('ceny produktow raw', allProductPrices)

      const allProductCleanedPrices = allProductPrices.map(price => parseFloat(price.replace(/[^\d,.-]/g, '').replace(',', '.')));
      console.log('ceny produktow po czyszczeniu', allProductCleanedPrices)

      for (const productPrice of allProductCleanedPrices) {
        expect(productPrice).toBeLessThanOrEqual(10)
        console.log('cena produktu', productPrice)
      }

      const pricesCount = allProductCleanedPrices.length;

      expect(pricesCount).toBeGreaterThan(1);
    })       

    test('M | Możliwość filtrowania po cenie od 10 zł do 20 zł', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

      await allure.tags('Mobilne', 'Lista produktów');
      await allure.epic('Mobilne');
      await allure.parentSuite('Lista produktów');
      await allure.suite('Testy listy produktów');
      await allure.subSuite('');
      await allure.allureId('1637');

      await productsListPage.getFiltersButton.click();
      await productsListPage.getFilterSelect('Cena','od 10zł do 20zł');
      await productsListPage.clickApplyButton();
      await page.waitForTimeout(7000);

      const allProductPrices = await productsListPage.getProductPrices.allTextContents();
      console.log('ceny produktow raw', allProductPrices)

      const allProductCleanedPrices = allProductPrices.map(price => parseFloat(price.replace(/[^\d,.-]/g, '').replace(',', '.')));
      console.log('ceny produktow po czyszczeniu', allProductCleanedPrices)

      const pricesCount = allProductCleanedPrices.length;

      if (allProductCleanedPrices.length > 0) {
        for (const productPrice of allProductCleanedPrices) {
          expect(productPrice).toBeGreaterThanOrEqual(10);
          expect(productPrice).toBeLessThanOrEqual(20);
          expect(pricesCount).toBeGreaterThanOrEqual(1);
          console.log('cena produktu', productPrice)
        }
      } else {
          await expect(productsListPage.getNoProductsResult).toBeVisible();
      }
    })     

    test('M | Możliwość filtrowania po cenie od 20 zł 50 zł', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

      await allure.tags('Mobilne', 'Lista produktów');
      await allure.epic('Mobilne');
      await allure.parentSuite('Lista produktów');
      await allure.suite('Testy listy produktów');
      await allure.subSuite('');
      await allure.allureId('1638');

      await productsListPage.getFiltersButton.click();
      await productsListPage.getFilterSelect('Cena','od 20zł do 50zł');
      await productsListPage.clickApplyButton();
      await page.waitForTimeout(7000);

      const allProductPrices = await productsListPage.getProductPrices.allTextContents();
      console.log('ceny produktow raw', allProductPrices)

      const allProductCleanedPrices = allProductPrices.map(price => parseFloat(price.replace(/[^\d,.-]/g, '').replace(',', '.')));
      console.log('ceny produktow po czyszczeniu', allProductCleanedPrices)

      const pricesCount = allProductCleanedPrices.length;

      if (allProductCleanedPrices.length > 0) {
        for (const productPrice of allProductCleanedPrices) {
          expect(productPrice).toBeGreaterThanOrEqual(20);
          expect(productPrice).toBeLessThanOrEqual(50);
          expect(pricesCount).toBeGreaterThanOrEqual(1);
          console.log('cena produktu', productPrice)
        }
      } else {
          await expect(productsListPage.getNoProductsResult).toBeVisible();
      }
    })  
    
    test('M | Możliwość filtrowania po cenie powyżej 50 zł', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

      await allure.tags('Mobilne', 'Lista produktów');
      await allure.epic('Mobilne');
      await allure.parentSuite('Lista produktów');
      await allure.suite('Testy listy produktów');
      await allure.subSuite('');
      await allure.allureId('1639');

      await productsListPage.getFiltersButton.click();
      await productsListPage.getFilterSelect('Cena','powyżej 50zł');
      await productsListPage.clickApplyButton();
      await page.waitForTimeout(7000);

      const allProductPrices = await productsListPage.getProductPrices.allTextContents();
      console.log('ceny produktow raw', allProductPrices)

      const allProductCleanedPrices = allProductPrices.map(price => parseFloat(price.replace(/[^\d,.-]/g, '').replace(',', '.')));
      console.log('ceny produktow po czyszczeniu', allProductCleanedPrices)

      const pricesCount = allProductCleanedPrices.length;

      if (allProductCleanedPrices.length > 0) {
        for (const productPrice of allProductCleanedPrices) {
          expect(productPrice).toBeGreaterThanOrEqual(20);
          expect(productPrice).toBeLessThanOrEqual(50);
          expect(pricesCount).toBeGreaterThanOrEqual(1);
          console.log('cena produktu', productPrice)
        }
      } else {
          await expect(productsListPage.getNoProductsResult).toBeVisible();
      }
    })

    test('M | Możliwość filtrowania po cenie niestandardowej', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

      await allure.tags('Mobilne', 'Lista produktów');
      await allure.epic('Mobilne');
      await allure.parentSuite('Lista produktów');
      await allure.suite('Testy listy produktów');
      await allure.subSuite('');
      await allure.allureId('1640');

      await productsListPage.getFiltersButton.click();
      await productsListPage.getFilterCustomPriceFromSet('Cena', '2');
      await productsListPage.clickApplyButton();
      await page.waitForTimeout(7000);
      await productsListPage.getFiltersButton.click();
      await productsListPage.getFilterCustomPriceToSet('Cena', '4');
      await productsListPage.clickApplyButton();
      await page.waitForTimeout(7000);

      const allProductPrices = await productsListPage.getProductPrices.allTextContents();
      console.log('ceny produktow raw', allProductPrices)

      const allProductCleanedPrices = allProductPrices.map(price => parseFloat(price.replace(/[^\d,.-]/g, '').replace(',', '.')));
      console.log('ceny produktow po czyszczeniu', allProductCleanedPrices)

      const pricesCount = allProductCleanedPrices.length;

      if (allProductCleanedPrices.length > 0) {
        for (const productPrice of allProductCleanedPrices) {
          expect(productPrice).toBeGreaterThanOrEqual(2);
          expect(productPrice).toBeLessThanOrEqual(4);
          expect(pricesCount).toBeGreaterThanOrEqual(1);
          console.log('cena produktu', productPrice)
        }
      } else {
          await expect(productsListPage.getNoProductsResult).toBeVisible();
      }
    })
        
    test('M | Możliwość filtrowania po nazwie producenta', async ({ page }) => {

      await allure.tags('Mobilne', 'Lista produktów');
      await allure.epic('Mobilne');
      await allure.parentSuite('Lista produktów');
      await allure.suite('Testy listy produktów');
      await allure.subSuite('');
      await allure.allureId('1641');

      await productsListPage.getFiltersButton.click();
      await productsListPage.getFilterSelect('Producent','MLEKOVITA');
      await productsListPage.clickApplyButton();
      await page.waitForTimeout(7000);
      
      const allProductBrands = await productsListPage.getProductBrand.allTextContents();
  
      for (const productBrandName of allProductBrands) {
        expect(productBrandName).toContain('MLEKOVITA');
      }
  
      const productsCount = allProductBrands.length;
  
      expect(productsCount).toBeGreaterThanOrEqual(1);
    })

    test('M | Możliwość wyczyszczenia filtrowania', async ({ page }) => {

      await allure.tags('Mobilne', 'Lista produktów');
      await allure.epic('Mobilne');
      await allure.parentSuite('Lista produktów');
      await allure.suite('Testy listy produktów');
      await allure.subSuite('');
      await allure.allureId('1642');

      await expect(productsListPage.getClearFiltersButton).not.toBeVisible();

      await productsListPage.getFiltersButton.click();
      await productsListPage.getFilterCustomPriceToSet('Cena', '4');
      await productsListPage.clickApplyButton();
      await page.waitForTimeout(7000);
      
      await productsListPage.getFiltersButton.click();
      expect((await productsListPage.getFilter('Typ produktu')).isVisible);
      await productsListPage.getFilterSelect('Typ produktu','Bez laktozy');
      await productsListPage.clickApplyButton();
      await page.waitForTimeout(7000);

      await productsListPage.getFiltersButton.click();
      expect((await productsListPage.getFilter('Producent')).isVisible);
      await productsListPage.getFilterSelect('Producent','MLEKOVITA');
      await productsListPage.clickApplyButton();
      await page.waitForTimeout(7000);

      const allProductNames = await productsListPage.getProductName.allTextContents();
      const allProductPrices = await productsListPage.getProductPrices.allTextContents();
      console.log('all products prices raw', allProductPrices)
      const allProductCleanedPrices = allProductPrices.map(price => parseFloat(price.replace(/[^\d,.-]/g, '').replace(',', '.')));
      const allProductBrands = await productsListPage.getProductBrand.allTextContents();
  
      for (let i = 0; i < allProductNames.length; i++) {
        expect(allProductNames[i].toLocaleLowerCase()).toContain('bez laktozy');
        console.log('allProductNames[i]', allProductNames)
        expect(allProductCleanedPrices[i]).toBeGreaterThan(0);
        console.log('allProductCleanedPrices[i]', allProductCleanedPrices)
        expect(allProductCleanedPrices[i]).toBeLessThanOrEqual(4);
        console.log('allProductCleanedPrices[i]', allProductCleanedPrices[i])
        expect(allProductBrands[i]).toContain('MLEKOVITA');
        console.log('allProductBrands[i]', allProductBrands)
      }
  
      const productsCount = allProductBrands.length;
  
      expect(productsCount).toBeGreaterThan(1);
      expect(productsCount).toBeLessThan(10);

      await productsListPage.getFiltersButton.click();
      await expect(productsListPage.getClearFiltersButton).toBeVisible();
      await productsListPage.getClearFiltersButton.click();
      await page.waitForTimeout(7000);

      const allProductNamesAfterClearFilter = await productsListPage.getProductName.allTextContents();
 
      await expect(productsListPage.getClearFiltersButton).not.toBeVisible();

      const productsCountAfterClearFilter = allProductNamesAfterClearFilter.length;

      expect(productsCountAfterClearFilter).toBeGreaterThanOrEqual(50);

      await expect(productsListPage.getClearFiltersButton).not.toBeVisible();
    })
  })
})
