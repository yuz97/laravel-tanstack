<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::latest()->paginate(5);
        $message = "data berhasil ditampilkan";

        // cara 1
        // return new ProductResource(true, $message, $products);

        // cara 2
        return response()->json([
            "success" => true,
            "message" => $message,
            "data" => ProductResource::collection($products),
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "image" => "sometimes|image|mimes:jpeg,jpg,svg,png,gif|max:2048",
            "title" => "required|unique:products,title",
            "description" => "required",
            "price" => "required",
            "stock" => "required",
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $image = $request->file("image");
        $image->storeAs("products", $image->hashName());

        $product = Product::create([
            "image" => $image->hashName(),
            "title" => $request->title,
            "slug" => Str::slug($request->title),
            "description" => $request->description,
            "price" => $request->price,
            "stock" => $request->stock,
        ]);

        $message = "Data product berhasil ditambahkan";

        return response()->json([
            "success" => true,
            "message" => $message,
            "data" => new ProductResource($product),
        ]);
    }

    public function show(string $slug)
    {
        $product = Product::where("slug", $slug)->firstOrFail();
        $message = "Data product berhasil ditampilkan";

        return response()->json([
            "success" => true,
            "message" => $message,
            "data" => new ProductResource($product),
        ]);
    }

    public function update(Request $request, $slug)
    {
        // find by slug
        $product = Product::where("slug", $slug)->firstOrFail();

        $validator = Validator::make($request->all(), [
            "image" => "sometimes|image|mimes:jpeg,jpg,svg,png,gif|max:2048",
            "title" => "required|unique:products,title," . $product->id . ",id",
            "description" => "required",
            "price" => "required",
            "stock" => "required",
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        //check  if image  exists

        if ($request->hasFile("image")) {
            //delete old image
            Storage::delete("products/" . basename($product->image));

            //upload new image
            $image = $request->file("image");
            $image->storeAs("products", $image->hashName());

            $product->update([
                "image" => $image->hashName(),
                "title" => $request->title,
                "slug" => Str::slug($request->title),
                "description" => $request->description,
                "price" => $request->price,
                "stock" => $request->stock,
            ]);
        } else {
            $product->update([
                "title" => $request->title,
                "slug" => Str::slug($request->title),
                "description" => $request->description,
                "price" => $request->price,
                "stock" => $request->stock,
            ]);
        }

        $message = "Data product berhasil diupdate";
        return response()->json([
            "success" => true,
            "message" => $message,
            "data" => new ProductResource($product),
        ]);
    }

    public function destroy(string $slug)
    {
        $product = Product::where("slug", $slug)->firstOrFail();
        //delete  image
        Storage::delete("products/" . basename($product->image));
        $product->delete();

        $message = "Data product berhasil dihapus";
        return response()->json([
            "success" => true,
            "message" => $message,
        ]);
    }
}
