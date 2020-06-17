const axios = require("axios").default;
const qs = require("qs");
const FormData = require("form-data");

const yemot_con = axios.create({
	baseURL: "https://www.call2all.co.il/ym/api/",
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
	 * @param {AxiosRequestConfig} options
	 * 
	 * @returns {promise}
	 */
	async function exec(method, parameters = {}, options = {}) {

		if (!is_connect && method !== "Login") {
			await login();
		}

		if (method !== "Login") {

			parameters.token = token;
		}

		let data;

		if (method === "DownloadFile") {

			options.headers = { "Content-Type": "application/x-www-form-urlencoded" };
			options.responseType = options.responseType || "arraybuffer";

			data = qs.stringify(parameters);

		} else if (method === "UploadFile") {

			const form = new FormData();

			for (const parameter of Object.entries(parameters)) {

				if (typeof parameter[1] == "object") {
					form.append(parameter[0], parameter[1].value, parameter[1].options);
				} else {
					form.append(parameter[0], parameter[1]);
				}
			}

			options.headers = form.getHeaders();

			data = form.getBuffer();

		} else {

			options.headers = { "Content-Type": "application/x-www-form-urlencoded" };

			data = qs.stringify(parameters);
		}

		try {
			let res = await yemot_con.post("/" + method, data, options);

			if (res.data.responseStatus && res.data.responseStatus === "EXCEPTION" &&
				res.data.message === "IllegalStateException(session token is invalid)") {
				await login();

				return await exec(method, data, options);
			}

			return res;


		} catch (error) {

			if (error.response.status == 404) {
				throw (error.response.data);

			} else if (error.response.data ==
				"Exception IllegalStateException (session is expired) thrown") {
				await login();

				return await exec(method, data, options)
			} else {

				throw (error);
			}
		}

	}

	async function login() {

		const parm = { username, password };

		const res = await exec("Login", parm);

		if (res.data.responseStatus !== "OK") {

			throw (res.data.responseStatus + ": " + res.data.message);
		}

		token = res.data.token;

		is_connect = true;
	}

	this.exec = exec;
}

module.exports = yemot_api;