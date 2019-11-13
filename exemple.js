
(async () => {

	const y = new yemot_api();
	
	await y.connect("0773137770", "1234");

	console.log(await y.exec("GetSession"));

})();