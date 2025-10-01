"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    closed: { height: 0, opacity: 0, transition: { when: "afterChildren" as const } },
    open: {
      height: "auto",
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 260,
        damping: 26,
        when: "beforeChildren" as const,
        staggerChildren: 0.05,
      },
    },
  } satisfies Variants;

  const itemVariants = {
    closed: { y: prefersReducedMotion ? 0 : -8, opacity: 0 },
    open: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 300, damping: 24 },
    },
  } satisfies Variants;

  return (
    <nav className="shadow-sm h-20 border-b-2 fixed w-full bg-white z-50">
      <div className="container mx-auto flex items-center justify-between px-6 h-20">

        {/* logo */}
        <div className="flex items-center">
          <Link href="/" className="cursor-pointer">
            <Image src="/quizcrow-logo.png" alt="quizcrow-logo" width={110} height={85} />
          </Link>
        </div>

        {/* desktop Links */}
        <div className="hidden md:flex space-x-8 text-lg font-medium items-center">
          <Link href="/"><p className="cursor-pointer hover:text-blue-600 transition">Home</p></Link>
          <Link href="/quiz/browse"><p className="cursor-pointer hover:text-blue-600 transition">Browse</p></Link>
          <Link href="/quiz/upload"><p className="cursor-pointer hover:text-blue-600 transition">Upload</p></Link>
          <Link href="/quiz/requests?pageNumber=1"><p className="cursor-pointer hover:text-blue-600 transition">Requests</p></Link>
          <Link href="/faq"><p className="cursor-pointer hover:text-blue-600 transition">FAQ</p></Link>
          {/* uncomment this when user auth is implemented */}
          {/* <Image className="cursor-pointer" src="/user_icon.png" alt="user icon" width={35} height={35} /> */}
        </div>

        {/* mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          aria-expanded={isOpen}
          aria-controls="mobile-nav"
          onClick={() => setIsOpen((v) => !v)}
        >
          <motion.span
            key={isOpen ? "x" : "menu"}
            initial={{ rotate: 0, opacity: 0 }}
            animate={{ rotate: isOpen ? 90 : 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="inline-flex"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </motion.span>
        </button>
      </div>

      {/* mobile dropdown */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id="mobile-nav"
            key="mobile-menu"
            initial="closed"
            animate="open"
            exit="closed"
            variants={containerVariants}
            className="md:hidden overflow-hidden bg-white border-t shadow"
          >
            <motion.div className="flex flex-col px-6 py-4 text-base font-medium">
              {[
                { href: "/", label: "Home" },
                { href: "/quiz/browse", label: "Browse" },
                { href: "/quiz/upload", label: "Upload" },
                { href: "/quiz/requests", label: "Requests" },
                { href: "/faq", label: "FAQ" },
              ].map((item) => (
                <motion.div key={item.href} variants={itemVariants}>
                  <Link
                    href={item.href}
                    className="block py-2 hover:text-blue-600"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div variants={itemVariants} className="pt-2">
                {/* uncomment this when user auth is implemented */}
                {/* <Image className="cursor-pointer" src="/user_icon.png" alt="user icon" width={35} height={35} /> */}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
