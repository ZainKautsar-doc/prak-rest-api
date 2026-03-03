<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: PUT");

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
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
$mhs->npm = $data->npm;
$mhs->nama = $data->nama;
$mhs->jurusan = $data->jurusan;

if ($mhs->update()) {
    echo json_encode(["message" => "Berhasil update"]);
} else {
    http_response_code(503);
    echo json_encode(["message" => "Gagal"]);
}
