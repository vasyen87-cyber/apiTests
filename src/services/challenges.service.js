import axios from "axios";

export class ChallengesService {
    constructor (options){
        this.options = options;
        this.baseURL = options.URL || 'https://apichallenges.herokuapp.com/';
    }
    async get(headers){
        const response1 = await axios.get(`${this.baseURL}challenges`, {headers: headers});
        return response1;
    }
}