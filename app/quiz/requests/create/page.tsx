"use client";

import { useState } from "react";
import { motion } from "framer-motion"
import LoadingOverlay from "@/custom_components/LoadingOverlay";
import CreateQuizRequestForm from "@/custom_components/CreateQuizRequestForm";

export default function CreateRequestPage() {
  const [loadind, setLoading] = useState<boolean>(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 px-6 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}

        className="max-w-3xl mx-auto mt-12">

        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Create a Quiz Request
        </h1>

        <LoadingOverlay show={loadind} label="Submitting Request"/>
        <CreateQuizRequestForm setLoading={setLoading}/>
      </motion.div>
    </div>
  );
}