import axios from "axios";

export class ChallengerService {
    constructor (options){
        this.options = options;
        this.baseURL = options.URL || 'https://apichallenges.herokuapp.com/';
    }

    async post(){
        const response1 = await axios.post(`${this.baseURL}challenger`);
        return response1;
    }
}