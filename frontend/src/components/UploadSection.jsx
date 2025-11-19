import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, AlertCircle, Loader } from 'lucide-react';

function UploadSection({ onUpload, loading, error }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!validTypes.includes(file.type)) {
      alert('Please upload a PDF or DOCX file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
  };

  const handleSubmit = () => {
    if (selectedFile && !loading) {
      onUpload(selectedFile);
    }
  };

  return (
    <div className="upload-container">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="upload-header"
      >
        <h2>Analyse Your CV with AI</h2>
        <p>Upload your CV and get instant insights, scores, and personalised recommendations</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="upload-card"
      >
        <div
          className={`dropzone ${dragActive ? 'active' : ''} ${selectedFile ? 'has-file' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx"
            onChange={handleChange}
            style={{ display: 'none' }}
          />

          {!selectedFile ? (
            <>
              <div className="upload-icon">
                <Upload size={48} />
              </div>
              <h3>Drop your CV here or click to browse</h3>
              <p className="upload-hint">Supports PDF and DOCX • Max 10MB</p>
            </>
          ) : (
            <>
              <div className="file-preview">
                <FileText size={48} />
                <div className="file-info">
                  <p className="file-name">{selectedFile.name}</p>
                  <p className="file-size">
                    {(selectedFile.size / 1024).toFixed(0)} KB
                  </p>
                </div>
              </div>
              <button 
                className="change-file-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                }}
              >
                Change File
              </button>
            </>
          )}
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="error-message"
          >
            <AlertCircle size={20} />
            <span>{error}</span>
          </motion.div>
        )}

        <button
          className="analyze-btn"
          onClick={handleSubmit}
          disabled={!selectedFile || loading}
        >
          {loading ? (
            <>
              <Loader className="spinner" size={20} />
              Analysing...
            </>
          ) : (
            <>
              <FileText size={20} />
              Analyse My CV
            </>
          )}
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="features"
      >
        <div className="feature">
          <div className="feature-icon">📊</div>
          <h4>Detailed Scoring</h4>
          <p>Get scored across 5 key areas</p>
        </div>
        <div className="feature">
          <div className="feature-icon">💡</div>
          <h4>Smart Recommendations</h4>
          <p>Actionable tips to improve</p>
        </div>
        <div className="feature">
          <div className="feature-icon">⚡</div>
          <h4>Instant Results</h4>
          <p>Analysis in under 30 seconds</p>
        </div>
      </motion.div>
    </div>
  );
}

export default UploadSection;