import React from "react";
import { FaEquals } from "react-icons/fa";

const FormulaBar = ({ selectedCellRef, formulaInput, handleFormulaChange }) => {
  return (
    <div className="rounded-lg flex items-center bg-white m-3 px-3 py-2 border-b shadow-sm">
      <span className="font-bold text-gray-600 mr-2">{selectedCellRef}</span> {/* ✅ Show cell reference */}
      <FaEquals className="text-gray-500 mr-2" />
      <input
        type="text"
        className="w-full border-none outline-none p-1"
        value={formulaInput}
        onChange={handleFormulaChange}
      />
    </div>
  );
};

export default FormulaBar;
