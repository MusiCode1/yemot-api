# yemot-api

# install
```bash
npm i yemot-api
```

# exemple
```js
const yemot_api = require("yemot-api");

(async () => {

	const y = new yemot_api("0773137770", "1234");

	let r;

	/** קבלת מספר יחידות */
	r = await y.exec("GetSession");

	console.log(r);

	/** העלאת קובץ */
	let o = {

		file: {
			value: "12345",
			options: {
				filename: "123.txt",
				contentType: "text/txt"
			}
		},
		path: "ivr/123.txt"
	};

	r = await y.exec("UploadFile", o);

	console.log(r);

	/** הורדת קובץ */
	o = {
		path: "ivr/123.txt"
	};

	r = await y.exec("DownloadFile", o);

	console.log(r);

})();
```