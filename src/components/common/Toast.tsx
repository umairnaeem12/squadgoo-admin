"use client";

import { useEffect } from "react";
import { CheckCircle2, XCircle, AlertCircle, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const config = {
    success: {
      icon: CheckCircle2,
      bgColor: "bg-green-50 dark:bg-green-500/10",
      borderColor: "border-green-500",
      textColor: "text-green-800 dark:text-green-400",
      iconColor: "text-green-500",
    },
    error: {
      icon: XCircle,
      bgColor: "bg-red-50 dark:bg-red-500/10",
      borderColor: "border-red-500",
      textColor: "text-red-800 dark:text-red-400",
      iconColor: "text-red-500",
    },
    warning: {
      icon: AlertCircle,
      bgColor: "bg-orange-50 dark:bg-orange-500/10",
      borderColor: "border-orange-500",
      textColor: "text-orange-800 dark:text-orange-400",
      iconColor: "text-orange-500",
    },
    info: {
      icon: AlertCircle,
      bgColor: "bg-blue-50 dark:bg-blue-500/10",
      borderColor: "border-blue-500",
      textColor: "text-blue-800 dark:text-blue-400",
      iconColor: "text-blue-500",
    },
  };

  const { icon: Icon, bgColor, borderColor, textColor, iconColor } = config[type];

  return (
    <div
      className={`fixed top-4 right-4 z-[9999] animate-in slide-in-from-right-full duration-300 ${bgColor} ${textColor} border-l-4 ${borderColor} rounded-lg shadow-lg p-4 min-w-[300px] max-w-md`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`h-5 w-5 flex-shrink-0 ${iconColor}`} />
        <p className="flex-1 text-sm font-medium">{message}</p>
        <button
          onClick={onClose}
          className={`flex-shrink-0 ${textColor} hover:opacity-70 transition`}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
