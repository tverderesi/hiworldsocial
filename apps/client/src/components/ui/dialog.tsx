import * as React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./button";

type Props = {
  open: boolean;
  title: string;
  description?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmDialog({ open, title, description, onCancel, onConfirm }: Props) {
  const { t } = useTranslation();
  if (!open) return null;

  return (
    <div className="dialog-backdrop" role="presentation">
      <div className="dialog-card" role="dialog" aria-modal="true" aria-label={title}>
        <h3>{title}</h3>
        {description ? <p>{description}</p> : null}
        <div className="dialog-actions">
          <Button variant="outline" onClick={onCancel}>{t("actions.cancel")}</Button>
          <Button variant="destructive" onClick={onConfirm}>{t("actions.confirm")}</Button>
        </div>
      </div>
    </div>
  );
}
