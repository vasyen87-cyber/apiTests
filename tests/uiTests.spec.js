import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { UserBuilder } from '../src/helpers/builders';
import { ArticleBuilder } from '../src/helpers/builders';
import { App } from '../src/pages/app.pages';

test.describe('Регистрация', () => {
    test.beforeEach(async ({ page }) => {
        let app = new App(page);
        await app.main.visit();
    });

    test('Пользователь может зарегистрироваться с навигацией через клавиатуру', async ({page}) => {

        const user = new UserBuilder()
            .addName()
            .addEmail()
            .addPassword()
            .generate();

        let app = new App(page);
        await app.main.gotoRegister();
        await app.register.register(user);

        await expect(app.register.profileNameField).toContainText(user.name);
    });

    test('Создание статьи',  { tag: '@UI' }, async ({page}) => {

        const user = new UserBuilder()
            .addName()
            .addEmail()
            .addPassword()
            .generate();

        const article = new ArticleBuilder()
            .addTitle()
            .addDescription()
            .addBody()
            .addTags()
            .generate();

        let app = new App(page);
        await app.main.gotoRegister();
        await app.register.register(user);
        await app.article.createNewArticle(article);

        await expect(app.article.articleTitle).toContainText(article.title);
        await expect(app.article.articleBody).toContainText(article.body);
    });

    test('Обновление статьи',{ tag: '@UI' },async ({page}) => {

        const user = new UserBuilder()
            .addName()
            .addEmail()
            .addPassword()
            .generate();

        const article = new ArticleBuilder()
            .addTitle()
            .addDescription()
            .addBody()
            .addTags()
            .generate();

        let app = new App(page);
        await app.main.gotoRegister();
        await app.register.register(user);
        await app.article.createNewArticle(article);
        await app.article.updateArticle(article);

        await expect(app.article.articleTitle).toContainText(article.title);
        await expect(app.article.articleBody).toContainText(article.body);
    });

    test('Добавление комментария',{ tag: '@UI' }, async ({page}) => {

        const user = new UserBuilder()
            .addName()
            .addEmail()
            .addPassword()
            .generate();

        const article = new ArticleBuilder()
            .addTitle()
            .addDescription()
            .addBody()
            .addTags()
            .generate();

        let app = new App(page);
        const articleName = faker.word.words();
        await app.main.gotoRegister();
        await app.register.register(user);
        await app.article.createNewArticle(article);
        await app.article.newPostComment();

        await expect(app.article.articleComment).toContainText('новый коммент');
    });

    test('Открытие моей табы', { tag: '@UI' },async ({page}) => {

        const user = new UserBuilder()
            .addName()
            .addEmail()
            .addPassword()
            .generate();

        let app = new App(page);
        await app.main.gotoRegister();
        await app.register.register(user);
        await app.article.goToMyTab();

        await expect(app.article.myTab).toBeVisible();
    });

    test('Открытие фаворитной табы',{ tag: '@UI' }, async ({page}) => {

        const user = new UserBuilder()
            .addName()
            .addEmail()
            .addPassword()
            .generate();

        let app = new App(page);
        await app.main.gotoRegister();
        await app.register.register(user);
        await app.article.goToFavoriteTab();

        await expect(app.article.favoriteTab).toBeVisible();
    });
});

