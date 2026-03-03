<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: DELETE");

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    echo json_encode(["message" => "Method tidak diizinkan"]);
    exit;
}

include_once '../config/Database.php';
include_once '../models/Mahasiswa.php';

$db = (new Database())->getConnection();
$mhs = new Mahasiswa($db);

$data = json_decode(file_get_contents("php://input"));
$mhs->id = $data->id;

if ($mhs->delete()) {
    echo json_encode(["message" => "Berhasil hapus"]);
} else {
    http_response_code(503);
    echo json_encode(["message" => "Gagal"]);
}
