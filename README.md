# LUNELLE AI ASSISTANT

## DESKRIPSI

Lunelle AI Assistant adalah chatbot berbasis Artificial Intelligence (AI) yang berperan sebagai asisten percakapan privat bagi pengguna.

Chatbot ini dirancang untuk membantu pengguna memahami berbagai pertanyaan maupun keluhan seputar kesehatan reproduksi perempuan melalui interaksi berbasis teks. Sistem mampu memberikan respons yang informatif, relevan, serta disampaikan dengan pendekatan yang kontekstual dan empatik.

Aplikasi Lunelle ditujukan bagi perempuan yang telah mengalami menstruasi dalam siklus hidupnya.

## FITUR

### Interactive AI Chatbot

Chatbot memproses input pengguna dengan menganalisis maksud (intent) dari pertanyaan yang diberikan, kemudian menghasilkan respons yang informatif, relevan, dan disampaikan dengan gaya komunikasi yang empatik serta mudah dipahami.


## PROTOTYPE

Prototipe Lunelle AI Assistant dikembangkan dalam bentuk aplikasi web (web-based application) dengan pendekatan mobile-first sehingga dapat diakses dengan nyaman melalui perangkat seluler maupun desktop.

## ALUR KERJA SISTEM

```
Pengguna membuka fitur AI Assistant pada Aplikasi Lunnele
    |
    v
Pengguna mengirimkan pertanyaan terkait menstruasi, kesehatan reproduksi, atau rekomendasi kesehatan.
    |
    v
Sistem menerima dan menganalisis isi pertanyaan untuk mengidentifikasi topik yang dibahas.
    |
    v
AI memproses pertanyaan berdasarkan basis pengetahuan yang telah ditentukan.
    |
    v
Jika pertanyaan meminta saran atau rekomendasi, AI menyesuaikan jawaban dengan konteks yang diberikan pengguna pada pertanyaan.
    |
    v
Sistem menampilkan respons kepada pengguna melalui antarmuka chatbot.
```

## TECH STACK

Lunelle AI Assistant mengintegrasikan infrastruktur teknologi berikut:

- `HTML` dan `CSS` untuk membangun antarmuka pengguna (user interface).
- `JavaScript` sebagai bahasa pemrograman utama yang mengimplementasikan chatbot berbasis **rule-based system** dan **Natural Language Processing** (NLP) sederhana.
- `GitHub` sebagai repository pengembangan dan media hosting melalui GitHub Pages.

## STRUKTUR FOLDER

```
lunelle-ai-assistant/
│
├── chat.html
├── index.html
├── style.css
│
├── assets
│    └── logo.png
│
└── js
     ├── chatbot.js
     ├── context.js
     └── handlers.js
```

## DEPLOMENT KE GITHUB PAGE

Prototype Lunelle AI Assistant telah di-deploy menggunakan GitHub Pages dan dapat diakses melalui:

```
ruthhhs.github.io/Lunelle-AI-Assistant/
```

## BATASAN PROTOTYPE

1. Sistem yang dikembangkan berfokus pada chatbot berbasis teks dan tidak mencakup fitur komunikasi berbasis suara (voice assistant).
2. Chatbot hanya memberikan informasi dan edukasi seputar kesehatan reproduksi perempuan secara umum, bukan sebagai pengganti konsultasi medis profesional.
3. Pendekatan kecerdasan buatan yang digunakan terbatas pada rule-based system yang dikombinasikan dengan Natural Language Processing (NLP) sederhana.
4. Sistem tidak melakukan diagnosis medis atau penentuan kondisi kesehatan secara klinis.
5. Data dan respons chatbot bersifat terbatas pada knowledge base yang telah ditentukan dalam sistem.
6. Pengembangan sistem difokuskan pada aspek fungsional chatbot, tanpa mencakup integrasi dengan perangkat medis atau sistem kesehatan eksternal.
7. Pengembangan sistem masih terbatas pada satu bahasa saja, yaitu Bahasa Indonesia.