import { ChallengerService, TodosService } from "./index";

export class Api {
  constructor(request) {
    this.request = request;
    this.challenger = new ChallengerService(request);
    this.todos = new TodosService(request);
  }
}