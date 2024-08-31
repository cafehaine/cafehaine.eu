"use strict";

document.body.classList.remove("nojs")

const startMenu = document.querySelector("#startMenu");
const taskbarWindows = document.querySelector("#windowList");
const windowTemplate = document.querySelector("#windowTemplate")

const windows = [];

let availableWindowId = 1;

var draggedWindow = null;
var dragType = null;
var dragStartX = null;
var dragStartY = null;
var dragStartRect = null;
// At first there's only one active window in the html
var activeWindow = document.querySelector("dialog.window.active")

function getNewWindowId() {
  return availableWindowId++;
}

function updateWindowList() {
  const newChildren = [];
  for (const win of windows) {
    const li = document.createElement("li");
    const label = document.createElement("label");
    label.setAttribute("for", win.querySelector("input[name=reduce]").getAttribute("id"));
    if (activeWindow == win && !win.querySelector("input[name=reduce]").checked)
      label.classList.add("active")
    li.appendChild(label);
    const img = win.querySelector("header > img").cloneNode();
    label.appendChild(img);
    const span = document.createElement("span");
    span.textContent = win.querySelector("header > h1").textContent;
    label.appendChild(span);
    newChildren.push(li);
  }
  taskbarWindows.replaceChildren(...newChildren);
}

function setActiveWindow(window) {
  if (activeWindow != null)
    activeWindow.classList.remove("active");
  activeWindow = window;
  if (activeWindow != null)
    activeWindow.classList.add("active")
  updateWindowList();
}

// TODO pointer events

document.body.onclick = (evt) => {
  if (evt.target != document.body)
    return;
  setActiveWindow(null);
  if (startMenu.open) {
    startMenu.close()
  }
}

document.body.onmouseup = () => { draggedWindow = null };
document.body.ontouchend = () => { draggedWindow = null };
document.body.ontouchcancel = () => { draggedWindow = null };

function onMove(clientX, clientY) {
  // TODO aero snap to desktop edges?
  if (draggedWindow.classList.contains("maximized")) {
    draggedWindow.classList.remove("maximized");
  }
  if (dragType == "window") {
    draggedWindow.style.setProperty("--left", `${dragStartRect.x - dragStartX + clientX}px`)
    draggedWindow.style.setProperty("--top", `${dragStartRect.y - dragStartY + clientY}px`)
  } else {
    if (dragType.includes("l")) {
      const left = dragStartRect.x - dragStartX + clientX;
      draggedWindow.style.setProperty("--left", `${left}px`);
      draggedWindow.style.setProperty("--width", `${dragStartRect.right - left}px`);
    }
    if (dragType.includes("r")) {
      draggedWindow.style.setProperty("--width", `${dragStartRect.width - dragStartX + clientX}px`);
    }
    if (dragType.includes("t")) {
      const top = dragStartRect.y - dragStartY + clientY;
      draggedWindow.style.setProperty("--top", `${top}px`);
      draggedWindow.style.setProperty("--height", `${dragStartRect.bottom - top}px`);
    }
    if (dragType.includes("b")) {
      draggedWindow.style.setProperty("--height", `${dragStartRect.height - dragStartY + clientY}px`);
    }
  }
}

document.body.onmousemove = (evt) => {
  if (!draggedWindow)
    return;

  window.getSelection().removeAllRanges();
  onMove(evt.clientX, evt.clientY)
  return false;
}

document.body.ontouchmove = (evt) => {
  if (!draggedWindow)
    return;

  onMove(evt.touches[0].clientX, evt.touches[0].clientY);
  return false;
}

