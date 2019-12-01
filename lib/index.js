const request = require("request-promise-native");

const base_url = new URL("https://www.call2all.co.il/ym/api/");

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
	 * @param {object} options 
	 * 
	 * @returns {promise}
	 */
	async function exec(method, options = {}) {

		if (!is_connect && method !== "Login") {
			await login();
		}

		const url = base_url + method;

		if (method !== "Login") {

			options.token = token;
		}

		let o;

		if (method === "DownloadFile") {

			o = { form: options, json: false };

		} else if (method === "UploadFile") {

			o = { formData: options, json: true };

		} else {

			o = { form: options, json: true };
		}

		const r = request.post(url, o);

		return r;
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