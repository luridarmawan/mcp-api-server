# Antara MCP dan API

Model Context Protocol (MCP) adalah pendekatan atau protokol komunikasi yang dirancang khusus untuk memungkinkan model bahasa besar (LLM) seperti ChatGPT berinteraksi secara kontekstual dan terus-menerus dengan sistem eksternal—baik API, database, atau aplikasi nyata. Mari kita bahas cara kerjanya dan perbedaannya dengan API biasa:


## Cara Kerja MCP (Model Context Protocol)

MCP bekerja dengan mengelola dan mempertahankan konteks interaksi antara LLM dan dunia luar. Komponen intinya biasanya meliputi:

1. Model Context Registry

   Tempat untuk menyimpan informasi yang dapat digunakan oleh LLM, misalnya:
    - API schema (OpenAPI)
    - Metadata (nama, deskripsi, batasan penggunaan)
    - State atau history aplikasi

2. Model Context Agent (MCA)

   Sebuah middleware/agent yang bertanggung jawab mengelola komunikasi dua arah antara:
   - LLM (misalnya ChatGPT, Claude, atau Gemini)
   - Layanan atau API eksternal

3. Interaction Loop

   LLM tidak hanya memanggil endpoint API secara stateless, tapi akan:
   - Memahami dokumentasi API secara otomatis
   - Menjaga konteks penggunaan sebelumnya
   - Bisa membuat keputusan cerdas tentang pemanggilan API, interpretasi data, dan tindak lanjut
   - Menggabungkan data dari banyak sumber


Model Context Protocol (MCP) adalah metode **de facto** standar untuk membuat API server bisa dikenali, dipanggil, dan dieksekusi oleh **agent** dan **LLM** berbasis fungsi JSON.

## 🔁 Perbedaan dengan API Biasa

| Fitur | API Biasa | Model Context Protocol (MCP) |
|---|---|---|
| **Konteks** | Stateless | State-aware / Contextual |
| **Interaksi** | Manual oleh developer | Otomatis via LLM |
| **Pemahaman API** | Harus diprogramkan | LLM belajar dari dokumentasi/schema |
| **Chaining multiple APIs** | Harus dibuat logika manual | Bisa chaining otomatis oleh LLM |
| **Fleksibilitas Natural Language** | Terbatas | Bisa langsung pakai perintah bahasa alami |
| **Tujuan utama** | Akses data/fungsi spesifik | Meningkatkan kapabilitas LLM dalam bertindak |


## 🧠 Contoh Penggunaan MCP

Misalnya punya aplikasi yang:
- Mendeteksi lokasi perangkat Android
- Menyimpan data ke Firestore
- Bisa dikontrol jarak jauh

Jika menggunakan MCP, LLM bisa:
- Paham struktur Firestore dan koleksinya
- Mengetahui cara memanggil fungsi lockDevice() atau ringDevice()
- Melakukan query data sebelumnya
- Mengambil keputusan seperti: "Apakah perangkat sudah bergerak dari lokasi terakhir? Jika iya, kirim perintah kunci."


## 🧠 Arsitektur MCP dengan Beberapa Sumber

Contoh arsitektur MCP yang menggunakan beberapa plugin dan internal API.

```
┌────────────────────────────┐
│         LLM (ChatGPT)      │
└──────────▲─────────────────┘
           │ Natural language (prompt)
           ▼
┌────────────────────────────────────────┐
│          MCP Server (ElysiaJS)         │
│  ┌──────────────────────────────────┐  │
│  │  Plugin: FirebasePlugin          │  │ ◄── Firestore Device Control
│  │  Plugin: EventPlugin             │  │ ◄── API Registrasi Event
│  │  Plugin: (dll jika perlu)        │  │
│  └──────────────────────────────────┘  │
└────────┬──────────────┬────────────────┘
         │              │
         ▼              ▼
┌───────────────┐   ┌────────────────────┐
│ Firestore DB  │   │ Internal Event API │
└───────────────┘   └────────────────────┘

```


### 📦 Plugin MCP

**Deskriptif**: berisi schema (nama fungsi, parameter, deskripsi)

**Eksekutor**: handler di MCP Server (biasanya HTTP POST) yang menjalankan aksi → manggil API


## 🔍 Analogi Gampangnya

Misalnya kita bilang ke ChatGPT:

`“Daftarkan saya ke event dengan ID A123.”`

1. LLM baca dokumentasi plugin (via pluginRegistry)
2. Dia temukan fungsi registerToEvent(name, email, eventId)
3. Dia format JSON request → kirim ke MCP Server
4. MCP Server terima request → manggil API via fetch() atau axios
5. Respon (sukses/gagal) dikembalikan ke LLM

