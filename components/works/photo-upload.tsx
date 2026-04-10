"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { getSupabaseClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Upload, Image as ImageIcon, X } from "lucide-react";

interface PhotoUploadProps {
  workId: string;
  onUploadComplete: () => void;
}

export function PhotoUpload({ workId, onUploadComplete }: PhotoUploadProps) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith("image/")) {
        toast.error("Por favor seleccioná una imagen");
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error("La imagen debe ser menor a 10MB");
        return;
      }
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Seleccioná una imagen");
      return;
    }

    setUploading(true);

    try {
      const supabase = getSupabaseClient();
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `works/${workId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("work-photos")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        toast.error("Error al subir la imagen");
        setUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("work-photos")
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from("work_photos")
        .insert({
          work_id: workId,
          url: urlData.publicUrl,
          description: description || null,
        });

      if (dbError) {
        console.error("DB error:", dbError);
        toast.error("Error al guardar la foto");
        setUploading(false);
        return;
      }

      toast.success("Foto subida exitosamente");
      handleClose();
      onUploadComplete();
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Error al subir la foto");
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setFile(null);
    setPreview(null);
    setDescription("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button
            className="inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium hover:bg-muted cursor-pointer"
          />
        }
        onClick={() => setOpen(true)}
      >
        <Upload className="h-4 w-4 mr-1" />
        Agregar Foto
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Subir Foto</DialogTitle>
          <DialogDescription>
            Agregá una foto para documentar el progreso de la obra
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Imagen</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            {preview ? (
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg border"
                />
                <button
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-48 border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-muted-foreground/50 transition-colors"
              >
                <ImageIcon className="h-10 w-10 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Click para seleccionar imagen
                </span>
              </button>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción (opcional)</Label>
            <Textarea
              id="description"
              placeholder="Ej: Progreso de instalación..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleUpload} disabled={!file || uploading}>
            {uploading ? "Subiendo..." : "Subir Foto"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
