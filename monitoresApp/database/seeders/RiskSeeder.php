<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Risk;

class RiskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $risks = [
            ['name' => 'Cortes con objetos filosos', 'description' => 'Cortes o heridas causadas por objetos afilados como tijeras, cuchillos o cristales.', 'severity' => 2, 'prevention' => 'Mantener los objetos filosos fuera del alcance de los niños y supervisar su uso.'],
            ['name' => 'Lesiones por caídas', 'description' => 'Lesiones causadas por caídas al suelo, como esguinces o fracturas.', 'severity' => 3, 'prevention' => 'Mantener el área libre de obstáculos y usar calzado adecuado.'],
            ['name' => 'Golpes con objetos contundentes', 'description' => 'Lesiones causadas por impactos de objetos pesados o duros.', 'severity' => 2, 'prevention' => 'Evitar el uso de objetos pesados cerca de los niños.'],
            ['name' => 'Quemaduras con fuego', 'description' => 'Lesiones causadas por contacto con llamas o superficies calientes.', 'severity' => 4, 'prevention' => 'Mantener a los niños alejados de fuentes de calor y supervisar el uso de fuego.'],
            ['name' => 'Electrocución', 'description' => 'Lesiones causadas por descargas eléctricas.', 'severity' => 5, 'prevention' => 'Evitar el contacto con cables eléctricos y enchufes.'],
            ['name' => 'Asfixia', 'description' => 'Obstrucción de las vías respiratorias que impide la respiración adecuada.', 'severity' => 5, 'prevention' => 'Supervisar a los niños mientras comen y evitar juguetes pequeños.'],
            ['name' => 'Intoxicación', 'description' => 'Envenenamiento por ingestión de sustancias tóxicas o venenosas.', 'severity' => 4, 'prevention' => 'Mantener productos químicos y medicamentos fuera del alcance de los niños.'],
            ['name' => 'Caídas desde altura', 'description' => 'Lesiones causadas por caídas desde una altura considerable.', 'severity' => 3, 'prevention' => 'Usar barandillas y supervisar a los niños en áreas elevadas.'],
            ['name' => 'Contactos con animales peligrosos', 'description' => 'Lesiones causadas por mordeduras o arañazos de animales potencialmente peligrosos.', 'severity' => 3, 'prevention' => 'Supervisar el contacto con animales y enseñar a los niños a no acercarse a animales desconocidos.'],
            ['name' => 'Lesiones por esfuerzo físico', 'description' => 'Lesiones musculares o articulares causadas por un esfuerzo excesivo.', 'severity' => 2, 'prevention' => 'Fomentar el calentamiento antes de la actividad física y evitar sobrecargas.'],
            ['name' => 'Enfermedades contagiosas', 'description' => 'Riesgo de contraer enfermedades transmisibles entre personas.', 'severity' => 3, 'prevention' => 'Promover la higiene adecuada y evitar el contacto cercano con personas enfermas.'],
        ];

        foreach ($risks as $item) {
            Risk::create($item);
        }
    }
}
