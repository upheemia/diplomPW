import { faker } from '@faker-js/faker';

export class UserBuilder {
    constructor() {
      this.name;
      this.email;
      this.password;
      }
  
    withName(name) {
      this.name = name;
      return this;
    }
  
    withEmail(email) {
      this.email = email;
      return this;
    }
  
    withPassword(password) {
      this.password = password;
      return this;
    }
  
    build() {
      return {
        name: this.name,
        email: this.email,
        password: this.password
      };
    }

    // Статические методы для часто используемых сценариев
    static defaultUser() {
        return new UserBuilder()
          .withName("sa")
          .withEmail("ogin@ya.ru")
          .withPassword("password")
          .build();
      }

    static defaultUserFaker() {
        return new UserBuilder()
          .withName(faker.person.firstName())
          .withEmail(faker.internet.email())
          .withPassword(faker.internet.password())
          .build();
      }
  
    static failUser() {
        return new UserBuilder()
          .withEmail(faker.internet.email())
          .withPassword(faker.internet.password())
          .build();
      }
  }

  export class ArticleBuilder {
    constructor() {
      this.title;
      this.description;
      this.text;
      }
  
    withTitle(title) {
      this.title = title;
      return this;
    }
  
    withDescription(description) {
      this.description = description;
      return this;
    }
  
    withText(text) {
      this.text = text;
      return this;
    }
  
    build() {
      return {
        title: this.title,
        description: this.description,
        text: this.text
      };
    }

    // Статические методы для часто используемых сценариев
    static defaultArticle() {
        return new ArticleBuilder()
          .withTitle(faker.internet.password())
          .withDescription(faker.food.fruit())
          .withText(faker.food.description())
          .build();
      }
  }
