"use client";

import { WorksWheel, type WorksWheelItem } from "@/components/ui/works-wheel";
import { BeamsBackground } from "@/components/ui/beams-background";

const WORKS: WorksWheelItem[] = [
  {
    title: "Groceries",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80",
    href: "/category/groceries",
  },
  {
    title: "Fruits",
    image:
      "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=1000&q=80",
    href: "/category/fruits",
  },
  {
    title: "Vegetables",
    image:
      "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=1000&q=80",
    href: "/category/vegetables",
  },
  {
    title: "Electronics",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80",
    href: "/category/electronics",
  },
  {
    title: "Clothes",
    image:
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1000&q=80",
    href: "/category/clothes",
  },
  {
    title: "Accessories",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80",
    href: "/category/accessories",
  },
  {
    title: "Dairy & Snacks",
    image:
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1000&q=80",
    href: "/category/dairy-snacks",
  },
  {
    title: "Personal Care",
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=80",
    href: "/category/personal-care",
  },
];

export default function WorksWheelDemo() {
  return (
    <div className="bg-background text-foreground w-full h-screen">
      <WorksWheel items={WORKS} label="SwiftCart '26" action="Shop" />
    </div>
  );
}

export function BeamsBackgroundDemo() {
  return <BeamsBackground />;
}
