"use client";

import React, { useEffect } from "react";
import { LanguageProvider } from "@/lib/i18n/context";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setNavType } from "@/lib/redux/slices/uiSlice";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { FooterWrapper } from "@/components/layout/footer-wrapper";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();

  // Set navigation type to 'dashboard' when entering dashboard
  useEffect(() => {
    dispatch(setNavType("dashboard"));

    // Cleanup: reset navigation type to 'main' when leaving dashboard
    return () => {
      dispatch(setNavType("main"));
    };
  }, [dispatch]);

  return (
    <LanguageProvider>
      <div className="flex flex-col min-h-screen bg-[#F0F0F0]">
        <DashboardNav />
        <main className="flex-1 pt-16 p-4 md:p-6 overflow-auto">
          <div className="max-w-screen-xl mx-auto">{children}</div>
        </main>
        <FooterWrapper />
      </div>
    </LanguageProvider>
  );
}
