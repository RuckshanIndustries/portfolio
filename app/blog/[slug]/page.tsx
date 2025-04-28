"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import GlassmorphicPanel from "@/components/glassmorphic-panel"
import Navbar from "@/components/navbar"
import LoadingSpinner from "@/components/loading-spinner"
import { Calendar, ArrowLeft, Share, Github, Twitter, Globe, HeartIcon, AlertCircle } from "lucide-react"
import { initializeApp } from "firebase/app"
import { getFirestore, doc, getDoc, type Timestamp, updateDoc, increment } from "firebase/firestore"

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase - with error handling
let app, db
try {
  // Check if all required Firebase config values are present
  const allConfigPresent = Object.values(firebaseConfig).every((value) => !!value)

  if (allConfigPresent) {
    app = initializeApp(firebaseConfig)
    db = getFirestore(app)
  } else {
    console.error("Missing Firebase configuration values")
  }
} catch (error) {
  console.error("Firebase initialization error:", error)
}

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
  createdAt: Timestamp
  isAnonymous: boolean
  likes?: number
}

export default function BlogPostPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [liked, setLiked] = useState(false)
  const [firebaseInitialized, setFirebaseInitialized] = useState(!!app)

  // Check if Firebase is initialized
  useEffect(() => {
    let isMounted = true // Add a flag to track component mount status

    const initializeFirebase = async () => {
      if (!firebaseInitialized) {
        try {
          app = initializeApp(firebaseConfig)
          db = getFirestore(app)
          if (isMounted) {
            setFirebaseInitialized(true)
          }
        } catch (error) {
          console.error("Firebase initialization error:", error)
          if (isMounted) {
            setError("Failed to initialize Firebase. Please check your configuration.")
          }
        }
      }
    }

    initializeFirebase()

    return () => {
      isMounted = false // Set the flag to false when the component unmounts
    }
  }, [firebaseInitialized])

  useEffect(() => {
    if (slug && firebaseInitialized) {
      fetchPost(slug)
    }
  }, [slug, firebaseInitialized])

  const fetchPost = async (postId: string) => {
    if (!firebaseInitialized) {
      setError("Firebase is not initialized. Cannot fetch post.")
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const postRef = doc(db, "blogPosts", postId)
      const postSnap = await getDoc(postRef)

      if (postSnap.exists()) {
        setPost({ id: postSnap.id, ...postSnap.data() } as BlogPost)
      } else {
        setError("Post not found")
      }
    } catch (err) {
      console.error("Error fetching post:", err)
      setError("Error loading post")
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async () => {
    if (!post || liked || !firebaseInitialized) return

    try {
      const postRef = doc(db, "blogPosts", post.id)
      await updateDoc(postRef, {
        likes: increment(1),
      })

      // Update local state
      setPost((prev) => (prev ? { ...prev, likes: (prev.likes || 0) + 1 } : null))
      setLiked(true)

      // Store in localStorage to prevent multiple likes
      localStorage.setItem(`liked_${post.id}`, "true")
    } catch (error) {
      console.error("Error liking post:", error)
    }
  }

  // Check if user already liked this post
  useEffect(() => {
    if (post?.id) {
      const hasLiked = localStorage.getItem(`liked_${post.id}`) === "true"
      setLiked(hasLiked)
    }
  }, [post?.id])

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

  // If there's an error initializing Firebase
  if (error && error.includes("Firebase")) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container pt-32 px-4 md:px-6 text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-500">Error</h1>
          <div className="bg-red-50 border border-red-200 rounded-md p-6 mb-8">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-700 mb-4">{error}</p>
            <p className="text-zinc-600 mb-6">
              Please check your Firebase configuration and make sure all environment variables are set correctly.
            </p>
            <Button asChild>
              <Link href="/blog">Back to Blog</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container pt-32 px-4 md:px-6 flex justify-center">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container pt-32 px-4 md:px-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Post not found</h1>
          <p className="mb-8">{error || "The blog post you're looking for doesn't exist."}</p>
          <Button asChild>
            <Link href="/blog">Back to Blog</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Format the content with proper paragraphs
  const formattedContent = post.content.split("\n\n").map((paragraph, i) => (
    <p key={i} className="mb-4">
      {paragraph}
    </p>
  ))

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

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
                        {post.createdAt ? new Date(post.createdAt.toMillis()).toLocaleDateString() : "Recent"}
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
