import { test, expect } from '@playwright/test';
import { EditorPage, MainPage, RegisterPage } from '../src/pages/index.js';
//import { test, expect } from '../src/fixtures/index.js'
import { UserBuilder, ArticleBuilder } from "../src/builders/builderUI.js";


const URL = 'https://realworld.qa.guru/';

test.describe('Посты', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
    const user = UserBuilder.defaultUserFaker();
    
    const mainPage = new MainPage(page);
    const registerPage = new RegisterPage(page);

    //создаем экземпляры класса
    await mainPage.gotoRegister();
    await registerPage.register(user);
    await mainPage.newArticleButton.click();
  })

  test('Создание поста', async ({ page }) => {
   
    const article = ArticleBuilder.defaultArticle();

    const editorPage = new EditorPage(page);

    await editorPage.createNewArticle(article);
    
    await expect(editorPage.articleTitle).toContainText(article.title);
  });
  
  test('Удаление поста', async ({page }) => {
   
    const article = ArticleBuilder.defaultArticle();

    const editorPage = new EditorPage(page);
    const mainPage = new MainPage(page);
    
    await editorPage.createNewArticle(article);

    await expect(editorPage.articleTitle).toContainText(article.title);

    await editorPage.deleteArticle();

    await expect(mainPage.messageText).toContainText('Articles not available.');
  });
})

