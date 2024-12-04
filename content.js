let settings = {};
let sharedtypes = [];
let sharedanime = [];
let user = [];
let animelist = [[], []];
let animenodelist = [[], []];
let animeId = [[], []];
let mediaType;
let settingsUnset = false;
let hiddenCounter = 0;

// Tags/affinities
const tags = [
	"All",
	"Action",
	"Adult Cast",
	"Adventure",
	"Anthropomorphic",
	"Avant Garde",
	"Award Winning",
	"Boys Love",
	"CGDCT",
	"Childcare",
	"Combat Sports",
	"Comedy",
	"Crossdressing",
	"Delinquents",
	"Detective",
	"Drama",
	"Ecchi",
	"Educational",
	"Erotica",
	"Fantasy",
	"Gag Humor",
	"Girls Love",
	"Gore",
	"Gourmet",
	"Harem",
	"Hentai",
	"High Stakes Game",
	"Historical",
	"Horror",
	"Idols (Female)",
	"Idols (Male)",
	"Isekai",
	"Iyashikei",
	"Josei",
	"Kids",
	"Love Polygon",
	"Magical Sex Shift",
	"Mahou Shoujo",
	"Martial Arts",
	"Mecha",
	"Medical",
	"Memoir",
	"Military",
	"Music",
	"Mystery",
	"Mythology",
	"Organized Crime",
	"Otaku Culture",
	"Parody",
	"Performing Arts",
	"Pets",
	"Psychological",
	"Racing",
	"Reincarnation",
	"Reverse Harem",
	"Romance",
	"Romantic Subtext",
	"Samurai",
	"School",
	"Sci-Fi",
	"Seinen",
	"Shoujo",
	"Shounen",
	"Showbiz",
	"Slice of Life",
	"Space",
	"Sports",
	"Strategy Game",
	"Super Power",
	"Supernatural",
	"Survival",
	"Suspense",
	"Team Sports",
	"Time Travel",
	"Vampire",
	"Video Game",
	"Villainess",
	"Visual Arts",
	"Workplace",
	"Urban Fantasy",
	"Love Status Quo",
];
let values = {};
for (const tag of tags) {
	values[tag] = {};
	values[tag].total = 0;
	values[tag].x = [];
	values[tag].y = [];
	values[tag].diff = [];
	values[tag].totaldiff = 0;
	values[tag].totalx = 0;
	values[tag].totaly = 0;
	values[tag].meanx = 0;
	values[tag].meany = 0;
	values[tag].meandiff = 0;
	values[tag].affinity = 0;
}

let maltags;
let malcompletedinplanned;
let malplus;
let mallogin;
let droptag;
let sortcip;
let highlighter;
let highlighted;
let bonker;
let bannedGenres;
let banMediaTypes;
let affinitysetting;
let cutoffsetting;
let completedorder;

let content = document.getElementById("content");
let table = document.createElement("TABLE");
table.cellpadding = "0";
table.width = "100%";
table.cellspacing = "0";
table.border = 0;

let goToTop = document.createElement("tr");
goToTop.innerHTML = `<td colspan="4" class="borderClass" style="border-width: 0;"><a href="#">Top</a></td>`;

window.addEventListener("load", () => {
	user = [
		document
			.getElementById("content")
			.getElementsByTagName("h2")[0]
			.getElementsByTagName("a")[2].text,
		document
			.getElementById("content")
			.getElementsByTagName("h2")[0]
			.getElementsByTagName("a")[1].text,
	];

	if (window.location.href.includes("manga")) {
		mediaType = "manga";
	} else {
		mediaType = "anime";
	}

	tempAffinity();

	let flip = document.createElement("DIV");
	let aflip = document.createElement("A");
	aflip.text = "Flip users";
	aflip.href = `/shared.php?u1=${user[0]}&u2=${user[1]}${
		mediaType == "manga" ? "&type=manga" : ""
	}`;
	flip.appendChild(aflip);

	flip.style.display = "inline-block";
	content.insertBefore(flip, content.childNodes[1]);

	chrome.storage.sync.get(
		[
			"tags",
			"completed",
			"completedorder",
			"malgraph",
			"malexlogin",
			"droptag",
			"sortcip",
			"highlighter",
			"highlighted",
			"bonker",
			"bannedGenres",
			"music",
			"pv",
			"cm",
			"affinity",
			"cutoff",
		],
		function (settingsdata) {
			maltags = settingsdata["tags"];
			malcompletedinplanned = settingsdata["completed"];
			completedorder = settingsdata["completedorder"];
			malplus = settingsdata["malgraph"];
			mallogin = settingsdata["malexlogin"];
			droptag = settingsdata["droptag"];
			sortcip = settingsdata["sortcip"];
			highlighter = settingsdata["highlighter"];
			highlighted = settingsdata["highlighted"];
			bonker = settingsdata["bonker"];
			bannedGenres = settingsdata["bannedGenres"];
			banMediaTypes = [
				settingsdata["music"] ? "music" : "",
				settingsdata["pv"] ? "pv" : "",
				settingsdata["cm"] ? "cm" : "",
			];
			affinitysetting = settingsdata["affinity"];
			cutoffsetting = settingsdata["cutoff"];

			if (typeof cutoffsetting === "undefined" || isNaN(cutoffsetting)) {
				cutoffsetting = 5;
			}

			let Run = true;

			if (maltags === undefined) maltags = false;

			if (malcompletedinplanned === undefined) malcompletedinplanned = false;

			if (completedorder === undefined) completedorder = false;

			if (malplus === undefined) malplus = false;

			if (mallogin === undefined) mallogin = false;

			if (droptag === undefined) droptag = false;

			if (sortcip === undefined) sortcip = false;

			if (highlighter === undefined) highlighter = false;

			if (highlighted === undefined) highlighted = [];

			if (bonker === undefined) bonker = false;

			if (bannedGenres === undefined) bannedGenres = [];

			if (
				maltags == false &&
				malcompletedinplanned == false &&
				malplus == false &&
				mallogin == false
			) {
				settingsUnset = true;
				Run = false;
				notifyUserUnset();
			} else if (
				maltags == false &&
				malcompletedinplanned == false &&
				malplus == true
			) {
				Run = false;
				postDraw();
			}

			console.log(settingsdata);

			if (mediaType == "anime") {
				settings = {
					logging: false,
					sharedtypes: ["completed", "on_hold", "dropped", "watching"],
				};
			} else {
				settings = {
					logging: false,
					sharedtypes: ["completed", "on_hold", "dropped", "reading"],
				};
			}

			console.time("All");
			if (Run) {
				if (mallogin == false) {
					drawModBar();
					let message = {
						command: "getUserData",
						u0: user[0],
						u1: user[1],
						sharedtypes: settings.sharedtypes,
						auth_type: mallogin,
					};

					sendMessage(message, (userData) => {
						animelist = userData.animelist;
						animenodelist = userData.animenodelist;
						animeId = userData.animeId;
						drawTables(userData);
					});
				} else {
					sendMessage({ command: "auth_check" }, (response) => {
						if (response.message == "authorized") {
							drawModBar();

							let message = {
								command: "getUserData",
								u0: user[0],
								u1: user[1],
								sharedtypes: settings.sharedtypes,
								auth_type: mallogin,
							};
							sendMessage(message, (userData) => {
								animelist = userData.animelist;
								animenodelist = userData.animenodelist;
								animeId = userData.animeId;
								drawTables(userData);
							});
						} else {
							pleaseAuth();
						}
					});
				}
			}
		}
	);
});

