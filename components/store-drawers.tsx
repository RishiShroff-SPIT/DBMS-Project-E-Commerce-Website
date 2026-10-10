"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Heart,
  CalendarClock,
  Zap,
  CheckCircle2,
  MapPin,
  Clock,
  Repeat,
  ArrowRight,
  PackageCheck,
  LocateFixed,
  ExternalLink,
  Search,
  Loader2,
} from "lucide-react";
import {
  useStore,
  getWishlistedProducts,
  DeliverySchedule,
} from "@/context/store-context";
import { cn } from "@/lib/utils";

const DATE_OPTIONS = [
  { label: "Today", sub: "Express slots open" },
  { label: "Tomorrow", sub: "Morning & evening" },
  { label: "This Weekend", sub: "Sat / Sun delivery" },
];

const TIME_SLOTS = [
  "8:00 AM – 10:00 AM",
  "10:00 AM – 12:00 PM",
  "1:00 PM – 3:00 PM",
  "4:00 PM – 6:00 PM",
  "6:00 PM – 8:00 PM",
  "8:00 PM – 10:00 PM",
];

const QUICK_LOCATIONS = [
  "Times Square, Manhattan, NY",
  "Silicon Valley Tech Park, San Jose, CA",
  "Connaught Place, New Delhi",
  "Bandra West, Mumbai",
  "Downtown Austin, TX",
];

