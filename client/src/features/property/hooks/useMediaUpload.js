import { useState, useRef, useEffect } from "react";

export const useMediaUpload = (maxFiles = 12) => {
  const fileInputRef = useRef(null);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [error, setError] = useState(null);

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const total = mediaFiles.length + files.length;
    if (total > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed.`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setMediaFiles((prev) => [...prev, ...files]);

    const newPreviews = files.map((file) => ({
      url: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
      name: file.name,
      type: file.type,
      size: file.size,
    }));
    setFilePreviews((prev) => [...prev, ...newPreviews]);
    setError(null);
  };

  const removeFile = (index) => {
    setMediaFiles((prev) => {
      const next = [...prev];
      next.splice(index, 1);
      return next;
    });
    setFilePreviews((prev) => {
      const next = [...prev];
      if (next[index]?.url) URL.revokeObjectURL(next[index].url);
      next.splice(index, 1);
      return next;
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    return () => {
      filePreviews.forEach((file) => file.url && URL.revokeObjectURL(file.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { fileInputRef, mediaFiles, filePreviews, error, handleMediaChange, removeFile };
};