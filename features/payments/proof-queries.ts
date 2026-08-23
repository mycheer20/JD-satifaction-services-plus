import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { PaymentProofFileRow } from "@/types/database";

export async function getPaymentProofSignedUrls(
  files: PaymentProofFileRow[],
): Promise<{ id: string; fileName: string; url: string }[]> {
  if (files.length === 0) return [];

  const admin = createSupabaseAdminClient();
  const results: { id: string; fileName: string; url: string }[] = [];

  for (const file of files) {
    const { data, error } = await admin.storage
      .from("payment-proofs")
      .createSignedUrl(file.storage_path, 3600);

    if (!error && data?.signedUrl) {
      results.push({ id: file.id, fileName: file.file_name, url: data.signedUrl });
    }
  }

  return results;
}
