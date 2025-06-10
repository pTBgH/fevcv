// src/components/resume/ResumeList.tsx
"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { CVCard } from "@/components/resume/cv-card";
import type { Resume } from "@/lib/types";
import { useLanguage } from "@/lib/i18n/context";

interface ResumeListProps {
  resumes: Resume[];
  selectedResumeId: string | null;
  onSelectResume: (cv: Resume) => void;
  onToggleFavorite: (id: string) => void;
}

export function ResumeList({
  resumes,
  selectedResumeId,
  onSelectResume,
  onToggleFavorite,
}: ResumeListProps) {
  const { t } = useLanguage();

  return (
    <>
      <h2 className="text-lg font-semibold text-black mb-3">
        {t("resume.yourResumes")}
      </h2>
      <ScrollArea className="h-[calc(100vh-280px)] pr-5">
        <div className="space-y-2">
          {resumes.map((cv) => (
            <CVCard
              key={cv.id}
              cv={cv}
              isSelected={selectedResumeId === cv.id}
              onSelect={() => onSelectResume(cv)}
              isFavorite={cv.isFavorite}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      </ScrollArea>
    </>
  );
}
