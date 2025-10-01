import Link from "next/link";
export default function Footer(){

    return (
        <footer className="border-t bg-white/70">
        <div className="container mx-auto px-6 py-8 text-sm text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} QuizCrow. Built by students for students.</p>
          <div className="flex items-center gap-4">
            <Link href="/faq" className="hover:text-foreground">FAQ</Link>
            <Link href="/quiz/requests" className="hover:text-foreground">Requests</Link>
            <Link href="/quiz/upload" className="hover:text-foreground">Upload</Link>
          </div>
        </div>
      </footer>
    )
}