// ── Utilitas ─────────────────────────────────────────────────

function extractNumber(message) {
    const match = message.match(/\d+/);
    return match ? parseInt(match[0]) : null;
}

function normalizePhase(text) {
    if (text.includes("mens") || text.includes("menstruasi") || text.includes("haid")) return "menstruasi";
    if (text.includes("folikular") || text.includes("setelah haid")) return "folikular";
    if (text.includes("ovulasi") || text.includes("masa subur")) return "ovulasi";
    if (text.includes("luteal") || text.includes("pms") || text.includes("sebelum haid")) return "luteal";
    return null;
}

function isYes(text) {
    return /\b(ya|iya|yep|yup|betul|bener|mau|boleh|ok|oke)\b/.test(text);
}

function isNo(text) {
    return /\b(tidak|enggak|engga|gak|ga|nope|nggak|gakk|tidakk)\b/.test(text);
}

// ── LATE PERIOD ───────────────────────────────────────────────
function handleLatePeriod(message) {
    if (!context.step) {
        context.startFlow("LATE_PERIOD");
        context.step = "ASK_DAYS";
        return "Oke, aku bantu cek ya  Haid kamu sudah telat berapa hari?";
    }

    if (context.step === "ASK_DAYS") {
        const days = extractNumber(message);
        if (!days) return "Tolong sebutkan angkanya ya, misal: 5 hari atau 10 hari.";
        context.data.days = days;
        context.step = "ASK_STRESS";
        return `Oke, ${days} hari ya. Akhir-akhir ini kamu lagi banyak stres, kurang tidur, atau berolahraga berlebihan enggak? (ya / tidak)`;
    }

    if (context.step === "ASK_STRESS") {
        const msg = message.toLowerCase();
        const stress = isYes(msg);
        const days = context.data.days;
        context.endFlow();

        if (days <= 7 && stress) {
            return `Keterlambatan ${days} hari masih tergolong wajar. Stres dan kurang istirahat memang bisa menggeser jadwal haid karena memengaruhi hormon. Coba relaksasi dulu dan pantau beberapa hari ke depan ya.`;
        }
        if (days <= 7 && !stress) {
            return `Keterlambatan ${days} hari biasanya masih normal karena siklus bisa sedikit bergeser tiap bulannya. Pantau saja dulu sampai hari ke-7. Kalau masih belum datang, baru mulai waspada ya.`;
        }
        if (days > 7 && stress) {
            return `Keterlambatan ${days} hari cukup panjang. Meski bisa karena stres, sebaiknya kamu tes kehamilan terlebih dahulu ya. Kalau hasilnya negatif dan haid tetap belum datang, konsultasi ke dokter atau bidan untuk memastikan kondisi hormonmu.`;
        }
        return `Keterlambatan ${days} hari perlu diwaspadai. Sebaiknya segera lakukan tes kehamilan dan kalau hasilnya negatif, konsultasikan ke tenaga kesehatan ya. Bisa jadi ada gangguan hormonal yang perlu ditangani lebih lanjut`;
    }
}

// ── PMS ───────────────────────────────────────────────────────
function handlePMS() {
    return `PMS (Premenstrual Syndrome) adalah kumpulan gejala fisik dan emosional yang muncul 1-2 minggu sebelum haid, dan biasanya hilang begitu haid dimulai.
\n
Gejala umum PMS meliputi:
• Mood swing, gampang marah, atau lebih sensitif
• Kram perut bagian bawah
• Tubuh terasa lelah dan lemas
• Perut kembung atau terasa penuh
• Sakit kepala/pusing
• Susah tidur
• Ngidam makanan manis
\n
Semua ini disebabkan oleh fluktuasi hormon estrogen dan progesteron. Ada gejala spesifik yang mau kamu tanyakan lebih lanjut?`;
}

// ── CYCLE ─────────────────────────────────────────────────────
function handleCycle(message) {
    if (!context.step) {
        context.startFlow("CYCLE");
        context.step = "ASK_CYCLE_DETAIL";
        return "Tentu! Siklus menstruasi normal berlangsung antara 21-35 hari, dengan rata-rata 28 hari. Mau aku bantu hitung prediksi siklus kamu, atau ingin tahu info seputar siklus secara umum? (hitung / info)";
    }

    if (context.step === "ASK_CYCLE_DETAIL") {
        const msg = message.toLowerCase();
        if (msg.includes("hitung") || msg.includes("prediksi")) {
            context.step = "ASK_LAST_PERIOD";
            return "Oke, kapan tanggal pertama haid terakhir kamu? (misal: 1 Juni atau 5 Mei)";
        }
        context.endFlow();
        return `Berikut info umum siklus menstruasi:\n\n • Durasi siklus normal: 21-35 hari\n • Durasi haid normal: 3-7 hari\n • Volume darah normal: 30-80 ml per siklus\n\nSiklus bisa berubah karena stres, perubahan berat badan, obat-obatan, atau kondisi kesehatan tertentu. Kalau siklusmu sangat tidak teratur atau di luar rentang normal, ada baiknya dikonsultasikan ke dokter ya `;
    }

    if (context.step === "ASK_LAST_PERIOD") {
        context.data.lastPeriod = message.trim();
        context.step = "ASK_CYCLE_LENGTH";
        return "Berapa hari biasanya jarak antara haid satu ke haid berikutnya? (misal: 28 hari)";
    }

    if (context.step === "ASK_CYCLE_LENGTH") {
        const days = extractNumber(message);
        if (!days || days < 15 || days > 60) return "Tolong masukkan panjang siklus yang valid (15-60 hari), misal: 28.";
        context.data.cycleLength = days;
        context.updateProfile("cycleLength", days);
        context.endFlow();
        return `Oke! Jika haid terakhirmu mulai tanggal ${context.data.lastPeriod} dan siklusmu ${days} hari, maka perkiraan haid berikutnya adalah sekitar ${days} hari setelah tanggal itu ya. Tandai di kalendermu agar tidak kaget!`;
    }
}

