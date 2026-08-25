import { describe, expect, it } from "vitest";
import { buildGuestWhatsAppMessage } from "@/features/checkout/guest-whatsapp";

describe("buildGuestWhatsAppMessage", () => {
  it("inclut zone, livraison et total", () => {
    const message = buildGuestWhatsAppMessage({
      name: "Jean Dupont",
      email: "jean@example.com",
      phone: "+509 4073 1772",
      delivery: {
        fulfillment_mode: "delivery",
        country_name: "Haïti",
        department_name: "Sud-Est",
        commune_name: "Jacmel",
        city_name: "Jacmel",
        zone_name: "Meyer",
        line1: "Maison bleue",
        delivery_fee_applied: 250,
        currency: "HTG",
      },
      shippingTotal: 250,
      shippingCurrency: "HTG",
      note: "Sonner deux fois",
      couponCode: "",
      paymentMethodLabel: "MonCash",
      lines: [
        {
          name: "Peinture murale",
          quantity: 2,
          unitPrice: 1500,
          currency: "HTG",
        },
      ],
    });

    expect(message).toContain("Meyer");
    expect(message).toContain("Maison bleue");
    expect(message).toContain("250");
    expect(message).toContain("3 250");
  });
});
