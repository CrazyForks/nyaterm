import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdAdd, MdDelete, MdEdit } from "react-icons/md";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { invoke } from "@/lib/invoke";
import type { SavedPassword } from "@/types/global";
import { SecretUnlockFooter } from "./SecretUnlockFooter";

interface PasswordManagementTabProps {
  onCountChange?: (count: number) => void;
  secretsUnlocked?: boolean;
  onLockSecrets?: () => void;
  onUnlockSecrets?: () => void;
  showSecretUnlockFooter?: boolean;
}

interface PasswordEditorProps {
  editHasPassword: boolean;
  editName: string;
  editPassword: string;
  isEditing: boolean;
  passwordLoading: boolean;
  onCancel: () => void;
  onNameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSave: () => void;
  saveDisabled: boolean;
  t: ReturnType<typeof useTranslation>["t"];
}

function PasswordEditor({
  editHasPassword,
  editName,
  editPassword,
  isEditing,
  passwordLoading,
  onCancel,
  onNameChange,
  onPasswordChange,
  onSave,
  saveDisabled,
  t,
}: PasswordEditorProps) {
  return (
    <div className="space-y-2.5 border-b bg-accent/30 p-3">
      <Input
        placeholder={t("passwordManager.namePlaceholder")}
        className="h-8 text-xs"
        value={editName}
        onChange={(event) => onNameChange(event.target.value)}
        autoFocus
      />
      <Input
        type="password"
        placeholder={
          passwordLoading
            ? t("common.loading")
            : isEditing && editHasPassword
              ? t("passwordManager.passwordUnchanged")
              : t("passwordManager.passwordPlaceholder")
        }
        className="h-8 text-xs"
        value={editPassword}
        onChange={(event) => onPasswordChange(event.target.value)}
        disabled={passwordLoading}
      />
      <div className="flex justify-end gap-1.5 pt-0.5">
        <Button variant="outline" size="sm" className="h-7 px-3 text-xs" onClick={onCancel}>
          {t("common.cancel")}
        </Button>
        <Button size="sm" className="h-7 px-3 text-xs" onClick={onSave} disabled={saveDisabled}>
          {t("common.save")}
        </Button>
      </div>
    </div>
  );
}

