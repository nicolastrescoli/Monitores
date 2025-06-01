import os
import json
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse

# Cargar JSON con URLs
with open("data/resultados.json", "r", encoding="utf-8") as f:
    entradas = json.load(f)

# Crear carpeta para imágenes
os.makedirs("imagenes", exist_ok=True)

resultados = []

for entrada in entradas:
    url = entrada["url"]
    titulo_original = entrada["titulo"]
    titulo_archivo = titulo_original.replace(" ", "_").replace("/", "-")
    print(f"\n🔍 Procesando: {titulo_original}")

    try:
        res = requests.get(url)
        soup = BeautifulSoup(res.text, "html.parser")

        # Obtener <h1>
        h1 = soup.find("h1")
        titulo_pagina = h1.get_text(strip=True) if h1 else titulo_original

        # Buscar todas las tablas después del <h1>
        tablas_despues_h1 = []
        for sibling in h1.find_all_next():
            if sibling.name == "table":
                tablas_despues_h1.append(sibling)
            if len(tablas_despues_h1) == 2:
                break

        if len(tablas_despues_h1) < 2:
            print("⚠️ No se encontró una segunda tabla después del <h1>")
            continue

        segunda_tabla = tablas_despues_h1[1]

        # Extraer texto
        texto = ""
        for tag in segunda_tabla.find_all(["p", "div"]):
            contenido = tag.get_text(strip=True)
            if contenido:
                texto += contenido + "\n\n"

        # Extraer imágenes
        imagenes = []
        for img in segunda_tabla.find_all("img"):
            img_url = img.get("src")
            if img_url and img_url.startswith("http"):
                try:
                    img_data = requests.get(img_url).content
                    img_name = os.path.basename(urlparse(img_url).path)
                    img_path = f"imagenes/{titulo_archivo}_{img_name}"

                    with open(img_path, "wb") as f:
                        f.write(img_data)

                    imagenes.append({
                        "local": img_path,
                        "url": img_url
                    })

                except Exception as img_error:
                    print(f"⚠️ Error descargando imagen: {img_url} -> {img_error}")

        # Añadir al resultado
        resultados.append({
            "titulo": titulo_pagina,
            "url": url,
            "texto": texto.strip(),
            "imagenes": imagenes
        })

        print(f"✅ Procesado: {titulo_pagina}")

    except Exception as e:
        print(f"❌ Error en {url}: {e}")

# Guardar todo en un solo archivo JSON
with open("salidaFinal.json", "w", encoding="utf-8") as f:
    json.dump(resultados, f, ensure_ascii=False, indent=2)

print("\n🎉 Listo. Guardado en salida.json")
