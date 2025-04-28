// app/blog/[slug]/page.tsx
import { notFound } from "next/navigation"
import Navbar from "@/components/navbar"
import LoadingSpinner from "@/components/loading-spinner"
import BlogPostClient from "./BlogPostClient"
import { initializeApp } from "firebase/app"
import { getFirestore, doc, getDoc, collection, getDocs, type Timestamp } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Link } from "lucide-react"

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase
let app, db
try {
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

// Generate static parameters for SSG
export async function generateStaticParams() {
  if (!db) {
    console.error("Firestore not initialized for generateStaticParams")
    return []
  }

  try {
    const querySnapshot = await getDocs(collection(db, "blogPosts"))
    return querySnapshot.docs.map((doc) => ({
      slug: doc.id,
    }))
  } catch (error) {
    console.error("Error fetching blog post slugs:", error)
    return []
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  if (!db) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container pt-32 px-4 md:px-6 text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-500">Error</h1>
          <p className="text-red-700 mb-4">Firebase is not initialized. Cannot fetch post.</p>
        </div>
      </div>
    )
  }

  const { slug } = params

  try {
    const postRef = doc(db, "blogPosts", slug)
    const postSnap = await getDoc(postRef)

    if (!postSnap.exists()) {
      notFound()
    }

    const post = { id: postSnap.id, ...postSnap.data() } as BlogPost

    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <BlogPostClient post={post} />
      </div>
    )
  } catch (error) {
    console.error("Error fetching post:", error)
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container pt-32 px-4 md:px-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Post not found</h1>
          <p className="mb-8">Error loading post</p>
          <Button asChild>
            <Link href="/blog">Back to Blog</Link>
          </Button>
        </div>
      </div>
    )
  }
}