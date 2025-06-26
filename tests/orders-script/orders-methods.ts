import fs from 'fs/promises';
import { Page } from 'playwright';

type Address = {
    city: string;
    street: string;
    house_number: string;
    postal_code: string;
    phone_number: string;
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

export async function addDeliveryAddress(page: Page, address: Address, addressName: string) {
    const tokenResponse = await page.request.post(`${process.env.APIURL}/api/login`, {
        headers: {
            'Accept': 'application/json'
        },
        data: {
            email: `${process.env.EMAIL}`,
            password: `${process.env.PASSWORD}`,
        },
    });

    const responseBodyToken = await tokenResponse.json();
    const token = responseBodyToken.data.token;

    const addDeliveryAddressResponse = await page.request.post(`${process.env.APIURL}/api/addresses`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        data: {
            city: address.city,
            first_name: "Jan",
            last_name: "Kowalski", 
            house_number: address.house_number,
            icon_color: "#ffa31a",
            icon_type: "home",
            is_default: false,
            latitude: 11,
            longitude: 11,
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

    return addDeliveryAddressResponse;
}

