const boutonModif = document.querySelector(".piedModale input");
const fenetreModale = document.querySelector(".fenetreModale");
const zoneContenu = document.querySelector(".contenuFenetre");


export function initModale(affichageVignettes) {
    zoneContenu.innerHTML = "";
    zoneContenu.innerHTML = affichageVignettes;

    const figures = document.querySelectorAll(".contenuFenetre figure");

    for (const figure of figures) {        
        figure.childNodes[0].classList.add("miniatures");
        figure.removeChild(figure.childNodes[1]);
        creerBoutonEffacer(figure);
    }

    boutonModif.addEventListener("click", (e) => {
        if (e.target.value === "Ajouter une photo") {
            modaleAjout();
        }
        else {

        };
    });

    fermerModale();

    fenetreModale.showModal();
}

function fermerModale() {
    const fermerFenetreModale = document.querySelector("#fermeture");

    fermerFenetreModale.addEventListener("click", () => {
        fenetreModale.close();
    });
}

function creerBoutonEffacer(baliseParent) {
    const conteneurImgEffacer = document.createElement("p");
    const imgEffacer = document.createElement("img");

    imgEffacer.setAttribute("src", "./assets/icons/trash-can-solid.png");
    imgEffacer.setAttribute("alt", "Effacer");
    imgEffacer.classList.add("imgIconeEffacer");
    
    conteneurImgEffacer.appendChild(imgEffacer);
    conteneurImgEffacer.classList.add("iconeEffacer");
    //conteneurImgEffacer.setAttribute("id", idx);

    baliseParent.appendChild(conteneurImgEffacer);

    baliseParent.addEventListener("click", (e) => {
        try {
            const src = fetch('http://localhost:5678/api/works', {
                method: "DELETE",
                body: e.currentTarget.childNodes[0].classList[0],
            });
        }
        catch {
            const msgAlerte = document.createElement("p");

            msgAlerte.setAttribute("style", "color: red; font-weight: 700;");
            msgAlerte.innerText = "La connexion à échouer\r\nVous devez ne pas avoir le droit de vous connecter<br />";

            zoneContenu.appendChild(msgAlerte);
        }
    });
}

function modaleAjout() {
    zoneContenu.innerHTML = "";
}