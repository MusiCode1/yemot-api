const request = require("request-promise-native");

const base_url = new URL("https://www.call2all.co.il/ym/api/");

class yemot_api {
	/**
	 * 
	 * @param {string} username 
	 * @param {string} password 
	 * 
	 * @returns {promise}
	 */
	async connect(username, password) {

		const parm = { username, password };

		const res = await this.exec("Login", parm);

		if (res.responseStatus !== "OK") {

			throw (res.responseStatus + ": " + res.message);
		}

		this.token = res.token;
	}

	/**
	 * 
	 * @param {string} method 
	 * @param {object} options 
	 * 
	 * @returns {promise}
	 */
	async exec(method, options = {}) {

		const url = base_url + method;

		if (method !== "Login") {

			options.token = this.token;
		}

		let o;

		if (method === "DownloadFile") {

			o = { form: options, json: false };

		} else if (method === "UploadFile") {

			o = { formData: options };

		} else {

			o = { form: options, json: true };
		}

		return request.post(url, o);
	}
}

module.exports = yemot_api;

