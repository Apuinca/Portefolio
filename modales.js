const fenetreModale = document.querySelector(".fenetreModale");
const titre = document.querySelector(".fenetreModale h1");
const zoneContenu = document.querySelector(".contenuFenetre");
const boutonModif = document.querySelector(".piedModale input");    //  Bouton de validation de la fenêtre modale
const retour = document.querySelector("#retour");                   //  Flèche de navigation arrière

let imageNouvProjet;    //  Variable de temporisation pour l'image d'un nouveau projet à enregistrer

//  Création de la fenêtre modale contenant une partie dynamique et une partie fixe
//  Prend en paramètre la galerie de photo (issue de la page d'accueil)
export function initModale(affichageVignettes) {

    //  Rénitialisation pour le cas où on a fermer la fenêtre modale depuis la page d'ajout de projet
    zoneContenu.innerHTML = "";
    titre.innerText = "Galerie photos";
    boutonModif.value = "Ajouter une photo";
    boutonModif.removeAttribute("disabled");
    retour.classList.add("invisibilite");
    //

    zoneContenu.innerHTML = affichageVignettes;

    const figures = document.querySelectorAll(".contenuFenetre figure");

    for (const figure of figures) {
        figure.childNodes[0].classList.add("miniatures");
        figure.removeChild(figure.childNodes[1]);   //  Ici, on a pas besoin de la légende des photos des projets
        creerBoutonEffacer(figure);
    }

    boutonAction();

    fermerModale();

    fenetreModale.showModal();
}

function boutonAction() {
    boutonModif.addEventListener("click", (e) => {
        console.log("bouton action = " + e.target.classList.contains("disabled"));
        if (e.target.value === "Ajouter une photo") {
            modaleAjout();
        }
        else if (e.target.value === "Valider" && e.target.getAttribute("disabled") == "false") {
            enregistrerProjet();
            fenetreModale.close();
        };
    });
}

//  Création des icones de suppression des projets
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
            msgAlerte.innerText = "La connexion à échouer<br />Vous devez ne pas avoir le droit de vous connecter<br />" + error;

            zoneContenu.appendChild(msgAlerte);
        }
    });
}

function modaleAjout() {
    console.log("On est dans modaleAjout");

    //  Constitution du formulaire de création d'un projet
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
                                    <input name="titreProjet" type="text" class="nomProjet" required/>
                                    <label for="choisirCategorie" class="labelTexteAjout">Cat&eacute;gorie</label>
                                    <select name="choisirCategorie" class="choixCategorie" required>
                                        <option value="0"></option>
                                    </select>
                                </div>
                            </form >`;

    titre.innerText = "Ajout photo";
    retour.classList.remove("invisibilite");
    boutonModif.setAttribute("value", "Valider");
    boutonModif.setAttribute("disabled", "true");

    recupererCategories();

    telechargerPhoto();

    retour.addEventListener("click", () => {
        retourPage("ajoutPhoto");
    });

    zoneContenu.addEventListener("change", () => {
        const imageProjet = document.querySelector("#chargerImage");
        const nomProjet = document.querySelector(".nomProjet");
        const categorieProjet = document.querySelector(".choixCategorie");

        if (nomProjet.value != "" && categorieProjet.value > 0) {
            boutonModif.removeAttribute("disabled");
        }
    });
}

async function recupererCategories() {
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
}

function telechargerPhoto() {
    const zoneImage = document.querySelector("#chargerImage");
    const choixPhoto = document.querySelector("#imageNouvProj");

    choixPhoto.addEventListener("change", (e) => {
        const fichierImage = document.querySelector("input[type=file]").files[0];
        const photoChoisie = document.querySelector(".imageSelectionnee");

        imageNouvProjet = fichierImage;

        photoChoisie.innerHTML = `<img src="${URL.createObjectURL(fichierImage)}" alt="${fichierImage.name}" class="photoSelectionnee" />`;
        console.log("choixPhoto.addEventListener\r\nchoixPhoto : " + URL.createObjectURL(fichierImage));

        zoneImage.innerHTML = "";
        zoneImage.appendChild(photoChoisie);
    });
}

async function enregistrerProjet() {
    try {
        const nomProjet = document.querySelector(".nomProjet");
        const categorieProjet = document.querySelector(".choixCategorie");

        const ajoutProjet = new FormData();

        console.log("imageNouvProjet = " + imageNouvProjet);

        ajoutProjet.append("image", imageNouvProjet);
        ajoutProjet.append("title", nomProjet.value);
        ajoutProjet.append("category", parseInt(categorieProjet.value));

        await fetch('http://localhost:5678/api/works', {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token"),
                "Accept": "application/json",
            },
            body: ajoutProjet,
        });
    }
    catch (error) {
        console.log("enregistrerProjet KO\r\n", error);
    }
}

//  Fonctions de navigation
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

function fermerModale() {
    const fermerFenetreModale = document.querySelector("#fermeture");

    fermerFenetreModale.addEventListener("click", () => {
        fenetreModale.close();
    });
}