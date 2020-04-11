import * as React from "react";
import Layout from "../../components/layout.js";

function Editor({ pattern, onPatternChange }) {
  const [matrix, setMatrix] = React.useState(pattern);
  React.useEffect(() => {
    const timeout = setTimeout(() => onPatternChange(matrix), 250);
    return () => clearTimeout(timeout);
  }, [matrix]);

  const addColumn = React.useCallback(() => {
    const next = matrix.map((row) => [...row, 0]);
    setMatrix(next);
  }, [matrix]);

  const removeColumn = React.useCallback(
    (index) => {
      const next = matrix.map((row) =>
        row.filter((column, columnIndex) => columnIndex !== index)
      );
      setMatrix(next);
    },
    [matrix]
  );

  const addRow = React.useCallback(() => {
    const columnLength = matrix[0] ? matrix[0].length : 0;
    const row = Array.from(new Array(columnLength)).map(() => 0);
    const next = [...matrix, row];
    setMatrix(next);
  }, [matrix]);

  const removeRow = React.useCallback(
    (index) => {
      const next = matrix.filter((row, rowIndex) => rowIndex !== index);
      if (next.length) {
        setMatrix(next);
      }
    },
    [matrix]
  );

  React.useEffect(() => {
    function handleKeyDown(event) {
      if (event.keyCode === 78) {
        if (event.shiftKey) {
          removeRow(matrix.length - 1);
        } else {
          addRow();
        }
      }
      if (event.keyCode === 77) {
        if (event.shiftKey) {
          removeColumn(matrix[0].length - 1);
        } else {
          addColumn();
        }
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [matrix, addColumn, removeColumn, addRow, removeRow]);

  function withinBounds(row, column, grid) {
    return (
      row >= 0 &&
      row < grid.length &&
      column >= 0 &&
      column < matrix[row].length
    );
  }

  const [hover, setHover] = React.useState([-1, -1]);
  const [mouseHold, setMouseHold] = React.useState(false);
  const [updateQueue, setUpdateQueue] = React.useState([]);
  const updateDict = React.useMemo(() => {
    return updateQueue.reduce((dict, [rowidx, colidx, value]) => {
      if (!dict[rowidx]) {
        dict[rowidx] = { [colidx]: value };
      } else {
        dict[rowidx][colidx] = value;
      }
      return dict;
    }, {});
  }, [updateQueue]);

  const valueAtCoord = React.useCallback(
    (row, column) => {
      if (
        updateDict[row] !== undefined &&
        updateDict[row][column] !== undefined
      ) {
        return updateDict[row][column];
      }
      if (
        row >= 0 &&
        row < matrix.length &&
        column >= 0 &&
        column < matrix[row].length
      ) {
        return Boolean(matrix[row][column]);
      }
      return false;
    },
    [updateDict, matrix]
  );

  return (
    <div
      style={{
        width: "500px",
        overflow: "auto",
      }}
      onMouseDown={() => {
        setMouseHold(true);
        const [row, column] = hover;
        if (withinBounds(row, column, matrix)) {
          setUpdateQueue([[row, column, !valueAtCoord(row, column)]]);
        }
      }}
      onMouseUp={() => {
        setMouseHold(false);
        if (updateQueue.length) {
          const next = [...matrix];
          updateQueue.forEach(([row, column, value]) => {
            next[row][column] = value ? 1 : 0;
          });
          setMatrix(next);
        }
        setUpdateQueue([]);
      }}
    >
      {matrix.map((row, rowidx) => {
        return (
          <div style={{ display: "flex", height: "36px" }}>
            {row.map((_, colidx) => {
              const hovered = rowidx === hover[0] && colidx === hover[1];
              const value = valueAtCoord(rowidx, colidx);
              return (
                <button
                  onMouseEnter={() => {
                    setHover([rowidx, colidx]);
                    if (mouseHold) {
                      setUpdateQueue([
                        ...updateQueue,
                        [
                          rowidx,
                          colidx,
                          updateQueue[updateQueue.length - 1][2],
                        ],
                      ]);
                    }
                  }}
                  onMouseLeave={() => setHover([-1, -1])}
                  style={{
                    backgroundColor: value
                      ? "var(--blue-light)"
                      : "var(--mono-6)",
                    boxSizing: "border-box",
                    border: `solid 1px var(--mono-${hovered ? 4 : 5})`,
                    outline: "none",
                    width: "36px",
                  }}
                />
              );
            })}
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
          <Editor pattern={pattern} onPatternChange={setPattern} />
        </div>
      </div>
    </Layout>
  );
}
