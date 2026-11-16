"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE_SELECTOR =
  "a, button, input, textarea, select, label, [role='button']";

export function CustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!outer || !inner || !finePointer.matches || reducedMotion.matches) {
      return;
    }

    const move = (event: PointerEvent) => {
      outer.style.transform = `translate3d(calc(${event.clientX}px - 50%), calc(${event.clientY}px - 50%), 0)`;
      inner.style.left = `${event.clientX}px`;
      inner.style.top = `${event.clientY}px`;
      outer.classList.add("is-visible");
      inner.classList.add("is-visible");
    };

    const press = () => {
      outer.classList.add("is-clicking");
      inner.classList.add("custom-cursor__innerhover");
    };
    const release = () => {
      outer.classList.remove("is-clicking");
      inner.classList.remove("custom-cursor__innerhover");
    };
    const over = (event: PointerEvent) => {
      if ((event.target as Element | null)?.closest(INTERACTIVE_SELECTOR)) {
        outer.classList.add("custom-cursor__hover");
      }
    };
    const out = (event: PointerEvent) => {
      const nextTarget = event.relatedTarget as Element | null;
      if (!nextTarget?.closest?.(INTERACTIVE_SELECTOR)) {
        outer.classList.remove("custom-cursor__hover");
      }
    };

    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerdown", press);
    document.addEventListener("pointerup", release);
    document.addEventListener("pointerover", over);
    document.addEventListener("pointerout", out);

    return () => {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerdown", press);
      document.removeEventListener("pointerup", release);
      document.removeEventListener("pointerover", over);
      document.removeEventListener("pointerout", out);
    };
  }, []);

  return (
    <>
      <div ref={outerRef} className="custom-cursor__cursor" aria-hidden="true" />
      <div ref={innerRef} className="custom-cursor__cursor-two" aria-hidden="true" />
    </>
  );
}
