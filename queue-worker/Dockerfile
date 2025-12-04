# --- Estágio 1: BUILDER ---
FROM golang:1.22-alpine AS builder

WORKDIR /app

# 1. Copia o go.mod e go.sum
COPY go.mod go.sum ./
# 2. Baixa as dependências (Camada que será cacheada)
RUN go mod download

# 3. Copia o código fonte (main.go)
COPY . .

# 4. Compila o binário estaticamente
RUN CGO_ENABLED=0 go build -o /worker main.go


# --- Estágio 2: EXECUÇÃO ---
FROM alpine:latest

WORKDIR /usr/local/bin

# Copia apenas o binário compilado do estágio anterior
COPY --from=builder /worker .

# Comando de execução
CMD ["./worker"]