function notifyUserUnset() {
	let modBar = document.createElement("div");
	modBar.style =
		"display: flex; flex-direction: column; border: 1px solid #fff; border-radius: 4px; padding:0 0rem; align-items: flex-end;";

	let modText = document.createElement("div");
	modText.innerHTML = "Please set your add-on settings";
	modBar.appendChild(modText);
	content.insertBefore(modBar, content.childNodes[2]);
}

function pleaseAuth() {
	let modBar = document.createElement("div");
	modBar.style =
		"display: flex; flex-direction: column; border: 1px solid #fff; border-radius: 4px; padding:0 0rem; align-items: flex-end;";

	let modText = document.createElement("div");
	modText.className = "authButton";
	modText.style =
		"cursor: pointer; padding:4px 4px; font-family: Avenir,lucida grande,tahoma,verdana,arial,sans-serif; text-decoration: none; color:white;border-radius: 2px; font-size:14px;font-weight: 700;text-align: center;margin-left: 8px; background:#2e51a2;";
	modText.innerHTML = "Log in to add-on";

	modBar.appendChild(modText);

	content.insertBefore(modBar, content.childNodes[2]);
	const Button = document.querySelector(".authButton");

	Button.addEventListener("click", () => {
		var message = {
			command: "login",
		};
		sendMessage(message, () => {
			location.reload();
		});
	});
}

function postDraw() {
	let modBar = content.childNodes[2];
	modBar.remove();
	if (malplus) {
		var row3 = document.createElement("DIV");
		var m1 = document.createElement("DIV");
		var m1t = document.createElement("A");
		m1t.text = `${user[0]}'s MalGraph`;
		m1t.href = `https://anime.plus/${user[0]}?referral=search`;
		m1.appendChild(m1t);
		row3.appendChild(m1);

		let p = document.createTextNode(" | ");
		m1.appendChild(p);

		var m2t = document.createElement("A");
		m2t.text = `${user[1]}'s MalGraph`;
		m2t.href = `https://anime.plus/${user[1]}?referral=search`;
		m1.appendChild(m2t);
		row3.appendChild(m1);

		row3.classList.add("spaceit");
		content.insertBefore(row3, content.childNodes[1]);

		let row4 = document.createElement("DIV");
		let statsDiv = document.createElement("DIV");
		let statsLink1 = document.createElement("A");
		statsLink1.text = `${user[0]}'s Statistics`;
		statsLink1.href = `https://myanimelist.net/profile/${user[0]}/statistics`;
		statsDiv.appendChild(statsLink1);
		row4.appendChild(statsDiv);

		let p2 = document.createTextNode(" | ");
		statsDiv.appendChild(p2);

		let statsLink2 = document.createElement("A");
		statsLink2.text = `${user[1]}'s Statistics`;
		statsLink2.href = `https://myanimelist.net/profile/${user[1]}/statistics`;
		statsDiv.appendChild(statsLink2);
		row4.appendChild(statsDiv);

		row4.classList.add("spaceit");
		content.insertBefore(row4, content.childNodes[1]);
	}
}

function drawUnique(uniqueData) {
	let header = document.createElement("h2");
	let quicklink = document.createElement("a");
	header.innerHTML = `Unique to <a href="/profile/${user[0]}">${user[0]}</a>`;
	content.appendChild(document.createElement("br"));
	quicklink.setAttribute("name", "u1");
	quicklink.name = "u1";
	content.appendChild(quicklink);

	content.appendChild(header);

	let table = document.createElement("TABLE");
	table.cellpadding = "0";
	table.width = "100%";
	table.cellspacing = "0";
	table.border = 0;
	content.appendChild(quicklink);

	let header2 = document.createElement("tr");
	header2.innerHTML = `
  <td class="borderClass"><a href="?u1=${user[0]}&amp;u2=${user[1]}&amp;type=${mediaType}&amp;o=1"><strong>Title</strong></a></td>
  <td class="borderClass" width="140" align="center"><a href="?u1=${user[0]}&amp;u2=${user[1]}&amp;type=${mediaType}&amp;o=2"><strong>${user[0]}'s Score</strong></a></td>
`;
	table.appendChild(header2);
	content.appendChild(quicklink);

	for (let anime of uniqueData[0]) {
		let doTagsExist;
		if (
			typeof animelist[0][animeId[0].indexOf(anime)].node.genres === "undefined"
		) {
			doTagsExist = false;
		} else {
			doTagsExist = true;
		}
		try {
			let tbody = document.createElement("TBODY");
			let tr = document.createElement("TR");
			let title = animelist[0][animeId[0].indexOf(anime)].node.title;
			let score = animelist[0][animeId[0].indexOf(anime)].list_status.score;
			if (score == 0) score = "-";
			tr.innerHTML = `<tr>
    <td class="borderClass"><a href="/${mediaType}/${anime}">${title}</a> <a href="https://myanimelist.net/ownlist/${mediaType}/add?selected_series_id=${
				anime.id
			}&amp;hideLayout=1" title="Quick add ${mediaType} to my list" class="Lightbox_AddEdit button_add">add</a><span class="genres">${
				maltags
					? doTagsExist
						? animelist[0][animeId[0].indexOf(anime)].node.genres
								.map((gn) => gn.name)
								.join(" | ")
						: ""
					: ""
			}</span></td>
    <td class="borderClass" align="center"><span style="">${score}</span></td>
  </tr>`;

			tbody.appendChild(tr);
			table.appendChild(tbody);
		} catch (e) {}
	}

	content.appendChild(table);

	header = document.createElement("h2");
	let quicklink2 = document.createElement("a");
	header.innerHTML = `Unique to <a href="/profile/${user[1]}">${user[1]}</a>`;
	content.appendChild(document.createElement("br"));
	quicklink2.setAttribute("name", "u2");

	content.appendChild(quicklink2);
	content.appendChild(header);

	table = document.createElement("TABLE");
	table.cellpadding = "0";
	table.width = "100%";
	table.cellspacing = "0";
	table.border = 0;

	header2 = document.createElement("tr");
	header2.innerHTML = `
  <td class="borderClass"><a href="?u1=${user[0]}&amp;u2=${user[1]}&amp;type=${mediaType}&amp;o=1"><strong>Title</strong></a></td>
  <td class="borderClass" width="140" align="center"><a href="?u1=${user[0]}&amp;u2=${user[1]}&amp;type=${mediaType}&amp;o=2"><strong>${user[1]}'s Score</strong></a></td>
`;
	table.appendChild(header2);

	for (let anime of uniqueData[1]) {
		let doTagsExist;
		if (
			typeof animelist[1][animeId[1].indexOf(anime)].node.genres === "undefined"
		) {
			doTagsExist = false;
		} else {
			doTagsExist = true;
		}
		try {
			let tbody = document.createElement("TBODY");
			let tr = document.createElement("TR");
			let title = animelist[1][animeId[1].indexOf(anime)].node.title;
			let score = animelist[1][animeId[1].indexOf(anime)].list_status.score;
			if (score == 0) score = "-";
			tr.innerHTML = `<tr>
    <td class="borderClass"><a href="/${mediaType}/${anime}">${title}</a> <a href="https://myanimelist.net/ownlist/${mediaType}/add?selected_series_id=${
				anime.id
			}&amp;hideLayout=1" title="Quick add ${mediaType} to my list" class="Lightbox_AddEdit button_add">add</a><span class="genres">${
				maltags
					? doTagsExist
						? animelist[1][animeId[1].indexOf(anime)].node.genres
								.map((gn) => gn.name)
								.join(" | ")
						: ""
					: ""
			}</span></td>
    <td class="borderClass" align="center"><span style="">${score}</span></td>
  </tr>`;

			tbody.appendChild(tr);
			table.appendChild(tbody);
		} catch (e) {}
	}

	content.appendChild(table);
}

