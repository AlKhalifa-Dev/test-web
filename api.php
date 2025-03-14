<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

require "db.php";

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"), true);

switch ($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT * FROM tasks ORDER BY id DESC");
        echo json_encode($stmt->fetchAll());
        break;

    case 'POST':
        if (!isset($data["title"]) || !isset($data["description"])) {
            echo json_encode(["message" => "Données manquantes"]);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO tasks (title, description, deadline, priority, category, assignedTo, completed) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data["title"],
            $data["description"],
            $data["deadline"] ?? null,
            $data["priority"] ?? 'Moyenne',
            $data["category"] ?? 'Autre',
            $data["assignedTo"] ?? '',
            0||1 // Ajout correct du booléen en tant que entier (0 pour faux, 1 pour vrai)
        ]);
        echo json_encode(["message" => "Tâche ajoutée avec succès"]);
        break;

    case 'PUT':
        if (!isset($data["id"])) {
            echo json_encode(["message" => "ID manquant"]);
            exit;
        }

        $stmt = $pdo->prepare("UPDATE tasks SET title=?, description=?, deadline=?, priority=?, category=?, assignedTo=?, completed=? WHERE id=?");
        $stmt->execute([
            $data["title"],
            $data["description"],
            $data["deadline"] ?? null,
            $data["priority"] ?? 'Moyenne',
            $data["category"] ?? 'Autre',
            $data["assignedTo"] ?? '',
            $data["completed"] ? 1 : 0,
            $data["id"]
        ]);
        echo json_encode(["message" => "Tâche mise à jour"]);
        break;

    case 'DELETE':
        if (!isset($data["id"])) {
            echo json_encode(["message" => "ID manquant"]);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM tasks WHERE id=?");
        $stmt->execute([$data["id"]]);
        echo json_encode(["message" => "Tâche supprimée"]);
        break;

    default:
        echo json_encode(["message" => "Méthode non supportée"]);
}
?>
