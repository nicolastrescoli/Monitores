<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>{{ $name }} PDF</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
        }
        th, td {
            border: 1px solid #000;
            text-align: center;
            vertical-align: middle;
            padding: 2px;
            word-wrap: break-word;
        }
        th {
            background-color: #f2f2f2;
        }
        td {
            height: 15px;
        }
        .page-break {
            page-break-before: always; /* fuerza salto antes de este elemento */
            /*page-break-after: always;  /* fuerza salto después de este elemento */
        }

        /*Estilos plantilla actividad*/
        .activity_body { font-family: DejaVu Sans, sans-serif; font-size: 12px; line-height: 1.4; margin: 40px; }
        h1, h2, h3 { margin-bottom: 5px; }
        .activity_table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #000; padding: 5px; vertical-align: top; }
        .sin-borde td { border: none; }
        .seccion-titulo { font-weight: bold; background: #f0f0f0; padding: 5px; }
        footer { margin-top: 40px; font-size: 10px; text-align: center; }
    </style>
</head>
<body>
    <div class="page">
        <h1>{{ $name }}</h1>
        <h2>1 agosto 2026 - 15 agosto 2026</h2>
        <p>Nicolás Trescolí Blasco</p>
    </div>

    <div class="page page-break">
        <h2>Descripción</h2>
        <hr>
        <p> {{ $description }} </p>
    </div>

    <div class="page page-break">
    <h2 style="text-align:center;">Calendarización</h2>
    <table>
        <thead>
            <tr>
                <th style="width: 60px;">Hora</th>
                @foreach(array_keys($cellMap) as $fecha)
                    <th>{{ $fecha }}</th>
                @endforeach
            </tr>
        </thead>
        <tbody>
        @php
            $start = \Carbon\Carbon::createFromFormat('H:i', $firstHour);
            $end   = \Carbon\Carbon::createFromFormat('H:i', $lastHour);
        @endphp

        @while($start->lte($end))
            <tr>
                <td style="height: 5px;">{{ $start->format('H:i') }}</td>
                @foreach(array_keys($cellMap) as $date)
                    <td style="height: 5px;">
                        @if(isset($cellMap[$date][$start->format('H:i')]))
                            {{ $cellMap[$date][$start->format('H:i')]['title'] }}
                        @endif
                    </td>
                @endforeach
            </tr>
            @php
                $start->addMinutes(15);
            @endphp
        @endwhile
        </tbody>
    </table>

    @foreach($activities as $activity)
        <div class="page page-break activity_body">
            @include('pdf.partials._activity', $activity)
        </div>
        <footer>
            Material obtenido de OcioEducativo.es - Un proyecto de Nicolás Trescolí Blasco
        </footer>
    @endforeach


    </div>
</body>
</html>
