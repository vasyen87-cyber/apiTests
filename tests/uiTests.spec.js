import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { MainPage, RegisterPage, ArticlePage} from '../src/pages/index';

const URL = 'https://realworld.qa.guru/';

test.describe('Регистрация', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(URL);
    });

    test('Пользователь может зарегистрироваться с навигацией через клавиатуру', async ({page}) => {
        const user = {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        };

        const mainPage = new MainPage(page);
        const registerPage = new RegisterPage(page);

        await mainPage.gotoRegister();
        await registerPage.register(user);
        await expect(registerPage.profileNameField).toContainText(
            user.name,
        );
    });

    test('New article',  { tag: '@UI' }, async ({page}) => {
        const user = {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        };
        const articleName = faker.word.words();

        const mainPage = new MainPage(page);
        const registerPage = new RegisterPage(page);
        const articlePage = new ArticlePage(page);

        await mainPage.gotoRegister();
        await registerPage.register(user);
        await articlePage.createNewArticle(articleName);
        await expect(articlePage.articleCheck).toContainText(articleName);
    });

    test('Update article',{ tag: '@UI' },async ({page}) => {
        const user = {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        };
        const articleName = faker.word.words();

        const mainPage = new MainPage(page);
        const registerPage = new RegisterPage(page);
        const articlePage = new ArticlePage(page);

        await mainPage.gotoRegister();
        await registerPage.register(user);
        await articlePage.createNewArticle(articleName);
        await articlePage.updateArticle(articleName);
        await expect(articlePage.articleCheck).toContainText(articleName);
    });


    test('post comment',{ tag: '@UI' }, async ({page}) => {
        const user = {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        };
        const articleName = faker.word.words();

        const mainPage = new MainPage(page);
        const registerPage = new RegisterPage(page);
        const articlePage = new ArticlePage(page);

        await mainPage.gotoRegister();
        await registerPage.register(user);
        await articlePage.createNewArticle(articleName);
        await articlePage.newPostComment();
        await expect(articlePage.articleCheck).toContainText('новый коммент');
    });

    test('My tab', { tag: '@UI' },async ({page}) => {
        const user = {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        };

        const mainPage = new MainPage(page);
        const registerPage = new RegisterPage(page);
        const articlePage = new ArticlePage(page);

        await mainPage.gotoRegister();
        await registerPage.register(user);
        await articlePage.goToMyTab();
        await expect(articlePage.myTab).toBeVisible();
    });

    test('Favorite tab',{ tag: '@UI' }, async ({page}) => {
        const user = {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        };

        const mainPage = new MainPage(page);
        const registerPage = new RegisterPage(page);
        const articlePage = new ArticlePage(page);

        await mainPage.gotoRegister();
        await registerPage.register(user);
        await articlePage.goToFavoriteTab()
        await expect(articlePage.favoriteTab).toBeVisible();
    });
});

