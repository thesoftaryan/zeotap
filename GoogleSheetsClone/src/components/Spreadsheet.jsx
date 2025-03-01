import React, { useState, useEffect } from "react";
import Toolbar from "./Toolbar";
import FormulaBar from "./FormulaBar";
import Table from "./Table";

const Spreadsheet = () => {
  // ✅ Calculate initial rows & columns based on screen size
  const calculateInitialSize = () => {
    const rowHeight = 35; // Approximate row height in pixels
    const colWidth = 100; // Approximate column width in pixels
    const screenHeight = window.innerHeight - 200; // Adjusted for header
    const screenWidth = window.innerWidth - 100; // Adjusted for sidebar
    return {
      rows: Math.floor(screenHeight / rowHeight),
      cols: Math.floor(screenWidth / colWidth),
    };
  };


  const [gridSize, setGridSize] = useState(calculateInitialSize);
  const [data, setData] = useState(
    Array.from({ length: gridSize.rows }, () => Array(gridSize.cols).fill())
  );

  // ✅ Formatting state (Bold, Italics, Colors)
  const [formatting, setFormatting] = useState(
    Array.from({ length: gridSize.rows }, () =>
      Array(gridSize.cols).fill({ bold: false, italic: false, color: "#000", bgColor: "#fff" })
    )
  );





  const [columnWidths, setColumnWidths] = useState(
    Array(gridSize.cols).fill(100) // Default column width
  );
  const [rowHeights, setRowHeights] = useState(
    Array(gridSize.rows).fill(35) // Default row height
  );
  const handleColumnResize = (colIndex, newWidth) => {
    setColumnWidths((prev) => {
      const newWidths = [...prev];
      newWidths[colIndex] = Math.max(newWidth, 50); // Prevent too small columns
      return newWidths;
    });
  };
  
  const handleRowResize = (rowIndex, newHeight) => {
    setRowHeights((prev) => {
      const newHeights = [...prev];
      newHeights[rowIndex] = Math.max(newHeight, 20); // Prevent too small rows
      return newHeights;
    });
  };
  

  // ✅ Track selection
  const [selectedCells, setSelectedCells] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectionRange, setSelectionRange] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);

  // ✅ Preserve data when resizing
  useEffect(() => {
    const handleResize = () => {
      const newSize = calculateInitialSize();
      setGridSize(newSize);

      setData((prevData) =>
        Array.from({ length: newSize.rows }, (_, r) =>
          Array.from({ length: newSize.cols }, (_, c) => prevData[r]?.[c] || "")
        )
      );

      setFormatting((prevFormatting) =>
        Array.from({ length: newSize.rows }, (_, r) =>
          Array.from({ length: newSize.cols }, (_, c) => prevFormatting[r]?.[c] || { bold: false, italic: false, color: "#000", bgColor: "#fff" })
        )
      );
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const cellToIndices = (cellName) => {
    const match = cellName.match(/^([A-Z]+)(\d+)$/);
    if (!match) return null;
  
    const col = match[1].charCodeAt(0) - 65; // Convert "A" → 0, "B" → 1
    const row = parseInt(match[2], 10) - 1;  // Convert "1" → 0, "2" → 1
  
    return { row, col };
  };


  const evaluateFormula = (formula, data) => {
    try {
      if (formula.startsWith("=")) {
        const match = formula.match(/^=(SUM|AVG|MULTIPLY|MIN|MAX|COUNT)\((.+)\)$/i);
        if (!match) return "ERROR";
  
        const [, operation, range] = match;
        const [start, end] = range.split(":");
  
        const startCoords = cellToIndices(start);
        const endCoords = cellToIndices(end);
        if (!startCoords || !endCoords) return "ERROR";
  
        let values = [];
        for (let r = startCoords.row; r <= endCoords.row; r++) {
          for (let c = startCoords.col; c <= endCoords.col; c++) {
            const cellValue = Number(data[r]?.[c]);
            if (cellValue !== "" && !isNaN(cellValue) && cellValue !== null) {
              values.push(Number(cellValue)); // ✅ Count only user-entered numeric values
            }
          }
        }
  
        switch (operation.toUpperCase()) {
          case "SUM":
            return values.reduce((acc, num) => acc + num, 0);
          case "AVG":
            return values.length ? values.reduce((acc, num) => acc + num, 0) / values.length : "ERROR";
          case "MULTIPLY":
            return values.length ? values.reduce((acc, num) => acc * num, 1) : "ERROR";
          case "MIN":
            return values.length ? Math.min(...values) : "ERROR";
          case "MAX":
            return values.length ? Math.max(...values) : "ERROR";
          case "COUNT":
            return values.length;
          default:
            return "ERROR";
        }
      }
    } catch (error) {
      return "ERROR";
    }
    return formula;
  };
  
  



  const [formulaInput, setFormulaInput] = useState("");

  const handleFormulaChange = (e) => {
    setFormulaInput(e.target.value);
    if (selectedCells.length > 0) {
      const { row, col } = selectedCells[0];
      handleChange(row, col, e.target.value); // ✅ Update spreadsheet data
      setData((prevData) => {
        const newData = [...prevData];
        newData[row][col] = e.target.value; // ✅ Update cell with formula bar input
        return newData;
      });
    }
  };
  
  const [selectedCellRef, setSelectedCellRef] = useState("");

  const getCellReference = (row, col) => {
    return `${String.fromCharCode(65 + col)}${row + 1}`; // A1, B2, etc.
  };
  
    
  // ✅ Handle cell edits
  const handleChange = (row, col, value) => {
    setData((prevData) => {
      const newData = [...prevData];
      newData[row][col] = value; // ✅ Keep raw input while typing
      
  
      // ✅ Only evaluate if it's a complete formula (not just "=")
      if (typeof value === "string" && value.startsWith("=") && value.length > 1) {
        const result = evaluateFormula(value, newData);
        if (result !== "ERROR") {
          newData[row][col] = result; // ✅ Replace with computed value only if valid
        }
      }else{
        const isNumericCell = !isNaN(newData[row][col]) && newData[row][col] !== ""; // If cell previously contained a number

          if (isNumericCell && isNaN(value)) {
            alert("Invalid input! This cell only allows numbers.");
            return prevData; // Prevent updating with invalid data
          }
      }

      if (selectedCells.length > 0 && selectedCells[0].row === row && selectedCells[0].col === col) {
        setFormulaInput(value);
      }
  
      // ✅ Recalculate all formula cells dynamically
      for (let r = 0; r < newData.length; r++) {
        for (let c = 0; c < newData[0].length; c++) {
          if (typeof newData[r][c] === "string" && newData[r][c].startsWith("=") && newData[r][c].length > 1) {
            const result = evaluateFormula(newData[r][c], newData);
            if (result !== "ERROR") {
              newData[r][c] = result;
            }
          }
        }
      }
  
      return newData;
    });
  };
  

  // ✅ Start selection
  const handleMouseDown = (row, col, event) => {
    if (!event) return; 

    if (event.target.classList.contains("drag-handle")) {
      setIsDragging(true);
      setSelectionRange({ startRow: row, startCol: col, endRow: row, endCol: col });
      return;
    }

    if (row < 0 || col < 0) return; // ✅ Prevents selecting headers

    setSelectedCells([{ row, col }]);
    setSelectionRange({ startRow: row, startCol: col, endRow: row, endCol: col });
    setIsSelecting(true);
    setFormulaInput(data[row][col] || "");
    setSelectedCellRef(getCellReference(row, col));
  };



  // ✅ Handle drag selection
  const handleMouseEnter = (row, col) => {
    if ((isSelecting || isDragging)) {
      setSelectionRange((prev) => ({ ...prev, endRow: row, endCol: col }));
    }
  };

  const handleMouseUp = () => {
    if (isSelecting) {
      setIsSelecting(false); // ✅ Stop selection mode
      return;
    }
  
    if (isDragging) {
      handleDragEnd(); // ✅ Only copy if dragging
      setIsDragging(false);
      return;
    }
    setSelectionRange(null);
  };

  const adjustFormulaReferences = (formula, startRow, startCol, targetRow, targetCol) => {
    return formula.replace(/([A-Z]+)(\d+)/g, (match, col, row) => {
      const colOffset = targetCol - startCol;
      const rowOffset = targetRow - startRow;
  
      const newCol = String.fromCharCode(col.charCodeAt(0) + colOffset);
      const newRow = Number(row) + rowOffset;
  
      return `${newCol}${newRow}`;
    });
  };

  // ✅ Check if a cell is selected
  const isSelected = (row, col) => {
    if (!selectionRange) return false;
    const { startRow, startCol, endRow, endCol } = selectionRange;
    return (
      row >= Math.min(startRow, endRow) &&
      row <= Math.max(startRow, endRow) &&
      col >= Math.min(startCol, endCol) &&
      col <= Math.max(startCol, endCol)
    );
  };



const applyFormatting = (type, value) => {
  setFormatting((prevFormatting) => {
    return prevFormatting.map((row, rowIndex) =>
      row.map((cellFormat, colIndex) => {
        if (selectedCells.some((cell) => cell.row === rowIndex && cell.col === colIndex)) {
          return {
            ...cellFormat,
            [type]: value, // ✅ Apply font size, bold, or italic
          };
        }
        return cellFormat;
      })
    );
  });
};


  // ✅ Fix: Add a new row while preserving existing data
  const addRow = () => {
    setData((prevData) => [...prevData, Array(prevData[0].length).fill("")]);
    setFormatting((prevFormatting) => [...prevFormatting, Array(prevFormatting[0].length).fill({ bold: false, italic: false, color: "#000", bgColor: "#fff" })]);
  };

  // ✅ Fix: Add a new column while preserving existing data
  const addColumn = () => {
    setData((prevData) => prevData.map((row) => [...row, ""]));
    setFormatting((prevFormatting) => prevFormatting.map((row) => [...row, { bold: false, italic: false, color: "#000", bgColor: "#fff" }]));
  };

  // ✅ Fix: Remove the last row (prevent removing all rows)
  const deleteRow = () => {
    if (data.length > 1) {
      setData((prevData) => prevData.slice(0, -1));
      setFormatting((prevFormatting) => prevFormatting.slice(0, -1));
    }
  };

  // ✅ Fix: Remove the last column (prevent removing all columns)
  const deleteColumn = () => {
    if (data[0].length > 1) {
      setData((prevData) => prevData.map((row) => row.slice(0, -1)));
      setFormatting((prevFormatting) => prevFormatting.map((row) => row.slice(0, -1)));
    }
  };




  const handleDragEnd = () => {
    if (!selectionRange) return;
    if (!isDragging) return;
  
    const { startRow, startCol, endRow, endCol } = selectionRange;
    const draggedValue = data[startRow][startCol];
    const draggedFormat = formatting[startRow][startCol]; // ✅ Copy formatting too
  
    setData((prevData) => {
      const newData = prevData.map((row) => [...row]);
  
      for (let r = Math.min(startRow, endRow); r <= Math.max(startRow, endRow); r++) {
        for (let c = Math.min(startCol, endCol); c <= Math.max(startCol, endCol); c++) {
          if (r !== startRow || c !== startCol) {
            if (typeof draggedValue === "string" && draggedValue.startsWith("=")) {
              newData[r][c] = adjustFormulaReferences(draggedValue, startRow, startCol, r, c);
            } else {
              newData[r][c] = draggedValue;
            }
          }
        }
      }
      return newData;
    });
  
    setFormatting((prevFormatting) => {
      const newFormatting = prevFormatting.map((row) => [...row]);
  
      for (let r = Math.min(startRow, endRow); r <= Math.max(startRow, endRow); r++) {
        for (let c = Math.min(startCol, endCol); c <= Math.max(startCol, endCol); c++) {
          if (r !== startRow || c !== startCol) {
            newFormatting[r][c] = { ...draggedFormat }; // ✅ Copy formatting
          }
        }
      }
      return newFormatting;
    });
  
    setIsDragging(false);
    setIsSelecting(false);
  };
  



  return (
    <div className="min-h-screen">
      <Toolbar sheetData={data} applyFormatting={applyFormatting} formatting={selectedCells.length > 0 ? formatting[selectedCells[0].row][selectedCells[0].col] : { bold: false, italic: false }} addRow={addRow} addColumn={addColumn} deleteRow={deleteRow} deleteColumn={deleteColumn} />
      <FormulaBar selectedCellRef={selectedCellRef} formulaInput={formulaInput} handleFormulaChange={handleFormulaChange} />
      <Table
        data={data}
        formatting={formatting}
        columnWidths={columnWidths}
        rowHeights={rowHeights}
        handleColumnResize={handleColumnResize}
        handleRowResize={handleRowResize}
        handleChange={handleChange}
        handleMouseDown={handleMouseDown}
        handleMouseEnter={handleMouseEnter}
        handleMouseUp={handleMouseUp}
        isSelected={isSelected}
      />
    </div>
  );
};

export default Spreadsheet;
