import * as React from "react";
import { useRouter } from "next/router";

import Layout from "../../components/layout.js";

function columnLength(pattern) {
  return pattern[0] ? pattern[0].length : 0;
}
function addRow(pattern) {
  const row = Array.from(new Array(columnLength(pattern))).map(() => 0);
  return [...pattern, row];
}
function addColumn(pattern) {
  return pattern.map((row) => [...row, 0]);
}
function removeRow(pattern, index) {
  return pattern.filter((row, rowIndex) => rowIndex !== index);
}
function removeColumn(pattern, index) {
  return pattern.map((row) => row.filter((col, colidx) => colidx !== index));
}
function isInBounds(pattern, row, column) {
  return (
    row >= 0 &&
    row < pattern.length &&
    column >= 0 &&
    column < pattern[row].length
  );
}
function stringToPattern(patternString) {
  return patternString.split(",").map((row) => row.split("").map(Number));
}
function patternToString(p) {
  return p.map((r) => r.join("")).join(",");
}

function Editor({ gridWidth, pattern, onPatternChange }) {
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
      if (isInBounds(pattern, row, column)) {
        return Boolean(pattern[row][column]);
      }
      return false;
    },
    [updateDict, pattern]
  );

  const buttonSize = React.useMemo(() => {
    const width = columnLength(pattern);
    const height = pattern.length;
    if (height > width) {
      return gridWidth / height;
    }
    return gridWidth / width;
  }, [gridWidth, pattern]);

  return (
    <div
      onMouseDown={() => {
        const [row, column] = hover;
        setMouseHold(true);
        if (isInBounds(pattern, row, column)) {
          setUpdateQueue([[row, column, !valueAtCoord(row, column)]]);
        }
      }}
      onMouseUp={() => {
        setMouseHold(false);
        if (updateQueue.length) {
          const next = [...pattern];
          updateQueue.forEach(([row, column, value]) => {
            next[row][column] = value ? 1 : 0;
          });
          onPatternChange(next);
        }
        setUpdateQueue([]);
      }}
    >
      {pattern.map((row, rowidx) => {
        return (
          <div key={rowidx}>
            <div style={{ display: "flex", height: `${buttonSize}px` }}>
              {row.map((_, colidx) => {
                const hovered = rowidx === hover[0] && colidx === hover[1];
                const value = valueAtCoord(rowidx, colidx);
                return (
                  <button
                    key={colidx}
                    onMouseOver={() => setHover([rowidx, colidx])}
                    onMouseLeave={() => setHover([-1, -1])}
                    onMouseEnter={() => {
                      setHover([rowidx, colidx]);
                      if (mouseHold) {
                        if (updateQueue.length) {
                          setUpdateQueue([
                            ...updateQueue,
                            [
                              rowidx,
                              colidx,
                              updateQueue[updateQueue.length - 1][2],
                            ],
                          ]);
                        } else {
                          setUpdateQueue([[rowidx, colidx, !Boolean(value)]]);
                        }
                      }
                    }}
                    style={{
                      backgroundColor: value
                        ? "var(--mono-1)"
                        : "var(--mono-6)",
                      border: "none",
                      outline: `solid 1px var(--mono-${
                        hovered ? (value ? 3 : 4) : 5
                      })`,
                      padding: 0,
                      height: `${buttonSize}px`,
                      width: `${buttonSize}px`,
                    }}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Resize({ onChange }) {
  const [hover, setHover] = React.useState(false);
  const [resizing, setResizing] = React.useState(false);
  const [start, setStart] = React.useState(0);
  const [end, setEnd] = React.useState(0);

  React.useLayoutEffect(() => {
    function handleMouseMove(event) {
      event.preventDefault();
      setEnd(event.clientX);
    }
    if (resizing) {
      document.addEventListener("mousemove", handleMouseMove);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [resizing]);

  return (
    <div
      role="presentation"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onMouseDown={(event) => {
        const rect = event.target.getBoundingClientRect();
        const x = rect.left + window.scrollX;
        setResizing(true);
        setStart(x);
        setEnd(x);
      }}
      onMouseUp={() => {
        onChange((end - start) * -1);
        setResizing(false);
        setStart(0);
        setEnd(0);
      }}
      style={{
        position: "absolute",
        left: -2 + end - start,
        backgroundColor: hover || resizing ? "var(--blue-dark)" : null,
        width: "4px",
        height: "100%",
        cursor: "col-resize",
      }}
    />
  );
}

export default function Pattern({ initialPattern }) {
  const router = useRouter();
  const height = 600;
  const width = 600;
  const DRAWER_MIN_WIDTH = 300;

  const rows = React.useMemo(() => Array.from(new Array(height)), [height]);
  const columns = React.useMemo(() => Array.from(new Array(width)), [width]);
  const [pattern, setPattern] = React.useState(initialPattern);
  const [rowOffset, setRowOffset] = React.useState(0);
  const [size, setSize] = React.useState(4);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [drawerResizeOffset, setDrawerResizeOffset] = React.useState(0);

  React.useEffect(() => {
    function handleKeyDown(event) {
      if (event.keyCode === 32) {
        event.preventDefault();
        setPattern(pattern.map((row) => row.map((cell) => (cell ? 0 : 1))));
      }
      if (event.keyCode === 78) {
        if (event.shiftKey) {
          const length = pattern.length;
          if (length > 1) {
            setPattern(removeRow(pattern, length - 1));
          }
        } else {
          setPattern(addRow(pattern));
        }
      }
      if (event.keyCode === 77) {
        if (event.shiftKey) {
          const length = columnLength(pattern);
          if (length > 1) {
            setPattern(removeColumn(pattern, length - 1));
          }
        } else {
          setPattern(addColumn(pattern));
        }
      }
      if (event.keyCode === 67) {
        if (event.shiftKey) {
          setPattern(pattern.map((r) => r.map(() => 0)));
        }
      }
      if (event.keyCode === 191) {
        setDrawerOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [pattern]);

  const canvas = React.useRef(null);
  const [canvasWidth, setCanvasWidth] = React.useState(0);
  const [canvasHeight, setCanvasHeight] = React.useState(0);
  React.useEffect(() => {
    setCanvasWidth(document.documentElement.clientWidth);
    setCanvasHeight(document.documentElement.clientHeight);
  }, []);
  React.useEffect(() => {
    let rowCount = 0;
    if (canvas.current) {
      const ctx = canvas.current.getContext("2d");
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.current.width, canvas.current.height);

      for (let y = 0; y < height; y++) {
        const localy = y % pattern.length;
        for (let x = 0; x < width; x++) {
          let localx = 0;
          if (pattern[localy] && pattern[localy].length) {
            const length = pattern[localy].length;
            localx = (x + rowCount * rowOffset) % length;
          }
          const on = pattern[localy][localx];
          if (on) {
            ctx.fillStyle = "white";
            ctx.fillRect(x * size, y * size, size, size);
          }
        }
        if (localy === pattern.length - 1) {
          rowCount++;
        }
      }
    }
  }, [pattern, rowOffset, size, canvasWidth, canvasHeight]);

  React.useEffect(() => {
    router.push({
      pathname: router.pathname,
      query: { p: patternToString(pattern) },
    });
  }, [pattern]);

  return (
    <div
      style={{
        fontFamily: '"Inconsolata", monospace',
        color: "var(--mono-1)",
      }}
    >
      <canvas ref={canvas} width={canvasWidth} height={canvasHeight} />
      {drawerOpen && (
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            minHeight: "400px",
            height: "100%",
            backgroundColor: "var(--mono-5)",
            width: `${DRAWER_MIN_WIDTH + drawerResizeOffset}px`,
          }}
        >
          <Resize
            onChange={(offset) =>
              setDrawerResizeOffset(Math.max(0, drawerResizeOffset + offset))
            }
          />

          <div style={{ padding: "16px" }}>
            <Editor
              pattern={pattern}
              onPatternChange={setPattern}
              gridWidth={DRAWER_MIN_WIDTH + drawerResizeOffset - 32}
            />
            <div>
              {columnLength(pattern)} x {pattern.length}
            </div>
            <div>
              <input
                type="range"
                id="size"
                min="4"
                max="40"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                step="1"
              />
              <label htmlFor="size">Size {size}</label>
            </div>
            <div>
              <input
                type="range"
                id="row-offset"
                min="0"
                max={columnLength(pattern) - 1}
                value={rowOffset}
                onChange={(e) => setRowOffset(e.target.value)}
                step="1"
              />
              <label htmlFor="row-offset">Row Offset {rowOffset}</label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

Pattern.getInitialProps = function ({ query }) {
  function paramToPattern(param) {
    if (param) {
      return stringToPattern(param);
    }

    return [
      [1, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ];
  }
  return { initialPattern: paramToPattern(query.p) };
};