export function StoreDrawers() {
  const {
    cart,
    wishlist,
    globalSchedule,
    orders,
    isCartOpen,
    setIsCartOpen,
    isWishlistOpen,
    setIsWishlistOpen,
    schedulingProduct,
    setSchedulingProduct,
    isGlobalScheduleModalOpen,
    setIsGlobalScheduleModalOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    toggleWishlist,
    updateGlobalSchedule,
    placeOrder,
    cartSubtotal,
    toasts,
    dismissToast,
  } = useStore();

  const [mode, setMode] = useState<"instant" | "scheduled">(
    globalSchedule.mode
  );
  const [selectedDate, setSelectedDate] = useState(
    globalSchedule.date === "Today" ? "Tomorrow" : globalSchedule.date
  );
  const [customDate, setCustomDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(TIME_SLOTS[3]);
  const [frequency, setFrequency] = useState<"once" | "daily" | "weekly">(
    globalSchedule.frequency
  );
  const [address, setAddress] = useState(globalSchedule.address);
  const [mapQuery, setMapQuery] = useState(globalSchedule.address);
  const [searchInput, setSearchInput] = useState(globalSchedule.address);
  const [isLocating, setIsLocating] = useState(false);
  const [instructions, setInstructions] = useState(
    globalSchedule.instructions || ""
  );
  const [selectedVariant, setSelectedVariant] = useState<string>("");

  useEffect(() => {
    if (schedulingProduct) {
      setMode("scheduled");
      setSelectedVariant(schedulingProduct.variants?.[0] || "");
    }
  }, [schedulingProduct]);

  const isScheduleModalVisible =
    Boolean(schedulingProduct) || isGlobalScheduleModalOpen;

  const closeScheduleModal = () => {
    setSchedulingProduct(null);
    setIsGlobalScheduleModalOpen(false);
  };

  // Pin searched address onto the embedded Google Map
  const handlePinSearchOnMap = () => {
    if (!searchInput.trim()) return;
    setMapQuery(searchInput.trim());
    setAddress(searchInput.trim());
  };

  // Detect live GPS coordinates via browser geolocation and reverse-geocode
  const handleDetectCurrentLocation = () => {
    if (!("geolocation" in navigator)) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const coordString = `${latitude.toFixed(5)},${longitude.toFixed(5)}`;
        setMapQuery(coordString);
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          if (data?.display_name) {
            const formatted = data.display_name
              .split(",")
              .slice(0, 4)
              .join(",")
              .trim();
            setAddress(formatted);
            setSearchInput(formatted);
          } else {
            setAddress(`GPS Pin (${coordString})`);
            setSearchInput(`GPS Pin (${coordString})`);
          }
        } catch {
          setAddress(`GPS Pin (${coordString})`);
          setSearchInput(`GPS Pin (${coordString})`);
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleConfirmSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const finalDate =
      mode === "instant" ? "Today" : customDate || selectedDate;
    const finalSlot =
      mode === "instant" ? "Instant (8–15 mins)" : selectedSlot;

    const newSchedule: DeliverySchedule = {
      mode,
      date: finalDate,
      timeSlot: finalSlot,
      frequency,
      address: address.trim() || searchInput.trim() || "221B Tech Park Avenue",
      instructions,
    };

    if (schedulingProduct) {
      addToCart(
        schedulingProduct,
        selectedVariant || schedulingProduct.variants?.[0],
        newSchedule
      );
      updateGlobalSchedule(newSchedule);
    } else {
      updateGlobalSchedule(newSchedule);
    }
    closeScheduleModal();
  };

  const wishlistedItems = getWishlistedProducts(wishlist);
  const googleMapsExternalUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    mapQuery || address
  )}`;
  const googleMapsEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    mapQuery || address
  )}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <>
      {/* ==================== 1. CART & CHECKOUT DRAWER ==================== */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          />
          <aside className="border-border bg-card text-card-foreground relative z-10 flex h-full w-full max-w-md flex-col border-l shadow-2xl">
            <div className="border-border flex items-center justify-between border-b px-5 py-4">
              <div className="flex items-center gap-2.5">
                <div className="bg-primary/15 text-primary flex size-9 items-center justify-center rounded-xl">
                  <ShoppingBag className="size-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold tracking-tight">
                    Your SwiftCart Bag
                  </h2>
                  <p className="text-muted-foreground text-xs">
                    {cart.length === 0
                      ? "Ready for your picks"
                      : `${cart.reduce((s, i) => s + i.quantity, 0)} items selected`}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg p-1.5 transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Active Delivery Address & Schedule Banner inside Cart */}
            <div className="border-border bg-secondary/50 flex items-center justify-between border-b px-5 py-3">
              <div className="flex items-center gap-2.5 text-xs">
                <MapPin className="text-primary size-4 shrink-0" />
                <div>
                  <div className="max-w-[210px] truncate font-semibold">
                    {globalSchedule.address}
                  </div>
                  <div className="text-muted-foreground text-[0.7rem]">
                    {globalSchedule.mode === "instant"
                      ? "⚡ Instant Express (8–15 mins)"
                      : `📅 ${globalSchedule.date} • ${globalSchedule.timeSlot}`}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsGlobalScheduleModalOpen(true)}
                className="text-primary hover:bg-primary/10 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors"
              >
                Map & Slot
              </button>
            </div>

            {/* Cart Items & Orders Scroll Area */}
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="bg-muted mb-3 flex size-14 items-center justify-center rounded-2xl">
                    <ShoppingBag className="text-muted-foreground size-7" />
                  </div>
                  <h3 className="text-sm font-semibold">Your cart is empty</h3>
                  <p className="text-muted-foreground mt-1 max-w-xs text-xs">
                    Visit Home or browse any category page to add groceries,
                    clothes, fruits, or tech!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={`${item.product.id}-${item.variant || "default"}`}
                      className="border-border bg-background/60 flex gap-3 rounded-xl border p-3 transition-all"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="size-16 rounded-lg object-cover shrink-0"
                      />
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="text-xs font-semibold leading-snug">
                              {item.product.name}
                            </h4>
                            <div className="text-muted-foreground mt-0.5 flex flex-wrap items-center gap-1.5 text-[0.68rem]">
                              <span>{item.product.unit}</span>
                              {item.variant && (
                                <span className="bg-secondary text-secondary-foreground rounded px-1.5 py-0.2 font-medium">
                                  {item.variant}
                                </span>
                              )}
                            </div>
                            {item.schedule && (
                              <div className="text-primary mt-1 flex items-center gap-1 text-[0.66rem] font-medium">
                                <CalendarClock className="size-3" />
                                {item.schedule.date} • {item.schedule.timeSlot}
                              </div>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              removeFromCart(item.product.id, item.variant)
                            }
                            className="text-muted-foreground hover:text-destructive p-1 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs font-bold">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </span>
                          <div className="border-border bg-secondary/70 flex items-center gap-2 rounded-lg border px-2 py-0.5">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  -1,
                                  item.variant
                                )
                              }
                              className="text-muted-foreground hover:text-foreground p-0.5"
                            >
                              <Minus className="size-3" />
                            </button>
                            <span className="min-w-[1rem] text-center text-xs font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.product.id, 1, item.variant)
                              }
                              className="text-muted-foreground hover:text-foreground p-0.5"
                            >
                              <Plus className="size-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Active / Scheduled Orders Section */}
              {orders.length > 0 && (
                <div className="border-border border-t pt-4">
                  <div className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold">
                    <PackageCheck className="text-primary size-4" />
                    Recent & Scheduled Deliveries ({orders.length})
                  </div>
                  <div className="space-y-2.5">
                    {orders.slice(0, 3).map((order) => (
                      <div
                        key={order.id}
                        className="border-border/80 bg-secondary/40 rounded-xl border p-3 text-xs"
                      >
                        <div className="flex items-center justify-between font-semibold">
                          <span>Order #{order.id}</span>
                          <span className="bg-primary/15 text-primary rounded-full px-2 py-0.5 text-[0.65rem]">
                            {order.status}
                          </span>
                        </div>
                        <div className="text-muted-foreground mt-1 flex items-center gap-1 text-[0.7rem]">
                          <MapPin className="size-3 shrink-0" />
                          <span className="truncate">
                            {order.schedule.address}
                          </span>
                        </div>
                        <div className="text-muted-foreground mt-0.5 flex items-center gap-1 text-[0.7rem]">
                          <CalendarClock className="size-3 shrink-0" />
                          {order.schedule.date} • {order.schedule.timeSlot}
                        </div>
                        <div className="mt-1.5 flex items-center justify-between text-[0.7rem]">
                          <span className="text-muted-foreground">
                            {order.items.reduce((s, i) => s + i.quantity, 0)}{" "}
                            items
                          </span>
                          <span className="font-bold">
                            ${order.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Cart Footer Checkout */}
            {cart.length > 0 && (
              <div className="border-border bg-background/80 space-y-3 border-t p-5 backdrop-blur-md">
                <div className="space-y-1 text-xs">
                  <div className="text-muted-foreground flex justify-between">
                    <span>Items Subtotal</span>
                    <span>${cartSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="text-muted-foreground flex justify-between">
                    <span>
                      {globalSchedule.mode === "instant"
                        ? "Express Delivery"
                        : "Scheduled Slot Fee"}
                    </span>
                    <span className="font-medium text-emerald-500">FREE</span>
                  </div>
                  <div className="border-border flex justify-between border-t pt-2 text-sm font-bold">
                    <span>Total to Pay</span>
                    <span>${cartSubtotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsGlobalScheduleModalOpen(true)}
                    className="border-border bg-secondary hover:bg-secondary/80 flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-xs font-semibold transition-colors"
                  >
                    <MapPin className="text-primary size-4" />
                    Address & Slot
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      placeOrder();
                    }}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold shadow-lg shadow-orange-500/20 transition-all"
                  >
                    <span>
                      {globalSchedule.mode === "scheduled"
                        ? "Confirm Schedule"
                        : "Checkout Now"}
                    </span>
                    <ArrowRight className="size-4" />
                  </button>
                </div>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* ==================== 2. WISHLIST DRAWER ==================== */}
      {isWishlistOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsWishlistOpen(false)}
          />
          <aside className="border-border bg-card text-card-foreground relative z-10 flex h-full w-full max-w-md flex-col border-l shadow-2xl">
            <div className="border-border flex items-center justify-between border-b px-5 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-rose-500/15 text-rose-500">
                  <Heart className="size-5 fill-current" />
                </div>
                <div>
                  <h2 className="text-base font-bold tracking-tight">
                    Saved Wishlist
                  </h2>
                  <p className="text-muted-foreground text-xs">
                    {wishlistedItems.length} curated favorites
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsWishlistOpen(false)}
                className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg p-1.5 transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-5">
              {wishlistedItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="bg-muted mb-3 flex size-14 items-center justify-center rounded-2xl">
                    <Heart className="text-muted-foreground size-7" />
                  </div>
                  <h3 className="text-sm font-semibold">
                    No items in your wishlist yet
                  </h3>
                  <p className="text-muted-foreground mt-1 max-w-xs text-xs">
                    Tap the heart icon on any product across our 8 categories to
                    save it for later or schedule a recurring delivery.
                  </p>
                </div>
              ) : (
                wishlistedItems.map((product) => (
                  <div
                    key={product.id}
                    className="border-border bg-background/60 flex gap-3 rounded-xl border p-3"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="size-16 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link
                            href={`/category/${product.categorySlug}`}
                            onClick={() => setIsWishlistOpen(false)}
                            className="hover:text-primary text-xs font-semibold leading-snug transition-colors"
                          >
                            {product.name}
                          </Link>
                          <p className="text-muted-foreground text-[0.68rem]">
                            {product.subcategory} • {product.unit}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleWishlist(product)}
                          className="text-rose-500 hover:opacity-75 p-1"
                          title="Remove from Wishlist"
                        >
                          <Heart className="size-4 fill-current" />
                        </button>
                      </div>

                      <div className="mt-2 flex items-center justify-between gap-2">
                        <span className="text-xs font-bold">
                          ${product.price.toFixed(2)}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setIsWishlistOpen(false);
                              setSchedulingProduct(product);
                            }}
                            className="border-border bg-secondary hover:bg-secondary/80 flex items-center gap-1 rounded-lg border px-2 py-1 text-[0.68rem] font-medium"
                          >
                            <CalendarClock className="size-3" />
                            Schedule
                          </button>
                          <button
                            type="button"
                            onClick={() => addToCart(product)}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-2.5 py-1 text-[0.68rem] font-semibold"
                          >
                            + Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </aside>
        </div>
      )}

      {/* ==================== 3. GOOGLE MAPS ADDRESS & DELIVERY SCHEDULER MODAL ==================== */}
      {isScheduleModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={closeScheduleModal}
          />
          <div className="border-border bg-card text-card-foreground relative z-10 max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border shadow-2xl">
            <div className="border-border bg-secondary/40 sticky top-0 z-20 flex items-center justify-between border-b px-6 py-4 backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <div className="bg-primary/15 text-primary flex size-9 items-center justify-center rounded-xl">
                  <MapPin className="size-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold tracking-tight">
                    {schedulingProduct
                      ? "Google Maps Address & Product Delivery Slot"
                      : "Google Maps Address & Delivery Scheduler"}
                  </h3>
                  <p className="text-muted-foreground text-xs">
                    Pin your exact location on Google Maps and pick your delivery slot
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeScheduleModal}
                className="text-muted-foreground hover:text-foreground rounded-lg p-1.5"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmSchedule} className="space-y-4 p-6">
              {/* If scheduling a specific product, show a preview card + variant selector */}
              {schedulingProduct && (
                <div className="border-border bg-secondary/30 flex items-center gap-3 rounded-xl border p-3">
                  <img
                    src={schedulingProduct.image}
                    alt={schedulingProduct.name}
                    className="size-14 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="text-xs font-bold">
                      {schedulingProduct.name}
                    </div>
                    <div className="text-muted-foreground text-[0.7rem]">
                      ${schedulingProduct.price.toFixed(2)} •{" "}
                      {schedulingProduct.unit}
                    </div>
                    {schedulingProduct.variants && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {schedulingProduct.variants.map((v) => (
                          <button
                            key={v}
                            type="button"
                            onClick={() => setSelectedVariant(v)}
                            className={cn(
                              "rounded-md border px-2 py-0.5 text-[0.65rem] font-medium transition-colors",
                              selectedVariant === v
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-background text-muted-foreground"
                            )}
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ==================== GOOGLE MAPS INTERACTIVE LOCATION PICKER ==================== */}
              <div className="border-border bg-secondary/20 space-y-3 rounded-2xl border p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="flex items-center gap-1.5 text-xs font-bold">
                    <MapPin className="text-primary size-4" />
                    Search & Pin Delivery Address on Google Maps
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleDetectCurrentLocation}
                      disabled={isLocating}
                      className="border-border bg-background hover:bg-secondary inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[0.7rem] font-semibold transition-colors"
                    >
                      {isLocating ? (
                        <Loader2 className="text-primary size-3.5 animate-spin" />
                      ) : (
                        <LocateFixed className="text-primary size-3.5" />
                      )}
                      Use Current GPS
                    </button>
                    <a
                      href={googleMapsExternalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-primary/15 text-primary hover:bg-primary/25 inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[0.7rem] font-semibold transition-colors"
                    >
                      Open in Google Maps
                      <ExternalLink className="size-3" />
                    </a>
                  </div>
                </div>

                {/* Search Input to Move the Google Map */}
                <div className="flex gap-2">
                  <div className="border-border bg-background flex flex-1 items-center rounded-xl border px-3 py-2">
                    <Search className="text-muted-foreground mr-2 size-4 shrink-0" />
                    <input
                      type="text"
                      value={searchInput}
                      onChange={(e) => {
                        setSearchInput(e.target.value);
                        setAddress(e.target.value);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handlePinSearchOnMap();
                        }
                      }}
                      placeholder="Enter street address, society, landmark, or city..."
                      className="w-full bg-transparent text-xs outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handlePinSearchOnMap}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0 rounded-xl px-4 py-2 text-xs font-semibold shadow-sm"
                  >
                    Pin on Map
                  </button>
                </div>

                {/* Quick Popular Location Chips */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-muted-foreground text-[0.65rem]">
                    Quick Pin:
                  </span>
                  {QUICK_LOCATIONS.map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => {
                        setSearchInput(loc);
                        setAddress(loc);
                        setMapQuery(loc);
                      }}
                      className="border-border/70 bg-background/80 hover:border-primary/50 hover:text-primary rounded-full border px-2.5 py-0.5 text-[0.65rem] transition-colors"
                    >
                      {loc}
                    </button>
                  ))}
                </div>

                {/* Live Interactive Google Maps Iframe */}
                <div className="border-border relative h-48 w-full overflow-hidden rounded-xl border shadow-inner">
                  <iframe
                    title="Google Maps Delivery Location"
                    src={googleMapsEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                {/* Exact Door / Apartment & Drop-off Instructions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <div>
                    <label className="text-muted-foreground mb-1 block text-[0.7rem] font-medium">
                      Confirmed Street / Flat / Door Address
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Flat / House No., Building, Street"
                      className="border-border bg-background w-full rounded-lg border px-3 py-1.5 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-muted-foreground mb-1 block text-[0.7rem] font-medium">
                      Drop-off Instructions
                    </label>
                    <input
                      type="text"
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      placeholder="e.g. Ring bell, leave at door"
                      className="border-border bg-background w-full rounded-lg border px-3 py-1.5 text-xs outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Mode Switch: Instant vs Scheduled */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setMode("instant")}
                  className={cn(
                    "flex flex-col items-start rounded-xl border p-3 text-left transition-all",
                    mode === "instant"
                      ? "border-emerald-500 bg-emerald-500/10"
                      : "border-border bg-background/50 hover:bg-secondary/50"
                  )}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-500">
                    <Zap className="size-4 fill-current" />
                    Instant Express
                  </div>
                  <p className="text-muted-foreground mt-1 text-[0.7rem]">
                    Arrives in 8–15 mins right from our nearest hub.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setMode("scheduled")}
                  className={cn(
                    "flex flex-col items-start rounded-xl border p-3 text-left transition-all",
                    mode === "scheduled"
                      ? "border-primary bg-primary/10"
                      : "border-border bg-background/50 hover:bg-secondary/50"
                  )}
                >
                  <div className="text-primary flex items-center gap-1.5 text-xs font-bold">
                    <CalendarClock className="size-4" />
                    Scheduled Slot
                  </div>
                  <p className="text-muted-foreground mt-1 text-[0.7rem]">
                    Pick your exact date, 2-hour window & recurring option.
                  </p>
                </button>
              </div>

              {mode === "scheduled" && (
                <>
                  {/* Date Picker */}
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold">
                      1. Select Delivery Day
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {DATE_OPTIONS.map((d) => (
                        <button
                          key={d.label}
                          type="button"
                          onClick={() => {
                            setSelectedDate(d.label);
                            setCustomDate("");
                          }}
                          className={cn(
                            "rounded-xl border p-2.5 text-left transition-all",
                            selectedDate === d.label && !customDate
                              ? "border-primary bg-primary/15"
                              : "border-border bg-background/50 hover:bg-secondary/50"
                          )}
                        >
                          <div className="text-xs font-bold">{d.label}</div>
                          <div className="text-muted-foreground text-[0.65rem]">
                            {d.sub}
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-muted-foreground text-[0.7rem]">
                        Or pick custom date:
                      </span>
                      <input
                        type="date"
                        value={customDate}
                        onChange={(e) => setCustomDate(e.target.value)}
                        className="border-border bg-background rounded-lg border px-2.5 py-1 text-xs outline-none focus:ring-1 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  {/* Time Slot Picker */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold">
                      <Clock className="text-primary size-3.5" />
                      2. Choose 2-Hour Time Window
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {TIME_SLOTS.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={cn(
                            "rounded-lg border px-2.5 py-2 text-[0.7rem] font-medium transition-all",
                            selectedSlot === slot
                              ? "border-primary bg-primary text-primary-foreground shadow-sm"
                              : "border-border bg-background/50 hover:bg-secondary"
                          )}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Recurring Frequency */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold">
                      <Repeat className="text-primary size-3.5" />
                      3. Delivery Frequency
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(
                        [
                          { id: "once", label: "One-Time" },
                          { id: "daily", label: "Daily Drop" },
                          { id: "weekly", label: "Weekly" },
                        ] as const
                      ).map((freq) => (
                        <button
                          key={freq.id}
                          type="button"
                          onClick={() => setFrequency(freq.id)}
                          className={cn(
                            "rounded-lg border py-1.5 text-xs font-medium transition-all",
                            frequency === freq.id
                              ? "border-primary bg-primary/15 text-primary font-semibold"
                              : "border-border bg-background/50 text-muted-foreground"
                          )}
                        >
                          {freq.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeScheduleModal}
                  className="border-border hover:bg-secondary rounded-xl border px-4 py-2 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5 rounded-xl px-5 py-2 text-xs font-semibold shadow-lg shadow-orange-500/20"
                >
                  <CheckCircle2 className="size-4" />
                  {schedulingProduct
                    ? "Save Address & Schedule Product"
                    : "Save Google Maps Address & Slot"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== 4. FLOATING TOAST NOTIFICATIONS ==================== */}
      <div className="pointer-events-none fixed right-4 bottom-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            onClick={() => dismissToast(t.id)}
            className="pointer-events-auto border-border bg-card/95 text-card-foreground flex min-w-[260px] max-w-sm cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 shadow-xl backdrop-blur-md transition-all"
          >
            {t.type === "wishlist" ? (
              <Heart className="size-4 fill-rose-500 text-rose-500 shrink-0" />
            ) : t.type === "schedule" ? (
              <CalendarClock className="text-primary size-4 shrink-0" />
            ) : (
              <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
            )}
            <div className="flex-1 text-xs">
              <div className="font-semibold">{t.title}</div>
              {t.subtitle && (
                <div className="text-muted-foreground text-[0.7rem] line-clamp-1">
                  {t.subtitle}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
