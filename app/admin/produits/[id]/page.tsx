import type { AdminDetailPageProps } from "@/lib/admin/page-types";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminFlash } from "@/components/admin/admin-flash";
import { ProductForm } from "@/components/admin/product-form";
import {
  getAdminProduct,
  getTaxonomyForProductForm,
  listBrands,
} from "@/features/admin/queries";
import { getFieldDefinitionsForSubcategory } from "@/features/catalog/queries";
import { saveProduct, deleteProduct, deleteProductImage } from "@/features/admin/actions/products";
import { Button } from "@/components/ui/button";

export default async function EditProductPage({
  params,
  searchParams,
}: AdminDetailPageProps) {
  const { id } = await params;
  const query = await searchParams;

  const [product, taxonomy, brands] = await Promise.all([
    getAdminProduct(id),
    getTaxonomyForProductForm(),
    listBrands(),
  ]);

  if (!product) notFound();

  const fieldDefinitions = await getFieldDefinitionsForSubcategory(product.subcategory_id);

  const attributeValues: Record<string, unknown> = {};
  for (const attr of product.attributes ?? []) {
    if (attr.value_json) attributeValues[attr.field_key] = attr.value_json;
    else if (attr.value_boolean !== null) attributeValues[attr.field_key] = attr.value_boolean;
    else if (attr.value_number !== null) attributeValues[attr.field_key] = attr.value_number;
    else attributeValues[attr.field_key] = attr.value_text;
  }

  return (
    <>
      <AdminFlash searchParams={query} />
      <AdminPageHeader
        title={product.name}
        description={`Modifier le produit · slug : ${product.slug}`}
        actions={
          <form action={deleteProduct}>
            <input type="hidden" name="id" value={product.id} />
            <Button type="submit" variant="danger" size="sm">
              Supprimer
            </Button>
          </form>
        }
      />
      <ProductForm
        action={saveProduct}
        taxonomy={taxonomy}
        brands={brands}
        fieldDefinitions={fieldDefinitions}
        defaults={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          subcategory_id: product.subcategory_id,
          brand_id: product.brand_id,
          short_description: product.short_description,
          description: product.description,
          model: product.model,
          sku: product.sku,
          price: Number(product.price),
          sale_price: product.sale_price === null ? null : Number(product.sale_price),
          stock: product.stock,
          low_stock_threshold: product.low_stock_threshold,
          status: product.status,
          is_featured: product.is_featured,
          track_inventory: product.track_inventory,
          tags: product.tags,
          attributeValues,
        }}
        images={product.images ?? []}
        deleteImageAction={deleteProductImage}
      />
    </>
  );
}
