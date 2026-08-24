import { describe, expect, it } from "vitest";
import {
  formatOrderShippingLines,
  parseOrderShippingAddress,
} from "@/lib/orders/address";

describe("parseOrderShippingAddress", () => {
  it("formate adresse, ville, région et code postal", () => {
    const address = parseOrderShippingAddress({
      line1: "12 rue Example",
      city: "Port-au-Prince",
      region: "Ouest",
      postal_code: "6110",
    });

    expect(formatOrderShippingLines(address)).toEqual([
      "12 rue Example",
      "6110 Port-au-Prince",
      "Ouest",
    ]);
  });
});
