"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ProductItem, PRODUCTS } from "@/lib/catalog";

export interface DeliverySchedule {
  mode: "instant" | "scheduled";
  date: string; // e.g. "Today, Oct 10" or "Tomorrow, Oct 11" or custom YYYY-MM-DD
  timeSlot: string; // e.g. "4:00 PM - 5:00 PM"
  frequency: "once" | "daily" | "weekly";
  instructions?: string;
  address: string;
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
  variant?: string;
  schedule?: DeliverySchedule;
}

export interface ScheduledOrder {
  id: string;
  createdAt: string;
  items: CartItem[];
  total: number;
  schedule: DeliverySchedule;
  status: "Scheduled" | "Out for Delivery" | "Confirmed";
}

interface ToastMessage {
  id: string;
  title: string;
  subtitle?: string;
  type: "cart" | "wishlist" | "schedule" | "order";
}

interface StoreContextValue {
  theme: "dark" | "light";
  toggleTheme: () => void;
  cart: CartItem[];
  wishlist: string[];
  globalSchedule: DeliverySchedule;
  orders: ScheduledOrder[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  schedulingProduct: ProductItem | null;
  setSchedulingProduct: (product: ProductItem | null) => void;
  isGlobalScheduleModalOpen: boolean;
  setIsGlobalScheduleModalOpen: (open: boolean) => void;
  addToCart: (
    product: ProductItem,
    variant?: string,
    schedule?: DeliverySchedule
  ) => void;
  removeFromCart: (productId: string, variant?: string) => void;
  updateQuantity: (productId: string, delta: number, variant?: string) => void;
  getItemQuantity: (productId: string, variant?: string) => number;
  toggleWishlist: (product: ProductItem) => void;
  isWishlisted: (productId: string) => boolean;
  updateGlobalSchedule: (schedule: DeliverySchedule) => void;
  placeOrder: () => ScheduledOrder | null;
  cartCount: number;
  cartSubtotal: number;
  toasts: ToastMessage[];
  dismissToast: (id: string) => void;
}

const DEFAULT_SCHEDULE: DeliverySchedule = {
  mode: "instant",
  date: "Today",
  timeSlot: "Instant (8–15 mins)",
  frequency: "once",
  address: "221B Tech Park Avenue, Apt 4B",
  instructions: "Leave at doorstep & ring bell",
};

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  // Default mode is DARK as requested by user
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>(["clothes-1", "fruits-1"]);
  const [globalSchedule, setGlobalSchedule] =
    useState<DeliverySchedule>(DEFAULT_SCHEDULE);
  const [orders, setOrders] = useState<ScheduledOrder[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [schedulingProduct, setSchedulingProduct] =
    useState<ProductItem | null>(null);
  const [isGlobalScheduleModalOpen, setIsGlobalScheduleModalOpen] =
    useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const pushToast = (
    title: string,
    subtitle?: string,
    type: ToastMessage["type"] = "cart"
  ) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev.slice(-2), { id, title, subtitle, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Hydrate from localStorage & sync dark class on <html>
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("instamart-theme") as
        | "dark"
        | "light"
        | null;
      const initialTheme = savedTheme || "dark";
      setTheme(initialTheme);
      document.documentElement.classList.toggle("dark", initialTheme === "dark");

      const savedCart = localStorage.getItem("instamart-cart");
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem("instamart-wishlist");
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      const savedOrders = localStorage.getItem("instamart-orders");
      if (savedOrders) setOrders(JSON.parse(savedOrders));
    } catch {
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("instamart-cart", JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem("instamart-wishlist", JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem("instamart-orders", JSON.stringify(orders));
    } catch {}
  }, [orders]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", next === "dark");
      try {
        localStorage.setItem("instamart-theme", next);
      } catch {}
      return next;
    });
  };

  const addToCart = (
    product: ProductItem,
    variant?: string,
    schedule?: DeliverySchedule
  ) => {
    const chosenVariant = variant || product.variants?.[0];
    setCart((prev) => {
      const idx = prev.findIndex(
        (item) =>
          item.product.id === product.id && item.variant === chosenVariant
      );
      if (idx > -1) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          quantity: updated[idx].quantity + 1,
          schedule: schedule || updated[idx].schedule,
        };
        return updated;
      }
      return [
        ...prev,
        {
          product,
          quantity: 1,
          variant: chosenVariant,
          schedule,
        },
      ];
    });

    if (schedule) {
      pushToast(
        `Scheduled: ${product.name}`,
        `${schedule.date} • ${schedule.timeSlot}`,
        "schedule"
      );
    } else {
      pushToast(
        `Added to Cart`,
        `${product.name}${chosenVariant ? ` (${chosenVariant})` : ""}`,
        "cart"
      );
    }
  };

  const removeFromCart = (productId: string, variant?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            (variant === undefined || item.variant === variant)
          )
      )
    );
  };

  const updateQuantity = (
    productId: string,
    delta: number,
    variant?: string
  ) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (
            item.product.id === productId &&
            (variant === undefined || item.variant === variant)
          ) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const getItemQuantity = (productId: string, variant?: string) => {
    return cart
      .filter(
        (item) =>
          item.product.id === productId &&
          (variant === undefined || item.variant === variant)
      )
      .reduce((acc, item) => acc + item.quantity, 0);
  };

  const toggleWishlist = (product: ProductItem) => {
    setWishlist((prev) => {
      const exists = prev.includes(product.id);
      if (exists) {
        pushToast("Removed from Wishlist", product.name, "wishlist");
        return prev.filter((id) => id !== product.id);
      } else {
        pushToast("Saved to Wishlist ❤️", product.name, "wishlist");
        return [...prev, product.id];
      }
    });
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  const updateGlobalSchedule = (schedule: DeliverySchedule) => {
    setGlobalSchedule(schedule);
    pushToast(
      schedule.mode === "instant"
        ? "Switched to Instant Delivery ⚡"
        : "Delivery Slot Scheduled 📅",
      `${schedule.date} • ${schedule.timeSlot}`,
      "schedule"
    );
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const placeOrder = (): ScheduledOrder | null => {
    if (cart.length === 0) return null;
    const newOrder: ScheduledOrder = {
      id: `IM-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      items: [...cart],
      total: cartSubtotal,
      schedule: globalSchedule,
      status:
        globalSchedule.mode === "scheduled"
          ? "Scheduled"
          : "Out for Delivery",
    };
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    pushToast(
      `Order #${newOrder.id} Confirmed! 🎉`,
      `${newOrder.schedule.date} • ${newOrder.schedule.timeSlot}`,
      "order"
    );
    return newOrder;
  };

  return (
    <StoreContext.Provider
      value={{
        theme,
        toggleTheme,
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
        getItemQuantity,
        toggleWishlist,
        isWishlisted,
        updateGlobalSchedule,
        placeOrder,
        cartCount,
        cartSubtotal,
        toasts,
        dismissToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return ctx;
}

export function getWishlistedProducts(ids: string[]): ProductItem[] {
  return PRODUCTS.filter((p) => ids.includes(p.id));
}
