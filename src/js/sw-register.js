// REGISTER SERVICE WORKER
if ("serviceWorker" in navigator) {
	registerServiceWorker();
} else {
	console.log("ServiceWorker belum didukung browser ini.");
}

// Function Register ServiceWorker
function registerServiceWorker() {
	return navigator.serviceWorker
		.register("../../sw.js")
		.then((registration) => {
			console.log("Registrasi ServiceWorker berhasil.");
		})
		.then(() => {
			requestpermission();
		})
		.catch((err) => {
			console.log("Registrasi ServiceWorker gagal:", err);
		});
}

// Function Request Permission Notifikasi
function requestpermission() {
	if ("Notification" in window) {
		Notification.requestPermission().then(function (result) {
			if (result === "denied") {
				console.log("Fitur notifikasi tidak diijinkan.");
				return;
			} else if (result === "default") {
				console.log(
					"Pengguna menutup kotak dialog permintaan ijin notifikasi."
				);
				return;
			}

			if ("PushManager" in window) {
				navigator.serviceWorker.getRegistration().then((registration) => {
					registration.pushManager
						.subscribe({
							userVisibleOnly: true,
							applicationServerKey: urlBase64ToUint8Array(
								"BE4Ctd0DNCfkL7GeEGj2aWcuqEgC0nm5700EXr6SEatIAOlXUaNLDjXlubOsiXOKmQjamGCSeqeAb6ZRdrpUcC4"
							),
						})
						.then((subscribe) => {
							console.log(
								"Berhasil melakukan subscribe dengan endpoint: ",
								subscribe.endpoint
							);
							console.log(
								"Berhasil melakukan subscribe dengan p256dh key: ",
								btoa(
									String.fromCharCode.apply(
										null,
										new Uint8Array(subscribe.getKey("p256dh"))
									)
								)
							);
							console.log(
								"Berhasil melakukan subscribe dengan auth key: ",
								btoa(
									String.fromCharCode.apply(
										null,
										new Uint8Array(subscribe.getKey("auth"))
									)
								)
							);
						})
						.catch((e) => {
							console.error("Tidak dapat melakukan subscribe ", e.message);
						});
				});
			}
		});
	}
}

// Encode Uint8Array
function urlBase64ToUint8Array(base64String) {
	const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);
	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}
