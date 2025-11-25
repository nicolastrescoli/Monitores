<table class="" style="width:100%;">
    <tr>
        <td style="width: 31%;"><strong>ACTIVIDAD:</strong><p> {{ $title }} </p></td>
        <td style="width: 23%;"><strong>Nº PARTICIPANTES:</strong><p> {{ $num_participants }}</p></td>
        <td style="width: 15%;"><strong>DURACIÓN:</strong><p> {{ $duration }} min</p></td>
        <td style="width: 26%;"><strong>EDAD RECOMENDADA:</strong><p> {{ $min_age }} - {{ $max_age }} años</p></td>
    </tr>
</table>

<p class="seccion-titulo">OBJETIVOS DE LA SESIÓN</p>
<p>{{ $objectives }}</p>

<p class="seccion-titulo">DESCRIPCIÓN DE LA SESIÓN</p>
<p><strong>APERTURA:</strong> {{ $introduction }}</p>
<p><strong>DESARROLLO:</strong> {{ $description }}</p>
<p><strong>CIERRE:</strong> {{ $conclusion }}</p>

<p class="seccion-titulo">MATERIALES</p>
<table class="activity_table" style="width:100%;">
    <thead>
        <tr>
            <th>MATERIAL</th>
            <th style="width:15%;">CANTIDAD</th>
            <th>OBSERVACIONES</th>
        </tr>
    </thead>
    <tbody>
        @foreach($materials as $material)
            <tr>
                <td>{{ $material['name'] }}</td>
                <td>{{ $material['pivot']['quantity'] }}</td>
                <td>{{ $material['pivot']['notes'] }}</td>
            </tr>
        @endforeach
    </tbody>
</table>

<p class="seccion-titulo">RIESGOS</p>
    @foreach($risks as $key => $risk)
    <table class="activity_table" style="width:100%;">
        <tr>
            <td style="width:15%;"><strong>▶ Riesgo {{$key+1}}</strong></td><td>{{ $risk['name'] }}</td>
        </tr>
        <tr>
            <td colspan="2"><strong>Descripción: </strong>{{ $risk['description'] }}</td>
        </tr>
        <tr>
            <td colspan="2"><strong>Medidas de prevención: </strong>{{ $risk['prevention'] }}</td>
        </tr>
    </table>
    @endforeach