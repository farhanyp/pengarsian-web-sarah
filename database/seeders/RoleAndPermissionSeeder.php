<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        DB::beginTransaction();
        try {
            // Seed Permissions
            $permissions = [
                'manage-users',
                'manage-roles',
                'view-grades',
                'manage-grades',
                'manage-documents',
                'view-documents',
            ];

            foreach ($permissions as $permission) {
                Permission::findOrCreate($permission, 'web');
            }

            // Seed Roles matching role_type enum values
            $superAdminRole = Role::findOrCreate('SUPERADMIN', 'web');
            $guruRole = Role::findOrCreate('GURU', 'web');
            $kepalaSekolahRole = Role::findOrCreate('KEPALA_SEKOLAH', 'web');

            // Assign Permissions to Roles
            $superAdminRole->givePermissionTo(Permission::all());

            $guruRole->givePermissionTo([
                'view-grades',
                'manage-grades',
                'manage-documents',
                'view-documents',
            ]);

            $kepalaSekolahRole->givePermissionTo([
                'view-grades',
                'view-documents',
            ]);

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error("Seeder failed in RoleAndPermissionSeeder: " . $e->getMessage());
            throw $e;
        }
    }
}