## 🧱 Jadi Arsitekturnya Sebenarnya Begini

```
LLM (ChatGPT)
   │
   ▼ (JSON structured call)
MCP Plugin Handler
   │
   ▼ (HTTP call / SDK call / internal logic)
External API (bisa internal, Firebase, dll)
```


## 🤔 Kenapa Tidak Langsung Akses API?

Kalau LLM bisa akses langsung API, kenapa perlu MCP? Ini alasannya:

| Alasan | Penjelasan |
|---|---|
| 🧠 **Context-awareness** | LLM bisa tahu konteks sistem, dan menjawab dengan lebih natural dan tepat. |
| 🧩 **Standardisasi** | Semua API bisa dibungkus dengan format JSON schema + handler. Mudah untuk diatur. |
| 🔒 **Keamanan & Validasi** | Bisa melakukan filtering, validasi, logging semua request sebelum sampai ke API. |
| 🕹️ **Kontrol** | Bisa ganti source (misal dari Firestore ke Supabase) tanpa ubah cara pakai dari sisi LLM. |
| ⚡ **Kombinasi plugin** | LLM bisa query perangkat di Firestore dan kirim ke event API — dalam satu prompt. |



## Apa bedanya MCP ini dengan agent/tools?

**MCP** vs **Agent** vs **Tools** sering dipakai bersamaan dan bisa tumpang tindih konsepnya, tapi ada perbedaan peran dan level abstraksinya. Yuk kita bedah satu per satu biar clear:

### 🧠 1. MCP (Model Context Protocol)

Protokol komunikasi antara LLM dan dunia luar dengan pendekatan context-aware + plugin-aware.

Ciri-ciri:
- Spesifik ke LLM seperti ChatGPT atau Claude
- Formatnya standar: plugin registry + fungsi + schema JSON
- Memungkinkan LLM untuk mengakses dan mengontrol sistem eksternal (API, DB, aplikasi) secara kontekstual
- Mirip middleware antara LLM dan tools-nya

🧩 Contoh:
Plugin lockDevice atau registerToEvent di MCP adalah fungsi yang tersedia dalam sistem. LLM memilih dan mengisi argumen lalu mengirimkan permintaan ke MCP server.

### 2. Agent

Entitas aktif yang bisa berpikir, merencanakan, dan bertindak berdasarkan tujuan.

Ciri-ciri:
- Biasanya punya loop: observe → plan → act → reflect
- Diberi goal, bukan instruksi eksplisit
- Bisa memanggil banyak tools/MCP/plugin sesuai kebutuhan
- Bisa chaining beberapa langkah secara otomatis
- Cocok untuk use case seperti AutoGPT, LangGraph, LangChain Agents

🧩 Contoh:

“Cari perangkat yang hilang, cek status terakhirnya, dan kunci kalau online.”

Agent akan:

✅ Query Firestore → ✅ Analisis status → ✅ Jalankan lockDevice → ✅ Kirim hasilnya balik ke user

### 🧰 3. Tools

Fungsi atau komponen yang bisa digunakan oleh LLM/Agent untuk menyelesaikan tugas tertentu.

Ciri-ciri:
- Bisa berupa fungsi tunggal (callable API)
- Tidak kontekstual (tanpa MCP) kecuali dibungkus
- Biasanya dipakai oleh Agents atau LLMs saat pakai plugin seperti OpenAI Tools, LangChain Tool, atau AutoGPT Tools

🧩 Contoh:

```js
tool: {
  name: "getWeather",
  func: async ({ location }) => { ... },
  description: "Get weather for a city"
}
```

## 🔁 Diagram Hubungan

```
                +---------------------+
                |     LLM (ChatGPT)   |
                +---------------------+
                         │
                         ▼
              +------------------------+
              |        AGENT           |  ◄── Punya rencana, memory, goal
              +------------------------+
                         │
               ┌─────────┴───────────┐
               ▼                     ▼
       +---------------+     +------------------+
       |    TOOLS      |     |   MCP PLUGINS    |
       +---------------+     +------------------+
            (fungsi)            (contextual API)
```

## 📌 TL;DR - Perbedaan Utama

|   | MCP | Agent | Tool |
|---|---|---|---|
| Bentuk | Protokol + plugin JSON/API | Sistem berpikir/tindak | Fungsi tunggal |
| Fokus | Interoperabilitas LLM ↔ API | Autonomi dan perencanaan | Eksekusi satu tugas spesifik |
| Contoh | sendRemoteCommand() | AutoGPT atau LangGraph Agent | getWeather() |
| Konteks | Ya, dikelola dan diingat | Ya, sangat kontekstual | Tidak (kecuali dibungkus) |


