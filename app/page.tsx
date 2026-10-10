"use client";

import React from "react";
import { WorksWheel, type WorksWheelItem } from "@/components/ui/works-wheel";
import { BeamsBackground } from "@/components/ui/beams-background";
import { CATEGORIES } from "@/lib/catalog";
import { useStore } from "@/context/store-context";

const WHEEL_CATEGORIES: WorksWheelItem[] = CATEGORIES.map((cat) => ({
  title: cat.title,
  image: cat.image,
  href: `/category/${cat.slug}`,
  subtitle: cat.subtitle,
  badge: cat.badge,
  iconName: cat.slug,
}));

export default function HomePage() {
  const {
    theme,
    toggleTheme,
    globalSchedule,
    setIsGlobalScheduleModalOpen,
  } = useStore();

  return (
    <BeamsBackground intensity="strong">
      <main className="h-screen w-full overflow-hidden">
        <WorksWheel
          items={WHEEL_CATEGORIES}
          label="SwiftCart '26"
          action="Shop"
          onToggleTheme={toggleTheme}
          isDark={theme === "dark"}
          onOpenMapModal={() => setIsGlobalScheduleModalOpen(true)}
          currentAddress={globalSchedule.address}
          className="bg-transparent"
        />
      </main>
    </BeamsBackground>
  );
}
