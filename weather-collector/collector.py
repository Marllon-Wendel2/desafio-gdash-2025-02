import requests
import redis
import json
import time
import os
import schedule

# --- Configuração ---
# Pega as variáveis de ambiente do docker-compose
REDIS_HOST = os.getenv('REDIS_HOST', 'localhost')
REDIS_PORT = int(os.getenv('REDIS_PORT', 6379))
REDIS_PASS = os.getenv('REDIS_PASS')
QUEUE_NAME = 'weather_data_queue' # Nome da lista Redis que será usada como fila

# Coordenadas de Camaragibe - PE
LATITUDE = -8.03
LONGITUDE = -34.97
LOCATION_NAME = "Camaragibe, PE"

# Conecta ao Redis
try:
    r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, password=REDIS_PASS, decode_responses=True)
    r.ping()
    print("Conexão com Redis estabelecida com sucesso!")
except Exception as e:
    print(f"Erro ao conectar com Redis: {e}")
    # Encerra o script se não conseguir conectar (Crítico)
    exit(1)

# Função de Coleta
def collect_and_publish_weather_data():
    print(f"\n--- Coletando dados para {LOCATION_NAME} ---")

    # URL da API Open-Meteo para dados atuais e horário (temperatura, umidade relativa, etc.)
    # Usamos forecast porque o serviço não oferece um endpoint 'current' puro sem o horário, mas ele serve para o propósito.
    API_URL = f"https://api.open-meteo.com/v1/forecast?latitude={LATITUDE}&longitude={LONGITUDE}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,precipitation_probability&timezone=America%2FSao_Paulo&forecast_days=1"
    
    try:
        response = requests.get(API_URL)
        response.raise_for_status() # Lança exceção para códigos de erro HTTP
        data = response.json()
        
        current = data['current']
        
        # Estrutura do log que será enviada para o NestJS
        weather_log = {
            "timestamp": current['time'],
            "location": LOCATION_NAME,
            "latitude": LATITUDE,
            "longitude": LONGITUDE,
            "temperature_c": current['temperature_2m'],
            "humidity_percent": current['relative_humidity_2m'],
            "wind_speed_kmh": current['wind_speed_10m'],
            "weather_code": current['weather_code'],
            "precipitation_probability": current['precipitation_probability'],
            # Aqui podemos adicionar mais campos relevantes se necessário
        }

        # Converte o dicionário Python para JSON
        message_json = json.dumps(weather_log)

        # Publica na fila Redis usando RPUSH (Right PUSH)
        # O Worker em Go usará BLPOP (Blocking Left POP) para consumir
        r.rpush(QUEUE_NAME, message_json)
        
        print(f"Dados coletados e enviados para a fila '{QUEUE_NAME}':")
        print(f"  Temperatura: {weather_log['temperature_c']} °C")
        print(f"  Umidade: {weather_log['humidity_percent']} %")
        print(f"  Chave na fila: {r.llen(QUEUE_NAME)}")

    except requests.exceptions.RequestException as e:
        print(f"Erro ao acessar API de Clima: {e}")
    except Exception as e:
        print(f"Erro durante o processamento: {e}")


# --- Loop de Agendamento ---
# Agenda a função para rodar a cada 1 hora (Requisito do desafio)
schedule.every(1).hour.do(collect_and_publish_weather_data)

# Roda uma vez no início para não ter que esperar a primeira hora
collect_and_publish_weather_data() 

while True:
    schedule.run_pending()
    time.sleep(1) # Espera 1 segundo para não consumir 100% da CPU