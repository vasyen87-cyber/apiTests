import { BasePage } from './base.page';
export class MainPage extends BasePage {

    constructor(page) {
        super(page);

        // техническое описание страницы
        this.signupLink = page.getByRole('link', { name: 'Sign up' });
        this.loginLink = page.getByRole('link', { name: 'Login' });
    }
    // бизнесовые действия со страницой

    async gotoRegister() {
        await this.signupLink.click();
    }
}