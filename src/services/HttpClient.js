import Config from "../Config";
import axios from "axios";

class HttpClient {
    config = new Config();

    get(url, headers) {
        headers['Authorization'] = sessionStorage.getItem("token")
        return axios.get(this.config.baseUrl + url, {headers})
    }

    post(url, body, headers) {
        headers['Authorization'] = sessionStorage.getItem("token")
        return axios.post(this.config.baseUrl + url, body, {headers});
    }

    put(url, body, headers) {
        headers['Authorization'] = sessionStorage.getItem("token")
        return axios.put(this.config.baseUrl + url, body, {headers});
    }

    delete(url, headers) {
        headers['Authorization'] = sessionStorage.getItem("token")
        return axios.delete(this.config.baseUrl + url, {headers});
    }
}

export default HttpClient;
