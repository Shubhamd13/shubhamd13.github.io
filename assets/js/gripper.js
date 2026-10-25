// Robot gripper: on desktop the cursor's jaws close while a mouse button is held;
// on touch screens each tap drops a small gripper that grabs and lifts away.
(function () {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let lastPointerType = "mouse";

  const release = () => root.classList.remove("gripper-closed");

  document.addEventListener("pointerdown", (e) => {
    lastPointerType = e.pointerType;
    if (e.pointerType === "mouse") root.classList.add("gripper-closed");
  });
  document.addEventListener("pointerup", release);
  document.addEventListener("pointercancel", release);
  document.addEventListener("dragend", release);
  window.addEventListener("blur", release);

  // use click rather than pointerdown so starting a scroll doesn't trigger it
  document.addEventListener("click", (e) => {
    if (lastPointerType !== "touch" || reduceMotion.matches) return;

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "gripper-tap");
    svg.setAttribute("viewBox", "0 0 32 32");
    svg.setAttribute("aria-hidden", "true");
    // same shapes as assets/img/cursor/gripper-open.svg, flipped so the fingers point down
    svg.innerHTML =
      '<g transform="translate(0 32) scale(1 -1)">' +
      '<path d="M13.5 31 V22 H18.5 V31 Z"/>' +
      '<path d="M6 22.5 V17 H26 V22.5 Z"/>' +
      '<path class="gripper-jaw-l" d="M6.5 17 L3.8 8.5 L7.5 2.5 L11.2 3.8 L8.8 8.6 L11 17 Z"/>' +
      '<path class="gripper-jaw-r" d="M25.5 17 L28.2 8.5 L24.5 2.5 L20.8 3.8 L23.2 8.6 L21 17 Z"/>' +
      '<circle class="gripper-led" cx="16" cy="19.75" r="1.4"/>' +
      "</g>";
    svg.style.left = e.clientX + "px";
    svg.style.top = e.clientY + "px";
    svg.addEventListener("animationend", (event) => {
      if (event.target === svg) svg.remove();
    });
    document.body.appendChild(svg);
  });
})();