// ── REKOMENDASI MAKANAN ───────────────────────────────────────
function handleRekomendasiMakanan(message) {
    if (!context.step) {
        context.startFlow("REKOMENDASI_MAKANAN");
        context.step = "ASK_PHASE";

        // Gunakan fase yang sudah diketahui jika ada
        if (context.userProfile.knownPhase) {
            context.step = "PROCESS_PHASE";
            context.data.phase = context.userProfile.knownPhase;
            return `Berdasarkan info sebelumnya, kamu sedang di fase ${context.userProfile.knownPhase}. Aku buatkan rekomendasinya ya! Atau kamu mau pilih fase lain? (lanjut / ganti)`;
        }

        return "Oke, aku bantu rekomendasikan makanan yang cocok! Kamu sekarang sedang di fase apa?\n\n • Menstruasi\n • Folikular (setelah haid)\n • Ovulasi (masa subur)\n • Luteal / PMS (sebelum haid)";
    }

    if (context.step === "PROCESS_PHASE" || context.step === "ASK_PHASE") {
        const msg = message.toLowerCase();

        // Cek jika user memilih ganti fase
        if (msg.includes("ganti")) {
            context.step = "ASK_PHASE";
            return "Oke, kamu sekarang di fase apa?\n\n • Menstruasi\n • Folikular\n • Ovulasi\n • Luteal";
        }

        let phase = normalizePhase(msg);
        if (!phase && context.data.phase) phase = context.data.phase; // resume dari profile

        if (!phase) return "Hmm, aku belum nangkep fasenya. Pilih salah satu ya: menstruasi, folikular, ovulasi, atau luteal.";

        context.updateProfile("knownPhase", phase);
        context.endFlow();

        const recs = {
            menstruasi: ` Fase Menstruasi — tubuh butuh banyak zat besi dan energi karena darah keluar.\n\n✅ Disarankan:\n• Bayam, brokoli, kale (tinggi zat besi)\n• Daging merah tanpa lemak, ikan, telur\n• Dark chocolate & pisang (meredakan kram)\n• Teh jahe / kunyit hangat (anti-inflamasi alami)\n\n❌ Hindari sementara:\n• Kafein berlebihan (memperparah kram)\n• Makanan asin & berminyak`,

            folikular: ` Fase Folikular — energi mulai bangkit, tubuh siap menerima nutrisi optimal!\n\n✅ Disarankan:\n• Oatmeal, yogurt, buah-buahan segar\n• Alpukat, tempe, tahu, ayam\n• Kacang-kacangan dan biji-bijian\n\n❌ Hindari:\n• Makanan ultra-proses / junk food`,

            ovulasi: ` Fase Ovulasi — masa subur! Tubuh butuh antioksidan dan cairan yang cukup.\n\n✅ Disarankan:\n• Semangka, jeruk, beri-berian (antioksidan tinggi)\n• Ikan salmon, tuna (omega-3)\n• Sayuran hijau segar & kacang-kacangan\n• Perbanyak air putih minimal 8 gelas!\n\n❌ Hindari:\n• Alkohol & minuman bersoda`,

            luteal: ` Fase Luteal / PMS — hormon naik turun, butuh makanan yang stabilkan suasana hati!\n\n✅ Disarankan:\n• Pisang & alpukat (kaya magnesium & kalium)\n• Oatmeal, ubi, almond\n• Dark chocolate minimal 70% kakao\n• Teh chamomile (meredakan kecemasan)\n\n❌ Hindari:\n• Gula rafinasi berlebihan (bikin mood makin fluktuatif)\n• Kafein tinggi`
        };

        return recs[phase];
    }
}

// ── REKOMENDASI OLAHRAGA ──────────────────────────────────────
function handleRekomendasiOlahraga(message) {
    if (!context.step) {
        context.startFlow("REKOMENDASI_OLAHRAGA");
        context.step = "ASK_PHASE";

        if (context.userProfile.knownPhase) {
            context.step = "PROCESS_PHASE";
            context.data.phase = context.userProfile.knownPhase;
            return `Berdasarkan info sebelumnya, kamu di fase ${context.userProfile.knownPhase}. Langsung aku kasih rekomendasinya? (lanjut / ganti)`;
        }

        return "Oke, aku rekomendasikan olahraga yang paling cocok! Kamu sekarang di fase apa?\n\n • Menstruasi\n • Folikular\n • Ovulasi\n • Luteal";
    }

    if (context.step === "PROCESS_PHASE" || context.step === "ASK_PHASE") {
        const msg = message.toLowerCase();

        if (msg.includes("ganti")) {
            context.step = "ASK_PHASE";
            return "Oke, pilih fasenya: menstruasi, folikular, ovulasi, atau luteal?";
        }

        let phase = normalizePhase(msg);
        if (!phase && context.data.phase) phase = context.data.phase;
        if (!phase) return "Belum nangkep fasenya. Pilih ya: menstruasi, folikular, ovulasi, atau luteal.";

        context.updateProfile("knownPhase", phase);
        context.endFlow();

        const recs = {
            menstruasi: ` Fase Menstruasi — dengarkan tubuhmu, jangan paksakan diri!\n\n✅ Olahraga yang cocok:\n• Jalan santai 15-20 menit\n• Yoga & stretching (pose child's pose, cat-cow)\n• Pilates ringan\n• Berenang santai\n\n❌ Hindari: HIIT, angkat beban berat, lari jarak jauh`,

            folikular: ` Fase Folikular — energi mulai meningkat, saatnya gerak lebih aktif!\n\n✅ Olahraga yang cocok:\n• Jogging & lari ringan\n• Gym & latihan kekuatan\n• Bersepeda\n• Zumba / dance cardio\n\n Fase terbaik untuk mulai program latihan baru!`,

            ovulasi: ` Fase Ovulasi — puncak energi! Push yourself!\n\n✅ Olahraga yang cocok:\n• HIIT (High Intensity Interval Training)\n• Lari & sprint\n• Olahraga kompetitif (futsal, badminton, tenis)\n• CrossFit / functional training\n\n Performa fisik ada di titik terbaiknya sekarang!`,

            luteal: ` Fase Luteal / PMS — tubuh mulai lelah, olahraga untuk menjaga mood!\n\n✅ Olahraga yang cocok:\n• Yoga & meditasi gerak\n• Stretching pagi/malam\n• Jalan kaki 20-30 menit\n• Pilates\n• Renang santai\n\n❌ Hindari: olahraga sangat intens yang bisa memperparah kelelahan`
        };

        return recs[phase];
    }
}