function drawCompletedInPlanned(animeData) {
	let a = 9;
	let header = document.createElement("h2");
	if (completedorder == false)
		header.innerHTML = `Completed by <a href="/profile/${user[1]}">${user[1]}</a>, planned by <a href="/profile/${user[0]}">${user[0]}</a>`;
	else if (completedorder == true)
		header.innerHTML = `Completed by <a href="/profile/${user[0]}">${user[0]}</a>, planned by <a href="/profile/${user[1]}">${user[1]}</a>`;
	content.insertBefore(document.createElement("br"), content.childNodes[a]);
	content.insertBefore(document.createElement("a"), content.childNodes[a + 1]);
	content.insertBefore(header, content.childNodes[a + 2]);

	let table = document.createElement("TABLE");
	table.cellpadding = "0";
	table.width = "100%";
	table.cellspacing = "0";
	table.border = 0;

	let header2 = document.createElement("tr");
	if (completedorder == false)
		header2.innerHTML = `
		<td class="borderClass"><a href="?u1=${user[1]}&amp;u2=${user[0]}&amp;type=${mediaType}&amp;o=1"><strong>Title</strong></a></td>
		<td class="borderClass" width="140" align="center"><a href="?u1=${user[1]}&amp;u2=${user[0]}&amp;type=${mediaType}&amp;o=2"><strong>${user[1]}'s Score</strong></a></td>
		`;
	else if (completedorder == true)
		header2.innerHTML = `
		<td class="borderClass"><a href="?u1=${user[1]}&amp;u2=${user[0]}&amp;type=${mediaType}&amp;o=1"><strong>Title</strong></a></td>
		<td class="borderClass" width="140" align="center"><a href="?u1=${user[1]}&amp;u2=${user[0]}&amp;type=${mediaType}&amp;o=2"><strong>${user[0]}'s Score</strong></a></td>
		`;
	table.appendChild(header2);

	let tbody = document.createElement("TBODY");
	// Step 1: Collect the anime data into an array
	let animeList = [];
	for (let anime of animeData) {
		let tempGenres = [];
		for (let genre of animelist[1][animeId[1].indexOf(anime)].node.genres)
			tempGenres.push(genre.name);
		// if (tempGenres.some((genre) => bannedGenres.includes(genre))) {
		// 	hiddenCounter += 1;
		// 	continue;
		// }
		let theanimelist;
		let theanimeId;
		if (completedorder == false) {
			theanimelist = animelist[1];
			theanimeId = animeId[1];
		} else if (completedorder == true) {
			theanimelist = animelist[0];
			theanimeId = animeId[0];
		}
		let title = animelist[1][animeId[1].indexOf(anime)].node.title;
		let score = theanimelist[theanimeId.indexOf(anime)].list_status.score;
		let year =
			animelist[1][animeId[1].indexOf(anime)].node.start_date.split("-")[0];
		let num_episodes = "-";
		try {
			if (mediaType == "anime") {
				num_episodes =
					animelist[1][animeId[1].indexOf(anime)].node.num_episodes + " eps";
			} else if (mediaType == "manga") {
				num_episodes =
					animelist[1][animeId[1].indexOf(anime)].node.num_volumes + " vols";
			}
		} catch (e) {}
		let media_type = animelist[1][
			animeId[1].indexOf(anime)
		].node.media_type.replace(/_/g, " ");

		let doTagsExist;
		if (
			typeof animelist[1][animeId[1].indexOf(anime)].node.genres === "undefined"
		) {
			doTagsExist = false;
		} else {
			doTagsExist = true;
		}
		if (score == 0) score = "-";

		animeList.push({
			anime,
			title,
			score,
			year,
			num_episodes,
			media_type,
			doTagsExist,
			genres: animelist[1][animeId[1].indexOf(anime)].node.genres,
		});
	}
	// Step 2: Sort the array by score
	animeList.sort((a, b) => b.score - a.score);

	for (let animeData of animeList) {
		let tr = document.createElement("TR");
		tr.innerHTML = `<tr>
    <td class="borderClass"><a href="/${mediaType}/${animeData.anime}">${
			animeData.title
		}</a> <a href="https://myanimelist.net/ownlist/${mediaType}/add?selected_series_id=${
			animeData.anime.id
		}&amp;hideLayout=1" title="Quick add ${mediaType} to my list" class="Lightbox_AddEdit button_add">add</a><span class="year" style="margin: 0 5px">(${
			animeData.year
		}, ${animeData.num_episodes}, ${
			animeData.media_type
		})</span>  <span class="genres">${
			maltags
				? animeData.doTagsExist
					? animeData.genres.map((gn) => gn.name).join(" | ")
					: ""
				: ""
		}</span></td>
    <td class="borderClass" align="center"><span style="">${
			animeData.score
		}</span></td>
  </tr>`;
		tbody.appendChild(tr);
	}

	table.appendChild(tbody);
	table.appendChild(goToTop);
	content.insertBefore(table, content.childNodes[a + 3]);

	postDraw();
}

