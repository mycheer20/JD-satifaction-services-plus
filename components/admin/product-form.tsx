"use client";

import { useMemo, useState } from "react";
import { DynamicField } from "@/features/fields/dynamic-field";
import type { FieldDefinition } from "@/features/fields/types";
import { FieldShell, Select, TextArea, TextInput, CheckboxField } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ProductStatus } from "@/types/database";

type TaxonomyFamily = {
  id: string;
  name: string;
  categories: {
    id: string;
    name: string;
    subcategories: { id: string; name: string; field_set_id: string | null }[];
  }[];
};

type Brand = { id: string; name: string };

type ProductFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  taxonomy: TaxonomyFamily[];
  brands: Brand[];
  fieldDefinitions: FieldDefinition[];
  defaults?: {
    id?: string;
    name?: string;
    slug?: string;
    subcategory_id?: string;
    brand_id?: string | null;
    short_description?: string | null;
    description?: string | null;
    model?: string | null;
    sku?: string | null;
    price?: number;
    sale_price?: number | null;
    stock?: number;
    low_stock_threshold?: number;
    status?: ProductStatus;
    is_featured?: boolean;
    track_inventory?: boolean;
    tags?: string[];
    attributeValues?: Record<string, unknown>;
  };
  images?: { id: string; url: string; alt_text: string | null }[];
  deleteImageAction?: (formData: FormData) => void | Promise<void>;
};

