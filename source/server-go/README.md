# MCP & API dengan Go



## Build docs

```bash
swag init --dir ./cmd/server --output ./internal/docs
```


## RUNNING

Running in watch mode, use Air or Modd or Gow

Install Air
```bash
go install github.com/cosmtrek/air@latest
```

Halankan dengan:
```bash
air
```

---

Install Mod

```bash
go install github.com/cortesi/modd/cmd/modd@latest
```

Halankan dengan:
```bash
modd
```
---

Install Gow

```bash
go install github.com/mitranim/gow@latest
```

Halankan dengan:
```bash
gow run cmd/server/main.go
```
