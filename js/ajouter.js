document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("taskForm");

    if (!form) {
        console.error("Le formulaire n'existe pas !");
        return;
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Empêche l'envoi du formulaire

        const title = document.getElementById("title");
        const description = document.getElementById("description");
        const deadline = document.getElementById("deadline");
        const priority = document.getElementById("priority");
        const category = document.getElementById("category");
        const assignedTo = document.getElementById("assignedTo");

        // Validation des champs obligatoires
        if (!title.value || !description.value) {
            alert("Le titre et la description sont obligatoires.");
            return;
        }

        const taskData = {
            title: title.value,
            description: description.value,
            deadline: deadline.value,
            priority: priority.value,
            category: category.value,
            assignedTo: assignedTo.value,
        };

        console.log("Nouvelle tâche :", taskData);

        fetch('http://localhost/gestions-des-taches/api.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData),
        })
        .then(response => response.text())  // Utilise .text() ici pour vérifier la réponse brute
        .then(text => {
            console.log("Réponse brute :", text);  // Affiche la réponse pour identifier le problème
            try {
                const data = JSON.parse(text);  // Ensuite, essaie de parser le texte en JSON
                console.log("Données JSON :", data);
            } catch (error) {
                console.error("Erreur lors du parsing JSON : ", error);
            }
        })
        .catch(error => {
            console.error("Erreur réseau : ", error);
        });
        
        
    });
});
