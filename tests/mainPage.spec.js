import { expect } from '@playwright/test';
import { test } from '../src/fixtures/index.js'
import { UserBuilder } from "../src/builders/builderUI.js";

test.describe('Начальная страница', () => {
  test.beforeEach(async ({ app }) => {
    await app.mainPage.open();
    const user = UserBuilder.defaultUserFaker();

    await app.mainPage.gotoRegister();
    await app.registerPage.register(user);
  })

  test('Отображение пустой страницы "Your Feed"', async ({ app }) => {

    await app.mainPage.yourFeedButton.click();
    await expect(app.mainPage.messageText).toContainText('Articles not available.');
  });
})

