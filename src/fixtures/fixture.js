import { test as base, expect as baseExpect } from '@playwright/test';
import {App} from "../pages/app.page";
import {ApiClient} from "../services/apiClient";



export const test = base.extend({
    app: async ({ page }, use) => {
        const app = new App(page);
        await app.main.visit(); // Предусловие можно вынести в фикстуру
        await use(app);
    },
    api: async ({ request }, use) => {
        const apiClient = await ApiClient.loginAs(); // ✅ Использование API сервиса через Facade
        await use(apiClient)
    }
});

export const expect = baseExpect;