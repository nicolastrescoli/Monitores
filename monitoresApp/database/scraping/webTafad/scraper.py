import requests
from bs4 import BeautifulSoup

# URL de la página
url = 'https://www.tafadycursos.com/ocio-y-tiempo-libre/catalogo-juegos-monitor-tiempo-libre'

# Solicitud HTTP
response = requests.get(url)
response.raise_for_status()

# Parsear HTML
soup = BeautifulSoup(response.text, 'html.parser')

# Obtener todas las tablas
tablas = soup.find_all('table')
urls = []  # Lista para almacenar las URLs

# Asegurar que hay al menos dos tablas
if len(tablas) >= 4:
    cuarta_tabla = tablas[3]
    enlaces = cuarta_tabla.find_all('a')
    
    # Imprimir títulos y enlaces
    for enlace in enlaces:
        titulo = enlace.get_text(strip=True)
        href = enlace.get('href')
        urls.append(href)  # Agregar URL a la lista

        # Comprobaciones
        # print(f'Título: {titulo}')
        # print(f'URL: {href}')
        # print('---')

    # Guardar enlaces en archivo
    with open('urls.txt', 'w', encoding='utf-8') as f:
        for url in urls:
            f.write(url + '\n')

else:
    print("No se encontró la cuarta tabla de la página.")

    
