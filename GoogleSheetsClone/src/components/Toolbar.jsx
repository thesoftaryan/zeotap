import React, { useState } from "react";
import { FaBold, FaItalic, FaPaintBrush,FaPalette,FaDownload } from "react-icons/fa";
import { MdAdd, MdRemove } from "react-icons/md";
import * as XLSX from "xlsx"; 
import sheetsIcon from "../assets/sheetsIcon.png"; // Adjust the path as needed
const Toolbar = ({ sheetData,applyFormatting, formatting, addRow, addColumn, deleteRow, deleteColumn}) => {
  const [showFontColorPicker, setShowFontColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [fileName, setFileName] = useState("Untitled Spreadsheet");


  const handleDownload = () => {
    const ws = XLSX.utils.aoa_to_sheet(sheetData); // Convert data to sheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Download the file
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  return (
    <>

{/* File Name */}
<div className="my-4 mx-4 flex items-center justify-between pb-2">
  {/* Left Side: Icon + File Name Input */}
  <div className="flex items-center gap-2">
    <img src={sheetsIcon} alt="Sheets Icon" className="w-9 h-9" /> {/* Icon */}
    <input
      type="text"
      className="text-lg font-semibold px-2 py-1 border border-transparent focus:border-gray-300 rounded-md bg-transparent focus:outline-none"
      value={fileName}
      onChange={(e) => setFileName(e.target.value)}
    />
  </div>

  {/* Right Side: Download Button */}
  <button className="px-3 py-1 rounded hover:bg-gray-200 flex items-center gap-1" onClick={handleDownload}>
    <FaDownload className="text-lg" /> Download
  </button>
</div>
    <div className="relative w-full">
      {/* Floating Color Pickers */}
      {showFontColorPicker && (
        <input
          type="color"
          className="absolute left-5 top-[-40px] w-8 h-8 cursor-pointer z-50"
          onChange={(e) => {
            applyFormatting("color", e.target.value);
            setShowFontColorPicker(false);
          }}
        />
      )}
      {showBgColorPicker && (
        <input
          type="color"
          className="absolute left-16 top-[-40px] w-8 h-8 cursor-pointer z-50"
          onChange={(e) => {
            applyFormatting("bgColor", e.target.value);
            setShowBgColorPicker(false);
          }}
        />
      )}

      {/* Toolbar */}
      <div className="rounded-lg m-3 flex flex-wrap items-center gap-2 bg-gray-50 px-3 py-2 border-b shadow-sm text-sm w-full">
        {/* Formatting Controls */}
        <div className="flex gap-1 border-r pr-2">
          <button
            className={`px-2 py-1 rounded hover:bg-gray-200 flex items-center ${formatting?.bold ? "bg-gray-300" : ""}`}
            onClick={() => applyFormatting("bold", !formatting?.bold)}
          >
            <FaBold className="text-lg" />
          </button>
          <button
            className={`px-2 py-1 rounded hover:bg-gray-200 flex items-center ${formatting?.italic ? "bg-gray-300" : ""}`}
            onClick={() => applyFormatting("italic", !formatting?.italic)}
          >
            <FaItalic className="text-lg" />
          </button>
        </div>

        {/* Color Controls */}
        <div className="relative flex items-center gap-2 border-r pr-2">
          <button
            className="px-2 py-1 rounded hover:bg-gray-200 flex items-center gap-1"
            onClick={() => setShowFontColorPicker(!showFontColorPicker)}
          >
            <FaPalette className="text-lg" />
          </button>

          <button
            className="px-2 py-1 rounded hover:bg-gray-200 flex items-center gap-1"
            onClick={() => setShowBgColorPicker(!showBgColorPicker)}
          >
            <FaPaintBrush className="text-lg" />
          </button>
        </div>

        {/* Font Size Dropdown */}
        <p className="text-sm">Font Size</p>
        <select
          className="border px-2 py-1 text-sm rounded-md bg-white shadow-sm"
          onChange={(e) => applyFormatting("fontSize", e.target.value)}
          value={formatting?.fontSize || "12px"}
        >
          {[10, 12, 14, 16, 18, 20, 22, 24].map((size) => (
            <option key={size} value={`${size}px`}>{size}</option>
          ))}
        </select>

        {/* Row & Column Controls */}
        <div className="flex gap-1 border-r pr-2">
          <button className="px-2 py-1 rounded hover:bg-gray-200 flex items-center gap-1" onClick={addRow}>
            <MdAdd /> Row
          </button>
          <button className="px-2 py-1 rounded hover:bg-gray-200 flex items-center gap-1" onClick={addColumn}>
            <MdAdd /> Column
          </button>
          <button className="px-2 py-1 rounded hover:bg-gray-200 flex items-center gap-1" onClick={deleteRow}>
            <MdRemove /> Row
          </button>
          <button className="px-2 py-1 rounded hover:bg-gray-200 flex items-center gap-1" onClick={deleteColumn}>
            <MdRemove /> Column
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default Toolbar;
