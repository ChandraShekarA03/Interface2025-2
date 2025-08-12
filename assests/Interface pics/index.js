fs = require("fs");

const files = fs.readdirSync("./");
files.splice(files.indexOf("index.js"), 1);
files.forEach(element => {
    console.log(`<div class="rounded-xl overflow-hidden shadow-lg transition transform hover:scale-105 duration-300">
	<img src="assests/interface pics/${element}" alt="${element}" class="w-full h-64 object-cover" />
</div>`)
});
console.log();