import React from "react";

export default function InfomationUser() {
  return (
    <div>
      <div className="bg-[#f7f7f9] p-6 md:p-8 ">
        {/* Title */}
        <h2 className="text-2xl font-semibold text-indigo-600 text-center mb-6">
          Quản Lý Thông tin cá nhân
        </h2>

        {/* Form */}
        <div className="space-y-4">
          {/* Row 1: Name & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                defaultValue="Nguyen Van A"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                defaultValue="nguyenvana@gmail.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Row 2: Phone & Gender */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                defaultValue="0987654321"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                defaultValue="Male"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <button className="w-full px-6 py-2.5 border-2 border-indigo-600 text-indigo-600 bg-[#F4F2FD] font-medium rounded-lg hover:bg-[#F4F2FD] transition-colors">
              Change Information
            </button>
            <button className="w-full px-6 py-2.5 border-2 border-indigo-600 text-indigo-600 bg-[#F4F2FD] font-medium rounded-lg hover:bg-[#F4F2FD] transition-colors">
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
