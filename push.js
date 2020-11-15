const webPush = require("web-push");

const vapidKeys = {
	publicKey:
		"BE4Ctd0DNCfkL7GeEGj2aWcuqEgC0nm5700EXr6SEatIAOlXUaNLDjXlubOsiXOKmQjamGCSeqeAb6ZRdrpUcC4",
	privateKey: "ano-u77BBWmdSOZe21t5CyLz1k6_xa8WQYnFGOiYGf0",
};

webPush.setVapidDetails(
	"mailto: dwi.hanafi@gmail.com",
	vapidKeys.publicKey,
	vapidKeys.privateKey
);

const pushSubscription = {
	endpoint:
		"https://fcm.googleapis.com/fcm/send/c7_1UF0WYMs:APA91bHy1FLpcZIc1gFFKhNnTWYr5Axg0THvQfAozgfAVDl3a7qX_oF2lMNY7hgRzrpBPPmowNxAY0iP-WiHGdPnkY2xwaH-jwFvSCH7D4cEvPxfOJ6pFyG2_5Mu46UXzGnD-BCCtKbo",
	keys: {
		p256dh:
			"BIsSYX4sYzJfhY8d4pGs4fwedye+SatHKv76yDEa6wIpAR9D1uIpQCeq8jDte31RwrxSGVdBgYyPoPRvZdUzWJA=",
		auth: "V7NUU27ionXEFdra65dNIA==",
	},
};

const payload = "Matchday 9 Premier League telah dimulai";
const options = {
	gcmAPIKey: "1010775927356",
	TTL: 60,
};

webPush.sendNotification(pushSubscription, payload, options);
console.log("OK, Notification sent!");
