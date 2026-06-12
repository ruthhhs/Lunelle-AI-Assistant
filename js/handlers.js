function handleGreeting() {
    return "Halo! Senang bertemu denganmu! Ada yang ingin kamu tanyakan tentang siklus menstruasi?";
}

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

function handleRekomendasiMakanan(message) {
    // STEP 1
    if (!context.step) {
        context.activeFlow = "REKOMENDASI_MAKANAN";
        context.step = "ASK_PHASE";
        return "Baik, aku akan membuatkan rekomendasi makanan yang sesuai untuk kamu. Sebelumnya, kamu sedang berada di fase apa? (menstruasi/folikular/ovulasi/luteal)";
    }

    // STEP 2
    if (context.step === "ASK_PHASE") {
        let text = message.toLowerCase();
        context.activeFlow = null;
        context.step = null;

        // MENSTRUASI
        if (
            text.includes("mens") ||
            text.includes("menstruasi")
        ) {
            return "Saat fase menstruasi, tubuh membutuhkan lebih banyak zat besi dan energi karena terjadi pengeluaran darah. Disarankan mengonsumsi makanan seperti bayam, telur, daging, ikan, pisang, dan dark chocolate untuk membantu mengurangi lemas serta nyeri haid. Minuman hangat seperti jahe atau kunyit juga dapat membantu meredakan kram.";
        }

        // FOLIKULAR
        if (
            text.includes("folikular") ||
            text.includes("setelah haid")
        ) {
            return "Pada fase folikular, energi tubuh biasanya mulai meningkat. Konsumsilah makanan segar dan bergizi seperti oatmeal, yogurt, buah-buahan, alpukat, tempe, tahu, dan ayam.";
        }

        // OVULASI
        if (text.includes("ovulasi")) {
            return "Saat fase ovulasi, tubuh memerlukan cukup cairan dan antioksidan. Disarankan mengonsumsi buah seperti semangka dan jeruk, sayuran segar, ikan, kacang-kacangan, serta memperbanyak air putih.";
        }

        // LUTEAL / PMS
        if (
            text.includes("pms") ||
            text.includes("luteal") ||
            text.includes("sebelum haid")
        ) {
            return "Pada fase luteal atau menjelang haid, biasanya muncul gejala PMS seperti mood swing dan craving. Disarankan mengonsumsi makanan kaya magnesium seperti pisang, oatmeal, ubi, almond, telur, dan dark chocolate.";
        }
        
        return "Fase tidak dikenali. Pilih menstruasi, folikular, ovulasi, atau luteal.";
    }
}

function handleRekomendasiOlahraga(message) {
    // STEP 1
    if (!context.step) {
        context.activeFlow = "REKOMENDASI_OLAHRAGA";
        context.step = "ASK_PHASE";
        return "Baik, aku akan membuatkan rekomendasi olahraga yang sesuai untuk kamu. Sebelumnya, kamu sedang berada di fase apa? (menstruasi/folikular/ovulasi/luteal)";
    }

    // STEP 2
    if (context.step === "ASK_PHASE") {
        let text = message.toLowerCase();
        context.activeFlow = null;
        context.step = null;

        // MENSTRUASI
        if (
            text.includes("mens") ||
            text.includes("menstruasi")
        ) {
            return "Pada fase menstruasi, disarankan melakukan olahraga ringan seperti jalan santai, stretching, yoga, atau pilates ringan untuk membantu mengurangi kram dan menjaga tubuh tetap rileks.";
        }

        // FOLIKULAR
        if (
            text.includes("folikular") ||
            text.includes("setelah haid")
        ) {
            return "Pada fase folikular, energi tubuh biasanya meningkat sehingga cocok untuk olahraga dengan intensitas sedang hingga tinggi seperti jogging, gym, bersepeda, atau latihan kekuatan.";
        }

        // OVULASI
        if (text.includes("ovulasi")) {
            return "Saat fase ovulasi, tubuh berada pada kondisi energi yang optimal. Kamu dapat melakukan olahraga intensitas tinggi seperti HIIT, lari, zumba, atau olahraga kompetitif lainnya.";
        }

        // LUTEAL / PMS
        if (
            text.includes("pms") ||
            text.includes("luteal") ||
            text.includes("sebelum haid")
        ) {
                return "Pada fase luteal atau menjelang haid, tubuh cenderung lebih mudah lelah. Disarankan melakukan olahraga ringan hingga sedang seperti yoga, stretching, jalan kaki, atau pilates untuk membantu menjaga mood dan mengurangi stres.";
            }
            
            return "Fase tidak dikenali. Pilih menstruasi, folikular, ovulasi, atau luteal.";
        }
}

function handlePhaseExplanation(message) {
    let text = message.toLowerCase();
    if (text.includes("folikular")) {
        return "Fase folikular adalah fase setelah menstruasi selesai, di mana tubuh mulai mempersiapkan ovulasi dan energi biasanya meningkat.";
    }
    
    if (text.includes("ovulasi")) {
        return "Fase ovulasi adalah fase ketika sel telur dilepaskan. Pada fase ini energi tubuh biasanya paling tinggi.";
    }
    
    if (text.includes("luteal")) {
        return "Fase luteal adalah fase setelah ovulasi dan sebelum menstruasi. Pada fase ini sering muncul gejala PMS.";
    }
    
    if (text.includes("menstruasi") || phase.includes("haid") ) {
        return "Fase menstruasi adalah fase keluarnya darah haid akibat peluruhan dinding rahim.";
    }
    
    return "Fase tidak dikenali.";
}

function handleUnknown() {
    return "Maaf, saya belum memahami pertanyaanmu.";
}