// ── PENJELASAN FASE ───────────────────────────────────────────
function handlePhaseExplanation(message) {
    if (!context.step) {
        context.startFlow("PHASE");
        context.step = "ASK_PHASE2";
        return "Siklus menstruasi terdiri dari 4 fase yang masing-masing punya peran unik. Fase mana yang ingin kamu pelajari?\n\n • Menstruasi\n • Folikular\n • Ovulasi\n • Luteal";
    }

    if (context.step === "ASK_PHASE2") {
        const phase = normalizePhase(message.toLowerCase());
        context.endFlow();

        const explanations = {
            menstruasi: ` Fase Menstruasi (Hari 15)\n\nIni adalah awal siklus baru. Lapisan dinding rahim (endometrium) yang tidak dipakai luruh dan keluar sebagai darah haid. Hormon estrogen dan progesteron berada di titik terendah, makanya wajar kalau kamu merasa lemas atau tidak bertenaga. Durasi normal: 3-7 hari.`,

            folikular: ` Fase Folikular (Hari 1-13)\n\nBerlangsung bersamaan dengan menstruasi hingga mendekati ovulasi. Otak mengirim sinyal ke ovarium untuk mempersiapkan sel telur matang. Hormon estrogen mulai naik, memberikanmu energi lebih, mood membaik, dan kulit terasa lebih cerah. Waktu terbaik untuk produktif!`,

            ovulasi: ` Fase Ovulasi (sekitar Hari 14)\n\nSel telur matang dilepaskan dari ovarium — ini adalah masa suburmu. Lonjakan hormon LH menyebabkan ovulasi. Kamu mungkin merasakan sedikit nyeri di salah satu sisi perut (mittelschmerz) dan keputihan bertekstur seperti putih telur mentah. Fase ini biasanya hanya berlangsung 12-24 jam.`,

            luteal: ` Fase Luteal (Hari 15-28)\n\nSetelah ovulasi, folikel bekas sel telur berubah menjadi korpus luteum yang memproduksi progesteron. Tubuh mempersiapkan diri untuk kemungkinan kehamilan. Jika tidak terjadi pembuahan, hormon turun drastis — inilah yang memicu gejala PMS seperti mood swing, kembung, dan kram.`
        };

        if (!phase || !explanations[phase]) return "Hmm, belum nangkep. Pilih ya: menstruasi, folikular, ovulasi, atau luteal.";
        return explanations[phase];
    }
}

// ── KRAM PERUT ────────────────────────────────────────────────
function handleCramps(message) {
    if (!context.step) {
        context.startFlow("CRAMPS_FLOW");
        context.step = "ASK_SEVERITY";
        return "Aduh, kram memang menyiksa banget 😣 Apakah kramnya sampai mengganggu aktivitas harianmu, seperti susah berdiri atau konsentrasi? (ya / tidak)";
    }

    if (context.step === "ASK_SEVERITY") {
        const isSevere = isYes(message.toLowerCase());
        context.step = "ASK_DURATION";
        context.data.severe = isSevere;

        if (isSevere) {
            return "Oke, kramnya lumayan parah ya. Sudah berapa hari ini berlangsung?";
        }
        return "Syukurlah masih bisa ditoleransi. Kira-kira sudah berapa hari kramnya?";
    }

    if (context.step === "ASK_DURATION") {
        const days = extractNumber(message) || 1;
        context.data.days = days;
        const severe = context.data.severe;
        context.endFlow();

        if (severe && days >= 3) {
            return `Kram parah selama ${days} hari berturut-turut perlu perhatian lebih ya. Selain kompres hangat dan istirahat, pertimbangkan konsultasi ke dokter — bisa jadi ada kondisi seperti dismenore sekunder atau endometriosis yang perlu diperiksa \n\nSementara itu: posisi tidur fetal (menyamping memeluk lutut) dan teh jahe hangat bisa membantu meringankan.`;
        }

        if (severe) {
            return `Untuk meredakan kram yang cukup hebat ini:\n\n Kompres hangat di perut bawah selama 15-20 menit\n Posisi tidur fetal (menyamping + peluk lutut)\n Minum teh jahe atau kunyit hangat\n Jalan santai ringan jika memungkinkan (endorfin membantu!)\n\nHindari kafein dan makanan asin untuk sementara ya.`;
        }

        return `Untuk kram yang masih bisa ditoleransi, ini tipsnya:\n\n Lakukan stretching ringan seperti cat-cow pose\n Minum air putih hangat yang cukup\n Teh chamomile atau jahe hangat bisa membantu\n Jalan kaki santai 10-15 menit\n Kompres hangat kalau sewaktu-waktu makin tidak nyaman`;
    }
}

