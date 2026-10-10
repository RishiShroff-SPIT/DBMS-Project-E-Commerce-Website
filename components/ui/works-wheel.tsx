"use client";

// A portfolio / category index built as a wheel you turn.
//
// At rest the work sits in a ring around a title, each card tangent to the
// circle. The first notch of scroll blows the ring open into a vertical drum:
// the card at the front lies flat and full size, the ones above and below
// rotate away into hard perspective and run off the top and bottom of the
// frame. Keep turning and the drum carries the next piece round to the front.
//
// The whole thing is one number - `turn` - read by a single rAF pass that writes
// transforms straight to the DOM. 0 is the ring, 1 is the drum with item 0 at
// the front, and every whole number after that is one more item turned past.
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Maximize2,
  Minimize2,
  RotateCcw,
  Sun,
  Moon,
  ArrowUpRight,
  Sparkles,
  ShoppingBasket,
  Apple,
  Carrot,
  Headphones,
  Shirt,
  Watch,
  Cookie,
  HeartHandshake,
  MapPin,
} from "lucide-react";

import { cn } from "@/lib/utils";

export type CategoryIconName =
  | "groceries"
  | "fruits"
  | "vegetables"
  | "electronics"
  | "clothes"
  | "accessories"
  | "dairy-snacks"
  | "personal-care";

export function renderCategoryIcon(
  iconName?: CategoryIconName | string,
  className = "size-4",
) {
  switch (iconName) {
    case "groceries":
      return <ShoppingBasket className={className} />;
    case "fruits":
      return <Apple className={className} />;
    case "vegetables":
      return <Carrot className={className} />;
    case "electronics":
      return <Headphones className={className} />;
    case "clothes":
      return <Shirt className={className} />;
    case "accessories":
      return <Watch className={className} />;
    case "dairy-snacks":
      return <Cookie className={className} />;
    case "personal-care":
      return <HeartHandshake className={className} />;
    default:
      return <Sparkles className={className} />;
  }
}

export interface WorksWheelItem {
  /** Project or Category name. Shown beside the front card and in the index. */
  title: string;
  /** Cover art. Any src an <img> takes. */
  image: string;
  /** Where the card links to. Omit for a wheel that only browses. */
  href?: string;
  /** Optional subtitle or badge shown on the card and beside the active drum title. */
  subtitle?: string;
  /** Optional badge text (e.g. "⚡ 8 mins" or "24+ Items"). */
  badge?: string;
  /** Optional category icon identifier so a small category icon appears as you scroll */
  iconName?: CategoryIconName | string;
}

export interface WorksWheelProps
  extends Omit<React.ComponentPropsWithoutRef<"section">, "children"> {
  items: WorksWheelItem[];
  /** Sits in the middle of the ring. @default undefined */
  label?: string;
  /** Label on the card's hover affordance. Omit to drop it. @default undefined */
  action?: string;
  /** Optional theme toggle callback for the floating control bar */
  onToggleTheme?: () => void;
  /** Current theme state for the floating control bar icon */
  isDark?: boolean;
  /** Optional callback to open Google Maps Address Modal */
  onOpenMapModal?: () => void;
  /** Current delivery address label */
  currentAddress?: string;
}

/* Geometry. The card is measured against the stage; everything else is measured
   against the card, so a narrow stage - where the card is capped by width, not
   height - scales the whole wheel down with it instead of leaving a small card
   swinging on a huge drum. The three that matter are tuned together: STEP
   against DRUM sets how hard the neighbours rotate away, and DRUM against LENS
   decides whether they land inside the frame or run off it. */
const CARD_H = 0.38; // front card height, of the stage
const CARD_MAX_W = 0.34; // ... but never wider than this much of the stage
const CARD_RATIO = 1.45; // card width / height
const STEP = 40; // degrees between cards on the drum
const DRUM = 2.22; // drum radius, in card heights - and everything below likewise
const LENS = 2.7; // perspective distance
const RING_R = 1.14; // ring radius
/* The drum alone hangs the work on a plumb line. It isn't one: the strip curves
   away round an arc whose centre sits off to the LEFT, so the piece at the front
   is at the arc's near point - dead centre - and its neighbours have already
   swung back left as well as up and down. BOW is that arc's radius; nothing else
   makes the difference between a stack of cards and a wheel seen side on. */
