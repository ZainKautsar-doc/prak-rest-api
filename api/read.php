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

$stmt = $mhs->read();
$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

if ($data) {
    echo json_encode($data);
} else {
    http_response_code(404);
    echo json_encode(["message" => "Data tidak ditemukan"]);
}
