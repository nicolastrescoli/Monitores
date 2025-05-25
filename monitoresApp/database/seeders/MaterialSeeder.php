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
            'Pintura acrílica',
            'Cartulina',
            'Tijeras',
            'Cinta adhesiva',
            'Cuerda'
        ];

        foreach ($materials as $name) {
            Material::create(['name' => $name]);
        }
    }
}
