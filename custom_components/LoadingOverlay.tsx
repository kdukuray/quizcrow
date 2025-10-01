"use client";

import { motion, AnimatePresence } from "framer-motion";

type LoadingOverlayProps = {
  show: boolean;
  label?: string;
  sublabel?: string;
};

export default function LoadingOverlay({ show, label = "Working…", sublabel }: LoadingOverlayProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="absolute inset-0 z-40 bg-white/70 backdrop-blur-sm"
          aria-live="assertive"
          aria-busy="true"
          role="status"
        >
          <div className="absolute inset-0 grid place-items-center p-6">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center gap-3 rounded-2xl border bg-white/90 px-6 py-5 shadow-sm"
            >
              {/* spinner */}
              <div
                className="h-12 w-12 rounded-full border-4 border-blue-600/80 border-t-transparent animate-spin"
                aria-hidden="true"
              />
              <div className="text-center">
                <p className="text-sm font-medium text-gray-900">{label}</p>
                {sublabel ? (
                  <p className="text-xs text-gray-600 mt-0.5">{sublabel}</p>
                ) : null}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
