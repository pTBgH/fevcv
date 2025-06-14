"use client";

import { useState, useEffect } from "react";
import { LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/context";
import { useIsMobile } from "@/hooks/use-mobile";

// Định nghĩa các chế độ hiển thị cố định
export type DisplayModeOption = "2x2" | "3x3" | "1x1" | "2x1";

export type DisplayMode = {
  columns: 1 | 2 | 3 | 4;
  rows: 1 | 2 | 3 | 4;
};

interface DisplayModeSelectorProps {
  onChange: (mode: DisplayMode) => void;
  currentMode: DisplayMode;
  className?: string;
}

export function DisplayModeSelector({
  onChange,
  currentMode,
  className = "",
}: DisplayModeSelectorProps) {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();

  // Only show after first mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Add default values to prevent undefined errors
  const columns = currentMode?.columns || (isMobile ? 1 : 3);

  // Xử lý khi người dùng nhấn nút
  const handleClick = () => {
    let nextMode: DisplayMode;

    if (isMobile) {
      // Trên mobile: chuyển đổi giữa 1 job 1 hàng và 2 job 1 hàng
      nextMode =
        columns === 1 ? { columns: 2, rows: 1 } : { columns: 1, rows: 1 };
    } else {
      // Trên desktop: chuyển đổi giữa 2x2 và 3x3
      nextMode =
        columns === 2 ? { columns: 3, rows: 2 } : { columns: 2, rows: 3 };
    }

    onChange(nextMode);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className={`h-8 px-2 ${className}`}
      onClick={handleClick}
      title={t("common.displayMode")}
    >
      <LayoutGrid className="h-4 w-4" />
    </Button>
  );
}
