import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSignIn = async () => {
    let newErrors = { email: "", password: "" };
    let hasError = false;
    setFormError(""); 

    //  Validate input
    if (!email.trim()) {
      newErrors.email = "Please enter your username ...";
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

      //  Không tìm thấy tài khoản
      if (!foundAdmin) {
        setFormError("Incorrect account or password");
        return;
      }

      //  Kiểm tra tài khoản bị khóa
      if (foundAdmin.status === false) {
        setFormError("Your account blocked!, Please contact admin");
        return;
      }

      //  Thành công
      localStorage.setItem("currentAdmin", JSON.stringify(foundAdmin));
      setErrors({ email: "", password: "" });
      navigate("/admin/dashboard");
    } catch (error) {
      setFormError("Cannot connect to server. Please try again later  ");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Financial <span className="text-indigo-600">Manager</span>
          </h1>
          <p className="text-gray-600">Please sign in</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {formError && (
            <p className="text-red-600 text-center font-medium mb-4">
              {formError}
            </p>
          )}

          <div className="space-y-6">
            <div>
              <input
                type="email"
                placeholder={
                  errors.email ? errors.email : "Please enter your username ..."
                }
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors({ ...errors, email: "" });
                }}
                className={`w-full px-4 py-3 border rounded-lg text-sm ${
                  errors.email
                    ? "border-red-500 placeholder-red-500 bg-red-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              />
            </div>

            <div>
              <input
                type="password"
                placeholder={
                  errors.password
                    ? errors.password
                    : "Please enter your password ..."
                }
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors({ ...errors, password: "" });
                }}
                className={`w-full px-4 py-3 border rounded-lg text-sm ${
                  errors.password
                    ? "border-red-500 placeholder-red-500 bg-red-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              />
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                Remember me
              </label>
              <p>
                Don't have an account?{" "}
                <Link to="/login" className="text-indigo-600 hover:underline">
                  click here!
                </Link>
              </p>
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
            <Link to="*" className="text-indigo-600 hover:underline">
              User Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
