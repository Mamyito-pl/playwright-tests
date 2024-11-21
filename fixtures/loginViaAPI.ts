import { test as baseTest, request, expect, Page } from '@playwright/test';
import * as credentials from '../data/credentials.json';

// Tworzymy nowy typ fixture, który zawiera funkcję `loginViaAPI`
type MyFixtures = {
    loginViaAPI: () => Promise<any>;  // loginViaAPI jako funkcja zwracająca stronę
};

// Definiujemy fixture z `loginViaAPI` jako funkcją
const test = baseTest.extend<MyFixtures>({
    loginViaAPI: async ({ browser }, use) => {
    // Tworzymy funkcję, która będzie logować się przez API i zwracać zalogowaną stronę
    const loginViaAPI = async () => {
      const apiContext = await request.newContext();

      // Wysyłamy żądanie POST do API logowania
      const loginResponse = await apiContext.post(process.env.APIURL + '/api/login', {
        data: {
          email: credentials.standard.email,
          password: credentials.standard.password,
        },
      });

      // Sprawdzamy, czy odpowiedź jest poprawna
      if (!loginResponse.ok()) {
        throw new Error(`Failed to login, status: ${loginResponse.status()}`);
      }

      const responseBody = await loginResponse.json();
      const accessToken = responseBody.token;

      console.log(responseBody.token)

      await responseBody.evaluate((token) => {
        sessionStorage.setItem('token', token);
      }, accessToken);

      // Pobieramy token z odpowiedzi API
      /*const loginData = await loginResponse.json();
      const token = loginData.token;
      console.log('Token:', token);*/
      // Tworzymy nowy kontekst przeglądarki z tokenem
      const context = await browser.newContext({
        extraHTTPHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Tworzymy nową stronę
      const page = await context.newPage();
      return page;
    };

    // Udostępniamy funkcję logowania w testach
    await use(loginViaAPI);
  },
});

export { test, expect };