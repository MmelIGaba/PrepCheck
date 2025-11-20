require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { parseCV } = require("./utils/cvParser");
const { analyseCV } = require("./utils/aiAnalyser");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Configure file upload (store in memory)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF and DOCX files are allowed!"));
    }
  },
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running!" });
});

// CV Upload and Analysis endpoint 
app.post("/api/analyse", upload.single("cv"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log(`📄 Processing file: ${req.file.originalname}`);

    // Extract text from CV
    const cvText = await parseCV(req.file);

    if (!cvText || cvText.trim().length < 50) {
      return res.status(400).json({
        error:
          "Unable to process this document. Please upload a valid CV/Resume in PDF or Word format.",
      });
    }

    console.log(`✅ Extracted ${cvText.length} characters`);

    // Get optional questionnaire data
    const questionnaire = req.body.questionnaire
      ? JSON.parse(req.body.questionnaire)
      : {};

    // Analyse with AI
    console.log("🤖 Sending to AI for analysis...");
    const analysis = await analyseCV(cvText, questionnaire);

    console.log("✨ Analysis complete!");

    res.json({
      success: true,
      filename: req.file.originalname,
      analysis,
    });
  } catch (error) {
    console.error("❌ Error:", error.message);

    // Check if it's a CV validation error
    if (
      error.message.includes("not appear to be a CV") ||
      error.message.includes("not a resume")
    ) {
      return res.status(400).json({
        error: error.message,
        type: "invalid_cv",
      });
    }

    res.status(500).json({
      error:
        "Unable to process this document. Please upload a valid CV/Resume in PDF or Word format.",
      details: error.message,
    });
  }
});

// Chat endpoint (bonus feature)
app.post("/api/chat", async (req, res) => {
  try {
    const { message, conversationHistory, context } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Import chat handler
    const { handleChat } = require("./utils/aiAnalyser");
    const response = await handleChat(message, conversationHistory, context);

    res.json({ success: true, response });
  } catch (error) {
    console.error("❌ Chat error:", error.message);
    res.status(500).json({
      error: "Chat failed",
      details: error.message,
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ error: "File too large. Max size is 10MB." });
    }
  }
  res.status(500).json({ error: error.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
