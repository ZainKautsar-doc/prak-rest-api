<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["message" => "Method tidak diizinkan"]);
    exit;
}

include_once '../config/Database.php';
include_once '../models/Mahasiswa.php';

$db = (new Database())->getConnection();
$mhs = new Mahasiswa($db);

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->npm) && !empty($data->nama) && !empty($data->jurusan)) {
    $mhs->npm = $data->npm;
    $mhs->nama = $data->nama;
    $mhs->jurusan = $data->jurusan;

    if ($mhs->create()) {
        http_response_code(201);
        echo json_encode(["message" => "Mahasiswa ditambahkan"]);
    } else {
        http_response_code(503);
        echo json_encode(["message" => "Gagal"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Data tidak lengkap"]);
}
