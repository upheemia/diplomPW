import { title } from "process";

export class EditorPage {
    constructor(page) {
        this.page = page;
        this.createArticleTitle = page.getByRole('textbox', { name: 'Article Title' });
        this.createArticleDescription = page.getByRole('textbox', { name: 'What\'s this article about?' });
        this.createArticleText = page.getByRole('textbox', { name: 'Write your article (in' });
        this.createArticleButton = page.getByRole('button', { name: 'Publish Article' });
        this.articleTitle = page.getByRole('heading');
        this.editButton = page.getByRole('button').filter({hasText : ' Edit Article'}).first();
        this.updateButton = page.getByRole('button', { name: 'Update Article' });
        this.deleteArticleButton = page.getByRole('button').filter({hasText : ' Delete Article'}).first();
        //this.textArticle = page.getByText(text);
    }

    async createNewArticle(article) {
        const { title , description , text } = article;
        await this.createArticleTitle.fill(title);
        await this.createArticleDescription.fill(description);
        await this.createArticleText.fill(text);
        await this.createArticleButton.click();
    }

    async deleteArticle() {

        this.page.once('dialog', dialog => {
        console.log(`Dialog message: ${dialog.message()}`);
        dialog.accept();
        });

        await this.deleteArticleButton.click();
    }

}