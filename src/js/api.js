let base_url = `https://api.football-data.org/v2/`;

// Blok kode yang akan dipanggil jika fetch berhasil
function status(response) {
	if (response.status !== 200) {
		M.toast({
			html: `Error: ${response.status}`,
			classes: "rounded pink  darken-1",
		});

		// Method reject() akan membuat blok catch terpanggil
		return Promise.reject(new Error(response.statusText));
	} else {
		// Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
		return Promise.resolve(response);
	}
}

// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
	return response.json();
}

// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
	// Parameter error berasal dari Promise.reject()
	M.toast({
		html: `Error: ${error}`,
		classes: "rounded pink  darken-1",
	});
}

const token = "2f24ea41fb704b1aa0fd03ec9b13b68e";
const fetchApi = function (url) {
	return fetch(url, {
		headers: {
			"X-Auth-Token": token,
		},
	});
};

// Blok kode untuk melakukan request data json
function getKlasemen(idLiga, elem) {
	if (`caches` in window) {
		caches
			.match(`${base_url}competitions/${idLiga}/standings`)
			.then(function (response) {
				if (response) {
					response.json().then(function (data) {
						// console.log(data);
						let klasemenHTML = "";
						let labelStatus = "";
						let status = "";
						if (data.season.winner === null) {
							labelStatus = "Status";
							status = "Sedang Berlangsung";
						} else {
							labelStatus = "Pemenang";
							status = data.season.winner;
						}

						// Judul Tabel
						klasemenHTML += `
							<h4 class="header">${data.competition.area.name} ${data.competition.name}</h4>
							<div class="card rounded">
								<table class="highlight">
									<tr>
										<td>Waktu Kompetisi </td><td>: ${data.season.startDate} sampai ${data.season.endDate}</td>
									</tr>
									<tr>
										<td>Matchday</td><td>: ${data.season.currentMatchday}</td>
									</tr>
									<tr>
										<td>${labelStatus}</td><td>: ${status}</td>
									</tr>
								</table>
			
								<table class="striped centered">
									<thead>
										<tr>
											<th>Pos</th>
											<th>Tim</th>
											<th><span class="hide-on-small-only">Main</span><span class="hide-on-med-and-up">Mn</span></th>
											<th class="hide-on-small-and-down"><span class="hide-on-small-only">Menang</span><span class="hide-on-med-and-up">Mg</span></th>
											<th class="hide-on-small-and-down"><span class="hide-on-small-only">Seri</span><span class="hide-on-med-and-up">S</span></th>
											<th class="hide-on-small-and-down"><span class="hide-on-small-only">Kalah</span><span class="hide-on-med-and-up">K</span></th>
											<th class="hide-on-small-and-down"><span class="hide-on-med-and-down">Memasukkan Gol</span><span class="hide-on-large-only">MG</span></th>
											<th class="hide-on-small-and-down"><span class="hide-on-med-and-down">Kemasukan Gol</span><span class="hide-on-large-only">KG</span></th>
											<th><span class="hide-on-small-only">Selisih Gol</span><span class="hide-on-med-and-up">SG</span></th>
											<th class="cyan darken-3"><span class="hide-on-small-only white-text">Poin</span><span class="hide-on-med-and-up white-text">P</span></th>
										</tr>
									</thead>
									<tbody>
										
						`;

						// Row Tabel
						data.standings[0].table.forEach((el, index) => {
							klasemenHTML += `
							<tr>
							<td>${el.position}</td>
							<td><a href="./teams.html?id=${el.team.id}" class="center-item left-text blue-text text-darken-4"><img src="${el.team.crestUrl}" class="crest" loading="lazy" alt="${el.team.tla}"/><b>${el.team.name}</b></a></td>
							<td>${el.playedGames}</td>
							<td class="hide-on-small-and-down">${el.won}</td>
							<td class="hide-on-small-and-down">${el.draw}</td>
							<td class="hide-on-small-and-down">${el.lost}</td>
							<td class="hide-on-small-and-down">${el.goalsFor}</td>
							<td class="hide-on-small-and-down">${el.goalsAgainst}</td>
							<td>${el.goalDifference}</td>
							<td class="cyan darken-3 white-text">${el.points}</td>
							</tr>
							`;
							if (index === 4) {
								klasemenHTML += `
								<td class="center-text button-row" colspan="9">
									<button class="waves-effect waves-light btn light-blue darken-3" id="more${elem}"><b>
										<div id="switchmore${elem}"><i class="material-icons left">expand_more</i>more</div>
										<div id="switchless${elem}" class="hide"><i class="material-icons left">expand_less</i>less</div></b>
									</button>
								</td>
								<td class="cyan darken-3 hide-on-small-only"></td>
								</tr>
								</tbody>
								<tbody id="collapse${elem}" class="hide striped centered">
								`;
							}
						});

						// Closing Tag
						klasemenHTML += `
							</tbody>							
							<tbody>
								<tr>
									<td colspan="9" class="hide-on-small-and-down">Update Terakhir: ${data.competition.lastUpdated}</td>
									<td colspan="4" class="hide-on-med-and-up">Update Terakhir: ${data.competition.lastUpdated}</td>
									<td class="cyan darken-3"></td>
								</tr>
							</tbody>
							</table>
							</div>
							</div>
						`;

						// Sisipkan komponen tabel ke dalam elemen dengan id #content
						document.getElementById(`klasemen${elem}`).innerHTML = klasemenHTML;
						const btnMore = document.getElementById(`more${elem}`);
						btnMore.addEventListener("click", () => {
							const collapseTable = document.getElementById(`collapse${elem}`);
							const switch1 = document.getElementById(`switchless${elem}`);
							const switch2 = document.getElementById(`switchmore${elem}`);
							collapseTable.classList.toggle("hide");
							switch1.classList.toggle("hide");
							switch2.classList.toggle("hide");
						});
					});
				}
			});
	}

	fetchApi(`${base_url}competitions/${idLiga}/standings`)
		.then(status)
		.then(json)
		.then(function (data) {
			// Objek/array JavaScript dari response.json() masuk lewat data.
			// console.log(data);
			// Mem-parsing data ke dalam tabel klasemen
			let klasemenHTML = "";
			let labelStatus = "";
			let status = "";
			if (data.season.winner === null) {
				labelStatus = "Status";
				status = "Sedang Berlangsung";
			} else {
				labelStatus = "Pemenang";
				status = data.season.winner;
			}

			klasemenHTML += `
				<h4 class="header">${data.competition.area.name} ${data.competition.name}</h4>
				<div class="card rounded">
					<table class="highlight">
						<tr>
							<td>Waktu Kompetisi </td><td>: ${data.season.startDate} sampai ${data.season.endDate}</td>
						</tr>
						<tr>
							<td>Matchday</td><td>: ${data.season.currentMatchday}</td>
						</tr>
						<tr>
							<td>${labelStatus}</td><td>: ${status}</td>
						</tr>
					</table>

					<table class="striped centered">
						<thead>
							<tr>
								<th>Pos</th>
								<th>Tim</th>
								<th><span class="hide-on-small-only">Main</span><span class="hide-on-med-and-up">Mn</span></th>
								<th class="hide-on-small-and-down"><span class="hide-on-small-only">Menang</span><span class="hide-on-med-and-up">Mg</span></th>
								<th class="hide-on-small-and-down"><span class="hide-on-small-only">Seri</span><span class="hide-on-med-and-up">S</span></th>
								<th class="hide-on-small-and-down"><span class="hide-on-small-only">Kalah</span><span class="hide-on-med-and-up">K</span></th>
								<th class="hide-on-small-and-down"><span class="hide-on-med-and-down">Memasukkan Gol</span><span class="hide-on-large-only">MG</span></th>
								<th class="hide-on-small-and-down"><span class="hide-on-med-and-down">Kemasukan Gol</span><span class="hide-on-large-only">KG</span></th>
								<th><span class="hide-on-small-only">Selisih Gol</span><span class="hide-on-med-and-up">SG</span></th>
								<th class="cyan darken-3"><span class="hide-on-small-only white-text">Poin</span><span class="hide-on-med-and-up white-text">P</span></th>
							</tr>
						</thead>
						<tbody>
							
			`;

			data.standings[0].table.forEach((el, index) => {
				klasemenHTML += `
				<tr>
				<td>${el.position}</td>
				<td><a href="./teams.html?id=${el.team.id}" class="center-item left-text blue-text text-darken-4"><img src="${el.team.crestUrl}" class="crest" loading="lazy"alt="${el.team.tla}"/><b>${el.team.name}</b></a></td>
				<td>${el.playedGames}</td>
				<td class="hide-on-small-and-down">${el.won}</td>
				<td class="hide-on-small-and-down">${el.draw}</td>
				<td class="hide-on-small-and-down">${el.lost}</td>
				<td class="hide-on-small-and-down">${el.goalsFor}</td>
				<td class="hide-on-small-and-down">${el.goalsAgainst}</td>
				<td>${el.goalDifference}</td>
				<td class="cyan darken-3 white-text">${el.points}</td>
				</tr>
				`;
				if (index === 4) {
					klasemenHTML += `
					<td class="center-text button-row" colspan="9">
						<button class="waves-effect waves-light btn light-blue darken-3" id="more${elem}"><b>
							<div id="switchmore${elem}"><i class="material-icons left">expand_more</i>more</div>
							<div id="switchless${elem}" class="hide"><i class="material-icons left">expand_less</i>less</div></b>
						</button>
					</td>
					<td class="cyan darken-3 hide-on-small-only"></td>
					</tr>
					</tbody>
					<tbody id="collapse${elem}" class="hide striped centered">
					`;
				}
			});
			klasemenHTML += `
			</tbody>							
			<tbody>
				<tr>
				<td colspan="9" class="hide-on-small-and-down">Update Terakhir: ${data.competition.lastUpdated}</td>
				<td colspan="4" class="hide-on-med-and-up">Update Terakhir: ${data.competition.lastUpdated}</td>
				<td class="cyan darken-3"></td>
				</tr>
			</tbody>
			</table>
			</div>
			</div>
			`;

			// Sisipkan komponen card ke dalam elemen dengan id #content
			document.getElementById(`klasemen${elem}`).innerHTML = klasemenHTML;
			const btnMore = document.getElementById(`more${elem}`);
			btnMore.addEventListener("click", () => {
				const collapseTable = document.getElementById(`collapse${elem}`);
				const switch1 = document.getElementById(`switchless${elem}`);
				const switch2 = document.getElementById(`switchmore${elem}`);
				collapseTable.classList.toggle("hide");
				switch1.classList.toggle("hide");
				switch2.classList.toggle("hide");
			});
		})
		.catch(error);
}

