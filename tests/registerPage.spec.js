import { expect } from '@playwright/test';
import { test } from '../src/fixtures/index.js'
import { UserBuilder } from "../src/builders/builderUI.js";

test.describe.only('Регистрация', () => {
  test.beforeEach(async ({ app }) => {
    await app.mainPage.open();
  })
  test('Успешная регистрация пользователя', async ({ app }) => {
    const user = UserBuilder.defaultUserFaker();

    await app.mainPage.gotoRegister();
    await app.registerPage.register(user);

    await expect(app.mainPage.navigationBar).toContainText(user.name);
  });
})

