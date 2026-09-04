"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Pencil, Trash2, Eye, EyeOff, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ThumbnailUpload } from "@/components/thumbnail-upload";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { createPost, deletePost, togglePublish, updatePost } from "./actions";
import { postSchema, type PostFormValues } from "./schema";

type Post = {
  id: number; title: string; slug: string; thumbnail: string | null;
  description: string | null; content: string; excerpt: string | null;
  published: boolean; publishedAt: Date | null;
  category: "BERITA" | "ARTIKEL" | "INFORMASI" | null;
};
const empty: PostFormValues = { title: "", slug: "", thumbnail: "", description: "", content: "", excerpt: "", published: false, publishedAt: "", category: null };
const categoryLabels = { BERITA: "Berita", ARTIKEL: "Artikel", INFORMASI: "Informasi" } as const;
const unset = "_unset";
function dateValue(date: Date | null) { return date ? new Date(date).toISOString().slice(0, 16) : ""; }

export default function PostsClient({ initialData }: { initialData: Post[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);
  const [busy, setBusy] = useState(false);
  const form = useForm<PostFormValues>({ resolver: zodResolver(postSchema), defaultValues: empty });
  const edit = (post?: Post) => { setEditing(post ?? null); form.reset(post ? { title: post.title, slug: post.slug, thumbnail: post.thumbnail ?? "", description: post.description ?? "", content: post.content, excerpt: post.excerpt ?? "", published: post.published, publishedAt: dateValue(post.publishedAt), category: post.category } : empty); setOpen(true); };
  const submit = async (value: PostFormValues) => { setBusy(true); try { if (editing) await updatePost(editing.id, value); else await createPost(value); toast.success("Post berhasil disimpan"); setOpen(false); router.refresh(); } catch (error) { toast.error(error instanceof Error ? error.message : "Post tidak dapat disimpan"); } finally { setBusy(false); } };
  const remove = async (id: number) => { if (!confirm("Hapus post ini?")) return; try { await deletePost(id); toast.success("Post berhasil dihapus"); router.refresh(); } catch (error) { toast.error(error instanceof Error ? error.message : "Post tidak dapat dihapus"); } };
  const publish = async (post: Post) => { try { await togglePublish(post.id); toast.success(post.published ? "Post dibatalkan publikasinya" : "Post berhasil dipublikasikan"); router.refresh(); } catch (error) { toast.error(error instanceof Error ? error.message : "Status post tidak dapat diubah"); } };

  return <>
    <div className="flex justify-end"><Button onClick={() => edit()}><Plus className="mr-2 size-4" />Tambah Post</Button></div>
    <div className="overflow-x-auto rounded-md border"><table className="w-full text-sm"><thead><tr className="border-b bg-muted/50 text-left"><th className="p-3">Judul</th><th className="p-3">Kategori</th><th className="p-3">Status</th><th className="p-3 text-right">Aksi</th></tr></thead><tbody>
      {initialData.length ? initialData.map(post => <tr className="border-b" key={post.id}><td className="p-3"><p className="font-medium truncate">{post.title}</p><p className="text-xs text-muted-foreground truncate">/{post.slug}</p></td><td className="p-3">{post.category ? <Badge variant="outline">{categoryLabels[post.category]}</Badge> : <span className="text-muted-foreground">-</span>}</td><td className="p-3">{post.published ? <Badge><Eye className="mr-1 size-3" />Published</Badge> : <Badge variant="outline"><EyeOff className="mr-1 size-3" />Draft</Badge>}</td><td className="p-3 text-right"><div className="flex justify-end gap-2"><Button variant="outline" size="sm" onClick={() => edit(post)}><Pencil className="mr-1 size-3" />Edit</Button><Button variant="outline" size="sm" onClick={() => publish(post)}>{post.published ? <EyeOff className="mr-1 size-3" /> : <Eye className="mr-1 size-3" />}{post.published ? "Unpublish" : "Publish"}</Button><Button variant="destructive" size="sm" onClick={() => remove(post.id)}><Trash2 className="mr-1 size-3" />Hapus</Button></div></td></tr>) : <tr><td colSpan={4} className="h-24 text-center text-muted-foreground">Belum ada post.</td></tr>}
    </tbody></table></div>

    <Dialog open={open} onOpenChange={setOpen}><DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl"><DialogHeader><DialogTitle>{editing ? "Edit Post" : "Tambah Post"}</DialogTitle></DialogHeader><Form {...form}><form onSubmit={form.handleSubmit(submit)} className="flex flex-col gap-4">
      <FormField control={form.control} name="title" render={({ field }) => <FormItem><FormLabel>Judul</FormLabel><FormControl><Input {...field} placeholder="Masukkan judul post" /></FormControl><FormMessage /></FormItem>} />
      <FormField control={form.control} name="slug" render={({ field }) => <FormItem><FormLabel>Slug</FormLabel><FormControl><Input {...field} placeholder="judul-post" /></FormControl><FormMessage /></FormItem>} />
      <FormField control={form.control} name="category" render={({ field }) => <FormItem><FormLabel>Kategori</FormLabel><Select value={field.value ?? unset} onValueChange={value => field.onChange(value === unset ? null : value)}><FormControl><SelectTrigger><SelectValue placeholder="Pilih kategori" /></SelectTrigger></FormControl><SelectContent><SelectItem value={unset}>Tanpa kategori</SelectItem><SelectItem value="BERITA">Berita</SelectItem><SelectItem value="ARTIKEL">Artikel</SelectItem><SelectItem value="INFORMASI">Informasi</SelectItem></SelectContent></Select><FormMessage /></FormItem>} />
      <FormField control={form.control} name="thumbnail" render={({ field }) => <FormItem><FormLabel>Thumbnail (opsional)</FormLabel><FormControl><ThumbnailUpload value={field.value ?? ""} onChange={field.onChange} /></FormControl><FormMessage /></FormItem>} />
      <FormField control={form.control} name="description" render={({ field }) => <FormItem><FormLabel>Deskripsi (opsional)</FormLabel><FormControl><Textarea {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>} />
      <FormField control={form.control} name="content" render={({ field }) => <FormItem><FormLabel>Konten</FormLabel><FormControl><Textarea {...field} className="min-h-48 font-mono text-sm" /></FormControl><FormMessage /></FormItem>} />
      <FormField control={form.control} name="excerpt" render={({ field }) => <FormItem><FormLabel>Excerpt (opsional)</FormLabel><FormControl><Textarea {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>} />
      <div className="grid gap-4 sm:grid-cols-2"><FormField control={form.control} name="published" render={({ field }) => <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3"><div><FormLabel>Status</FormLabel><p className="text-sm text-muted-foreground">Tampilkan di halaman publik</p></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>} /><FormField control={form.control} name="publishedAt" render={({ field }) => <FormItem><FormLabel>Tanggal Publikasi</FormLabel><FormControl><Input type="datetime-local" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>} /></div>
      <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setOpen(false)}>Batal</Button><Button type="submit" disabled={busy}>{busy && <Loader2 className="mr-2 size-4 animate-spin" />}{busy ? "Menyimpan..." : "Simpan"}</Button></div>
    </form></Form></DialogContent></Dialog>
  </>;
}
