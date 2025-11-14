import {request, test} from "@playwright/test";

export class TodoService {
    constructor (request){
        this.request = request;
        this.baseURL = request.URL || 'https://apichallenges.herokuapp.com/';
    }

    async getTodoNotPlural(token) {
        return test.step("Получить список todo GET /todo not plural", async () => {
            const apiRequest = await request.newContext();
            const response = await apiRequest.get(`${this.baseURL}todo`, {
                headers: {
                    "x-challenger": token,
                },
            });
            return response;
        });
    }
}