import { describe, expect, it } from "vitest";
import { formatOrderDeliveryLines, parseOrderDeliverySnapshot } from "@/lib/orders/delivery-display";

describe("parseOrderDeliverySnapshot", () => {
  it("formate une livraison par zone", () => {
    const snapshot = parseOrderDeliverySnapshot({
      fulfillment_mode: "delivery",
      country_name: "Haïti",
      department_name: "Sud-Est",
      commune_name: "Jacmel",
      city_name: "Jacmel",
      zone_name: "Meyer",
      line1: "Rue X",
    });

    const lines = formatOrderDeliveryLines(snapshot);
    expect(lines.some((l) => l.includes("Meyer"))).toBe(true);
    expect(lines.some((l) => l.includes("Rue X"))).toBe(true);
  });

  it("formate un retrait boutique", () => {
    const snapshot = parseOrderDeliverySnapshot({
      fulfillment_mode: "pickup",
      pickup_label: "Boutique",
      pickup_address: "12 rue Example",
    });

    expect(formatOrderDeliveryLines(snapshot)[0]).toContain("Retrait");
  });
});
