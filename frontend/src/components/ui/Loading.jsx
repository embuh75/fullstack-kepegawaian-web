import React from "react";

export default function Loading({
  gif = "/loading.gif",
  text = "Memuat...",
  subtext = "Harap tunggu sebentar...",
  progress = null,
}) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[300px] p-4 text-center">
      {/* 1. Gambar GIF */}
      <div className="relative mb-4">
        <img
          src={gif}
          alt="loading"
          className="w-32 h-32 object-contain animate-bounce"
        />
      </div>

      {/* 2. Teks */}
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 animate-pulse">
        {text}
      </h3>
      {subtext && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4">
          {subtext}
        </p>
      )}

      {/* 3. Animasi Progress Bar */}
      <div className="w-full max-w-xs bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
        {progress !== null ? (
          /* Mode Determinate (0 - 100%) */
          <div
            className="bg-blue-600 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        ) : (
          /* Mode Indeterminate / Infinite Pulsing Gradient */
          <div className="w-full h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 animate-pulse rounded-full" />
        )}
      </div>

      {/* Teks Persentase (Muncul jika prop progress diisi) */}
      {progress !== null && (
        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-2">
          {Math.round(progress)}%
        </span>
      )}
    </div>
  );
}
