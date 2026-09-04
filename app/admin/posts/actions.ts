"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { postSchema, type PostFormValues } from "./schema";
import { unlink } from "fs/promises";
import path from "path";
async function removeThumbnail(value: string | null | undefined) { if (!value?.startsWith("/uploads/")) return; try { await unlink(path.join(process.cwd(), "public", value)); } catch (error) { console.error("Gagal menghapus thumbnail:", error); } }
const data = (v: PostFormValues) => ({ title: v.title, slug: v.slug, thumbnail: v.thumbnail || null, description: v.description || null, content: v.content, excerpt: v.excerpt || null, published: v.published, publishedAt: v.publishedAt ? new Date(v.publishedAt) : null, category: v.category || null });
export async function createPost(input: PostFormValues) { await prisma.post.create({ data: data(postSchema.parse(input)) }); revalidatePath("/admin/posts"); }
export async function updatePost(id: number, input: PostFormValues) { const v = postSchema.parse(input); const old = await prisma.post.findUnique({ where: { id }, select: { thumbnail: true } }); if (old?.thumbnail && old.thumbnail !== v.thumbnail) await removeThumbnail(old.thumbnail); await prisma.post.update({ where: { id }, data: data(v) }); revalidatePath("/admin/posts"); }
export async function deletePost(id: number) { const post = await prisma.post.findUnique({ where: { id }, select: { thumbnail: true } }); if (post?.thumbnail) await removeThumbnail(post.thumbnail); await prisma.post.delete({ where: { id } }); revalidatePath("/admin/posts"); }
export async function togglePublish(id: number) { const post = await prisma.post.findUnique({ where: { id }, select: { published: true } }); if (!post) throw new Error("Post not found"); await prisma.post.update({ where: { id }, data: { published: !post.published, publishedAt: !post.published ? new Date() : null } }); revalidatePath("/admin/posts"); }
