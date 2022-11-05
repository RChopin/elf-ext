let user;
let animelist;
let animenodelist;
let animeId;
let sharedanime;
let sharedtypes;
let uniqueanime;
let cipanime;
let auth_type;
let auth_token;
let mediaType;

// const no_auth_token = "";
// const CLIENT_ID = encodeURIComponent("");

const MAL_URI_ENDPOINT = "https://myanimelist.net/v1/oauth2/authorize";
const RESPONSE_TYPE = encodeURIComponent("code");

var text = "";
var possible =
	"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
for (var i = 0; i < 128; i++) {
	text += possible.charAt(Math.floor(Math.random() * possible.length));
}
const CODE_CHALLENGE = encodeURIComponent(text);
const STATE = encodeURIComponent("RequestID42");
// const REDIRECT_URI = encodeURIComponent("https://000.chromiumapp.org/");

function create_auth_endpoint() {
	let endpoint_url = `${MAL_URI_ENDPOINT}
?response_type=${RESPONSE_TYPE}
&client_id=${CLIENT_ID}
&code_challenge=${CODE_CHALLENGE}
&state=${STATE}`;
	return endpoint_url;
}

function launchAuthFlow(sendResponse) {
	var redirectURL = chrome.identity.getRedirectURL();

	chrome.identity.launchWebAuthFlow(
		{
			url: create_auth_endpoint(),
			interactive: true,
		},
		function (redirect_uri) {
			if (chrome.runtime.lastError || redirect_uri.includes("access_denied")) {
				console.log(chrome.runtime.lastError);
				console.log("Could not authenticate.");
			} else {
				getToken(redirect_uri.slice(63, -18), sendResponse).then(
					sendResponse({ message: "auth_completed" })
				);
			}
		}
	);
	return true;
}

async function getToken(code, sendResponse) {
	const MAL_TOKEN_ENDPOINT = "https://myanimelist.net/v1/oauth2/token";
	const CODE = encodeURIComponent(code);
	const GRANT_TYPE = encodeURIComponent("authorization_code");
	var tokenUrl = `${MAL_TOKEN_ENDPOINT}`;
	await fetch(tokenUrl, {
		method: "POST",

		headers: {
			"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
		},
		body: new URLSearchParams({
			client_id: CLIENT_ID,
			code: CODE,
			code_verifier: CODE_CHALLENGE,
			grant_type: GRANT_TYPE,
		}).toString(),
	})
		.then((response) => response.json())
		.then((data) => {
			chrome.cookies.set({
				url: "https://myanimelist.net/",
				name: "token",
				value: data.access_token,
				expirationDate: new Date().getTime() / 1000 + data.expires_in,
				secure: true,
				httpOnly: true,
			});
		});
}

// chrome.runtime.onInstalled.addListener((installed) => {
//   console.log(installed);
// });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	user = [];
	animelist = [[], []];
	animenodelist = [[], []];
	animeId = [[], []];
	sharedanime = [];
	sharedtypes = [];
	uniqueanime = [[], []];
	cipanime = [];
	auth_token = null;
	mediaType = null;

	if (sender.tab.url.includes("manga")) {
		mediaType = "manga";
	} else {
		mediaType = "anime";
	}

	if (message) {
		switch (message.command) {
			case "login":
				launchAuthFlow(sendResponse);
				return true;
			case "auth_check":
				let domain = "https://myanimelist.net/";
				let name = "token";

				chrome.cookies.get({ url: domain, name: name }, function (cookie) {
					if (cookie) sendResponse({ message: "authorized" });
					else sendResponse({ message: "auth_required" });
				});
				return true;

			case "getUserData":
				user[0] = message.u0;
				user[1] = message.u1;
				auth_type = message.auth_type;

				if (auth_type === true) {
					let domain = "https://myanimelist.net/";
					let name = "token";
					chrome.cookies.get({ url: domain, name: name }, function (cookie) {
						if (cookie) {
							auth_token = cookie.value;
							console.time("fetchDataTotal");
							console.time("fetchDataU1");
							getUserData(0).then(() => {
								console.timeEnd("fetchDataU1");
								console.time("fetchDataU2");
								getUserData(1).then(() => {
									console.timeEnd("fetchDataU2");
									console.time("fetchDataEnd");
									parseUserData().then(() => {
										var response = {
											animelist: animelist,
											animenodelist: animenodelist,
											animeId: animeId,
										};
										console.timeEnd("fetchDataEnd");
										console.timeEnd("fetchDataTotal");
										sendResponse(response);
									});
								});
							});
						}
					});
				} else {
					console.time("fetchDataTotal");
					console.time("fetchDataU1");
					getUserData(0).then(() => {
						console.timeEnd("fetchDataU1");
						console.time("fetchDataU2");
						getUserData(1).then(() => {
							console.timeEnd("fetchDataU2");
							console.time("fetchDataEnd");
							parseUserData().then(() => {
								var response = {
									animelist: animelist,
									animenodelist: animenodelist,
									animeId: animeId,
								};
								console.timeEnd("fetchDataEnd");
								console.timeEnd("fetchDataTotal");
								sendResponse(response);
							});
						});
					});
				}

				return true;
			case "getShared":
				anime = message.anime;
				animeId = message.animeId;
				animelist = message.animelist;
				animenodelist = message.animenodelist;
				sharedtypes = message.sharedtypes;

				getShared().then(() => {
					var response = {
						sharedanime: sharedanime,
					};
					sendResponse(response);
				});

				return true;

			case "getUnique":
				anime = message.anime;
				animeId = message.animeId;
				animelist = message.animelist;
				animenodelist = message.animenodelist;
				sharedanime = message.sharedanime;

				getUnique().then(() => {
					var response = {
						uniqueanime: uniqueanime,
					};
					sendResponse(response);
				});

				return true;

			case "getCompletedInPlanned":
				anime = message.anime;
				animeId = message.animeId;
				animelist = message.animelist;
				animenodelist = message.animenodelist;

				getCompletedInPlanned().then(() => {
					var response = {
						cipanime: cipanime,
					};
					sendResponse(response);
				});

				return true;
		}
	}
});

