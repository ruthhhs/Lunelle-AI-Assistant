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
        return "Keterlambatan cukup lama, sebaiknya dipantau atau konsultasi ke tenaga kesehatan ya!";
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
    if (!context.step) {
        context.activeFlow = "PHASE";
        context.step = "ASK_PHASE2";
        return "Ada 4 fase dalam siklus menstruasi, fase apa yang ingin kamu ketahui?";
    }

    if (context.step === "ASK_PHASE2") {
        let text = message.toLowerCase();
        context.activeFlow = null;
        context.step = null;

        if (text.includes("menstruasi")) {
            return "Fase menstruasi biasanya terjadi pada hari ke-1 hingga ke-5 siklus. Pada fase ini, lapisan dinding rahim (endometrium) yang tidak digunakan akan luruh dan keluar sebagai darah menstruasi.";
        }

        if (text.includes("folikular")) {
            return "Fase folikular berlangsung sejak hari pertama menstruasi hingga mendekati ovulasi, sekitar hari ke-1 hingga ke-14. Pada fase ini, tubuh mulai mempersiapkan pematangan sel telur di ovarium.";
        }
        
        if (text.includes("ovulasi")) {
            return "Ovulasi umumnya terjadi sekitar hari ke-14 pada siklus 28 hari. Pada fase ini, sel telur yang telah matang dilepaskan dari ovarium dan siap untuk dibuahi oleh sperma.";
        }
        
        if (text.includes("luteal")) {
            return "Fase luteal terjadi setelah ovulasi hingga menjelang menstruasi berikutnya, sekitar hari ke-15 hingga ke-28. Pada fase ini tubuh menghasilkan lebih banyak hormon progesteron untuk mempersiapkan kemungkinan kehamilan.";
        }
        
        return "Fase tidak dikenali.";
    }
}

function handleCramps(message) {
    // STEP 1: Inisialisasi Alur dan Tanya Tingkat Keparahan
    if (!context.step) {
        context.activeFlow = "CRAMPS_FLOW";
        context.step = "ASK_SEVERITY";
        return "Aduh, turut prihatin ya. Kalau boleh tahu, apakah nyeri kramnya sampai mengganggu aktivitasmu banget? (ya/tidak)";
    }

    // STEP 2: Evaluasi Jawaban dan Berikan Rekomendasi
    if (context.step === "ASK_SEVERITY") {
        let isSevere = (message.toLowerCase()).includes("ya");

        // Reset state setelah alur selesai
        context.activeFlow = null;
        context.step = null;
        if (isSevere) {
            return "Karena kramnya cukup hebat, sebaiknya kamu segera beristirahat total. Cobalah tempelkan kompres hangat di area perut bawah, minum teh jahe hangat, dan ambil posisi tidur menyamping (fetal position). Jika dalam 1-2 hari tidak membaik, disarankan konsultasi ke tenaga medis ya.";
        }
        return "Syukurlah kalau tidak terlalu mengganggu. Kamu bisa meredakannya secara alami dengan melakukan peregangan (stretching) ringan, minum air putih hangat yang cukup, dan menghindari kafein atau makanan terlalu asin untuk sementara waktu.";
    }
}

function handleMoodSwings(message) {
    // STEP 1: Validasi Fase Luteal & Tanya Opsi Relaksasi
    if (!context.step) {
        context.activeFlow = "MOOD_SWINGS_FLOW";
        context.step = "ASK_PREFERENCE";
        return "Aku paham banget, perasaan sensitif menjelang haid itu respons alami tubuh karena hormon progesteron sedang tinggi. Kamu lebih suka ditenangkan lewat aktivitas fisik ringan atau camilan? (fisik/camilan)";
    }

    // STEP 2: Berikan Solusi Berdasarkan Pilihan
    if (context.step === "ASK_PREFERENCE") {
        let msg = message.toLowerCase();
        
        let choiceFisik = msg.includes("fisik") || msg.includes("olahraga") || msg.includes("jalan");
        let choiceCamilan = msg.includes("camilan") || msg.includes("makan") || msg.includes("minum");

        if (!choiceFisik && !choiceCamilan) {
            return "Tolong pilih salah satu opsi yang kamu suka, fisik atau camilan?.";
        }

        context.activeFlow = null;
        context.step = null;
        context.data = {};

        if (choiceFisik) {
            return "Yuk, coba ambil napas dalam-dalam lalu hembuskan perlahan. Kamu bisa coba meditasi ringan selama 5 menit, jalan santai di sekitar rumah, atau mendengarkan musik yang menenangkan untuk memicu hormon endorfin.";
        }

        if (choiceCamilan) {
            return "Untuk bantu menstabilkan emosimu, kamu boleh mengonsumsi sedikit dark chocolate karena kandungannya terbukti bisa memicu hormon kebahagiaan. Batasi makanan yang terlalu tinggi gula rafinasi ya agar mood-mu tidak makin naik-turun.";
        }
    }
}

