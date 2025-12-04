package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/go-redis/redis/v8"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Estrutura para os logs do clima (Corresponde ao payload do Python Collector)
// As tags 'bson' garantem que os campos sejam salvos com os nomes esperados pelo NestJS/Mongoose.
type WeatherLog struct {
	Timestamp               string  `json:"timestamp" bson:"timestamp"`
	LocationName            string  `json:"location" bson:"locationName"`
	Latitude                float64 `json:"latitude" bson:"latitude"`
	Longitude               float64 `json:"longitude" bson:"longitude"`
	TemperatureC            float64 `json:"temperature_c" bson:"temperatureC"`
	HumidityPercent         float64 `json:"humidity_percent" bson:"humidityPercent"`
	WindSpeedKmh            float64 `json:"wind_speed_kmh" bson:"windSpeed"` 
	WeatherCode             int     `json:"weather_code" bson:"weatherCode"`
	PrecipitationProbability float64 `json:"precipitation_probability" bson:"precipitationProbability"`
}

const (
	QueueName      = "weather_data_queue"
	DatabaseName   = "gdash"
	CollectionName = "weather_logs"
)

var ctx = context.Context(context.Background())

func main() {
	log.Println("Iniciando Worker de Fila (Go)...")

	// Lendo variáveis de ambiente (injetadas pelo Docker Compose)
	redisPass := os.Getenv("REDIS_PASS")
	dbUser := os.Getenv("DB_USER")
	dbPass := os.Getenv("DB_PASS")

	if redisPass == "" || dbUser == "" || dbPass == "" {
		log.Fatal("ERRO: Variáveis de ambiente (REDIS_PASS, DB_USER, DB_PASS) não foram carregadas.")
	}

	// 1. Configurar e conectar ao Redis
	rdb := setupRedis(redisPass)

	// 2. Configurar e conectar ao MongoDB LOCAL (Serviço 'mongodb')
	mongoClient, collection := setupMongo(dbUser, dbPass)
	defer func() {
		// Garante que a conexão do Mongo seja fechada ao finalizar
		if err := mongoClient.Disconnect(ctx); err != nil {
			log.Fatalf("Erro ao desconectar do MongoDB: %v", err)
		}
	}()

	log.Println("Worker pronto. Escutando a fila do Redis...")

	// 3. Loop principal para escutar a fila
	for {
		// BLPop (Bloqueia e Retira da esquerda) com timeout de 1 segundo
		result, err := rdb.BLPop(ctx, 1*time.Second, QueueName).Result()
		if err == redis.Nil {
			continue // Sem mensagens, continua esperando
		} else if err != nil {
			log.Printf("ERRO ao escutar a fila do Redis: %v", err)
			time.Sleep(5 * time.Second)
			continue
		}

		// A mensagem JSON está no índice 1 do resultado do BLPop
		messageJSON := result[1] 

		if err := processAndSave(collection, messageJSON); err != nil {
			log.Printf("ERRO ao processar e salvar mensagem: %v", err)
		}
	}
}

// setupRedis configura e retorna o cliente Redis
func setupRedis(pass string) *redis.Client {
		rdb := redis.NewClient(&redis.Options{
			Addr:     fmt.Sprintf("%s:6379", os.Getenv("REDIS_HOST")),
			Password: os.Getenv("REDIS_PASS"),
			DB:       0,
		})

	// Lógica de retry para garantir a conexão
	for i := 0; i < 10; i++ {
		if _, err := rdb.Ping(ctx).Result(); err == nil {
			log.Println("Conexão com Redis estabelecida com sucesso!")
			return rdb
		}
		log.Println("Tentando conectar ao Redis...")
		time.Sleep(2 * time.Second)
	}

	log.Fatal("ERRO: Não foi possível conectar ao Redis após várias tentativas.")
	return nil
}

// setupMongo configura e retorna o cliente MongoDB e a collection (Para o Mongo Local)
func setupMongo(user string, pass string) (*mongo.Client, *mongo.Collection) {
	// O hostname 'mongodb' resolve para o container do MongoDB local.
	mongoURI := fmt.Sprintf("mongodb://%s:%s@mongodb:27017/%s?authSource=admin", user, pass, DatabaseName)
	log.Printf("URI MongoDB Local: %s", mongoURI) 
	
	clientOptions := options.Client().ApplyURI(mongoURI)

	// Lógica de retry para garantir a conexão
	for i := 0; i < 10; i++ {
		client, err := mongo.Connect(ctx, clientOptions)
		if err == nil && client.Ping(ctx, nil) == nil {
			log.Println("Conexão com MongoDB local (Docker) estabelecida com sucesso!")
			collection := client.Database(DatabaseName).Collection(CollectionName)
			return client, collection
		}
		log.Println("Tentando conectar ao MongoDB local...")
		time.Sleep(2 * time.Second)
		if client != nil {
			client.Disconnect(ctx)
		}
	}

	log.Fatal("ERRO: Não foi possível conectar ao MongoDB local após várias tentativas.")
	return nil, nil
}

// processAndSave desserializa o JSON e salva o documento no MongoDB
func processAndSave(collection *mongo.Collection, messageJSON string) error {
	var logData WeatherLog
	
	// 1. Desserializa o JSON da fila
	if err := json.Unmarshal([]byte(messageJSON), &logData); err != nil {
		return fmt.Errorf("falha ao desserializar JSON: %w", err)
	}

	// 2. Salva no MongoDB
	result, err := collection.InsertOne(ctx, logData)
	if err != nil {
		return fmt.Errorf("falha ao inserir no MongoDB: %w", err)
	}

	log.Printf("✅ Log de clima salvo: %s (ID: %v)", logData.LocationName, result.InsertedID)
	return nil
}