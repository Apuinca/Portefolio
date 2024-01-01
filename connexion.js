const boutonSoumission = document.querySelector("#connecter");
const champsCourriel = document.querySelector("#courriel");
const champsMdp = document.querySelector("#mdp");

let etatConnexion = true;

boutonSoumission.addEventListener("submit", (event) => {
    event.preventDefault();
    connexionAdmin();
});

//  Écoute la saisie du courriel en vérifiant le format et désactivant la soumission tant que le format est incorrect
champsCourriel.addEventListener("change", () => {
    let modele = new RegExp("[a-zA-Z0-9.\-]+@[a-zA-Z0-9.\-]+\.[a-z]{2,3}");
    let testCourriel = modele.test(champsCourriel.value);

    champsCourriel.classList.remove("erreurSaisie");

    if (!testCourriel) {
        champsCourriel.classList.add("erreurSaisie");
        boutonSoumission.setAttribute("disabled", "true");
    }
    else {
        boutonSoumission.removeAttribute("disabled");
    }
})

/*champsMdp.addEventListener("change", () => {

})*/

async function connexionAdmin() {
    console.log("On est dans connexionAdmin");

    localStorage.removeItem("token");

    const donneesConnexion = {
        "email": champsCourriel.value,
        "password": champsMdp.value
    }

    console.log("On a : courriel = " + champsCourriel.value + " et mot de passe = " + champsMdp.value);

    try {
        const connexion = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(donneesConnexion)
        });

        const reponseConnexion = await connexion.json();

        localStorage.setItem("token", reponseConnexion.token);
    }
    catch (Erreur) {
        console.log("La connexion à échouer\r\nVous devez ne pas avoir le droit de vous connecter");
    }

    console.log("On est dans connexionAdmin\n\rtoken = " + localStorage.getItem("token"));
}