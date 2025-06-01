import requests
from bs4 import BeautifulSoup
import json
import os

# Leer las URLs de archivo
with open('urls.txt', 'r', encoding='utf-8') as f:
    urls = [line.strip() for line in f.readlines()]

resultados = []

for url in urls:
    try:
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')

        # Encontrar todos los juegos en la página
        juegos = soup.find_all('div', class_='eTitle')

        for juego in juegos:
            enlace = juego.find('a')
            if enlace:
                titulo = enlace.get_text(strip=True)
                href = enlace.get('href')

                print(f'Título: {titulo}')
                print(f'URL: {'https://www.tafadycursos.com'+href}\n')

                resultados.append({
                    'categoria': url.rstrip('/').split('/')[-1].capitalize(),
                    'titulo': titulo,
                    'url': 'https://www.tafadycursos.com'+href
                })

    except Exception as e:
        print(f'❌ Error procesando {url}: {e}')

# Guardar los resultados en JSON
os.makedirs("data", exist_ok=True)
with open('data/resultados.json', 'w', encoding='utf-8') as f:
    json.dump(resultados, f, ensure_ascii=False, indent=2)