function drawShared(sharedData) {
	let tbody = document.createElement("TBODY");
	let tr = document.createElement("TR");
	tr.innerHTML = `
    <td class="borderClass"><a href="?u1=${user[0]}&amp;u2=${user[1]}&amp;type=${mediaType}&amp;o=1"><strong>Title</strong></a></td>
    <td class="borderClass" width="140" align="center"><a href="?u1=${user[0]}&amp;u2=${user[1]}&amp;type=${mediaType}&amp;o=2"><strong>${user[0]}'s Score</strong></a></td>
    <td class="borderClass" width="140" align="center"><a href="?u1=${user[0]}&amp;u2=${user[1]}&amp;type=${mediaType}&amp;o=3"><strong>${user[1]}'s Score</strong></a></td>
    <td class="borderClass" width="50" align="center"><span title="Score Difference"><strong>Diff.</strong></span></td>
    `;
	let topRow = document.createElement("H2");
	let topText = `<div class="floatRightHeader">
    <a href="/shared.php?u1=${user[0]}&amp;u2=${user[1]}&amp;type=manga"
      >Shared Manga</a
    >
  </div>
  Shared ${mediaType} Between <a href="/profile/${user[0]}">${user[0]}</a> and
  <a href="/profile/${user[1]}">${user[1]}</a>`;
	topRow.innerHTML = topText;
	content.insertBefore(topRow, content.childNodes[1]);

	tbody.appendChild(tr);
	table.appendChild(tbody);
	content.appendChild(table);

	tbody = document.createElement("TBODY");
	for (let anime of sharedData) {
		if (anime.u0 == 0) anime.u0 = "-";
		if (anime.u1 == 0) anime.u1 = "-";
		let doTagsExist;
		if (
			typeof animelist[1][animeId[1].indexOf(anime)].node.genres === "undefined"
		) {
			doTagsExist = false;
		} else {
			doTagsExist = true;
		}

		let tr = document.createElement("TR");

		tr.innerHTML = `
  <td class="borderClass"><a href="/${mediaType}/${anime.id}">${
			anime.title + " "
		}</a><span class="genres">${
			maltags
				? doTagsExist
					? animelist[0][animeId[0].indexOf(anime.id)].node.genres
							.map((gn) => gn.name)
							.join(" | ")
					: ""
				: ""
		}</span></td>
  <td class="borderClass" align="center"><span style=" color: ${
		anime.u0 > anime.u1 ? "#FF0000" : "#0000FF"
	};">${anime.u0}</span></td>
  <td class="borderClass" align="center"><span style=" color: ${
		anime.u0 < anime.u1 ? "#FF0000" : "#0000FF"
	};">${anime.u1}</span></td>
  <td class="borderClass" align="center">${
		anime.u0 == "-" || anime.u1 == "-" ? "-" : Math.abs(anime.u0 - anime.u1)
	}</td>
  `;
		tbody.appendChild(tr);
	}
	table.appendChild(tbody);

	content.appendChild(table);
}

function getGenre(anime, i) {
	try {
		if (i == 0)
			return animelist[0][animeId[0].indexOf(Number(anime))].node.genres;
		if (i == 1 && malcompletedinplanned == false)
			return animelist[0][animeId[0].indexOf(Number(anime))].node.genres;
		if (i == 2 && malcompletedinplanned == false)
			return animelist[1][animeId[1].indexOf(Number(anime))].node.genres;
		if (i == 2 && malcompletedinplanned == true)
			return animelist[1][animeId[1].indexOf(Number(anime))].node.genres; // it was [0] and [0]
		if (i == 3 && malcompletedinplanned == true)
			return animelist[0][animeId[0].indexOf(Number(anime))].node.genres; // it was [1] and [1]
	} catch (e) {}
}

function getStatus(anime, i) {
	try {
		if (i == 0)
			return animelist[0][animeId[0].indexOf(Number(anime))].list_status.status;
		if (i == 1 && malcompletedinplanned == false)
			return animelist[0][animeId[0].indexOf(Number(anime))].list_status.status;
		if (i == 2 && malcompletedinplanned == false)
			return animelist[1][animeId[1].indexOf(Number(anime))].list_status.status;
		if (i == 2 && malcompletedinplanned == true)
			return animelist[1][animeId[1].indexOf(Number(anime))].list_status.status; // it was [0] and [0]
		if (i == 3 && malcompletedinplanned == true)
			return animelist[0][animeId[0].indexOf(Number(anime))].list_status.status; // it was [1] and [1]
	} catch (e) {}
}

function getStartDate(anime, i) {
	try {
		if (i == 0)
			return animelist[0][
				animeId[0].indexOf(Number(anime))
			].node.start_date.split("-")[0];
		if (i == 1 && malcompletedinplanned == false)
			return animelist[0][
				animeId[0].indexOf(Number(anime))
			].node.start_date.split("-")[0];
		if (i == 2 && malcompletedinplanned == false)
			return animelist[1][
				animeId[1].indexOf(Number(anime))
			].node.start_date.split("-")[0];
		if (i == 2 && malcompletedinplanned == true)
			return animelist[1][
				animeId[1].indexOf(Number(anime))
			].node.start_date.split("-")[0]; // it was [0] and [0]
		if (i == 3 && malcompletedinplanned == true)
			return animelist[0][
				animeId[0].indexOf(Number(anime))
			].node.start_date.split("-")[0]; // it was [1] and [1]
	} catch (e) {}
}

function getNumEpisodes(anime, i) {
	try {
		if (mediaType == "manga") {
			if (i == 0)
				return animelist[0][animeId[0].indexOf(Number(anime))].node.num_volumes;
			if (i == 1 && malcompletedinplanned == false)
				return animelist[0][animeId[0].indexOf(Number(anime))].node.num_volumes;
			if (i == 2 && malcompletedinplanned == false)
				return animelist[1][animeId[1].indexOf(Number(anime))].node.num_volumes;
			if (i == 2 && malcompletedinplanned == true)
				return animelist[1][animeId[1].indexOf(Number(anime))].node.num_volumes; // it was [0] and [0]
			if (i == 3 && malcompletedinplanned == true)
				return animelist[0][animeId[0].indexOf(Number(anime))].node.num_volumes; // it was [1] and [1]
		} else if (mediaType == "anime") {
			if (i == 0)
				return animelist[0][animeId[0].indexOf(Number(anime))].node
					.num_episodes;
			if (i == 1 && malcompletedinplanned == false)
				return animelist[0][animeId[0].indexOf(Number(anime))].node
					.num_episodes;
			if (i == 2 && malcompletedinplanned == false)
				return animelist[1][animeId[1].indexOf(Number(anime))].node
					.num_episodes;
			if (i == 2 && malcompletedinplanned == true)
				return animelist[1][animeId[1].indexOf(Number(anime))].node
					.num_episodes; // it was [0] and [0]
			if (i == 3 && malcompletedinplanned == true)
				return animelist[0][animeId[0].indexOf(Number(anime))].node
					.num_episodes; // it was [1] and [1]
		}
	} catch (e) {}
}

function getMediaType(anime, i) {
	try {
		if (i == 0)
			return animelist[0][animeId[0].indexOf(Number(anime))].node.media_type;
		if (i == 1 && malcompletedinplanned == false)
			return animelist[0][animeId[0].indexOf(Number(anime))].node.media_type;
		if (i == 2 && malcompletedinplanned == false)
			return animelist[1][animeId[1].indexOf(Number(anime))].node.media_type;
		if (i == 2 && malcompletedinplanned == true)
			return animelist[1][animeId[1].indexOf(Number(anime))].node.media_type; // it was [0] and [0]
		if (i == 3 && malcompletedinplanned == true)
			return animelist[0][animeId[0].indexOf(Number(anime))].node.media_type; // it was [1] and [1]
	} catch (e) {}
}

