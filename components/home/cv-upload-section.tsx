"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Upload, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export function CVUploadSection() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();
  const { addToast: toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      handleFile(droppedFile);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      handleFile(selectedFile);
    }
  };

  const handleFile = (file: File) => {
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or Word document",
        type: "error",
      });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB",
        type: "error",
      });
      return;
    }
    setFile(file);
    toast({
      title: "File uploaded successfully",
      description: "You can now get job suggestions!",
      type: "success",
    });
  };

  const handleSuggestionClick = () => {
    if (file) {
      router.push("/search");
    }
  };

  return (
    <div className="py-20 flex flex-col lg:flex-row items-center justify-between gap-8">
      {/* Left side - Text content */}
      <div className="lg:w-1/2 w-full mb-10 lg:mb-0 lg:pr-12 flex flex-col items-start">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
          Find your next job<br />in seconds
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          We know job hunting can be overwhelming. That's why we make it simple — just upload your CV, and we'll instantly show you jobs that actually match your skills and background.
        </p>
        <label htmlFor="file-upload" className="inline-block">
          <Button size="lg" className="flex items-center gap-2" asChild>
            <span>
              Upload Resume
              <span className="ml-2 inline-flex items-center justify-center w-8 h-8 rounded border border-gray-300 dark:border-gray-700">
                <ArrowUp className="h-5 w-5" />
              </span>
            </span>
          </Button>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx"
            onChange={handleFileInput}
          />
        </label>
      </div>
      {/* Right side - Upload zone */}
      <div className="lg:w-1/2 w-full flex flex-col items-center">
        <div
          className={`w-full border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
            isDragging
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
              : "border-gray-300 dark:border-gray-700"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full">
              <FileText className="h-8 w-8 text-gray-500 dark:text-gray-400" />
            </div>
          </div>
          <h3 className="text-lg font-medium mb-2">
            Just drop your CV below,<br />we'll handle the rest
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Drag and drop here or click to upload
          </p>
          <label htmlFor="dropzone-file" className="cursor-pointer">
            <Button variant="outline" size="sm">
              Browse files
            </Button>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={handleFileInput}
            />
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            Supported formats: PDF, DOC, DOCX (max 5MB)
          </p>
        </div>
        <Button
          variant="ghost"
          className="w-full py-2 mt-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
          disabled={!file}
          onClick={handleSuggestionClick}
        >
          Get free jobs suggestion
        </Button>
      </div>
    </div>
  );
}
