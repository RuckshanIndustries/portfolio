// app/blog/[slug]/page.tsx
import { collection, getDocs, doc, getDoc, getFirestore } from "firebase/firestore"
import { initializeApp } from "firebase/app"
import { type Timestamp } from "firebase/firestore"
import BlogPostContent from "./BlogPostContent"

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
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

export async function generateStaticParams() {
  // Check if all required Firebase config values are present
  const allConfigPresent = Object.values(firebaseConfig).every((value) => !!value)
  if (!allConfigPresent) {
    console.error("Missing Firebase configuration values")
    return []
  }

  try {
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)
    const querySnapshot = await getDocs(collection(db, "blogPosts"))
    
    return querySnapshot.docs.map((doc) => ({
      slug: doc.id,
    }))
  } catch (error) {
    console.error("Error generating static params:", error)
    return []
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  // Check Firebase config before initializing
  const allConfigPresent = Object.values(firebaseConfig).every((value) => !!value)
  if (!allConfigPresent) {
    throw new Error("Missing Firebase configuration values")
  }

  try {
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)
    const postRef = doc(db, "blogPosts", params.slug)
    const postSnap = await getDoc(postRef)

    if (!postSnap.exists()) {
      return { notFound: true }
    }

    const postData = postSnap.data() as BlogPost
    return <BlogPostContent 
      post={{ id: postSnap.id, ...postData }} 
      initialLikes={postData.likes || 0}
    />
  } catch (error) {
    console.error("Error in BlogPostPage:", error)
    return { notFound: true }
  }
}