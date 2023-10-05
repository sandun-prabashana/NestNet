import axios from "axios";
import Config from "../Config";

export default class AuthService {
    config = new Config();

    userLogin(email, password) {
        return axios.get(this.config.baseUrl + 'login', {
            headers: {
                'email': email,
                'password': password,
            },
        })
    }
}
