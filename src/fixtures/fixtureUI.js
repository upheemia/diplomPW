import { test as base } from '@playwright/test';
import { EditorPage, MainPage } from '../pages/index.js';

export const test = base.extend({
  editorPage: async ({ page }, use) => {
    const editorPage = new EditorPage(page);
    await use(editorPage);
  },

  mainPage: async ({ page }, use) => {
    const mainPage = new MainPage(page);
    await use(mainPage);
  },
});