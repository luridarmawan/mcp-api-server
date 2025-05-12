# MCP & API Server dengan Golang



## Build docs

```bash
swag init --dir ./cmd/server --output ./internal/docs
```


## RUNNING

Running in watch mode, use Air or Modd or Gow


Install Gow

```bash
go install github.com/mitranim/gow@latest
```

Jalankan dengan:
```bash
gow run cmd/server/main.go
```

---

Install Air
```bash
go install github.com/cosmtrek/air@latest
```

Jalankan dengan:
```bash
air
```

---

Install Mod

```bash
go install github.com/cortesi/modd/cmd/modd@latest
```

Jalankan dengan:
```bash
modd
```
---
