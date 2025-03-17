import React, { useState } from "react";
import { Upload } from "lucide-react";

interface FileUploadProps {
  onFileSelect: (content: string) => void;
}

export function FileUpload({ onFileSelect }: FileUploadProps) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [parseProgress, setParseProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [status, setStatus] = useState<string>("");

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    setStatus("Uploading...");

    const reader = new FileReader();
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        let progress = 0;
        const simulateUpload = setInterval(() => {
          progress += 10;
          if (progress > (event.loaded / event.total) * 100) {
            clearInterval(simulateUpload);
            setUploadProgress(Math.round((event.loaded / event.total) * 100));
          } else {
            setUploadProgress(progress);
          }
        }, 10000);
      }
    };

    reader.onload = async (event) => {
      const text = event.target?.result as string;

      setIsUploading(false);
      setIsParsing(true);
      setStatus("Parsing...");
      setParseProgress(0);

      // Simulate parsing progress with dummy delay
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        setParseProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsParsing(false);
            setStatus("");
            onFileSelect(text);
          }, 500);
        }
      }, 100);
    };

    reader.readAsText(file);
  };

  return (
    <div className="w-full max-w-md mx-auto -mt-10 p-6">
      {isUploading || isParsing ? (
        <div className="w-full max-w-xs mx-auto">
          <p className="text-sm text-gray-600 mb-2 text-center">{status}</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{
                width: `${isUploading ? uploadProgress : parseProgress}%`,
              }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1 text-center">
            {isUploading ? uploadProgress : parseProgress}%
          </p>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-10 h-10 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500">WhatsApp chat export (.txt)</p>
          </div>
          <input
            type="file"
            className="hidden"
            accept=".txt"
            onChange={handleFileChange}
          />
        </label>
      )}
    </div>
  );
}
