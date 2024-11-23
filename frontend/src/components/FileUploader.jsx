import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

const FileUploader = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [metadata, setMetadata] = useState(null);
  const [password, setPassword] = useState("");
  const [usePassword, setUsePassword] = useState(false);
  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (
      file?.type !==
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      setError("Please upload a .docx file");
      return;
    }
    setFile(file);
    setError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    multiple: false,
  });

  const validatePassword = (pass) => {
    if (pass.length < 4) {
      return "Password must be at least 4 characters long";
    }
    return null;
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    if (usePassword) {
      const passwordError = validatePassword(password);
      if (passwordError) {
        setError(passwordError);
        return;
      }
    }

    setError(null);
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("usePassword", usePassword.toString());
    if (usePassword) {
      formData.append("password", password);
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setMetadata(response.data.metadata);
      setFile(null); // Reset file selection
      setPassword(""); // Reset password
      setUsePassword(false); // Reset password protection option
    } catch (err) {
      console.error("Error uploading file:", err);
      setError(err.response?.data?.error || "File upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-purple-600 bg-purple-50"
            : "border-purple-300 hover:border-purple-500"
        }`}
      >
        <input {...getInputProps()} />
        <div className="space-y-2">
          {file ? (
            <p className="text-purple-700 font-medium">{file.name}</p>
          ) : (
            <>
              <p className="text-gray-700">
                Drag and drop a DOCX file here, or click to select
              </p>
              <p className="text-sm text-gray-500">
                Only .docx files are accepted
              </p>
            </>
          )}
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="passwordProtection"
            checked={usePassword}
            onChange={(e) => setUsePassword(e.target.checked)}
            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
          />
          <label htmlFor="passwordProtection" className="text-gray-700">
            Enable Password Protection
          </label>
        </div>

        {usePassword && (
          <div className="space-y-2">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter PDF password (minimum 4 characters)"
              className="w-full p-2 border rounded-md"
            />
          </div>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          onClick={handleUpload}
          disabled={uploading}
          className={`w-full py-2 rounded-md text-white font-medium ${
            uploading ? "bg-gray-400" : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          {uploading ? "Uploading..." : "Upload and Convert"}
        </button>
      </div>

      {metadata && (
        <div className="mt-6 space-y-4">
          <p className="text-lg font-medium">Conversion Complete</p>
          <p className="text-sm text-gray-600">File: {metadata.originalName}</p>
          <p className="text-sm text-gray-600">
            Converted: {metadata.convertedName}
          </p>
          {metadata.isProtected && (
            <p className="text-sm text-gray-600">Password protected</p>
          )}
          <a
            href={`${import.meta.env.VITE_BACKEND_URL}${metadata.downloadLink}`}
            download
            className="text-purple-600 hover:text-purple-800"
          >
            Download PDF
          </a>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