function getAllKlasemen() {
	getKlasemen(2021, 1);
	getKlasemen(2014, 2);
	getKlasemen(2019, 3);
}

function elementReady(selector) {
	return new Promise((resolve, reject) => {
		let el = document.querySelector(selector);
		if (el) {
			resolve(el);
		}
		new MutationObserver((mutationRecords, observer) => {
			// Query for elements matching the specified selector
			Array.from(document.querySelectorAll(selector)).forEach((element) => {
				resolve(element);
				//Once we have resolved we don't need the observer anymore.
				observer.disconnect();
			});
		}).observe(document.documentElement, {
			childList: true,
			subtree: true,
		});
	});
}

function getTeamById() {
	return new Promise(function (resolve, reject) {
		// Ambil nilai query parameter (?id=)
		let urlParams = new URLSearchParams(window.location.search);
		let idParam = urlParams.get("id");

		if (`caches` in window) {
			caches
				.match(`${base_url}teams/${idParam}`)
				.then(function (response) {
					if (response) {
						response.json().then(function (data) {
							// Mengecek apakah klub sudah tersimpan
							let saved = false;
							getById(parseInt(idParam)).then((team) => {
								try {
									if (typeof team.id !== "undefined") saved = true;
								} catch {
									saved = false;
								}

								// Menyusun komponen card secara dinamis
								let renderPlayer = "";
								let renderCoach = "";
								let renderKompetisi = "";
								data.squad.forEach(function (player) {
									if (player.role === "PLAYER") {
										renderPlayer += `
									<li><span class="blue-text">${player.name}</span>, ${player.position} (${player.nationality})</li>
									`;
									} else {
										renderCoach += `
									<li><span class="blue-text">${player.name}</span>, ${player.role.replace(
											/_/gi,
											" "
										)} (${player.nationality})</li>
									`;
									}
								});
								data.activeCompetitions.forEach(function (kompetisi, index) {
									renderKompetisi += `<tr><td>${index + 1}. </td><td>${
										kompetisi.name
									} (${kompetisi.area.name})<td></tr>`;
								});

								let teamHTML = `
							<h4 class="header container">${data.name}</h4>
							<div class="row container">
								<div class="card horizontal col s12 m10 offset-m1">
									<div class="card-image">
										<img src="${data.crestUrl}" class="center-item" />
									</div>
									<div class="card-stacked">
										<div class="card-content">
											<p class="justify-text">
												${data.name} atau ${data.shortName} adalah klub sepakbola dari ${data.area.name}
												yang didirikan pada tahun ${data.founded}. Warna jersey mereka adalah
												${data.clubColors}
											</p>
											<table class="highlight">
												<thead>
													<tr>
														<th class="center-text" colspan="2">DATA KLUB</th>
													</tr>
												</thead>
												<tbody>
													<tr>
														<td>Stadion</td><td>: ${data.venue}</td>
													</tr>
													<tr>
														<td>Alamat</td><td>: ${data.address}</td>
													</tr>
													<tr>
														<td>Telepon</td><td>: ${data.phone}</td>
													</tr>
													<tr>
														<td>Email</td><td>: ${data.email}</td>
													</tr>
													<tr>
														<td>Website</td>
														<td>: <a href="${
															data.website
														}" target="_blank" class="blue-text text-darken-1"><b>${
									data.website
								}</b></a</td>
													</tr>
												</tbody>
											</table>
										</div>
										<a class="btn-floating btn-large halfway-fab waves-effect waves-light light-blue darken-3 ${
											saved ? "hide" : ""
										}" id="add"><i class="material-icons">add</i></a>
									</div>
								</div>
								<div class="card horizontal col s12">
									<div class="card-stacked">
										<div class="card-content">
											<table class="highlight col s12 m6">
												<tr><th colspan="2">KOMPETISI AKTIF</th></tr>
												<tbody>${renderKompetisi}</tbody>
											</table>
										</div>
									</div>
								</div>
								<div class="card-tabs">
									<ul class="tabs tabs-fixed-width" id="tab1">
										<li class="tab"><a class="active" href="#coach"><b>PELATIH</b></a></li>
										<li class="tab"><a href="#player"><b>PEMAIN</b></a></li>
									</ul>
								</div>
								<div class="card-content grey lighten-4">
									<div id="coach">
										<ol>
											${renderCoach}
										</ol>
									</div>
									<div id="player">
										<ol class="two-column">
											${renderPlayer}
										</ol>
									</div>
								</div>
							<div>		
							`;
								elementReady(`.tabs`).then(function (el) {
									let instance = M.Tabs.init(el, {});
								});

								// Sisipkan komponen card ke dalam elemen dengan id #content
								document.getElementById("body-content").innerHTML = teamHTML;
								const btnAdd = document.getElementById("add");
								btnAdd.addEventListener("click", () => {
									saveForLater(data);
									M.toast({
										html: `Klub ${data.name} telah ditambahkan ke daftar favorit.`,
										classes: "rounded light-blue darken-3",
									});
								});
							});
						});
					}
				})
				.catch(error);
		}

		fetchApi(`${base_url}teams/${idParam}`)
			.then(status)
			.then(json)
			.then(function (data) {
				// Objek Javascript dari response.json() masuk lewat variabel data.

				// Mengecek apakah klub sudah tersimpan
				let saved = false;
				getById(parseInt(idParam)).then((team) => {
					try {
						if (typeof team.id !== "undefined") saved = true;
					} catch {
						saved = false;
					}

					// Menyusun komponen card secara dinamis
					let renderPlayer = "";
					let renderCoach = "";
					let renderKompetisi = "";
					data.squad.forEach(function (player) {
						if (player.role === "PLAYER") {
							renderPlayer += `
							<li><span class="blue-text">${player.name}</span> (${player.position})</li>
							`;
						} else {
							renderCoach += `
							<li><span class="blue-text">${player.name}</span> (${player.role.replace(
								/_/gi,
								" "
							)})</li>
							`;
						}
					});
					data.activeCompetitions.forEach(function (kompetisi, index) {
						renderKompetisi += `<tr><td>${index + 1}. </td><td>${
							kompetisi.name
						} (${kompetisi.area.name})<td></tr>`;
					});

					let teamHTML = `
					<h4 class="header container">${data.name}</h4>
					<div class="row container">
						<div class="card horizontal col s12 m10 offset-m1">
							<div class="card-image">
								<img src="${data.crestUrl}" class="center-item" />
							</div>
							<div class="card-stacked">
								<div class="card-content">
									<p class="justify-text">
										${data.name} atau ${data.shortName} adalah klub sepakbola dari ${data.area.name}
										yang didirikan pada tahun ${data.founded}. Warna jersey mereka adalah
										${data.clubColors}
									</p>
									<table class="highlight">
										<thead>
											<tr>
												<th class="center-text" colspan="2">DATA KLUB</th>
											</tr>
										</thead>
										<tbody>
											<tr>
												<td>Stadion</td><td>: ${data.venue}</td>
											</tr>
											<tr>
												<td>Alamat</td><td>: ${data.address}</td>
											</tr>
											<tr>
												<td>Telepon</td><td>: ${data.phone}</td>
											</tr>
											<tr>
												<td>Email</td><td>: ${data.email}</td>
											</tr>
											<tr>
												<td>Website</td>
												<td>: <a href="${
													data.website
												}" target="_blank" class="blue-text text-darken-1"><b>${
						data.website
					}</b></a</td>
											</tr>
										</tbody>
									</table>
								</div>
								<a class="btn-floating btn-large halfway-fab waves-effect waves-light light-blue darken-3 ${
									saved ? "hide" : ""
								}" id="add"><i class="material-icons">add</i></a>
							</div>
						</div>
						<div class="card horizontal col s12">
							<div class="card-stacked">
								<div class="card-content">
									<table class="highlight col s12 m6">
										<tr><th colspan="2">KOMPETISI AKTIF</th></tr>
										<tbody>${renderKompetisi}</tbody>
									</table>
								</div>
							</div>
						</div>
						<div class="card-tabs">
							<ul class="tabs tabs-fixed-width" id="tab1">
								<li class="tab"><a class="active" href="#coach"><b>PELATIH</b></a></li>
								<li class="tab"><a href="#player"><b>PEMAIN</b></a></li>
							</ul>
						</div>
						<div class="card-content grey lighten-4">
							<div id="coach">
								<ol>
									${renderCoach}
								</ol>
							</div>
							<div id="player">
								<ol class="two-column">
									${renderPlayer}
								</ol>
							</div>
						</div>
					<div>				
					`;
					elementReady(`#tab1`).then(function (el) {
						const instance = M.Tabs.init(el, {});
					});
					// Sisipkan komponen card ke dalam elemen dengan id #content
					document.getElementById("body-content").innerHTML = teamHTML;
					const btnAdd = document.getElementById("add");
					btnAdd.addEventListener("click", () => {
						saveForLater(data);
						M.toast({
							html: `Klub ${data.name} telah ditambahkan ke daftar favorit.`,
							classes: "rounded light-blue darken-3",
						});
					});
				});
			})
			.catch(error);
	});
}