Kalau Anda sedang membangun sistem assistant dengan kontrol ke API/device, maka:
- **MCP** adalah interface layer kamu
- **Tools** adalah fungsi internal kamu
- **Agent** bisa kamu tambahkan nanti kalau mau assistant anda bisa berpikir dan chaining task sendiri


# ✅ MCP Discovery

Sekarang pertanyaannya:

    🧐 "Bagaimana MCP Client bisa tahu apakah suatu server adalah MCP server atau bukan?"

Jawabannya: **dengan konvensi & discovery protocol**.

Mari kita breakdown secara praktis dan teknikal.

## 1. Konvensi Endpoint: /.well-known/mcp.json

Sama seperti .well-known/ai-plugin.json di OpenAI plugin, MCP bisa pakai endpoint standar untuk registrasi.

📄 GET /.well-known/mcp.json

File deskriptif berisi:
- Nama plugin
- Fungsi yang tersedia
- Parameter + tipe data
- Target endpoint masing-masing

🧩 Contoh isi .well-known/mcp.json
```json
{
  "name": "Device Control MCP",
  "version": "1.0",
  "description": "Kontrol perangkat Android melalui Firestore",
  "functions": [
    {
      "name": "sendRemoteCommand",
      "description": "Mengirim perintah lock/wipe ke perangkat",
      "parameters": {
        "type": "object",
        "properties": {
          "serial": { "type": "string" },
          "command": { "type": "string", "enum": ["lock", "wipe", "ring"] }
        },
        "required": ["serial", "command"]
      },
      "endpoint": "/mcp/sendRemoteCommand"
    }
  ]
}
```

## 2. Respons Handshake atau Header

Opsional, tapi berguna untuk auto-discovery. Misalnya:
- Server bisa balas header `X-MCP-Server: true`
- Atau /ping endpoint balas `{ mcp: true }`

## 3. Self-description API (/mcp/info)

Endpoint ini bisa memberi metadata server:

```json
{
  "server": "MCP Server Kamu",
  "version": "0.1.0",
  "plugins": ["firebasePlugin", "eventPlugin"]
}
```

## 4. Schema-Based Validation

Client juga bisa kirim **test request dummy** ke salah satu fungsi dan lihat:
- Apakah server merespons dengan **validasi parameter berbasis schema**
- Apakah outputnya terstruktur

Ini seperti "ping fungsi MCP", dan bisa bantu jika `.well-known` belum tersedia.


Secara **konvensi di komunitas Model Context Protocol (MCP)**, endpoint `/.well-known/mcp.json` digunakan sebagai **standard discovery endpoint** untuk plugin MCP, mirip seperti cara `.well-known/ai-plugin.json` digunakan oleh OpenAI Plugin.

Penjelasannya:
- **Tujuannya**: Memberi tahu LLM/agent bahwa server ini mendukung MCP dan fungsi apa saja yang tersedia.
- **Format**: Mirip OpenAI Plugin Manifest, tapi lebih ringan dan bebas vendor lock-in.
- **Keuntungan**: Agent bisa otomatis:
    - Menemukan plugin
    - Membaca fungsi yang tersedia
    - Menyesuaikan argumen JSON secara dinamis
    - Tanpa hardcoding

**🔍 Kenapa menggunakan .well-known/?**

- Direktori `.well-known/` adalah standar [RFC 8615](#)
- Banyak protokol (OAuth, Apple Site Association, OpenAI Plugin, dll) menggunakan ini untuk deklarasi metadata server
- Agent LLM cukup `GET /.well-known/mcp.json` untuk mengenali kemampuan server

**🧭 Langkah Deteksi oleh MCP Client**

1. Cek apakah ada .well-known/mcp.json
2. Validasi schema fungsinya (opsional)
3. Simpan registry MCP server
4. Buat interface ke fungsi-fungsi yang tersedia

Contoh MCP Client Sederhana (Pseudo-code):

```typescript
const isMCPServer = async (url) => {
  const res = await fetch(`${url}/.well-known/mcp.json`);
  if (!res.ok) return false;
  
  const json = await res.json();
  return Array.isArray(json.functions); // minimal validasi
};
```

## 🧩 Jadi...

| Komponen | Tujuan |
|---|---|
| .well-known/mcp.json | Standar discovery MCP plugin & fungsi |
| /mcp/info | Metadata server |
| Header (opsional) | Auto-tag saat scanning jaringan/internal |
| Test call | Validasi runtime |

