const xlsx = require("xlsx");
const fetch = require("node-fetch");
const config = require("./config.json");
const mapping = config.mapping;

let payload = {
	dataValues: []
};

const wb = xlsx.readFile("./input/example.xlsx");
const workSheetNames = wb.SheetNames;


workSheetNames.forEach(name => {
	let orgUnit = wb.Sheets[name][mapping.ouCell].v;
	let period = wb.Sheets[name][mapping.periodCell].v;
	Object.keys(mapping.deMapping).forEach(cell => {
		let dataElement = mapping.deMapping[cell].de;
		let categoryOptionCombo = mapping.deMapping[cell].coc;
		let value = wb.Sheets[name][cell].v;
		let dataValue = {
			dataElement: dataElement,
			categoryOptionCombo: categoryOptionCombo,
			period: period,
			orgUnit: orgUnit,
			value: value
		}
		payload.dataValues.push(dataValue);
	});
});


fetch(`${config.baseUrl}/api/dataValueSets?orgUnitIdScheme=${mapping.ouScheme}`, {
		method: "POST",
		headers: {
			Authorization: "Basic " + new Buffer(config.username + ":" + config.password).toString("base64"),
			"Content-Type": "application/json"
		},
		body: JSON.stringify(payload)
	})
	.then(res => res.json())
	.then(json => console.log("Pushing data successfully"));