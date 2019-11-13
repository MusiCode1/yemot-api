const request = require("request-promise-native");

const base_url = new URL("https://www.call2all.co.il/ym/api/");

class yemot_api {

	async connect(username, password) {

		const parm = { username, password };
		const body = new URLSearchParams(parm).toString();

		const url = base_url + "Login";

		const o = { form: body, json: true };

		const res = await request.post(url, o);

		if (res.responseStatus !== "OK") {

			throw (res.responseStatus + ": " + res.message);
		}

		this.token = res.token;
	}

	async exec(method, options = {}) {

		const url = base_url + method;

		options.token = this.token;

		const o = { form: options, json: true };

		const res = await request.post(url, o);

		return res;
	}

}

module.exports = yemot_api;

