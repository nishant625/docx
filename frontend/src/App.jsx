import React from "react";
import FileUploader from "./components/FileUploader";
import "./index.css";

const App = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center p-4">
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
      <h1 className="text-2xl font-semibold text-purple-700 mb-4">
        DOCX to PDF Converter
      </h1>
      <FileUploader />
    </div>
  </div>
);

export default App;
