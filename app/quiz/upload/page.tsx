"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import UploadQuizForm from "@/custom_components/UploadQuizForm";
import LoadingOverlay from "@/custom_components/LoadingOverlay";
import CreateQuizSidebar from "@/custom_components/CreateQuizSidebar";

export default function UploadQuizPage() {
  const [loading, setLoading] = useState<boolean>(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 px-6 pt-20 pb-20">
      <div className="max-w-6xl mx-auto space-y-8 mt-10">

        <motion.div 
        initial={{ opacity: 0, y: 8 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Upload a New Quiz</h1>
          <p className="text-gray-600 mt-1">Add past quizzes or exams to help the community study.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <LoadingOverlay show={loading} label="Uploading Quiz..."/>
          <UploadQuizForm setLoading={setLoading}></UploadQuizForm>
          
          <CreateQuizSidebar/>
        </div>
      </div>
    </div>
  );
}
