<?php

use App\Http\Controllers\Api\ApiTokenController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::post("/api-token", ApiTokenController::class);
Route::post("/register", [UserController::class, "register"]);
Route::post("/login", [UserController::class, "login"]);

// get user
Route::middleware("auth:sanctum")->group(function () {
    Route::apiResource("/products", ProductController::class);
    Route::get("/user", [UserController::class, "show"]);
    Route::post("/logout", [UserController::class, "logout"]);
});
