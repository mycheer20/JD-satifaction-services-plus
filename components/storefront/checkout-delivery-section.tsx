"use client";

import { useCallback, useEffect, useState } from "react";
import type { DeliveryLocationOption, DeliveryZoneOption, FulfillmentMode } from "@/features/delivery/types";
import { FormField, RadioField, Select, TextArea, TextInput } from "@/components/ui/field";
import { Card } from "@/components/ui/card";
import { PriceDisplay } from "@/components/storefront/price-display";
import { pickupAddressLines, storeContact } from "@/lib/store/contact";
import { Alert } from "@/components/ui/badge";

async function fetchOptions(type: string, parentId?: string): Promise<DeliveryLocationOption[]> {
  const params = new URLSearchParams({ type });
  if (parentId) params.set("parentId", parentId);
  const res = await fetch(`/api/delivery/options?${params}`);
  if (!res.ok) return [];
  return res.json();
}

async function fetchZones(cityId: string): Promise<DeliveryZoneOption[]> {
  const params = new URLSearchParams({ type: "zones", parentId: cityId });
  const res = await fetch(`/api/delivery/options?${params}`);
  if (!res.ok) return [];
  return res.json();
}

export function CheckoutDeliverySection({
  fieldErrors,
  onShippingChange,
}: {
  fieldErrors?: Record<string, string>;
  onShippingChange: (fee: number, currency: string) => void;
}) {
  const [mode, setMode] = useState<FulfillmentMode>("delivery");
  const [countries, setCountries] = useState<DeliveryLocationOption[]>([]);
  const [departments, setDepartments] = useState<DeliveryLocationOption[]>([]);
  const [communes, setCommunes] = useState<DeliveryLocationOption[]>([]);
  const [cities, setCities] = useState<DeliveryLocationOption[]>([]);
  const [zones, setZones] = useState<DeliveryZoneOption[]>([]);
  const [countryId, setCountryId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [communeId, setCommuneId] = useState("");
  const [cityId, setCityId] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [loadingGeo, setLoadingGeo] = useState(true);

  const selectedZone = zones.find((z) => z.id === zoneId);

  useEffect(() => {
    fetchOptions("countries")
      .then(setCountries)
      .finally(() => setLoadingGeo(false));
  }, []);

  useEffect(() => {
    if (mode === "pickup") {
      onShippingChange(0, "HTG");
      return;
    }
    onShippingChange(selectedZone?.delivery_fee ?? 0, selectedZone?.currency ?? "HTG");
  }, [mode, selectedZone, onShippingChange]);

  const resetBelow = useCallback((level: "country" | "department" | "commune" | "city") => {
    if (level === "country") {
      setDepartmentId("");
      setCommunes([]);
      setCommuneId("");
      setCities([]);
      setCityId("");
      setZones([]);
      setZoneId("");
    }
    if (level === "country" || level === "department") {
      if (level === "department") {
        setCommunes([]);
        setCommuneId("");
        setCities([]);
        setCityId("");
        setZones([]);
        setZoneId("");
      }
    }
    if (level === "commune") {
      setCities([]);
      setCityId("");
      setZones([]);
      setZoneId("");
    }
    if (level === "city") {
      setZones([]);
      setZoneId("");
    }
  }, []);

  async function onCountryChange(id: string) {
    setCountryId(id);
    resetBelow("country");
    if (id) setDepartments(await fetchOptions("departments", id));
    else setDepartments([]);
  }

  async function onDepartmentChange(id: string) {
    setDepartmentId(id);
    resetBelow("department");
    if (id) setCommunes(await fetchOptions("communes", id));
  }

  async function onCommuneChange(id: string) {
    setCommuneId(id);
    resetBelow("commune");
    if (id) setCities(await fetchOptions("cities", id));
  }

  async function onCityChange(id: string) {
    setCityId(id);
    resetBelow("city");
    if (id) setZones(await fetchZones(id));
  }

  const pickupLines = pickupAddressLines();

  return (
    <Card padding="md" className="space-y-4">
      <h2 className="text-base font-bold text-[color:var(--color-foreground)]">📍 Livraison</h2>
      <p className="text-xs text-muted">
        Choisissez la livraison à domicile ou le retrait en boutique. La préparation débute après
        confirmation du paiement.
      </p>

      <input type="hidden" name="fulfillmentMode" value={mode} />
      <input type="hidden" name="countryId" value={countryId} />
      <input type="hidden" name="departmentId" value={departmentId} />
      <input type="hidden" name="communeId" value={communeId} />
      <input type="hidden" name="cityId" value={cityId} />
      <input type="hidden" name="zoneId" value={zoneId} />

      <div className="space-y-2">
        <RadioField
          name="fulfillmentModeUi"
          value="delivery"
          checked={mode === "delivery"}
          onChange={() => setMode("delivery")}
          label="Livraison à domicile"
          description="Sélectionnez votre zone — le tarif s'applique automatiquement."
          className="rounded-xl border-2 border-[color:var(--color-border)] p-4 transition has-[:checked]:border-[color:var(--accent)] has-[:checked]:bg-[color:var(--accent-soft)]"
        />
        <RadioField
          name="fulfillmentModeUi"
          value="pickup"
          checked={mode === "pickup"}
          onChange={() => setMode("pickup")}
          label="Retrait en boutique"
          description="Vous récupérez votre commande sur place — sans frais de livraison."
          className="rounded-xl border-2 border-[color:var(--color-border)] p-4 transition has-[:checked]:border-[color:var(--accent)] has-[:checked]:bg-[color:var(--accent-soft)]"
        />
      </div>

      {fieldErrors?.fulfillmentMode ? (
        <p className="text-xs font-semibold text-rose-600">{fieldErrors.fulfillmentMode}</p>
      ) : null}

      {mode === "pickup" ? (
        <Alert tone="info">
          <p className="font-semibold">{storeContact.pickup.label}</p>
          <p className="mt-1 text-sm">{pickupLines.join(" · ")}</p>
          <p className="mt-1 text-sm">{storeContact.pickup.hours}</p>
        </Alert>
      ) : (
        <>
          {loadingGeo ? (
            <p className="text-sm text-muted">Chargement des zones…</p>
          ) : countries.length === 0 ? (
            <Alert tone="warning">
              Aucune zone de livraison configurée pour le moment. Contactez-nous ou choisissez le
              retrait en boutique.
            </Alert>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Pays" htmlFor="country" required error={fieldErrors?.countryId}>
                <Select
                  id="country"
                  required
                  value={countryId}
                  onChange={(e) => void onCountryChange(e.target.value)}
                >
                  <option value="">Sélectionner…</option>
                  {countries.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField
                label="Département"
                htmlFor="department"
                required
                error={fieldErrors?.departmentId}
              >
                <Select
                  id="department"
                  required
                  disabled={!countryId}
                  value={departmentId}
                  onChange={(e) => void onDepartmentChange(e.target.value)}
                >
                  <option value="">Sélectionner…</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField label="Commune" htmlFor="commune" required error={fieldErrors?.communeId}>
                <Select
                  id="commune"
                  required
                  disabled={!departmentId}
                  value={communeId}
                  onChange={(e) => void onCommuneChange(e.target.value)}
                >
                  <option value="">Sélectionner…</option>
                  {communes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField label="Ville" htmlFor="city" required error={fieldErrors?.cityId}>
                <Select
                  id="city"
                  required
                  disabled={!communeId}
                  value={cityId}
                  onChange={(e) => void onCityChange(e.target.value)}
                >
                  <option value="">Sélectionner…</option>
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField
                label="Zone de livraison"
                htmlFor="zone"
                required
                error={fieldErrors?.zoneId}
                className="sm:col-span-2"
              >
                <Select
                  id="zone"
                  required
                  disabled={!cityId}
                  value={zoneId}
                  onChange={(e) => setZoneId(e.target.value)}
                >
                  <option value="">Sélectionner…</option>
                  {zones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name} — {z.delivery_fee} {z.currency}
                    </option>
                  ))}
                </Select>
              </FormField>
            </div>
          )}

          {selectedZone ? (
            <p className="text-sm font-semibold text-[color:var(--color-foreground)]">
              🚚 Livraison :{" "}
              <PriceDisplay
                amount={selectedZone.delivery_fee}
                currency={selectedZone.currency}
                layout="inline"
              />
            </p>
          ) : null}

          <FormField
            label="Adresse exacte"
            htmlFor="address"
            required
            error={fieldErrors?.address}
          >
            <TextArea
              id="address"
              name="address"
              rows={2}
              required={mode === "delivery"}
              placeholder="Maison bleue, rue X, près de l'église Y…"
            />
          </FormField>

          <FormField label="Point de repère" htmlFor="landmark" error={fieldErrors?.landmark}>
            <TextInput id="landmark" name="landmark" placeholder="Optionnel" />
          </FormField>

          <FormField
            label="Téléphone pour la livraison"
            htmlFor="deliveryPhone"
            hint="Si différent du téléphone principal"
            error={fieldErrors?.deliveryPhone}
          >
            <TextInput id="deliveryPhone" name="deliveryPhone" type="tel" />
          </FormField>
        </>
      )}

      <FormField label="Instructions de livraison" htmlFor="note">
        <TextArea id="note" name="note" rows={2} placeholder="Optionnel" />
      </FormField>
    </Card>
  );
}
