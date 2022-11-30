import React from "react";
import "../styles/Grid.css";

const cellColors = ["FFFFFF", "000000"]; // In hexadecimal

function Grid(props) {
  const cellSize = props.cellSize; // In pixels

  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${props.numCols}, ${cellSize}px)`,
      }}
    >
      {props.grid.map((row, i) =>
        row.map((cell, j) => (
          <div
            key={`${i}-${j}`}
            onMouseDown={(event) => props.onCell(event, i, j)}
            onMouseOver={(event) => props.onCell(event, i, j)}
            style={{
              width: cellSize,
              height: cellSize,
              // Set color based on alive or dead
              backgroundColor: `#${cellColors[cell]}`,
            }}
          />
        ))
      )}
    </div>
  );
}

export default Grid;
