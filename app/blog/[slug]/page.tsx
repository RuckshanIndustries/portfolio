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

// In your page.tsx
export async function generateStaticParams() {
  const requiredConfig = [
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  ];

  if (requiredConfig.some(value => !value)) {
    throw new Error(`
      Missing Firebase configuration values!
      Check that all required environment variables are set:
      ${JSON.stringify(requiredConfig, null, 2)}
    `);
  }

  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const querySnapshot = await getDocs(collection(db, "blogPosts"));

    return querySnapshot.docs.map((doc) => ({
      slug: doc.id,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    throw new Error("Failed to generate static params due to Firebase error");
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
      post={{
        id: postSnap.id,
        ...postData,
        // Convert Firestore Timestamp to milliseconds
        createdAt: postData.createdAt.toMillis()
      }}
      initialLikes={postData.likes || 0}
    />
  } catch (error) {
    console.error("Error in BlogPostPage:", error)
    return { notFound: true }
  }
}