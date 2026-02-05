import React from "react";
import { Route, Routes } from "react-router";
import Home from "../views/home";
import ProductIndex from "../views/products";
import ProductCreate from "../views/products/create";
import ProductEdit from "../views/products/edit";
import Login from "../views/auth/login";
import PrivateRoute from "../components/PrivateRoute"; //using private route to protected the pages
import Register from "../views/auth/register";

export default function RoutesIndex() {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route
        path="/products"
        element={
          <PrivateRoute>
            <ProductIndex />
          </PrivateRoute>
        }
      ></Route>
      <Route
        path="/products/create"
        element={
          <PrivateRoute>
            <ProductCreate />
          </PrivateRoute>
        }
      ></Route>
      <Route
        path="/products/edit/:slug"
        element={
          <PrivateRoute>
            <ProductEdit />
          </PrivateRoute>
        }
      ></Route>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/register" element={<Register />}></Route>
    </Routes>
  );
}