// ── MOOD SWING ────────────────────────────────────────────────
function handleMoodSwings(message) {
    if (!context.step) {
        context.startFlow("MOOD_SWINGS_FLOW");
        context.step = "ASK_PREFERENCE";
        return `Aku ngerti banget perasaan itu. Mood swing menjelang haid adalah respons alami tubuh akibat hormon progesteron yang sedang tinggi.\n\nKamu lebih suka dibantu lewat:\n • Aktivitas fisik / gerak\n • Rekomendasi camilan\n • Tips menstabilkan emosi`;
    }

    if (context.step === "ASK_PREFERENCE") {
        const msg = message.toLowerCase();
        context.endFlow();

        if (msg.includes("fisik") || msg.includes("gerak") || msg.includes("olahraga")) {
            return `✅ Aktivitas fisik terbukti ampuh menstabilkan mood lewat hormon endorfin!\n\n • Jalan santai 15-20 menit di luar ruangan\n • Meditasi + pernapasan dalam 5 menit\n • Dengarkan musik favorit sambil joget santai\n • Yoga pose: child's pose, butterfly pose\n\nBahkan sekadar berdiri dan meregangkan tubuh sudah membantu lho!`;
        }

        if (msg.includes("camilan") || msg.includes("makan")) {
            return ` Camilan yang bisa bantu stabilkan mood PMS:\n\n• Dark chocolate ≥70% kakao → memicu serotonin (hormon bahagia)\n• Pisang → kaya magnesium dan vitamin B6\n• Kacang almond → omega-3 dan magnesium\n• Teh chamomile hangat → menenangkan sistem saraf\n\n❌ Hindari: gula rafinasi tinggi, makanan ultra-proses, dan kafein berlebihan — justru bikin mood makin naik-turun!`;
        }

        if (msg.includes("tips") || msg.includes("emosi") || msg.includes("stabil")) {
            return ` Tips menstabilkan emosi saat PMS:\n\n • Validasi perasaanmu — apa yang kamu rasakan itu nyata dan valid, bukan lebay\n • Jurnal perasaan — tulis apa yang mengganggu pikiranmu\n • Batasi scrolling medsos — konten negatif memperburuk mood\n • Komunikasikan ke orang terdekat bahwa kamu sedang PMS\n • Tidur cukup — kurang tidur memperparah semua gejala PMS\n\nKamu tidak sendirian, dan ini akan berlalu! `;
        }

        return "Boleh pilih salah satu ya: fisik, camilan, atau tips menstabilkan emosi?";
    }
}

// ── SAKIT KEPALA ──────────────────────────────────────────────
function handleHeadache(message) {
    if (!context.step) {
        context.startFlow("HEADACHE_FLOW");
        context.step = "ASK_TYPE";
        return "Pusing/sakit kepala saat siklus memang mengganggu banget 😣 Sakitnya lebih ke mana — berdenyut di satu sisi seperti migrain, atau pegal di seluruh kepala? (migrain / pegal)";
    }

    if (context.step === "ASK_TYPE") {
        const msg = message.toLowerCase();
        context.data.headacheType = msg.includes("migrain") || msg.includes("denyut") ? "migrain" : "pegal";
        context.step = "ASK_HYDRATION";
        return "Oke. Hari ini kamu sudah minum air putih yang cukup belum, kira-kira? (sudah / belum)";
    }

    if (context.step === "ASK_HYDRATION") {
        const hydrated = isYes(message.toLowerCase()) || message.toLowerCase().includes("sudah");
        const type = context.data.headacheType;
        context.endFlow();

        if (type === "migrain" && !hydrated) {
            return `Dehidrasi + perubahan hormon estrogen adalah duo paling sering bikin migrain menjelang haid.\n\n Langkah segera:\n• Minum 2 gelas air putih sekarang\n• Beristirahat di ruangan gelap dan tenang\n• Kompres dingin di dahi atau tengkuk\n• Pijat pelipis dan titik antara jempol dan telunjuk\n• Hindari layar ponsel/laptop`;
        }

        if (type === "migrain" && hydrated) {
            return `Kalau hidrasi sudah oke, migrain ini kemungkinan murni hormonal (estrogen drop menjelang haid).\n\n Coba ini:\n• Istirahat di ruangan redup/gelap\n• Kompres dingin di dahi\n• Pijat titik tekanan di pelipis dan tengkuk\n• Hindari kafein dan suara bising\n• Kalau tidak membaik dalam 24 jam, boleh konsultasi ke dokter`;
        }

        if (!hydrated) {
            return `Kemungkinan besar kepala pegalmu diperparah dehidrasi ya!\n\n • Minum 1-2 gelas air putih hangat sekarang\n • Lakukan peregangan leher dan bahu\n • Kompres hangat di tengkuk\n😴 Istirahat sebentar sambil matikan notifikasi ponsel`;
        }

        return `Sakit kepala pegal saat siklus biasanya dari ketegangan otot akibat hormon.\n\n • Regangkan leher: miring kanan-kiri perlahan\n • Pijat bahu dan tengkuk\n • Kompres hangat di area leher\n😴 Usahakan rebahan 20-30 menit\n • Teh jahe hangat juga bisa membantu!`;
    }
}

// ── KEMBUNG ───────────────────────────────────────────────────
function handleBloating(message) {
    if (!context.step) {
        context.startFlow("BLOATING_FLOW");
        context.step = "ASK_SALT_INTAKE";
        return "Perut kembung atau begah saat PMS itu nyata banget ya 😮‍💨 Kemarin-kemarin kamu banyak makan makanan asin, gurih, atau junk food enggak? (ya / tidak)";
    }

    if (context.step === "ASK_SALT_INTAKE") {
        const eatSalty = isYes(message.toLowerCase());
        context.step = "ASK_WATER_INTAKE";
        context.data.salty = eatSalty;
        return "Oke. Minum air putih kamu hari ini sudah cukup belum, kira-kira 8 gelas? (sudah / belum)";
    }

    if (context.step === "ASK_WATER_INTAKE") {
        const hydrated = isYes(message.toLowerCase()) || message.toLowerCase().includes("sudah");
        const salty = context.data.salty;
        context.endFlow();

        if (salty && !hydrated) {
            return `Waduh, kombinasi banyak makan asin + kurang minum air adalah penyebab utama kembung parah saat PMS!\n\n • Perbanyak minum air putih hangat sekarang (bukan dingin!)\n • Stop sementara: keripik, mie instan, makanan kemasan\n • Minum teh pepermin atau jahe untuk bantu deflate perut\n • Jalan kaki santai 10 menit untuk melancarkan gas`;
        }

        if (salty) {
            return `Banyak asupan garam jadi penyebab utamanya. Garam mengikat air dan bikin perut makin bengkak.\n\n • Hindari makanan asin/gurih selama 1-2 hari\n • Teh pepermin hangat sangat membantu\n • Makan sayuran diuretik alami: timun, seledri, asparagus\n • Gerakan ringan bantu melancarkan gas`;
        }

        return `Kalau bukan karena makanan asin, ini pengaruh murni hormonal — progesteron menahan cairan di tubuhmu.\n\n✅ Ini akan berlalu dengan sendirinya setelah haid datang.\n • Sementara ini: teh chamomile atau pepermin hangat\n • Jalan kaki ringan 10-15 menit\n • Posisi knee-to-chest saat rebahan membantu keluarkan gas\n • Tetap minum air yang cukup meski terasa kembung`;
    }
}

