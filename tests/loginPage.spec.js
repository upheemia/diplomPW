import { test, expect } from '@playwright/test';
import { LoginPage, MainPage } from '../src/pages/index.js';
import { UserBuilder } from "../src/builders/builderUI.js";


const URL = 'https://realworld.qa.guru/';

test.describe('Авторизация', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
  })
  test('Неуспешная авторизация пользователя', async ({ page }) => {
   
    const user = UserBuilder.failUser();
      
    const mainPage = new MainPage(page);
    const loginPage = new LoginPage(page);

    await mainPage.gotoLogin();
    await loginPage.login(user); 
    await expect(loginPage.messageError).toContainText('Email not found sign in first');
  });
})

