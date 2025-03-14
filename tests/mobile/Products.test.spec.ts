/*import { test, expect } from '@playwright/test';
import ProductsPage from '../../page/Products.page';
import * as allure from "allure-js-commons";
import * as utility from '../../utils/utility-methods';

test.describe('Testy listy produktów', async () => {

  test.setTimeout(80000);

  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {

    productsPage = new ProductsPage(page);
    
    await page.goto('/nabial/mleko-i-napoje-mleczne', { waitUntil: 'load' });

    await utility.addGlobalStyles(page);

    page.on('framenavigated', async () => {
      await utility.addGlobalStyles(page);
    });
  })

  test('M | Lista produktów otwiera się ze wszystkimi wymaganymi polami', async () => {

    await expect(productsPage.getBreadcrumbs).toBeVisible();
    await expect(productsPage.getBreadcrumbs).toContainText('Mleko i napoje mleczne');
    await expect(productsPage.getProductCategoryTitle('Mleko i napoje mleczne')).toBeVisible();
    await expect(productsPage.getFiltersButton).toBeVisible();
    await expect(productsPage.getSortButton).toBeVisible();
  })

  test('M | Możliwość przejścia do innej kategorii poprzez breadcrumb', async ({ page }) => {

    await expect(productsPage.getBreadcrumbs).toBeVisible();
    await productsPage.getBreadcrumbs.getByText('Nabiał').click();
    await expect(page).toHaveURL('/nabial', { timeout: 10000 });
    await expect(productsPage.getProductCategoryTitle('Nabiał')).toBeVisible();
    await expect(productsPage.getBreadcrumbs).toBeVisible();
    await expect(productsPage.getBreadcrumbs).toContainText('Nabiał');
  })

  test('M | Po zescrollowaniu w dół następne produkty są załadowywane', async ({ page }) => {

    const productsBeforeScroll = await productsPage.getProductTiles.count();
    expect(productsBeforeScroll).toEqual(60);

    await page.evaluate(async () => {
        window.scrollBy(0, 5000)
        await new Promise(r => setTimeout(r, 700));
        window.scrollBy(0, 5000)
        await new Promise(r => setTimeout(r, 700));
        window.scrollBy(0, 5000)
        await new Promise(r => setTimeout(r, 700));
      })

    const productsAfterScroll = await productsPage.getProductTiles.count();
    expect(productsAfterScroll).toBeGreaterThan(60);
  })
  
  test('M | Możliwość sortowania po najtańszych produktach', async ({ page }) => {

    await expect(productsPage.getSortButton).toBeVisible();
    await productsPage.getSortButton.click();
    await productsPage.getSortSelect('Najtańsze');

    await page.waitForTimeout(10000);

    const allSortedPrices = await productsPage.getProductPrices.allTextContents();

    const sortedPrices = allSortedPrices.map(price => parseFloat(price.replace(/[^0-9,.-]/g, '').replace(',', '.')))

    const expectedSortedPrices = [...sortedPrices].sort((a, b) => a - b);

    expect(sortedPrices).toEqual(expectedSortedPrices);
  })
  
  test('M | Możliwość sortowania po najdroższych produktach', async ({ page }) => {

    await expect(productsPage.getSortButton).toBeVisible();
    await productsPage.getSortButton.click();
    await productsPage.getSortSelect('Najdroższe');

    await page.waitForTimeout(10000);

    const allSortedPrices = await productsPage.getProductPrices.allTextContents();

    const sortedPrices = allSortedPrices.map(price => parseFloat(price.replace(/[^0-9,.-]/g, '').replace(',', '.')))

    const expectedSortedPrices = [...sortedPrices].sort((a, b) => b - a);

    const pricesCount = sortedPrices.length;

    expect(sortedPrices).toEqual(expectedSortedPrices);

    expect(pricesCount).toBeGreaterThan(1);
  })  

  test('M | Możliwość sortowania po najtańszych produktach za kg/l', async ({ page }) => {
    
    await expect(productsPage.getSortButton).toBeVisible();
    await productsPage.getSortButton.click();
    await productsPage.getSortSelect('Najtańsze za kg/litr');

    await page.waitForTimeout(10000);

    const allSortedPrices = await productsPage.getProductPricesPerGrammar.allTextContents();

    const sortedPrices = allSortedPrices.map(price => parseFloat(price.replace(/[^0-9,.-]/g, '').replace(',', '.')))

    const expectedSortedPrices = [...sortedPrices].sort((a, b) => a - b);

    const pricesCount = sortedPrices.length;

    expect(sortedPrices).toEqual(expectedSortedPrices);

    expect(pricesCount).toBeGreaterThan(1);
  })

  test('M | Możliwość sortowania po najdroższych produktach za kg/l', async ({ page }) => {
    
    await expect(productsPage.getSortButton).toBeVisible();
    await productsPage.getSortButton.click();
    await productsPage.getSortSelect('Najdroższe za kg/litr');

    await page.waitForTimeout(10000);

    const allSortedPrices = await productsPage.getProductPricesPerGrammar.allTextContents();

    const sortedPrices = allSortedPrices.map(price => parseFloat(price.replace(/[^0-9,.-]/g, '').replace(',', '.')))

    const expectedSortedPrices = [...sortedPrices].sort((a, b) => b - a);

    const pricesCount = sortedPrices.length;

    expect(sortedPrices).toEqual(expectedSortedPrices);

    expect(pricesCount).toBeGreaterThan(1);
  })

  test('M | Możliwość sortowania od A do Z', async ({ page }) => {
    
    await expect(productsPage.getSortButton).toBeVisible();
    await productsPage.getSortButton.click();
    await productsPage.getSortSelect('od A do Z');

    await page.waitForTimeout(5000);
    
    const allProductNames = await productsPage.getProductName.allTextContents();
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
  
  test('M | Możliwość sortowania od Z do A', async ({ page }) => {
    
    await expect(productsPage.getSortButton).toBeVisible();
    await productsPage.getSortButton.click();
    await productsPage.getSortSelect('od Z do A');

    await page.waitForTimeout(5000);
    
    const allProductNames = await productsPage.getProductName.allTextContents();
    
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
  
  test('M | Możliwość filtrowania po typie produktu', async ({ page }) => {
    
    await productsPage.getFiltersButton.click();
    await productsPage.getFilterSelect('Typ produktu','Bez laktozy');
    await productsPage.clickApplyButton();
    await page.waitForTimeout(10000);
    
    const allProductNames = await productsPage.getProductName.allTextContents();

    for (const productName of allProductNames) {
      expect(productName.toLocaleLowerCase()).toContain('bez laktozy');
    }


    const productsCount = allProductNames.length;

    expect(productsCount).toBeGreaterThanOrEqual(1);
  })
  
  test.describe('Filtrowanie po cenie', async () => {
    test('M | Możliwość filtrowania po cenie poniżej 10 zł', async ({ page }) => {

      await productsPage.getFiltersButton.click();
      await productsPage.getFilterSelect('Cena','poniżej 10zł');
      await productsPage.clickApplyButton();
      await page.waitForTimeout(10000);

      const allProductPrices = await productsPage.getProductPrices.allTextContents();
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

    test('M | Możliwość filtrowania po cenie od 10 zł do 20 zł', async ({ page }) => {

      await productsPage.getFiltersButton.click();
      await productsPage.getFilterSelect('Cena','od 10zł do 20zł');
      await productsPage.clickApplyButton();
      await page.waitForTimeout(10000);

      const allProductPrices = await productsPage.getProductPrices.allTextContents();
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
          await expect(productsPage.getNoProductsResult).toBeVisible();
      }
    })     

    test('M | Możliwość filtrowania po cenie od 20 zł 50 zł', async ({ page }) => {

      await productsPage.getFiltersButton.click();
      await productsPage.getFilterSelect('Cena','od 20zł do 50zł');
      await productsPage.clickApplyButton();
      await page.waitForTimeout(10000);

      const allProductPrices = await productsPage.getProductPrices.allTextContents();
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
          await expect(productsPage.getNoProductsResult).toBeVisible();
      }
    })  
    
    test('M | Możliwość filtrowania po cenie powyżej 50 zł', async ({ page }) => {

      await productsPage.getFiltersButton.click();
      await productsPage.getFilterSelect('Cena','powyżej 50zł');
      await productsPage.clickApplyButton();
      await page.waitForTimeout(10000);

      const allProductPrices = await productsPage.getProductPrices.allTextContents();
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
          await expect(productsPage.getNoProductsResult).toBeVisible();
      }
    })

    test('M | Możliwość filtrowania po cenie niestandardowej', async ({ page }) => {

      await productsPage.getFiltersButton.click();
      await productsPage.getFilterCustomPriceFromSet('Cena', '2');
      await productsPage.clickApplyButton();
      await page.waitForTimeout(10000);
      await productsPage.getFiltersButton.click();
      await productsPage.getFilterCustomPriceToSet('Cena', '4');
      await productsPage.clickApplyButton();
      await page.waitForTimeout(10000);

      const allProductPrices = await productsPage.getProductPrices.allTextContents();
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
          await expect(productsPage.getNoProductsResult).toBeVisible();
      }
    })
  })
})
*/
