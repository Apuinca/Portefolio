export function getSource() {
    try {
        return fetch('http://localhost:5678/api/works');
    } catch (error) {
        alert("Probl�me de r�ponse API :\r\n" + error);
    }
}