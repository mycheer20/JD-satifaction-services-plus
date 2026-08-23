"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { parseDynamicFields } from "@/features/fields/validation";
import { isFileField } from "@/features/fields/types";
import type { FieldDefinition } from "@/features/fields/types";
import { getSessionUser } from "@/features/auth/session";
import { getServiceBySlug } from "@/features/services/queries";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Json } from "@/types/database";

export interface ServiceBriefState {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
}

const contactSchema = z.object({
  serviceId: z.string().uuid(),
  formId: z.string().uuid(),
  contact_name: z.string().trim().min(2, "Le nom est requis.").max(120),
  contact_email: z.string().trim().email("Adresse e-mail invalide."),
  contact_phone: z.string().trim().max(40).optional().default(""),
});

const MAX_FILE_BYTES = 20 * 1024 * 1024;

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120) || "fichier";
}

async function uploadBriefFiles(
  requestId: string,
  fields: FieldDefinition[],
  formData: FormData,
) {
  const admin = createSupabaseAdminClient();
  const rows: {
    request_id: string;
    field_key: string;
    storage_path: string;
    file_name: string;
    mime_type: string | null;
    size_bytes: number;
  }[] = [];

  for (const field of fields.filter((f) => isFileField(f))) {
    const entries = formData.getAll(`attr.${field.key}.files`);

    for (const entry of entries) {
      if (!(entry instanceof File) || entry.size === 0) continue;

      if (entry.size > MAX_FILE_BYTES) {
        throw new Error(`Le fichier « ${entry.name} » dépasse la taille maximale (20 Mo).`);
      }

      const storagePath = `${requestId}/${field.key}/${sanitizeFileName(entry.name)}`;
      const buffer = Buffer.from(await entry.arrayBuffer());

      const { error: uploadError } = await admin.storage
        .from("brief-uploads")
        .upload(storagePath, buffer, {
          contentType: entry.type || "application/octet-stream",
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`Échec de l'envoi du fichier « ${entry.name} ».`);
      }

      rows.push({
        request_id: requestId,
        field_key: field.key,
        storage_path: storagePath,
        file_name: entry.name,
        mime_type: entry.type || null,
        size_bytes: entry.size,
      });
    }
  }

  if (rows.length === 0) return;

  const { error } = await admin.from("service_request_files").insert(rows);
  if (error) throw new Error(error.message);
}

export async function submitServiceBrief(
  _previous: ServiceBriefState,
  formData: FormData,
): Promise<ServiceBriefState> {
  const parsedContact = contactSchema.safeParse({
    serviceId: formData.get("serviceId"),
    formId: formData.get("formId"),
    contact_name: formData.get("contact_name"),
    contact_email: formData.get("contact_email"),
    contact_phone: formData.get("contact_phone") ?? "",
  });

  if (!parsedContact.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsedContact.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return {
      status: "error",
      message: "Merci de corriger les coordonnées signalées.",
      fieldErrors,
    };
  }

  const { serviceId, formId, contact_name, contact_email, contact_phone } =
    parsedContact.data;

  const supabase = await createSupabaseServerClient();
  const user = await getSessionUser();

  const { data: service } = await supabase
    .from("services")
    .select("id, slug, name")
    .eq("id", serviceId)
    .eq("is_active", true)
    .maybeSingle();

  if (!service) {
    return { status: "error", message: "Ce service n'est plus disponible." };
  }

  const loaded = await getServiceBySlug(service.slug);
  if (!loaded?.form || loaded.form.id !== formId) {
    return { status: "error", message: "Formulaire de brief introuvable." };
  }

  const { errors, answers } = parseDynamicFields(loaded.fields, formData, "attr.");

  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message: "Merci de compléter les champs obligatoires du brief.",
      fieldErrors: errors,
    };
  }

  const { data: request, error: insertError } = await supabase
    .from("service_requests")
    .insert({
      service_id: serviceId,
      form_id: formId,
      user_id: user?.id ?? null,
      contact_name,
      contact_email,
      contact_phone: contact_phone || null,
      answers: answers as Record<string, Json>,
    })
    .select("id, reference")
    .single();

  if (insertError || !request) {
    return {
      status: "error",
      message: insertError?.message ?? "Impossible d'enregistrer votre demande.",
    };
  }

  try {
    await uploadBriefFiles(request.id, loaded.fields, formData);
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Erreur lors de l'envoi des fichiers.",
    };
  }

  if (user) {
    redirect(`/demande/${request.id}?nouvelle=1`);
  }

  redirect(
    `/demande/confirmee?ref=${encodeURIComponent(request.reference)}&service=${encodeURIComponent(service.slug)}`,
  );
}