function handleHeadache(message) {
    // STEP 1: Inisialisasi Alur dan Tanya Kondisi Cairan
    if (!context.step) {
        context.activeFlow = "HEADACHE_FLOW";
        context.step = "ASK_HYDRATION";
        return "Aduh, pusing menjelang haid memang mengganggu banget akibat perubahan hormon estrogen. Hari ini kamu sudah minum cukup air putih belum? (sudah/belum)";
    }

    // STEP 2: Evaluasi Jawaban dan Berikan Solusi
    if (context.step === "ASK_HYDRATION") {
        let enoughWater = message.toLowerCase().includes("sudah");
        context.activeFlow = null;
        context.step = null;
        context.data = {};

        if (enoughWater) {
            return "Bagus kalau hidrasimu aman. Sekarang cobalah istirahat di ruangan yang redup/gelap, kurangi melihat layar gajet, dan pijat pelipis secara perlahan dengan minyak esensial jika ada. Semoga lekas membaik ya.";
        }

        return "Nah, bisa jadi pusingmu bertambah karena dehidrasi. Yuk, minum 1-2 gelas air putih hangat sekarang juga, lalu coba rebahan sejenak di tempat yang tenang dan hindari suara bising.";
    }
}

function handleBloating(message) {
    // STEP 1: Tanya Mengenai Konsumsi Garam/Asin
    if (!context.step) {
        context.activeFlow = "BLOATING_FLOW";
        context.step = "ASK_SALT_INTAKE";

        return "Perut kembung atau begah (*bloating*) itu normal akibat hormon progesteron yang menahan air di tubuh. Kemarin atau hari ini kamu ada makan makanan yang asin atau gurih banget enggak? (ya/tidak)";
    }

    // STEP 2: Berikan Edukasi dan Solusi Batasan Nutrisi
    if (context.step === "ASK_SALT_INTAKE") {
        let eatSalty = message.toLowerCase().includes("ya");

        context.activeFlow = null;
        context.step = null;
        context.data = {};

        if (eatSalty) {
            return "Pantas saja, kadar garam tinggi makin mengikat air di perutmu. Solusinya, perbanyak minum air putih hangat untuk membilas garamnya, dan hindari camilan gurih/junk food dulu untuk 1-2 hari ini ya.";
        }

        return "Kalau tidak makan asin, berarti ini murni pengaruh hormonal PMS. Kamu bisa meredakannya dengan minum teh pepermin atau jahe hangat, serta lakukan jalan kaki santai selama 10 menit untuk melancarkan gas di pencernaan.";
    }
}

function handleCraving(message) {
    // STEP 1: Tanya Apakah Ingin Alternatif Camilan Sehat
    if (!context.step) {
        context.activeFlow = "CRAVING_FLOW";
        context.step = "ASK_ALTERNATIVE";

        return "Wajar banget, menjelang haid tubuh kita emang otomatis mencari energi instan lewat makanan manis. Tapi kalau berlebihan bisa memperparah kram perut, lho. Mau aku kasih rekomendasi camilan manis yang aman buat haid? (mau/enggak)";
    }

    // STEP 2: Berikan Opsi Makanan Manis yang Sehat
    if (context.step === "ASK_ALTERNATIVE") {
        let wantAlt = message.toLowerCase().includes("mau") || message.toLowerCase().includes("boleh");

        context.activeFlow = null;
        context.step = null;
        context.data = {};

        if (wantAlt) {
            return "Rekomendasi manis yang aman: Kamu bisa makan dark chocolate (minimal 70% kakao) karena bisa naikin mood, atau buah manis alami seperti pisang dan alpukat yang kaya potasium buat cegah kram perut.";
        }

        return "Oke, kalau kamu tetap mau makan camilan manismu yang sekarang, silakan dinikmati ya! Tapi batasi porsinya jangan sampai berlebihan agar tidak memicu fluktuasi mood yang makin drastis.";
    }
}

