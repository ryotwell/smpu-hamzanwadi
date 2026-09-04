import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PostsClient from "./posts-client";

export default async function PostsPage() {
  const posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" } });
  return <div className="mx-auto flex w-full max-w-7xl flex-col gap-6"><div><h1 className="text-2xl font-bold tracking-tight">Manajemen Post</h1><p className="text-muted-foreground">Kelola berita, artikel, dan informasi sekolah.</p></div><Card><CardHeader><CardTitle>Daftar Post</CardTitle><CardDescription>{posts.length} post ditemukan.</CardDescription></CardHeader><CardContent className="flex flex-col gap-4"><PostsClient initialData={posts} /></CardContent></Card></div>;
}
