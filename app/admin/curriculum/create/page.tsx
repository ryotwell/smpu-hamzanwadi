// app/admin/curriculum/create/page.tsx
"use client";

import { useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { curriculumSchema, CurriculumFormValues } from "../schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { createCurriculum, uploadCurriculumImage } from "../actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function CreateCurriculumPage() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);

  const form = useForm<CurriculumFormValues>({
    resolver: zodResolver(curriculumSchema),
    defaultValues: {
      name: "",
      image: "",
      category: "EXTRACURRICULAR",
      description: "",
    },
  });

  // Upload gambar langsung saat dipilih, sebelum submit
  async function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    try {
      setUploading(true);
      const url = await uploadCurriculumImage(selected);
      form.setValue("image", url);
    } catch {
      toast.error("Gagal mengunggah gambar. Coba lagi.");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(data: CurriculumFormValues) {
    await createCurriculum(data);
    // redirect terjadi di action
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Tambah Kurikulum Baru</CardTitle>
          <CardDescription>Isi data kurikulum, program, atau ekstrakurikuler.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Program Unggulan Tahfidz" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategori</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="EXTRACURRICULAR">Ekstrakurikuler</SelectItem>
                        <SelectItem value="PROGRAM_UNGGULAN">Program Unggulan</SelectItem>
                        <SelectItem value="KO_CULLICULAR">Ko-Kulikuler</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={() => (
                  <FormItem>
                    <FormLabel>Gambar (opsional)</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        disabled={uploading}
                        onChange={handleImageChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsi (opsional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Deskripsi singkat..." {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button variant="outline" type="button" onClick={() => router.back()} disabled={uploading}>
                  Batal
                </Button>
                <Button type="submit" disabled={uploading}>
                  {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Simpan
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}