function smartifyWindow(win) {
  windows.push(win);
  const header = win.querySelector("header");
  const icon = win.querySelector("header img");
  const toggleButton = win.querySelector(".toggle");
  const closeButton = win.querySelector(".close");

  // Remove css hardcoded centered position
  const rect = win.getBoundingClientRect();
  win.style.transform = "none";
  win.style.setProperty("--left", `${rect.x}px`)
  win.style.setProperty("--top", `${rect.y}px`)
  win.style.setProperty("--width", `${rect.width}px`)
  win.style.setProperty("--height", `${rect.height}px`)

  win.onclick = (evt) => {
    startMenu.close()
    setActiveWindow(win);
  }

  if (header && toggleButton)
    header.ondblclick = () => win.classList.toggle("maximized");
  if (icon)
    icon.ondblclick = () => win.close();
  if (toggleButton)
    toggleButton.onclick = () => win.classList.toggle("maximized");
  if (closeButton)
    closeButton.onclick = () => {
      win.close();
      const index = windows.indexOf(win);
      if (index > -1) {
        windows.splice(index, 1);
      }
      setActiveWindow(null);
      win.parentNode.removeChild(win)
    }

  if (header) {
    header.onmousedown = (evt) => { draggedWindow = win; dragType = "window"; dragStartX = evt.clientX; dragStartY = evt.clientY; dragStartRect = win.getBoundingClientRect(); };
    header.ontouchstart = (evt) => { draggedWindow = win; dragType = "window"; dragStartX = evt.touches[0].clientX; dragStartY = evt.touches[0].clientY; dragStartRect = win.getBoundingClientRect(); };
  }

  for (const borderName of ["tl", "t", "tr", "r", "br", "b", "bl", "l"]) {
    const border = win.querySelector(`.border.${borderName}`);
    if (border) {
      border.onmousedown = (evt) => { draggedWindow = win; dragType = borderName; dragStartX = evt.clientX; dragStartY = evt.clientY; dragStartRect = win.getBoundingClientRect(); };
      border.ontouchstart = (evt) => { draggedWindow = win; dragType = borderName; dragStartX = evt.touches[0].clientX; dragStartY = evt.touches[0].clientY; dragStartRect = win.getBoundingClientRect(); };
    }
  }
}

document.querySelectorAll("dialog.window").forEach(smartifyWindow);

/* taskbar */

const orb = document.querySelector("#orb");
orb.onclick = () => {
  if (!startMenu.open) {
    setActiveWindow(null)
    startMenu.show();
  } else {
    startMenu.close();
  }
}

for (const button of document.querySelectorAll(["#startMenu nav button"])) {
  button.onclick = () => {
    const appName = button.getAttribute("data-app")
    startMenu.close()
    fetch(`apps/${appName}/app.html`).then(
      response => {
        response.text().then(
          (text) => {
            const domparsers = new DOMParser()
            const appDocument = domparsers.parseFromString(text, "text/html")
            const appTemplate = appDocument.querySelector("template");
            const window = windowTemplate.content.cloneNode(true).querySelector("dialog");
            window.querySelector("main").appendChild(appTemplate.content.cloneNode(true))
            window.classList.add(appTemplate.classList)
            window.setAttribute("open", "")
            const windowId = getNewWindowId()
            console.log({window})
            window.querySelector("input[name=reduce]").setAttribute("id", `window-${windowId}-reduce`)
            window.querySelector("header > img").setAttribute("src", `apps/${appName}/icon.svg`)
            window.querySelector("header > h1").textContent = appDocument.querySelector("head title").textContent
            window.querySelector("header > aside > label").setAttribute("for", `window-${windowId}-reduce`)
            document.querySelector("#windows").appendChild(window)
            smartifyWindow(window)
            setActiveWindow(window)
          }
        )
      }
    )
  }
}


const taskbarClock = document.querySelector("#taskbar aside time");

function updateTaskbarClock() {
  const now = new Date();
  taskbarClock.textContent = now.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"});
}

setInterval(updateTaskbarClock, 1000);
updateTaskbarClock();

/* sidebar */

const clock = document.querySelector("#clock")

function updateClockWidget() {
  const now = new Date();
  clock.style.setProperty("--hours", `${now.getHours()}`)
  clock.style.setProperty("--minutes", `${now.getMinutes()}`)
  clock.style.setProperty("--seconds", `${now.getSeconds()}`)
}

setInterval(updateClockWidget, 1000);
updateClockWidget();
