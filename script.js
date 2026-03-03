const navLinks = document.querySelectorAll(".menu-link");
const sections = document.querySelectorAll(".page-section");

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const refreshBtn = document.getElementById("refreshBtn");
const tableBody = document.getElementById("tableBody");
const tableWrap = document.getElementById("tableWrap");
const tableLoading = document.getElementById("tableLoading");
const emptyState = document.getElementById("emptyState");

const methodSelect = document.getElementById("methodSelect");
const endpointInput = document.getElementById("endpointInput");
const jsonBody = document.getElementById("jsonBody");
const sendBtn = document.getElementById("sendBtn");
const requestLoading = document.getElementById("requestLoading");
const responsePanel = document.getElementById("responsePanel");
const statusBadge = document.getElementById("statusBadge");
const responseOutput = document.getElementById("responseOutput");
const toastContainer = document.getElementById("toastContainer");

let currentKeyword = "";

function switchTab(targetId) {
    navLinks.forEach((link) => {
        link.classList.toggle("active", link.dataset.target === targetId);
    });

    sections.forEach((section) => {
        section.classList.toggle("active", section.id === targetId);
    });
}

navLinks.forEach((link) => {
    link.addEventListener("click", () => switchTab(link.dataset.target));
});

function setTableLoading(isLoading) {
    tableLoading.classList.toggle("hidden", !isLoading);
}

function showEmptyState(message) {
    emptyState.querySelector("p").textContent = message;
    emptyState.classList.remove("hidden");
    tableWrap.classList.add("hidden");
}

function hideEmptyState() {
    emptyState.classList.add("hidden");
    tableWrap.classList.remove("hidden");
}

