import fs from "fs";
import path from "path";

//prettier-ignore
const countries = await fetch("https://restcountries.com/v3.1/all?fields=name,cca2,independent")
	.then(data => data.json())
	.then(data =>
		data
			.filter(country => country.independent)
			.map(country => ({ name: country.name.common, code: country.cca2 }))
			.sort((a, b) => a.name.localeCompare(b.name)),
	);

const fileName = "countries.json";
const filePath = path.join("public", "data", fileName);
fs.writeFileSync(filePath, JSON.stringify(countries, null, 2), "UTF-8");
