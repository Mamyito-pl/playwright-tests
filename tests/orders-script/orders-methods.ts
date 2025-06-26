import fs from 'fs/promises';
import { test as baseTest, Page } from '@playwright/test';
import CartPage from '../../page/Cart.page.ts';

let cartPage: CartPage;

type Address = {
    city: string;
    street: string;
    house_number: string;
    postal_code: string;
    phone_number: string;
    first_name: string;
    last_name: string;
};

type User = {
    email: string;
    password: string;
};

type MyFixtures = {
};

const ADDRESSES_FILE = './tests/orders-script/addresses.json';
const USED_INDEXES_FILE = './tests/orders-script/usedIndexes.json';

export async function loadJson < T > (file: string): Promise < T > {
    const data = await fs.readFile(file, 'utf-8');
    if (!data || data.trim() === '') {
        throw new Error(`Plik ${file} jest pusty lub nie zawiera prawidłowych danych JSON`);
    }
    return JSON.parse(data);
}

export async function saveJson < T > (file: string, data: T): Promise < void > {
    await fs.writeFile(file, JSON.stringify(data, null, 2));
}

export async function getNextFreeAddress(): Promise < Address | null > {
    const addresses: Address[] = await loadJson(ADDRESSES_FILE);
    const usedIndexes: number[] = await loadJson < number[] > (USED_INDEXES_FILE).catch(() => []);

    for (let i = 0; i < addresses.length; i++) {
        if (!usedIndexes.includes(i)) {
            usedIndexes.push(i);
            await saveJson(USED_INDEXES_FILE, usedIndexes);
            return addresses[i];
        }
    }

    return null;
}

export async function fillPassword(page: Page, text: string, delay: number = 50) {
    await page.locator('#login_password').fill('');
    for (let i = 0; i < text.length; i++) {
        await page.locator('#login_password').fill(text.slice(0, i + 1));
        await new Promise(r => setTimeout(r, delay));
    }
}

export async function clearCartViaAPI(page: Page, user: User) {
    const tokenResponse = await page.request.post(`${process.env.APIURL}/api/login`, {
        headers: {
            'Accept': 'application/json'
        },
        data: {
            email: user.email,
            password: user.password,
        },
    });

    const responseBodyToken = await tokenResponse.json();
    const token = responseBodyToken.data.token;

    console.log(token);

    const cartIDResponse = await page.request.post(`${process.env.APIURL}/api/cart`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    
    const responseBodyCartID = await cartIDResponse.json();
    const items = responseBodyCartID.data.items;
    const cart_id = responseBodyCartID.data.id;

    if (!items || items.length === 0) {
        console.log('Koszyk jest już pusty');
        return;
    }

    const deleteItemsFromCart = await page.request.delete(`${process.env.APIURL}/api/cart/${cart_id}/items`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    expect(deleteItemsFromCart.status()).toBe(200);

    console.log(`Wyczyszczono koszyk użytkownika: ${user.email}`);
}

export async function addDeliveryAddressViaAPI(page: Page, address: Address, addressName: string, user: User) {
    const tokenResponse = await page.request.post(`${process.env.APIURL}/api/login`, {
        headers: {
            'Accept': 'application/json'
        },
        data: {
            email: user.email,
            password: user.password,
        },
    });

    const responseBodyToken = await tokenResponse.json();
    const token = responseBodyToken.data.token;

    const addDeliveryAddress = await page.request.post(`${process.env.APIURL}/api/addresses`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        data: {
            city: address.city,
            first_name: address.first_name,
            last_name: address.last_name,
            house_number: address.house_number,
            icon_color: "#ffa31a",
            icon_type: "home",
            is_default: false,
            name: addressName,
            phone_number: address.phone_number,
            postal_code: address.postal_code,
            street: address.street,
            staircase_number: "1",
            flat_number: "30",
            type: "delivery",
            client_delivery_notes: "Testowa notatka",
            floor: "2"
        },
    });

    return addDeliveryAddress;
}

export const test = baseTest.extend<MyFixtures>({});
  
export const expect = test.expect;

