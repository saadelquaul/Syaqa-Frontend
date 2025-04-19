"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  closeOnClickOutside = true,
  closeOnEsc = true,
  showCloseButton = true,
  className,
}) {
  // Track if component is mounted (for SSR compatibility)
  const [isMounted, setIsMounted] = useState(false)
  // Reference to the overlay element for click detection
  const overlayRef = useRef(null)

  // Set up component on mount and handle body scroll
  useEffect(() => {
    setIsMounted(true)

    // Prevent scrolling on the body when modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden"
    }

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  // Handle keyboard events (Escape key)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && closeOnEsc) {
        onClose()
      }
    }

    // Add event listener when modal is open
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
    }

    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, closeOnEsc, onClose])

  // Handle clicks on the overlay (outside the modal)
  const handleOverlayClick = (e) => {
    if (closeOnClickOutside && e.target === overlayRef.current) {
      onClose()
    }
  }

  // CSS classes for different modal sizes
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-4xl",
  }

  // Don't render anything if not mounted or not open
  if (!isMounted || !isOpen) return null

  // Use createPortal to render the modal at the document body level
  // This ensures it appears above everything else
  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <div
        className={`bg-white rounded-lg shadow-xl w-full overflow-hidden ${sizeClasses[size]} ${className || ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        aria-describedby={description ? "modal-description" : undefined}
      >
        {/* Modal header with title and close button */}
        {(title || showCloseButton) && (
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            {title && (
              <div>
                <h3 id="modal-title" className="text-lg font-semibold text-slate-900">
                  {title}
                </h3>
                {description && (
                  <p id="modal-description" className="text-sm text-slate-500 mt-1">
                    {description}
                  </p>
                )}
              </div>
            )}
            {showCloseButton && (
              <button
                type="button"
                className="text-slate-400 hover:text-slate-500 focus:outline-none"
                onClick={onClose}
              >
                <span className="sr-only">Fermer</span>
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}

        <div className="px-6 py-4">{children}</div>

        {footer && <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">{footer}</div>}
      </div>
    </div>,
    document.body,
  )
}
