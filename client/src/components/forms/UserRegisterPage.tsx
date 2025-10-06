import React, { useState, useEffect } from "react";
import axios from "axios";
import background from "../../images/background.png";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../store/slice/authSlice";
import type { RootState } from "../../store/store";

export default function UserRegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (
      formData.email.trim().length >= 3 &&
      formData.password.length >= 6 &&
      formData.confirmPassword === formData.password
    ) {
      setSuccessMessage("Sign Up Successfully!");
    } else {
      setSuccessMessage("");
    }
  }, [formData]);

  const validateForm = () => {
    let newErrors = { email: "", password: "", confirmPassword: "" };
    let isValid = true;

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!formData.email.endsWith("@gmail.com")) {
      newErrors.email = "Email must end with @gmail.com";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "At least 6 characters";
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm password";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await axios.get(`http://localhost:8080/users?email=${formData.email}`);

      if (res.data.length > 0) {
        setErrors({ ...errors, email: "Email already exists" });
        setSuccessMessage("");
        return;
      }

      dispatch(registerUser(formData) as any);
      setSuccessMessage("Sign Up Successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: "" });
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
        <h2 className="text-2xl font-semibold text-center mb-2">Sign Up</h2>

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
                errors.email
                  ? "border-red-500 placeholder-red-500"
                  : "border-gray-200"
              } rounded-lg focus:outline-none focus:ring-2 ${
                errors.email ? "focus:ring-red-400" : "focus:ring-green-400"
              }`}
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
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
                errors.password ? "focus:ring-red-400" : "focus:ring-green-400"
              }`}
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Confirm password here ..."
              className={`w-full px-4 py-3 bg-gray-50 border ${
                errors.confirmPassword
                  ? "border-red-500 placeholder-red-500"
                  : "border-gray-200"
              } rounded-lg focus:outline-none focus:ring-2 ${
                errors.confirmPassword
                  ? "focus:ring-red-400"
                  : "focus:ring-green-400"
              }`}
              value={formData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            {loading ? "Processing..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          You have account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
