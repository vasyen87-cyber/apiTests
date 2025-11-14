import { test } from '@playwright/test';

export class BasePage {
    constructor(page) {
        this.page = page;
    }
    async visit() {
        return test.step(`Переход на страницу {$URL}`, async () => {
            await this.page.goto('/');
        });
    }
}