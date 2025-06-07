"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import ExtractedZone from "@/components/resume/extracted-zone";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { useLanguage } from "@/lib/i18n/context";

// Sample CV data for the review page
const sampleCVs = [
  {
    id: "1",
    date: format(new Date(), "MMM dd, yyyy"),
    title: format(new Date(), "MMM dd, yyyy"),
    degree: "Bachelor of Science in Computer Science",
    technicalSkills: "JavaScript, React, Node.js, Python",
    softSkills: "Communication, Teamwork, Problem-solving",
    experience: "3 years as a Full Stack Developer",
    isNew: true,
  },
  {
    id: "2",
    date: format(new Date(Date.now() - 86400000), "MMM dd, yyyy"),
    title: format(new Date(Date.now() - 86400000), "MMM dd, yyyy") + " (1)",
    degree: "Master of Science in Data Science",
    technicalSkills: "Python, R, SQL, Machine Learning",
    softSkills: "Data Visualization, Statistical Analysis, Critical Thinking",
    experience: "2 years as a Data Analyst",
    isNew: false,
  },
  {
    id: "3",
    date: format(new Date(Date.now() - 86400000 * 2), "MMM dd, yyyy"),
    title: format(new Date(Date.now() - 86400000 * 2), "MMM dd, yyyy"),
    degree: "Bachelor of Fine Arts in Graphic Design",
    technicalSkills: "Adobe Creative Suite, Figma, Sketch",
    softSkills: "Creativity, User Empathy, Collaboration",
    experience: "4 years as a UX/UI Designer",
    isNew: false,
  },
];

export default function ReviewPage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [cvs, setCvs] = useState(sampleCVs);
  const [selectedCVId, setSelectedCVId] = useState(sampleCVs[0].id);
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [cvName, setCvName] = useState("");
  const [startIndex, setStartIndex] = useState(0);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const { t } = useLanguage();

  const selectedCV = cvs.find((cv) => cv.id === selectedCVId) || cvs[0];
  const visibleCVs = cvs.slice(startIndex, startIndex + 3);
  const canGoNext = startIndex + 3 < cvs.length;
  const canGoPrev = startIndex > 0;

  // Show dialog for newly uploaded CVs
  useEffect(() => {
    const newCV = cvs.find((cv) => cv.isNew);
    if (newCV) {
      setSelectedCVId(newCV.id);
      setCvName(newCV.title);
      setShowNameDialog(true);
    }
  }, [cvs]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDiscard = () => {
    setIsEditing(false);
    // Reset to original data
    setCvs((prevCvs) =>
      prevCvs.map((cv) =>
        cv.id === selectedCVId
          ? { ...sampleCVs.find((s) => s.id === cv.id)!, isNew: false }
          : cv
      )
    );
  };

  const handleAccept = () => {
    setIsEditing(false);
    // Here you would typically save the changes to your backend
    console.log("Saving changes:", selectedCV);
  };

  const handleDataChange = (field: string, value: string) => {
    setCvs((prevCvs) =>
      prevCvs.map((cv) =>
        cv.id === selectedCVId ? { ...cv, [field]: value } : cv
      )
    );
  };

  const handleNameSubmit = () => {
    // Update the CV name
    setCvs((prevCvs) =>
      prevCvs.map((cv) =>
        cv.id === selectedCVId ? { ...cv, title: cvName, isNew: false } : cv
      )
    );
    setShowNameDialog(false);
  };

  const handleSuggest = () => {
    // Navigate to search page with suggest mode and CV info
    router.push(
      `/search?mode=suggest&cvId=${selectedCVId}&cvDate=${encodeURIComponent(
        selectedCV.title
      )}`
    );
  };

  const handleUploadAgain = () => {
    router.push("/upload");
  };

  const handlePrev = () => {
    if (canGoPrev) setStartIndex(startIndex - 1);
  };

  const handleNext = () => {
    if (canGoNext) setStartIndex(startIndex + 1);
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <>
      <Dialog open={showNameDialog} onOpenChange={setShowNameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("resume.nameYourCv")}</DialogTitle>
            <DialogDescription>{t("resume.giveYourCvAName")}</DialogDescription>
          </DialogHeader>
          <Input
            value={cvName}
            onChange={(e) => setCvName(e.target.value)}
            placeholder={t("resume.enterCvName")}
          />
          <DialogFooter>
            <Button onClick={handleNameSubmit}>{t("common.continue")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="container mx-auto max-w-5xl py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold">
                {t("resume.yourResume")}{" "}
                <span className="text-primary">resume</span>
              </h1>
              <p className="text-sm text-gray-500">{selectedCV.title}</p>
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={handleDiscard}>
                    {t("dashboard.discard")}
                  </Button>
                  <Button
                    className="bg-indigo-600 hover:bg-indigo-700"
                    onClick={handleAccept}
                  >
                    {t("dashboard.accept")}
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={handleEdit}>
                    {t("dashboard.edit")}
                  </Button>
                  <Button variant="outline" onClick={handleUploadAgain}>
                    {t("resume.uploadAgain")}
                  </Button>
                  <Button
                    className="bg-indigo-600 hover:bg-indigo-700"
                    onClick={handleSuggest}
                  >
                    {t("dashboard.suggest")}
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* CV Cards Navigation */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9"
                    disabled={!canGoPrev}
                    onClick={handlePrev}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9"
                    disabled={!canGoNext}
                    onClick={handleNext}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* CV Cards */}
            <div className="grid grid-cols-3 gap-4">
              {visibleCVs.map((cv) => (
                <div
                  key={cv.id}
                  className={`p-3 rounded-lg transition-colors cursor-pointer bg-[#E5FFF9] border ${
                    cv.id === selectedCVId
                      ? "border-indigo-500"
                      : "border-transparent hover:border-gray-200"
                  }`}
                  onClick={() => setSelectedCVId(cv.id)}
                >
                  <div className="flex items-start justify-between mb-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 -ml-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(cv.id);
                      }}
                    >
                      <Heart
                        className={
                          favorites[cv.id] ? "text-indigo-600" : "text-gray-400"
                        }
                        fill={favorites[cv.id] ? "currentColor" : "none"}
                      />
                    </Button>
                    {cv.isNew && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                        {t("resume.new")}
                      </span>
                    )}
                  </div>
                  <div className="cursor-pointer">
                    <p className="text-sm text-gray-600">{cv.date}</p>
                    <p className="text-xs text-gray-500 truncate">{cv.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Preview section */}
            <div className="lg:col-span-1 border rounded-lg p-4">
              <div className="aspect-[3/4] relative bg-gray-100 rounded-lg">
                {/* This would be replaced with the actual CV preview */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  {t("resume.cvPreview")}
                </div>
              </div>
            </div>

            {/* Extracted information */}
            <div className="lg:col-span-1">
              <ExtractedZone
                cvId={selectedCV.id}
                customData={selectedCV}
                isEditing={isEditing}
                onDataChange={handleDataChange}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
