"use client";

import { Heart, Bookmark, EyeOff, RefreshCcw, LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

// --- Component con cho từng nút hành động ---
interface ActionButtonProps {
  onClick: () => void;
  "aria-label": string;
  className?: string;
  icon: React.ElementType<LucideProps>;
  isActive?: boolean;
  activeColor?: string;
  children?: React.ReactNode;
}

function ActionButton({
  onClick,
  icon: Icon,
  isActive = false,
  activeColor,
  className,
  children,
  ...props
}: ActionButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  };

  const iconFill = isActive ? "currentColor" : "none";

  return (
    <button
      onClick={handleClick}
      className={cn(
        "p-2 bg-brand-cream hover:bg-opacity-90 rounded-lg text-black transition-colors duration-200",
        isActive && activeColor,
        className
      )}
      {...props}
    >
      {children}
      <Icon className="h-5 w-5" fill={Icon === Heart || Icon === Bookmark ? iconFill : "none"} />
    </button>
  );
}

// --- Component chính đã được làm gọn ---
interface JobCardActionsProps {
  isFavorite: boolean;
  isArchived: boolean;
  isHovered: boolean; // Prop này không còn được sử dụng trong logic hiển thị, có thể xem xét loại bỏ nếu không cần
  isInBin: boolean;
  handleToggleFavorite: () => void;
  handleToggleArchived: () => void;
  handleHideClick: () => void;
  handleRestoreClick: () => void;
}

export function JobCardActions({
  isFavorite,
  isArchived,
  isInBin,
  handleToggleFavorite,
  handleToggleArchived,
  handleHideClick,
  handleRestoreClick,
}: JobCardActionsProps) {
  
  if (isInBin) {
    return (
      <div className="absolute -top-1.5 -right-1.5 z-20">
        <ActionButton
          onClick={handleRestoreClick}
          icon={RefreshCcw}
          aria-label="Restore job"
          className="flex items-center gap-2 bg-brand-cream text-brand-background px-4 py-2 rounded-tr-xl rounded-bl-xl hover:bg-opacity-90"
        >
          <span>restore</span>
        </ActionButton>
      </div>
    );
  }

  const actions = [
    {
      id: "favorite",
      onClick: handleToggleFavorite,
      icon: Heart,
      isActive: isFavorite,
      activeColor: "text-red-500",
      "aria-label": isFavorite ? "Remove from favorites" : "Add to favorites",
    },
    {
      id: "archive",
      onClick: handleToggleArchived,
      icon: Bookmark,
      isActive: isArchived,
      activeColor: "text-yellow-500",
      "aria-label": isArchived ? "Unarchive" : "Archive",
    },
    {
      id: "hide",
      onClick: handleHideClick,
      icon: EyeOff,
      "aria-label": "Hide job",
    },
  ];

  return (
    <div className="absolute -top-1.5 -right-1.5 z-20 flex space-x-1 bg-brand-background p-1.5 rounded-tr-xl rounded-bl-xl">
      {actions.map((action) => (
        <ActionButton key={action.id} {...action} />
      ))}
    </div>
  );
}