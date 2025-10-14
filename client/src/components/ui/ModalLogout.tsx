import React from "react";

interface ModalLogoutProps {
  onClose: () => void;
  onConfirm: () => void;
}

export default function ModalLogout({ onClose, onConfirm }: ModalLogoutProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
        <h3 className="text-lg font-semibold mb-4">Xác nhận đăng xuất</h3>
        <p className="text-gray-600 mb-6">
          Bạn có chắc chắn muốn đăng xuất khỏi hệ thống không?
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
}
