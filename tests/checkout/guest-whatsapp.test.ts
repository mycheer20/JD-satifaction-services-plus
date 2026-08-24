import { describe, expect, it } from "vitest";
import { buildGuestWhatsAppMessage } from "@/features/checkout/guest-whatsapp";

describe("buildGuestWhatsAppMessage", () => {
  it("inclut coordonnées, articles et paiement", () => {
    const message = buildGuestWhatsAppMessage({
      name: "Jean Dupont",
      email: "jean@example.com",
      phone: "+509 4073 1772",
      address: "12 rue Example",
      city: "Port-au-Prince",
      region: "Ouest",
      postalCode: "",
      note: "Sonner deux fois",
      couponCode: "PROMO10",
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

    expect(message).toContain("Jean Dupont");
    expect(message).toContain("jean@example.com");
    expect(message).toContain("Peinture murale");
    expect(message).toContain("MonCash");
    expect(message).toContain("PROMO10");
    expect(message).toContain("Sonner deux fois");
  });
});
