"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import AnimatedText from "@/components/animated-text"
import GlassmorphicPanel from "@/components/glassmorphic-panel"
import Navbar from "@/components/navbar"
import LoadingSpinner from "@/components/loading-spinner"
import { Calendar, User, Search, Plus, Info, AlertCircle } from "lucide-react"
import { initializeApp } from "firebase/app"
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore"
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth"

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
let app, db, auth
try {
  // Check if all required Firebase config values are present
  const allConfigPresent = Object.values(firebaseConfig).every((value) => !!value)

  if (allConfigPresent) {
    app = initializeApp(firebaseConfig)
    db = getFirestore(app)
    auth = getAuth(app)
  } else {
    console.error("Missing Firebase configuration values")
  }
} catch (error) {
  console.error("Firebase initialization error:", error)
}

// Types
interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
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
}

export default function BlogPage() {
  const [activeTag, setActiveTag] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [newPostDialogOpen, setNewPostDialogOpen] = useState(false)
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [disclaimerOpen, setDisclaimerOpen] = useState(true)
  const [userAuth, setUserAuth] = useState<any>(null)
  const [firebaseInitialized, setFirebaseInitialized] = useState(!!app)
  const router = useRouter()

  // New post form state
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    authorName: "",
    tags: "",
    isAnonymous: true,
    authorImage: "",
    authorLinks: {
      twitter: "",
      github: "",
      website: "",
    },
  })

  // Check if Firebase is initialized
  useEffect(() => {
    if (!firebaseInitialized) {
      try {
        app = initializeApp(firebaseConfig)
        db = getFirestore(app)
        auth = getAuth(app)
        setFirebaseInitialized(true)
      } catch (error) {
        console.error("Firebase initialization error:", error)
        setError("Failed to initialize Firebase. Please check your configuration.")
      }
    }
  }, [firebaseInitialized])

  // Tags from all posts
  const allTags = ["All", ...Array.from(new Set(posts.flatMap((post) => post.tags)))]

  // Authentication
  useEffect(() => {
    if (!firebaseInitialized || !auth) {
      setError("Firebase authentication is not initialized. Please check your configuration.")
      return () => {}
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserAuth(user)

      // If not authenticated, sign in anonymously
      if (!user) {
        signInAnonymously(auth).catch((error) => {
          console.error("Error signing in anonymously:", error)
          setError("Authentication error. Please try again later.")
        })
      }
    })

    return () => unsubscribe()
  }, [firebaseInitialized])

  // Get posts on first load
  useEffect(() => {
    if (firebaseInitialized) {
      fetchPosts()
    }
  }, [firebaseInitialized])

  // Fetch posts from Firestore
  const fetchPosts = async () => {
    if (!firebaseInitialized) return

    setLoading(true)
    try {
      // Create the collection if it doesn't exist by adding a dummy document
      try {
        const postsCollection = collection(db, "blogPosts")
        const querySnapshot = await getDocs(postsCollection)

        if (querySnapshot.empty) {
          // Collection doesn't exist or is empty, create a sample post
          await addDoc(postsCollection, {
            title: "Welcome to the Community Blog",
            content:
              "This is a platform for game developers and software engineers to share their knowledge and experiences.\n\nFeel free to create your own posts and engage with the community!",
            excerpt:
              "This is a platform for game developers and software engineers to share their knowledge and experiences.",
            authorName: "Admin",
            tags: ["Welcome", "Getting Started"],
            createdAt: serverTimestamp(),
            isAnonymous: false,
            likes: 0,
          })
        }
      } catch (error) {
        console.error("Error checking/creating collection:", error)
      }

      const q = query(collection(db, "blogPosts"), orderBy("createdAt", "desc"))
      const querySnapshot = await getDocs(q)

      const fetchedPosts: BlogPost[] = []
      querySnapshot.forEach((doc) => {
        fetchedPosts.push({ id: doc.id, ...doc.data() } as BlogPost)
      })

      setPosts(fetchedPosts)
    } catch (error) {
      console.error("Error fetching posts:", error)
      setError("Failed to load posts. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  // Submit new post
  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!firebaseInitialized) {
      setError("Firebase is not initialized. Cannot submit post.")
      return
    }

    if (!newPost.title || !newPost.content) {
      alert("Please fill in at least title and content fields")
      return
    }

    try {
      // Convert tags string to array
      const tagsArray = newPost.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "")

      // Create excerpt from content
      const excerpt = newPost.content.substring(0, 150) + (newPost.content.length > 150 ? "..." : "")

      // Add post to Firestore
      await addDoc(collection(db, "blogPosts"), {
        title: newPost.title,
        content: newPost.content,
        excerpt,
        authorName: newPost.isAnonymous ? "Anonymous" : newPost.authorName || "Anonymous",
        authorImage: newPost.isAnonymous ? null : newPost.authorImage,
        authorLinks: newPost.isAnonymous
          ? null
          : {
              twitter: newPost.authorLinks.twitter,
              github: newPost.authorLinks.github,
              website: newPost.authorLinks.website,
            },
        tags: tagsArray,
        createdAt: serverTimestamp(),
        isAnonymous: newPost.isAnonymous,
        likes: 0,
      })

      // Close dialog and reset form
      setNewPostDialogOpen(false)
      setNewPost({
        title: "",
        content: "",
        authorName: "",
        tags: "",
        isAnonymous: true,
        authorImage: "",
        authorLinks: {
          twitter: "",
          github: "",
          website: "",
        },
      })

      // Refresh posts
      fetchPosts()
    } catch (error) {
      console.error("Error adding post:", error)
      alert("Error submitting post. Please try again.")
    }
  }

  // Filter posts by tag and search query
  const filteredPosts = posts.filter((post) => {
    const matchesTag = activeTag === "All" || post.tags.includes(activeTag)
    const matchesSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.authorName && post.authorName.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesTag && matchesSearch
  })

  // If there's an error initializing Firebase
  if (error && error.includes("Firebase")) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="pt-24">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl font-bold mb-6 text-red-500">Error</h1>
              <div className="bg-red-50 border border-red-200 rounded-md p-6 mb-8">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-700 mb-4">{error}</p>
                <p className="text-zinc-600 mb-6">
                  Please check your Firebase configuration and make sure all environment variables are set correctly.
                </p>
                <div className="text-left bg-zinc-100 p-4 rounded-md overflow-auto mb-6">
                  <p className="font-mono text-sm">
                    NEXT_PUBLIC_FIREBASE_API_KEY: {process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "✓" : "✗"}
                    <br />
                    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? "✓" : "✗"}
                    <br />
                    NEXT_PUBLIC_FIREBASE_PROJECT_ID: {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "✓" : "✗"}
                    <br />
                    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: {process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? "✓" : "✗"}
                    <br />
                    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:{" "}
                    {process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? "✓" : "✗"}
                    <br />
                    NEXT_PUBLIC_FIREBASE_APP_ID: {process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? "✓" : "✗"}
                    <br />
                  </p>
                </div>
                <Button asChild>
                  <Link href="/">Return to Home</Link>
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-white to-zinc-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-indigo-500">
                <AnimatedText text="Community Developer Blog" />
              </h1>
              <p className="text-xl text-zinc-600 mb-8">
                <AnimatedText
                  text="A platform for game and software developers to share insights, experiences, and knowledge."
                  delay={0.3}
                />
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => setNewPostDialogOpen(true)}
                  className="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white border-none flex items-center gap-2"
                  disabled={!firebaseInitialized}
                >
                  <Plus size={18} /> Create Post
                </Button>
                <Button variant="outline" onClick={() => setDisclaimerOpen(true)} className="flex items-center gap-2">
                  <Info size={18} /> Privacy Policy
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="py-8">
          <div className="container px-4 md:px-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={18} />
                <Input
                  placeholder="Search posts..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                {allTags.map((tag) => (
                  <Badge
                    key={tag}
                    className={`cursor-pointer px-3 py-1 text-sm font-medium transition-colors ${
                      activeTag === tag
                        ? "bg-sky-500 text-white hover:bg-sky-600"
                        : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                    }`}
                    onClick={() => setActiveTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Blog Posts List */}
        <section className="py-12">
          <div className="container px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              {loading ? (
                <div className="w-full flex justify-center py-12">
                  <LoadingSpinner />
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
                  <h3 className="text-xl font-medium text-zinc-700 mb-2">Error Loading Posts</h3>
                  <p className="text-zinc-500 mb-6">{error}</p>
                  <Button onClick={fetchPosts}>Try Again</Button>
                </div>
              ) : filteredPosts.length > 0 ? (
                <div className="space-y-12">
                  {filteredPosts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Link href={`/blog/${post.id}`} className="block">
                        <GlassmorphicPanel className="overflow-hidden hover:shadow-lg transition-all duration-300">
                          <div className="p-6">
                            <h2 className="text-2xl md:text-3xl font-bold text-zinc-800 mb-2">{post.title}</h2>
                            <div className="flex flex-wrap items-center gap-4 text-zinc-500 text-sm mb-4">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                {post.createdAt ? new Date(post.createdAt.toMillis()).toLocaleDateString() : "Recent"}
                              </div>
                              <div className="flex items-center">
                                <User className="w-4 h-4 mr-2" />
                                {post.isAnonymous ? "Anonymous" : post.authorName || "Anonymous"}
                              </div>
                            </div>
                            <p className="text-zinc-600 mb-4">{post.excerpt}</p>
                            <div className="flex flex-wrap gap-2">
                              {post.tags &&
                                post.tags.map((tag, i) => (
                                  <Badge key={i} className="bg-sky-100 text-sky-800 hover:bg-sky-200 border-none">
                                    {tag}
                                  </Badge>
                                ))}
                            </div>
                          </div>
                        </GlassmorphicPanel>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="mx-auto mb-4 h-12 w-12 text-zinc-300" />
                  <h3 className="text-xl font-medium text-zinc-700 mb-2">No posts found</h3>
                  <p className="text-zinc-500 mb-6">
                    {searchQuery ? "Try changing your search or filter" : "Be the first to share your knowledge!"}
                  </p>
                  <Button
                    onClick={() => setNewPostDialogOpen(true)}
                    className="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white border-none"
                    disabled={!firebaseInitialized}
                  >
                    Create Post
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* New Post Dialog */}
      <Dialog open={newPostDialogOpen} onOpenChange={setNewPostDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create a New Post</DialogTitle>
            <DialogDescription>Share your knowledge, experiences, or ideas with the community.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitPost} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-zinc-700 mb-1">
                  Title *
                </label>
                <Input
                  id="title"
                  placeholder="Your post title"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-zinc-700 mb-1">
                  Content *
                </label>
                <Textarea
                  id="content"
                  placeholder="Write your post content here..."
                  className="min-h-[200px]"
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  required
                />
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-zinc-700 mb-1">
                  Tags (comma-separated)
                </label>
                <Input
                  id="tags"
                  placeholder="e.g. Game Development, Unity, Tutorial"
                  value={newPost.tags}
                  onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isAnonymous"
                  className="rounded border-gray-300 mr-2"
                  checked={newPost.isAnonymous}
                  onChange={(e) => setNewPost({ ...newPost, isAnonymous: e.target.checked })}
                />
                <label htmlFor="isAnonymous" className="text-sm text-zinc-700">
                  Post anonymously
                </label>
              </div>

              {!newPost.isAnonymous && (
                <div className="space-y-4 border rounded-md p-4 bg-zinc-50">
                  <h4 className="font-medium text-zinc-800">Profile Information (Optional)</h4>

                  <div>
                    <label htmlFor="authorName" className="block text-sm font-medium text-zinc-700 mb-1">
                      Your Name
                    </label>
                    <Input
                      id="authorName"
                      placeholder="Your name"
                      value={newPost.authorName}
                      onChange={(e) => setNewPost({ ...newPost, authorName: e.target.value })}
                    />
                  </div>

                  <div>
                    <label htmlFor="authorImage" className="block text-sm font-medium text-zinc-700 mb-1">
                      Profile Image URL
                    </label>
                    <Input
                      id="authorImage"
                      placeholder="https://example.com/yourimage.jpg"
                      value={newPost.authorImage}
                      onChange={(e) => setNewPost({ ...newPost, authorImage: e.target.value })}
                    />
                  </div>

                  <div>
                    <label htmlFor="twitterLink" className="block text-sm font-medium text-zinc-700 mb-1">
                      Twitter URL
                    </label>
                    <Input
                      id="twitterLink"
                      placeholder="https://twitter.com/yourusername"
                      value={newPost.authorLinks.twitter}
                      onChange={(e) =>
                        setNewPost({
                          ...newPost,
                          authorLinks: { ...newPost.authorLinks, twitter: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div>
                    <label htmlFor="githubLink" className="block text-sm font-medium text-zinc-700 mb-1">
                      GitHub URL
                    </label>
                    <Input
                      id="githubLink"
                      placeholder="https://github.com/yourusername"
                      value={newPost.authorLinks.github}
                      onChange={(e) =>
                        setNewPost({
                          ...newPost,
                          authorLinks: { ...newPost.authorLinks, github: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div>
                    <label htmlFor="websiteLink" className="block text-sm font-medium text-zinc-700 mb-1">
                      Personal Website
                    </label>
                    <Input
                      id="websiteLink"
                      placeholder="https://yourwebsite.com"
                      value={newPost.authorLinks.website}
                      onChange={(e) =>
                        setNewPost({
                          ...newPost,
                          authorLinks: { ...newPost.authorLinks, website: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setNewPostDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white border-none"
              >
                Publish Post
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Privacy Disclaimer Dialog */}
      <Dialog open={disclaimerOpen} onOpenChange={setDisclaimerOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Privacy Policy</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-md bg-amber-50 p-4 border border-amber-200">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-amber-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-amber-800">Important Disclaimer</h3>
                  <div className="mt-2 text-sm text-amber-700">
                    <p>
                      This blog platform is open to everyone. Users may choose to post anonymously or include personal
                      details at their own discretion. I am not responsible for any shared content or personal
                      information disclosed by contributors.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-zinc-600">
              When you create a post, the following information may be collected and stored:
            </p>

            <ul className="list-disc pl-5 text-zinc-600 space-y-1">
              <li>Post content (title, body, tags)</li>
              <li>Optional author information (if not posted anonymously)</li>
              <li>Timestamp of post creation</li>
            </ul>

            <p className="text-zinc-600">By using this platform, you agree to:</p>

            <ul className="list-disc pl-5 text-zinc-600 space-y-1">
              <li>Not post content that violates any laws or regulations</li>
              <li>Not post offensive, discriminatory, or harassing content</li>
              <li>Take responsibility for the information you choose to share</li>
            </ul>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setDisclaimerOpen(false)}
              className="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white border-none"
            >
              I Understand
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
