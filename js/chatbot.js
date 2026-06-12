function detectIntent(message) {
    message = message.toLowerCase();

    if (
        message.includes("telat") || message.includes("terlambat")
    ) {
        return "LATE_PERIOD";
    }

    if (message.includes("pms")) {
        return "PMS";
    }

    if (message.includes("siklus")) {
        return "CYCLE";
    }

    if (message.includes("makan")) {
        return "REKOMENDASI_MAKANAN"
    }

    if (message.includes("olahraga")) {
        return "REKOMENDASI_OLAHRAGA"
    }

    if (message.includes("fase")) {
        return "PHASE";
    }

    return "UNKNOWN";
}

function generateResponse(intent, message) {
    // kalau sedang dalam percakapan (context aktif)
    if (context.activeFlow === "LATE_PERIOD") {
        return handleLatePeriod(message);
    }

    if (context.activeFlow === "REKOMENDASI_MAKANAN") {
        return handleRekomendasiMakanan(message);
    }

    if (context.activeFlow === "REKOMENDASI_OLAHRAGA") {
        return handleRekomendasiOlahraga(message);
    }

    switch (intent) {
        case "LATE_PERIOD": return handleLatePeriod(message);
        case "PMS":         return handlePMS();
        case "CYCLE":       return handleCycle();
        case "REKOMENDASI_MAKANAN": return handleRekomendasiMakanan(message);
        case "REKOMENDASI_OLAHRAGA": return handleRekomendasiOlahraga(message);
        case "PHASE":       return handlePhaseExplanation(message);
        default:            return handleUnknown();
    }
}

// ==== UI ====

function addMessage(text, type) {
    const box = document.getElementById("chat-box");
    const div = document.createElement("div");

    div.className = type;
    div.textContent = text;

    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
}

window.sendMessage = function () {
    const input = document.getElementById("user-input");

    const message = input.value.trim();
    if (!message) return;

    addMessage(message, "message user-message");

    const intent = detectIntent(message);
    const response = generateResponse(intent, message);

    setTimeout(() => {
        addMessage(response, "message bot-message");
    }, 400);

    input.value = "";
}

// allow enter key
document.getElementById("user-input")
.addEventListener("keypress", function(e) {
    if (e.key === "Enter") window.sendMessage();
});