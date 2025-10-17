import React, { useState, useEffect } from "react";
import { X, Upload, Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { addCategory, updateCategory } from "../../store/slice/adminCategory";
import type { Category } from "../../utils/type";
import axios from "axios";

interface AddCategoryModalProps {
  onClose: () => void;
  category?: Category | null;
}

export default function AddCategoryModal({
  onClose,
  category,
}: AddCategoryModalProps) {
  const dispatch: any = useDispatch();
  const [categoryName, setCategoryName] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Điền sẵn thông tin khi edit
  useEffect(() => {
    if (category) {
      setCategoryName(category.name);
      setPreview(category.image || null);
    }
  }, [category]);

  //  Upload ảnh lên Cloudinary
  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "categoryProject");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/diprwc5iy/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    if (!data.secure_url)
      throw new Error(data?.error?.message || "Upload thất bại!");
    return data.secure_url;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setUploadedFile(null);
    setPreview(null);
  };

  const handleSave = async () => {
    if (!categoryName.trim()) return;
    // const res = await axios.get("http://localhost:8080/categories");
    // const isExist = res.data.find(
    //   (item: {name:string}) => item.name.trim().toLowerCase() === categoryName.trim().toLowerCase()
    // );
    // if (isExist) {
    //   alert("Danh mục này đã tồn tại!");
    //   return;
    // }
    try {
      setLoading(true);
      let imageUrl = preview;
      if (uploadedFile) {
        imageUrl = await uploadToCloudinary(uploadedFile);
      }

      if (category) {
        // Cập nhật
        await dispatch(
          updateCategory({
            id: category.id,
            name: categoryName.trim(),
            image: imageUrl || "",
          })
        );
      } else {
        // Thêm mới
        await dispatch(
          addCategory({ name: categoryName.trim(), image: imageUrl || "" })
        );
      }

      onClose();
    } catch (error) {
      console.error("Lỗi khi lưu danh mục:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-auto overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {category ? "Edit Category" : "Add Category"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="flex items-center justify-center w-full px-4 py-3 bg-orange-500 text-white rounded-lg cursor-pointer hover:bg-orange-600 transition-colors">
              <Upload size={20} className="mr-2" />
              <span className="font-medium">Upload Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          {preview && (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 border border-gray-200 rounded overflow-hidden">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm text-gray-700">
                  {uploadedFile?.name || "Current image"}
                </span>
              </div>
              <button
                onClick={handleRemoveImage}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className={`px-6 py-2 rounded-lg text-white font-medium ${
              loading
                ? "bg-orange-300 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600"
            }`}
          >
            {loading ? "Saving..." : category ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
