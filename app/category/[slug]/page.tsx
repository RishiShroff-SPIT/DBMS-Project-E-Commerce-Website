"use client";

import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  CalendarClock,
  ShoppingBag,
  Plus,
  Minus,
  Star,
  Zap,
  Search,
  SlidersHorizontal,
  Sparkles,
  Check,
  Eye,
  X,
  MapPin,
} from "lucide-react";
import { BeamsBackground } from "@/components/ui/beams-background";
import { renderCategoryIcon } from "@/components/ui/works-wheel";
import {
  CATEGORIES,
  getCategoryBySlug,
  getProductsByCategory,
  ProductItem,
} from "@/lib/catalog";
import { useStore } from "@/context/store-context";
import { cn } from "@/lib/utils";

function ProductCard({
  product,
  onQuickView,
}: {
  product: ProductItem;
  onQuickView: (p: ProductItem) => void;
}) {
  const {
    addToCart,
    updateQuantity,
    getItemQuantity,
    toggleWishlist,
    isWishlisted,
    setSchedulingProduct,
  } = useStore();

  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(
    product.variants?.[0]
  );

  const wishlisted = isWishlisted(product.id);
  const qty = getItemQuantity(product.id, selectedVariant);
  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <div className="group border-border/70 bg-card/85 text-card-foreground hover:border-primary/50 relative flex flex-col overflow-hidden rounded-2xl border shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      {/* Image Container */}
      <div className="bg-muted relative aspect-[4/3] w-full overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          onClick={() => onQuickView(product)}
          className="size-full cursor-pointer object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
          {discountPercent > 0 && (
            <span className="rounded-full bg-emerald-500 px-2.5 py-0.5 text-[0.68rem] font-bold text-white shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
          {product.badge && (
            <span className="rounded-full bg-black/65 px-2.5 py-0.5 text-[0.68rem] font-medium text-white backdrop-blur-md border border-white/15">
              {product.badge}
            </span>
          )}
        </div>

        {/* Top-Right Wishlist & Quick View Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => toggleWishlist(product)}
            aria-label={wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            title={wishlisted ? "Saved in Wishlist" : "Add to Wishlist"}
            className={cn(
              "flex size-9 items-center justify-center rounded-full border backdrop-blur-md transition-all",
              wishlisted
                ? "border-rose-500/40 bg-rose-500 text-white shadow-md shadow-rose-500/30 scale-105"
                : "border-white/20 bg-black/50 text-white hover:bg-black/75 hover:scale-105"
            )}
          >
            <Heart className={cn("size-4", wishlisted && "fill-current")} />
          </button>
          <button
            type="button"
            onClick={() => onQuickView(product)}
            title="Quick View Product"
            className="flex size-9 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white opacity-0 backdrop-blur-md transition-all group-hover:opacity-100 hover:bg-black/75"
          >
            <Eye className="size-4" />
          </button>
        </div>

        {/* Bottom Delivery Speed & Rating */}
        <div className="absolute right-3 bottom-2.5 left-3 flex items-center justify-between text-white">
          <span className="flex items-center gap-1 rounded-full bg-black/65 px-2.5 py-0.5 text-[0.68rem] font-semibold backdrop-blur-md">
            <Zap className="size-3 text-amber-400 fill-amber-400" />
            {product.deliveryMinutes} mins
          </span>
          <span className="flex items-center gap-1 rounded-full bg-black/65 px-2.5 py-0.5 text-[0.68rem] font-semibold backdrop-blur-md">
            <Star className="size-3 text-amber-400 fill-amber-400" />
            {product.rating} ({product.reviewsCount})
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-primary text-[0.68rem] font-bold tracking-wider uppercase">
              {product.subcategory}
            </span>
            <span className="text-muted-foreground text-[0.7rem] font-medium">
              {product.unit}
            </span>
          </div>

          <h3
            onClick={() => onQuickView(product)}
            className="hover:text-primary mt-1 cursor-pointer text-sm md:text-base font-bold tracking-tight line-clamp-1 transition-colors"
          >
            {product.name}
          </h3>

          <p className="text-muted-foreground mt-1 text-xs leading-relaxed line-clamp-2">
            {product.description}
          </p>

          {/* Variant / Size Selector (e.g. S, M, L, XL for Shirts/T-Shirts or 30, 32, 34 for Jeans) */}
          {product.variants && product.variants.length > 0 && (
            <div className="mt-3">
              <div className="text-muted-foreground mb-1 text-[0.68rem] font-medium">
                Select Option / Size:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {product.variants.map((variant) => (
                  <button
                    key={variant}
                    type="button"
                    onClick={() => setSelectedVariant(variant)}
                    className={cn(
                      "rounded-lg border px-2.5 py-1 text-[0.7rem] font-semibold transition-all",
                      selectedVariant === variant
                        ? "border-primary bg-primary/15 text-primary shadow-sm"
                        : "border-border bg-secondary/50 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {variant}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Price + Action Buttons (Schedule Delivery & Add to Cart) */}
        <div className="border-border/60 mt-4 border-t pt-3.5">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-extrabold tracking-tight">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-muted-foreground text-xs line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              className={cn(
                "text-[0.7rem] font-medium underline-offset-2 hover:underline",
                wishlisted ? "text-rose-500" : "text-muted-foreground"
              )}
            >
              {wishlisted ? "♥ Wishlisted" : "+ Wishlist"}
            </button>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            {/* Schedule Delivery Button */}
            <button
              type="button"
              onClick={() => setSchedulingProduct(product)}
              className="border-border bg-secondary/80 hover:bg-secondary text-foreground flex items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-semibold transition-all"
            >
              <CalendarClock className="text-primary size-3.5" />
              <span>Schedule</span>
            </button>

            {/* Add to Cart / Quantity Stepper */}
            {qty === 0 ? (
              <button
                type="button"
                onClick={() => addToCart(product, selectedVariant)}
                className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold shadow-md shadow-orange-500/20 transition-all active:scale-95"
              >
                <ShoppingBag className="size-3.5" />
                <span>Add to Cart</span>
              </button>
            ) : (
              <div className="bg-primary text-primary-foreground flex items-center justify-between rounded-xl px-2.5 py-1.5 shadow-md shadow-orange-500/20">
                <button
                  type="button"
                  onClick={() =>
                    updateQuantity(product.id, -1, selectedVariant)
                  }
                  className="hover:bg-black/20 rounded-lg p-1 transition-colors"
                >
                  <Minus className="size-3.5" />
                </button>
                <span className="text-xs font-bold">{qty}</span>
                <button
                  type="button"
                  onClick={() =>
                    updateQuantity(product.id, 1, selectedVariant)
                  }
                  className="hover:bg-black/20 rounded-lg p-1 transition-colors"
                >
                  <Plus className="size-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CategoryPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug || "clothes";
  const category = getCategoryBySlug(slug) || CATEGORIES[0];
  const allCategoryProducts = useMemo(
    () => getProductsByCategory(category.slug),
    [category.slug]
  );

  const {
    cartCount,
    cartSubtotal,
    globalSchedule,
    setIsCartOpen,
    setIsGlobalScheduleModalOpen,
    addToCart,
    toggleWishlist,
    isWishlisted,
    setSchedulingProduct,
  } = useStore();

  const [activeSubcategory, setActiveSubcategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<
    "featured" | "price-asc" | "price-desc" | "rating"
  >("featured");
  const [quickViewProduct, setQuickViewProduct] =
    useState<ProductItem | null>(null);
  const [quickViewVariant, setQuickViewVariant] = useState<string>("");

  const filteredProducts = useMemo(() => {
    return allCategoryProducts
      .filter((item) => {
        const matchesSub =
          activeSubcategory === "All" ||
          item.subcategory === activeSubcategory;
        const matchesSearch =
          !searchQuery.trim() ||
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.subcategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSub && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        return 0;
      });
  }, [allCategoryProducts, activeSubcategory, searchQuery, sortBy]);

  return (
    <BeamsBackground intensity="medium">
      <div className="mx-auto min-h-screen max-w-7xl px-4 pt-20 pb-28 sm:px-6">
        {/* Top Breadcrumb + Category Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-3">
          <Link
            href="/"
            className="border-border/80 bg-card/80 hover:bg-accent inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold shadow-sm backdrop-blur-md transition-all"
          >
            <ArrowLeft className="size-4" />
            Back to Home
          </Link>

          {/* Quick Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {CATEGORIES.map((cat) => {
              const isCurrent = cat.slug === category.slug;
              return (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  onClick={() => setActiveSubcategory("All")}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                    isCurrent
                      ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                      : "border-border/60 bg-card/60 text-muted-foreground hover:text-foreground border backdrop-blur-md"
                  )}
                >
                  {renderCategoryIcon(cat.slug, "size-3")}
                  {cat.title}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Category Hero Banner */}
        <div className="border-border/70 bg-card/80 relative mt-2 overflow-hidden rounded-3xl border p-6 sm:p-8 shadow-xl backdrop-blur-xl">
          <div
            className={cn(
              "pointer-events-none absolute inset-0 bg-gradient-to-r opacity-60",
              category.accentColor
            )}
          />
          <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                <span className="bg-primary text-primary-foreground flex size-5 items-center justify-center rounded-full">
                  {renderCategoryIcon(category.slug, "size-3")}
                </span>
                <span>{category.badge}</span>
                <span>•</span>
                <span>SwiftCart Express Store</span>
              </div>
              <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                {category.title}
              </h1>
              <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                {category.heroTagline}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsGlobalScheduleModalOpen(true)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold shadow-md shadow-orange-500/20 transition-all"
                >
                  <MapPin className="size-4" />
                  Pin Address on Google Maps & Schedule ({globalSchedule.date} •{" "}
                  {globalSchedule.timeSlot})
                </button>
              </div>
            </div>

            <div className="relative h-36 w-full overflow-hidden rounded-2xl md:h-40 md:w-72 shrink-0 border border-white/15 shadow-lg">
              <img
                src={category.image}
                alt={category.title}
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 text-xs font-semibold text-white">
                {allCategoryProducts.length} Curated Products Available
              </div>
            </div>
          </div>
        </div>

        {/* Subcategory Tabs (e.g. All, Jeans, T-Shirts, Shirts, Outerwear) + Search & Sort */}
        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Subcategory Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {category.subcategories.map((sub) => {
              const active = activeSubcategory === sub;
              const count =
                sub === "All"
                  ? allCategoryProducts.length
                  : allCategoryProducts.filter((p) => p.subcategory === sub)
                      .length;
              return (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setActiveSubcategory(sub)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all",
                    active
                      ? "border-primary bg-primary text-primary-foreground shadow-md shadow-orange-500/20"
                      : "border-border/70 bg-card/75 text-muted-foreground hover:text-foreground hover:bg-card backdrop-blur-md"
                  )}
                >
                  <span>{sub}</span>
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.2 text-[0.65rem]",
                      active
                        ? "bg-black/20 text-white"
                        : "bg-secondary text-muted-foreground"
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="border-border/70 bg-card/80 relative flex flex-1 sm:w-64 items-center rounded-xl border px-3 py-2 backdrop-blur-md">
              <Search className="text-muted-foreground mr-2 size-4 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search in ${category.title}...`}
                className="w-full bg-transparent text-xs outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            <div className="border-border/70 bg-card/80 flex items-center gap-2 rounded-xl border px-3 py-2 text-xs backdrop-blur-md">
              <SlidersHorizontal className="text-muted-foreground size-3.5" />
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as
                      | "featured"
                      | "price-asc"
                      | "price-desc"
                      | "rating"
                  )
                }
                className="bg-transparent font-medium outline-none"
              >
                <option value="featured" className="bg-card text-foreground">
                  Sort: Featured
                </option>
                <option value="price-asc" className="bg-card text-foreground">
                  Price: Low to High
                </option>
                <option value="price-desc" className="bg-card text-foreground">
                  Price: High to Low
                </option>
                <option value="rating" className="bg-card text-foreground">
                  Highest Rated
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="border-border/60 bg-card/70 mt-8 flex flex-col items-center justify-center rounded-3xl border py-16 text-center backdrop-blur-xl">
            <Sparkles className="text-primary mb-3 size-8" />
            <h3 className="text-base font-bold">No matching products found</h3>
            <p className="text-muted-foreground mt-1 text-xs">
              Try clearing your search filter or switching to &ldquo;All&rdquo;{" "}
              in {category.title}.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveSubcategory("All");
                setSearchQuery("");
              }}
              className="bg-primary text-primary-foreground mt-4 rounded-xl px-4 py-2 text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => {
                  setQuickViewProduct(p);
                  setQuickViewVariant(p.variants?.[0] || "");
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setQuickViewProduct(null)}
          />
          <div className="border-border bg-card text-card-foreground relative z-10 grid w-full max-w-2xl grid-cols-1 overflow-hidden rounded-3xl border shadow-2xl md:grid-cols-2">
            <div className="relative aspect-square md:aspect-auto">
              <img
                src={quickViewProduct.image}
                alt={quickViewProduct.name}
                className="size-full object-cover"
              />
              <button
                type="button"
                onClick={() => toggleWishlist(quickViewProduct)}
                className={cn(
                  "absolute top-4 left-4 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur-md transition-all",
                  isWishlisted(quickViewProduct.id)
                    ? "bg-rose-500 text-white"
                    : "bg-black/60 text-white hover:bg-black/80"
                )}
              >
                <Heart
                  className={cn(
                    "size-3.5",
                    isWishlisted(quickViewProduct.id) && "fill-current"
                  )}
                />
                {isWishlisted(quickViewProduct.id)
                  ? "Wishlisted"
                  : "Save to Wishlist"}
              </button>
            </div>

            <div className="flex flex-col justify-between p-6">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-primary text-xs font-bold uppercase">
                    {quickViewProduct.subcategory}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuickViewProduct(null)}
                    className="text-muted-foreground hover:text-foreground rounded-lg p-1"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                <h2 className="mt-1 text-xl font-extrabold tracking-tight">
                  {quickViewProduct.name}
                </h2>

                <div className="mt-2 flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 font-semibold text-amber-500">
                    <Star className="size-3.5 fill-current" />
                    {quickViewProduct.rating} ({quickViewProduct.reviewsCount}{" "}
                    reviews)
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span className="font-semibold text-emerald-500">
                    ⚡ {quickViewProduct.deliveryMinutes} mins express
                  </span>
                </div>

                <p className="text-muted-foreground mt-3 text-xs leading-relaxed">
                  {quickViewProduct.description}
                </p>

                {quickViewProduct.variants && (
                  <div className="mt-4">
                    <label className="text-muted-foreground mb-1.5 block text-xs font-semibold">
                      Select Option / Size:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {quickViewProduct.variants.map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setQuickViewVariant(v)}
                          className={cn(
                            "rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all",
                            quickViewVariant === v
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-secondary/60"
                          )}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="border-border mt-6 border-t pt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold">
                    ${quickViewProduct.price.toFixed(2)}
                  </span>
                  <span className="text-muted-foreground text-sm line-through">
                    ${quickViewProduct.originalPrice.toFixed(2)}
                  </span>
                  <span className="text-muted-foreground ml-auto text-xs">
                    {quickViewProduct.unit}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      const prod = quickViewProduct;
                      setQuickViewProduct(null);
                      setSchedulingProduct(prod);
                    }}
                    className="border-border bg-secondary hover:bg-secondary/80 flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-xs font-semibold"
                  >
                    <CalendarClock className="text-primary size-4" />
                    Schedule Delivery
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      addToCart(
                        quickViewProduct,
                        quickViewVariant || quickViewProduct.variants?.[0]
                      );
                      setQuickViewProduct(null);
                    }}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold shadow-lg shadow-orange-500/20"
                  >
                    <ShoppingBag className="size-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Instamart Bottom Cart Bar */}
      {cartCount > 0 && (
        <div className="fixed right-0 bottom-4 left-0 z-30 mx-auto max-w-xl px-4">
          <div className="border-primary/40 bg-card/95 text-card-foreground flex items-center justify-between rounded-2xl border p-3.5 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-xl font-bold shadow-md">
                {cartCount}
              </div>
              <div>
                <div className="text-xs font-bold">
                  ${cartSubtotal.toFixed(2)} •{" "}
                  <span className="text-emerald-500">FREE Delivery</span>
                </div>
                <div className="text-muted-foreground text-[0.7rem]">
                  {globalSchedule.mode === "instant"
                    ? "⚡ Arriving in 8–15 mins"
                    : `📅 Scheduled: ${globalSchedule.date} (${globalSchedule.timeSlot})`}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsGlobalScheduleModalOpen(true)}
                className="border-border bg-secondary hover:bg-secondary/80 hidden sm:flex items-center gap-1 rounded-xl border px-3 py-2 text-xs font-semibold"
              >
                <CalendarClock className="text-primary size-3.5" />
                Slot
              </button>
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold shadow-md"
              >
                <span>View Cart</span>
                <ShoppingBag className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </BeamsBackground>
  );
}
