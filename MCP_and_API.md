# MCP vs Traditional API

## 1. Apa itu MCP

Model Context Protocol (MCP) adalah protokol komunikasi ringan untuk memungkinkan LLM berinteraksi secara kontekstual dengan API, database, atau aplikasi. Memberikan pendekatan atau protokol komunikasi yang dirancang khusus untuk memungkinkan model bahasa besar (LLM) seperti ChatGPT berinteraksi secara kontekstual dan terus-menerus dengan sistem eksternal—baik API, database, atau aplikasi nyata. Mari kita bahas cara kerjanya dan perbedaannya dengan API biasa:


## 2. Cara Kerja MCP

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

## 3. 🔁 Perbedaan MCP vs Traditional API

| Fitur | API Biasa | Model Context Protocol (MCP) |
|---|---|---|
| **Konteks** | Stateless | State-aware / Contextual |
| **Interaksi** | Manual oleh developer | Otomatis via LLM |
| **Pemahaman API** | Harus diprogramkan | LLM belajar dari dokumentasi/schema |
| **Chaining multiple APIs** | Harus dibuat logika manual | Bisa chaining otomatis oleh LLM |
| **Fleksibilitas Natural Language** | Terbatas | Bisa langsung pakai perintah bahasa alami |
| **Tujuan utama** | Akses data/fungsi spesifik | Meningkatkan kapabilitas LLM dalam bertindak |



## 4. 🧠 Arsitektur MCP dengan Beberapa Sumber

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
│ Database      │   │ Internal Event API │
└───────────────┘   └────────────────────┘

```


## 5. 📦 Plugin MCP

**Deskriptif**: berisi schema (nama fungsi, parameter, deskripsi)
**Eksekutor**: handler di MCP Server (biasanya HTTP POST) yang menjalankan aksi → manggil API

Schema plugin MCP berbentuk JSON, contoh:

```json
{
  "name": "Device Control MCP",
  "functions": [
    {
      "name": "sendRemoteCommand",
      "parameters": {
        "serial": "string",
        "command": "lock | wipe | ring"
      }
    }
  ]
}
```

## 6. 🔍 Analogi MCP

MCP itu seperti sekretaris pintar yang tahu caranya menghubungi banyak departemen hanya dengan 1 instruksi.
Misalnya kita bilang ke ChatGPT:

`“Daftarkan saya ke event dengan ID A123.”`

1. LLM baca dokumentasi plugin (via pluginRegistry)
2. Dia temukan fungsi registerToEvent(name, email, eventId)
3. Dia format JSON request → kirim ke MCP Server
4. MCP Server terima request → manggil API via fetch() atau axios
5. Respon (sukses/gagal) dikembalikan ke LLM

### 🧱 Jadi Arsitekturnya Sebenarnya Begini

```
LLM (ChatGPT)
   │
   ▼ (JSON structured call)
MCP Plugin Handler
   │
   ▼ (HTTP call / SDK call / internal logic)
External API (bisa internal, Firebase, dll)
```


## 7. 🤔 Kenapa MCP? Kenapa Tidak Langsung Akses API?

Kalau LLM bisa akses langsung API, kenapa perlu MCP? Ini alasannya:

| Alasan | Penjelasan |
|---|---|
| 🧠 **Context-awareness** | LLM bisa tahu konteks sistem, dan menjawab dengan lebih natural dan tepat. |
| 🧩 **Standardisasi** | Semua API bisa dibungkus dengan format JSON schema + handler. Mudah untuk diatur. |
| 🔒 **Keamanan & Validasi** | Bisa melakukan filtering, validasi, logging semua request sebelum sampai ke API. |
| 🕹️ **Kontrol** | Bisa mengganti source (misal dari Firestore ke Supabase) tanpa ubah cara pakai dari sisi LLM. |
| ⚡ **Kombinasi plugin** | LLM bisa query perangkat di Firestore dan kirim ke event API — dalam satu prompt. |



## 8. 📌 TL;DR - Perbedaan Utama MCP vs Agent vs Tool

Apa bedanya MCP ini dengan agent/tools?

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

### 🔁 Diagram Hubungan

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

###  Perbedaan Utama MCP vs Agent vs Tool

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


## 9. ✅ MCP Discovery

Sekarang pertanyaannya:

    🧐 "Bagaimana MCP Client bisa tahu apakah suatu server adalah MCP server atau bukan?"

Jawabannya: **dengan konvensi & discovery protocol**.

Mari kita breakdown secara praktis dan teknikal.

### 1. Konvensi Endpoint: /.well-known/mcp.json

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

### 2. Self-description API (/mcp/info)

Endpoint ini bisa memberi metadata server:

```json
{
  "server": "MCP Server Kamu",
  "version": "0.1.0",
  "plugins": ["firebasePlugin", "eventPlugin"]
}
```

### 3. Respons Handshake atau Header (opsional)

Opsional, tapi berguna untuk auto-discovery. Misalnya:
- Server bisa balas header `X-MCP-Server: true`
- Atau /ping endpoint balas `{ mcp: true }`


### 4. Schema-Based Validation

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

## 10. FAQ Singkat

Q: Apakah MCP menggantikan API?

A: Tidak. MCP melengkapi API agar LLM bisa menggunakannya dengan cerdas.

Q: Apa minimal struktur MCP?

A: Plugin registry (.well-known/mcp.json) dan handler endpoint.


## 🧩 Jadi.. TL;DR


|  | Deskripsi / Tujuan |
|---|---|
| **MCP** | Jembatan antara LLM dan API. |
| **Tools** | Fungsi tunggal. |
| **Agent** | Entitas yang berencana dan bertindak. |
| .well-known/mcp.json | Standar discovery MCP plugin & fungsi |
| /mcp/info | Metadata server |
| Header (opsional) | Auto-tag saat scanning jaringan/internal |
| Test call | Validasi runtime |

