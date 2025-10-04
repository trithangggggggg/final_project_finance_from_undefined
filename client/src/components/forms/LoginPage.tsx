import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSignIn = async () => {
    let newErrors = { email: "", password: "" };
    let hasError = false;

    if (!email.trim()) {
      newErrors.email = "Please enter your email ...";
      hasError = true;
    }

    if (!password.trim()) {
      newErrors.password = "Please enter your password ...";
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) return;

    try {
      const res = await axios.get("http://localhost:8080/admin");
      const foundAdmin = res.data.find(
        (a: any) => a.email === email && a.password === password
      );

      if (foundAdmin) {
        localStorage.setItem("admin", JSON.stringify(foundAdmin));
        navigate("/admin/dashboard");
      } else {
        setErrors({
          email: "",
          password: "Invalid email or password!",
        });
      }
    } catch (error) {
      console.error("Error connecting to server:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Financial <span className="text-indigo-600">Manager</span>
          </h1>
          <p className="text-gray-600">Admin Login</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="space-y-6">
            <div>
              <input
                type="email"
                placeholder="Enter your email ..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 bg-gray-50 border ${
                  errors.email ? "border-red-500" : "border-gray-200"
                } rounded-lg`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                placeholder="Enter your password ..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 bg-gray-50 border ${
                  errors.password ? "border-red-500" : "border-gray-200"
                } rounded-lg`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <button
              onClick={handleSignIn}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-lg"
            >
              Sign in
            </button>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            © 2025 - Rikkei Education |{" "}
            <Link to="/login" className="text-indigo-600 hover:underline">
              User Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
