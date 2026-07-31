<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Role;
class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
     public function run(): void
    {
        $roles = [
            ['name' => 'admin', 'description' => 'Full system access'],
            ['name' => 'staff', 'description' => 'Manage books, stock, and prices'],
            ['name' => 'cashier', 'description' => 'Process transactions only'],
        ];
        foreach ($roles as $role) {
            Role::firstOrCreate(['name' => $role['name']], $role);
        }
    }
}