function escapeHtml(text) {
    if (text === null || text === undefined) {
        return "-";
    }

    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function renderTable(rows) {
    if (!rows.length) {
        const fallbackMessage = currentKeyword
            ? "Data tidak ditemukan untuk keyword tersebut."
            : "Belum ada data mahasiswa di database.";
        showEmptyState(fallbackMessage);
        tableBody.innerHTML = "";
        return;
    }

    hideEmptyState();

    tableBody.innerHTML = rows
        .map((row, index) => {
            return `
                <tr>
                    <td>${index + 1}</td>
                    <td>${escapeHtml(row.id)}</td>
                    <td>${escapeHtml(row.npm)}</td>
                    <td>${escapeHtml(row.nama)}</td>
                    <td>${escapeHtml(row.jurusan)}</td>
                </tr>
            `;
        })
        .join("");
}

function normalizeMahasiswaData(payload) {
    if (Array.isArray(payload)) {
        return payload;
    }

    if (payload && Array.isArray(payload.data)) {
        return payload.data;
    }

    return [];
}

async function parseResponse(response) {
    const rawText = await response.text();

    if (!rawText) {
        return null;
    }

    try {
        return JSON.parse(rawText);
    } catch (error) {
        return rawText;
    }
}

async function loadMahasiswa(keyword = "") {
    currentKeyword = keyword.trim();
    const isSearching = currentKeyword.length > 0;
    const endpoint = isSearching
        ? `api/search.php?keyword=${encodeURIComponent(currentKeyword)}`
        : "api/read.php";

    setTableLoading(true);

    try {
        const response = await fetch(endpoint, { method: "GET" });
        const result = await parseResponse(response);
        const rows = normalizeMahasiswaData(result);

        if (!response.ok && !rows.length) {
            const message = result && result.message ? result.message : "Gagal mengambil data mahasiswa.";
            renderTable([]);
            showEmptyState(message);
            if (isSearching) {
                showToast(message, "error");
            }
            return;
        }

        renderTable(rows);

        if (isSearching) {
            showToast(`Ditemukan ${rows.length} data mahasiswa.`, "success");
        }
    } catch (error) {
        renderTable([]);
        showEmptyState("Terjadi kesalahan jaringan saat mengambil data.");
        showToast("Gagal terhubung ke API.", "error");
    } finally {
        setTableLoading(false);
    }
}

function setRequestLoading(isLoading) {
    sendBtn.disabled = isLoading;
    requestLoading.classList.toggle("hidden", !isLoading);
}

function setResponseState(type, statusText) {
    responsePanel.classList.remove("neutral", "success", "error");
    statusBadge.classList.remove("neutral", "success", "error");

    responsePanel.classList.add(type);
    statusBadge.classList.add(type);
    statusBadge.textContent = `Status: ${statusText}`;
}

function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast ${type === "error" ? "error" : ""}`.trim();
    toast.textContent = message;
    toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add("show");
    });

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 200);
    }, 3000);
}

function getDefaultBodyByMethod(method) {
    if (method === "GET") {
        return '{\n  // GET tidak memerlukan body\n}';
    }

    if (method === "POST") {
        return '{\n  "npm": "247006111",\n  "nama": "Andi",\n  "jurusan": "Informatika"\n}';
    }

    if (method === "PUT") {
        return '{\n  "id": 1,\n  "npm": "247006111",\n  "nama": "Andi",\n  "jurusan": "Teknik Informatika"\n}';
    }

    if (method === "DELETE") {
        return '{\n  "id": 1\n}';
    }

    return "";
}

const previousDefaults = [
    '{\n  "npm": "230001",\n  "nama": "Budi",\n  "jurusan": "Informatika"\n}',
    '{\n  "id": 1,\n  "npm": "230001",\n  "nama": "Budi Update",\n  "jurusan": "Sistem Informasi"\n}',
    '{\n  "id": 1\n}'
];

methodSelect.addEventListener("change", () => {
    const method = methodSelect.value;
    const newBody = getDefaultBodyByMethod(method);
    const currentVal = jsonBody.value.trim();

    // Check if current value is empty or one of the defaults (ignoring whitespace)
    const allDefaults = [
        "", 
        ...previousDefaults,
        getDefaultBodyByMethod("GET").trim(),
        getDefaultBodyByMethod("POST").trim(),
        getDefaultBodyByMethod("PUT").trim(),
        getDefaultBodyByMethod("DELETE").trim()
    ];

    const isDefault = allDefaults.some(def => def.replace(/\s/g, "") === currentVal.replace(/\s/g, ""));

    if (isDefault) {
        jsonBody.value = newBody;
        
        // Trigger highlight animation
        jsonBody.classList.remove("highlight-anim");
        void jsonBody.offsetWidth; // Trigger reflow
        jsonBody.classList.add("highlight-anim");
    }
});

// Copy Button Logic
const copyBtn = document.getElementById("copyBtn");
if (copyBtn) {
    copyBtn.addEventListener("click", () => {
        const text = responseOutput.textContent;
        navigator.clipboard.writeText(text).then(() => {
            const originalIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
            
            // Visual feedback
            copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
            copyBtn.style.color = "var(--primary)";
            
            setTimeout(() => {
                copyBtn.innerHTML = originalIcon;
                copyBtn.style.color = "";
            }, 2000);
            
            showToast("Response disalin ke clipboard", "success");
        }).catch(err => {
            showToast("Gagal menyalin response", "error");
        });
    });
}

searchBtn.addEventListener("click", () => {
    loadMahasiswa(searchInput.value);
});

searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        loadMahasiswa(searchInput.value);
    }
});

refreshBtn.addEventListener("click", () => {
    searchInput.value = "";
    loadMahasiswa();
    showToast("Data mahasiswa telah diperbarui.", "success");
});

sendBtn.addEventListener("click", async () => {
    const method = methodSelect.value;
    const endpoint = endpointInput.value.trim() || "api/read.php";
    const bodyText = jsonBody.value.trim();

    const options = { method, headers: {} };

    if (method !== "GET") {
        options.headers["Content-Type"] = "application/json";

        if (bodyText) {
            try {
                const parsed = JSON.parse(bodyText);
                options.body = JSON.stringify(parsed);
            } catch (error) {
                setResponseState("error", "JSON Invalid");
                responseOutput.textContent = JSON.stringify(
                    { message: "Body JSON tidak valid. Periksa format JSON Anda." },
                    null,
                    2
                );
                showToast("JSON body tidak valid.", "error");
                return;
            }
        }
    }

    setRequestLoading(true);

    try {
        const response = await fetch(endpoint, options);
        const result = await parseResponse(response);
        const statusText = `${response.status} ${response.statusText}`;

        if (response.ok) {
            setResponseState("success", statusText);
            showToast("Request berhasil diproses.", "success");

            if (["POST", "PUT", "DELETE"].includes(method)) {
                loadMahasiswa(currentKeyword);
            }
        } else {
            setResponseState("error", statusText);
            showToast("Request gagal diproses.", "error");
        }

        if (typeof result === "string") {
            responseOutput.textContent = result;
        } else {
            responseOutput.textContent = JSON.stringify(
                result ?? { message: "Response kosong" },
                null,
                2
            );
        }
    } catch (error) {
        setResponseState("error", "Network Error");
        responseOutput.textContent = JSON.stringify(
            { message: "Gagal terhubung ke endpoint API." },
            null,
            2
        );
        showToast("Gagal terhubung ke endpoint.", "error");
    } finally {
        setRequestLoading(false);
    }
});

loadMahasiswa();
