import * as React from "react";
import Layout from "../../components/layout.js";

function EditCell({ onClick, value, children }) {
  const [hovered, setHovered] = React.useState(false);
  let backgroundColor = "var(--mono-6)";
  let color = "var(--mono-1)";
  if (hovered) {
    backgroundColor = "var(--blue-dark)";
    color = "var(--mono-6)";
  } else if (Boolean(value)) {
    backgroundColor = "var(--blue-light)";
    color = "var(--mono-6)";
  }

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor,
        color,
        border: "solid 1px var(--mono-5)",
        height: "36px",
        outline: "none",
        width: "36px",
      }}
    />
  );
}

function EditPattern({ pattern, onPatternChange }) {
  const [value, setValue] = React.useState(pattern);
  React.useEffect(() => {
    const timeout = setTimeout(() => onPatternChange(value), 250);
    return () => clearTimeout(timeout);
  }, [value]);

  const toggleAtCoordinates = React.useCallback(
    (row, column) => {
      const next = [...value];
      next[row][column] = next[row][column] ? 0 : 1;
      setValue(next);
    },
    [value]
  );

  const addColumn = React.useCallback(() => {
    const next = value.map((row) => [...row, 0]);
    setValue(next);
  }, [value]);

  const removeColumn = React.useCallback(
    (index) => {
      const next = value.map((row) =>
        row.filter((column, columnIndex) => columnIndex !== index)
      );
      setValue(next);
    },
    [value]
  );

  const addRow = React.useCallback(() => {
    const columnLength = value[0] ? value[0].length : 0;
    const row = Array.from(new Array(columnLength)).map(() => 0);
    const next = [...value, row];
    setValue(next);
  }, [value]);

  const removeRow = React.useCallback(
    (index) => {
      const next = value.filter((row, rowIndex) => rowIndex !== index);
      if (next.length) {
        setValue(next);
      }
    },
    [value]
  );

  React.useEffect(() => {
    function handleKeyDown(event) {
      if (event.keyCode === 78) {
        if (event.shiftKey) {
          removeRow(value.length - 1);
        } else {
          addRow();
        }
      }
      if (event.keyCode === 77) {
        if (event.shiftKey) {
          removeColumn(value[0].length - 1);
        } else {
          addColumn();
        }
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [value, addColumn, removeColumn, addRow, removeRow]);

  return (
    <div>
      {pattern.map((row, rowIndex) => {
        return (
          <div style={{ display: "flex" }}>
            {row.map((cell, columnIndex) => (
              <EditCell
                onClick={() => toggleAtCoordinates(rowIndex, columnIndex)}
                value={cell}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default function Pattern() {
  const height = 200;
  const width = 200;

  const rows = React.useMemo(() => Array.from(new Array(height)), [height]);
  const columns = React.useMemo(() => Array.from(new Array(width)), [width]);
  const [pattern, setPattern] = React.useState([
    [1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  return (
    <Layout contentWidth="90%">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          {rows.map((_, row) => {
            const localRow = row % pattern.length;
            return (
              <div style={{ height: "4px", display: "flex" }}>
                {columns.map((_, column) => {
                  let localColumn = 0;
                  if (pattern[0] && pattern[0].length) {
                    localColumn = column % pattern[0].length;
                  }
                  const on = pattern[localRow][localColumn];
                  return (
                    <div
                      style={{
                        backgroundColor: on ? "var(--blue-light)" : undefined,
                        width: "4px",
                      }}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
        <div
          style={{
            backgroundColor: "var(--mono-5)",
            color: "var(--mono-1)",
            flexGrow: 1,
            padding: "16px",
            width: "400px",
          }}
        >
          <EditPattern pattern={pattern} onPatternChange={setPattern} />
        </div>
      </div>
    </Layout>
  );
}
