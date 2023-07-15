import Axios from 'axios'
import MockAdapter from "axios-mock-adapter";

const mockAxios = new MockAdapter(Axios);

const BASE_URL = "https://www.call2all.co.il/ym/api/";

const standard_success_object = {
    yemotAPIVersion: 6,
    responseStatus: "OK"
};

export const mocks = () => {

    mockAxios.onPost(BASE_URL + "Login").reply(200, {
        token: "gvUp4a7s3xe3Rd",
        ...standard_success_object
    });

    mockAxios.onPost(BASE_URL + "Logout").reply(200, {
        message: "logout successful",
        ...standard_success_object
    });

    mockAxios.onPost(BASE_URL + "SetPassword").reply(200, {
        ...standard_success_object
    });

    mockAxios.onPost(BASE_URL + "GetSession").reply(200, {

        "name": "0773137770",
        "units": 0.0,
        "unitsExpireDate": "2023-07-06",
        "email": "0773137770",
        "organization": "",
        "contactName": "",
        "phones": "",
        "invoiceName": "",
        "invoiceAddress": "",
        "fax": "",
        "accessPassword": null,
        "recordPassword": null,
        "creditFile": "Yemot",
        "username": "0773137770",
        ...standard_success_object
    });


};
