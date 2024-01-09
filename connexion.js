//  Gestion du formulaire de connexion
const soumissionForm = document.querySelector("#formConnexion");
const champsCourriel = document.querySelector("#courriel");
const champsMdp = document.querySelector("#mdp");

let etatConnexion = true;

soumissionForm.addEventListener("submit", (event) => {
    event.preventDefault();
    gererConnexionAdmin();
});

//  Écoute la saisie du courriel en vérifiant le format et désactivant la soumission tant que le format est incorrect
champsCourriel.addEventListener("change", () => {
    let modele = new RegExp("[a-zA-Z0-9.\-]+@[a-zA-Z0-9.\-]+\.[a-z]{2,3}");
    let testCourriel = modele.test(champsCourriel.value);

    champsCourriel.classList.remove("erreurSaisie");

    if (!testCourriel) {
        champsCourriel.classList.add("erreurSaisie");
        soumissionForm.setAttribute("disabled", "true");
    }
    else {
        soumissionForm.removeAttribute("disabled");
    }
})

async function gererConnexionAdmin() {
    localStorage.removeItem("token");

    const donneesConnexion = {
        "email": champsCourriel.value,
        "password": champsMdp.value
    }

    try {
        const connexion = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(donneesConnexion)
        });

        const reponseConnexion = await connexion.json();

        localStorage.setItem("token", reponseConnexion.token);

        document.location = "index.html";
    }
    catch (Erreur) {
        const msgAlerte = document.createElement("p");

        msgAlerte.setAttribute("style", "color: red; font-weight: 700;");
        msgAlerte.innerText = "La connexion à échouer\r\nVous devez ne pas avoir le droit de vous connecter<br />";

        soumissionForm.appendChild(msgAlerte);
    }
}