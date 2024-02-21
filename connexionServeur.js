export function getSource() {
    try {
        return fetch('http://localhost:5678/api/works');
    } catch (error) {
        alert("Problème de réponse API :\r\n" + error);
    }
}