import React from "react";
import Cell from "./Cell";

const Table = ({
  data,
  formatting,
  columnWidths,
  rowHeights,
  handleColumnResize,
  handleRowResize,
  handleChange,
  handleMouseDown,
  handleMouseEnter,
  handleMouseUp,
  isSelected,
}) => {

  const startColumnResize = (e, colIndex) => {
    const startX = e.clientX;
    const startWidth = columnWidths[colIndex];

    const onMouseMove = (event) => {
      const newWidth = startWidth + (event.clientX - startX);
      handleColumnResize(colIndex, newWidth);
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const startRowResize = (e, rowIndex) => {
    const startY = e.clientY;
    const startHeight = rowHeights[rowIndex];

    const onMouseMove = (event) => {
      const newHeight = startHeight + (event.clientY - startY);
      handleRowResize(rowIndex, newHeight);
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div className="overflow-auto bg-white shadow-md rounded-md">
      <table className="select-none border-collapse w-full min-w-max">
        <thead>
          <tr>
            <th className="border bg-gray-200 w-10"></th>
            {data[0].map((_, colIndex) => (
              <th
                key={colIndex}
                className="border bg-gray-200 text-center font-bold relative"
                style={{ width: columnWidths[colIndex] }}
              >
                {String.fromCharCode(65 + colIndex)}
                {/* Column Resizer */}
                <div
                  className="absolute right-0 top-0 h-full w-1 bg-gray-400 cursor-col-resize"
                  onMouseDown={(e) => startColumnResize(e, colIndex)}
                ></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} style={{ height: rowHeights[rowIndex] }}>
              <th className="border bg-gray-200 text-center font-bold relative">
                {rowIndex + 1}
                {/* Row Resizer */}
                <div
                  className="absolute bottom-0 left-0 w-full h-1 bg-gray-400 cursor-row-resize"
                  onMouseDown={(e) => startRowResize(e, rowIndex)}
                ></div>
              </th>
              {row.map((cell, colIndex) => (
                <Cell
                  key={`${rowIndex}-${colIndex}`}
                  row={rowIndex}
                  col={colIndex}
                  value={cell}
                  formatting={formatting[rowIndex][colIndex]} // Pass formatting
                  onChange={handleChange}
                  selected={isSelected(rowIndex, colIndex)}
                  handleMouseDown={handleMouseDown}
                  handleMouseEnter={handleMouseEnter}
                  handleMouseUp={handleMouseUp}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
