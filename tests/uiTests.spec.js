import { expect } from '@playwright/test';
import { UserBuilder } from '../src/helpers/builders';
import { ArticleBuilder } from '../src/helpers/builders';
import {test} from "../src/fixtures/fixture";

test.describe('Регистрация', () => {
    test.beforeEach(async ({ app }) => {

        await app.main.gotoRegister();
    });

    test('Пользователь может зарегистрироваться с навигацией через клавиатуру', async ({app}) => {

        const user = new UserBuilder()
            .addName()
            .addEmail()
            .addPassword()
            .generate();

        await app.main.gotoRegister();
        await app.register.register(user);

        await expect(app.register.profileNameField).toContainText(user.name);
    });

    test('Создание статьи',  { tag: '@UI' }, async ({app}) => {

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

        await app.main.gotoRegister();
        await app.register.register(user);
        await app.article.createNewArticle(article);

        await expect(app.article.articleTitle).toContainText(article.title);
        await expect(app.article.articleBody).toContainText(article.body);

        await expect(app.article.articleTags).toContainText(article.tags);
    });

    test('Обновление статьи',{ tag: '@UI' },async ({app}) => {

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

        await app.main.gotoRegister();
        await app.register.register(user);
        await app.article.createNewArticle(article);
        await app.article.updateArticle(article);

        await expect(app.article.articleTitle).toContainText(article.title);
        await expect(app.article.articleBody).toContainText(article.body);
        await expect(app.article.articleTags).toContainText(article.tags);
    });

    test('Добавление комментария',{ tag: '@UI' }, async ({app}) => {

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

        const comment = new ArticleBuilder()
            .addText()

        await app.main.gotoRegister();
        await app.register.register(user);
        await app.article.createNewArticle(article);
        await app.article.newPostComment(comment);

        await expect(app.article.articleComment).toContainText(comment.commentText);
    });

    test('Открытие моей табы', { tag: '@UI' },async ({app}) => {

        const user = new UserBuilder()
            .addName()
            .addEmail()
            .addPassword()
            .generate();

        await app.main.gotoRegister();
        await app.register.register(user);
        await app.article.goToMyTab();

        await expect(app.article.myTab).toBeVisible();
    });

    test('Открытие фаворитной табы',{ tag: '@UI' }, async ({app}) => {

        const user = new UserBuilder()
            .addName()
            .addEmail()
            .addPassword()
            .generate();

        await app.main.gotoRegister();
        await app.register.register(user);
        await app.article.goToFavoriteTab();

        await expect(app.article.favoriteTab).toBeVisible();
    });
});

