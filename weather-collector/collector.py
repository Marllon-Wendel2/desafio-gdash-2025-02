import requests
import redis
import json
import time
import os
import schedule

REDIS_HOST = os.getenv('REDIS_HOST', 'localhost')
REDIS_PORT = int(os.getenv('REDIS_PORT', 6379))
REDIS_PASS = os.getenv('REDIS_PASS')
QUEUE_NAME = 'weather_data_queue' 

LATITUDE = -8.03
LONGITUDE = -34.97
LOCATION_NAME = "Camaragibe, PE"

print(f"DEBUG: Tentando conectar em {REDIS_HOST}:{REDIS_PORT}")
if REDIS_PASS:
    print("DEBUG: Senha Redis lida com sucesso (Valor Oculto: SIM)")
else:
    print("ERRO CRÍTICO: Variável REDIS_PASS não foi lida!")
    exit(1)


try:
    r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, password=REDIS_PASS, decode_responses=True)
    r.ping()
    print("Conexão com Redis estabelecida com sucesso!")
except Exception as e:
    print(f"Erro ao conectar com Redis: {e}")
    exit(1) 

def collect_and_publish_weather_data():
    print(f"\n--- Coletando dados para {LOCATION_NAME} ---")

    API_URL = f"https://api.open-meteo.com/v1/forecast?latitude={LATITUDE}&longitude={LONGITUDE}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,precipitation_probability&timezone=America%2FSao_Paulo&forecast_days=1"
    
    try:
        response = requests.get(API_URL)
        response.raise_for_status()
        data = response.json()
        
        current = data['current']
        
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
        }


        message_json = json.dumps(weather_log)

        r.rpush(QUEUE_NAME, message_json)
        
        print(f"Dados coletados e enviados para a fila '{QUEUE_NAME}':")
        print(f"  Temperatura: {weather_log['temperature_c']} °C")
        print(f"  Umidade: {weather_log['humidity_percent']} %")
        print(f"  Chave na fila: {r.llen(QUEUE_NAME)}")

    except requests.exceptions.RequestException as e:
        print(f"Erro ao acessar API de Clima: {e}")
    except Exception as e:
        print(f"Erro durante o processamento: {e}")


schedule.every(1).hour.do(collect_and_publish_weather_data)

collect_and_publish_weather_data() 

while True:
    schedule.run_pending()
    time.sleep(1)