function drawTables(userData) {
	if (malcompletedinplanned) {
		message = {
			command: "getCompletedInPlanned",
			anime: userData.anime,
			animeId: userData.animeId,
			animelist: userData.animelist,
			animenodelist: userData.animenodelist,
			completedorder: completedorder,
		};

		sendMessage(message, (cipData) => {
			drawCompletedInPlanned(cipData.cipanime); // TODO // todo what? // still no idea
			if (maltags) {
				let tables = content.getElementsByTagName("table");
				for (let i in tables) {
					let con = 0;
					table = tables[i].rows;

					if (i == 1 && malcompletedinplanned == true) {
						continue; //
					}

					// Add genres and start date for shared and unique tables
					if (table) {
						for (let row of table) {
							if (con != 0) {
								let element = row.getElementsByClassName("borderClass")[0];

								// Show the statrus of the anime on list (if dropped or on hold)
								if (droptag) {
									let statusSpan = document.createElement("span");
									statusSpan.className = "status";
									element.appendChild(statusSpan);

									if (row.childNodes.length <= 5) {
										let status = getStatus(
											element.innerHTML.slice(16, 22).split("/")[0],
											i
										);
										if (status == "dropped") {
											statusSpan.style.display = "inline-block";
											statusSpan.style.width = "10px"; // Adjust size of the dot
											statusSpan.style.height = "10px";
											statusSpan.style.backgroundColor = "red";
											statusSpan.style.borderRadius = "50%"; // Makes it circular
											statusSpan.style.marginLeft = "5px"; // Optional, adds spacing
										}
										if (status == "on_hold") {
											statusSpan.style.display = "inline-block";
											statusSpan.style.width = "10px"; // Adjust size of the dot
											statusSpan.style.height = "10px";
											statusSpan.style.backgroundColor = "orange";
											statusSpan.style.borderRadius = "50%"; // Makes it circular
											statusSpan.style.marginLeft = "5px"; // Optional, adds spacing (r) Chatptg
										}
									}
								}

								let year = document.createElement("span");
								year.className = "year";
								let span = document.createElement("span");
								span.className = "genres";
								try {
									let attributes = ["("];
									// Add start date after the anime name
									let start_date = getStartDate(
										element.innerHTML.slice(16, 22).split("/")[0],
										i
									);
									if (start_date) attributes.push(start_date);

									let num_episodes = getNumEpisodes(
										element.innerHTML.slice(16, 22).split("/")[0],
										i
									);
									if (mediaType == "manga" && num_episodes)
										attributes.push(", ", num_episodes, " vols");
									else if (mediaType == "anime" && num_episodes)
										attributes.push(", ", num_episodes, " eps");

									let media_type = getMediaType(
										element.innerHTML.slice(16, 22).split("/")[0],
										i
									);
									if (media_type)
										attributes.push(", ", media_type.replace(/_/g, " "));

									attributes.push(")");

									year.innerHTML = attributes.join("");
									year.style.margin = "0 5px";
									element.appendChild(year);

									// Add the genres after the anime name
									let gens = getGenre(
										element.innerHTML.slice(16, 22).split("/")[0],
										i
									);

									if (gens) {
										for (let gen of gens) {
											span.innerHTML = span.innerHTML + gen.name + " | ";
										}
										span.innerHTML = span.innerHTML.slice(0, -2);
										element.appendChild(span);
									}
								} catch (error) {
									console.error(error);
								}
							} else {
								con += 1;
							}
						}
					}
				}
			}
			console.timeEnd("All");

			//affinities start \/
			const rows =
				document.getElementsByTagName("table")[0].children[0].children;

			for (let i = 1; i < rows.length - 2; ++i) {
				let text = rows[i].innerText;
				if (text.startsWith("\n\t\t\t")) continue;
				let newtext = text.split(/\s*(add|edit)\s*/);
				let brandnewtext = text.split(
					/^(.+ (add|edit))(\((\d+)?,? ?(\d+ \w+)?\))?(.+)/
				);
				let arr = brandnewtext[6].split("\t");

				let genres = [];
				try {
					genres = rows[i].querySelector(".genres").innerHTML.split(" | ");
				} catch (e) {}
				genres.push("All");
				const x = Number.parseInt(arr[1]);
				const y = Number.parseInt(arr[2]);
				const diff = Number.parseInt(arr[3]);

				try {
					for (const genre of genres) {
						let tag = values[genre.trim()];
						tag.total += 1;
						if (arr[3] === "\u00a0") continue;
						tag.x.push(x);
						tag.y.push(y);
						tag.diff.push(diff);
						tag.totalx += x;
						tag.totaly += y;
						tag.totaldiff += diff;
					}
				} catch (e) {
					console.log(e);
				}
			}
			let div = document.createElement("div");
			for (let value in values) {
				let tag = values[value];
				let len = tag.x.length;
				tag.meanx = tag.totalx / len;
				tag.meany = tag.totaly / len;
				tag.meandiff = tag.totaldiff / len;
				let meansum = 0;
				let varx = 0;
				let vary = 0;
				for (let i = 0; i < len; ++i) {
					meansum += (tag.x[i] - tag.meanx) * (tag.y[i] - tag.meany);
					varx += (tag.x[i] - tag.meanx) * (tag.x[i] - tag.meanx);
					vary += (tag.y[i] - tag.meany) * (tag.y[i] - tag.meany);
				}
				tag.affinity = meansum / Math.sqrt(varx * vary);
			}

			for (let value in values) {
				let tag = values[value];
				let len = tag.x.length;
				if (value == "All" || tag.total < Number.parseInt(cutoffsetting))
					continue;
				let para = document.createElement("p");
				let text = document.createTextNode(
					`${value} - Entries: ${tag.total} (${tag.x.length}) | Affinity: ${
						isNaN(tag.affinity) ? "Unknown" : (tag.affinity * 100).toFixed(1)
					}% | Mean Diff: ${tag.meandiff.toFixed(2)}`
				);

				para.appendChild(text);
				div.append(para);
			}
			if (affinitysetting) {
				let contentDiv = document.createElement("div");
				contentDiv.id = "content";
				contentDiv.prepend(div);

				document
					.getElementsByClassName("spaceit")[0]
					.parentElement.prepend(contentDiv);
			} else {
				// main div
				let expandableDiv = document.createElement("div");
				expandableDiv.id = "expandableDiv";

				// toggle button
				let toggleButton = document.createElement("button");
				toggleButton.id = "toggleButton";
				toggleButton.innerHTML = "Show tag affinity &#9654;";
				toggleButton.style.cursor = "pointer";
				toggleButton.style.border = "none";

				let contentDiv = document.createElement("div");
				contentDiv.id = "content";
				contentDiv.prepend(div);

				expandableDiv.appendChild(toggleButton);
				expandableDiv.appendChild(contentDiv);

				contentDiv.style.display = "none";

				document
					.getElementsByClassName("spaceit")[0]
					.parentElement.prepend(expandableDiv);

				toggleButton.addEventListener("click", function () {
					if (contentDiv.style.display === "none") {
						contentDiv.style.display = "block";
					} else {
						contentDiv.style.display = "none";
					}
				});
			}

			let tempAffinityToRemove = document.getElementById("tempAffinity");
			tempAffinityToRemove
				? tempAffinityToRemove.remove()
				: console.log("Element not found");

			let para = document.createElement("p");
			let text = document.createTextNode(
				`All - Entries: ${values["All"].total} (${
					values["All"].x.length
				}) | Affinity: ${
					isNaN(values["All"].affinity)
						? "Unknown"
						: (values["All"].affinity * 100).toFixed(1)
				}% | Mean Diff: ${values["All"].meandiff.toFixed(2)}`
			);
			para.style.fontSize = "12px";
			para.style.fontWeight = "bold";
			para.style.padding = "10px 0";
			if (values["All"].affinity <= 0) para.style.color = "firebrick";
			else if (values["All"].affinity >= 0.499) para.style.color = "green";
			para.appendChild(text);
			document.getElementsByClassName("spaceit")[0].parentElement.prepend(para);

			//affinities end /\

			// Ban genres function after the tables are drawn and affinities are calculated
			banGenres();
		});
	} else postDraw();
}

