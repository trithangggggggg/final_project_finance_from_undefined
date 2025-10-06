import React from "react";

export default function CategoryUser() {
  return (
    <div>
      {/* ===== CATEGORY MANAGEMENT SECTION ===== */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
        {/* Title */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-2xl">💼</span>
          <h2 className="text-xl font-semibold text-gray-800">
            Quản lý danh mục (Theo tháng)
          </h2>
        </div>

        {/* Filter and Add Button */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
            <option>Tên danh mục ⌄</option>
          </select>
          <input
            type="text"
            placeholder="Giới hạn (VND)"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-1 min-w-[200px]"
          />
          <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors">
            Thêm danh mục
          </button>
        </div>

        {/* Category Cards Grid */}
        <div className="flex flex-wrap gap-4">
          {/* Card 1 */}
          <div className="w-[212px] h-[82px] border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-xl">$</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 text-sm truncate">
                Tiền tích lũy
              </h3>
              <p className="text-xs text-gray-500">2.000 $</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="w-[212px] h-[82px] border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-xl">$</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 text-sm truncate">
                Tiền tích lũy
              </h3>
              <p className="text-xs text-gray-500">2.000 $</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="w-[212px] h-[82px] border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-xl">$</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 text-sm truncate">
                Tiền tích lũy
              </h3>
              <p className="text-xs text-gray-500">2.000 $</p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="w-[212px] h-[82px] border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-xl">$</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 text-sm truncate">
                Tiền tích lũy
              </h3>
              <p className="text-xs text-gray-500">2.000 $</p>
            </div>
          </div>

          {/* Card 5 */}
          <div className="w-[212px] h-[82px] border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-xl">$</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 text-sm truncate">
                Tiền tích lũy
              </h3>
              <p className="text-xs text-gray-500">2.000 $</p>
            </div>
          </div>

          {/* Card 6 */}
          <div className="w-[212px] h-[82px] border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-xl">$</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 text-sm truncate">
                Tiền tích lũy
              </h3>
              <p className="text-xs text-gray-500">2.000 $</p>
            </div>
          </div>

          {/* Card 7 */}
          <div className="w-[212px] h-[82px] border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-xl">$</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 text-sm truncate">
                Tiền tích lũy
              </h3>
              <p className="text-xs text-gray-500">2.000 $</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
