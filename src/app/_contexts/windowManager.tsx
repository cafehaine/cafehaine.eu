import { createContext } from "react";
import CustomWindow from "../_apps/window";

export enum DragType {
  Window = 0,
  Top = 1,
  Right = 2,
  Bottom = 4,
  Left = 8,
}

export type Position = {
  x: number;
  y: number;
}

export type Drag = {
  dragType: DragType,
  lastPosition: Position,
}

export type WindowProps = {
  focused: boolean;
  maximized: boolean;
  setMaximized: (maximized: boolean) => void;
  close: () => void;
  reduce: () => void;
  setDragging: (drag: Drag) => void;
}

type WindowManager = {
  windows: CustomWindow[];
  reducedWindows: CustomWindow[];
  focusedWindow: CustomWindow | null;
  closeWindow: (win: CustomWindow) => void;
  openWindow: (win: CustomWindow) => void;
  toggleFocus: (win: CustomWindow) => void;
}

export const WindowContext = createContext<WindowProps>(
  {
    focused: false,
    maximized: false,
    setMaximized: (maximized: boolean) => { },
    close: () => { },
    reduce: () => { },
    setDragging: (drag: Drag) => { },
  }
);
export const WindowManagerContext = createContext<WindowManager>(
  {
    windows: [],
    reducedWindows: [],
    focusedWindow: null,
    closeWindow: (win) => {},
    openWindow: (win) => {},
    toggleFocus: (win) => {},
  }
);
export default 0;
