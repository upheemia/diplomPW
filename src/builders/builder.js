import { faker } from '@faker-js/faker';

export class TodoBuilder {
  constructor() {
    this.title;
    this.doneStatus;
    this.description;
    this.testPriority;
    }

  withTitle(title) {
    this.title = title;
    return this;
  }

  withDoneStatus(doneStatus) {
    this.doneStatus = doneStatus;
    return this;
  }

  withDescription(description) {
    this.description = description;
    return this;
  }

  withTestPriority(testPriority) {
    this.testPriority = testPriority;
    return this;
  }

  build() {
    return {
      title: this.title,
      doneStatus: this.doneStatus,
      description: this.description,
      testPriority: this.testPriority
    };
  }

  // Статические методы для часто используемых сценариев
  static defaultTodo() {
    return new TodoBuilder()
    .withTitle(faker.food.description())
    .withDoneStatus(faker.datatype.boolean())
    .withDescription(faker.food.description())
    .withTestPriority()
    .build();
  }
}