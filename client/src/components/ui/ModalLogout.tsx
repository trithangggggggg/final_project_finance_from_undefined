import React from "react";

export default function ModalLogout({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-lg shadow-lg w-[400px]">
        <div className="px-6 pt-4">
          <h3 className="text-lg font-semibold">Xác nhận</h3>
          <p className="text-gray-600 mt-2">
            Bạn có chắc chắn muốn đăng xuất khỏi hệ thống không?
          </p>
        </div>

        <hr className="my-4" />

        <div className="flex justify-end gap-3 px-6 pb-4">
          {/* nút Hủy → đóng modal */}
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Hủy
          </button>

          {/* nút Xóa → gọi onConfirm */}
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}
