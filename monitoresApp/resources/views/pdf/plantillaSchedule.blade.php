<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Schedule PDF</title>
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
    </style>
</head>
<body>
    <h2 style="text-align:center;">Horario</h2>

    <table>
        <thead>
            <tr>
                <th style="width: 60px;">Hora</th>
                <th>2025-11-23</th>
                <th>2025-11-24</th>
                <th>2025-11-25</th>
                <th>2025-11-26</th>
                <th>2025-11-27</th>
                <th>2025-11-28</th>
                <th>2025-11-29</th>
            </tr>
        </thead>
        <tbody>
            @for($h = 0; $h < 24; $h++)
                @for($m = 0; $m < 60; $m += 15)
                    <tr>
                        <td>{{ sprintf("%02d:%02d", $h, $m) }}</td>
                        @for($d = 0; $d < 7; $d++)
                            <td></td>
                        @endfor
                    </tr>
                @endfor
            @endfor
        </tbody>
    </table>
    <footer>
        Material obtenido de OcioEducativo.es - Un proyecto de Nicolás Trescolí Blasco
    </footer>
</body>
</html>
