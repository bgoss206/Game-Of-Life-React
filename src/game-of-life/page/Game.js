import React, { useState, useRef, useCallback, useEffect } from "react";
import { produce } from "immer"; // Used to update grid
import Toolbar from "./Toolbar";
import Grid from "./Grid";
import "../styles/Game.css";
import useWindowDimensions from "../hooks/useWindowDimensions";

const STARTING_SPEED = 2000;

const neighbors = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

function Game() {
  let { width, height } = useWindowDimensions();
  const dimensions = 50;
  const getEmptyGrid = () => {
    return Array.from({ length: dimensions }).map(() =>
      Array.from({ length: dimensions }).fill(0)
    );
  };

  const [speed, setSpeed] = useState(STARTING_SPEED);
  const speedRef = useRef(speed);
  speedRef.current = speed;

  const cellSize = (width + height) / (dimensions + dimensions);

  const [grid, setGrid] = useState(getEmptyGrid);

  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  const [generation, setGeneration] = useState(0);

  const countNeighbors = (grid, i, j) => {
    let count = 0;
    neighbors.forEach(([x, y]) => {
      // Check bounds
      const k = (i + x + dimensions) % dimensions;
      const l = (j + y + dimensions) % dimensions;
      count += grid[k][l] ? 1 : 0;
    });

    return count;
  };

  const runSimulation = useCallback(() => {
    if (!runningRef.current) return;

    // Update grid
    setGrid((grid) => {
      return produce(grid, (gridCopy) =>
        grid.forEach((row, i) =>
          row.forEach((cell, j) => {
            // Check rules
            const numNeighbors = countNeighbors(grid, i, j);
            if (numNeighbors < 2 || numNeighbors > 3) {
              gridCopy[i][j] = 0;
            } else if (cell === 0 && numNeighbors === 3) {
              gridCopy[i][j] = 1;
            }
          })
        )
      );
    });

    // Increment generation
    setGeneration((generation) => {
      return generation + 1;
    });
    setTimeout(runSimulation, speedRef.current); // Recursive
  }, []); // Always memoize

  const onRun = () => {
    // Toggle running
    setRunning(!running);

    if (!running) {
      // Run simulation
      runningRef.current = true; // Prevent race condition
      runSimulation();
    }
  };

  const onReset = () => {
    // Clear grid
    setGrid(getEmptyGrid);
    // Stop simulation
    setRunning(false);
    // Reset generation
    setGeneration(0);
    setSpeed(STARTING_SPEED);
  };

  const onCell = (event, i, j) => {
    if (event.buttons === 1)
      // Primary button pressed
      // Toggle cell status
      setGrid(
        produce(grid, (gridCopy) => {
          gridCopy[i][j] = grid[i][j] ? 0 : 1;
        })
      );
  };

  const changeSpeed = (num) => {
    // if number given is -1000, allow only if speed is >= 1000
    // if number given +1000, allow all the time
    if (num < 0 && speed < 1000) {
      return;
    } else {
      setSpeed((speed) => speed + num);
    }
  };

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  return (
    <div className="game-container">
      <Toolbar
        width={width}
        height={height}
        onRun={onRun}
        changeSpeed={changeSpeed}
        running={running}
        onReset={onReset}
        generation={generation}
        speed={speed}
      />
      <Grid
        width={width}
        height={height}
        cellSize={cellSize}
        numCols={dimensions}
        grid={grid}
        onCell={onCell}
      />
    </div>
  );
}

export default Game;
