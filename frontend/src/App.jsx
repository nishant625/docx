// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import FileUploader from './components/FileUploader';
import About from './pages/About';

const Home = () => (
  <div className="bg-gray-50 min-h-screen flex items-center justify-center">
    <div className="max-w-xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Welcome to MyApp</h1>
      <FileUploader />
    </div>
  </div>
);

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
};

export default App;
