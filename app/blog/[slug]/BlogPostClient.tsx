// app/blog/[slug]/BlogPostClient.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import GlassmorphicPanel from "@/components/glassmorphic-panel"
import { Calendar, ArrowLeft, Share, Github, Twitter, Globe, HeartIcon } from "lucide-react"
import { doc, updateDoc, increment } from "firebase/firestore"
import { db } from "@/lib/firebase" // Ensure you export `db` from your Firebase config

interface BlogPost {
  id: string
  title: string
  content: string
  authorName: string
  authorImage?: string
  authorLinks?: {
    twitter?: string
    github?: string
    website?: string
  }
  tags: string[]
  createdAt: { seconds: number; nanoseconds: number }
  isAnonymous: boolean
  likes?: number
}

export default function BlogPostClient({ post }: { post: BlogPost }) {
  const [copied, setCopied] = useState(false)
  const [liked, setLiked] = useState(false)

  // Check if user already liked this post
  useEffect(() => {
    if (post?.id) {
      const hasLiked = localStorage.getItem(`liked_${post.id}`) === "true"
      setLiked(hasLiked)
    }
  }, [post?.id])

  const handleLike = async () => {
    if (!post || liked) return

    try {
      const postRef = doc(db, "blogPosts", post.id)
      await updateDoc(postRef, {
        likes: increment(1),
      })

      setLiked(true)
      localStorage.setItem(`liked_${post.id}`, "true")
    } catch (error) {
      console.error("Error liking post:", error)
    }
  }

  const handleShareClick = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title || "Blog Post",
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formattedContent = post.content.split("\n\n").map((paragraph, i) => (
    <p key={i} className="mb-4">
      {paragraph}
    </p>
  ))

  return (
    <div className="min-h-screen bg-white">
      <main className="pt-24">
        <article className="py-16">
          <div className="container px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <Link href="/blog" className="inline-flex items-center text-sky-500 hover:text-sky-600 mb-8">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to all posts
              </Link>

              <GlassmorphicPanel className="p-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-6 text-zinc-800">{post.title}</h1>

                <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-zinc-100 pb-6">
                  <div className="flex items-center gap-4">
                    {!post.isAnonymous && post.authorImage ? (
                      <Avatar className="h-10 w-10 border border-zinc-200">
                        <AvatarImage src={post.authorImage} alt={post.authorName} />
                        <AvatarFallback>{post.authorName.charAt(0)}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <Avatar className="h-10 w-10 border border-zinc-200">
                        <AvatarFallback>A</AvatarFallback>
                      </Avatar>
                    )}

                    <div>
                      <p className="font-medium text-zinc-800">
                        {post.isAnonymous ? "Anonymous" : post.authorName || "Anonymous"}
                      </p>
                      <div className="flex items-center text-xs text-zinc-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {post.createdAt ? new Date(post.createdAt.seconds * 1000).toLocaleDateString() : "Recent"}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1 text-zinc-600"
                      onClick={handleLike}
                      disabled={liked}
                    >
                      <HeartIcon size={16} className={liked ? "fill-rose-500 text-rose-500" : ""} />
                      {post.likes || 0}
                    </Button>

                    <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={handleShareClick}>
                      <Share size={16} />
                      {copied ? "Copied!" : "Share"}
                    </Button>
                  </div>
                </div>

                <div className="prose prose-zinc max-w-none mb-8">{formattedContent}</div>

                <div className="flex flex-wrap gap-2 mb-8">
                  {post.tags &&
                    post.tags.map((tag, i) => (
                      <Link href={`/blog?tag=${tag}`} key={i}>
                        <Badge className="bg-sky-100 text-sky-800 hover:bg-sky-200 border-none">{tag}</Badge>
                      </Link>
                    ))}
                </div>

                {!post.isAnonymous && post.authorLinks && (
                  <div className="border-t border-zinc-100 pt-6 mt-8">
                    <h3 className="text-sm font-medium text-zinc-800 mb-4">Connect with the author:</h3>
                    <div className="flex gap-4">
                      {post.authorLinks.github && (
                        <a
                          href={post.authorLinks.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 transition-colors"
                        >
                          <Github size={18} />
                        </a>
                      )}
                      {post.authorLinks.twitter && (
                        <a
                          href={post.authorLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 transition-colors"
                        >
                          <Twitter size={18} />
                        </a>
                      )}
                      {post.authorLinks.website && (
                        <a
                          href={post.authorLinks.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 transition-colors"
                        >
                          <Globe size={18} />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </GlassmorphicPanel>
            </div>
          </div>
        </article>
      </main>
    </div>
  )
}