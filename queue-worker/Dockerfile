
FROM golang:1.22-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download


COPY . .

RUN CGO_ENABLED=0 go build -o /worker main.go


FROM alpine:latest

WORKDIR /usr/local/bin

COPY --from=builder /worker .

CMD ["./worker"]