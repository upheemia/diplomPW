import { test } from '@playwright/test';

export class MainPage {
    constructor(page) {
        this.page = page;
        this.singUpLink = page.getByRole('link', { name: 'Sign up' });
        this.loginLink = page.getByRole('link', { name: 'Login' });
        this.navigationBar = page.getByRole('navigation');
        this.yourFeedButton = page.getByRole('button', { hasText: 'Your Feed' });
        this.messageText = page.getByText('Articles not available.');
        this.newArticleButton = page.getByRole('link').filter({ hasText: 'New Article' });

    }

    async gotoRegister() {
        await this.singUpLink.click();
    }

    async gotoLogin() {
       await this.loginLink.click();
    }

	async open() {
		return test.step(`Переход на страницу {$URL}`, async (step) => {
			await this.page.goto('/');
		});
	}
}