export function ProductForm({
  action,
  taxonomy,
  brands,
  fieldDefinitions: initialFields,
  defaults,
  images = [],
  deleteImageAction,
}: ProductFormProps) {
  const [subcategoryId, setSubcategoryId] = useState(defaults?.subcategory_id ?? "");
  const [fields, setFields] = useState<FieldDefinition[]>(initialFields);

  const subcategoryOptions = useMemo(() => {
    const options: { value: string; label: string }[] = [];
    for (const family of taxonomy) {
      for (const category of family.categories ?? []) {
        for (const sub of category.subcategories ?? []) {
          options.push({
            value: sub.id,
            label: `${family.name} › ${category.name} › ${sub.name}`,
          });
        }
      }
    }
    return options;
  }, [taxonomy]);

  async function onSubcategoryChange(nextId: string) {
    setSubcategoryId(nextId);
    if (!nextId) {
      setFields([]);
      return;
    }
    try {
      const response = await fetch(
        `/api/admin/field-definitions?subcategoryId=${encodeURIComponent(nextId)}`,
      );
      const data = (await response.json()) as FieldDefinition[];
      setFields(data);
    } catch {
      setFields([]);
    }
  }

  return (
    <form action={action} className="space-y-8">
      {defaults?.id ? <input type="hidden" name="id" value={defaults.id} /> : null}

      <Card padding="md" className="space-y-5">
        <h2 className="text-base font-bold">Informations générales</h2>
        <div className="admin-form-grid">
          <FieldShell label="Nom du produit" htmlFor="name" required>
            <TextInput id="name" name="name" required defaultValue={defaults?.name ?? ""} />
          </FieldShell>
          <FieldShell label="Slug URL" htmlFor="slug" hint="Généré automatiquement si vide. En cas de doublon, un suffixe (-2, -3…) est ajouté.">
            <TextInput id="slug" name="slug" defaultValue={defaults?.slug ?? ""} />
          </FieldShell>
          <FieldShell label="Sous-catégorie" htmlFor="subcategory_id" required className="span-2">
            <Select
              id="subcategory_id"
              name="subcategory_id"
              required
              value={subcategoryId}
              onChange={(event) => void onSubcategoryChange(event.target.value)}
            >
              <option value="">Choisir une sous-catégorie…</option>
              {subcategoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </FieldShell>
          <FieldShell label="Marque" htmlFor="brand_id">
            <Select id="brand_id" name="brand_id" defaultValue={defaults?.brand_id ?? ""}>
              <option value="">Aucune marque</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </Select>
          </FieldShell>
          <FieldShell label="Modèle" htmlFor="model">
            <TextInput id="model" name="model" defaultValue={defaults?.model ?? ""} />
          </FieldShell>
          <FieldShell label="SKU" htmlFor="sku">
            <TextInput id="sku" name="sku" defaultValue={defaults?.sku ?? ""} />
          </FieldShell>
          <FieldShell label="Statut" htmlFor="status" required>
            <Select id="status" name="status" defaultValue={defaults?.status ?? "draft"}>
              <option value="draft">Brouillon</option>
              <option value="active">Actif (visible boutique)</option>
              <option value="archived">Archivé</option>
            </Select>
          </FieldShell>
          <div className="flex flex-col gap-3 sm:col-span-2">
            <CheckboxField
              name="is_featured"
              label="Mettre en vedette sur l'accueil"
              defaultChecked={defaults?.is_featured}
            />
            <CheckboxField
              name="track_inventory"
              label="Suivre le stock"
              defaultChecked={defaults?.track_inventory ?? true}
            />
          </div>
          <FieldShell label="Description courte" htmlFor="short_description" className="span-2">
            <TextArea
              id="short_description"
              name="short_description"
              defaultValue={defaults?.short_description ?? ""}
            />
          </FieldShell>
          <FieldShell label="Description complète" htmlFor="description" className="span-2">
            <TextArea
              id="description"
              name="description"
              className="min-h-40"
              defaultValue={defaults?.description ?? ""}
            />
          </FieldShell>
          <FieldShell label="Tags" htmlFor="tags" hint="Séparés par des virgules">
            <TextInput
              id="tags"
              name="tags"
              defaultValue={defaults?.tags?.join(", ") ?? ""}
            />
          </FieldShell>
        </div>
      </Card>

      <Card padding="md" className="space-y-5">
        <h2 className="text-base font-bold">Prix et stock</h2>
        <div className="admin-form-grid">
          <FieldShell label="Prix (gourdes)" htmlFor="price" required hint="Montant en gdes — équivalent USD affiché sur la boutique">
            <TextInput
              id="price"
              name="price"
              type="number"
              min={0}
              step="1"
              required
              defaultValue={defaults?.price ?? ""}
            />
          </FieldShell>
          <FieldShell label="Prix promo (gourdes)" htmlFor="sale_price">
            <TextInput
              id="sale_price"
              name="sale_price"
              type="number"
              min={0}
              step="1"
              defaultValue={defaults?.sale_price ?? ""}
            />
          </FieldShell>
          <FieldShell label="Stock" htmlFor="stock">
            <TextInput
              id="stock"
              name="stock"
              type="number"
              min={0}
              defaultValue={defaults?.stock ?? 0}
            />
          </FieldShell>
          <FieldShell label="Seuil stock faible" htmlFor="low_stock_threshold">
            <TextInput
              id="low_stock_threshold"
              name="low_stock_threshold"
              type="number"
              min={0}
              defaultValue={defaults?.low_stock_threshold ?? 5}
            />
          </FieldShell>
        </div>
      </Card>

      {fields.length > 0 ? (
        <Card padding="md" className="space-y-5">
          <h2 className="text-base font-bold">Caractéristiques (champs dynamiques)</h2>
          <p className="text-sm text-muted">
            RAM, stockage, année, etc. — définis par le jeu de champs de la sous-catégorie.
          </p>
          <div className="admin-form-grid">
            {fields.map((field) => (
              <DynamicField
                key={field.key}
                field={field}
                prefix="attr"
                defaultValue={defaults?.attributeValues?.[field.key] as never}
              />
            ))}
          </div>
        </Card>
      ) : null}

      <Card padding="md" className="space-y-5">
        <h2 className="text-base font-bold">Images</h2>
        {images.length > 0 ? (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {images.map((image) => (
              <li key={image.id} className="relative overflow-hidden rounded-xl border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image.url} alt={image.alt_text ?? ""} className="aspect-square object-cover" />
                {deleteImageAction ? (
                  <Button
                    type="submit"
                    variant="danger"
                    size="sm"
                    className="absolute right-2 top-2"
                    formAction={deleteImageAction}
                    name="image_id"
                    value={image.id}
                  >
                    Suppr.
                  </Button>
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}
        <FieldShell label="Ajouter des images" htmlFor="images" hint="JPEG, PNG, WebP — 5 Mo max">
          <TextInput id="images" name="images" type="file" accept="image/*" multiple />
        </FieldShell>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" size="lg">
          Enregistrer le produit
        </Button>
      </div>
    </form>
  );
}
