function detectIntent(message) {
    message = message.toLowerCase();

    if ((message.includes("halo") || message.includes("hai") || message.includes("hello") || message.includes("hey")) && (!message.includes("telat") && !message.includes("haid") && !message.includes("menstruasi"))) { return "GREETING"; }
    if (message === "oke" || message === "ok" || message === "baik" || message === "siap") { return "OK"; }
    if (message.includes("terima kasih") || message.includes("terimakasi") || message.includes("makasih") || message.includes("thanks")) { return "THANKS"; }
    if (message === "iya" || message === "ya" || message === "yap") { return "YES"; }
    if (message.includes("bantu") || message.includes("help") || message.includes("bisa apa") || message.includes("fitur")) { return "HELP"; }
    if (message.includes("telat") || message.includes("terlambat")) { return "LATE_PERIOD"; }
    if (message.includes("pms")) { return "PMS"; }
    if (message.includes("siklus")) { return "CYCLE"; }
    if (message.includes("makan")) { return "REKOMENDASI_MAKANAN"; }
    if (message.includes("olahraga")) { return "REKOMENDASI_OLAHRAGA"; }
    if (message.includes("fase")) { return "PHASE"; }
    if (message.includes("kram perut") || message.includes("keram perut") || message.includes("nyeri perut") || message.includes("sakit perut")) { return "CRAMPS_FLOW"; }
    if (message.includes("nutrisi")) { return "NUTRITION_PERIOD_FLOW"; }
    if (message.includes("mood swing") || message.includes("marah") || message.includes("sensi") || message.includes("bad mood")) { return "MOOD_SWINGS_FLOW"; }
    if (message.includes("mitos") || message.includes("bolehkah") || message.includes("bener gak")) { return "MYTH_CHECK_FLOW"; }
    if (message.includes("pusing") || message.includes("migrain") || message.includes("sakit kepala")) return "HEADACHE_FLOW";
    if (message.includes("kembung") || message.includes("begah") || message.includes("bloating")) return "BLOATING_FLOW";
    if (message.includes("ngidam") || message.includes("craving") || message.includes("pengen manis")) return "CRAVING_FLOW";
    if (message.includes("ovulasi") && (message.includes("apa")) || message.includes("masa subur")) return "INQUIRY_OVULATION_FLOW";
    if (message.includes("susah tidur") || message.includes("insomnia") || message.includes("gak bisa tidur")) return "SLEEP_PROBLEM_FLOW";
    if (message.includes("jerawat") || message.includes("beruntusan")) return "ACNE_FLOW";
    if (message.includes("keputihan") || message.includes("becek") || message.includes("flek")) return "DISCHARGE_FLOW";
    if (message.includes("lelah") || message.includes("capek") || message.includes("fatigue")) return "FATIGUE_FLOW";
    if (message.includes("berat badan") || message.includes("gemukan") || message.includes("naik berat")) return "WEIGHT_GAIN_FLOW";
    return "UNKNOWN";
}

function generateResponse(intent, message) {
    if (context.activeFlow === "GREETING") { return handleLatePeriod(message); }
    if (context.activeFlow === "LATE_PERIOD") { return handleLatePeriod(message); }
    if (context.activeFlow === "REKOMENDASI_MAKANAN") { return handleRekomendasiMakanan(message); }
    if (context.activeFlow === "REKOMENDASI_OLAHRAGA") { return handleRekomendasiOlahraga(message); }
    if (context.activeFlow === "CRAMPS_FLOW") return handleCramps(message);
    if (context.activeFlow === "NUTRITION_PERIOD_FLOW") return handleNutritionPeriod(message);
    if (context.activeFlow === "MOOD_SWINGS_FLOW") return handleMoodSwings(message);
    if (context.activeFlow === "MYTH_CHECK_FLOW") return handleMythCheck(message);
    if (context.activeFlow === "HEADACHE_FLOW") return handleHeadache(message);
    if (context.activeFlow === "BLOATING_FLOW") return handleBloating(message);
    if (context.activeFlow === "CRAVING_FLOW") return handleCraving(message);
    if (context.activeFlow === "INQUIRY_OVULATION_FLOW") return handleInquiryOvulation(message);
    if (context.activeFlow === "SLEEP_PROBLEM_FLOW") return handleSleepProblem(message);
    if (context.activeFlow === "ACNE_FLOW") return handleAcne(message);
    if (context.activeFlow === "DISCHARGE_FLOW") return handleDischarge(message);
    if (context.activeFlow === "FATIGUE_FLOW") return handleFatigue(message);
    if (context.activeFlow === "WEIGHT_GAIN_FLOW") return handleWeightGain(message);

    switch (intent) {
        case "GREETING": return handleGreeting(message);
        case "OK": return handleOK();
        case "THANKS": return handleThanks();
        case "YES": return handleYes();
        case "HELP": return handleHelp();
        case "LATE_PERIOD": return handleLatePeriod(message);
        case "PMS": return handlePMS();
        case "CYCLE": return handleCycle();
        case "REKOMENDASI_MAKANAN": return handleRekomendasiMakanan(message);
        case "REKOMENDASI_OLAHRAGA": return handleRekomendasiOlahraga(message);
        case "PHASE": return handlePhaseExplanation(message);
        case "CRAMPS_FLOW": return handleCramps(message);
        case "NUTRITION_PERIOD_FLOW": return handleNutritionPeriod(message);
        case "MOOD_SWINGS_FLOW": return handleMoodSwings(message);
        case "MYTH_CHECK_FLOW": return handleMythCheck(message);
        case "HEADACHE_FLOW": return handleHeadache(message);
        case "BLOATING_FLOW": return handleBloating(message);
        case "CRAVING_FLOW": return handleCraving(message);
        case "INQUIRY_OVULATION_FLOW": return handleInquiryOvulation(message);
        case "SLEEP_PROBLEM_FLOW": return handleSleepProblem(message);
        case "ACNE_FLOW": return handleAcne(message);
        case "DISCHARGE_FLOW": return handleDischarge(message);
        case "FATIGUE_FLOW": return handleFatigue(message);
        case "WEIGHT_GAIN_FLOW": return handleWeightGain(message);
        case "UNKNOWN": return handleUnknown();
    }
}

function addMessage(text, type) {
    const box = document.getElementById("chat-box");
    const div = document.createElement("div");

    div.className = type;
    div.textContent = text;
    div.style.whiteSpace = "pre-line";

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