"use client";

import { use } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { curriculumSchema, CurriculumFormValues } from "../../schema";
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
import { getCurriculumById, updateCurriculum, uploadCurriculumImage } from "../../actions";
import { useEffect, useState, type ChangeEvent } from "react";
import { notFound } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default function EditCurriculumPage({ params }: EditPageProps) {
  const { id } = use(params);
  const curriculumId = parseInt(id);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [defaultValues, setDefaultValues] = useState<CurriculumFormValues | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const data = await getCurriculumById(curriculumId);
      if (!data) {
        notFound();
        return;
      }
      setDefaultValues({
        name: data.name,
        image: data.image || "",
        category: data.category,
        description: data.description || "",
      });
      setLoading(false);
    }
    fetchData();
  }, [curriculumId]);

  const form = useForm<CurriculumFormValues>({
    resolver: zodResolver(curriculumSchema),
    defaultValues: defaultValues || undefined,
  });

  // Reset form ketika data sudah dimuat
  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form]);

  // Upload gambar langsung saat dipilih, sebelum submit
  async function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    try {
      setUploading(true);
      const url = await uploadCurriculumImage(selected);
      form.setValue("image", url);
      setFile(selected);
    } catch {
      toast.error("Gagal mengunggah gambar. Coba lagi.");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(data: CurriculumFormValues) {
    await updateCurriculum(curriculumId, data);
  }

  // ✅ Tampilkan loading sampai data siap
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Edit Kurikulum</CardTitle>
            <CardDescription>Memuat data...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ✅ Pastikan defaultValues sudah ada sebelum render form
  if (!defaultValues) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Edit Kurikulum</CardTitle>
          <CardDescription>Ubah data kurikulum yang sudah ada.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Nama */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama</FormLabel>
                    <FormControl>
                      <Input placeholder="Nama kurikulum" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Kategori */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategori</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
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

              {/* Gambar (upload) */}
              <FormField
                control={form.control}
                name="image"
                render={() => (
                  <FormItem>
                    <FormLabel>Gambar (opsional)</FormLabel>
                    {!file && defaultValues?.image ? (
                      <img
                        src={defaultValues.image}
                        alt="Gambar saat ini"
                        className="h-32 w-auto rounded-md border object-cover"
                      />
                    ) : null}
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

              {/* Deskripsi */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsi (opsional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Deskripsi singkat"
                        {...field}
                        value={field.value ?? ""}
                      />
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
                  Perbarui
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}