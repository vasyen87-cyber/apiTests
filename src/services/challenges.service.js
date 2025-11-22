import {request, test} from "@playwright/test";

export class ChallengesService {
    constructor (options){
        this.options = options;
        this.baseURL = options.URL || 'https://apichallenges.herokuapp.com/';
    }
    async getChallenges(token) {
        return test.step("Получить список заданий get /challenges", async () => {
            const apiRequest = await request.newContext();
            const data1 = await apiRequest.get(`${this.baseURL}challenges`, {
                headers: {
                    "x-challenger": token,
                },
            });
            return data1;
        });
    }

}