// ── NGIDAM / CRAVING ──────────────────────────────────────────
function handleCraving(message) {
    if (!context.step) {
        context.startFlow("CRAVING_FLOW");
        context.step = "ASK_TYPE";
        return "Ngidam itu nyata dan ada alasan ilmiahnya!  Menjelang haid, tubuh kita butuh energi lebih karena metabolisme sedang tinggi.\n\nKamu lagi ngidam apa nih — yang manis, yang asin/gurih, atau yang pedas? (manis / asin / pedas)";
    }

    if (context.step === "ASK_TYPE") {
        const msg = message.toLowerCase();
        context.data.cravingType = msg.includes("manis") ? "manis" : msg.includes("asin") || msg.includes("gurih") ? "asin" : "pedas";
        context.step = "ASK_ALTERNATIVE";
        return `Wajar banget ngidam ${context.data.cravingType}! Mau aku kasih alternatif yang lebih aman untuk dikonsumsi saat haid? (mau / enggak)`;
    }

    if (context.step === "ASK_ALTERNATIVE") {
        const wantAlt = isYes(message.toLowerCase());
        const type = context.data.cravingType;
        context.endFlow();

        if (!wantAlt) {
            return "Oke santai aja! Nikmati saja camilanmu, asal jangan berlebihan ya. Tubuhmu sedang butuh sedikit reward! ";
        }

        const recs = {
            manis: ` Alternatif ngidam manis yang aman saat haid:\n\n• Dark chocolate ≥70% — memicu serotonin & mengurangi kram\n• Pisang — manis alami + kaya magnesium untuk cegah kram\n• Kurma — manis, kaya zat besi, tinggi serat\n• Ubi rebus/panggang — mengenyangkan dan memuaskan ngidam manis\n• Smoothie buah tanpa tambahan gula\n\n❌ Hindari: permen, minuman boba full sugar, kue cream`,

            asin: ` Alternatif ngidam asin/gurih yang lebih aman:\n\n• Kacang edamame rebus — gurih alami + kaya protein\n• Popcorn plain — tanpa mentega dan garam berlebihan\n• Keripik sayur (kale chips, beetroot chips)\n• Hummus + wortel/timun\n\n❌ Hindari: keripik kemasan, mie instan, makanan bernatrium tinggi (bikin makin kembung!)`,

            pedas: ` Ngidam pedas saat haid memang bikin dilema!\n\nSebenarnya pedas ringan masih oke. Tapi hati-hati:\n Makanan pedas berlebihan bisa mengiritasi lambung dan memperparah kram perut\n\n✅ Kalau tetap mau pedas:\n• Pilih sambal segar homemade daripada saus kemasan\n• Makan dengan nasi/protein yang cukup agar tidak kosong\n• Siapkan minuman hangat untuk menetralisir\n• Batasi level kepedasan`
        };

        return recs[type] || recs["manis"];
    }
}

// ── OVULASI ───────────────────────────────────────────────────
function handleInquiryOvulation(message) {
    if (!context.step) {
        context.startFlow("INQUIRY_OVULATION_FLOW");
        context.step = "ASK_GOAL";
        return `Masa subur alias ovulasi itu penting banget untuk dipahami! \n\nKamu mau tahu tentang apa?\n Penjelasan umum tentang ovulasi\n Cara mengenali tanda-tanda masa subur\n Cara menghitung prediksi masa suburmu`;
    }

    if (context.step === "ASK_GOAL") {
        const msg = message.toLowerCase();
        
        if (msg.includes("tanda") || msg.includes("kenali") || msg.includes("ciri")) {
            context.step = "ASK_DISCHARGE_TYPE";
            return "Oke, yuk kita cek tanda-tandanya. Apakah kamu merasakan keputihan yang bening dan melar seperti putih telur mentah belakangan ini? (ya / tidak)";
        }

        if (msg.includes("hitung") || msg.includes("prediksi") || msg.includes("kalender")) {
            context.step = "ASK_CYCLE_FOR_OVU";
            return "Untuk menghitung perkiraan masa subur, berapa hari siklus menstruasimu biasanya? (misal: 28 hari)";
        }

        context.endFlow();
        return ` Ovulasi adalah proses pelepasan sel telur matang dari ovarium, dan ini adalah masa suburmu.\n\n Kapan terjadi?\nPada siklus 28 hari, ovulasi biasanya sekitar hari ke-14. Rumusnya: hari pertama haid + (panjang siklus ÷ 2)\n\n Tanda-tanda ovulasi:\n• Keputihan bening & melar (seperti putih telur)\n• Suhu tubuh basal sedikit naik\n• Nyeri ringan di sisi perut (mittelschmerz)\n• Libido cenderung meningkat\n• Energi dan mood berada di puncaknya\n\n Masa subur berlangsung singkat: sekitar 12-24 jam setelah ovulasi terjadi.`;
    }

    if (context.step === "ASK_DISCHARGE_TYPE") {
        const clearDischarge = isYes(message.toLowerCase());
        context.endFlow();

        if (clearDischarge) {
            return `✅ Itu tanda kuat kamu sedang di masa subur!\n\nTanda-tanda lain yang mungkin kamu rasakan:\n• Energi dan mood di titik tertinggi\n• Suhu tubuh sedikit lebih hangat dari biasanya\n• Libido meningkat\n\nMasa subur berlangsung singkat, sekitar 1-2 hari. Manfaatkan energi ekstra ini untuk produktivitas atau olahraga intens! `;
        }

        return `Kalau tidak ada keputihan seperti itu, kemungkinan kamu belum masuk atau sudah melewati masa subur.\n\n Tanda ovulasi lainnya yang bisa dipantau:\n•  Suhu basal tubuh sedikit naik (ukur tiap pagi sebelum bangun)\n•  Mood jauh lebih positif dari biasanya\n• Energi meningkat tiba-tiba\n• Sedikit nyeri di sisi kiri/kanan perut bawah`;
    }

    if (context.step === "ASK_CYCLE_FOR_OVU") {
        const days = extractNumber(message);
        if (!days) return "Tolong sebutkan angkanya ya, misal: 28 hari.";
        context.endFlow();
        const ovuDay = Math.round(days / 2);
        return ` Dengan siklus ${days} hari, perkiraan ovulasimu terjadi sekitar hari ke-${ovuDay} dari hari pertama haid terakhir.\n\nMasa subur optimal: hari ke-${ovuDay - 2} hingga ke-${ovuDay + 1}\n\n Untuk akurasi lebih baik, pantau juga suhu basal tubuh dan perubahan keputihanmu setiap hari ya!`;
    }
}

