<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function register(Request $request)
    {
        //  Validate input
        $validator = Validator::make($request->all(), [
            "name" => "required|string|max:255",
            "email" => "required|email|unique:users,email",
            "password" => "required|string|min:8|confirmed", // password_confirmation required
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        //  Create user
        $user = User::create([
            "name" => $request->name,
            "email" => $request->email,
            "password" => Hash::make($request->password),
        ]);

        //  Create token
        $token = $user->createToken("tokenApi")->plainTextToken;

        //  Return response
        return response()->json(
            [
                "user" => $user,
                "token" => $token,
            ],
            201,
        );
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "email" => "required|email",
            "password" => "required",
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = Auth::attempt($request->only("email", "password"));
        if (! $user) {
            return response()->json(
                [
                    "message" => "invalid credentials",
                ],
                401,
            );
        }
        $user = Auth::user();
        $token = $user->createToken("tokenApi")->plainTextToken;

        // REMOVE this line if using sanctum
        // $request->session()->regenerate();

        return response()->json([
            "user" => Auth::user(),
            "token" => $token,
        ]);
    }

    public function logout(Request $request)
    {
        // Delete the token that was used for this request
        $request
            ->user()
            ->currentAccessToken()
            ->delete();
        return response()->json([
            "message" => "Logged out",
        ]);
    }

    public function show(Request $request)
    {
        return $request->user();
    }
}
