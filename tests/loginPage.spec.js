import { expect } from '@playwright/test';
import { test } from '../src/fixtures/index.js'
import { UserBuilder } from "../src/builders/builderUI.js";

test.describe('Авторизация', () => {
  test.beforeEach(async ({ app }) => {
    await app.mainPage.open();
  })
  test('Неуспешная авторизация пользователя', async ({ app }) => {
   
    const user = UserBuilder.failUser();

    await app.mainPage.gotoLogin();
    await app.loginPage.login(user); 
    await expect(app.loginPage.messageError).toContainText('Email not found sign in first');
  });
})

