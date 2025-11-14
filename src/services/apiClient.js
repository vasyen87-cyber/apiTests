import { ChallengerService, ChallengesService, TodosService, TodoService } from './index';

export class ApiClient {
    constructor (options) {
        const defaultOptions = {
            URL: "https://apichallenges.herokuapp.com/",
        }
        const mergeOptions = {
            ...defaultOptions,
            ...options,
        }
        this.challenger = new ChallengerService(mergeOptions);
        this.challenges = new ChallengesService(mergeOptions);
        this.todos = new TodosService(mergeOptions);
        this.todo = new TodoService(mergeOptions);
    };

    static async loginAs(){
        const client = this.unauthorized();
        //Авторизация

        const { headers } = await client.challenger.post();
        const token = headers["x-challenger"]


        return new ApiClient({token});
    }

    static unauthorized(){
        return new ApiClient();
    }
}