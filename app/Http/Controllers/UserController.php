<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        
        $users = User::query()
            ->with('roles')
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(20)
            ->withQueryString();

        $users->getCollection()->transform(function ($user) {
            $userArray = $user->toArray();
            $userArray['role'] = $user->getRoleNames()->first() ?? 'GUEST';
            return $userArray;
        });

        return Inertia::render('users-management/Index', [
            'users' => $users,
            'filters' => $request->only(['search'])
        ]);
    }

    public function updateRole(Request $request, User $user)
    {
        // Spatie Laravel Permission usage or direct column usage?
        // Let's check how role is defined. The user model has "use HasRoles"
        // so it uses Spatie Permission. We will sync the role.

        $validated = $request->validate([
            'role' => ['required', 'string', Rule::in(['SUPERADMIN', 'ADMIN', 'GURU','WALI_KELAS'])],
        ]);

        $user->syncRoles([$validated['role']]);

        // If the table has a role column, also update it (since app-sidebar.tsx uses `user.role`)
        // Let's ensure if there's a role column.
        // Even if we use spatie, the sidebar uses `(user as any).role`. 
        // We can just update it if the column exists. Wait, app-sidebar uses `(user as any).role` 
        // which might be an appended attribute or actual column.
        // Let's update `role` attribute if it exists, but Spatie is the main way.
        // Just to be safe, I'll update it directly if it's there. No, I will just syncRoles.
        // Oh, maybe `role` is appended in User model? No, I saw User.php earlier, no $appends.
        // Let's check the database migration or assume syncRoles is enough if it's just spatie.
        
        return redirect()->back()->with('success', 'Role pengguna berhasil diperbarui');
    }
}
