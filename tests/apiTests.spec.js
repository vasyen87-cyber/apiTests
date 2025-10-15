import { test, expect } from "@playwright/test";

test.describe("API challenge", () => {
    let URL = "https://apichallenges.herokuapp.com/";
    let token;

    test.beforeAll(async ({ request }) => {
        // Запросить ключ авторизации
        let response = await request.post(`${URL}challenger`);
        let headers = await response.headers();
        // Передаем токен в тест
        token = headers["x-challenger"];
        // Пример ассерта
        console.log('Это токен'+token);

        expect(headers).toEqual(
            expect.objectContaining({ "x-challenger": expect.any(String) }),
        );
    });

    test("Получить список заданий get /challenges",  { tag: '@API' },async ({ request }) => {
        let response = await request.get(`${URL}challenges`, {
            headers: {
                "x-challenger": token,
            },
        });
        let body = await response.json();
        let headers = await response.headers();
        expect(response.status()).toBe(200);
        expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
        expect(body.challenges.length).toBe(59);
    });


    test("Получить список todo get /todos(200)",  { tag: '@API' },async ({ request }) => {
        let response = await request.get(`${URL}todos`, {
            headers: {
                "x-challenger": token,
            },
        });
        let body = await response.json();
        let headers = await response.headers();
        expect(response.status()).toBe(200);
        expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
        expect(body.todos.length).toBe(10);
    });

    test("Получить список todo GET /todo (404) not plural",  { tag: '@API' },async ({ request }) => {
        let response = await request.get(`${URL}todo`, {
            headers: {
                "x-challenger": token,
            },
        });
        expect(response.status()).toBe(404);
    });

    test("Получить todos/{id} (200)",  { tag: '@API' },async ({ request }) => {
        let response = await request.get(`${URL}todos`, {
            headers: {
                "x-challenger": token,
            },
        });
        let body = await response.json();
        let headers = await response.headers();
        const idTodo = body.todos[0].id;
        let responseId = await request.get(`${URL}todos/${idTodo}`, {
            headers: {
                "x-challenger": token,
            },
        });
        let bodyId = await response.json();
        expect(responseId.status()).toBe(200);
        expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
        expect(bodyId.todos[0].id).toBe(idTodo);
    });

    test("Получить /todos/{id} (404)",  { tag: '@API' },async ({ request }) => {
        let responseId = await request.get(`${URL}todos/15`, {
            headers: {
                "x-challenger": token,
            },
        });
        expect(responseId.status()).toBe(404);
    });

    test("Получить список todo GET /todos (200) ?filter",  { tag: '@API' },async ({ request }) => {
        let response = await request.get(`${URL}todos?doneStatus=true`, {
            headers: {
                "x-challenger": token,
            },
        });
        let body = await response.json();
        let headers = await response.headers();
        expect(response.status()).toBe(200);
        expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
        expect(body.todos.doneStatus).toBeUndefined();
    });

    test("Создать todo POST /todos (201)",  { tag: '@API' },async ({ request }) => {
        const todo = {
            title: "new paper",
            doneStatus: false,
            description: "Новая бумага"
        };
        let response = await request.post(`${URL}todos`, {
            headers: {
                "x-challenger": token,
            },
            data: todo,
        });
        let body = await response.json();
        let headers = await response.headers();
        expect(response.status()).toBe(201);
        expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
        expect(body.doneStatus).toEqual(false);
        expect(body.title).toBe("new paper");
    });

    test("Создать todo POST /todos (400) doneStatus",  { tag: '@API' },async ({ request }) => {
        const todo = {
            //id: 11,
            title: "new paper",
            doneStatus: "false",
            description: "Новая бумага"
        };
        let response = await request.post(`${URL}todos`, {
            headers: {
                "x-challenger": token,
            },
            data: todo,
        });
        let body = await response.json();
        expect(response.status()).toBe(400);
        expect(body.errorMessages[0]).toContain("Failed Validation: doneStatus should be BOOLEAN but was STRING");
    });

    test("Создать todo POST /todos (400) title too long",  { tag: '@API' },async ({ request }) => {
        const todo = {
            //id: 11,
            title: "new papernew papernew papernew papernew papernew papernew papernew papernew papernew papernew papernew papernew papernew papernew paper",
            doneStatus: false,
            description: "Новая бумага"
        };
        let response = await request.post(`${URL}todos`, {
            headers: {
                "x-challenger": token,
            },
            data: todo,
        });
        let body = await response.json();
        expect(response.status()).toBe(400);
        expect(body.errorMessages[0]).toContain("Failed Validation: Maximum allowable length exceeded for title - maximum allowed is 50");
    });

    test("Создать todo POST /todos (400) description too long",  { tag: '@API' },async ({ request }) => {
        const todo = {
            title: "new paper",
            doneStatus: false,
            description: "Новая бумага такая красивая что даже представить себе сложно как это будет выглядеть на фоне красивых домиков, но обязательно посмотреть нужно!!!!!Новая бумага такая красивая что даже представить себе сложно как это будет выглядеть на фоне красивых домиков, но обязательно посмотреть нужно!!!!!"
        };
        let response = await request.post(`${URL}todos`, {
            headers: {
                "x-challenger": token,
            },
            data: todo,
        });
        let body = await response.json();
        expect(response.status()).toBe(400);
        expect(body.errorMessages[0]).toContain("Failed Validation: Maximum allowable length exceeded for description - maximum allowed is 200");
    });

    test("Создать todo POST /todos (201) max out content",  { tag: '@API' },async ({ request }) => {
        const todo = {
            title: "new paper new paper new paper new paper new paper ",
            doneStatus: true,
            description: "Новая бумага такая красивая что даже представить себе сложно как это будет выглядеть на фоне красивых домиков, но обязательно посмотреть нужно!!!!!Новая бумага такая красивая что даже представить себе"
        };
        let response = await request.post(`${URL}todos`, {
            headers: {
                "x-challenger": token,
            },
            data: todo,
        });
        let body = await response.json();
        let headers = await response.headers();
        expect(response.status()).toBe(201);
        expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
        expect(body.doneStatus).toEqual(true);
        expect(body.title).toBe("new paper new paper new paper new paper new paper ");
    });

    test("Создать todo POST /todos (413) content too long",  { tag: '@API' },async ({ request }) => {
        const todo = {
            title: "new paper new paper new paper new paper new paper ",
            doneStatus: true,
            description: "Новая бумага такая красивая что даже представить себе сложно как это будет выглядеть на фоне красивых домиков, но обязательно посмотреть нужно!!!!!Новая бумага такая красивая что даже представить себеНовая бумага такая красивая что даже представить себе сложно как это будет выглядеть на фоне красивых домиков, но обязательно посмотреть нужно!!!!!Новая бумага такая красивая что даже представить себеНовая бумага такая красивая что даже представить себе сложно как это будет выглядеть на фоне красивых домиков, но обязательно посмотреть нужно!!!!!Новая бумага такая красивая что даже представить себеНовая бумага такая красивая что даже представить себе сложно как это будет выглядеть на фоне красивых домиков, но обязательно посмотреть нужно!!!!!Новая бумага такая красивая что даже представить себеНовая бумага такая красивая что даже представить себе сложно как это будет выглядеть на фоне красивых домиков, но обязательно посмотреть нужно!!!!!Новая бумага такая красивая что даже представить себеНовая бумага такая красивая что даже представить себе сложно как это будет выглядеть на фоне красивых домиков, но обязательно посмотреть нужно!!!!!Новая бумага такая красивая что даже представить себеНовая бумага такая красивая что даже представить себе сложно как это будет выглядеть на фоне красивых домиков, но обязательно посмотреть нужно!!!!!Новая бумага такая красивая что даже представить себеНовая бумага такая красивая что даже представить себе сложно как это будет выглядеть на фоне красивых домиков, но обязательно посмотреть нужно!!!!!Новая бумага такая красивая что даже представить себеНовая бумага такая красивая что даже представить себе сложно как это будет выглядеть на фоне красивых домиков, но обязательно посмотреть нужно!!!!!Новая бумага такая красивая что даже представить себеНовая бумага такая красивая что даже представить себе сложно как это будет выглядеть на фоне красивых домиков, но обязательно посмотреть нужно!!!!!Новая бумага такая красивая что даже представить себеНовая бумага такая красивая что даже представить себе сложно как это будет выглядеть на фоне красивых домиков, но обязательно посмотреть нужно!!!!!Новая бумага такая красивая что даже представить себеНовая бумага такая красивая что даже представить себе сложно как это будет выглядеть на фоне красивых домиков, но обязательно посмотреть нужно!!!!!Новая бумага такая красивая что даже представить себеНовая бумага такая красивая что даже представить себе сложно как это будет выглядеть на фоне красивых домиков, но обязательно посмотреть нужно!!!!!Новая бумага такая красивая что даже представить себеНовая бумага такая красивая что даже представить себе сложно как это будет выглядеть на фоне красивых домиков, но обязательно посмотреть нужно!!!!!Новая бумага такая красивая что даже представить себеНовая бумага такая красивая что даже представить себе сложно как это будет выглядеть на фоне красивых домиков, но обязательно посмотреть нужно!!!!!Новая бумага такая красивая что даже представить себеНовая бумага такая красивая что даже представить себе сложно как это будет выглядеть на фоне красивых домиков, но обязательно посмотреть нужно!!!!!Новая бумага такая красивая что даже представить себеНовая бумага такая красивая что даже представить себе сложно как это будет выглядеть на фоне красивых домиков, но обязательно посмотреть нужно!!!!!Новая бумага такая красивая что даже представить себеНовая бумага такая красивая что даже представить себе сложно как это будет выглядеть на фоне красивых домиков, но обязательно посмотреть нужно!!!!!Новая бумага такая красивая что даже представить себеНовая бумага такая красивая что даже представить себе сложно как это будет выглядеть на фоне красивых домиков, но обязательно посмотреть нужно!!!!!Новая бумага такая красивая что даже представить себеНовая бумага такая красивая что даже представить себе сложно как это будет выглядеть на фоне красивых домиков, но обязательно посмотреть нужно!!!!!Новая бумага такая красивая что даже представить себеНовая бумага такая красивая что даже представить себе сложно как это будет выглядеть на фоне красивых домиков, но обязательно посмотреть нужно!!!!!Новая бумага такая красивая что даже представить себеНовая бумага такая красивая что даже представить себе сложно как это будет выглядеть на фоне красивых домиков, но обязательно посмотреть нужно!!!!!Новая бумага такая красивая что даже представить себеНовая бумага такая красивая что даже представить себе сложно как это будет выглядеть на фоне красивых домиков, но обязательно посмотреть нужно!!!!!Новая бумага такая красивая что даже представить себеНовая бумага такая красивая что даже представить себе сложно как это будет выглядеть на фоне красивых домиков, но обязательно посмотреть нужно!!!!!Новая бумага такая красивая что даже представить себеНовая бумага такая красивая что даже представить себе сложно как это будет выглядеть на фоне красивых домиков, но обязательно посмотреть нужно!!!!!Новая бумага такая красивая что даже представить себе"
        };
        let response = await request.post(`${URL}todos`, {
            headers: {
                "x-challenger": token,
            },
            data: todo,
        });
        let body = await response.json();
        expect(response.status()).toBe(413);
        expect(body.errorMessages[0]).toContain("Error: Request body too large, max allowed is 5000 bytes");
    });

    test("Создать todo POST /todos (400) extra",  { tag: '@API' },async ({ request }) => {
        const todo = {
            title: "a title",
            priority: "extra"
            };
        let response = await request.post(`${URL}todos`, {
            headers: {
                "x-challenger": token,
            },
            data: todo,
        });
        let body = await response.json();
        expect(response.status()).toBe(400);
        expect(body.errorMessages[0]).toContain("Could not find field: priority");
    });

    test("Отредактировать задание PUT /todos/{id} ", { tag: '@API' },async ({ request }) => {
        const todo = {
            doneStatus: true,
            description: "реклама",
        };
        let response = await request.put(`${URL}todos/122222`, {
            headers: {
                "x-challenger": token,
            },
            data: todo,
        });
        let body = await response.json();
        console.log(token);
        expect(response.status()).toBe(400);
        expect(body.errorMessages[0]).toContain("Cannot create todo with PUT due to Auto fields id");
    });

    test("Отредактировать todo с POST /todos/{id} (200)",  { tag: '@API' },async ({ request }) => {
        const todo = {
            title: "new paper_test",
            doneStatus: false
        };
        let response = await request.post(`${URL}todos/1`, {
            headers: {
                "x-challenger": token,
            },
            data: todo,
        });
        let body = await response.json();
        let headers = await response.headers();
        expect(response.status()).toBe(200);
        expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
        expect(body.doneStatus).toEqual(false);
        expect(body.title).toBe("new paper_test");
    });

    test("Отредактировать todo с POST /todos/{id} (404)",  { tag: '@API' },async ({ request }) => {
        const todo = {
            title: "new paper_test",
            doneStatus: false
        };
        let response = await request.post(`${URL}todos/100`, {
            headers: {
                "x-challenger": token,
            },
            data: todo,
        });
        let body = await response.json();
        expect(response.status()).toBe(404);
        expect(body.errorMessages[0]).toContain("No such todo entity instance with id == 100 found");
    });

    test("Отредактировать задание PUT /todos/{id} full (200)", { tag: '@API' },async ({ request }) => {
        const todo = {
            title: "new paper_test",
            doneStatus: true,
            description: "реклама",
        };
        let response = await request.put(`${URL}todos/1`, {
            headers: {
                "x-challenger": token,
            },
            data: todo,
        });
        let body = await response.json();
        let headers = await response.headers();
        expect(response.status()).toBe(200);
        expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }))
        expect(body.doneStatus).toEqual(true);
        expect(body.title).toBe("new paper_test");
        expect(body.description).toBe("реклама");
    });

    test("Удалить задание Delete /todos/{id} (200)", { tag: '@API' },async ({ request }) => {
        let response = await request.delete(`${URL}todos/1`, {
            headers: {
                "x-challenger": token,
            }
        });
        let headers = await response.headers();
        expect(response.status()).toBe(200);
        expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }))
    });
});