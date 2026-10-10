"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  Heart,
  CalendarClock,
  Zap,
  Sun,
  Moon,
  Home,
  MapPin,
} from "lucide-react";
import { useStore } from "@/context/store-context";
import { CATEGORIES } from "@/lib/catalog";
import { renderCategoryIcon } from "@/components/ui/works-wheel";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const {
    theme,
    toggleTheme,
    cartCount,
    cartSubtotal,
    wishlist,
    globalSchedule,
    orders,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsGlobalScheduleModalOpen,
  } = useStore();

  // Do not show the navigation bar on the Home page; only show once inside a category page
  if (pathname === "/") {
    return null;
  }

  return (
    <header className="border-border/50 bg-background/75 fixed top-0 right-0 left-0 z-40 border-b backdrop-blur-xl transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        {/* Brand + Google Maps Location & Delivery Slot Pill */}
        <div className="flex items-center gap-2.5 md:gap-4">
          <Link
            href="/"
            className="group flex items-center gap-2.5 focus:outline-none"
          >
            <div className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-xl shadow-md shadow-orange-500/20 transition-transform group-hover:scale-105">
              <Zap className="size-5 fill-current" />
            </div>
            <div className="flex flex-col">
              <span className="text-base md:text-lg font-bold tracking-tight leading-none">
                Swift<span className="text-primary">Cart</span>
              </span>
              <span className="text-muted-foreground text-[0.65rem] font-medium tracking-wider uppercase">
                Express Delivery
              </span>
            </div>
          </Link>

          {/* Google Maps Address + Delivery Schedule Selector Pill */}
          <button
            type="button"
            onClick={() => setIsGlobalScheduleModalOpen(true)}
            className="border-border/80 bg-secondary/70 hover:bg-secondary hidden sm:flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-all"
          >
            <span className="text-primary flex items-center gap-1 font-semibold">
              <MapPin className="size-3.5" />
              <span className="max-w-[140px] truncate">
                {globalSchedule.address}
              </span>
            </span>
            <span className="text-muted-foreground">•</span>
            {globalSchedule.mode === "instant" ? (
              <span className="flex items-center gap-1 font-semibold text-emerald-500 dark:text-emerald-400">
                <Zap className="size-3.5 fill-current" />
                8–15m
              </span>
            ) : (
              <span className="text-primary flex items-center gap-1 font-semibold">
                <CalendarClock className="size-3.5" />
                {globalSchedule.date}
              </span>
            )}
            <span className="text-primary font-medium underline-offset-2 hover:underline">
              Map & Slot
            </span>
          </button>
        </div>

        {/* Center Quick Category Bar */}
        <nav className="hidden xl:flex items-center gap-1">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground hover:bg-accent flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
          >
            <Home className="size-3.5" />
            Home
          </Link>
          {CATEGORIES.slice(0, 6).map((cat) => {
            const active = pathname === `/category/${cat.slug}`;
            return (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                {renderCategoryIcon(cat.slug, "size-3")}
                {cat.title}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Map/Schedule (Mobile), Theme Toggle, Wishlist, Cart */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsGlobalScheduleModalOpen(true)}
            title="Set Address on Google Maps & Schedule Delivery"
            className="border-border/70 bg-secondary/60 hover:bg-secondary flex sm:hidden size-9 items-center justify-center rounded-xl border transition-colors"
          >
            <MapPin className="text-primary size-4" />
          </button>

          {/* Theme Toggle (Dark / Light) */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle Light/Dark Mode"
            title={
              theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"
            }
            className="border-border/70 bg-secondary/60 hover:bg-secondary text-foreground flex h-9 items-center gap-1.5 rounded-xl border px-2.5 text-xs font-medium transition-colors"
          >
            {theme === "dark" ? (
              <>
                <Sun className="size-4 text-amber-400" />
                <span className="hidden md:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="size-4 text-indigo-600" />
                <span className="hidden md:inline">Dark</span>
              </>
            )}
          </button>

          {/* Wishlist Trigger */}
          <button
            type="button"
            onClick={() => setIsWishlistOpen(true)}
            aria-label="Open Wishlist"
            className="border-border/70 bg-secondary/60 hover:bg-secondary relative flex h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-medium transition-colors"
          >
            <Heart
              className={cn(
                "size-4 transition-colors",
                wishlist.length > 0
                  ? "fill-rose-500 text-rose-500"
                  : "text-muted-foreground"
              )}
            />
            <span className="hidden md:inline">Wishlist</span>
            {wishlist.length > 0 && (
              <span className="bg-rose-500 text-white flex size-4 items-center justify-center rounded-full text-[0.65rem] font-bold">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Trigger */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            aria-label="Open Cart"
            className="bg-primary text-primary-foreground hover:bg-primary/90 relative flex h-9 items-center gap-2 rounded-xl px-3.5 text-xs font-semibold shadow-md shadow-orange-500/20 transition-all"
          >
            <ShoppingBag className="size-4" />
            {cartCount > 0 ? (
              <div className="flex items-center gap-1.5">
                <span>{cartCount} items</span>
                <span className="opacity-60">•</span>
                <span>${cartSubtotal.toFixed(2)}</span>
              </div>
            ) : (
              <span>Cart</span>
            )}
            {orders.length > 0 && cartCount === 0 && (
              <span
                title={`${orders.length} active scheduled order(s)`}
                className="flex size-2 rounded-full bg-emerald-300 animate-pulse"
              />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