export function PasswordManagementTab({
  onCountChange,
  secretsUnlocked = false,
  onLockSecrets,
  onUnlockSecrets,
  showSecretUnlockFooter = false,
}: PasswordManagementTabProps) {
  const { t } = useTranslation();
  const [passwords, setPasswords] = useState<SavedPassword[]>([]);
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editHasPassword, setEditHasPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [deletingEntry, setDeletingEntry] = useState<SavedPassword | null>(null);
  const editRequestRef = useRef(0);

  const loadPasswords = useCallback(async () => {
    try {
      const result = await invoke<SavedPassword[]>("get_saved_passwords");
      setPasswords(result);
      onCountChange?.(result.length);
    } catch {
      /* ignore */
    }
  }, [onCountChange]);

  useEffect(() => {
    loadPasswords();
  }, [loadPasswords]);

  useEffect(() => {
    if (!secretsUnlocked) {
      setVisiblePasswords({});
      return;
    }

    let cancelled = false;
    Promise.all(
      passwords.map(async (entry) => {
        if (!entry.has_password) return [entry.id, ""] as const;
        try {
          const value = await invoke<string | null>("get_saved_password_value", { id: entry.id });
          return [entry.id, value ?? ""] as const;
        } catch {
          return [entry.id, ""] as const;
        }
      }),
    ).then((values) => {
      if (cancelled) return;
      setVisiblePasswords(Object.fromEntries(values));
    });

    return () => {
      cancelled = true;
    };
  }, [passwords, secretsUnlocked]);

  const resetEdit = () => {
    editRequestRef.current += 1;
    setEditingId(null);
    setEditName("");
    setEditPassword("");
    setEditHasPassword(false);
    setPasswordLoading(false);
    setIsNew(false);
  };

  const handleAdd = () => {
    resetEdit();
    setEditingId("__new__");
    setIsNew(true);
  };

  const handleEdit = async (entry: SavedPassword) => {
    const requestId = ++editRequestRef.current;
    setEditingId(entry.id);
    setEditName(entry.name);
    setEditPassword("");
    setEditHasPassword(entry.has_password || false);
    setPasswordLoading(true);
    setIsNew(false);

    try {
      const password = await invoke<string | null>("get_saved_password_value", { id: entry.id });
      if (editRequestRef.current !== requestId) return;
      setEditPassword(password ?? "");
    } catch {
      if (editRequestRef.current !== requestId) return;
      setEditPassword("");
    } finally {
      if (editRequestRef.current === requestId) {
        setPasswordLoading(false);
      }
    }
  };

  const handleSave = async () => {
    if (!editName.trim()) return;
    if (isNew && !editPassword) return;
    try {
      await invoke("save_password", {
        entry: {
          id: isNew ? "" : editingId,
          name: editName.trim(),
          password: editPassword || undefined,
        },
      });
      resetEdit();
      await loadPasswords();
    } catch {
      /* ignore */
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingEntry) return;
    try {
      await invoke("delete_password", { id: deletingEntry.id });
      await loadPasswords();
    } catch {
      /* ignore */
    }
    setDeletingEntry(null);
  };

  const rootClassName = showSecretUnlockFooter ? "flex min-h-0 flex-1 flex-col" : "space-y-6";
  const contentClassName = showSecretUnlockFooter
    ? "min-h-0 flex-1 overflow-y-auto px-3 pb-3 terminal-scroll"
    : "";

  return (
    <div className={rootClassName}>
      <div className={contentClassName}>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="font-medium text-sm">{t("passwordManager.title")}</Label>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary h-7 px-2 text-xs"
              onClick={handleAdd}
              disabled={editingId !== null}
            >
              <MdAdd className="text-base mr-1" /> {t("passwordManager.add")}
            </Button>
          </div>

          <div className="border rounded-md overflow-hidden">
            {isNew && editingId === "__new__" && (
              <PasswordEditor
                editHasPassword={editHasPassword}
                editName={editName}
                editPassword={editPassword}
                isEditing={false}
                passwordLoading={passwordLoading}
                onCancel={resetEdit}
                onNameChange={setEditName}
                onPasswordChange={setEditPassword}
                onSave={handleSave}
                saveDisabled={passwordLoading || !editName.trim() || !editPassword}
                t={t}
              />
            )}

            {passwords.map((entry) => (
              <div key={entry.id}>
                {editingId === entry.id && !isNew ? (
                  <PasswordEditor
                    editHasPassword={editHasPassword}
                    editName={editName}
                    editPassword={editPassword}
                    isEditing={true}
                    passwordLoading={passwordLoading}
                    onCancel={resetEdit}
                    onNameChange={setEditName}
                    onPasswordChange={setEditPassword}
                    onSave={handleSave}
                    saveDisabled={passwordLoading || !editName.trim()}
                    t={t}
                  />
                ) : (
                  <div className="flex items-center gap-2 px-3 py-2.5 border-b last:border-0 hover:bg-accent transition-colors">
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-xs">{entry.name}</div>
                      {secretsUnlocked ? (
                        <div className="mt-1 truncate font-mono text-[0.6875rem] text-muted-foreground">
                          {visiblePasswords[entry.id] || t("secretUnlock.emptySecret")}
                        </div>
                      ) : null}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => {
                        void handleEdit(entry);
                      }}
                      disabled={editingId !== null}
                    >
                      <MdEdit className="text-base" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => setDeletingEntry(entry)}
                      disabled={editingId !== null}
                    >
                      <MdDelete className="text-base" />
                    </Button>
                  </div>
                )}
              </div>
            ))}

            {passwords.length === 0 && !isNew && (
              <div className="text-center py-6 text-xs text-muted-foreground">
                {t("passwordManager.noPasswords")}
              </div>
            )}
          </div>
        </div>
      </div>

      {showSecretUnlockFooter ? (
        <SecretUnlockFooter
          unlocked={secretsUnlocked}
          onLock={onLockSecrets ?? (() => {})}
          onUnlocked={onUnlockSecrets ?? (() => {})}
        />
      ) : null}

      <Dialog open={deletingEntry !== null} onOpenChange={(v) => !v && setDeletingEntry(null)}>
        <DialogContent showCloseButton={false} className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("passwordManager.deleteTitle")}</DialogTitle>
            <DialogDescription>
              {t("passwordManager.deleteConfirm", { name: deletingEntry?.name })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingEntry(null)}>
              {t("common.cancel")}
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              {t("common.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