function handleInquiryOvulation(message) {
    // STEP 1: Tanya Mengenai Gejala Keputihan
    if (!context.step) {
        context.activeFlow = "INQUIRY_OVULATION_FLOW";
        context.step = "ASK_DISCHARGE_TYPE";

        return "Fase ovulasi itu adalah masa suburmu. Cara paling mudah mengenalinya adalah lewat sinyal tubuh. Apakah hari ini kamu menyadari adanya keputihan yang teksturnya bening dan melar seperti putih telur mentah? (ya/tidak)";
    }

    // STEP 2: Konfirmasi Fase Berdasarkan Ciri Fisik
    if (context.step === "ASK_DISCHARGE_TYPE") {
        let clearDischarge = message.toLowerCase().includes("ya");

        context.activeFlow = null;
        context.step = null;
        context.data = {};

        if (clearDischarge) {
            return "Fix, itu sinyal kuat kalau tubuhmu sedang berada di fase ovulasi (masa subur)! Biasanya di fase ini energi, suasana hati, dan gairahmu lagi ada di titik tertinggi harian. Waktu yang pas buat olahraga intens atau produktif belajar.";
        }

        return "Kalau tidak ada, tandanya kamu mungkin belum masuk masa subur atau sudah lewat. Ciri ovulasi lainnya adalah suhu tubuh saat bangun tidur sedikit lebih hangat dan suasana hati terasa jauh lebih positif dari biasanya.";
    }
}

function handleSleepProblem(message) {
    // STEP 1: Tanya Apakah Alasan Susah Tidur Karena Nyeri Fisik
    if (!context.step) {
        context.activeFlow = "SLEEP_PROBLEM_FLOW";
        context.step = "ASK_PAIN_REASON";

        return "Aduh, susah tidur pas malam emang bikin kesel dan bikin imun drop. Boleh tahu, kamu susah tidur malam ini karena nahan sakit (seperti kram/pusing) atau murni karena pikiran gelisah? (sakit/gelisah)";
    }

    // STEP 2: Berikan Solusi Posisi Tidur atau Relaksasi
    if (context.step === "ASK_PAIN_REASON") {
        let msg = message.toLowerCase();
        let dueToPain = msg.includes("sakit") || msg.includes("kram") || msg.includes("nyeri");
        let dueToAnxiety = msg.includes("gelisah") || msg.includes("pikiran") || msg.includes("cemas");

        if (!dueToPain && !dueToAnxiety) {
            return "Tolong ketik 'sakit' jika karena nyeri fisik, atau 'gelisah' jika karena pikiran.";
        }

        context.activeFlow = null;
        context.step = null;
        context.data = {};

        if (dueToPain) {
            return "Untuk meredakan nyerinya biar cepat tidur, cobalah posisi tidur menyamping dengan menarik lutut ke arah dada (fetal position) untuk mengurangi tekanan rahim. Jangan lupa tempelkan kompres hangat di perut bawah ya.";
        }

        if (dueToAnxiety) {
            return "Kalau karena gelisah, matikan layar ponselmu sekarang. Jauhkan gajet, lakukan latihan pernapasan 4-7-8 (tarik napas 4 detik, tahan 7 detik, embuskan 8 detik) sebanyak 4 kali untuk menenangkan saraf otakmu. Selamat tidur!";
        }
    }
}

function handleAcne(message) {
    // STEP 1: Inisialisasi Alur dan Tanya Kebiasaan Menyentuh Wajah
    if (!context.step) {
        context.activeFlow = "ACNE_FLOW";
        context.step = "ASK_TOUCH_HABIT";
        return "Munculnya jerawat di fase luteal (menjelang haid) itu wajar banget karena produksi minyak wajah meningkat akibat hormon progesteron. Kalau boleh tahu, kamu sering enggak sengaja megang atau mendem jerawatnya enggak? (ya/tidak)";
    }

    // STEP 2: Evaluasi Jawaban dan Berikan Solusi Perawatan Wajah
    if (context.step === "ASK_TOUCH_HABIT") {
        let touchHabit = message.toLowerCase().includes("ya");

        context.activeFlow = null;
        context.step = null;
        context.data = {};

        if (touchHabit) {
            return "Waduh, stop dulu kebiasaan itu ya! Menyentuh atau memencet jerawat bisa memicu infeksi bakteri sekunder dan bikin bekasnya susah hilang. Solusinya, kompres jerawat dengan es batu dibungkus kain untuk kurangi radang, pakai acne patch, dan kurangi makanan berminyak.";
        }

        return "Bagus banget kalau tidak disentuh. Untuk mengatasinya, pastikan kamu tetap cuci muka 2 kali sehari dengan sabun yang lembut, gunakan pelembap berbahan dasar air (water-based), dan kurangi konsumsi produk olahan susu (dairy) sementara waktu.";
    }
}

