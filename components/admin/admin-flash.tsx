import { Alert } from "@/components/ui/badge";

export function AdminFlash({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const ok = first(searchParams.ok);
  const error = first(searchParams.erreur) ?? first(searchParams.error);

  if (ok) {
    return (
      <Alert tone="success" className="mb-6">
        {FLASH_OK[ok] ?? "Modification enregistrée."}
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert tone="error" className="mb-6">
        {FLASH_ERROR[error] ?? decodeURIComponent(error)}
      </Alert>
    );
  }

  return null;
}

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

const FLASH_OK: Record<string, string> = {
  cree: "Élément créé avec succès.",
  modifie: "Modifications enregistrées.",
  supprime: "Élément supprimé.",
  statut: "Statut mis à jour.",
  paiement: "Paiement confirmé.",
  avis: "Avis modéré.",
  role: "Rôle utilisateur mis à jour.",
};

const FLASH_ERROR: Record<string, string> = {
  "acces-administrateur-requis": "Cette section est réservée aux administrateurs.",
  introuvable: "Élément introuvable.",
  validation: "Vérifiez les champs du formulaire.",
  "paiement-requis-livraison":
    "Impossible de lancer la livraison : le paiement doit d'abord être confirmé.",
};
