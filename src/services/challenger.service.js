import {request} from "@playwright/test";

export class ChallengerService {
    constructor (options){
        this.options = options;
        this.baseURL = options.URL || 'https://apichallenges.herokuapp.com/';
    }

    async post(token){
        const apiRequest = await request.newContext();
        const response1 = await apiRequest.post(`${this.baseURL}challenger`, {
            headers: {
                "x-challenger": token,
            },
        });
        return response1;
    }
}