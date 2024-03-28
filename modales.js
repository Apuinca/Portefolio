const fenetreModale = document.querySelector(".fenetreModale");
const titre = document.querySelector(".fenetreModale h1");
const zoneContenu = document.querySelector(".contenuFenetre");
const boutonModif = document.querySelector(".piedModale");    //  Bouton de validation de la fenêtre modale
const retour = document.querySelector("#retour");                   //  Flèche de navigation arrière

let imageNouvProjet;    //  Variable de temporisation pour l'image d'un nouveau projet à enregistrer

//  Création de la fenêtre modale contenant une partie dynamique et une partie fixe
//  Prend en paramètre la galerie de photo (issue de la page d'accueil)
export async function initModale() {

    //  Rénitialisation pour le cas où on a fermer la fenêtre modale depuis la page d'ajout de projet
    zoneContenu.innerHTML = "";
    boutonModif.innerHTML = "";
    titre.innerText = "Galerie photos";

    const barre = document.createElement("hr");
    const bouton = document.createElement("input");

    bouton.setAttribute("type", "submit");
    bouton.setAttribute("value", "Ajouter une photo");

    boutonModif.appendChild(barre);
    boutonModif.appendChild(bouton);

    retour.classList.add("invisibilite");

    boutonModif.addEventListener("click", async (e) => {
        e.preventDefault();
        await modaleAjout();
    }
    );

    await rafraichirMiniatures();

    fermerModale();

    fenetreModale.showModal();
}

async function rafraichirMiniatures() {
    const enregLogements = await fetch('http://localhost:5678/api/works');
    const listeLogement = await enregLogements.json();

    console.log("On est dans rafraichirMiniatures")

    for (let i = 0; i < listeLogement.length; i++) {
        const baliseFigure = document.createElement("figure");
        const baliseImg = document.createElement("img");

        baliseImg.src = listeLogement[i].imageUrl;
        baliseImg.alt = listeLogement[i].title;
        baliseImg.classList.add(listeLogement[i].id, "miniatures");

        zoneContenu.appendChild(baliseFigure);
        baliseFigure.appendChild(baliseImg);
        zoneContenu.appendChild(baliseFigure);

        creerBoutonEffacer(baliseFigure);
    }
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

    baliseParent.addEventListener("click", async (e) => {
        e.preventDefault();
        const idProjetAEffacer = e.currentTarget.childNodes[0].classList[0];
        try {
            await fetch(`http://localhost:5678/api/works/${idProjetAEffacer}`, {
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer " + sessionStorage.getItem("token"),
                },
                body: idProjetAEffacer,
            });

            await initModale();
        }
        catch (error) {
            const msgAlerte = document.createElement("p");

            msgAlerte.setAttribute("style", "color: red; font-weight: 700;");
            msgAlerte.innerText = "La suppression a échoueé<br />" + error;

            zoneContenu.appendChild(msgAlerte);
        }
    });
}

async function modaleAjout() {
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
                                </div>
                            </form >`;

    await recupererCategories();

    telechargerPhoto();

    boutonModif.innerHTML = "";

    const ajoutPhoto = document.createElement("input");
    const barre = document.createElement("hr");

    titre.innerText = "Ajout photo";
    retour.classList.remove("invisibilite");

    ajoutPhoto.setAttribute("type", "submit");
    ajoutPhoto.setAttribute("value", "Valider");
    ajoutPhoto.setAttribute("disabled", "true");

    boutonModif.appendChild(barre);
    boutonModif.appendChild(ajoutPhoto);
    
    retour.addEventListener("click", async (e) => {
        e.preventDefault();
        await retourPage("ajoutPhoto");
    });

    zoneContenu.addEventListener("change", (e) => {
        e.preventDefault();
        const imageProjet = document.querySelector("#chargerImage");
        const nomProjet = document.querySelector(".nomProjet");
        const categorieProjet = document.querySelector(".choixCategorie");

        console.dir(imageProjet);

        if (nomProjet.value != "" && categorieProjet.value > 0) {
            ajoutPhoto.removeAttribute("disabled");

            ajoutPhoto.addEventListener("click", async (e) => {
                e.preventDefault();
                await enregistrerProjet();
                await initModale();
            })
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
        const listeOptions = document.querySelector("#textesAjout");

        const comboBoxCat = document.createElement("select");

        comboBoxCat.setAttribute("name", "choisirCategorie");
        comboBoxCat.setAttribute("required", "true");
        comboBoxCat.classList.add("choixCategorie");

        const defautChoix = document.createElement("option");

        defautChoix.setAttribute("value", "0");
        defautChoix.innerText = "Choisir une catégorie";

        comboBoxCat.appendChild(defautChoix);

        for (const categorie of listeCategories) {
            const valCategorie = document.createElement("option");
            valCategorie.setAttribute("value", categorie.id);
            valCategorie.innerText = categorie.name;

            comboBoxCat.appendChild(valCategorie);
        }

        listeOptions.appendChild(comboBoxCat);
    }
    catch {
        console.log("Oups! Liste des catégories pas récupérée");
    }
}

function telechargerPhoto() {
    const zoneImage = document.querySelector("#chargerImage");
    const choixPhoto = document.querySelector("#imageNouvProj");

    choixPhoto.addEventListener("change", (e) => {
        e.preventDefault();
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
        console.log("On est dans enregistrerProjet()");

        const nomProjet = document.querySelector(".nomProjet");
        const categorieProjet = document.querySelector(".choixCategorie");

        const ajoutProjet = new FormData();

        ajoutProjet.append("image", imageNouvProjet);
        ajoutProjet.append("title", nomProjet.value);
        ajoutProjet.append("category", parseInt(categorieProjet.value));

        await fetch('http://localhost:5678/api/works', {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("token"),
                "Accept": "application/json",
            },
            body: ajoutProjet,
        });

        console.log("enregistrerProjet() terminé");
    }
    catch (error) {
        console.log("enregistrerProjet KO\r\n", error);
    }
}

//Fonctions de navigation
async function retourPage(etape) {
    zoneContenu.innerHTML = "";

    if (etape === "ajoutPhoto") {
        boutonModif.removeAttribute("disabled");
        boutonModif.value = "Ajouter une photo";
        retour.classList.add("invisibilite");
        titre.innerText = "Galerie photo";

        await initModale(sessionStorage.getItem("galerie"));
    }
    else if (etape === "ajoutPhotoValide") {
        await modaleAjout();
    }
}

function fermerModale() {
    const fermerFenetreModale = document.querySelector("#fermeture");

    fermerFenetreModale.addEventListener("click", (e) => {
        fenetreModale.close();
    });

    fenetreModale.addEventListener("click", (e) => {
        if (e.target == fenetreModale) {
            fenetreModale.close();
        }
    });
}