function handleDischarge(message) {
    // STEP 1: Tanya Karakteristik Warna dan Bau Keputihan
    if (!context.step) {
        context.activeFlow = "DISCHARGE_FLOW";
        context.step = "ASK_DISCHARGE_DETAILS";
        return "Keputihan bisa jadi sinyal normal dari fase siklusmu, tapi bisa juga indikasi lain. Boleh tahu, apakah keputihanmu saat ini berbau menyengat, berwarna kehijauan/kekuningan, atau terasa gatal? (ya/tidak)";
    }

    // STEP 2: Klasifikasi Keputihan Normal vs Tidak Normal
    if (context.step === "ASK_DISCHARGE_DETAILS") {
        let isAbnormal = message.toLowerCase().includes("ya");

        context.activeFlow = null;
        context.step = null;
        context.data = {};

        if (isAbnormal) {
            return "Jika keputihan berwarna, berbau, atau gatal, kemungkinan terjadi infeksi jamur atau bakteri. Jaga agar area kewanitaan tetap kering, hindari sabun pembersih berpewangi, dan sangat disarankan untuk memeriksakannya ke dokter jika tidak kunjung membaik.";
        }

        return "Kalau warnanya bening/putih susu, tidak bau, dan tidak gatal, artinya keputihanmu normal. Ini biasanya terjadi karena lonjakan hormon estrogen menjelang masa subur (ovulasi) atau sebelum haid. Cukup ganti celana dalam lebih sering agar tetap kering.";
    }
}

function handleFatigue(message) {
    // STEP 1: Tanya Durasi Tidur Pengguna
    if (!context.step) {
        context.activeFlow = "FATIGUE_FLOW";
        context.step = "ASK_SLEEP_DURATION";
        return "Merasa lemas dan tidak bertenaga (fatigue) umum terjadi akibat penurunan hormon menjelang atau selama haid. Semalam kamu tidur berapa jam? (Sebutkan angkanya saja)";
    }

    // STEP 2: Evaluasi Pola Tidur dan Berikan Rekomendasi Energi
    if (context.step === "ASK_SLEEP_DURATION") {
        let num = message.match(/\d+/);

        if (!num) return "Tolong masukkan angka durasi tidurmu (misal: 5 atau 8).";

        let hours = parseInt(num[0]);

        context.activeFlow = null;
        context.step = null;
        context.data = {};

        if (hours < 7) {
            return `Tidurmu hanya ${hours} jam, pantas saja tubuh makin lemas di tengah fluktuasi hormon ini. Usahakan tidur minimal 7-8 jam malam ini. Untuk mendongkrak energimu siang ini, coba lakukan *power nap* selama 15-20 menit dan batasi minum kopi agar tidak *crash*.`;
        }

        return `Tidurmu sudah cukup (${hours} jam), jadi lemas ini murni karena pengaruh metabolisme tubuh yang melambat di fase ini. Rekomendasiku, coba konsumsi makanan tinggi protein, ngemil kacang-kacangan, dan lakukan jalan kaki santai 10 menit untuk memicu aliran oksigen ke otak.`;
    }
}

function handleWeightGain(message) {
    // STEP 1: Edukasi Awal dan Tanya Mengenai Pola BAB
    if (!context.step) {
        context.activeFlow = "WEIGHT_GAIN_FLOW";
        context.step = "ASK_BOWEL_MOVEMENT";

        return "Merasa timbangan naik atau badan 'bengkak' saat PMS itu hal yang sangat umum akibat retensi air oleh hormon progesteron. Tenang, ini bukan lemak kok. Omong-omong, beberapa hari ini pencernaanmu lancar enggak, atau lagi sembelit? (lancar/sembelit)";
    }

    // STEP 2: Berikan Solusi Pencernaan dan Retensi Air
    if (context.step === "ASK_BOWEL_MOVEMENT") {
        let isConstipated = message.toLowerCase().includes("sembelit") || message.toLowerCase().includes("susah bab");

        context.activeFlow = null;
        context.step = null;
        context.data = {};

        if (isConstipated) {
            return "Nah, sembelit akibat hormon PMS juga bikin perut makin begah dan berat badan terkesan naik. Solusinya, perbanyak makan makanan berserat tinggi (buah pepaya/sayur), minum air hangat yang banyak, dan hindari menahan buang air besar.";
        }

        return "Kalau BAB lancar, berarti kenaikan ini murni retensi air sementara (water weight). Berat badanmu akan kembali normal dengan sendirinya 1-2 hari setelah menstruasi dimulai. Batasi makanan asin agar tubuh tidak makin mengikat air ya!";
    }
}


function handleUnknown() {
    return "Maaf, saya belum memahami pertanyaanmu.";
}