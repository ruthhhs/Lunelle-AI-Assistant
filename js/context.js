// ============================================================
//  LUNELLE – Context Manager
//  Mendukung multi-konteks, interrupt & resume,
//  riwayat percakapan, dan deteksi konteks global.
// ============================================================

const context = {
    // Flow yang sedang aktif saat ini
    activeFlow: null,
    step: null,
    data: {},

    // Stack flow sebelumnya (untuk resume jika diinterrupt)
    flowStack: [],

    // Riwayat semua percakapan [{role, text, flow, timestamp}]
    history: [],

    // Cache info user yang diketahui dari percakapan (fase, siklus, dll)
    userProfile: {
        knownPhase: null,     // "menstruasi" | "folikular" | "ovulasi" | "luteal"
        cycleLength: null,    // angka hari
        lastMentionedSymptom: null,
    },

    // ── Simpan pesan ke riwayat ──────────────────────────────
    addHistory(role, text, flow = null) {
        this.history.push({
            role,           // "user" | "bot"
            text,
            flow,
            timestamp: Date.now(),
        });
        // Batasi riwayat agar tidak tumbuh tak terbatas
        if (this.history.length > 100) this.history.shift();
    },

    // ── Mulai flow baru (interrupt otomatis jika ada yang aktif) ─
    startFlow(flowName) {
        // Jika ada flow aktif, simpan ke stack sebelum diganti
        if (this.activeFlow && this.activeFlow !== flowName) {
            this.flowStack.push({
                flow: this.activeFlow,
                step: this.step,
                data: { ...this.data },
            });
        }
        this.activeFlow = flowName;
        this.step = null;
        this.data = {};
    },

    // ── Selesaikan flow aktif ────────────────────────────────
    endFlow() {
        const prev = this.flowStack.pop();
        if (prev) {
            // Ada flow sebelumnya di stack — resume
            this.activeFlow = prev.flow;
            this.step = prev.step;
            this.data = prev.data;
        } else {
            this.activeFlow = null;
            this.step = null;
            this.data = {};
        }
    },

    // ── Reset total ──────────────────────────────────────────
    reset() {
        this.activeFlow = null;
        this.step = null;
        this.data = {};
        this.flowStack = [];
    },

    // ── Update profil user dari percakapan ───────────────────
    updateProfile(key, value) {
        if (key in this.userProfile) {
            this.userProfile[key] = value;
        }
    },

    // ── Cek apakah ada flow aktif ────────────────────────────
    get isInFlow() {
        return !!this.activeFlow;
    },
};