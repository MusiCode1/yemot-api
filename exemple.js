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

	await y.upload_file("ivr/123.txt", file);

	/** הורדת קובץ */
	try {
		r = await y.download_file("ivr/123.txt");
	} catch (error) {
		console.error(error);
	}

	console.log(r);

	/** הוספת שלוחה חדשה */

	await y.create_ext("/1", {
		type: "menu",
		white_list: "yes"
	});

	await y.upload_txt_file(str_path + "/1/WhiteList.ini", [
        "0773137770"
    ]);

})();