// ── SUSAH TIDUR ───────────────────────────────────────────────
function handleSleepProblem(message) {
    if (!context.step) {
        context.startFlow("SLEEP_PROBLEM_FLOW");
        context.step = "ASK_PAIN_REASON";
        return "Susah tidur saat siklus itu menyiksa banget dan bisa bikin semua gejala lain terasa lebih berat 😔\n\nKira-kira penyebab utamanya lebih ke: nahan nyeri fisik (kram/pusing), atau pikiran gelisah/cemas? (sakit / gelisah)";
    }

    if (context.step === "ASK_PAIN_REASON") {
        const msg = message.toLowerCase();
        const dueToPain = msg.includes("sakit") || msg.includes("kram") || msg.includes("nyeri");
        const dueToAnxiety = msg.includes("gelisah") || msg.includes("pikiran") || msg.includes("cemas") || msg.includes("stres");

        if (!dueToPain && !dueToAnxiety) {
            return "Ketik 'sakit' kalau karena nyeri fisik, atau 'gelisah' kalau karena pikiran yang tidak bisa berhenti ya.";
        }

        context.step = "ASK_CAFFEINE";
        context.data.reason = dueToPain ? "pain" : "anxiety";
        return "Oke. Sore atau malam ini kamu minum kopi, teh kental, atau minuman bersoda enggak? (ya / tidak)";
    }

    if (context.step === "ASK_CAFFEINE") {
        const hadCaffeine = isYes(message.toLowerCase());
        const reason = context.data.reason;
        context.endFlow();

        const caffeineNote = hadCaffeine
            ? "\n\n Kafein bisa memperparah susah tidur — hindari setelah jam 2 siang ke depannya ya."
            : "";

        if (reason === "pain") {
            return `Untuk bisa tidur meski ada nyeri:\n\n Posisi tidur fetal (menyamping + tarik lutut ke dada) — mengurangi tekanan rahim\n Kompres hangat di perut bawah\n Napas dalam perlahan untuk bantu distraksi nyeri\n🎵 Putar white noise atau musik lembut${caffeineNote}`;
        }

        return `Untuk menenangkan pikiran yang gelisah:\n\n Jauhkan ponsel sekarang — notifikasi itu musuh tidur\n Teknik napas 4-7-8: tarik 4 detik → tahan 7 detik → embuskan 8 detik. Ulangi 4 kali\n Tulis semua yang ada di pikiran ke buku/notes dulu untuk "menutup tab otak"\n Jaga suhu kamar sejuk dan gelap${caffeineNote}\n\nSelamat istirahat `;
    }
}

// ── JERAWAT ───────────────────────────────────────────────────
function handleAcne(message) {
    if (!context.step) {
        context.startFlow("ACNE_FLOW");
        context.step = "ASK_LOCATION";
        return "Jerawat hormonal menjelang haid itu nyata dan sangat umum! 😤 Biasanya muncul di mana — dagu/rahang, pipi, atau dahi? (dagu / pipi / dahi)";
    }

    if (context.step === "ASK_LOCATION") {
        const msg = message.toLowerCase();
        context.data.location = msg.includes("dagu") || msg.includes("rahang") ? "dagu" : msg.includes("pipi") ? "pipi" : "dahi";
        context.step = "ASK_TOUCH_HABIT";
        return "Oke. Kamu sering tidak sengaja megang-megang atau mencet jerawatnya? (ya / tidak)";
    }

    if (context.step === "ASK_TOUCH_HABIT") {
        const touchHabit = isYes(message.toLowerCase());
        const location = context.data.location;
        context.endFlow();

        const locationNote = location === "dagu"
            ? "\n Jerawat di dagu/rahang adalah tanda klasik hormonal — paling umum muncul menjelang haid."
            : location === "pipi"
            ? "\n Jerawat di pipi bisa dari kombinasi hormonal + kontak bantal/tangan."
            : "\n Jerawat di dahi sering berkaitan dengan stres dan rambut berminyak yang menyentuh wajah.";

        if (touchHabit) {
            return ` Stop mencet sekarang ya! Aku paham godaannya luar biasa, tapi ini bisa memperparah infeksi dan bikin bekas susah hilang.${locationNote}\n\n✅ Yang bisa dilakukan:\n• Kompres es batu (bungkus kain) selama 1-2 menit untuk kurangi radang\n• Tempelkan acne patch semalaman\n• Cuci muka 2x sehari dengan sabun lembut non-comedogenic\n• Kurangi susu dan makanan berminyak sementara waktu`;
        }

        return `Bagus sekali, itu kebiasaan yang benar!${locationNote}\n\n✅ Tips mengelola jerawat hormonal:\n• Cuci muka 2x sehari, jangan lebih (over-washing bikin kulit makin produksi minyak)\n• Pakai pelembap water-based, jangan skip ini!\n• Kurangi produk dairy (susu, keju) — ada hubungannya dengan jerawat hormonal\n• Ganti sarung bantal lebih sering\n• Jerawat ini biasanya membaik sendiri setelah haid dimulai `;
    }
}

