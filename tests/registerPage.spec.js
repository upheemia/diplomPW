import { test, expect } from '@playwright/test';
import { MainPage , RegisterPage } from '../src/pages/index.js';
import { UserBuilder } from "../src/builders/builderUI.js";

const URL = 'https://realworld.qa.guru/';

test.describe('Регистрация', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
  })
  test('Успешная регистрация пользователя', async ({ page }) => {
    const user = UserBuilder.defaultUserFaker();
    
    const mainPage = new MainPage(page);
    const registerPage = new RegisterPage(page);

    //создаем экземпляры класса
    await mainPage.gotoRegister();
    await registerPage.register(user);

    await expect(mainPage.navigationBar).toContainText(user.name);
  });
})

