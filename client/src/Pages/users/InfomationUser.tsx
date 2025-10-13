import { X, Clipboard } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:8080";

export default function InfomationUser() {
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);

  // user hiện tại (lấy từ localStorage như app của bạn đang dùng)
  const [user, setUser] = useState<any>(null);

  // form đổi thông tin
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(""); // không cho sửa
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState<"" | "Male" | "Female">("");

  // lỗi validate info
  const [infoErrors, setInfoErrors] = useState<{ [k: string]: string }>({});

  // form đổi pass
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  // lỗi validate password
  const [passErrors, setPassErrors] = useState<{ [k: string]: string }>({});

  useEffect(() => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
      if (currentUser?.id) {
        setUser(currentUser);
        // Prefill form info
        setFullName(currentUser.fullName || "");
        setEmail(currentUser.email || "");
        setPhone(currentUser.phone || "");
        setGender(
          currentUser.gender === "Male" || currentUser.gender === "Female"
            ? currentUser.gender
            : ""
        );
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleChangeInfo = () => {
    setIsInfoModalOpen(true);
    setIsPassModalOpen(false);
  };

  const handleChangePass = () => {
    setIsPassModalOpen(true);
    setIsInfoModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsInfoModalOpen(false);
    setIsPassModalOpen(false);
    setInfoErrors({});
    setPassErrors({});
  };

  // ===== Validate đơn giản, dễ dùng =====
  const validateInfo = () => {
    const e: { [k: string]: string } = {};
    if (!fullName.trim()) e.fullName = "Vui lòng nhập tên";
    if (!email.trim()) e.email = "Vui lòng nhập email";
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Email không hợp lệ";
    if (!phone.trim()) e.phone = "Vui lòng nhập số điện thoại";
    else if (!/^\d{9,11}$/.test(phone)) e.phone = "Số điện thoại phải 9-11 chữ số";
    if (!gender) e.gender = "Vui lòng chọn giới tính";
    setInfoErrors(e);
    return Object.keys(e).length === 0;
  };

  const validatePass = () => {
    const e: { [k: string]: string } = {};
    if (!oldPass) e.oldPass = "Vui lòng nhập mật khẩu cũ";
    if (!newPass) e.newPass = "Vui lòng nhập mật khẩu mới";
    else if (newPass.length < 6) e.newPass = "Mật khẩu tối thiểu 6 ký tự";
    if (!confirmPass) e.confirmPass = "Vui lòng nhập lại mật khẩu";
    else if (confirmPass !== newPass) e.confirmPass = "Mật khẩu nhập lại không khớp";
    setPassErrors(e);
    return Object.keys(e).length === 0;
  };

  // ====== Lưu thay đổi thông tin ======
  const handleSaveInfo = async () => {
    if (!user?.id) return;
    if (!validateInfo()) return;

    try {
      // PATCH user
      const payload = {
        fullName: fullName.trim(),
        phone: phone.trim(),
        gender,
        status: user.status ?? true, // giữ nguyên true nếu đang true
        // email không sửa ở đây (để tránh đổi unique)
      };
      const { data } = await axios.patch(`${BASE_URL}/users/${user.id}`, payload);

      // Cập nhật localStorage currentUser
      const updated = { ...user, ...data, email: user.email };
      localStorage.setItem("currentUser", JSON.stringify(updated));
      setUser(updated);

      setIsInfoModalOpen(false);
      setInfoErrors({});
    } catch (error) {
      console.error(error);
    }
  };

  // ====== Lưu thay đổi mật khẩu ======
  const handleSavePass = async () => {
    if (!user?.id) return;
    if (!validatePass()) return;

    try {
      // Kiểm tra oldPass có trùng không (demo: so sánh với user.password)
      if (user.password !== oldPass) {
        setPassErrors({ oldPass: "Mật khẩu cũ không đúng" });
        return;
      }

      const { data } = await axios.patch(`${BASE_URL}/users/${user.id}`, {
        password: newPass,
      });

      // Cập nhật local user
      const updated = { ...user, ...data };
      localStorage.setItem("currentUser", JSON.stringify(updated));
      setUser(updated);

      // Reset + đóng modal
      setOldPass("");
      setNewPass("");
      setConfirmPass("");
      setPassErrors({});
      setIsPassModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="bg-[#f7f7f9] p-6 md:p-8 ">
        {/* Title */}
        <h2 className="text-2xl font-semibold text-indigo-600 text-center mb-6">
          Quản Lý Thông tin cá nhân
        </h2>

        {/* Form (giữ UI như bạn) */}
        <div className="space-y-4">
          {/* Name & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Nguyen Van A"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {infoErrors.fullName && (
                <p className="text-xs text-red-600 mt-1">{infoErrors.fullName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="nguyenvana@gmail.com"
                value={email}
                disabled // không cho đổi ở đây
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
              {infoErrors.email && (
                <p className="text-xs text-red-600 mt-1">{infoErrors.email}</p>
              )}
            </div>
          </div>

          {/* Phone & Gender */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                placeholder="0987654321"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {infoErrors.phone && (
                <p className="text-xs text-red-600 mt-1">{infoErrors.phone}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as "Male" | "Female" | "")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {infoErrors.gender && (
                <p className="text-xs text-red-600 mt-1">{infoErrors.gender}</p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <button
              className="w-full px-6 py-2.5 border-2 border-indigo-600 text-indigo-600 bg-[#F4F2FD] font-medium rounded-lg hover:bg-[#EDEBFE] transition-colors"
              onClick={handleChangeInfo}
            >
              Change Information
            </button>
            <button
              className="w-full px-6 py-2.5 border-2 border-indigo-600 text-indigo-600 bg-[#F4F2FD] font-medium rounded-lg hover:bg-[#EDEBFE] transition-colors"
              onClick={handleChangePass}
            >
              Change Password
            </button>
          </div>
        </div>
      </div>

      {/* Modal Change Information */}
      {isInfoModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <header className="flex">
              <h3 className="text-lg font-semibold">Change Information</h3>
              <span
                className="absolute top-5 right-7 text-gray-500 cursor-pointer"
                onClick={handleCloseModal}
              >
                <X />
              </span>
            </header>

            <div className="mt-3">
              <label>Name <span className="text-red-600">*</span></label>
              <input
                type="text"
                placeholder="Nguyen Van A"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="border w-[99%] rounded-lg border-gray-300 p-2 focus:outline-none"
              />
              {infoErrors.fullName && (
                <p className="text-xs text-red-600 mt-1">{infoErrors.fullName}</p>
              )}

              <label>Email <span className="text-red-600">*</span></label>
              <input
                type="text"
                placeholder="nguyenvana@gmail.com"
                value={email}
                disabled
                className="border w-[99%] rounded-lg border-gray-300 p-2 bg-gray-100 cursor-not-allowed focus:outline-none"
              />
              {infoErrors.email && (
                <p className="text-xs text-red-600 mt-1">{infoErrors.email}</p>
              )}

              <label>Phone <span className="text-red-600">*</span></label>
              <input
                type="text"
                placeholder="0123456789"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border w-[99%] rounded-lg border-gray-300 p-2 focus:outline-none"
              />
              {infoErrors.phone && (
                <p className="text-xs text-red-600 mt-1">{infoErrors.phone}</p>
              )}

              <label>Gender <span className="text-red-600">*</span></label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as "Male" | "Female" | "")}
                className="border w-[99%] rounded-lg border-gray-300 p-2 cursor-pointer focus:outline-none"
              >
                <option value="">Select gender</option>
                <option>Male</option>
                <option>Female</option>
              </select>
              {infoErrors.gender && (
                <p className="text-xs text-red-600 mt-1">{infoErrors.gender}</p>
              )}

              <hr className="mt-4 mb-4 text-gray-300" />
              <div className="flex justify-end">
                <button
                  className="border rounded-md border-gray-300 m-3 px-3 py-1.5 cursor-pointer"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  className="border rounded-md border-gray-300 m-3 px-3 py-1.5 bg-[#4338CA] text-white cursor-pointer"
                  onClick={handleSaveInfo}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Change Password */}
      {isPassModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <header className="flex">
              <h3 className="text-lg font-semibold">Change Password</h3>
              <span
                className="absolute top-5 right-7 text-gray-500 cursor-pointer"
                onClick={handleCloseModal}
              >
                <X />
              </span>
            </header>

            <div className="mt-3">
              <label>Old Password <span className="text-red-600">*</span></label>
              <input
                type="password"
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                className="border w-[99%] rounded-lg border-gray-300 p-2 focus:outline-none"
              />
              {passErrors.oldPass && (
                <p className="text-xs text-red-600 mt-1">{passErrors.oldPass}</p>
              )}

              <label className="mt-3 block">
                New Password <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="border w-[99%] rounded-lg border-gray-300 p-2 focus:outline-none"
                />
                <Clipboard
                  className="absolute right-3 top-2.5 text-gray-400 cursor-pointer"
                  onClick={() => {
                    navigator.clipboard?.writeText(newPass);
                  }}
                />
              </div>
              {passErrors.newPass && (
                <p className="text-xs text-red-600 mt-1">{passErrors.newPass}</p>
              )}

              <label className="mt-3 block">
                Confirm New Password <span className="text-red-600">*</span>
              </label>
              <input
                type="password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                className="border w=[99%] rounded-lg border-gray-300 p-2 focus:outline-none"
              />
              {passErrors.confirmPass && (
                <p className="text-xs text-red-600 mt-1">{passErrors.confirmPass}</p>
              )}

              <hr className="mt-4 mb-4 text-gray-300" />
              <div className="flex justify-end">
                <button
                  className="border rounded-md border-gray-300 m-3 px-3 py-1.5 cursor-pointer"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  className="border rounded-md border-gray-300 m-3 px-3 py-1.5 bg-[#4338CA] text-white cursor-pointer"
                  onClick={handleSavePass}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