// ── KEPUTIHAN ─────────────────────────────────────────────────
function handleDischarge(message) {
    if (!context.step) {
        context.startFlow("DISCHARGE_FLOW");
        context.step = "ASK_DISCHARGE_DETAILS";
        return "Keputihan bisa jadi sinyal penting dari tubuhmu. Boleh aku tanya dulu — keputihannya berbau menyengat/tidak sedap, berwarna kuning/hijau/abu-abu, atau terasa gatal/perih? (ya / tidak)";
    }

    if (context.step === "ASK_DISCHARGE_DETAILS") {
        const isAbnormal = isYes(message.toLowerCase());
        context.step = "ASK_DISCHARGE_TEXTURE";
        context.data.abnormal = isAbnormal;

        if (isAbnormal) {
            return "Hmm, ada beberapa tanda yang perlu diperhatikan ya. Keputihannya lebih ke encer berair, kental seperti keju/cottage cheese, atau berbusa? (encer / kental / berbusa)";
        }
        return "Bagus, tidak ada tanda alarm. Sekarang tekstur keputihannya lebih ke encer/berair, kental/lengket, atau melar seperti putih telur? (encer / kental / melar)";
    }

    if (context.step === "ASK_DISCHARGE_TEXTURE") {
        const msg = message.toLowerCase();
        const abnormal = context.data.abnormal;
        context.endFlow();

        if (abnormal) {
            if (msg.includes("kental") || msg.includes("keju")) {
                return `Keputihan kental seperti cottage cheese yang disertai gatal kemungkinan adalah infeksi jamur (Candida).\n\n Ini umum terjadi menjelang haid karena perubahan pH vagina.\n\n✅ Yang bisa dilakukan:\n• Jaga area kewanitaan tetap kering dan bersih\n• Pakai celana dalam katun, hindari yang ketat\n• Hindari sabun berpewangi di area tersebut\n• Konsultasi ke dokter/apoteker untuk antijamur yang tepat `;
            }
            if (msg.includes("berbusa")) {
                return `Keputihan berbusa disertai bau tidak sedap bisa menjadi tanda trikomoniasis (infeksi parasit) yang perlu penanganan medis.\n\n Sangat disarankan untuk periksa ke dokter ya. Kondisi ini bisa diobati dengan antibiotik yang tepat.`;
            }
            return `Dengan ciri-ciri yang kamu sebutkan, sebaiknya periksakan ke dokter atau klinik untuk diagnosis yang tepat ya. Jangan khawatir, sebagian besar infeksi vagina bisa ditangani dengan mudah jika ditangani lebih awal `;
        }

        if (msg.includes("melar") || msg.includes("putih telur")) {
            return `Keputihan bening melar seperti putih telur adalah tanda masa subur/ovulasi yang normal! ✅\n\nIni adalah lendir serviks yang diproduksi untuk memudahkan sperma bergerak. Artinya kamu sedang atau mendekati masa subur. Tidak perlu khawatir sama sekali.`;
        }

        if (msg.includes("kental")) {
            return `Keputihan putih kental tanpa bau dan gatal adalah hal yang sangat normal \n\nBiasanya muncul menjelang haid (fase luteal) karena progesteron meningkat. Cukup:\n• Ganti celana dalam lebih sering agar tetap kering\n• Gunakan pantyliner jika merasa tidak nyaman\n• Hindari sabun berpewangi di area kewanitaan`;
        }

        return `Keputihan encer/berair bening itu normal, terutama saat ovulasi atau saat tubuh merespons estrogen yang meningkat.\n\n✅ Ini tanda tubuhmu bekerja dengan baik. Tetap jaga kebersihan area kewanitaan dan ganti pakaian dalam secara rutin.`;
    }
}

// ── KELELAHAN / FATIGUE ───────────────────────────────────────
function handleFatigue(message) {
    if (!context.step) {
        context.startFlow("FATIGUE_FLOW");
        context.step = "ASK_SLEEP_DURATION";
        return "Rasa lemas dan tidak bertenaga saat siklus haid itu sangat umum dan ada alasan hormonalnya  Semalam kamu tidur berapa jam?";
    }

    if (context.step === "ASK_SLEEP_DURATION") {
        const hours = extractNumber(message);
        if (!hours) return "Tolong sebutkan angkanya ya, misal: 6 atau 8.";
        context.data.sleepHours = hours;
        context.step = "ASK_IRON";
        return `Tidur ${hours} jam ya. Belakangan ini kamu makan cukup rutin tidak? Khususnya makanan yang mengandung zat besi seperti daging, telur, atau sayuran hijau? (ya / tidak)`;
    }

    if (context.step === "ASK_IRON") {
        const goodDiet = isYes(message.toLowerCase());
        const hours = context.data.sleepHours;
        context.endFlow();

        const sleepNote = hours < 7
            ? `\n\n😴 Tidurmu hanya ${hours} jam — kurang dari kebutuhan ideal 7-9 jam. Usahakan tidur lebih awal malam ini ya.`
            : `\n\n✅ Durasi tidurmu (${hours} jam) sudah oke.`;

        if (!goodDiet) {
            return `Asupan zat besi yang kurang, ditambah darah yang keluar saat haid, bisa menyebabkan rasa lelah ekstra yang cukup signifikan.\n\n Prioritas hari ini:\n• Makan makanan kaya zat besi: bayam, hati ayam, daging merah, telur\n• Konsumsi vitamin C bersamaan (jeruk, tomat) untuk membantu penyerapan zat besi\n• Minum air putih yang cukup${sleepNote}\n\n Untuk booster energi cepat: kurma + kacang almond adalah snack yang luar biasa!`;
        }

        return `Diet sudah oke! Kelelahanmu ini kemungkinan besar murni dari fluktuasi hormonal yang memperlambat metabolisme.${sleepNote}\n\n Tips mendongkrak energi:\n• Power nap 15-20 menit (set alarm agar tidak kelebihan)\n• Jalan kaki ringan 10 menit — paradoksnya, bergerak justru bikin lebih berenergi\n• Makan camilan protein: kacang almond, telur rebus, yogurt\n• Batasi kafein — crash energi setelahnya bikin makin lemas`;
    }
}

