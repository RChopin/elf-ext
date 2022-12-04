let settings = {};
let sharedtypes = [];
let sharedanime = [];
let user = [];
let animelist = [[], []];
let animenodelist = [[], []];
let animeId = [[], []];
let mediaType;
let settingsUnset = false;

let maltags;
let malcompletedinplanned;
let malplus;

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

	let flip = document.createElement("DIV");
	let aflip = document.createElement("A");
	aflip.text = "Flip users";
	aflip.href = `/shared.php?u1=${user[1]}&u2=${user[0]}${
		mediaType == "manga" ? "&type=manga" : ""
	}`;
	flip.appendChild(aflip);

	flip.style.display = "inline-block";
	content.insertBefore(flip, content.childNodes[1]);

	chrome.storage.sync.get(
		["tags", "completed", "malgraph", "malexlogin"],
		function (settingsdata) {
			maltags = settingsdata["tags"];
			malcompletedinplanned = settingsdata["completed"];
			malplus = settingsdata["malgraph"];
			mallogin = settingsdata["malexlogin"];

			let Run = true;

			if (maltags === undefined) maltags = false;

			if (malcompletedinplanned === undefined) malcompletedinplanned = false;

			if (malplus === undefined) malplus = false;

			if (mallogin === undefined) mallogin = false;

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
						// clearPage();
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
								// clearPage();
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

	// modText.style =
	//   "cursor: pointer; padding:4px 4px; font-family: Avenir,lucida grande,tahoma,verdana,arial,sans-serif; text-decoration: none; color:white;border-radius: 2px; font-size:14px;font-weight: 700;text-align: center;margin-left: 8px; background:#2e51a2;";
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
	// let flip = document.createElement("DIV");
	// let aflip = document.createElement("A");
	// aflip.text = "Flip users";
	// aflip.href = `/shared.php?u1=${user[1]}&u2=${user[0]}${
	//   mediaType == "manga" ? "&type=manga" : ""
	// }`;
	// flip.appendChild(aflip);

	// flip.style.display = "inline-block";
	// content.insertBefore(flip, content.childNodes[1]);
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
	header.innerHTML = `Completed by <a href="/profile/${user[1]}">${user[1]}</a>, planned by <a href="/profile/${user[0]}">${user[0]}</a>`;
	content.insertBefore(document.createElement("br"), content.childNodes[a]);
	content.insertBefore(document.createElement("a"), content.childNodes[a + 1]);
	content.insertBefore(header, content.childNodes[a + 2]);

	let table = document.createElement("TABLE");
	table.cellpadding = "0";
	table.width = "100%";
	table.cellspacing = "0";
	table.border = 0;

	let header2 = document.createElement("tr");
	header2.innerHTML = `
  <td class="borderClass"><a href="?u1=${user[1]}&amp;u2=${user[0]}&amp;type=${mediaType}&amp;o=1"><strong>Title</strong></a></td>
  <td class="borderClass" width="140" align="center"><a href="?u1=${user[1]}&amp;u2=${user[0]}&amp;type=${mediaType}&amp;o=2"><strong>${user[1]}'s Score</strong></a></td>
`;
	table.appendChild(header2);

	let tbody = document.createElement("TBODY");
	for (let anime of animeData) {
		let title = animelist[1][animeId[1].indexOf(anime)].node.title;
		let score = animelist[1][animeId[1].indexOf(anime)].list_status.score;
		let doTagsExist;
		if (
			typeof animelist[1][animeId[1].indexOf(anime)].node.genres === "undefined"
		) {
			doTagsExist = false;
		} else {
			doTagsExist = true;
		}
		if (score == 0) score = "-";

		let tr = document.createElement("TR");
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

function drawTables(userData) {
	if (malcompletedinplanned) {
		message = {
			command: "getCompletedInPlanned",
			anime: userData.anime,
			animeId: userData.animeId,
			animelist: userData.animelist,
			animenodelist: userData.animenodelist,
		};

		sendMessage(message, (cipData) => {
			drawCompletedInPlanned(cipData.cipanime); // TODO // todo what?
			if (maltags) {
				let tables = content.getElementsByTagName("table");
				for (let i in tables) {
					let con = 0;
					table = tables[i].rows;

					if (i == 1 && malcompletedinplanned == true) {
						continue; //
					}

					if (table) {
						for (let row of table) {
							if (con != 0) {
								let element = row.getElementsByClassName("borderClass")[0];
								let span = document.createElement("span");
								span.className = "genres";
								try {
									let gens = getGenre(
										element.innerHTML.slice(16, 22).split("/")[0],
										i
									);
									if (i == 2) {
										console.log(gens);
									}
									if (gens) {
										for (let gen of gens) {
											span.innerHTML = span.innerHTML + gen.name + " | ";
											// element.innerHTML = element.innerHTML + gen.name + " | ";
										}
										span.innerHTML = span.innerHTML.slice(0, -2);
										element.appendChild(span);
										// element.innerHTML = element.innerHTML.slice(0, -2);
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
		});
	} else postDraw();

	// this thing below is something i did last year and don't remember what it was supposed to be
	// let message = {
	//   command: "getShared",
	//   anime: userData.anime,
	//   animeId: userData.animeId,
	//   animelist: userData.animelist,
	//   animenodelist: userData.animenodelist,
	//   sharedtypes: settings.sharedtypes,
	// };

	// sendMessage(message, (sharedData) => {
	//   sharedanime = sharedData.sharedanime;
	//   drawShared(sharedData.sharedanime);
	//   message = {
	//     command: "getUnique",
	//     anime: userData.anime,
	//     animeId: userData.animeId,
	//     animelist: userData.animelist,
	//     animenodelist: userData.animenodelist,
	//     sharedanime: sharedanime,
	//   };

	//   sendMessage(message, (uniqueData) => {
	//     drawUnique(uniqueData.uniqueanime);
	//     if (malcompletedinplanned) {
	//       message = {
	//         command: "getCompletedInPlanned",
	//         anime: userData.anime,
	//         animeId: userData.animeId,
	//         animelist: userData.animelist,
	//         animenodelist: userData.animenodelist,
	//       };

	//       sendMessage(message, (cipData) => {
	//         drawCompletedInPlanned(cipData.cipanime); // TODO
	//         console.timeEnd("All");
	//       });
	//     } else postDraw();
	//   });
	// });
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
	modText.innerHTML = message[Math.round(Math.random() * 234)];

	modBar.appendChild(spinner);
	modBar.appendChild(modText);

	content.insertBefore(modBar, content.childNodes[2]);
}

let sendMessage = function (message, callback) {
	chrome.runtime.sendMessage(message, callback);
};
let message = [
	"Generating witty dialog...",
	"Swapping time and space...",
	"Spinning violently around the y-axis...",
	"Tokenizing real life...",
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
	"Creating time-loop inversion field",
	"Spinning the wheel of fortune...",
	"Loading the enchanted bunny...",
	"Computing chance of success",
	"I'm sorry Dave, I can't do that.",
	"Looking for exact change",
	"All your web browser are belong to us",
	"All I really need is a kilobit.",
	"I feel like im supposed to be loading something. . .",
	"What do you call 8 Hobbits? A Hobbyte.",
	"Should have used a compiled language...",
	"Is this Windows?",
	"Adjusting flux capacitor...",
	"Please wait until the sloth starts moving.",
	"Don't break your screen yet!",
	"I swear it's almost done.",
	"Let's take a mindfulness minute...",
	"Unicorns are at the end of this road, I promise.",
	"Listening for the sound of one hand clapping...",
	"Keeping all the 1's and removing all the 0's...",
	"Putting the icing on the cake. The cake is not a lie...",
	"Cleaning off the cobwebs...",
	"Making sure all the i's have dots...",
	"We need more dilithium crystals",
	"Where did all the internets go",
	"Connecting Neurotoxin Storage Tank...",
	"Granting wishes...",
	"Time flies when you’re having fun.",
	"Get some coffee and come back in ten minutes..",
	"Spinning the hamster…",
	"99 bottles of beer on the wall..",
	"Stay awhile and listen..",
	"Be careful not to step in the git-gui",
	"You edhall not pass! yet..",
	"Load it and they will come",
	"Convincing AI not to turn evil..",
	"There is no spoon. Because we are not done loading it",
	"Your left thumb points to the right and your right thumb points to the left.",
	"How did you get here?",
	"Wait, do you smell something burning?",
	"Computing the secret to life, the universe, and everything.",
	"When nothing is going right, go left!!...",
	"I love my job only when I'm on vacation...",
	"i'm not lazy, I'm just relaxed!!",
	"Never steal. The government hates competition....",
	"Why are they called apartments if they are all stuck together?",
	"Life is Short – Talk Fast!!!!",
	"Optimism – is a lack of information.....",
	"Save water and shower together",
	"Whenever I find the key to success, someone changes the lock.",
	"Sometimes I think war is God’s way of teaching us geography.",
	"I’ve got problem for your solution…..",
	"Where there’s a will, there’s a relative.",
	"User: the word computer professionals use when they mean !!idiot!!",
	"Adults are just kids with money.",
	"I think I am, therefore, I am. I think.",
	"A kiss is like a fight, with mouths.",
	"You don’t pay taxes—they take taxes.",
	"Coffee, Chocolate, Men. The richer the better!",
	"I am free of all prejudices. I hate everyone equally.",
	"git happens",
	"May the forks be with you",
	"A commit a day keeps the mobs away",
	"This is not a joke, it's a commit.",
	"Constructing additional pylons...",
	"Roping some seaturtles...",
	"Locating Jebediah Kerman...",
	"We are not liable for any broken screens as a result of waiting.",
	"Hello IT, have you tried turning it off and on again?",
	"If you type Google into Google you can break the internet",
	"Well, this is embarrassing.",
	"What is the airspeed velocity of an unladen swallow?",
	"Hello, IT... Have you tried forcing an unexpected reboot?",
	"They just toss us away like yesterday's jam.",
	"They're fairly regular, the beatings, yes. I'd say we're on a bi-weekly beating.",
	"The Elders of the Internet would never stand for it.",
	"Space is invisible mind dust, and stars are but wishes.",
	"Didn't know paint dried so quickly.",
	"Everything sounds the same",
	"I'm going to walk the dog",
	"I didn't choose the engineering life. The engineering life chose me.",
	"Dividing by zero...",
	"Spawn more Overlord!",
	"If I’m not back in five minutes, just wait longer.",
	"Some days, you just can’t get rid of a bug!",
	"We’re going to need a bigger boat.",
	"Chuck Norris never git push. The repo pulls before.",
	"Web developers do it with <style>",
	"I need to git pull --my-life-together",
	"Java developers never RIP. They just get Garbage Collected.",
	"Cracking military-grade encryption...",
	"Simulating traveling salesman...",
	"Proving P=NP...",
	"Entangling superstrings...",
	"Twiddling thumbs...",
	"Searching for plot device...",
	"Trying to sort in O(n)...",
	"Laughing at your pictures-i mean, loading...",
	"Sending data to NS-i mean, our servers.",
	"Looking for sense of humour, please hold on.",
	"Please wait while the intern refills his coffee.",
	"A different error message? Finally, some progress!",
	"Hold on while we wrap up our git together...sorry",
	"Please hold on as we reheat our coffee",
	"Kindly hold on as we convert this bug to a feature...",
	"Kindly hold on as our intern quits vim...",
	"Winter is coming...",
	"Installing dependencies",
	"Switching to the latest JS framework...",
	"Distracted by cat gifs",
	"Finding someone to hold my beer",
	"BRB, working on my side project",
	"@todo Insert witty loading message",
	"Let's hope it's worth the wait",
	"Aw, snap! Not..",
	"Ordering 1s and 0s...",
	"Updating dependencies...",
	"Whatever you do, don't look behind you...",
	"Please wait... Consulting the manual...",
	"It is dark. You're likely to be eaten by a grue.",
	"Loading funny message...",
	"It's 10:00pm. Do you know where your children are?",
	"Waiting Daenerys say all her titles...",
	"Feel free to spin in your chair",
	"What the what?",
	"format C: ...",
	"Forget you saw that password I just typed into the IM ...",
	"What's under there?",
	"Your computer has a virus, its name is Windows!",
	"Go ahead, hold your breath and do an ironman plank till loading complete",
	"Bored of slow loading spinner, buy more RAM!",
	"Help, I'm trapped in a loader!",
	"What is the difference btwn a hippo and a zippo? One is really heavy, the other is a little lighter",
	"Please wait, while we purge the Decepticons for you. Yes, You can thanks us later!",
	"Chuck Norris once urinated in a semi truck's gas tank as a joke....that truck is now known as Optimus Prime.",
	"Chuck Norris doesn’t wear a watch. HE decides what time it is.",
	"Mining some bitcoins...",
	"Downloading more RAM..",
	"Updating to Windows Vista...",
	"Deleting System32 folder",
	"Hiding all ;'s in your code",
	"Alt-F4 speeds things up.",
	"Initializing the initializer...",
	"When was the last time you dusted around here?",
	"Optimizing the optimizer...",
	"Last call for the data bus! All aboard!",
	"Running swag sticker detection...",
	"Never let a computer know you're in a hurry.",
	"A computer will do what you tell it to do, but that may be much different from what you had in mind.",
	"Some things man was never meant to know. For everything else, there's Google.",
	"Unix is user-friendly. It's just very selective about who its friends are.",
	"Shovelling coal into the server",
	"Pushing pixels...",
	"How about this weather, eh?",
	"Building a wall...",
	"Everything in this universe is either a potato or not a potato",
	"The severity of your issue is always lower than you expected.",
	"Updating Updater...",
	"Downloading Downloader...",
	"Debugging Debugger...",
	"Reading Terms and Conditions for you.",
	"Digested cookies being baked again.",
	"Live long and prosper.",
	"There is no cow level, but there's a goat one!",
	"Deleting all your hidden porn...",
	"Running with scissors...",
	"Definitely not a virus...",
	"You may call me Steve.",
	"You seem like a nice person...",
	"Coffee at my place, tommorow at 10A.M. - don't be late!",
	"Work, work...",
	"Patience! This is difficult, you know...",
	"Discovering new ways of making you wait...",
	"Your time is very important to us. Please wait while we ignore you...",
	"Time flies like an arrow; fruit flies like a banana",
	"Two men walked into a bar; the third ducked...",
	"Sooooo... Have you seen my vacation photos yet?",
	"Sorry we are busy catching em' all, we're done soon",
	"TODO: Insert elevator music",
	"Still faster than Windows update",
	"Composer hack: Waiting for reqs to be fetched is less frustrating if you add -vvv to your command.",
	"Please wait while the minions do their work",
	"Grabbing extra minions",
	"Doing the heavy lifting",
	"We're working very Hard .... Really",
	"Waking up the minions",
	"You are number 2843684714 in the queue",
	"Please wait while we serve other customers...",
	"Our premium plan is faster",
	"Feeding unicorns...",
];
