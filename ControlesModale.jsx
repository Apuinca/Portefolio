import { initModale } from "./modales";

//  Création des icones de suppression des projets
export function creerBoutonEffacer(baliseParent) {
	const conteneurImgEffacer = document.createElement("p");
	const imgEffacer = document.createElement("img");

	imgEffacer.setAttribute("src", "./assets/icons/trash-can-solid.png");
	imgEffacer.setAttribute("alt", "Effacer");
	imgEffacer.classList.add("imgIconeEffacer");

	conteneurImgEffacer.appendChild(imgEffacer);
	conteneurImgEffacer.classList.add("iconeEffacer");

	baliseParent.appendChild(conteneurImgEffacer);

	baliseParent.addEventListener("click", (e) => {
		e.preventDefault();
		const idProjetAEffacer = e.currentTarget.childNodes[0].classList[0];
		try {
			fetch(`http://localhost:5678/api/works/${idProjetAEffacer}`, {
				method: "DELETE",
				headers: {
					"Authorization": "Bearer " + localStorage.getItem("token"),
				},
				body: idProjetAEffacer,
			});
		}
		catch (error) {
			const msgAlerte = document.createElement("p");

			msgAlerte.setAttribute("style", "color: red; font-weight: 700;");
			msgAlerte.innerText = "Échec de la suppression du projet " + idProjetAEffacer;

			zoneContenu.appendChild(msgAlerte);
		}		
	});
}

export async function retourPage(etape) {
	zoneContenu.innerHTML = "";

	if (etape === "ajoutPhoto") {
		boutonModif.removeAttribute("disabled");
		boutonModif.value = "Ajouter une photo";
		retour.classList.add("invisibilite");
		titre.innerText = "Galerie photo";

		await initModale();
	}
	else if (etape === "ajoutPhotoValide") {
		modaleAjout();
	}
}

export function fermerModale() {
	const fermerFenetreModale = document.querySelector("#fermeture");
	const fenetreModale = document.querySelector(".fenetreModale");

	fermerFenetreModale.addEventListener("click", (e) => {
		e.preventDefault();
		fenetreModale.close();
	});
}