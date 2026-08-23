import type { AdminListPageProps } from "@/lib/admin/page-types";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminFlash } from "@/components/admin/admin-flash";
import { ProductForm } from "@/components/admin/product-form";
import { getTaxonomyForProductForm, listBrands } from "@/features/admin/queries";
import { saveProduct } from "@/features/admin/actions/products";

export default async function NewProductPage({
  searchParams,
}: AdminListPageProps) {
  const params = await searchParams;
  const [taxonomy, brands] = await Promise.all([
    getTaxonomyForProductForm(),
    listBrands(),
  ]);

  return (
    <>
      <AdminFlash searchParams={params} />
      <AdminPageHeader
        title="Nouveau produit"
        description="Créez un produit avec ses caractéristiques, images et placement dans le catalogue."
      />
      <ProductForm
        action={saveProduct}
        taxonomy={taxonomy}
        brands={brands}
        fieldDefinitions={[]}
      />
    </>
  );
}
