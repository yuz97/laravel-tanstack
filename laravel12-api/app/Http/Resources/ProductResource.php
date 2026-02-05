<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ProductResource extends JsonResource
{
    // cara 1
    // public $status;
    // public $message;
    // public $resource;
    // public function __construct($status, $message, $resource)
    // {
    //     parent::__construct($resource);
    //     $this->status = $status;
    //     $this->message = $message;
    // }
    // public function toArray(Request $request): array
    // {
    //     return [
    //         "success" => $this->status,
    //         "message" => $this->message,
    //         "data" => $this->resource,
    //     ];
    // }
    // cara 2
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            "title" => $this->title,
            "slug" => $this->slug,
            "image" => $this->image,
            "description" => $this->description,
            "price" => $this->price,
            "stock" => $this->stock,
            "created_at" => $this->created_at->format("d F Y"),
            "updated_at" => $this->updated_at->format("d F Y"),
        ];
    }
}
