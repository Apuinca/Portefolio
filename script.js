const etatConnexion = document.querySelector("#logInOut");

//  Récupération de la zone des photos
const vignettes = document.querySelector(".gallery");

//  Boutons de filtre
const btn_tout = document.querySelector("#tout");
const btn_objets = document.querySelector("#objets");
const btn_apparts = document.querySelector("#apparts");
const btn_hotels = document.querySelector("#hotels");

const forceToken = document.querySelector(".prov");

forceToken.addEventListener("click", () => {
    localStorage.removeItem("token");
    forceToken.innerText = "token réinitialisé";
});

init();

async function init() {
    const travaux = await getSource();
    const listeProjets = await travaux.json();

    gestionLogInOut();
    generationVignettes(listeProjets);
    gestionFiltres(listeProjets);
       
}

function gestionLogInOut() {
    etatConnexion.addEventListener("click", () => {
        if (etatConnexion.innerText == "logout") {
            localStorage.removeItem("token");

            console.log("gestionLogInOut\r\n" + localStorage.getItem("token"))

            etatConnexion.innerText = "login";
            etatConnexion.setAttribute("href", "#");
        }
        else {
            etatConnexion.setAttribute("href", "connexions.html");
        }

        accueilConnectee();
    });
}

function getSource() {
    try {
        return fetch('http://localhost:5678/api/works');
    } catch (error) {
        console.error("Problème de réponse API ", error);
    }
}

function generationVignettes(listeATraiter) {
    vignettes.innerHTML = "";

    let projets = Array.from(listeATraiter);

    for (let i = 0; i < listeATraiter.length; i++) {
        generationHTML(listeATraiter[i]);
    }
}

function generationHTML(enregistrement) {
    const baliseFigure = document.createElement("figure");
    const baliseImg = document.createElement("img");
    const baliseFigcaption = document.createElement("figcaption");

    baliseImg.src = enregistrement.imageUrl;
    baliseImg.alt = enregistrement.title;
    baliseFigcaption.innerText = enregistrement.title;

    vignettes.appendChild(baliseFigure);
    baliseFigure.appendChild(baliseImg);
    baliseFigure.appendChild(baliseFigcaption);
    vignettes.appendChild(baliseFigure);
}

function gestionFiltres(travaux) {    
    const projetsAFiltrer = Array.from(travaux);

    btn_tout.addEventListener("click", (event) => {
        generationVignettes(travaux);
        modifierBoutonActif("tout");
    });

    btn_objets.addEventListener("click", (event) => {
        const listeObjets = projetsAFiltrer.filter((projet) => {
            return projet.categoryId === 1;
        });

        generationVignettes(listeObjets);
        modifierBoutonActif("objets");                    
    });

    btn_apparts.addEventListener("click", (event) => {
        const listeApparts = projetsAFiltrer.filter((projet) => {
            return projet.categoryId === 2;
            
        });

        generationVignettes(listeApparts);
        modifierBoutonActif("apparts");
    });

    btn_hotels.addEventListener("click", (event) => {
        const listeHotelsRestos = projetsAFiltrer.filter((projet) => {
            return projet.categoryId === 3;
            
        });

        generationVignettes(listeHotelsRestos);
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

function accueilConnectee() {
    const logInOut = document.querySelector("#logInOut");
    const zoneFiltres = document.querySelector(".filtres");
    const modeEntete = document.querySelector("header");
    const modeEdition = document.createElement("modeEditionActive");

    let balisesFiltre = "";

    console.log("On est dans accueilConnectee\n\rtoken = " + localStorage.getItem("token"));

    if (!localStorage.getItem("token")) {
        balisesFiltre = `<button id="tout" class="btn_filtres petit_btn">Tout</button>
                <button id="objets" class="btn_filtres petit_btn inactif">Objets</button>
                <button id="apparts" class="btn_filtres moyen_btn inactif">Appartements</button>
                <button id="hotels" class="btn_filtres large_btn inactif">H&ocirc;tels & restaurants</button>`;

        logInOut.innerText = "login";

        modeEntete.removeChild(modeEdition);

        console.log("token NON défini");
    }
    else {
        const imgEnteteEdition = document.createElement("img");
        const entete = document.querySelector(".headerCommun");

        logInOut.innerText = "logout";

        imgEnteteEdition.setAttribute("src", "./assets/icons/modifier.png");
        imgEnteteEdition.setAttribute("alt", "Indication du mode édition");

        modeEdition.appendChild(imgEnteteEdition);
        modeEdition.innerText += "Édition";
        modeEdition.classList.add("statutEdition");

        modeEntete.insertBefore(modeEdition, entete);

        console.log("token défini");
    }

    console.log("balisesFiltre :\r\n" + balisesFiltre);

    zoneFiltres.innerHTML = balisesFiltre;
}