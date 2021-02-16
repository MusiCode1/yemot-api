const axios = require("axios").default;
const qs = require("qs");
const FormData = require("form-data");

const { ini_from_obj } = require("./ulit");

/**
 * 
 * @constructor 
 * @param {string} username 
 * @param {string} password 
 * 
 */
function Yemot_api(username, password, ym_server = "ym") {

	let token;
	let is_connect = false;

	const yemot_con = axios.create({
		baseURL: `https://www.call2all.co.il/${ym_server}/api/`,
		maxContentLength: Infinity
	});

	this.copy_files = async (target_path, files_path) => {

		return exec("FileAction", {
			action: "copy",
			target: "ivr2:" + target_path,
			...make_what_files(files_path)
		});
	};

	this.move_files = async (target_path, files_path) => {

		return exec("FileAction", {
			action: "move",
			target: "ivr2:" + target_path,
			...make_what_files(files_path)
		});
	};

	this.create_ext = async (path, ini_settings_obj) => {

		await exec("UpdateExtension", {
			path
		});

		return upload_txt_file(path + "/ext.ini", ini_settings_obj);
	};

	this.logout = () => {
		return exec("Logout");
	};

	this.upload_file = (path, file, convertAudio = 0) => {

		return exec("UploadFile", {
			path,
			convertAudio,
			file
		});
	};

	this.download_file = (path) => {

		return exec("DownloadFile", {
			path
		});
	};

	this.get_ivr_tree = (path) => {
		return exec("GetIvrTree", {
			path: "ivr2:" + path
		});
	};

	this.get_incoming_calls = () => {
		return exec("GetIncomingCalls");
	}

	this.get_session = () => {
		return exec("GetSession");
	};

	this.exec = exec;

	this.upload_txt_file = upload_txt_file;

	/** ====================================================================== */

	/** */
	async function upload_txt_file(path, ini_settings_obj) {

		if (typeof ini_settings_obj === "object") {

			if(Array.isArray(ini_settings_obj)){
				ini_settings_obj = ini_settings_obj.join("\n");
			} else {
				ini_settings_obj = ini_from_obj(ini_settings_obj);
			}
		}

		return exec("UploadTextFile", {
			what: "ivr2:/" +
				path + "/ext.ini",
			contents: ini_settings_obj
		});

	}

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

		if (method === "UploadFile") {

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

			if (method === "DownloadFile") {

				options.responseType = options.responseType || "arraybuffer";
			}

			options.headers = { "Content-Type": "application/x-www-form-urlencoded" };

			data = qs.stringify(parameters);
		}

		try {
			let res = await yemot_con.post("/" + method, data, options);

			if (res.data.responseStatus && res.data.responseStatus !== "OK") {
				if (res.data.responseStatus === "EXCEPTION" &&
					res.data.message ===
					"IllegalStateException(session token is invalid)") {

					await login();

					return await exec(method, parameters, options);
				} else {

					if (res.data.exceptionMessage) {
						throw (res.data.exceptionMessage);
					} else if (res.data.message) {
						throw (res.data.message);
					}


				}

			}

			return res;


		} catch (error) {

			if (error.response) {
				if (error.response.status == 404) {
					throw (error.response.data);

				} else if (error.response.data ==
					"Exception IllegalStateException (session is expired) thrown") {
					await login();

					return await exec(method, parameters, options);
				}
			} else {

				throw (error);
			}
		}

	}

	async function login() {

		const parm = { username, password };

		const res = await exec("Login", parm);

		if (res.data && res.data.responseStatus !== "OK") {

			throw (res.data.responseStatus + ": " + res.data.message);
		}

		token = res.data.token;

		is_connect = true;
	}

	function make_what_files(files) {
		const final_files = {};
		let i = 0;
		for (const file of files) {
			final_files["what" + i] = "ivr2:" + file;
			i++;
		}
		return final_files;
	}
}

Yemot_api.Yemot_api = Yemot_api;

module.exports = Yemot_api;