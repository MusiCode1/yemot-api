const axios = require("axios").default;
const qs = require("qs");
const FormData = require("form-data");

const yemot_con = axios.create({
	baseURL: "https://www.call2all.co.il/ym/api/",
	responseType: "json",
	maxContentLength: Infinity
});

/**
 * 
 * @constructor 
 * @param {string} username 
 * @param {string} password 
 * 
 */
function yemot_api(username, password) {

	let token;
	let is_connect = false;

	/**
	 * 
	 * @param {string} method 
	 * @param {object} parameters 
	 * 
	 * @returns {promise}
	 */
	async function exec(method, parameters = {}) {

		if (!is_connect && method !== "Login") {
			await login();
		}

		if (method !== "Login") {

			parameters.token = token;
		}

		let r;

		if (method === "DownloadFile") {

			r = await yemot_con.post("/" + method, qs.stringify(parameters), {

				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				responseType: "blob",
			});

		} else if(method === "UploadFile") {

			const form = new FormData();

			for (const parameter of Object.entries( parameters) ){
				
				if (parameter[0] == "file") {
					form.append(parameter[0], parameter[1].value, parameter[1].options);
				} else {
					form.append(parameter[0], parameter[1]);
				}
			}

			r = await yemot_con.post("/" + method, form.getBuffer(), {

				headers: form.getHeaders(),
				responseType: "json",
			});

		} else {

			r = await yemot_con.post("/" + method, qs.stringify(parameters), {

				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				responseType: "json",
			});
		}

		return r.data;
	}

	async function login() {

		const parm = { username, password };

		const res = await exec("Login", parm);

		if (res.responseStatus !== "OK") {

			throw (res.responseStatus + ": " + res.message);
		}

		token = res.token;

		is_connect = true;
	}

	this.exec = exec;
}

module.exports = yemot_api;