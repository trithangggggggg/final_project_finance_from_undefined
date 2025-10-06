import React, { useState, useEffect } from "react";
import background from "../../images/background.png";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../store/slice/authSlice";
import type { RootState } from "../../store/store";

export default function UserLoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    errorMessage:""
  });

  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, errorMessage } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (formData.username.trim().length >= 3 && formData.password.length >= 6) {
      setSuccessMessage("Sign In Successfully!");
    } else {
      setSuccessMessage("");
    }
  }, [formData]);

  const validateForm = () => {
    let newErrors = { username: "", password: "" };
    let isValid = true;

    if (!formData.username.trim()) {
      newErrors.username = "Please enter your username ...";
      isValid = false;
    } else if (formData.username.length < 3) {
      newErrors.username = "At least 3 characters";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Please enter your password ...";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "At least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");

    if (!validateForm()) return;

    const result = await dispatch(loginUser(formData) as any);
    if (result.meta.requestStatus === "fulfilled") {
      setSuccessMessage("Sign In Successfully!");
      setTimeout(() => navigate("/home"), 700);
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-white p-8 rounded-xl shadow-xl w-96">
        <h2 className="text-2xl font-semibold text-center mb-2">🔐 Sign In</h2>

        {successMessage && (
          <p className="text-green-600 text-center font-medium mb-4">
            {successMessage}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Username here ..."
              className={`w-full px-4 py-3 bg-gray-50 border ${
                errors.username
                  ? "border-red-500 placeholder-red-500"
                  : "border-gray-200"
              } rounded-lg focus:outline-none focus:ring-2 ${
                errors.username ? "focus:ring-red-400" : "focus:ring-blue-400"
              }`}
              value={formData.username}
              onChange={(e) => {
                setFormData({ ...formData, username: e.target.value });
                setErrors((prev) => ({ ...prev, username: "" }));
              }}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password here ..."
              className={`w-full px-4 py-3 bg-gray-50 border ${
                errors.password
                  ? "border-red-500 placeholder-red-500"
                  : "border-gray-200"
              } rounded-lg focus:outline-none focus:ring-2 ${
                errors.password ? "focus:ring-red-400" : "focus:ring-blue-400"
              }`}
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                setErrors((prev) => ({ ...prev, password: "" }));
              }}
            />

            {/* ✅ Nếu login sai: hiển thị Email or password is incorrect */}
            {errorMessage ? (
              <p className="text-red-500 text-sm mt-1">
                Email or password is incorrect
              </p>
            ) : (
              errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Processing..." : "Sign In"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Don't have account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Sign Up Now
          </a>
        </p>
      </div>
    </div>
  );
}
