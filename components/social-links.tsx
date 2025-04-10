import { Github, Linkedin, Mail } from "lucide-react"

export default function SocialLinks() {
  return (
    <div className="flex gap-4 pt-2">
      <a
        href="https://github.com/yourusername"
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 transition-colors"
        aria-label="GitHub"
      >
        <Github size={20} />
      </a>
      <a
        href="https://linkedin.com/in/yourusername"
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 transition-colors"
        aria-label="LinkedIn"
      >
        <Linkedin size={20} />
      </a>
      <a
        href="mailto:contact@example.com"
        className="p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 transition-colors"
        aria-label="Email"
      >
        <Mail size={20} />
      </a>
    </div>
  )
}
