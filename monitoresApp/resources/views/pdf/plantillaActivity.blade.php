<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Plantilla Actividad</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; line-height: 1.4; margin: 40px; }
        h1, h2, h3 { margin-bottom: 5px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #000; padding: 5px; vertical-align: top; }
        .sin-borde td { border: none; }
        .seccion-titulo { font-weight: bold; background: #f0f0f0; padding: 5px; }
        footer { margin-top: 40px; font-size: 10px; text-align: center; }
    </style>
</head>
<body>

@include('pdf.partials._activity', $activity)

</body>
</html>
