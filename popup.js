function setup() {
	chrome.storage.sync.get(["tags"], function (items) {
		if (typeof items["tags"] === "undefined") {
			items["tags"] = true;
			chrome.storage.sync.set({ tags: true }, () => {});
		}
		document.getElementById("tags").checked = items["tags"];
	});
	chrome.storage.sync.get(["completed"], function (items) {
		if (typeof items["completed"] === "undefined") {
			items["completed"] = true;
			chrome.storage.sync.set({ completed: true }, () => {});
		}
		document.getElementById("completed").checked = items["completed"];
	});
	chrome.storage.sync.get(["completedorder"], function (items) {
		document.getElementById("completedorder").checked = items["completedorder"];
	});
	chrome.storage.sync.get(["malgraph"], function (items) {
		if (typeof items["malgraph"] === "undefined") {
			items["malgraph"] = true;
			chrome.storage.sync.set({ malgraph: true }, () => {});
		}
		document.getElementById("malgraph").checked = items["malgraph"];
	});
	chrome.storage.sync.get(["malexlogin"], function (items) {
		if (typeof items["malexlogin"] === "undefined") {
			items["malexlogin"] = true;
			chrome.storage.sync.set({ malexlogin: true }, () => {});
		}
		document.getElementById("login").checked = items["malexlogin"];
	});
	chrome.storage.sync.get(["droptag"], function (items) {
		if (typeof items["droptag"] === "undefined") {
			items["droptag"] = true;
			chrome.storage.sync.set({ droptag: true }, () => {});
		}
		document.getElementById("droptag").checked = items["droptag"];
	});
	chrome.storage.sync.get(["sortcip"], function (items) {
		if (typeof items["sortcip"] === "undefined") {
			items["sortcip"] = true;
			chrome.storage.sync.set({ sortcip: true }, () => {});
		}
		document.getElementById("sortcip").checked = items["sortcip"];
	});
	chrome.storage.sync.get(["highlighter"], function (items) {
		if (typeof items["highlighter"] === "undefined") {
			items["highlighter"] = false;
			chrome.storage.sync.set({ highlighter: false }, () => {});
		}
		document.getElementById("highlighter").checked = items["highlighter"];
	});
	chrome.storage.sync.get(["music"], function (items) {
		if (typeof items["music"] === "undefined") {
			items["music"] = false;
			chrome.storage.sync.set({ music: false }, () => {});
		}
		document.getElementById("music").checked = items["music"];
	});
	chrome.storage.sync.get(["pv"], function (items) {
		if (typeof items["pv"] === "undefined") {
			items["pv"] = false;
			chrome.storage.sync.set({ pv: false }, () => {});
		}
		document.getElementById("pv").checked = items["pv"];
	});
	chrome.storage.sync.get(["cm"], function (items) {
		if (typeof items["cm"] === "undefined") {
			items["cm"] = false;
			chrome.storage.sync.set({ cm: false }, () => {});
		}
		document.getElementById("cm").checked = items["cm"];
	});
	chrome.storage.sync.get(["affinity"], function (items) {
		document.getElementById("affinity").checked = items["affinity"];
	});
	chrome.storage.sync.get(["cutoff"], function (items) {
		if (typeof items["cutoff"] === "undefined" || isNaN(items["cutoff"])) {
			items["cutoff"] = 5;
		}
		document.getElementById("inputBox").value = items["cutoff"];
		console.log(items["cutoff"]);
	});

	const manifestData = chrome.runtime.getManifest();
	document.getElementById("version").innerHTML = "v" + manifestData.version;
}

setup();

const checkbox1 = document.getElementById("tags");

checkbox1.addEventListener("change", (event) => {
	if (event.target.checked) {
		chrome.storage.sync.set({ tags: true }, function () {});
	} else {
		chrome.storage.sync.set({ tags: false }, function () {});
	}
});

const checkbox2 = document.getElementById("completed");

checkbox2.addEventListener("change", (event) => {
	if (event.target.checked) {
		chrome.storage.sync.set({ completed: true }, function () {});
	} else {
		chrome.storage.sync.set({ completed: false }, function () {});
	}
});

const checkbox3 = document.getElementById("completedorder");

checkbox3.addEventListener("change", (event) => {
	if (event.target.checked) {
		chrome.storage.sync.set({ completedorder: true }, function () {});
	} else {
		chrome.storage.sync.set({ completedorder: false }, function () {});
	}
});

const checkbox4 = document.getElementById("malgraph");

checkbox4.addEventListener("change", (event) => {
	if (event.target.checked) {
		chrome.storage.sync.set({ malgraph: true }, function () {});
	} else {
		chrome.storage.sync.set({ malgraph: false }, function () {});
	}
});

const checkbox5 = document.getElementById("login");

checkbox5.addEventListener("change", (event) => {
	if (event.target.checked) {
		chrome.storage.sync.set({ malexlogin: true }, function () {});
	} else {
		chrome.storage.sync.set({ malexlogin: false }, function () {});
	}
});

const checkbox6 = document.getElementById("droptag");

checkbox6.addEventListener("change", (event) => {
	if (event.target.checked) {
		chrome.storage.sync.set({ droptag: true }, function () {});
	} else {
		chrome.storage.sync.set({ droptag: false }, function () {});
	}
});

const checkbox7 = document.getElementById("sortcip");

checkbox7.addEventListener("change", (event) => {
	if (event.target.checked) {
		chrome.storage.sync.set({ sortcip: true }, function () {});
	} else {
		chrome.storage.sync.set({ sortcip: false }, function () {});
	}
});

const checkbox8 = document.getElementById("highlighter");

checkbox8.addEventListener("change", (event) => {
	if (event.target.checked) {
		chrome.storage.sync.set({ highlighter: true }, function () {});
	} else {
		chrome.storage.sync.set({ highlighter: false }, function () {});
	}
});

const checkbox9 = document.getElementById("music");

checkbox9.addEventListener("change", (event) => {
	if (event.target.checked) {
		chrome.storage.sync.set({ music: true }, function () {});
	} else {
		chrome.storage.sync.set({ music: false }, function () {});
	}
});

const checkbox10 = document.getElementById("pv");

checkbox10.addEventListener("change", (event) => {
	if (event.target.checked) {
		chrome.storage.sync.set({ pv: true }, function () {});
	} else {
		chrome.storage.sync.set({ pv: false }, function () {});
	}
});

const checkbox11 = document.getElementById("cm");

checkbox11.addEventListener("change", (event) => {
	if (event.target.checked) {
		chrome.storage.sync.set({ cm: true }, function () {});
	} else {
		chrome.storage.sync.set({ cm: false }, function () {});
	}
});

const checkbox12 = document.getElementById("affinity");

checkbox12.addEventListener("change", (event) => {
	if (event.target.checked) {
		chrome.storage.sync.set({ affinity: true }, function () {});
	} else {
		chrome.storage.sync.set({ affinity: false }, function () {});
	}
});

const input = document.getElementById("cutoff");
let inputButton = input.childNodes[3];

inputButton.addEventListener("click", (event) => {
	event.preventDefault();
	let inputValue = input.childNodes[1].value;
	chrome.storage.sync.set({ cutoff: inputValue }, function () {});
	console.log(inputValue);
});

const timestamp = document.getElementById("timestamp");
timestamp.innerHTML = "now: " + new Date().getTime() / 1000;

const datepicker = document.getElementById("datepicker");
const discord_timestamp = document.getElementById("discord-timestamp");
datepicker.addEventListener("change", (event) => {
	discord_timestamp.innerHTML = `&lt;t:${
		Date.parse(datepicker.value) / 1000
	}&gt;`;
});
