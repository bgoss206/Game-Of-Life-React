import React from "react";
import "../styles/Toolbar.css";
import FastForwardIcon from "@mui/icons-material/FastForward";
import FastRewindIcon from "@mui/icons-material/FastRewind";

function Toolbar(props) {
  return (
    <div className="toolbar">
      <button
        onClick={props.onRun}
        className="control"
        style={{
          backgroundColor: props.running ? "#ff5757" : "#7ed957",
        }}
      >
        {props.running ? "Stop" : "Start"}
      </button>
      <button onClick={(event) => props.changeSpeed(1000)} className="control">
        <FastRewindIcon />
      </button>
      <button onClick={(event) => props.changeSpeed(-1000)} className="control">
        <FastForwardIcon />
      </button>
      <button onClick={props.onReset} className="control">
        Reset
      </button>
      <p className="generation">
        Generation Interval: {props.speed / 1000} / sec
      </p>
      <p className="generation">Generation: {props.generation}</p>

      <h1 className="header">Game of Life</h1>
    </div>
  );
}

export default Toolbar;
