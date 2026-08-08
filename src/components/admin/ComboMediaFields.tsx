"use client";

import { useEffect, useRef, useState } from "react";
import { comboImageUrl } from "@/lib/comboImages";

type Props = {
  label?: string;
  currentImage?: string | null;
  currentVideoUrl?: string | null;
  disabled?: boolean;
  onImageFile: (file: File | null) => void;
  onVideoFile: (file: File | null) => void;
};

export default function ComboMediaFields({
  label,
  currentImage,
  currentVideoUrl,
  disabled,
  onImageFile,
  onVideoFile,
}: Props) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoName, setVideoName] = useState<string | null>(null);

  const displayImage = imagePreview ?? (currentImage ? comboImageUrl(currentImage) : null);

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  function pickImage(file: File | null) {
    if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    if (!file) {
      setImagePreview(null);
      onImageFile(null);
      return;
    }
    setImagePreview(URL.createObjectURL(file));
    onImageFile(file);
  }

  function pickVideo(file: File | null) {
    if (!file) {
      setVideoName(null);
      onVideoFile(null);
      return;
    }
    setVideoName(file.name);
    onVideoFile(file);
  }

  return (
    <div className="space-y-4">
      {label ? <p className="text-sm font-semibold text-gray-200">{label}</p> : null}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="shrink-0">
          <div className="h-28 w-28 rounded-xl overflow-hidden border border-gray-800 bg-black flex items-center justify-center">
            {displayImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={displayImage} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="text-xs text-gray-500 px-2 text-center">No photo</span>
            )}
          </div>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            disabled={disabled}
            onChange={(e) => pickImage(e.target.files?.[0] ?? null)}
          />
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={disabled}
              onClick={() => imageInputRef.current?.click()}
              className="text-xs font-semibold text-sigaYellow border border-sigaYellow/40 rounded-lg px-3 py-1.5 hover:bg-sigaYellow/10 disabled:opacity-40"
            >
              {displayImage ? "Replace photo" : "Upload photo"}
            </button>
            {imagePreview ? (
              <button
                type="button"
                disabled={disabled}
                onClick={() => {
                  pickImage(null);
                  if (imageInputRef.current) imageInputRef.current.value = "";
                }}
                className="text-xs text-gray-400 hover:text-white disabled:opacity-40"
              >
                Clear pick
              </button>
            ) : null}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 mb-2">Package video (optional, MP4/WebM/MOV, max 100 MB)</p>
          {currentVideoUrl && !videoName ? (
            <video
              src={currentVideoUrl}
              controls
              className="w-full max-w-md rounded-lg border border-gray-800 mb-2 max-h-40"
            />
          ) : null}
          <input
            ref={videoInputRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            className="hidden"
            disabled={disabled}
            onChange={(e) => pickVideo(e.target.files?.[0] ?? null)}
          />
          <div className="flex flex-wrap gap-2 items-center">
            <button
              type="button"
              disabled={disabled}
              onClick={() => videoInputRef.current?.click()}
              className="text-xs font-semibold text-white border border-gray-700 rounded-lg px-3 py-1.5 hover:border-gray-500 disabled:opacity-40"
            >
              {currentVideoUrl || videoName ? "Replace video" : "Upload video"}
            </button>
            {videoName ? <span className="text-xs text-gray-400 truncate max-w-[200px]">{videoName}</span> : null}
            {videoName ? (
              <button
                type="button"
                disabled={disabled}
                onClick={() => {
                  pickVideo(null);
                  if (videoInputRef.current) videoInputRef.current.value = "";
                }}
                className="text-xs text-gray-400 hover:text-white disabled:opacity-40"
              >
                Clear pick
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
