function detectIntent(message) {
    message = message.toLowerCase();
    if (
        message.includes("halo") ||
        message.includes("hai") ||
        message.includes("hello") ||
        message.includes("hey")

    ) {
        return "GREETING";
    }
    if (
        message === "oke" ||
        message === "ok" ||
        message === "baik" ||
        message === "siap"
    ) {
        return "OK";
    }

    if (
        message.includes("terima kasih") ||
        message.includes("terimakasi") ||
        message.includes("makasih") ||
        message.includes("thanks")
    ) {
        return "THANKS";
    }

    if (
        message === "iya" ||
        message === "ya" ||
        message === "yap"
    ) {
        return "YES";
    }

        // HELP
    if (
        message.includes("bantu") ||
        message.includes("help") ||
        message.includes("bisa apa") ||
        message.includes("fitur")
    ) {
        return "HELP";
    }

    // BOT_IDENTITY
    if (
        message.includes("siapa kamu") ||
        message.includes("kamu siapa") ||
        message.includes("namamu siapa") ||
        message.includes("apa itu lunelle")
    ) {
        return "BOT_IDENTITY";
    }

    // HOW_ARE_YOU
    if (
        message.includes("apa kabar") ||
        message.includes("gimana kabar") ||
        message.includes("bagaimana kabarmu")
    ) {
        return "HOW_ARE_YOU";
    }

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
    if (context.activeFlow === "GREETING") {
        return handleLatePeriod(message);
    }
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
        case "GREETING":    return handleGreeting(message);
        case "LATE_PERIOD": return handleLatePeriod(message);
        case "PMS":         return handlePMS();
        case "CYCLE":       return handleCycle();
        case "REKOMENDASI_MAKANAN": return handleRekomendasiMakanan(message);
        case "REKOMENDASI_OLAHRAGA": return handleRekomendasiOlahraga(message);
        case "PHASE":       return handlePhaseExplanation(message);
        case "OK": return handleOK();
        case "THANKS": return handleThanks();
        case "YES": return handleYes();
        case "HELP":return handleHelp();
        case "BOT_IDENTITY":return handleBotIdentity();
        case "HOW_ARE_YOU": return handleHowAreYou();
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

    addMessage(message, "user-message");

    const intent = detectIntent(message);
    const response = generateResponse(intent, message);

    setTimeout(() => {
        addMessage(response, "bot-message");
    }, 400);

    input.value = "";
}

// allow enter key
document.getElementById("user-input")
.addEventListener("keypress", function(e) {
    if (e.key === "Enter") window.sendMessage();
});