function getSavedTeams() {
	getAll().then(function (teams) {
		// Menyusun komponen klub yang telah tersimpan secara dinamis
		let teamsHTML = "";
		if (teams.length === 0) {
			teamsHTML += `<p class="flow-text">Anda belum menambahkan Klub apapun ke dalam daftar favorit</p>`;
		}

		teams.forEach(function (team, index) {
			// console.log(team);

			// Render Squad
			let renderPlayer = "";
			let renderCoach = "";
			let renderKompetisi = "";
			team.squad.forEach(function (player) {
				if (player.role === "PLAYER") {
					renderPlayer += `
							<li><span class="blue-text">${player.name}</span>, ${player.position} (${player.nationality})</li>
						`;
				} else {
					renderCoach += `
							<li><span class="blue-text">${player.name}</span>, ${player.role.replace(
						/_/gi,
						" "
					)} (${player.nationality})</li>
						`;
				}
			});

			// Render Kompetisi aktif
			team.activeCompetitions.forEach(function (kompetisi, index) {
				renderKompetisi += `<tr><td>${index + 1}. </td><td>${kompetisi.name} (${
					kompetisi.area.name
				})<td></tr>`;
			});

			// Render Card
			teamsHTML += `
					<h4 class="header">${team.name}</h4>
					<div class="row">
					<div class="card horizontal col s12 m10 offset-m1">
						<div class="card-image">
							<img src="${team.crestUrl}" class="center-item" />
						</div>
						<div class="card-stacked">
							<div class="card-content">
								<p class="justify-text">
									${team.name} atau ${team.shortName} adalah klub sepakbola dari ${team.area.name}
									yang didirikan pada tahun ${team.founded}. Warna jersey mereka adalah
									${team.clubColors}
								</p>
								<table class="highlight">
									<thead>
										<tr>
											<th class="center-text" colspan="2">DATA KLUB</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>Stadion</td><td>: ${team.venue}</td>
										</tr>
										<tr>
											<td>Alamat</td><td>: ${team.address}</td>
										</tr>
										<tr>
											<td>Telepon</td><td>: ${team.phone}</td>
										</tr>
										<tr>
											<td>Email</td><td>: ${team.email}</td>
										</tr>
										<tr>
											<td>Website</td>
											<td>: <a href="${team.website}" target="_blank" class="blue-text text-darken-1"><b>${team.website}</b></a</td>
										</tr>
									</tbody>
								</table>
							</div>
							<a class="btn-floating btn-large halfway-fab waves-effect waves-light modal-trigger pink darken-1" href="#modal${index}">
								<i class="material-icons">delete_forever</i>
							</a>
							
						</div>
					</div>
					<div class="card horizontal col s12">
						<div class="card-stacked">
							<div class="card-content">
								<table class="highlight col s12 m6">
									<tr><th colspan="2">KOMPETISI AKTIF</th></tr>
									<tbody>${renderKompetisi}</tbody>
								</table>
							</div>
						</div>
					</div>
					<div class="card-tabs">
						<ul class="tabs tabs-fixed-width" id="tab${index}">
							<li class="tab"><a class="active" href="#coach${index}"><b>PELATIH</b></a></li>
							<li class="tab"><a href="#player${index}"><b>PEMAIN</b></a></li>
						</ul>
					</div>
					<div class="card-content grey lighten-4">
						<div id="coach${index}">
							<ol>
								${renderCoach}
							</ol>
						</div>
						<div id="player${index}">
							<ol class="two-column">
								${renderPlayer}
							</ol>
						</div>
					</div>
					<hr>
					<div id="modal${index}" class="modal waves-effect waves-light modal${index}">
					<div class="modal-content">
						<p>Apakah anda ingin menghapus klub ${team.name} dari daftar favorit?</p>
					</div>
					<div class="modal-footer grey lighten-2">
						<a href="#!" class="modal-action modal-close waves-effect waves-light btn blue darken-3">Tidak</a>
						<a href="#!" class="modal-action modal-close waves-effect waves-light btn blue darken-3" id="delete${index}">Ya</a>
					</div>
				</div>

				`;

			// Inisialisasi tab Squad
			elementReady(`#tab${index}`).then((el) => {
				const instance = M.Tabs.init(el, {});
			});

			// Inisialisasi Modal
			elementReady(`.modal${index}`).then(() => {
				const elems = document.querySelectorAll(`.modal${index}`);
				const instances = M.Modal.init(elems, {});
			});
		});

		// Sisipkan komponen card ke dalam elemen dengan id #body-content
		document.getElementById("favorit").innerHTML = teamsHTML;

		// Event untuk fungsi hapus dari database
		teams.forEach(function (team, index) {
			const btnRemove = document.getElementById(`delete${index}`);
			btnRemove.addEventListener("click", () => {
				deleteById(team.id);
				loadPage("fav");
				M.toast({
					html: `Klub ${team.name} telah dihapus dari daftar favorit.`,
					classes: "rounded pink darken-1",
				});
			});
		});
	});
}
