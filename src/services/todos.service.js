import { test } from "@playwright/test";

export class TodosService {
  constructor(request) {
    this.request = request;
  }

  async getTodos(token, testinfo, accept) {
    return test.step("GET /todos", async () => {
      const response = await this.request.get(
        `${testinfo.project.use.apiURL}/todos`,
        {
          headers: { "X-CHALLENGER": token,
            "Accept": accept,
          },
        }
      );
      return response;
    });
  }

  async getTodo(token, testinfo) {
    return test.step("GET /todo", async () => {
      const response = await this.request.get(
        `${testinfo.project.use.apiURL}/todo`,
        {
          headers: { "X-CHALLENGER": token },
        }
      );
      return response;
    });
  }

   async getTodosId(token, testinfo, id) {
    return test.step("GET /todos/{id}", async () => {
      const response = await this.request.get(
        `${testinfo.project.use.apiURL}/todos/${id}`,
        {
          headers: { "X-CHALLENGER": token },
        }
      );
      return response;
    });
  }

    async getTodosFilter(token, testinfo) {
    return test.step("GET /todos?doneStatus=true", async () => {
      const response = await this.request.get(
        `${testinfo.project.use.apiURL}/todos?doneStatus=true`,
        {
          headers: { "X-CHALLENGER": token },
        }
      );
      return response;
    });
  }

    async postTodos(token, testinfo, todoData, accept) {
    return test.step("POST todos", async () => {
        const response = await this.request.post(`${testinfo.project.use.apiURL}/todos`, {
        headers: { "X-CHALLENGER": token,
            "Accept": accept,
         },
        data: todoData
    });
        return response;
    });
    }

    async putTodos(token, testinfo, todoData, id) {
    return test.step("put /todos/{id}", async () => {
        const response = await this.request.put(
        `${testinfo.project.use.apiURL}/todos/${id}`,
        {   
            headers: { "X-CHALLENGER": token },
            data: todoData
        }
        );
        return response;
    });
    }

    async postTodosId(token, testinfo, todoData, id) {
    return test.step("post /todos/{id}", async () => {
        const response = await this.request.post(
        `${testinfo.project.use.apiURL}/todos/${id}`,
        {   
            headers: { "X-CHALLENGER": token },
            data: todoData
        }
        );
        return response;
    });
    }

    async putTodosId(token, testinfo, todoData, id) {
    return test.step("put /todos/{id}", async () => {
        const response = await this.request.put(
        `${testinfo.project.use.apiURL}/todos/${id}`,
        {   
            headers: { "X-CHALLENGER": token },
            data: todoData
        }
        );
        return response;
    });
    }

    async deleteTodos(token, testinfo, id) {
    return test.step("delete /todos/{id}", async () => {
        const response = await this.request.delete(
        `${testinfo.project.use.apiURL}/todos/${id}`,
        {   
            headers: { "X-CHALLENGER": token },
        }
        );
        return response;
    });
    }
  }