function banGenres() {
	console.time("Ban Media Types");
	// Ban certain media types
	const tables = content.querySelectorAll("table");
	for (let table of tables) {
		for (let row of Array.from(table.rows).slice(1)) {
			if (row.cells[0].childNodes.length === 6) {
				let mediaType;
				try {
					mediaType = row.cells[0].childNodes[4].innerText
						.split(", ")
						.pop()
						.split(")")[0];
				} catch (error) {
					mediaType = null;
				}
				if (banMediaTypes.includes(mediaType)) {
					row.style.display = "none";
					hiddenCounter += 1;
				}
			} else if (row.cells[0].childNodes.length === 5) {
				let mediaType;
				try {
					mediaType = row.cells[0].childNodes[4].innerText
						.split(", ")
						.pop()
						.split(")")[0];
				} catch (error) {
					mediaType = null;
				}
				if (banMediaTypes.includes(mediaType)) {
					row.style.display = "none";
					hiddenCounter += 1;
				}
			}
		}
	}
	console.timeEnd("Ban Media Types");

	console.time("Ban Genres");
	// Ban some genres - integrate this into one above if banned genres become a thing
	if (bonker && bannedGenres.length > 0) {
		const tables = content.querySelectorAll("table");
		for (let table of tables) {
			for (let row of Array.from(table.rows).slice(1)) {
				if (row.cells[0].childNodes.length === 6) {
					let genreNames = row.cells[0].childNodes[5].innerText.split(" | ");
					if (genreNames.some((genre) => bannedGenres.includes(genre))) {
						row.style.display = "none";
						hiddenCounter += 1;
					}
				} else if (row.cells[0].childNodes.length === 5) {
					let genreNames = row.cells[0].childNodes[4].innerText.split(" | ");
					if (genreNames.some((genre) => bannedGenres.includes(genre))) {
						row.style.display = "none";
						hiddenCounter += 1;
					}
				}
			}
		}
	}
	if (bonker) createBonkerFloatingCircle();
	console.timeEnd("Ban Genres");
	console.log("Hidden: " + hiddenCounter);

	highlightGenres();
}

function highlightGenres() {
	console.time("Highlight Genres");
	if (highlighter) {
		if (highlighted && highlighted.length > 0) {
			const colors = [
				"DeepSkyBlue",
				"IndianRed",
				"Chartreuse",
				"MediumOrchid",
				"orange",
				"HotPink",
			];
			const tables = content.querySelectorAll("table");
			for (let table of tables) {
				for (let row of Array.from(table.rows).slice(1)) {
					let genreNode;
					if (row.cells[0].childNodes.length === 6) {
						genreNode = row.cells[0].childNodes[5];
					} else if (row.cells[0].childNodes.length === 5) {
						genreNode = row.cells[0].childNodes[4];
					}

					if (genreNode) {
						let genreNames = genreNode.innerText.split(" | ");
						let highlightedHTML = genreNames
							.map((genre) => {
								let lowerCaseGenre = genre.toLowerCase();
								let index = highlighted.findIndex(
									(highlight) => highlight.toLowerCase() === lowerCaseGenre
								);
								if (index !== -1) {
									let color = colors[index % colors.length];
									return `<span style="color: ${color};">${genre}</span>`;
								} else {
									return genre;
								}
							})
							.join(" | ");
						genreNode.innerHTML = highlightedHTML;
					}
				}
			}
		}
		createHighlighterFloatingCircle();
	}
	console.timeEnd("Highlight Genres");
}

