"use client";

import { motion } from "framer-motion";
import BrowseQuizForm from "@/custom_components/BrowseQuizForm";

export default function Browse() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 px-6 pt-20 pb-20 z-0">
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="max-w-6xl mx-auto flex flex-col items-center mt-16">

                <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
                    Browse Past Exams
                </h1>

                <BrowseQuizForm></BrowseQuizForm>
            </motion.div>

        </div>

    )
}
