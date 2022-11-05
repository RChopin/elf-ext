function setup() {
	chrome.storage.sync.get(["tags"], function (items) {
		document.getElementById("tags").checked = items["tags"];
	});
	chrome.storage.sync.get(["completed"], function (items) {
		document.getElementById("completed").checked = items["completed"];
	});
	chrome.storage.sync.get(["malgraph"], function (items) {
		document.getElementById("malgraph").checked = items["malgraph"];
	});
	chrome.storage.sync.get(["malexlogin"], function (items) {
		document.getElementById("login").checked = items["malexlogin"];
	});
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

const checkbox3 = document.getElementById("malgraph");

checkbox3.addEventListener("change", (event) => {
	if (event.target.checked) {
		chrome.storage.sync.set({ malgraph: true }, function () {});
	} else {
		chrome.storage.sync.set({ malgraph: false }, function () {});
	}
});

const checkbox4 = document.getElementById("login");

checkbox4.addEventListener("change", (event) => {
	if (event.target.checked) {
		chrome.storage.sync.set({ malexlogin: true }, function () {});
	} else {
		chrome.storage.sync.set({ malexlogin: false }, function () {});
	}
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
