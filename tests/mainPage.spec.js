import { test, expect } from '@playwright/test';
import { MainPage , RegisterPage } from '../src/pages/index.js';
import { UserBuilder } from "../src/builders/builderUI.js";

const URL = 'https://realworld.qa.guru/';

test.describe.skip('Начальная страница', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
    const user = UserBuilder.defaultUserFaker();
    
    const mainPage = new MainPage(page);
    const registerPage = new RegisterPage(page);

    await mainPage.gotoRegister();
    await registerPage.register(user);
  })

  test('Отображение пустой страницы "Your Feed"', async ({ page }) => {

    //создаем экземпляры класса
    const mainPage = new MainPage(page);

    await mainPage.yourFeedButton.click();
    await expect(mainPage.messageText).toContainText('Articles not available.');
  });
})

