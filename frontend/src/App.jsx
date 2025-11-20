import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Moon,
  Sun,
  FileText,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import axios from "axios";
import UploadSection from "./components/UploadSection";
import ResultsDashboard from "./components/ResultsDashboard";
import ChatAssistant from "./components/ChatAssistant";
import "./styles/App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function App() {
  // Detect system theme preference
  const [darkMode, setDarkMode] = useState(() => {
    // Check if user prefers dark mode
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  });

  const [currentView, setCurrentView] = useState("upload"); // 'upload' | 'results'
  const [analysisData, setAnalysisData] = useState(null);
  const [uploadedFilename, setUploadedFilename] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async (file) => {
    setLoading(true);
    setError(null);
    setUploadedFilename(file.name);

    try {
      const formData = new FormData();
      formData.append("cv", file);

      console.log("📤 Uploading CV...");

      const response = await axios.post(`${API_URL}/api/analyse`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000, // 60 second timeout
      });

      console.log("✅ Analysis received!", response.data);

      setAnalysisData(response.data.analysis);
      setCurrentView("results");
    } catch (err) {
      console.error("❌ Upload error:", err);
      setError(
        err.response?.data?.error ||
          err.message ||
          "Unable to process this document. Please upload a valid CV in PDF or Word format."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setCurrentView("upload");
    setAnalysisData(null);
    setError(null);
  };

  return (
    <div className={`app ${darkMode ? "dark" : "light"}`}>
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <Sparkles className="logo-icon" />
            <h1>PrepCheck</h1>
          </div>

          <button
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <AnimatePresence mode="wait">
          {currentView === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <UploadSection
                onUpload={handleFileUpload}
                loading={loading}
                error={error}
              />
            </motion.div>
          )}

          {currentView === "results" && analysisData && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ResultsDashboard
                data={analysisData}
                filename={uploadedFilename}
                onBack={handleBack}
              />
              <ChatAssistant
                analysisContext={analysisData}
                darkMode={darkMode}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>Created by CloudCTRL • Built for job seekers</p>
      </footer>
    </div>
  );
}

export default App;
