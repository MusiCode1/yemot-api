const yemot_api = require("./");

(async () => {

	const y = new yemot_api("0773137770", "1234");

	/** קבלת מספר יחידות */
	let r = await y.get_session();

	console.log(r);

	/** העלאת קובץ */
	const file = {
		value: "12345",
		options: {
			filename: "123.txt",
			contentType: "text/txt"
		}
	};

	r = await y.upload_file("ivr/123.txt", file);

	console.log(r);

	/** הורדת קובץ */
	try {
		r = await y.download_file("ivr/123.txt");
	} catch (error) {
		console.error(error);
	}

	console.log(r);

})();