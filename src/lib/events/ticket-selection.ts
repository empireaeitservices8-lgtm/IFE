export type TicketOptionId = "single" | "couple" | "group5" | "vip";

export interface TicketPassDefinition {
  id: TicketOptionId;
  name: string;
  price: number;
  description: string;
  benefits: string[];
  label?: string;
}

export interface SelectedTicketItem {
  id: TicketOptionId;
  name: string;
  price: number;
  quantity: number;
}

export const TICKET_PASSES: TicketPassDefinition[] = [
  {
    id: "single",
    name: "Single Entry",
    price: 1499,
    description: "Individual pass for one guest.",
    benefits: ["Entry for 1 guest", "General event access"],
  },
  {
    id: "couple",
    name: "Couple Entry",
    price: 2699,
    description: "Admits two guests together with savings.",
    benefits: ["Entry for 2 guests", "Priority check-in"],
    label: "POPULAR",
  },
  {
    id: "group5",
    name: "Group of 5",
    price: 6999,
    description: "Group pass for five guests attending together.",
    benefits: [
      "Entry for 5 guests",
      "Group priority check-in",
      "Best group value",
    ],
  },
  {
    id: "vip",
    name: "VIP Pass",
    price: 3499,
    description: "Exclusive VIP access and hospitality.",
    benefits: [
      "VIP event entry",
      "Reserved VIP area",
      "Priority entry",
      "Exclusive lounge access",
    ],
    label: "EXCLUSIVE",
  },
];

const PASS_BY_ID = new Map<TicketOptionId, TicketPassDefinition>(
  TICKET_PASSES.map((p) => [p.id, p])
);

export function isTicketOptionId(value: string): value is TicketOptionId {
  return PASS_BY_ID.has(value as TicketOptionId);
}

/**
 * Parses either `items=single:2,vip:1` or legacy `ticket=single&quantity=2`
 * into a validated list of selected pass items (total quantity 1..10).
 */
export function parseTicketSelection(params: {
  items?: string;
  ticket?: string;
  quantity?: string;
}): SelectedTicketItem[] {
  const parsed: SelectedTicketItem[] = [];
  let runningTotal = 0;

  if (params.items) {
    for (const part of params.items.split(",")) {
      const [rawId, rawQty] = part.split(":");
      const id = rawId?.trim();
      const qty = Number(rawQty);
      if (!id || !isTicketOptionId(id)) continue;
      if (!Number.isInteger(qty) || qty < 1) continue;
      const remaining = 10 - runningTotal;
      if (remaining <= 0) break;
      const clampedQty = Math.min(qty, remaining);
      const def = PASS_BY_ID.get(id)!;
      const existing = parsed.find((item) => item.id === id);
      if (existing) {
        existing.quantity += clampedQty;
      } else {
        parsed.push({
          id: def.id,
          name: def.name,
          price: def.price,
          quantity: clampedQty,
        });
      }
      runningTotal += clampedQty;
    }
    return parsed;
  }

  if (params.ticket && isTicketOptionId(params.ticket)) {
    const qty = Number(params.quantity || "1");
    if (Number.isInteger(qty) && qty >= 1 && qty <= 10) {
      const def = PASS_BY_ID.get(params.ticket)!;
      parsed.push({
        id: def.id,
        name: def.name,
        price: def.price,
        quantity: qty,
      });
    }
  }

  return parsed;
}

export function serializeTicketSelection(items: SelectedTicketItem[]): string {
  const valid = items.filter((item) => item.quantity > 0);
  if (valid.length === 0) return "";
  const encoded = valid.map((item) => `${item.id}:${item.quantity}`).join(",");
  return `items=${encodeURIComponent(encoded)}`;
}

