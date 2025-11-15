import { test, expect } from "@playwright/test";
import { Api } from "../src/services/api.service";
//import { test as api} from "../src/fixtures/fixture";
import { TodoBuilder } from "../src/builders/builder";

let token;

test.describe("API tests", () => {
  test.beforeAll(async ({ request }, testinfo) => {
    const api = new Api(request); //нужно спрятать в фикстуры 
    let r = await api.challenger.post(testinfo);
    const headers = r.headers();
    console.log(`${testinfo.project.use.apiURL}${headers.location}`);
    token = headers["x-challenger"];
  });
  //эта фикстура не сработала
  // test.only("Получить статус 200 от /todos", { tag: '@API' }, async ({ api, request }, testinfo) => {
  //   let response = await api.todos.getTodos(token, testinfo);
  //   let body = await response.json();
  //   expect(body.todos.length).toBe(10);
  //   expect(response.status()).toBe(200);
  // });
  test("Получить статус 200 от /todos/{id}", { tag: '@API' }, async ({ request }, testinfo) => {
    const api = new Api(request); //нужно спрятать в фикстуры 
    let response = await api.todos.getTodos(token, testinfo);
    let body = await response.json();
    const id = body.todos[0].id;
    let responseId = await api.todos.getTodosId(token, testinfo, id);
    expect(responseId.status()).toBe(200);
    expect(body.todos[0].id).toBe(id);
  });
  test("Получить статус 200 от /todos?doneStatus=true", { tag: '@API' }, async ({ request }, testinfo) => {
    const api = new Api(request); //нужно спрятать в фикстуры 
    let response = await api.todos.getTodosFilter(token, testinfo);
    let body = await response.json();
    let sortBody = body.todos.filter((element) => element.doneStatus === false);
    expect(response.status()).toBe(200);
    expect(sortBody.length).toBe(0);
  });
  test("Получить статус 400 от PUT /todos/{id}", { tag: '@API' }, async ({ request }, testinfo) => {
    let id = -1;
    const api = new Api(request); //нужно спрятать в фикстуры 
    const todoData = new TodoBuilder()
    .withTitle("title")
    .build();
    let response = await api.todos.putTodosId(token, testinfo, todoData, id);
    const body = await response.json();
    expect(response.status()).toBe(400);
    expect(body.errorMessages[0]).toEqual('Cannot create todo with PUT due to Auto fields id')
  });
  test("Получить статус 406 от POST /todos c gzip", { tag: '@API' }, async ({ request }, testinfo) => {
    const api = new Api(request); //нужно спрятать в фикстуры 
    let accept = 'application/gzip';
    const todoData = TodoBuilder.defaultTodo();
    let response = await api.todos.postTodos(token, testinfo, todoData, accept);
    const body = await response.json();
    expect(response.status()).toBe(406); 
    expect(body.errorMessages[0]).toEqual('Unrecognised Accept Type')
  }); 
  test("Получить статус 401 от DELETE /todos ", { tag: '@API' }, async ({ request }, testinfo) => {
    const api = new Api(request);
    let response = await api.todos.getTodos(token, testinfo);
    const body = await response.json();
    let bodyTodos = body.todos;
    expect(response.status()).toBe(200);

    if (bodyTodos.length > 0) {
        for (let todo of bodyTodos) {
            await api.todos.deleteTodos(token, testinfo, todo.id);
        }
    }

    // Проверяем что все удалено
    let responseAfterDelete = await api.todos.getTodos(token, testinfo);
    let { todos } = await responseAfterDelete.json();
    expect(todos.length).toBe(0);
});
});