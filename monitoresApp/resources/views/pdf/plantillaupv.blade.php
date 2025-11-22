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

    <table class="sin-borde">
        <tr>
            <td><strong>ACTIVIDAD:</strong> {{ $title }}</td>
            <td><strong>Nº PARTICIPANTES:</strong> {{ $num_participants }}</td>
            <td><strong>DURACIÓN:</strong> {{ $duration }}</td>
            <td><strong>EDAD RECOMENDADA:</strong> {{ $min_age }} - {{ $max_age }}</td>
        </tr>
    </table>

    <p class="seccion-titulo">OBJETIVOS DE LA SESIÓN</p>
    <p>{{ $objectives }}</p>

    <p class="seccion-titulo">DESCRIPCIÓN DE LA SESIÓN</p>
    <p><strong>APERTURA:</strong> {{ $introduction }}</p>
    <p><strong>DESARROLLO:</strong> {{ $description }}</p>
    <p><strong>CIERRE:</strong> {{ $conclusion }}</p>

    <p class="seccion-titulo">MATERIALES</p>
    <table>
        <thead>
            <tr>
                <th>MATERIAL</th>
                <th>CANTIDAD</th>
                <th>OBSERVACIONES</th>
            </tr>
        </thead>
        <tbody>
            @foreach($materials as $material)
                <tr>
                    <td>{{ $material['name'] }}</td>
                    <td>{{ $material['quantity'] }}</td>
                    <td>{{ $material['notes'] }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <p class="seccion-titulo">RIESGOS</p>
    <table>
        <thead>
            <tr>
                <th>RIESGOS</th>
                <th>MEDIDAS DE PREVENCIÓN</th>
            </tr>
        </thead>
        <tbody>
            @foreach($risks as $risk)
                <tr>
                    <td>{{ $risk['name'] }}</td>
                    <td>{{ $risk['description'] }}</td>
                    {{-- <td>{{ $risk['severity'] }}</td>
                    <td>{{ $risk['prevention'] }}</td> --}}
                </tr>
            @endforeach
        </tbody>
    </table>

    <footer>
        Material obtenido de OcioEducativo.es - Un proyecto de Nicolás Trescolí Blasco
    </footer>

</body>
</html>
