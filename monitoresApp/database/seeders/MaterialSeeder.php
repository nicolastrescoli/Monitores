<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Material;

class MaterialSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $materials = [
            ['name' => 'Galletas', 'description' => 'Con y sin gluten'],
            ['name' => 'Azúcar glas', 'description' => null],
            ['name' => 'Cacao puro', 'description' => 'Para alérgicos al gluten y frutos secos'],
            ['name' => 'Margarina', 'description' => null],
            ['name' => 'Bolsas zip', 'description' => 'pequeñas'],
            ['name' => 'Bol', 'description' => 'Para microondas'],
            ['name' => 'Vasos', 'description' => 'De plástico desechables'],
            ['name' => 'Cuchillos', 'description' => 'De plástico desechables'],
            ['name' => 'Láminas de gelatina neutra', 'description' => null],
            ['name' => 'Platos', 'description' => 'De plástico desechables'],
            ['name' => 'Papel film', 'description' => null],
            ['name' => 'Rotulador permanente', 'description' => null],
            ['name' => 'Palo de mortero', 'description' => null],
      
        ];

        foreach ($materials as $material) {
            Material::create($material);
        }
    }
}