function createHighlighterFloatingCircle() {
	let floatingCircle = document.createElement("div");
	floatingCircle.id = "floatingCircle";
	floatingCircle.style = `
        width: 50px;
        height: 50px;
        background-color: #2e51a2;
        border-radius: 50%;
        position: fixed;
        top: 100px;
        right: 10px;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
		cursor: pointer;
    `;

	let brushIcon = document.createElement("div");
	brushIcon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="24" height="24">
            <path fill="white" d="M339.3 367.1c27.3-3.9 51.9-19.4 67.2-42.9L568.2 74.1c12.6-19.5 9.4-45.3-7.6-61.2S517.7-4.4 499.1 9.6L262.4 187.2c-24 18-38.2 46.1-38.4 76.1L339.3 367.1zm-19.6 25.4l-116-104.4C143.9 290.3 96 339.6 96 400c0 3.9 .2 7.8 .6 11.6C98.4 429.1 86.4 448 68.8 448L64 448c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0c61.9 0 112-50.1 112-112c0-2.5-.1-5-.2-7.5z"/>
        </svg>
    `;

	floatingCircle.appendChild(brushIcon);
	document.body.appendChild(floatingCircle);

	// Create the popup element
	let popup = document.createElement("div");
	popup.id = "popup";
	popup.style = `
        position: fixed;
        top: 150px;
        right: 10px;
        width: 200px;
        padding: 10px;
        background-color: white;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        display: none;
        z-index: 1001;
    `;
	// Add title to the popup
	let title = document.createElement("div");
	title.innerText = "Genre Highlighter";
	title.style = `
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 10px;
		color: black;
    `;
	// Add input field to the popup
	let inputField = document.createElement("input");
	inputField.type = "text";
	inputField.placeholder = "Enter gnres to highlight";
	inputField.value = highlighted.join(", ");
	inputField.style = `
        width: 90%;
        padding: 5px;
        margin-top: 10px;
        border: 1px solid #ccc;
        border-radius: 3px;
    `;

	// Add event listener to update highlightedGenres
	inputField.addEventListener("input", () => {
		highlighted = inputField.value.split(",").map((genre) => genre.trim());
		chrome.storage.sync.get(["highlighted"], function (items) {
			console.log(items);
			if (typeof items["highlighted"] === "undefined") {
				items["highlighted"] = [];
			}
			items["highlighted"] = [...highlighted];
			chrome.storage.sync.set(
				{ highlighted: items["highlighted"] },
				function () {
					console.log(items["highlighted"]);
				}
			);
		});
	});

	popup.appendChild(title);
	popup.appendChild(inputField);
	document.body.appendChild(popup);

	// Add click event listener to the floating circle
	floatingCircle.addEventListener("click", () => {
		popup.style.display = popup.style.display === "none" ? "block" : "none";
	});
}

function createBonkerFloatingCircle() {
	let floatingCircle = document.createElement("div");
	floatingCircle.id = "floatingBonkerCircle";
	floatingCircle.style = `
        width: 50px;
        height: 50px;
        background-color: #2e51a2;
        border-radius: 50%;
        position: fixed;
        top: 160px;
        right: 10px;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
		cursor: pointer;
    `;

	let bonkIcon = document.createElement("div");
	bonkIcon.innerHTML = `
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="24" height="24">
		<path fill="white" d="M318.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-120 120c-12.5 12.5-12.5 32.8 0 45.3l16 16c12.5 12.5 32.8 12.5 45.3 0l4-4L325.4 293.4l-4 4c-12.5 12.5-12.5 32.8 0 45.3l16 16c12.5 12.5 32.8 12.5 45.3 0l120-120c12.5-12.5 12.5-32.8 0-45.3l-16-16c-12.5-12.5-32.8-12.5-45.3 0l-4 4L330.6 74.6l4-4c12.5-12.5 12.5-32.8 0-45.3l-16-16zm-152 288c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l48 48c12.5 12.5 32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-1.4-1.4L272 285.3 226.7 240 168 298.7l-1.4-1.4z"/>
	</svg>
    `;

	floatingCircle.appendChild(bonkIcon);
	document.body.appendChild(floatingCircle);

	// Create the popup element
	let popup = document.createElement("div");
	popup.id = "bonk-popup";
	popup.style = `
        position: fixed;
        top: 210px;
        right: 10px;
        width: 200px;
        padding: 10px;
        background-color: white;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        display: none;
        z-index: 1001;
    `;
	// Add title to the popup
	let title = document.createElement("div");
	title.innerText = "Genre Bonker";
	title.style = `
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 10px;
		color: black;
    `;
	// Add input field to the popup
	let inputField = document.createElement("input");
	inputField.type = "text";
	inputField.placeholder = "Enter gnres to bonk";
	inputField.value = bannedGenres.join(", ");
	inputField.style = `
        width: 90%;
        padding: 5px;
        margin-top: 10px;
        border: 1px solid #ccc;
        border-radius: 3px;
    `;

	// Add event listener to update highlightedGenres
	inputField.addEventListener("input", () => {
		bannedGenres = inputField.value.split(",").map((genre) => genre.trim());
		chrome.storage.sync.get(["bannedGenres"], function (items) {
			console.log(items);
			if (typeof items["bannedGenres"] === "undefined") {
				items["bannedGenres"] = [];
			}
			items["bannedGenres"] = [...bannedGenres];
			chrome.storage.sync.set(
				{ bannedGenres: items["bannedGenres"] },
				function () {
					console.log(items["bannedGenres"]);
				}
			);
		});
	});

	popup.appendChild(title);
	popup.appendChild(inputField);
	document.body.appendChild(popup);

	// Add click event listener to the floating circle
	floatingCircle.addEventListener("click", () => {
		popup.style.display = popup.style.display === "none" ? "block" : "none";
	});
}

function clearPage() {
	let len = content.childNodes.length;
	for (i = 0; i < len - 1; i++) {
		content.childNodes[1].remove();
	}
}

function drawModBar() {
	let modBar = document.createElement("div");
	modBar.style =
		"display: flex; border: 1px solid #fff; border-radius: 4px; padding:0 2rem";

	let spinner = document.createElement("img");
	spinner.src = chrome.runtime.getURL("walk.gif");
	spinner.style = "height: 3rem";

	let modText = document.createElement("h3");
	modText.style = "padding-left:2rem;";
	modText.innerHTML = message[Math.round(Math.random() * message.length)];

	modBar.appendChild(spinner);
	modBar.appendChild(modText);

	content.insertBefore(modBar, content.childNodes[2]);
}

function tempAffinity() {
	const rows = document.getElementsByTagName("table")[0].children[0].children;
	let allAffinity = {};
	allAffinity.total = 0;
	allAffinity.x = [];
	allAffinity.y = [];
	allAffinity.diff = [];
	allAffinity.totaldiff = 0;
	allAffinity.totalx = 0;
	allAffinity.totaly = 0;
	allAffinity.meanx = 0;
	allAffinity.meany = 0;
	allAffinity.meandiff = 0;
	allAffinity.affinity = 0;
	for (let i = 1; i < rows.length - 2; ++i) {
		let text = rows[i].innerText;
		let newtext = text.split(/\s*(add|edit)\s*/);
		let brandnewtext = text.split(
			/^(.+ (add|edit))(\((\d+)?,? ?(\d+ \w+)?\))?(.+)/
		);
		let arr = brandnewtext[6].split("\t");

		const x = Number.parseInt(arr[1]);
		const y = Number.parseInt(arr[2]);
		const diff = Number.parseInt(arr[3]);

		try {
			allAffinity.total += 1;
			if (arr[3] === "\u00a0") continue;
			allAffinity.x.push(x);
			allAffinity.y.push(y);
			allAffinity.diff.push(diff);
			allAffinity.totalx += x;
			allAffinity.totaly += y;
			allAffinity.totaldiff += diff;
		} catch (e) {
			console.log(e);
		}
	}
	let len = allAffinity.x.length;
	allAffinity.meanx = allAffinity.totalx / len;
	allAffinity.meany = allAffinity.totaly / len;
	allAffinity.meandiff = allAffinity.totaldiff / len;
	let meansum = 0;
	let varx = 0;
	let vary = 0;
	for (let i = 0; i < len; ++i) {
		meansum +=
			(allAffinity.x[i] - allAffinity.meanx) *
			(allAffinity.y[i] - allAffinity.meany);
		varx +=
			(allAffinity.x[i] - allAffinity.meanx) *
			(allAffinity.x[i] - allAffinity.meanx);
		vary +=
			(allAffinity.y[i] - allAffinity.meany) *
			(allAffinity.y[i] - allAffinity.meany);
	}
	allAffinity.affinity = meansum / Math.sqrt(varx * vary);
	let para = document.createElement("p");
	let text = document.createTextNode(
		`All - Entries: ${allAffinity.total} (${
			allAffinity.x.length
		}) | Affinity: ${
			isNaN(allAffinity.affinity)
				? "Unknown"
				: (allAffinity.affinity * 100).toFixed(1)
		}% | Mean Diff: ${allAffinity.meandiff.toFixed(2)}`
	);
	para.style.fontSize = "12px";
	para.style.fontWeight = "bold";
	para.style.padding = "10px 0";
	para.id = "tempAffinity";
	if (allAffinity.affinity <= 0) para.style.color = "firebrick";
	else if (allAffinity.affinity >= 0.499) para.style.color = "green";
	para.appendChild(text);
	document.getElementsByClassName("spaceit")[0].parentElement.prepend(para);
}

let sendMessage = function (message, callback) {
	chrome.runtime.sendMessage(message, callback);
};

let message = [
	"Generating witty dialog...",
	"Spinning violently around the y-axis...",
	"Bending the spoon...",
	"Filtering morale...",
	"Don't think of purple hippos...",
	"We need a new fuse...",
	"Have a good day.",
	"Upgrading Windows, your PC will restart several times. Sit back and relax.",
	"The architects are still drafting",
	"The bits are breeding",
	"We're building the buildings as fast as we can",
	"Would you prefer chicken, steak, or tofu?",
	"(Pay no attention to the man behind the curtain)",
	"...and enjoy the elevator music...",
	"Please wait while the little elves draw your map",
	"Don't worry - a few bits tried to escape, but we caught them",
	"Would you like fries with that?",
	"Checking the gravitational constant in your locale...",
	"Go ahead -- hold your breath!",
	"...at least you're not on hold...",
	"Hum something loud while others stare",
	"You're not in Kansas any more",
	"The server is powered by a lemon and two electrodes.",
	"We're testing your patience",
	"As if you had any other choice",
	"Follow the white rabbit",
	"Why don't you order a sandwich?",
	"While the satellite moves into position",
	"The bits are flowing slowly today",
	"Dig on the 'X' for buried treasure... ARRR!",
	"The last time I tried this the monkey didn't survive. Let's hope it works better this time.",
	"My other loading screen is much faster.",
	"Testing on Timmy... We're going to need another Timmy.",
	"(Insert quarter)",
	"Are we there yet?",
	"Have you lost weight?",
	"Just count to 10",
	"Why so serious?",
	"Counting backwards from Infinity",
	"Don't panic...",
	"Do not run! We are your friends!",
	"Do you come here often?",
	"Warning: Don't set yourself on fire.",
	"We're making you a cookie.",
	"Spinning the wheel of fortune...",
	"Loading the enchanted bunny...",
	"Computing chance of success",
	"I'm sorry Dave, I can't do that.",
	"I feel like im supposed to be loading something. . .",
	"Is this Windows?",
	"Don't break your screen yet!",
	"I swear it's almost done.",
	"Let's take a mindfulness minute...",
	"Unicorns are at the end of this road, I promise.",
	"Listening for the sound of one hand clapping...",
	"Keeping all the 1's and removing all the 0's...",
	"Putting the icing on the cake. The cake is not a lie...",
	"Cleaning off the cobwebs...",
	"Making sure all the i's have dots...",
	"Where did all the internets go",
	"Granting wishes...",
	"Time flies when you’re having fun.",
	"Get some coffee and come back in ten minutes..",
	"Spinning the hamster…",
	"Stay awhile and listen..",
	"Load it and they will come",
	"Convincing AI not to turn evil..",
	"Your left thumb points to the right and your right thumb points to the left.",
	"How did you get here?",
	"Wait, do you smell something burning?",
	"Computing the secret to life, the universe, and everything.",
	"When nothing is going right, go left!!...",
	"I love my job only when I'm on vacation...",
	"i'm not lazy, I'm just relaxed!!",
	"Never steal. The government hates competition....",
	"Whenever I find the key to success, someone changes the lock.",
	"I’ve got problem for your solution…..",
	"I think I am, therefore, I am. I think.",
	"We are not liable for any broken screens as a result of waiting.",
	"Hello IT, have you tried turning it off and on again?",
	"Well, this is embarrassing.",
	"Hello, IT... Have you tried forcing an unexpected reboot?",
	"They're fairly regular, the beatings, yes. I'd say we're on a bi-weekly beating.",
	"The Elders of the Internet would never stand for it.",
	"Didn't know paint dried so quickly.",
	"I'm going to walk the dog",
	"Dividing by zero...",
	"Spawn more Overlord!",
	"If I’m not back in five minutes, just wait longer.",
	"Cracking military-grade encryption...",
	"Laughing at your pictures-i mean, loading...",
	"Sending data to NS-i mean, our servers.",
	"Looking for sense of humour, please hold on.",
	"Please wait while the intern refills his coffee.",
	"A different error message? Finally, some progress!",
	"Please hold on as we reheat our coffee",
	"Kindly hold on as we convert this bug to a feature...",
	"Winter is coming...",
	"Distracted by cat gifs",
	"Finding someone to hold my beer",
	"@todo Insert witty loading message",
	"Let's hope it's worth the wait",
	"Aw, snap! Not..",
	"Ordering 1s and 0s...",
	"Whatever you do, don't look behind you...",
	"Please wait... Consulting the manual...",
	"Loading funny message...",
	"It's 10:00pm. Do you know where your children are?",
	"Feel free to spin in your chair",
	"What the what?",
	"What's under there?",
	"Go ahead, hold your breath and do an ironman plank till loading complete",
	"Help, I'm trapped in a loader!",
	"What is the difference btwn a hippo and a zippo? One is really heavy, the other is a little lighter",
	"Mining some bitcoins...",
	"Downloading more RAM..",
	"Updating to Windows Vista...",
	"Deleting System32 folder",
	"Alt-F4 speeds things up.",
	"When was the last time you dusted around here?",
	"Never let a computer know you're in a hurry.",
	"Shovelling coal into the server",
	"Pushing pixels...",
	"How about this weather, eh?",
	"Building a wall...",
	"Everything in this universe is either a potato or not a potato",
	"Reading Terms and Conditions for you.",
	"Digested cookies being baked again.",
	"Deleting all your hidden [homework]...",
	"Definitely not a virus...",
	"You may call me Steve.",
	"You seem like a nice person...",
	"Patience! This is difficult, you know...",
	"Discovering new ways of making you wait...",
	"Your time is very important to us. Please wait while we ignore you...",
	"Sooooo... Have you seen my vacation photos yet?",
	"Sorry we are busy catching em' all, we're done soon",
	"TODO: Insert elevator music",
	"Still faster than Windows update",
	"Please wait while the minions do their work",
	"You are number 2843684714 in the queue",
	"Please wait while we serve other customers...",
	"Our premium plan is faster",
	"Feeding unicorns...",
	"Assembling a Gundam under your tree...",
	"Wrapping your anime merch with care... and duct tape.",
	"Sorting Santa’s naughty list with the Death Note...",
	"Reindeers cosplaying as Titans... loading might take a while.",
	"The reindeers are debating over the best waifu... please hold.",
	"Santa’s workshop just ran out of magic... recharging with ramen.",
	"Stacking your presents higher than an anime protagonist’s hair...",
	"Stitching together your anime-themed ugly Christmas sweater...",
	"Double-checking if All Might is on the nice list... please wait.",
	"Loading... the elves are watching *One Piece* and lost count of episodes.",
	"Santa’s workshop is binge-watching your favorite anime... please wait.",
	"Delivering anime Blu-rays via reindeer-powered drones...",
	"Caught in an anime filler arc... hold on tight!",
	"Santa’s bag is overfilled with manga volumes... compressing...",
	"Wrapping your anime-inspired Christmas cookies... almost done!",
	"Checking if Santa can fit a life-sized Gundam under the tree...",
	"Crafting a Naruto headband for stocking...",
	"Finding the perfect anime soundtrack for user matching...",
	"Matching users faster than Santa checks his list twice...",
	"Analyzing anime compatibility... and your holiday cheer levels!",
	"Sorting through Santa’s list of anime fans... almost there!",
	"Checking if Santa approves of their taste in anime genres...",
	"Analyzing anime lists... no coal this time, promise!",
	"Cross-referencing naughty anime tastes...",
	"Analyzing user lists for the most wholesome holiday recommendations...",
	"Scanning MAL for gift ideas...",
	"Debating waifus in the workshop...",
	"Choosing manga over cookies...",
	"Checking who deserves coal...",
	"Checking if they skipped the *Naruto* fillers...",
	"Finding someone who shares the love for *My Neighbor Totoro*...",
	"Deciding if this match deserves *One Piece* or *Bleach*...",
	"Recommending manga that pairs well with hot cocoa...",
	"Finding anime suggestions as wholesome as *Clannad*...",
	"Compiling the top 10 waifus for this match...",
	"ESpiking the punch with glühwein... almost ready!",
	"Too much glühwein... rechecking the matches.",
	"Glühwein spilled on users' stats... hold on!",
	"Sipping glühwein while loading your matches...",
];
