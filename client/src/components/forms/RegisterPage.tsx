// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import type { Users } from "../../utils/type";
// import axios from "axios";

// export default function RegisterPage() {
//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     phone: "",
//     gender: true,
//   });
//   const [errors, setErrors] = useState({
//     fullName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     phone: "",
//   });

//   const navigate = useNavigate();

//   const validateForm = () => {
//     const newErrors = {
//       fullName: "",
//       email: "",
//       password: "",
//       confirmPassword: "",
//       phone: "",
//     };
//     let isValid = true;

//     if (!formData.fullName.trim()) {
//       newErrors.fullName = "Full name is required"; // Yêu cầu phải điền họ và tên đầy đủ
//       isValid = false;
//       // } else if (formData.fullName.length < 3) {
//       //   newErrors.fullName = 'Full name must be at least 3 characters';//Họ và tên phải có ít nhất 3 ký tự
//       //   isValid = false;
//     }

//     if (!formData.email.trim()) {
//       newErrors.email = "Email is required"; // Yêu cầu điền email
//       isValid = false;
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = "Email is invalid"; // email không đúng định dạng
//       isValid = false;
//     }

//     if (!formData.password) {
//       newErrors.password = "Password is required"; // mật khẩu không được để trốg
//       isValid = false;
//     } else if (formData.password.length < 6) {
//       newErrors.password = "Password must be at least 6 characters"; //Mật khẩu tối thiểu 6 ký tự trở lên
//       isValid = false;
//     }

//     if (!formData.confirmPassword) {
//       newErrors.confirmPassword = "Please confirm your password";
//       isValid = false;
//     } else if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = "Passwords do not match";
//       isValid = false;
//     }

//     if (!formData.phone.trim()) {
//       newErrors.phone = "Phone number is required";
//       isValid = false;
//     } else if (!/^[0-9]{10,11}$/.test(formData.phone)) {
//       newErrors.phone = "Phone number must be 10-11 digits";
//       isValid = false;
//     }

//     setErrors(newErrors);
//     return isValid;
//   };

//   const handleRegister = async () => {
//     if (validateForm()) {
//       const newUser: Users = {
//         id: Date.now(),
//         fullName: formData.fullName,
//         email: formData.email,
//         password: formData.password,
//         phone: formData.phone,
//         gender: formData.gender,
//         status: true,
//       };

//       try {
//         await axios.post("http://localhost:8080/users", newUser);
//         alert("Đăng kí thành công ! ");
//         setTimeout(() => {
//           navigate("/");
//         }, 1000);
//       } catch (error) {
//         console.log("Error saving user:", error);
//         alert("Đăng kí thất bại, thử lại sau!");
//       }
//     }
//   };

//   const handleInputChange = (field: string, value: string | boolean) => {
//     setFormData({ ...formData, [field]: value });
//     if (errors[field as keyof typeof errors]) {
//       setErrors({ ...errors, [field]: "" });
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold mb-2">
//             Financial <span className="text-indigo-600">Manager</span>
//           </h1>
//           <p className="text-gray-600">Create your account</p>
//         </div>

//         <div className="bg-white rounded-2xl shadow-xl p-8">
//           <div className="space-y-5">
//             {/* Full Name */}
//             <div>
//               <input
//                 type="text"
//                 placeholder="Please enter your full name ..."
//                 value={formData.fullName}
//                 onChange={(e) => handleInputChange("fullName", e.target.value)}
//                 className={`w-full px-4 py-3 bg-gray-50 border ${
//                   errors.fullName ? "border-red-500 placeholder-red-500 " : "border-gray-200"
//                 } rounded-lg`}
//               />
//               {errors.fullName && (
//                 <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
//               )}
//             </div>

//             {/* Email */}
//             <div>
//               <input
//                 type="email"
//                 placeholder="Please enter your email ..."
//                 value={formData.email}
//                 onChange={(e) => handleInputChange("email", e.target.value)}
//                 className={`w-full px-4 py-3 bg-gray-50 border ${
//                   errors.email ? "border-red-500 placeholder-red-500 " : "border-gray-200"
//                 } rounded-lg`}
//               />
//               {errors.email && (
//                 <p className="text-red-500 text-sm mt-1">{errors.email}</p>
//               )}
//             </div>

//             {/* Phone */}
//             <div>
//               <input
//                 type="tel"
//                 placeholder="Please enter your phone number ..."
//                 value={formData.phone}
//                 onChange={(e) => handleInputChange("phone", e.target.value)}
//                 className={`w-full px-4 py-3 bg-gray-50 border ${
//                   errors.phone ? "border-red-500 placeholder-red-500 " : "border-gray-200"
//                 } rounded-lg`}
//               />
//               {errors.phone && (
//                 <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
//               )}
//             </div>

//             {/* Gender */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Gender
//               </label>
//               <div className="flex gap-4">
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     name="gender"
//                     checked={formData.gender === true}
//                     onChange={() => handleInputChange("gender", true)}
//                   />
//                   <span className="ml-2">Male</span>
//                 </label>
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     name="gender"
//                     checked={formData.gender === false}
//                     onChange={() => handleInputChange("gender", false)}
//                   />
//                   <span className="ml-2">Female</span>
//                 </label>
//               </div>
//             </div>

//             {/* Password */}
//             <div>
//               <input
//                 type="password"
//                 placeholder="Please enter your password ..."
//                 value={formData.password}
//                 onChange={(e) => handleInputChange("password", e.target.value)}
//                 className={`w-full px-4 py-3 bg-gray-50 border ${
//                   errors.password ? "border-red-500 placeholder-red-500" : "border-gray-200"
//                 } rounded-lg`}
//               />
//               {errors.password && (
//                 <p className="text-red-500 text-sm mt-1">{errors.password}</p>
//               )}
//             </div>

//             {/* Confirm Password */}
//             <div>
//               <input
//                 type="password"
//                 placeholder="Please confirm your password ..."
//                 value={formData.confirmPassword}
//                 onChange={(e) =>
//                   handleInputChange("confirmPassword", e.target.value)
//                 }
//                 className={`w-full px-4 py-3 bg-gray-50 border ${
//                   errors.confirmPassword ? "border-red-500 placeholder-red-500" : "border-gray-200"
//                 } rounded-lg`}
//               />
//               {errors.confirmPassword && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.confirmPassword}
//                 </p>
//               )}
//             </div>

//             {/* Sign In Link */}
//             <div className="text-sm text-center">
//               <span className="text-gray-600">Already have an account? </span>
//               <Link
//                 to="/"
//                 className="text-indigo-600 hover:text-indigo-700 font-medium"
//               >
//                 Click here!
//               </Link>
//             </div>

//             {/* Register Button */}
//             <button
//               onClick={handleRegister}
//               className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-lg"
//             >
//               Register
//             </button>
//           </div>
//         </div>

//         <div className="text-center mt-6">
//           <p className="text-gray-500 text-sm">© 2025 - Rikkei Education</p>
//         </div>
//       </div>
//     </div>
//   );
// }
