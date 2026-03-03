<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET");

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["message" => "Method tidak diizinkan"]);
    exit;
}

include_once '../config/Database.php';
include_once '../models/Mahasiswa.php';

$db = (new Database())->getConnection();
$mhs = new Mahasiswa($db);

if (!isset($_GET['keyword']) || empty($_GET['keyword'])) {
    http_response_code(400);
    echo json_encode(["message" => "Parameter keyword diperlukan"]);
    exit;
}

$keyword = $_GET['keyword'];

$stmt = $mhs->search($keyword);
$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

if ($data) {
    echo json_encode([
        "status" => "success",
        "total" => count($data),
        "data" => $data
    ]);
} else {
    http_response_code(404);
    echo json_encode([
        "status" => "error",
        "message" => "Data tidak ditemukan"
    ]);
}