'use client';

import { useState } from "react";
import assert from "assert";

import CustomWindow from './_apps/window';
import Desktop from "./_components/desktop";
import About from "./_apps/about";
import Taskbar from "./_components/taskbar";
import { Drag, WindowContext, WindowManagerContext } from "./_contexts/windowManager";

export default function Home() {
  const [windows, setWindows] = useState<CustomWindow[]>([new About()]);
  const [draggedWindow, setDraggedWindow] = useState<CustomWindow | null>(null);
  const [drag, setDrag] = useState<Drag | null>(null);
  const [focusedWindow, setFocusedWindow] = useState<CustomWindow | null>(windows[0]);
  const [reducedWindows, setReducedWindows] = useState<CustomWindow[]>([]);
  const [maximizedWindows, setMaximizedWindows] = useState<CustomWindow[]>([]);

  const closeWindow = (window: CustomWindow): void => {
    const index = windows.indexOf(window);
    if (index > -1) {
      windows.splice(index, 1);
    }
    setWindows([...windows])
  }

  const reduceWindow = (window: CustomWindow): void => {
    setReducedWindows([...reducedWindows, window])
    if (focusedWindow === window)
      setFocusedWindow(null)
  }

  const setMaximizedWindow = (window: CustomWindow, maximized: boolean): void => {
    if (maximized) {
      setMaximizedWindows([...maximizedWindows, window])
    } else {
      const index = maximizedWindows.indexOf(window);
      if (index > -1) {
        maximizedWindows.splice(index, 1)
        setMaximizedWindows([...maximizedWindows])
      } else {
        console.warn("Window not found!")
      }
    }
  }

  const toggleFocus = (window: CustomWindow): void => {
    if (focusedWindow === window) {
      reduceWindow(window)
    } else {
      const index = reducedWindows.indexOf(window);
      if (index > -1) {
        reducedWindows.splice(index, 1)
        setReducedWindows([...reducedWindows])
      } else {
        console.warn("Window not found!")
      }
      setFocusedWindow(window)
    }
  }

  const onMouseMove = (e: React.MouseEvent): void => {
    if (draggedWindow === null)
      return
    assert(drag != null)
    const position = {x: e.clientX, y: e.clientY}
    draggedWindow.onDrag(drag, position)
    setWindows([...windows])
    setDrag({dragType: drag.dragType, lastPosition: position})
  }

  const onMouseUp = (_e: React.MouseEvent): void => {
    if (draggedWindow === null)
      return
    setDraggedWindow(null)
  }

  return (
    <div onMouseMove={onMouseMove} onMouseUp={onMouseUp} style={{width: "100vw", height: "100vh"}}>
      <WindowManagerContext.Provider value={
        {
          windows,
          reducedWindows,
          focusedWindow: null,
          closeWindow,
          openWindow: (window) => { setWindows([...windows, window]); setFocusedWindow(window) },
          toggleFocus: toggleFocus,
        }
      }>
        <Desktop />
        {
          windows.map((window, index) =>
            !reducedWindows.includes(window) ?
              <WindowContext.Provider key={index} value={
                {
                  focused: window == focusedWindow,
                  maximized: maximizedWindows.includes(window),
                  setMaximized: (maximized) => setMaximizedWindow(window, maximized),
                  close: () => closeWindow(window),
                  reduce: () => reduceWindow(window),
                  setDragging: (drag) => {setDraggedWindow(window); setDrag(drag)},
                }
              }>
                {window.render()}
              </WindowContext.Provider>
            :
              ""
          )
        }
        <Taskbar hasMaximizedWindows={maximizedWindows.length > 0}/>
      </WindowManagerContext.Provider>
    </div>
  );
}
