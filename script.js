import { initModale } from "./modales.js";

const etatConnexion = document.querySelector("#logInOut");

//  Récupération de la zone des photos
const vignettes = document.querySelector(".gallery");

//  Boutons de filtre
const btn_tout = document.querySelector("#tout");
const btn_objets = document.querySelector("#objets");
const btn_apparts = document.querySelector("#apparts");
const btn_hotels = document.querySelector("#hotels");

init();

async function init() {
    const travaux = await getSource();
    const listeProjets = await travaux.json();

    gererLogInOut();
    genererVignettes(listeProjets);
    gererFiltres(listeProjets);
    gererAccueilConnectee();
}

function gererLogInOut() {
    etatConnexion.addEventListener("click", () => {
        if (etatConnexion.innerText == "logout") {
            localStorage.removeItem("token");

            etatConnexion.innerText = "login";
            etatConnexion.setAttribute("href", "index.html");
        }
        else {
            etatConnexion.setAttribute("href", "connexions.html");
        }
    });
}

function getSource() {
    try {
        return fetch('http://localhost:5678/api/works');
    } catch (error) {
        alert("Problème de réponse API :\r\n" + error);
    }
}

function genererVignettes(listeATraiter) {
    vignettes.innerHTML = "";

    for (let i = 0; i < listeATraiter.length; i++) {
        genererHTML(listeATraiter[i]);
    }
}

/*  Construit la structure
    <figure>
        <img src="" alt="" />
        <figcaption>enregistrement</figcaption>
    </figure>
*/
function genererHTML(enregistrement) {
    const baliseFigure = document.createElement("figure");
    const baliseImg = document.createElement("img");
    const baliseFigcaption = document.createElement("figcaption");

    baliseImg.src = enregistrement.imageUrl;
    baliseImg.alt = enregistrement.title;
    baliseImg.classList.add(enregistrement.id);

    baliseFigcaption.innerText = enregistrement.title;

    vignettes.appendChild(baliseFigure);
    baliseFigure.appendChild(baliseImg);
    baliseFigure.appendChild(baliseFigcaption);
    vignettes.appendChild(baliseFigure);
}

function gererFiltres(travaux) {
    const projetsAFiltrer = Array.from(travaux);

    btn_tout.addEventListener("click", (event) => {
        genererVignettes(travaux);
        modifierBoutonActif("tout");
    });

    btn_objets.addEventListener("click", (event) => {
        const listeObjets = projetsAFiltrer.filter((projet) => {
            return projet.categoryId === 1;
        });

        genererVignettes(listeObjets);
        modifierBoutonActif("objets");
    });

    btn_apparts.addEventListener("click", (event) => {
        const listeApparts = projetsAFiltrer.filter((projet) => {
            return projet.categoryId === 2;

        });

        genererVignettes(listeApparts);
        modifierBoutonActif("apparts");
    });

    btn_hotels.addEventListener("click", (event) => {
        const listeHotelsRestos = projetsAFiltrer.filter((projet) => {
            return projet.categoryId === 3;

        });

        genererVignettes(listeHotelsRestos);
        modifierBoutonActif("hotels");
    });
}

function modifierBoutonActif(idxBouton) {
    switch (idxBouton) {
        case "tout":
            btn_tout.classList.remove("inactif");
            btn_objets.classList.add("inactif");
            btn_apparts.classList.add("inactif");
            btn_hotels.classList.add("inactif");
            break;
        case "objets":
            btn_tout.classList.add("inactif");
            btn_objets.classList.remove("inactif");
            btn_apparts.classList.add("inactif");
            btn_hotels.classList.add("inactif");
            break;
        case "apparts":
            btn_tout.classList.add("inactif");
            btn_objets.classList.add("inactif");
            btn_apparts.classList.remove("inactif");
            btn_hotels.classList.add("inactif");
            break;
        case "hotels":
            btn_tout.classList.add("inactif");
            btn_objets.classList.add("inactif");
            btn_apparts.classList.add("inactif");
            btn_hotels.classList.remove("inactif");
    }
}

//  Configure la page d'accueil suite à la connexion de l'utilisateur
function gererAccueilConnectee() {
    const zoneMain = document.querySelector("main");
    const logInOut = document.querySelector("#logInOut");
    const zoneFiltres = document.querySelector(".filtres");
    const modeEntete = document.querySelector("header");
    const zoneModifier = document.querySelector(".modifierPhotos"); //  Bouton d'affichage ouvrant la fenêtre modale

    if (!localStorage.getItem("token")) {        
        zoneModifier.classList.add("invisibilite");

        logInOut.innerText = "login";
    }
    else {    
        const iconeEnteteEdition = document.createElement("i");
        const texteEnteteEdition = document.createElement("p");
        const entete = document.querySelector(".headerCommun");
        const modeEdition = document.createElement("modeeditionactive");

        //  Compensation de l'apparition du bandeau du mode édition
        zoneMain.classList.add("compensation");

        //  Transforme le libellé "login" en "logout"
        logInOut.innerText = "logout";

        //  Fait apparaitre le bouton de lancement de modification
        zoneModifier.classList.remove("invisibilite");

        iconeEnteteEdition.style.color = "white";
        iconeEnteteEdition.classList.add("fa-regular", "fa-pen-to-square");

    //  Création du bandeau signifiant qu'on est en mode édition
        //  Empêche l'entassement du bandeau
        if (texteEnteteEdition.innerHTML == "") {
            texteEnteteEdition.innerHTML = "Mode &eacute;dition";

            modeEdition.appendChild(iconeEnteteEdition);
            modeEdition.appendChild(texteEnteteEdition);
            modeEdition.classList.add("statutEdition");

            modeEntete.insertBefore(modeEdition, entete);
        }
    //
        zoneFiltres.innerHTML = "";
    }
}

const bouton = document.querySelector(".btn_modifPhoto");

bouton.addEventListener("click", () => {
    localStorage.setItem("galerie", vignettes.innerHTML);

    initModale(vignettes.innerHTML);
});