// ── KENAIKAN BERAT BADAN ──────────────────────────────────────
function handleWeightGain(message) {
    if (!context.step) {
        context.startFlow("WEIGHT_GAIN_FLOW");
        context.step = "ASK_TIMING";
        return "Perasaan 'bengkak' atau timbangan naik saat PMS itu sangat umum  Kamu mulai merasakan ini berapa hari sebelum haid biasanya, atau sekarang sedang di hari ke berapa siklus?";
    }

    if (context.step === "ASK_TIMING") {
        context.step = "ASK_BOWEL_MOVEMENT";
        return "Oke. Beberapa hari ini pencernaanmu lancar atau lagi sembelit? (lancar / sembelit)";
    }

    if (context.step === "ASK_BOWEL_MOVEMENT") {
        const isConstipated = message.toLowerCase().includes("sembelit") || message.toLowerCase().includes("susah bab") || message.toLowerCase().includes("tidak lancar");
        context.step = "ASK_SALT";
        context.data.constipated = isConstipated;
        return isConstipated
            ? "Hmm, sembelit memang bikin perut makin berat. Makan sayur/buah berserat tinggi hari ini sudah cukup? (ya / tidak)"
            : "Pencernaan lancar berarti kenaikannya murni retensi air hormonal. Hari ini banyak makan makanan asin atau bernatrium tinggi enggak? (ya / tidak)";
    }

    if (context.step === "ASK_SALT") {
        const highSalt = isYes(message.toLowerCase());
        const constipated = context.data.constipated;
        context.endFlow();

        if (constipated && !highSalt) {
            return `Sembelit akibat progesteron PMS bikin perut terasa makin penuh dan berat 😩\n\n✅ Solusinya:\n• Perbanyak serat: pepaya, pisang, ubi, brokoli\n• Minum air hangat saat bangun tidur (sebelum makan)\n• Jalan kaki pagi bisa sangat membantu\n• Hindari menahan BAB\n\n Berat badan akan turun natural setelah konstipasi teratasi dan haid mulai!`;
        }

        if (highSalt) {
            return `Makanan tinggi garam + efek hormonal = kombinasi maksimal untuk retensi air!\n\n Stop dulu:\n• Mie instan, keripik, makanan kemasan bernatrium tinggi\n• Kecap dan saus dalam jumlah besar\n\n✅ Bantu tubuh buang kelebihan air:\n• Minum banyak air putih (paradoks: makin banyak minum, makin cepat tubuh melepas retensi air)\n• Makan diuretik alami: timun, semangka, seledri, asparagus\n\n Berat badan biasanya kembali normal 1-2 hari setelah haid dimulai!`;
        }

        return `Tenang, ini bukan lemak baru! Ini adalah water weight alias retensi cairan yang normal akibat hormon progesteron.\n\n Fakta menarik: berat badan bisa naik 1-3 kg saat PMS hanya karena retensi air!\n\n✅ Yang bisa dilakukan:\n• Batasi makanan asin\n• Tetap minum air putih yang cukup\n• Olahraga ringan membantu melancarkan cairan\n\n Berat badanmu akan kembali normal secara otomatis 1-2 hari setelah haid mulai `;
    }
}

// ── NUTRISI SAAT HAID ─────────────────────────────────────────
function handleNutritionPeriod(message) {
    if (!context.step) {
        context.startFlow("NUTRITION_PERIOD_FLOW");
        context.step = "ASK_CONCERN";
        return "Nutrisi yang tepat saat haid bisa membantu mengurangi berbagai gejala lho! Kamu lebih khawatir soal apa saat ini — anemia/lemas, kram, atau mood swing? (anemia / kram / mood)";
    }

    if (context.step === "ASK_CONCERN") {
        const msg = message.toLowerCase();
        context.endFlow();

        if (msg.includes("anemia") || msg.includes("lemas") || msg.includes("pusing")) {
            return ` Nutrisi Anti-Anemia saat Haid:\n\n✅ Prioritas:\n• Bayam, kangkung, brokoli (zat besi non-heme)\n• Daging merah tanpa lemak, hati ayam, ikan (zat besi heme)\n• Telur & tempe\n• Penting: konsumsi vitamin C bersamaan (jeruk, tomat) untuk meningkatkan penyerapan zat besi 2-3x lipat!\n\n❌ Hindari bersamaan dengan sumber zat besi:\n• Teh dan kopi (tanin menghambat penyerapan)\n• Susu dalam jumlah besar`;
        }

        if (msg.includes("kram")) {
            return ` Nutrisi Anti-Kram saat Haid:\n\n✅ Tinggi magnesium & anti-inflamasi:\n• Dark chocolate ≥70%, pisang, alpukat, kacang almond\n• Ikan salmon, sarden (omega-3 — anti-inflamasi alami)\n• Jahe segar (terbukti setara ibuprofen dosis rendah dalam studi!)\n• Kunyit (curcumin — anti-inflamasi kuat)\n\n❌ Hindari:\n• Kafein berlebihan\n• Makanan tinggi garam dan lemak trans`;
        }

        if (msg.includes("mood")) {
            return `😊 Nutrisi Penstabil Mood saat PMS:\n\n✅ Fokus pada serotonin & dopamin booster:\n• Dark chocolate ≥70% (feniletelamina → rasa bahagia)\n• Pisang & alpukat (vitamin B6 → produksi serotonin)\n• Oatmeal (karbohidrat kompleks → stabil gula darah = stabil mood)\n• Kacang-kacangan (magnesium → relaksasi sistem saraf)\n\n❌ Hindari:\n• Gula rafinasi (spike dan crash gula darah bikin mood semakin fluktuatif)\n• Alkohol`;
        }

        return "Belum nangkep ya. Mau info nutrisi untuk: anemia/lemas, kram, atau mood swing?";
    }
}

// ── UNKNOWN ───────────────────────────────────────────────────
function handleUnknown() {
    const suggestions = [
        "Maaf, aku belum nangkep maksudnya 😅 Kamu bisa tanya soal:\n\n",
        "• Siklus & telat haid",
        "• Gejala PMS (kram, mood swing, kembung, pusing, lelah, jerawat, susah tidur)",
        "• Rekomendasi makanan & olahraga per fase siklus",
        "• Penjelasan fase menstruasi",
        "• Masa subur & ovulasi",
        "• Keputihan & perubahan tubuh lainnya",
        "",
        "Coba tulis ulang pertanyaanmu ya! "
    ];
    return suggestions.join("\n");
}