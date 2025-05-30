<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'Admin',
                'email' => 'admin@admin.com',
                'password' => bcrypt('1234567890'),
                'role' => 'admin',
            ],  
            [
                'name' => 'User',
                'email' => 'user@user.com',
                'password' => bcrypt('1234567890'),
                'role' => 'user',
            ],
                        [
                'name' => 'User2',
                'email' => 'user2@user.com',
                'password' => bcrypt('1234567890'),
                'role' => 'user',
            ],
            [
                'name' => 'User3',
                'email' => 'user3@user.com',
                'password' => bcrypt('1234567890'),
                'role' => 'user',
            ],
            [
                'name' => 'Organization',
                'email' => 'organization@organization.com',
                'password' => bcrypt('1234567890'),
                'role' => 'organization',
            ],
            [
                'name' => 'Organization2',
                'email' => 'organization2@organization.com',
                'password' => bcrypt('1234567890'),
                'role' => 'organization',
            ],
        ];

        foreach ($users as $user) {
            \App\Models\User::create($user);
        }
    }
}
