<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    // Obtener todos los productos
    public function index()
    {
        return Product::all();
    }

    // Crear un producto
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $data = $request->except('image');

        if ($request->hasFile('image')) {
            // Guardar la imagen en storage/app/public/products
            $path = $request->file('image')->store('products', 'public');

            // Guardar la URL pública de la imagen
            $data['image'] = asset("storage/$path");
        }

        $product = Product::create($data);

        return response()->json([
            'message' => 'Producto creado exitosamente',
            'product' => $product
        ], 201);
    }

    // Obtener un producto específico
    public function show($id)
    {
        $product = Product::findOrFail($id);
        return response()->json($product);
    }

    // Actualizar un producto
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|numeric|min:0',
            'stock' => 'sometimes|integer|min:0',
            'image' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $data = $request->except(['image', '_method']);

        try {
            if ($request->hasFile('image')) {
                // Eliminar imagen anterior si existe
                if ($product->image) {
                    $oldImagePath = str_replace(asset('storage/'), '', $product->image);
                    Storage::disk('public')->delete($oldImagePath);
                }

                // Guardar la nueva imagen
                $path = $request->file('image')->store('products', 'public');
                $data['image'] = asset("storage/$path");
            }

            $product->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Producto actualizado exitosamente',
                'product' => $product
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el producto',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Eliminar un producto
    public function destroy($id)
    {
        $product = Product::findOrFail($id);

        // Eliminar imagen asociada si existe
        if ($product->image) {
            $imagePath = str_replace(asset('storage/'), '', $product->image);
            Storage::disk('public')->delete($imagePath);
        }

        $product->delete();

        return response()->json([
            'message' => 'Producto eliminado exitosamente'
        ], 204);
    }
}
