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
            'is_public' => true, // Cambia a false si la actividad no es pública
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
            'is_public' => true, // Cambia a false si la actividad no es pública
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
            'is_public' => true, // Cambia a false si la actividad no es pública
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
            'is_public' => true, // Cambia a false si la actividad no es pública
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
            'is_public' => true, // Cambia a false si la actividad no es pública
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
            'is_public' => true, // Cambia a false si la actividad no es pública
            'type_id' => 3, // Asegúrate de que este ID exista en tu tabla types
            'user_id' => null, // Asegúrate de que este ID exista en tu tabla materials
            'original_activity_id' => null, // Si es una actividad original, deja null
        ]);
    }
}
