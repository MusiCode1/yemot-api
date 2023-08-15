import "dotenv/config"
import { YemotApi, FileForUpload } from "./dist/index.js"

(async () => {

	const username = process.env.JS_USERNAME;
	const password = process.env.JS_PASSWORD;


	const client = new YemotApi(username, password);

	/** קבלת מספר יחידות */
	let r = await client.get_session();

	console.log(client.token);

	const from = new Date();
	from.setDate(1);
	const to = new Date();

	r = await client.get_incoming_sum(
		from.toISOString().split("T")[0],
		to.toISOString().split("T")[0],
	);

	console.log(r.data);

	/** העלאת קובץ */
	const file = new FileForUpload({
		file_name: "123.txt",
		data: "12345",
		content_type: "text/txt"
	});

	r = await client.upload_file("ivr/123.txt", file);

	/** הורדת קובץ */
	try {
		r = await client.download_file("ivr/123.txt");
	} catch (error) {
		console.error(error);
	}

	console.log(r.data.toString());

	/** הוספת שלוחה חדשה */

	r = await client.create_ext("/98", {
		type: "menu",
		white_list: "yes"
	});

	/** העלאת קובץ ini */
	r = await client.upload_ini_file("/98/ext.ini", {
		type: "playfile"
	});

	/** העלאת קובץ טקסט */
	r = await client.upload_txt_file(
		"/98/WhiteList.ini",
		"0773137770"
	);

})();