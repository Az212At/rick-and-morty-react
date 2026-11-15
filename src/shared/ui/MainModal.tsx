import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface MainModalProps {
  isOpen: boolean;
  onClose: () => void;
  labelledBy: string;
  children: ReactNode;
}

export default function MainModal({
  isOpen,
  onClose,
  labelledBy,
  children,
}: MainModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const backdropPointerDown = useRef(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!isOpen || !dialog) {
      return;
    }

    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (!dialog.open) {
      dialog.showModal();
    }

    return () => {
      if (dialog.open) {
        dialog.close();
      }
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus();
      }
    };
  }, [isOpen]);

  function isOutsideDialog(clientX: number, clientY: number) {
    const bounds = dialogRef.current?.getBoundingClientRect();
    return bounds
      ? clientX < bounds.left ||
          clientX > bounds.right ||
          clientY < bounds.top ||
          clientY > bounds.bottom
      : false;
  }

  return createPortal(
    <dialog
      ref={dialogRef}
      className="main-dialog"
      aria-labelledby={labelledBy}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onPointerDown={(event) => {
        backdropPointerDown.current =
          event.target === event.currentTarget &&
          isOutsideDialog(event.clientX, event.clientY);
      }}
      onClick={(event) => {
        if (
          backdropPointerDown.current &&
          event.target === event.currentTarget &&
          isOutsideDialog(event.clientX, event.clientY)
        ) {
          onClose();
        }
        backdropPointerDown.current = false;
      }}
    >
      {children}
    </dialog>,
    document.body
  );
}
