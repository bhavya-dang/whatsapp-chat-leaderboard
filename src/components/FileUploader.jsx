import React from "react";

export default function FileUploader({ onFileUpload }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        console.log("Uploaded file content:", text); // Debug log
        onFileUpload(text);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="p-4 border-dashed border-2 border-gray-300 rounded-md">
      <input
        type="file"
        accept=".txt"
        onChange={handleFileChange}
        className="w-full p-2"
      />
    </div>
  );
}