const BOW = 1.82;
const TITLE = 0.124; // ring label and front-card title
const INDEX = 0.04; // the index down the right-hand side
/** Items either side of the front still worth drawing. Past this a card is
    edge-on, and further round it would stack up on the vanishing point. */
const CULL = 1.6;

/** How much of a wheel-notch or a dragged pixel counts as one item. */
const WHEEL_UNITS = 900;
const DRAG_UNITS = 420;
/** Quiet time after the last wheel event before the wheel settles on an item. */
const SETTLE = 140;
/** Fraction of the remaining distance closed each frame. 1 = no smoothing. */
const EASE = 0.12;

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Stage = { w: number; h: number };

const rad = (deg: number) => (deg * Math.PI) / 180;

/** How far left the arc has carried something that has turned `drumDeg` off the
    front. Zero at the front, so the piece being read stays centred. */
const bowAt = (drumDeg: number, bow: number) =>
  -bow * (1 - Math.cos(rad(drumDeg)));

/** Both states in one chain: the ring terms fall away as `m` reaches the drum,
    and the drum terms are still zero while the ring is up. The bow is applied
    first, in the wheel's own plane, so it slides the card sideways rather than
    turning with it - and perspective still shrinks it with distance. */
function place(
  ringDeg: number,
  drumDeg: number,
  ringR: number,
  drumR: number,
  bow: number,
  m: number,
) {
  return (
    `translateX(${m * bowAt(drumDeg, bow)}px)` +
    ` rotateZ(${(1 - m) * ringDeg}deg) translateY(${-(1 - m) * ringR}px)` +
    ` rotateX(${m * drumDeg}deg) translateZ(${m * drumR}px)`
  );
}

