# MCP Client Bridge

Contoh implementasi MCP (Model Context Protocol) Client yang dirancang untuk bekerja dengan layanan LLM yang kompatibel dengan payload OpenAI, namun tidak memiliki dukungan bawaan untuk function calling atau tools handler.

Proyek ini bertujuan untuk membangun lapisan bridging yang memungkinkan interaksi kontekstual dan eksekusi perintah secara terstruktur—meniru mekanisme function calling melalui protokol MCP. Dengan pendekatan ini, client dapat merespons perintah dan instruksi berbasis konteks secara dinamis, memperluas kapabilitas layanan LLM tanpa modifikasi langsung pada model atau endpoint aslinya.

