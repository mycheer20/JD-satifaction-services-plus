import { FieldShell, TextInput, Select, TextArea, CheckboxField } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { CouponRow } from "@/types/database";

export function CouponForm({
  action,
  defaults,
}: {
  action: (formData: FormData) => void | Promise<void>;
  defaults?: CouponRow;
}) {
  return (
    <form action={action}>
      {defaults?.id ? <input type="hidden" name="id" value={defaults.id} /> : null}
      <Card padding="md" className="max-w-xl space-y-4">
        <FieldShell label="Code" htmlFor="code" required>
          <TextInput id="code" name="code" required defaultValue={defaults?.code ?? ""} />
        </FieldShell>
        <FieldShell label="Description" htmlFor="description">
          <TextArea id="description" name="description" defaultValue={defaults?.description ?? ""} />
        </FieldShell>
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldShell label="Type" htmlFor="discount_type" required>
            <Select id="discount_type" name="discount_type" defaultValue={defaults?.discount_type ?? "percentage"}>
              <option value="percentage">Pourcentage</option>
              <option value="fixed">Montant fixe</option>
            </Select>
          </FieldShell>
          <FieldShell label="Valeur" htmlFor="discount_value" required>
            <TextInput
              id="discount_value"
              name="discount_value"
              type="number"
              min={0}
              required
              defaultValue={defaults?.discount_value ?? ""}
            />
          </FieldShell>
        </div>
        <FieldShell label="Commande minimum" htmlFor="min_order_amount">
          <TextInput
            id="min_order_amount"
            name="min_order_amount"
            type="number"
            min={0}
            defaultValue={defaults?.min_order_amount ?? ""}
          />
        </FieldShell>
        <CheckboxField name="is_active" label="Coupon actif" defaultChecked={defaults?.is_active ?? true} />
        <Button type="submit">Enregistrer</Button>
      </Card>
    </form>
  );
}
