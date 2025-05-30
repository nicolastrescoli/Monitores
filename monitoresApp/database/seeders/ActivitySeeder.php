<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Activity;

class ActivitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Activity::create([
            'title' => 'Actividad 1',
            'num_participants' => 10,
            'min_age' => 5,
            'max_age' => 12,
            'duration' => 60, // Duración en minutos
            'objectives' => 'Objetivos de la actividad 1',
            'introduction' => 'Introducción a la actividad 1',
            'description' => 'Descripción de la actividad 1',
            'conclusion' => 'Conclusión de la actividad 1',
            'visibility' => 'public',
            'type_id' => 1, // Asegúrate de que este ID exista en tu tabla types
            'user_id' => null, // Asegúrate de que este ID exista en tu tabla materials
            'original_activity_id' => null, // Si es una actividad original, deja null
        ]);

        Activity::create([
            'title' => 'Actividad 2',
            'num_participants' => 15,
            'min_age' => 6,
            'max_age' => 14,
            'duration' => 90, // Duración en minutos
            'objectives' => 'Objetivos de la actividad 2',
            'introduction' => 'Introducción a la actividad 2',
            'description' => 'Descripción de la actividad 2',
            'conclusion' => 'Conclusión de la actividad 2',
            'visibility' => 'public',
            'type_id' => 2, // Asegúrate de que este ID exista en tu tabla types
            'user_id' => null, // Asegúrate de que este ID exista en tu tabla materials
            'original_activity_id' => null, // Si es una actividad original, deja null
        ]);
        Activity::create([
            'title' => 'Actividad 3',
            'num_participants' => 20,
            'min_age' => 8,
            'max_age' => 16,
            'duration' => 120, // Duración en minutos
            'objectives' => 'Objetivos de la actividad 3',
            'introduction' => 'Introducción a la actividad 3',
            'description' => 'Descripción de la actividad 3',
            'conclusion' => 'Conclusión de la actividad 3',
            'visibility' => 'public',
            'type_id' => 3, // Asegúrate de que este ID exista en tu tabla types
            'user_id' => null, // Asegúrate de que este ID exista en tu tabla materials
            'original_activity_id' => null, // Si es una actividad original, deja null
        ]);
        Activity::create([
            'title' => 'Actividad 4',
            'num_participants' => 12,
            'min_age' => 7,
            'max_age' => 15,
            'duration' => 75, // Duración en minutos
            'objectives' => 'Objetivos de la actividad 4',
            'introduction' => 'Introducción a la actividad 4',
            'description' => 'Descripción de la actividad 4',
            'conclusion' => 'Conclusión de la actividad 4',
            'visibility' => 'public',
            'type_id' => 1, // Asegúrate de que este ID exista en tu tabla types
            'user_id' => null, // Asegúrate de que este ID exista en tu tabla materials
            'original_activity_id' => null, // Si es una actividad original, deja null
        ]);
        Activity::create([
            'title' => 'Actividad 5',
            'num_participants' => 18,
            'min_age' => 9,
            'max_age' => 17,
            'duration' => 80, // Duración en minutos
            'objectives' => 'Objetivos de la actividad 5',
            'introduction' => 'Introducción a la actividad 5',
            'description' => 'Descripción de la actividad 5',
            'conclusion' => 'Conclusión de la actividad 5',
            'visibility' => 'public',
            'type_id' => 2, // Asegúrate de que este ID exista en tu tabla types
            'user_id' => null, // Asegúrate de que este ID exista en tu tabla materials
            'original_activity_id' => null, // Si es una actividad original, deja null
        ]);
        Activity::create([
            'title' => 'Actividad 6',
            'num_participants' => 25,
            'min_age' => 10,
            'max_age' => 18,
            'duration' => 100, // Duración en minutos
            'objectives' => 'Objetivos de la actividad 6',
            'introduction' => 'Introducción a la actividad 6',
            'description' => 'Descripción de la actividad 6',
            'conclusion' => 'Conclusión de la actividad 6',
            'visibility' => 'public',
            'type_id' => 3, // Asegúrate de que este ID exista en tu tabla types
            'user_id' => null, // Asegúrate de que este ID exista en tu tabla materials
            'original_activity_id' => null, // Si es una actividad original, deja null
        ]);

        Activity::create([
            'title' => 'Trampantojo',
            'num_participants' => 30,
            'min_age' => 5,
            'max_age' => 7,
            'duration' => 60, // Duración en minutos
            'objectives' => 'Fomentar la curiosidad por la cocina y la ciencia, y desarrollar la creatividad en ambas. Comprendiendo conceptos como la gelificación.',

            'introduction' => 'El monitor divide a los participantes por grupos de 4 y se situaran por las bancadas del laboratorio. Y seguidamente se les explicará el cuidado que se debe tener en un laboratorio y la importancia de los materiales que los rodean. Seguidamente se les repartirá un "contrato" con las normas del laboratorio adaptadas a cada edad. En cada bancada habrá para cada 4 un vasito de plástico con cacao en polvo, otro con azúcar glas, otro con mantequilla y otro con agua; 2 láminas de gelatina, 1 cuchillo y un trozo de papel film.',

            'description' => 'Picar bien las galletas metidas en la bolsa.
            Poner en el vaso de agua la gelatina.
            Derretir la mantequilla y juntarla con la gelatina.
            Mezclar las galletas con el cacao y el azúcar.
            Mezclar la mantequilla con gelatina en las galletas con cacao y azúcar.
            Hacer una bola con toda la masa y estirar en el film haciendo forma de morcilla.
            Reposar media hora en el congelador.',

            'conclusion' => 'En el cierre de la actividad se explicará la importancia de que un buen cocinero también tenga nociones de ciencia y lo cerca que esta de nosotros.',

            'visibility' => 'public',
            'type_id' => 1, // Asegúrate de que este ID exista en tu tabla types
            'user_id' => null, // Asegúrate de que este ID exista en tu tabla materials
            'original_activity_id' => null, // Si es una actividad original, deja null
        ]);
    }
}
