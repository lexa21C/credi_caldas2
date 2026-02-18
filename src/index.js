/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or bstantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ProtectedRoute } from "components/protected/proyecyedRoute.jsx";
import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";
import axios from "axios";
import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";
import { UserProvider } from "context/userContext";
//axios.defaults.baseURL = "http://127.0.0.1:8000/"
axios.defaults.baseURL = "https://lexa2023.pythonanywhere.com/"
const root = ReactDOM.createRoot(document.getElementById("root"));


root.render(
  <BrowserRouter>
    <UserProvider>
      <Routes>
        {/* Ruta protegida para Admin */}
        <Route path="/admin/*" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        } />
        
        {/* Ruta para autenticación */}
        <Route path="/auth/*" element={<AuthLayout />} />
        
        {/* Ruta por defecto para redirigir a /auth/login */}
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </UserProvider>
  </BrowserRouter>
);