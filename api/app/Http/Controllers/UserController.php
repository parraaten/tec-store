<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{

    // Obtener todos los usuarios (excepto contraseñas)
    public function index()
    {
        return User::all()->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at
            ];
        });
    }

    // Eliminar un usuario
    public function destroy($id)
    {
        // Evitar que el admin se elimine a sí mismo
        if ($id == 1) {
            return response()->json([
                'message' => 'No puedes eliminar al usuario administrador principal'
            ], 403);
        }

        $user = User::findOrFail($id);
        $user->delete();

        return response()->json([
            'message' => 'Usuario eliminado exitosamente'
        ], 204);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:6'
        ]);

        $user = $request->user();

        // Verificar contraseña actual
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'La contraseña actual es incorrecta'
            ], 401);
        }

        // Evitar cambios en el admin principal (ID 1)
        if ($user->id == 1) {
            return response()->json([
                'message' => 'No puedes cambiar la contraseña del administrador principal'
            ], 403);
        }

        // Actualizar contraseña
        $user->update([
            'password' => Hash::make($request->new_password)
        ]);
        
        $user->tokens()->delete();

        return response()->json([
            'message' => 'Contraseña actualizada exitosamente'
        ]);
    }
}
