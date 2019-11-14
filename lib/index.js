const request = require("request");

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

			o = { formData: options, json: true };

		} else {

			o = { form: options, json: true };
		}

		const r = await new Promise((resolve)=>{

			request.post(url, o, (err, res, body)=>{
				resolve(body);
			});
		});

		return r;
	}
}

module.exports = yemot_api;

