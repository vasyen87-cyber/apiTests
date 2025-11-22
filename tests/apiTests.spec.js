import {expect} from "@playwright/test";
import {test} from "../src/fixtures/fixture";

test.describe("API challenge", () => {
    let token;

    test.beforeAll(async ({api}) => {
        const response = await api.challenger.post(token);
        const headers = response.headers();

        token = headers["x-challenger"];

    });

    test("Получить список заданий get /challenges", {tag: '@API'}, async ({api}) => {

        const response = await api.challenges.getChallenges(token);
        const body = await response.json();

        expect(response.status()).toBe(200);
        expect(response.headers()).toEqual(expect.objectContaining({"x-challenger": token}));
        expect(body.challenges.length).toBe(59);
    });


    test("Получить список todo get /todos(200)", {tag: '@API'}, async ({api}) => {

        const response = await api.todos.getTodos(token)
        const body = await response.json();

        expect(response.status()).toBe(200);
        expect(response.headers()).toEqual(expect.objectContaining({"x-challenger": token}));
        expect(body.todos.length).toBe(10);
    });

    test("Получить список todo GET /todo not plural", {tag: '@API'}, async ({api}) => {


        const response = await api.todo.getTodoNotPlural(token);

        expect(response.status()).toBe(404);
    });

    test("Получить todos/{id} (200)", {tag: '@API'}, async ({api}) => {


        const response = await api.todos.getTodosById(token);
        const body = await response.json();

        expect(response.status()).toBe(200);
        expect(response.headers()).toEqual(expect.objectContaining({"x-challenger": token}));
        expect(body.todos[0].id).toBe(5);
    });

    test("Получить /todos/{id} (404)", {tag: '@API'}, async ({api}) => {


        const response = await api.todos.getTodosByIdNegative(token);

        expect(response.status()).toBe(404);
    });

    test("Получить список todo GET /todos (200) ?filter", {tag: '@API'}, async ({api}) => {


        const response = await api.todos.getTodosByIdWithFilter(token);
        const body = await response.json();

        expect(response.status()).toBe(200);
        expect(response.headers()).toEqual(expect.objectContaining({"x-challenger": token}));
        expect(body.todos.doneStatus).toBeUndefined();
    });

    test("Создать todo POST /todos (201)", {tag: '@API'}, async ({api}) => {

        const todo = {
            title: "new paper",
            doneStatus: false,
            description: "Новая бумага"
        };


        const response = await api.todos.postTodos(token, todo);

        const body = await response.json();
        expect(response.status()).toBe(201);
        expect(response.headers()).toEqual(expect.objectContaining({"x-challenger": token}));
        expect(body.doneStatus).toEqual(false);
        expect(body.title).toBe("new paper");
        expect(body.description).toBe("Новая бумага");
    });

    test("Создать todo POST /todos (400) doneStatus", {tag: '@API'}, async ({api}) => {

        const todo = {
            title: "new paper",
            doneStatus: "false",
            description: "Новая бумага"
        };


        const response = await api.todos.postTodos(token, todo);

        const body = await response.json();
        expect(response.status()).toBe(400);
        expect(body.errorMessages[0]).toContain("Failed Validation: doneStatus should be BOOLEAN but was STRING");
    });

    test("Создать todo POST /todos (400) title too long", {tag: '@API'}, async ({api}) => {

        const todo = {
            title: "new papernew papernew papernew papernew papernew papernew papernew papernew papernew papernew papernew papernew papernew papernew paper",
            doneStatus: false,
            description: "Новая бумага"
        };


        const response = await api.todos.postTodos(token, todo);

        const body = await response.json();
        expect(response.status()).toBe(400);
        expect(body.errorMessages[0]).toContain("Failed Validation: Maximum allowable length exceeded for title - maximum allowed is 50");
    });

    test("Создать todo POST /todos (400) description too long", {tag: '@API'}, async ({api}) => {

        const todo = {
            title: "new paper",
            doneStatus: false,
            description: "Новая бумага такая красивая что даже представить себе сложно как это будет выглядеть на фоне красивых домиков, но обязательно посмотреть нужно!!!!!Новая бумага такая красивая что даже представить себе сложно как это будет выглядеть на фоне красивых домиков, но обязательно посмотреть нужно!!!!!"
        };


        const response = await api.todos.postTodos(token, todo);

        const body = await response.json();
        expect(response.status()).toBe(400);
        expect(body.errorMessages[0]).toContain("Failed Validation: Maximum allowable length exceeded for description - maximum allowed is 200");
    });

    test("Создать todo POST /todos (201) max out content", {tag: '@API'}, async ({api}) => {

        const todo = {
            title: "new paper new paper new paper new paper new paper ",
            doneStatus: true,
            description: "Новая бумага такая красивая что даже представить себе сложно как это будет выглядеть на фоне красивых домиков, но обязательно посмотреть нужно!!!!!Новая бумага такая красивая что даже представить себе"
        };


        const response = await api.todos.postTodos(token, todo);

        const body = await response.json();
        const headers = await response.headers();
        expect(response.status()).toBe(201);
        expect(headers).toEqual(expect.objectContaining({"x-challenger": token}));
        expect(body.doneStatus).toEqual(true);
        expect(body.title).toBe("new paper new paper new paper new paper new paper ");
    });

    test("Создать todo POST /todos (413) content too long", {tag: '@API'}, async ({api}) => {

        const todo = {
            title: "new paper new paper new paper new paper new paper ",
            doneStatus: true,
            description: "Новая бумага такая красивая что даже представить себе сложно как это будет выглядеть на фоне красивых домиков, но обязательно посмотреть нужно!!!!!Новая бумага такая красивая что даже представить себеНовая бумага такая красивая что даже представить себе сложно как это будет выглядеть на фоне красивых домиков, но обязательно посмотреть нужно!!!!!Новая бумага такая красивая что даже представить себеНовая бумага такая красивая что даже представить себе сложно как это будет выглядеть на фоне красивых домиков, но обязательно посмотреть нужно!!!!!Новая бумага такая красивая что даже представить себеНовая бумага такая красивая что даже представить себе сложно как это будет выглядеть на фоне красивых домиков, но обязательно посмотреть нужно!!!!!Новая бумага такая красивая что даже представить себеНовая бумага такая красивая что даже представить себе сложно как это будет выглядеть на фоне красивых домиков, но обязательно посмотреть нужно!!!!!Новая бумага такая красивая что даже представить себеНовая бумага такая красивая что даже представить себе сложно как это будет выглядеть на фоне красивых домиков, но обязательно посмотреть нужно!!!!!Новая бумага такая красивая что даже представить себеНовая бумага такая красивая что даже представить себе сложно как это будет выглядеть на фоне красивых домиков, но обязательно посмотреть нужно!!!!!Новая бумага такая красивая что даже представить себеНовая бумага такая красивая что даже представить себе сложно как это будет выглядеть на фоне красивых домиков, но обязательно посмотреть нужно!!!!!Новая бумага такая красивая что даже представить себеНовая бумага такая красивая что даже представить себе сложно как это будет выглядеть на фоне красивых домиков, но обязательно посмотреть нужно!!!!!Новая бумага такая красивая что даже представить себеНовая бумага такая красивая что даже представить себе сложно как это будет выглядеть на фоне красивых домиков, но обязательно посмотреть нужно!!!!!Новая бумага такая красивая что даже представить себеНовая бумага такая красивая что даже представить себе сложно как это будет выглядеть на фоне красивых домиков, но обязательно посмотреть нужно!!!!!Новая бумага такая красивая что даже представить себеНовая бумага такая красивая что даже представить себе сложно как это будет выглядеть на фоне красивых домиков, но обязательно посмотреть нужно!!!!!Новая бумага такая красивая что даже представить себеНовая бумага такая красивая что даже представить себе сложно как это будет выглядеть на фоне красивых домиков, но обязательно посмотреть нужно!!!!!Новая бумага такая красивая что даже представить себеНовая бумага такая красивая что даже представить себе сложно как это будет выглядеть на фоне красивых домиков, но обязательно посмотреть нужно!!!!!Новая бумага такая красивая что даже представить себеНовая бумага такая красивая что даже представить себе сложно как это будет выглядеть на фоне красивых домиков, но обязательно посмотреть нужно!!!!!Новая бумага такая красивая что даже представить себеНовая бумага такая красивая что даже представить себе сложно как это будет выглядеть на фоне красивых домиков, но обязательно посмотреть нужно!!!!!Новая бумага такая красивая что даже представить себеНовая бумага такая красивая что даже представить себе сложно как это будет выглядеть на фоне красивых домиков, но обязательно посмотреть нужно!!!!!Новая бумага такая красивая что даже представить себеНовая бумага такая красивая что даже представить себе сложно как это будет выглядеть на фоне красивых домиков, но обязательно посмотреть нужно!!!!!Новая бумага такая красивая что даже представить себеНовая бумага такая красивая что даже представить себе сложно как это будет выглядеть на фоне красивых домиков, но обязательно посмотреть нужно!!!!!Новая бумага такая красивая что даже представить себеНовая бумага такая красивая что даже представить себе сложно как это будет выглядеть на фоне красивых домиков, но обязательно посмотреть нужно!!!!!Новая бумага такая красивая что даже представить себеНовая бумага такая красивая что даже представить себе сложно как это будет выглядеть на фоне красивых домиков, но обязательно посмотреть нужно!!!!!Новая бумага такая красивая что даже представить себеНовая бумага такая красивая что даже представить себе сложно как это будет выглядеть на фоне красивых домиков, но обязательно посмотреть нужно!!!!!Новая бумага такая красивая что даже представить себеНовая бумага такая красивая что даже представить себе сложно как это будет выглядеть на фоне красивых домиков, но обязательно посмотреть нужно!!!!!Новая бумага такая красивая что даже представить себеНовая бумага такая красивая что даже представить себе сложно как это будет выглядеть на фоне красивых домиков, но обязательно посмотреть нужно!!!!!Новая бумага такая красивая что даже представить себеНовая бумага такая красивая что даже представить себе сложно как это будет выглядеть на фоне красивых домиков, но обязательно посмотреть нужно!!!!!Новая бумага такая красивая что даже представить себе"
        };


        const response = await api.todos.postTodos(token, todo);

        const body = await response.json();
        expect(response.status()).toBe(413);
        expect(body.errorMessages[0]).toContain("Error: Request body too large, max allowed is 5000 bytes");
    });

    test("Создать todo POST /todos (400) extra", {tag: '@API'}, async ({api}) => {

        const todo = {
            title: "a title",
            priority: "extra"
        };


        const response = await api.todos.postTodos(token, todo);

        const body = await response.json();
        expect(response.status()).toBe(400);
        expect(body.errorMessages[0]).toContain("Could not find field: priority");
    });

    test("Отредактировать задание PUT /todos/{id} ", {tag: '@API'}, async ({api}) => {

        const todo = {
            doneStatus: true,
            description: "реклама",
        };


        const response = await api.todos.putTodos(token, todo, '122222');

        const body = await response.json();
        expect(response.status()).toBe(400);
        expect(body.errorMessages[0]).toContain("Cannot create todo with PUT due to Auto fields id");
    });

    test("Отредактировать todo с POST /todos/{id} (200)", {tag: '@API'}, async ({api}) => {

        const todo = {
            title: "new paper_test",
            doneStatus: false
        };


        const response = await api.todos.postTodoswithId(token, todo, '1');

        const body = await response.json();
        const headers = await response.headers();
        expect(response.status()).toBe(200);
        expect(headers).toEqual(expect.objectContaining({"x-challenger": token}));
        expect(body.doneStatus).toEqual(false);
        expect(body.title).toBe("new paper_test");
    });

    test("Отредактировать todo с POST /todos/{id} (404)", {tag: '@API'}, async ({api}) => {

        const todo = {
            title: "new paper_test",
            doneStatus: false
        };


        const response = await api.todos.postTodoswithId(token, todo, '100');

        const body = await response.json();
        expect(response.status()).toBe(404);
        expect(body.errorMessages[0]).toContain("No such todo entity instance with id == 100 found");
    });

    test("Отредактировать задание PUT /todos/{id} full (200)", {tag: '@API'}, async ({api}) => {

        const todo = {
            title: "new paper_test",
            doneStatus: true,
            description: "реклама",
        };


        const response = await api.todos.putTodos(token, todo, '1');

        const body = await response.json();
        const headers = await response.headers();
        expect(response.status()).toBe(200);
        expect(headers).toEqual(expect.objectContaining({"x-challenger": token}))
        expect(body.doneStatus).toEqual(true);
        expect(body.title).toBe("new paper_test");
        expect(body.description).toBe("реклама");
    });

    test("Удалить задание Delete /todos/{id} (200)", {tag: '@API'}, async ({api}) => {

        const response = await api.todos.deleteTodos(token, '1');

        const headers = await response.headers();
        expect(response.status()).toBe(200);
        expect(headers).toEqual(expect.objectContaining({"x-challenger": token}))
    });
});