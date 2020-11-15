const dbPromised = idb.open("finco", 1, (upgradeDB) => {
	const teamsObjectStore = upgradeDB.createObjectStore("teams", {
		keyPath: "id",
	});
	teamsObjectStore.createIndex("name", "name", { unique: false });
});

function saveForLater(team) {
	dbPromised
		.then((db) => {
			const tx = db.transaction("teams", "readwrite");
			const store = tx.objectStore("teams");
			// console.log(team);
			store.put(team);
			return tx.complete;
		})
		.then(() => {
			console.log("Data berhasil disimpan.");
		});
}

function getAll() {
	return new Promise((resolve, reject) => {
		dbPromised
			.then((db) => {
				const tx = db.transaction("teams", "readonly");
				const store = tx.objectStore("teams");
				return store.getAll();
			})
			.then((teams) => {
				resolve(teams);
			});
	});
}

function getById(id) {
	return new Promise((resolve, reject) => {
		dbPromised
			.then((db) => {
				const tx = db.transaction("teams", "readonly");
				const store = tx.objectStore("teams");
				return store.get(id);
			})
			.then((team) => {
				resolve(team);
			});
	});
}

function deleteById(id) {
	return new Promise(function (resolve, reject) {
		dbPromised
			.then(function (db) {
				const tx = db.transaction("teams", "readwrite");
				const store = tx.objectStore("teams");
				store.delete(id);
				return tx.complete;
			})
			.then(function () {
				console.log("Item deleted");
			});
	});
}

function checkKey(id) {
	return new Promise(function (resolve, reject) {
		dbPromised.then(function (db) {
			const tx = db.transaction("teams", "readonly");
			const store = tx.objectStore("teams");
			return store.count(id);
		});
	});
}
