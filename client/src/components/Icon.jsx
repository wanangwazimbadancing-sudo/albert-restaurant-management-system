import {
  Bell,
  CakeSlice,
  Check,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  House,
  LogOut,
  MapPin,
  Minus,
  PencilLine,
  Plus,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Soup,
  Sandwich,
  Trash2,
  UserRound,
  UtensilsCrossed,
  X,
  LayoutDashboard,
} from "lucide-react";

export function Icon({ name, className = "w-5 h-5" }) {
  const map = { home: House, cart: ShoppingCart, user: UserRound, bell: Bell, search: Search, sliders: SlidersHorizontal, plus: Plus, minus: Minus, trash: Trash2, logout: LogOut, check: Check, clipboard: LayoutDashboard, edit: PencilLine, x: X, chevronLeft: ChevronLeft, chevronRight: ChevronRight,};

  const LucideIcon = map[name];

  if (!LucideIcon) return null;

  return <LucideIcon className={className} strokeWidth={1.8} />;
}

export function CategoryArt({ category, className = "w-8 h-8" }) {
  const map = {
    rice: UtensilsCrossed,
    chips: Sandwich,
    nsima: Soup,
    dessert: CakeSlice,
  };

  const LucideIcon = map[category];
  if (!LucideIcon) return null;

  return <LucideIcon className={className} strokeWidth={2.2} />;
}
