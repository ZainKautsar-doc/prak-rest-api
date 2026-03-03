﻿<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mahasiswa API Dashboard</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header class="navbar">
        <div class="nav-inner">
            <div class="brand">Mahasiswa API Dashboard</div>
            <nav class="menu">
                <button class="menu-link active" data-target="data-section" type="button">Data Mahasiswa</button>
                <button class="menu-link" data-target="tester-section" type="button">API Tester</button>
            </nav>
        </div>
    </header>

    <main class="container">
        <section id="data-section" class="page-section active" aria-labelledby="data-heading">
            <div class="card">
                <div class="card-head">
                    <div>
                        <h1 id="data-heading">Data Mahasiswa</h1>
                        <p class="subtitle">Lihat, cari, dan refresh data mahasiswa dari REST API.</p>
                    </div>
                </div>

                <div class="controls">
                    <input id="searchInput" type="text" placeholder="Cari nama, NPM, atau jurusan..." autocomplete="off">
                    <button id="searchBtn" class="btn btn-primary" type="button">Search</button>
                    <button id="refreshBtn" class="btn btn-ghost" type="button">Refresh</button>
                </div>

                <div id="tableLoading" class="loading hidden">
                    <span class="spinner"></span>
                    <span>Memuat data mahasiswa...</span>
                </div>

                <div class="table-wrap" id="tableWrap">
                    <table id="mahasiswaTable">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>ID</th>
                                <th>NPM</th>
                                <th>Nama</th>
                                <th>Jurusan</th>
                            </tr>
                        </thead>
                        <tbody id="tableBody"></tbody>
                    </table>
                </div>

                <div id="emptyState" class="empty hidden">
                    <h3>Belum ada data untuk ditampilkan</h3>
                    <p>Coba ubah kata kunci pencarian atau lakukan refresh data.</p>
                </div>
            </div>
        </section>

        <section id="tester-section" class="page-section" aria-labelledby="tester-heading">
            <div class="card">
                <div class="card-head">
                    <div>
                        <h1 id="tester-heading">API Tester</h1>
                        <p class="subtitle">Uji endpoint API langsung dari browser menggunakan fetch().</p>
                    </div>
                </div>

                <div class="tester-layout">
                    <div class="tester-form">
                        <div class="tester-grid">
                            <div class="field">
                                <label for="methodSelect">Method</label>
                                <select id="methodSelect">
                                    <option value="GET">GET</option>
                                    <option value="POST">POST</option>
                                    <option value="PUT">PUT</option>
                                    <option value="DELETE">DELETE</option>
                                </select>
                            </div>

                            <div class="field">
                                <label for="endpointInput">Endpoint URL</label>
                                <input id="endpointInput" type="text" value="api/read.php" spellcheck="false">
                            </div>
                        </div>

                        <div class="field">
                            <label for="jsonBody">JSON Body</label>
                            <textarea id="jsonBody" rows="8"></textarea>
                        </div>

                        <div class="tester-actions">
                            <button id="sendBtn" class="btn btn-primary" type="button">Send Request</button>
                            <div id="requestLoading" class="loading inline hidden">
                                <span class="spinner"></span>
                                <span>Mengirim request...</span>
                            </div>
                        </div>
                    </div>

                    <div id="responsePanel" class="response-panel neutral">
                        <div class="response-head">
                            <h2>Response</h2>
                            <div class="response-meta">
                                <span id="statusBadge" class="status-badge neutral">Status: -</span>
                                <button id="copyBtn" class="btn-icon" title="Copy Response">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                </button>
                            </div>
                        </div>
                        <pre id="responseOutput">{
  "message": "Response API akan tampil di sini"
}</pre>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <div id="toastContainer" class="toast-container" aria-live="polite" aria-atomic="true"></div>

    <script src="script.js"></script>
</body>
</html>
