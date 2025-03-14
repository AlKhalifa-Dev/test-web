document.addEventListener("DOMContentLoaded", function () {
    const taskTableBody = document.getElementById("taskTableBody");

    if (!taskTableBody) {
        console.error("Erreur : #taskTableBody introuvable !");
        return;
    }

    // Fonction pour charger les tâches
    function chargerTaches() {
        fetch("api.php")
            .then(response => response.json())
            .then(data => {
                taskTableBody.innerHTML = "";
                data.forEach(task => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${task.id}</td>
                        <td>${task.title}</td>
                        <td>${task.description}</td>
                        <td>${task.deadline || "Non défini"}</td>
                        <td><span class="badge ${task.priority === 'Haute' ? 'bg-danger' : task.priority === 'Moyenne' ? 'bg-warning' : 'bg-success'}">${task.priority}</span></td>
                        <td>${task.category}</td>
                        <td>${task.assignedTo || "N/A"}</td>
                        <td>${task.completed ? "✔️ Terminée" : "⏳ En cours"}</td>
                        <td>
                            <button class="btn btn-success btn-sm" onclick="marquerTermine(${task.id})">
                                <i class="fas fa-check"></i>
                            </button>
                            <button class="btn btn-info btn-sm" onclick="modifierTache(${task.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-danger btn-sm" onclick="supprimerTache(${task.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    `;
                    taskTableBody.appendChild(row);
                });
            })
            .catch(error => console.error("Erreur lors du chargement des tâches :", error));
    }

    chargerTaches();

    // Fonction pour marquer une tâche comme terminée
    window.marquerTermine = function(id) {
        // Mettre à jour uniquement le statut de la tâche (en cours ou terminée)
        fetch("api.php", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: id, completed: true })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            chargerTaches(); // Recharger les tâches après modification
        })
        .catch(error => console.error("Erreur lors de la mise à jour de la tâche :", error));
    };
    

    // Fonction pour supprimer une tâche
    window.supprimerTache = function(id) {
        if (confirm("Voulez-vous vraiment supprimer cette tâche ?")) {
            fetch("api.php", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: id })
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                chargerTaches(); // Recharger les tâches après suppression
            })
            .catch(error => console.error("Erreur lors de la suppression de la tâche :", error));
        }
    };

    // Fonction pour modifier une tâche
    window.modifierTache = function(id) {
        fetch(`api.php?id=${id}`)
            .then(response => response.json())
            .then(task => {
                if (!task) {
                    alert("Tâche non trouvée !");
                    return;
                }

                const titre = prompt("Nouveau titre :", task.title);
                const description = prompt("Nouvelle description :", task.description);
                const deadline = prompt("Nouvelle date limite :", task.deadline);
                const priority = prompt("Nouvelle priorité :", task.priority);
                const category = prompt("Nouvelle catégorie :", task.category);
                const assignedTo = prompt("Assigné à :", task.assignedTo);

                const updatedTask = {
                    id: id,
                    title: titre || task.title,
                    description: description || task.description,
                    deadline: deadline || task.deadline,
                    priority: priority || task.priority,
                    category: category || task.category,
                    assignedTo: assignedTo || task.assignedTo,
                    completed: task.completed
                };

                fetch("api.php", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(updatedTask)
                })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    chargerTaches(); // Recharger les tâches après modification
                })
                .catch(error => console.error("Erreur lors de la modification de la tâche :", error));
            })
            .catch(error => console.error("Erreur lors de la récupération de la tâche :", error));
    };
});