async function getCompletedInPlanned() {
	// take all user anime
	// check if in cpl
	// check if in 2nd user's ptw
	// if so push to temp

	console.time("getCompletedInPlanned");

	let templist = [];

	if (mediaType == "anime") {
		plan_to_do_what = "plan_to_watch";
	} else {
		plan_to_do_what = "plan_to_read";
	}

	for (let anime of animelist[1]) {
		if (anime.list_status.status == "completed") {
			if (animeId[0].includes(anime.node.id)) {
				if (
					animelist[0][animeId[0].indexOf(anime.node.id)].list_status.status ==
					plan_to_do_what
				) {
					templist.push(anime.node.id);
				}
			}
		}
	}

	cipanime = [...templist];

	console.timeEnd("getCompletedInPlanned");
}

async function getUnique() {
	// take all user anime
	// check if in shared => cont
	// check if in ptw => cont
	// push all reamaining to temp list

	console.time("getUnique");

	let tempshared = [];
	for (let anime of sharedanime) {
		tempshared.push(anime.id);
	}

	let templist = [[], []];
	let plan_to_do_what;
	if (mediaType == "anime") {
		plan_to_do_what = "plan_to_watch";
	} else {
		plan_to_do_what = "plan_to_read";
	}
	for (let i in animelist) {
		for (let anime of animelist[i]) {
			if (tempshared.includes(anime.node.id)) continue;
			if (anime.list_status.status == plan_to_do_what) continue;
			templist[i].push(animeId[i][animeId[i].indexOf(anime.node.id)]);
		}
	}
	uniqueanime = [...templist];

	console.timeEnd("getUnique");
}

async function getShared() {
	console.time("getShared");
	for (let anime of animeId[0]) {
		if (animeId[1].includes(anime)) {
			try {
				if (
					sharedtypes.includes(
						animelist[0][animeId[0].indexOf(anime)].list_status.status
					) &&
					sharedtypes.includes(
						animelist[1][animeId[1].indexOf(anime)].list_status.status
					)
				)
					sharedanime.push({
						id: anime,
						title: animelist[0][animeId[0].indexOf(anime)].node.title,
						u0: animelist[0][animeId[0].indexOf(anime)].list_status.score,
						u1: animelist[1][animeId[1].indexOf(anime)].list_status.score,
					});
			} catch (e) {
				console.warn(e);
				console.warn(
					animenodelist[1][animeId[1].indexOf(anime)].title,
					"caused some trouble"
				);
			}
		}
	}
	console.timeEnd("getShared");
}

async function parseUserData() {
	for (let list in animelist) {
		for (let anime of animelist[list]) {
			animeId[list].push(anime.node.id);
			animenodelist[list].push(anime.node);
		}
	}
}

async function getUserData(userNo, paging) {
	let userUrl;
	let header;
	if (auth_type) {
		header = {
			Authorization: "Bearer " + auth_token,
			"Content-Type": "application/json",
			charset: "utf-8",
		};
	} else {
		header = {
			"X-MAL-CLIENT-ID": no_auth_token,
			"Content-Type": "application/json",
			charset: "utf-8",
		};
	}
	if (paging) userUrl = paging;
	else
		userUrl = `https://api.myanimelist.net/v2/users/${user[userNo]}/${mediaType}list?fields=list_status(status,score,genres)&nsfw=true&limit=1000`;
	console.log(userUrl);
	await fetch(userUrl, {
		method: "GET",
		headers: header,
	})
		.then((response) => response.json())
		.then((data) => {
			animelist[userNo].push(...data.data);
			if (data.data.length == 1000) {
				return getUserData(userNo, data.paging.next);
			}
		})
		.catch((error) => {
			console.error("Error:", error);
		});
}
