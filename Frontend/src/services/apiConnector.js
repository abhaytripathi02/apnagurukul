import axios from "axios";

export const axiosInstance = axios.create();


// const response = axiosInstance({method: 'GET', url: 'http://localhost', data: {}, headers: {'Content-Type': 'application/json'}});


export const  apiConnector = (method, url, bodyData, headers, params) => {
    
    return axiosInstance({
        method: `${method}`,
        url: `${url}`,
        data: bodyData ? bodyData : null,
        headers: headers ? headers : { "Access-Control-Allow-Origin": "*" }, 
        params: params ? params : null,
    });
}