import axios from "axios";
import { request } from '@playwright/test';
import { test } from "@playwright/test";

export class TodosService {
    constructor (options){
        this.options = options;
        this.baseURL = options.URL || 'https://apichallenges.herokuapp.com/';
    }

    async getTodos(token) {
        return test.step("Получить список todo get /todos", async () => {
            const data1 = await axios.get(`${this.baseURL}todos`, {
                headers: {
                    "x-challenger": token,
                },
            });
            return data1;
     });
    }

    async getTodosById(token) {
        return test.step("Получить todos/{id}", async () => {
            const data1 = await axios.get(`${this.baseURL}todos/5`, {
                headers: {
                    "x-challenger": token,
                },
            });
            return data1;
        });
    }

    async getTodosByIdNegative(token) {
        return test.step("Получить todos/{id}", async () => {
            const apiRequest = await request.newContext();
            const data1 = await apiRequest.get(`${this.baseURL}todos/15`, {
                headers: {
                    "x-challenger": token,
                },
            });
            return data1;
        });
    }

    async getTodosByIdWithFilter(token) {
        return test.step("Получить список todo GET /todos ?filter", async () => {
            const data1 = await axios.get(`${this.baseURL}todos?doneStatus=true`, {
                headers: {
                    "x-challenger": token,
                },
            });
            return data1;
        });
    }

    async postTodos(token, todo) {
        return test.step("Создать todo POST /todos", async () => {
            const apiRequest = await request.newContext();
            const data1 = await apiRequest.post(`${this.baseURL}todos`, {
                headers: {
                    "x-challenger": token,
                },
                data: todo,
            });
            return data1;
        });
    }

    async postTodoswithId(token, todo, id) {
        return test.step("Изменить todo POST /todos", async () => {
            const apiRequest = await request.newContext();
            const data1 = await apiRequest.post(`${this.baseURL}todos/${id}`, {
                headers: {
                    "x-challenger": token,
                },
                data: todo,
            });
            return data1;
        });
    }

    async putTodos(token, todo, id) {
        return test.step("Изменить todo PUT /todos", async () => {
            const apiRequest = await request.newContext();
            const data1 = await apiRequest.put(`${this.baseURL}todos/${id}`, {
                headers: {
                    "x-challenger": token,
                },
                data: todo,
            });
            return data1;
        });
    }

    async deleteTodos(token, id) {
        return test.step("Удалить todo delete /todos (201)", async () => {
            const apiRequest = await request.newContext();
            const data1 = await apiRequest.delete(`${this.baseURL}todos/${id}`, {
                headers: {
                    "x-challenger": token,
                },
            });
            return data1;
        });
    }
}