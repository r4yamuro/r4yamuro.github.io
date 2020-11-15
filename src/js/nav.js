document.addEventListener("DOMContentLoaded", function () {
	// Activate sidebar nav
	const elems = document.querySelectorAll(".sidenav");
	M.Sidenav.init(elems);
	loadNav();

	function loadNav() {
		const xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function () {
			if (this.readyState == 4) {
				if (this.status != 200) return;

				// Muat daftar tautan menu
				document.querySelectorAll(".topnav, .sidenav").forEach(function (elm) {
					elm.innerHTML = xhttp.responseText;
				});

				// Daftarkan event listener untuk setiap tautan menu
				document
					.querySelectorAll(".sidenav a, .topnav a")
					.forEach(function (elm) {
						elm.addEventListener("click", function (event) {
							// Tutup sidenav
							const sidenav = document.querySelector(".sidenav");
							if (sidenav !== null) {
								M.Sidenav.getInstance(sidenav).close();
							}

							// Muat konten halaman yang dipanggil
							page = event.target.getAttribute("href").substr(1);
							// console.log(page);
							loadPage(page);
						});
					});
			}
		};
		xhttp.open("GET", "nav.html", true);
		xhttp.send();
	}
});

// Load page content
let page = window.location.hash.substr(1);
const pathname = window.location.pathname.substr(1);
if (page == "" && pathname == "") {
	page = "home";
	loadPage(page);
}

function loadPage(page) {
	const xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4) {
			const content = document.querySelector("#body-content");

			if (page === "home") {
				getAllKlasemen();
			} else if (page === "fav") {
				getSavedTeams();
			}

			if (this.status == 200) {
				content.innerHTML = xhttp.responseText;
			} else if (this.status == 404) {
				content.innerHTML = `<p class="container flow-text">Halaman tidak ditemukan.</p>`;
			} else {
				content.innerHTML = `<p class="container flow-text">Ups.. halaman tidak dapat diakses.</p>`;
			}
		}
	};
	xhttp.open("GET", "src/pages/" + page + ".html", true);
	xhttp.send();
}
