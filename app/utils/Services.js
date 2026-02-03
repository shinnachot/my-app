import axios from "axios";

export const FetchData = () => {
    return axios("http://localhost:3000/data.json")
        .then(res => {
            return res.data;
        })

}