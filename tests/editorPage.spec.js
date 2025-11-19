import { expect } from '@playwright/test';
import { test } from '../src/fixtures/index.js'
import { UserBuilder, ArticleBuilder } from "../src/builders/builderUI.js";

test.describe('Посты', () => {
  test.beforeEach(async ({ app }) => {
    await app.mainPage.open();
    const user = UserBuilder.defaultUserFaker();
 
    //создаем экземпляры класса
    await app.mainPage.gotoRegister();
    await app.registerPage.register(user);
    await app.mainPage.newArticleButton.click();
  })

  test('Создание поста', async ({ app }) => {
   
    const article = ArticleBuilder.defaultArticle();

    await app.editorPage.createNewArticle(article);
    
    await expect(app.editorPage.articleTitle).toContainText(article.title);
    //await expect(app.editorPage.textArticle(article.text)).toBeVisible();
  });
  
  test('Удаление поста', async ({ app }) => {
   
    const article = ArticleBuilder.defaultArticle();

    await app.editorPage.createNewArticle(article);

    await expect(app.editorPage.articleTitle).toContainText(article.title);

    await app.editorPage.deleteArticle();

    await expect(app.mainPage.messageText).toContainText('Articles not available.');
  });
})

