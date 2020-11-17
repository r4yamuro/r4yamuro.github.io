importScripts(
	"https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js"
);
if (workbox) console.log(`Workbox berhasil dimuat`);
else console.log(`Workbox gagal dimuat`);

// Precaching App Shell

let urlsToCache = [
	{ url: "/index.html", revision: "3c" },
	{ url: "/nav.html", revision: "2" },
	{ url: "/teams.html", revision: "3c" },
	{ url: "/sw.js", revision: "1" },
	{ url: "/src/pages/home.html", revision: "1c" },
	{ url: "/src/pages/fav.html", revision: "1c" },
	{ url: "/src/css/materialize.min.css", revision: "1" },
	{ url: "/src/css/style.css", revision: "2a" },
	{ url: "/src/js/materialize.min.js", revision: "1" },
	{ url: "/src/js/sw-register.js", revision: "1" },
	{ url: "/src/js/load-team.js", revision: "1" },
	{ url: "/src/js/nav.js", revision: "1" },
	{ url: "/src/js/api.js", revision: "5e" },
	{ url: "/src/js/idb.js", revision: "1" },
	{ url: "/src/js/db.js", revision: "3b" },
	{ url: "/src/img/ball.png", revision: "1" },
	{ url: "/src/img/icon.png", revision: "1" },
	{ url: "/src/img/icon-small.png", revision: "1" },
	{ url: "/manifest.json", revision: "1" },
	{ url: "/src/font/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2", revision: "1" },
];

workbox.precaching.precacheAndRoute(urlsToCache, {
	// Ignore all URL parameters.
	ignoreURLParametersMatching: [/.*/],
});

workbox.routing.registerRoute(
	/https:\/\/api\.football-data\.org\/v2/,
	new workbox.strategies.StaleWhileRevalidate({
		cacheName: "footballinfo",
		plugins: [
			new workbox.expiration.ExpirationPlugin({
				maxAgeSeconds: 60 * 60, //60 minutes
			}),
		],
	})
);

self.addEventListener("push", function (event) {
	let body;
	if (event.data) {
		body = event.data.text();
	} else {
		body = "push message to payload";
	}
	const options = {
		body: body,
		icon: "/src/img/icon.png",
		vibrate: [100, 50, 100],
		data: {
			dateOfArrival: Date.now(),
			primaryKey: 1,
		},
	};
	event.waitUntil(
		self.registration.showNotification("Push Notification", options)
	);
});
