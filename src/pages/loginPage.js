export class LoginPage {
    constructor(page) {
        this.emailInput = page.getByRole('textbox', { name: 'Email' });
        this.passwordInput = page.getByRole('textbox', { name: 'Password' });
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.messageError = page.getByText('Email not found sign in first');
    }
    async login(user) {
        const { email , password } = user;
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
}