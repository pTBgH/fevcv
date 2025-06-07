"use client";

import type { RefObject } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/context";

interface JobCardDialogProps {
  dialogType: "hide" | "favorite" | "archive";
  isOpen: boolean;
  dontAskAgainToday: boolean; // Sử dụng duy nhất prop này
  onDontAskAgainTodayChange: (checked: boolean) => void;
  onCancel: () => void;
  onConfirm: () => void;
  dialogRef: RefObject<HTMLDivElement | null>;
}

export function JobCardDialog({
  dialogType,
  isOpen,
  dontAskAgainToday,
  onDontAskAgainTodayChange,
  onCancel,
  onConfirm,
  dialogRef,
}: JobCardDialogProps) {
  const { t } = useLanguage();

  const getTitle = () => {
    switch (dialogType) {
      case "hide":
        return t("dialog.hideJobTitle");
      case "favorite":
        return t("dialog.unfavoriteJobTitle");
      case "archive":
        return t("dialog.unarchiveJobTitle");
      default:
        return t("dialog.confirmAction");
    }
  };

  const getMessage = () => {
    switch (dialogType) {
      case "hide":
        return t("dialog.hideJobMessage");
      case "favorite":
        return t("dialog.unfavoriteJobMessage");
      case "archive":
        return t("dialog.unarchiveJobMessage");
      default:
        return t("dialog.confirmActionMessage");
    }
  };

  const getConfirmText = () => {
    switch (dialogType) {
      case "hide":
        return t("common.hide");
      case "favorite":
        return t("dialog.unfavorite");
      case "archive":
        return t("dialog.unarchive");
      default:
        return t("common.confirm");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div
        ref={dialogRef}
        className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4 animate-in fade-in duration-200"
      >
        <h3 className="text-lg font-semibold mb-2">{getTitle()}</h3>
        <p className="text-gray-600 mb-4">{getMessage()}</p>
        {/* Chỉ hiển thị checkbox "Không hỏi lại trong hôm nay" */}
        <div className="flex items-center space-x-2 mb-4">
          <Checkbox
            id="dont-ask-again-today"
            checked={dontAskAgainToday}
            onCheckedChange={onDontAskAgainTodayChange}
          />
          <label
            htmlFor="dont-ask-again-today"
            className="text-sm text-gray-600"
          >
            {t("dialog.dontAskAgainToday")}
          </label>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel}>
            {t("common.cancel")}
          </Button>
          <Button
            variant={dialogType === "hide" ? "destructive" : "default"}
            onClick={onConfirm}
          >
            {getConfirmText()}
          </Button>
        </div>
      </div>
    </div>
  );
}
