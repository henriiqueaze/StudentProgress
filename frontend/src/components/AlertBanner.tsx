import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import type { Alert } from "../types";

type AlertBannerProps = {
  alert: Alert;
  onDismiss: () => void;
};

const DRAG_DISMISS_X = 110;
const DRAG_DISMISS_Y = 72;

export function AlertBanner({ alert, onDismiss }: AlertBannerProps) {
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dismissDirection, setDismissDirection] = useState<
    "left" | "right" | "up" | "down" | null
  >(null);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    setDragOffset({ x: 0, y: 0 });
    setIsDragging(false);
    setDismissDirection(null);
    pointerStart.current = null;
  }, [alert]);

  function animateDismiss(direction: "left" | "right" | "up" | "down") {
    setDismissDirection(direction);
    window.setTimeout(onDismiss, 180);
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    pointerStart.current = { x: event.clientX, y: event.clientY };
    setIsDragging(true);
    setDismissDirection(null);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!isDragging || !pointerStart.current) {
      return;
    }

    setDragOffset({
      x: event.clientX - pointerStart.current.x,
      y: event.clientY - pointerStart.current.y,
    });
  }

  function handlePointerEnd() {
    if (!isDragging) {
      return;
    }

    setIsDragging(false);

    const shouldDismissHorizontal = Math.abs(dragOffset.x) > DRAG_DISMISS_X;
    const shouldDismissVertical = Math.abs(dragOffset.y) > DRAG_DISMISS_Y;

    if (shouldDismissHorizontal || shouldDismissVertical) {
      const isHorizontal = Math.abs(dragOffset.x) >= Math.abs(dragOffset.y);

      if (isHorizontal) {
        animateDismiss(dragOffset.x > 0 ? "right" : "left");
      } else {
        animateDismiss(dragOffset.y > 0 ? "down" : "up");
      }

      return;
    }

    setDragOffset({ x: 0, y: 0 });
  }

  const transform = dismissDirection
    ? dismissDirection === "left"
      ? "translate3d(-130vw, 0, 0)"
      : dismissDirection === "right"
        ? "translate3d(130vw, 0, 0)"
        : dismissDirection === "up"
          ? "translate3d(0, -130vh, 0)"
          : "translate3d(0, 130vh, 0)"
    : `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0)`;

  return (
    <div className="pointer-events-none fixed top-4 left-1/2 z-[90] w-full max-w-xl -translate-x-1/2 px-4 sm:top-5">
      <div
        className={`pointer-events-auto cursor-grab touch-none rounded-2xl border px-4 py-3 text-sm shadow-md backdrop-blur-sm active:cursor-grabbing ${
          isDragging || dismissDirection
            ? "transition-none"
            : "transition-transform duration-200 ease-out"
        } ${
          alert.type === "success"
            ? "border-emerald-200 bg-emerald-50/95 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-900/95 dark:text-emerald-200"
            : alert.type === "info"
              ? "border-sky-200 bg-sky-50/95 text-sky-800 dark:border-sky-700 dark:bg-sky-900/95 dark:text-sky-200"
              : "border-rose-200 bg-rose-50/95 text-rose-800 dark:border-rose-700 dark:bg-rose-900/95 dark:text-rose-200"
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        style={{ transform }}
        role="status"
      >
        {alert.message}
      </div>
    </div>
  );
}
