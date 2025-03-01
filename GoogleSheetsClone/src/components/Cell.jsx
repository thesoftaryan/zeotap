import React from "react";

const Cell = ({ row, col, value, formatting, onChange, selected, handleMouseDown, handleMouseEnter, handleMouseUp }) => {
  return (
    <td
      className={`border hover:bg-blue-100 relative ${selected ? "bg-blue-200 ring-2 ring-blue-500" : ""
        }`}
      onMouseDown={(e) => handleMouseDown(row, col, e)}
      onMouseEnter={() => handleMouseEnter(row, col)}
      onMouseUp={handleMouseUp}
    >
      <input
        className="w-full p-2 text-center border-none outline-none bg-transparent"
        style={{
          fontWeight: formatting?.bold ? "bold" : "normal",
          fontStyle: formatting?.italic ? "italic" : "normal",
          color: formatting?.color || "#000",
          backgroundColor: formatting?.bgColor || "transparent",
          fontSize: formatting?.fontSize || "12px",
        }}
        type="text"
        value={value || ""}
        onChange={(e) => onChange(row, col, e.target.value)}
      />

      {selected && (
        <div
          className="absolute w-2 h-2 bg-blue-500 bottom-0 right-0 cursor-crosshair drag-handle"
          onMouseDown={(e) => handleMouseDown(row, col, e)}
        ></div>
      )}

    </td>
  );
};

export default Cell;
