const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

/**
 * Parse CV file and extract text
 * @param {Object} file - Multer file object
 * @returns {Promise<string>} - Extracted text
 */
async function parseCV(file) {
  const mimeType = file.mimetype;

  try {
    if (mimeType === "application/pdf") {
      return await parsePDF(file.buffer);
    } else if (
      mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return await parseDOCX(file.buffer);
    } else {
      throw new Error("Unsupported file type");
    }
  } catch (error) {
    console.error("Parse error:", error);
    throw new Error(`Failed to parse CV: ${error.message}`);
  }
}

/**
 * Parse PDF file
 */
async function parsePDF(buffer) {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    throw new Error(
      "Failed to parse PDF. Ensure it contains readable text (not just images)."
    );
  }
}

/**
 * Parse DOCX file
 */
async function parseDOCX(buffer) {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    throw new Error("Failed to parse DOCX file.");
  }
}

module.exports = { parseCV };
