function handleLatePeriod(message) {
    // STEP 1
    if (!context.step) {
        context.activeFlow = "LATE_PERIOD";
        context.step = "ASK_DAYS";

        return "Sudah berapa hari keterlambatannya?";
    }

    // STEP 2
    if (context.step === "ASK_DAYS") {

        let num = message.match(/\d+/);

        if (!num) return "Tolong masukkan jumlah hari.";

        context.data.days = parseInt(num[0]);
        context.step = "ASK_STRESS";

        return "Apakah akhir-akhir ini kamu stres? (ya/tidak)";
    }

    // STEP 3
    if (context.step === "ASK_STRESS") {

        let stress = message.toLowerCase().includes("ya");
        let days = context.data.days;

        context.activeFlow = null;
        context.step = null;
        context.data = {};

        if (days <= 7) {
            return "Keterlambatan masih tergolong normal dan bisa dipengaruhi stres atau aktivitas.";
        }

        return "Keterlambatan cukup lama, sebaiknya dipantau atau konsultasi ke tenaga kesehatan.";
    }
}

function handlePMS() {
    return "PMS adalah gejala sebelum menstruasi seperti mood swing, kram, dan lelah.";
}

function handleCycle() {
    return "Siklus normal menstruasi adalah 21-35 hari.";
}

function handleUnknown() {
    return "Maaf, saya belum memahami pertanyaanmu.";
}