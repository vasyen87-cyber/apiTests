import { ArticlePage, MainPage, RegisterPage } from './index';

export class App {
    constructor(page) {
        this.page = page;
        this.article = new ArticlePage(page);
        this.main = new MainPage(page);
        this.register = new RegisterPage(page);
    }
}