export function WorksWheel({
  items,
  label = "SwiftCart '26",
  action = "Shop",
  onToggleTheme,
  isDark = true,
  onOpenMapModal,
  currentAddress,
  className,
  ...props
}: WorksWheelProps) {
  const router = useRouter();
  const sectionRef = React.useRef<HTMLElement>(null);
  const stageRef = React.useRef<HTMLDivElement>(null);
  const wheelRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLElement | null)[]>([]);
  const labelRef = React.useRef<HTMLDivElement>(null);
  const titleRef = React.useRef<HTMLDivElement>(null);
  const bgLayerRef = React.useRef<HTMLDivElement>(null);

  // The wheel's position, and where it is heading. Only `active` and `inDrumMode`
  // are state - everything else is written to the DOM, so turning the wheel is not a render.
  const turn = React.useRef(0);
  const target = React.useRef(0);
  const [active, setActive] = React.useState(0);
  const [inDrumMode, setInDrumMode] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [stage, setStage] = React.useState<Stage>({ w: 0, h: 0 });

  const count = items.length;
  const last = Math.max(count - 1, 0);

  // Read after mount, not during render: the server has no matchMedia, and
  // branching on it inline is a hydration mismatch. Reduced motion drops the
  // easing, so the wheel lands where it is put instead of gliding there.
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const read = () => setReduced(query.matches);
    read();
    query.addEventListener("change", read);
    return () => query.removeEventListener("change", read);
  }, []);

  React.useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const read = () => setStage({ w: el.clientWidth, h: el.clientHeight });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  React.useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      sectionRef.current?.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  const metrics = React.useMemo(() => {
    const { w, h } = stage;
    const cardW = Math.min(h * CARD_H * CARD_RATIO, w * CARD_MAX_W);
    const cardH = cardW / CARD_RATIO;
    const drumR = cardH * DRUM;
    const ringR = cardH * RING_R;
    // Shrink the ring's cards until the circle reads as a closed loop rather
    // than beads on a wire, however many pieces the wheel is given.
    const ringScale = count
      ? clamp((((2 * Math.PI * ringR) / count) * 0.82) / (cardW || 1), 0.16, 1)
      : 1;
    return {
      cardW,
      cardH,
      ringR,
      ringScale,
      drumR,
      bow: cardH * BOW,
      depth: cardH * LENS,
      title: cardH * TITLE,
      index: cardH * INDEX,
    };
  }, [stage, count]);

  // One pass per frame: ease toward the target, then write every transform.
  React.useEffect(() => {
    if (!stage.h) return;
    let frame = 0;
    const { ringR, ringScale, drumR, bow } = metrics;

    const draw = () => {
      frame = requestAnimationFrame(draw);
      const gap = target.current - turn.current;
      if (Math.abs(gap) < 0.0005) turn.current = target.current;
      else turn.current += gap * (reduced ? 1 : EASE);

      const t = turn.current;
      const m = clamp(t, 0, 1);
      const pos = Math.max(0, t - 1);

      // The drum is pulled back so its front face lands on the picture plane.
      // That set-back has to arrive with the drum, or the ring would sit at the
      // far side of the perspective and render at half its size.
      if (wheelRef.current) {
        wheelRef.current.style.transform = `translateZ(${-m * drumR}px)`;
      }

      for (let i = 0; i < count; i++) {
        const d = i - pos;
        const drumDeg = d * STEP;
        const card = cardRefs.current[i];
        if (card) {
          card.style.transform = place(
            d * (360 / count),
            drumDeg,
            ringR,
            drumR,
            bow,
            m,
          );
          // Culled by distance, not by angle: at a full turn the far side comes
          // back round to face us, and everything past the neighbours lands on
          // the vanishing point in a heap.
          card.style.opacity = m > 0.5 && Math.abs(d) > CULL ? "0" : "1";
          card.style.pointerEvents =
            m > 0.5 && Math.abs(d) > CULL ? "none" : "auto";
          card.style.zIndex = String(Math.round(100 - Math.abs(d) * 2));
        }
        const face = card?.firstElementChild as HTMLElement | null;
        if (face) face.style.transform = `scale(${lerp(ringScale, 1, m)})`;
      }

      if (labelRef.current) labelRef.current.style.opacity = String(1 - m);
      if (titleRef.current) {
        titleRef.current.style.opacity = String(m);
        titleRef.current.style.pointerEvents = m > 0.5 ? "auto" : "none";
      }
      // Smoothly intensify the blurred category background image as the wheel scrolls
      if (bgLayerRef.current) {
        bgLayerRef.current.style.opacity = String(lerp(0.35, 0.95, m));
      }

      const near = clamp(Math.round(pos), 0, last);
      setActive((prev) => (prev === near ? prev : near));
      const drumNow = m > 0.25;
      setInDrumMode((prev) => (prev === drumNow ? prev : drumNow));
    };

    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [metrics, stage.h, count, last, reduced]);

  const to = React.useCallback(
    (next: number) => {
      target.current = clamp(next, 0, last + 1);
    },
    [last],
  );

  // Native listener, because the wheel has to be cancellable - and it only
  // cancels while it still has somewhere to go, so the page scrolls on at
  // either end instead of trapping the reader.
  React.useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (event: WheelEvent) => {
      const next = target.current + event.deltaY / WHEEL_UNITS;
      if (next > 0 && next < last + 1) event.preventDefault();
      to(next);
      // A wheel gesture arrives as a burst of events with no end of its own, so
      // the rest position is whatever notch it happened to stop on. Left there
      // the drum sits between two cards - nothing at the front, and the pair
      // either side of the gap both turned half away. Settle onto an item.
      window.clearTimeout(settling.current);
      settling.current = window.setTimeout(
        () => to(Math.round(target.current)),
        SETTLE,
      );
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      window.clearTimeout(settling.current);
    };
  }, [to, last]);

  const drag = React.useRef<number | null>(null);
  const dragStart = React.useRef<number | null>(null);
  const didDrag = React.useRef(false);
  const settling = React.useRef(0);

  return (
    <section
      ref={sectionRef}
      aria-label={label}
      className={cn(
        "bg-background text-foreground relative h-full min-h-[24rem] w-full overflow-hidden select-none",
        className,
      )}
      {...props}
    >
      {/* Dynamic Subtle-Blurred Category Image Background that changes as you scroll the wheel */}
      <div
        ref={bgLayerRef}
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden transition-opacity duration-500"
        style={{ opacity: 0.35 }}
      >
        {items.map((item, i) => (
          <img
            key={item.title}
            src={item.image}
            alt=""
            aria-hidden="true"
            className={cn(
              "absolute inset-0 size-full object-cover blur-[6px] transition-all duration-700 ease-out",
              i === active ? "opacity-90 scale-105" : "opacity-0 scale-110",
            )}
          />
        ))}
        {/* Soft vignette overlay so foreground wheel and text stay legible */}
        <div className="bg-background/35 dark:bg-background/45 absolute inset-0" />
      </div>

      {/* Top-left floating control bar + Google Maps Address Button */}
      <div className="absolute top-6 left-6 z-30 flex flex-wrap items-center gap-2">
        <div className="border-border/60 bg-background/70 flex items-center gap-1 rounded-xl border p-1.5 shadow-lg backdrop-blur-md">
          <button
            type="button"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Wheel"}
            className="text-muted-foreground hover:text-foreground hover:bg-accent flex size-9 items-center justify-center rounded-lg transition-colors"
          >
            {isFullscreen ? (
              <Minimize2 className="size-4" />
            ) : (
              <Maximize2 className="size-4" />
            )}
          </button>
          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="text-muted-foreground hover:text-foreground hover:bg-accent flex size-9 items-center justify-center rounded-lg transition-colors"
            >
              {isDark ? (
                <Sun className="size-4" />
              ) : (
                <Moon className="size-4" />
              )}
            </button>
          )}
          <button
            type="button"
            onClick={() => to(0)}
            title="Reset Wheel to Ring"
            className="text-muted-foreground hover:text-foreground hover:bg-accent flex size-9 items-center justify-center rounded-lg transition-colors"
          >
            <RotateCcw className="size-4" />
          </button>
        </div>

        {/* Google Maps Address Quick Trigger on Home */}
        {onOpenMapModal && (
          <button
            type="button"
            onClick={onOpenMapModal}
            className="border-border/60 bg-background/70 hover:bg-background/90 text-foreground flex h-12 items-center gap-2 rounded-xl border px-3.5 text-xs font-medium shadow-lg backdrop-blur-md transition-all"
          >
            <span className="bg-primary/15 text-primary flex size-7 items-center justify-center rounded-lg">
              <MapPin className="size-4" />
            </span>
            <div className="text-left">
              <div className="text-muted-foreground text-[0.62rem] uppercase tracking-wider">
                Deliver to (Google Maps)
              </div>
              <div className="max-w-[160px] truncate font-semibold">
                {currentAddress || "Set Delivery Address"}
              </div>
            </div>
          </button>
        )}
      </div>

      {/* Small Floating Active Category Icon Pill at Top-Center when scrolling the wheel */}
      <div
        className={cn(
          "pointer-events-none absolute top-6 left-1/2 z-20 -translate-x-1/2 transition-all duration-500",
          inDrumMode
            ? "translate-y-0 opacity-100 scale-100"
            : "-translate-y-3 opacity-0 scale-95",
        )}
      >
        <div className="border-border/60 bg-background/75 flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold shadow-lg backdrop-blur-md">
          <span className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-full shadow-sm">
            {renderCategoryIcon(items[active]?.iconName, "size-3.5")}
          </span>
          <span>{items[active]?.title}</span>
        </div>
      </div>

      <div
        ref={stageRef}
        tabIndex={0}
        role="listbox"
        aria-label={label}
        aria-activedescendant={`works-wheel-${active}`}
        className="focus-visible:outline-foreground absolute inset-0 z-10 cursor-grab touch-pan-x outline-none focus-visible:outline-2 focus-visible:-outline-offset-4 active:cursor-grabbing"
        style={{ perspective: `${metrics.depth}px` }}
        onPointerDown={(event) => {
          drag.current = event.clientY;
          dragStart.current = event.clientY;
          didDrag.current = false;
        }}
        onPointerMove={(event) => {
          if (drag.current === null) return;
          if (
            !didDrag.current &&
            dragStart.current !== null &&
            Math.abs(event.clientY - dragStart.current) > 6
          ) {
            didDrag.current = true;
            event.currentTarget.setPointerCapture(event.pointerId);
          }
          if (didDrag.current) {
            to(target.current + (drag.current - event.clientY) / DRAG_UNITS);
            drag.current = event.clientY;
          }
        }}
        onPointerUp={() => {
          // Land on an item rather than between two.
          drag.current = null;
          dragStart.current = null;
          if (didDrag.current && target.current > 0.3) {
            to(Math.round(target.current));
          }
          setTimeout(() => {
            didDrag.current = false;
          }, 50);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") to(Math.round(target.current) + 1);
          else if (event.key === "ArrowUp") to(Math.round(target.current) - 1);
          else return;
          event.preventDefault();
        }}
      >
        <div
          ref={wheelRef}
          className="absolute top-1/2 left-1/2 [transform-style:preserve-3d]"
        >
          {items.map((item, i) => {
            const Tag = (item.href ? "a" : "div") as "a";
            return (
              <React.Fragment key={item.title}>
                <Tag
                  id={`works-wheel-${i}`}
                  role="option"
                  aria-selected={i === active}
                  href={item.href}
                  onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    if (didDrag.current) {
                      e.preventDefault();
                      return;
                    }
                    if (item.href) {
                      e.preventDefault();
                      router.push(item.href);
                    }
                  }}
                  ref={(node: HTMLElement | null) => {
                    cardRefs.current[i] = node;
                  }}
                  className="group absolute cursor-pointer [backface-visibility:hidden]"
                  style={{
                    width: metrics.cardW,
                    height: metrics.cardH,
                    marginLeft: -metrics.cardW / 2,
                    marginTop: -metrics.cardH / 2,
                  }}
                >
                  <span className="bg-muted shadow-foreground/20 border-white/15 relative block size-full overflow-hidden rounded-xl border shadow-[0_18px_40px_-18px_var(--tw-shadow-color)] transition-transform duration-300">
                    <img
                      src={item.image}
                      alt={item.title}
                      draggable={false}
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Subtle gradient overlay so category name is legible on hover & in ring */}
                    <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent opacity-85 transition-opacity group-hover:opacity-95" />

                    {/* Small category icon + badge on card top-left */}
                    <span className="pointer-events-none absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/65 px-2.5 py-1 text-[0.68rem] font-medium text-white backdrop-blur-md border border-white/15">
                      {renderCategoryIcon(item.iconName, "size-3 text-primary")}
                      {item.badge && <span>{item.badge}</span>}
                    </span>

                    <span className="pointer-events-none absolute bottom-3 left-3.5 right-20 flex flex-col">
                      <span className="text-sm md:text-base font-semibold text-white tracking-tight drop-shadow-sm">
                        {item.title}
                      </span>
                      {item.subtitle && (
                        <span className="text-[0.68rem] text-white/75 line-clamp-1">
                          {item.subtitle}
                        </span>
                      )}
                    </span>

                    {action && item.href ? (
                      <span className="bg-primary text-primary-foreground pointer-events-none absolute right-3 bottom-3 flex translate-y-0.5 items-center gap-1 rounded-full px-3 py-1 text-[0.72rem] font-medium opacity-90 shadow-md backdrop-blur-sm transition group-hover:translate-y-0 group-hover:opacity-100 group-hover:scale-105">
                        <svg
                          viewBox="0 0 12 12"
                          className="size-2.5"
                          aria-hidden="true"
                        >
                          <path
                            d="M3 9 9 3M4 3h5v5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {action}
                      </span>
                    ) : null}
                  </span>
                </Tag>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Ring title and front-card title trade places across the transition.
          Type is sized off the measured stage, not vh, so the wheel keeps its
          proportions inside a card as well as at full bleed. */}
      <div
        ref={labelRef}
        className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center text-center tracking-tight"
      >
        <div
          className="font-semibold tracking-tighter"
          style={{ fontSize: metrics.title }}
        >
          {label}
        </div>
        <p className="text-muted-foreground mt-2 flex items-center gap-1.5 text-xs md:text-sm font-medium">
          <Sparkles className="text-primary size-3.5" />
          Scroll or drag to spin drum • Click any card to shop
        </p>
      </div>

      {/* Active Category Info + Small Category Icon Badge on the left when drum is open */}
      <div
        ref={titleRef}
        className="pointer-events-none absolute top-1/2 left-[6%] z-20 max-w-[26%] -translate-y-1/2 tracking-tight opacity-0"
      >
        {/* Small Category Icon + Badge Pill */}
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/50 px-3 py-1.5 text-xs font-semibold text-white shadow-md backdrop-blur-md">
          <span className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-full">
            {renderCategoryIcon(items[active]?.iconName, "size-3.5")}
          </span>
          <span>{items[active]?.badge || `Category 0${active + 1}`}</span>
        </div>

        <div
          className="font-bold tracking-tighter leading-none"
          style={{ fontSize: metrics.title }}
        >
          {items[active]?.title}
        </div>
        {items[active]?.subtitle && (
          <p className="text-muted-foreground mt-2 text-xs md:text-sm leading-relaxed">
            {items[active]?.subtitle}
          </p>
        )}
        {items[active]?.href && (
          <Link
            href={items[active].href!}
            className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs md:text-sm font-medium shadow-lg transition-transform hover:scale-105"
          >
            Explore {items[active]?.title}
            <ArrowUpRight className="size-4" />
          </Link>
        )}
      </div>

      {/* Right-hand side index with small category icon next to active category */}
      <ol
        className="text-muted-foreground absolute top-[7.5%] right-[2.5%] z-20 text-right leading-[1.85]"
        style={{ fontSize: Math.max(metrics.index, 12) }}
      >
        {items.map((item, i) => (
          <li key={item.title} className="flex items-center justify-end gap-2">
            {i === active && (
              <span className="text-primary inline-flex items-center">
                {renderCategoryIcon(item.iconName, "size-3.5")}
              </span>
            )}
            <button
              type="button"
              onClick={() => to(i + 1)}
              className={cn(
                "focus-visible:outline-foreground hover:text-foreground cursor-pointer transition-all outline-none focus-visible:outline-1",
                i === active && "text-foreground font-semibold scale-105",
              )}
            >
              {item.title}
            </button>
            {inDrumMode && i === active && (
              <Link
                href={item.href || "#"}
                className="text-primary hover:underline text-[0.7rem] font-semibold"
                title={`Open ${item.title} page`}
              >
                →
              </Link>
            )}
          </li>
        ))}
      </ol>

      {/* Bottom quick helper pill */}
      <div className="pointer-events-none absolute bottom-5 left-1/2 z-20 -translate-x-1/2">
        <div className="border-border/60 bg-background/70 text-muted-foreground flex items-center gap-2.5 rounded-full border px-4 py-1.5 text-xs shadow-md backdrop-blur-md">
          <span className="text-primary flex items-center">
            {renderCategoryIcon(items[active]?.iconName, "size-3.5")}
          </span>
          <span>
            {inDrumMode
              ? `Viewing ${active + 1} / ${count}: ${items[active]?.title}`
              : "Ring Mode • Scroll Down to Expand 3D Drum"}
          </span>
          <span className="bg-border h-3 w-px" />
          <span className="text-foreground font-medium">
            Click card to open category page
          </span>
        </div>
      </div>
    </section>
  );
}

export default WorksWheel;
