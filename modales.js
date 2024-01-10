const fenetreModale = document.querySelector(".fenetreModale");
const titre = document.querySelector(".fenetreModale h1");
const zoneContenu = document.querySelector(".contenuFenetre");
const boutonModif = document.querySelector(".piedModale input");
const retour = document.querySelector("#retour");

export function initModale(affichageVignettes) {
    zoneContenu.innerHTML = "";
    zoneContenu.innerHTML = affichageVignettes;

    const figures = document.querySelectorAll(".contenuFenetre figure");

    for (const figure of figures) {
        figure.childNodes[0].classList.add("miniatures");
        figure.removeChild(figure.childNodes[1]);
        creerBoutonEffacer(figure);
    }

    boutonAction();

    fermerModale();

    fenetreModale.showModal();
}

function boutonAction() {
    boutonModif.addEventListener("click", (e) => {
        console.log("On est dans boutonModif.addEventListener\r\n" + e.target.value);
        /*if (e.target.value === "Ajouter une photo") {*/
        modaleAjout();
        //}
        //else {

        //};
    });
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

    baliseParent.appendChild(conteneurImgEffacer);

    baliseParent.addEventListener("click", (e) => {
        try {
            fetch('http://localhost:5678/api/works', {
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

async function modaleAjout() {
    titre.innerText = "Ajout photo";
    retour.classList.remove("invisibilite");
    boutonModif.setAttribute("value", "Valider");
    boutonModif.setAttribute("disabled", "true");

    zoneContenu.innerHTML = `<form id="formAjoutProj">
                                <div id="chargerImage">
                                    <img src="./assets/icons/iconePhoto.png" alt="iconeImage" />
                                    <label for="imageNouvProj" id="btnNouvProj">
                                        + Ajouter photo
                                        <br />
                                        <input id="imageNouvProj" type="file" accept=".jpg;.png" required/>                            
                                    </label>                        
                                    <p>jpg, png : 4mo max</p>
                                    <div class="imageSelectionnee">
                                    </div>
                                </div >
                                <div id="textesAjout">
                                    <label for="titre" class="labelTexteAjout">Titre</label>
                                    <input type="text" required/>
                                    <label for="choisirCategorie" class="labelTexteAjout">Cat&eacute;gorie</label>
                                    <select name="choisirCategorie" class="choixCategorie" required>
                                        <option value="0"></option>
                                    </select>
                                </div>
                            </form >`;

    try {
        const recupCategories = await fetch('http://localhost:5678/api/categories', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })

        const listeCategories = await recupCategories.json();
        const listeOptions = document.querySelector(".choixCategorie");

        for (const categorie of listeCategories) {            
            const valCategorie = document.createElement("option");
            valCategorie.setAttribute("value", categorie.id);
            valCategorie.innerText = categorie.name;

            listeOptions.appendChild(valCategorie);
        }        
    }
    catch {
        console.log("Oups! Liste des catégories pas récupérée");
    }

    const choixPhoto = document.getElementById("imageNouvProj");
    const photoChoisie = document.querySelector(".imageSelectionnee");

    choixPhoto.addEventListener("change", (e) => {
        const zoneImage = document.querySelector("#chargerImage");
        const toto = document.querySelector("input[type=file]").files[0];

        console.log(toto);

        //photoChoisie.innerHTML = `<img src="${toto.value}" alt="${toto.name}" class="photoSelectionnee" />`;
        console.log("choixPhoto.addEventListener\r\nchoixPhoto : " + e.target.result);

        zoneImage.innerHTML = "";
        zoneImage.appendChild(photoChoisie);
        
    });
   
    retour.addEventListener("click", () => {
        retourPage("ajoutPhoto");
    });
}

function retourPage(etape) {
    zoneContenu.innerHTML = "";

    if (etape === "ajoutPhoto") {
        boutonModif.removeAttribute("disabled");
        boutonModif.value = "Ajouter une photo";
        retour.classList.add("invisibilite");
        titre.innerText = "Galerie photo";

        initModale(localStorage.getItem("galerie"));
    }
    else if (etape === "ajoutPhotoValide") {
        modaleAjout();
    }
}