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
}