import { EditorPage, MainPage, RegisterPage, LoginPage } from '../pages/index.js';
export class App {
    constructor(page) {
        this.editorPage = new EditorPage(page);
        this.mainPage = new MainPage(page);
        this.registerPage = new RegisterPage(page);
        this.loginPage = new LoginPage(page);
    }
}