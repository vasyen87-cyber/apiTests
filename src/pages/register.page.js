
export class RegisterPage {
    constructor(page) {
        // техническое описание страницы
        this.emailInput = page.getByRole('textbox', { name: 'Email' });
        this.nameInput = page.getByRole('textbox', { name: 'Your Name' });
        this.passwordInput = page.getByRole('textbox', { name: 'Password' });
        this.signupButton = page.getByRole('button', { name: 'Sign Up' });
        this.profileNameField = page.getByRole('navigation');
    }
    // бизнесовые действия со страницой
    async register(user) {
        const { name, email, password } = user;
        await this.nameInput.click();
        await this.nameInput.fill(name);
        await this.emailInput.click();
        await this.emailInput.fill(email);
        await this.passwordInput.click();
        await this.passwordInput.fill(password);
        await this.signupButton.click();
    }
}