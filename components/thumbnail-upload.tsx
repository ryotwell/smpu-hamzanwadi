"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ImageIcon, X } from "lucide-react";
import { toast } from "sonner";

interface ThumbnailUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export function ThumbnailUpload({ value, onChange }: ThumbnailUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal mengunggah file");
      }

      onChange(data.url);
      toast.success("Thumbnail berhasil diunggah");
    } catch (error: any) {
      toast.error(error.message || "Gagal mengunggah thumbnail");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleRemove() {
    onChange("");
  }

  return (
    <div className="space-y-3">
      {value ? (
        <div className="relative w-full max-w-xs">
          <img
            src={value}
            alt="Thumbnail preview"
            className="w-full h-40 object-cover rounded-md border"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 size-6 rounded-full"
            onClick={handleRemove}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full max-w-xs h-40 rounded-md border border-dashed text-muted-foreground">
          <div className="flex flex-col items-center gap-1">
            <ImageIcon className="h-8 w-8" />
            <span className="text-xs">Belum ada thumbnail</span>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <Input
          ref={inputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp, image/gif"
          onChange={handleFileChange}
          disabled={isUploading}
          className="max-w-xs"
        />
        {isUploading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
      </div>
      <p className="text-xs text-muted-foreground">
        Format: JPG, PNG, WEBP, GIF. Maksimal 5MB.
      </p>
    </div>
  );
}