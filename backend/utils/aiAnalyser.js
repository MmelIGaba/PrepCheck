const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialise Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Validate if the document is actually a CV/Resume
 * @param {string} text - Extracted document text
 * @returns {Promise<Object>} - Validation result
 */
async function validateCV(text) {
  const validationPrompt = `You are a CV/Resume validator. Analyse the following text and determine if it is a CV/Resume or not.

A CV/Resume typically contains:
- Personal information (name, contact details)
- Work experience or employment history
- Education or qualifications
- Skills (technical or soft skills)
- Professional summary or objective

The text should NOT be:
- A random document
- A cover letter only
- An article or essay
- A form or application
- Any other non-CV document

TEXT TO VALIDATE:
${text.substring(0, 2000)}

Return ONLY a JSON object:
{
  "isCV": true/false,
  "confidence": "high"/"medium"/"low",
  "reason": "Brief explanation of why this is or isn't a CV"
}`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(validationPrompt);
    const response = await result.response;
    const responseText = response.text();

    // Clean and parse response
    let cleanedText = responseText
      .trim()
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "");

    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedText = jsonMatch[0];
    }

    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("CV validation error:", error);
    // If validation fails, assume it's a CV to avoid blocking legitimate uploads
    return { isCV: true, confidence: "low", reason: "Validation inconclusive" };
  }
}

/**
 * Analyse CV with Google Gemini AI and return structured scores
 * @param {string} cvText - Extracted CV text
 * @param {Object} questionnaire - Optional user responses
 * @returns {Promise<Object>} - Analysis results
 */
async function analyseCV(cvText, questionnaire = {}) {
  // First, validate if this is actually a CV
  console.log("🔍 Validating if document is a CV...");
  const validation = await validateCV(cvText);

  console.log("Validation result:", validation);

  if (!validation.isCV && validation.confidence !== "low") {
    throw new Error(
      `This doesn't appear to be a CV or resume. ${validation.reason}. Please upload a proper CV/Resume document.`
    );
  }

  const prompt = `You are an expert career counsellor and ATS (Applicant Tracking System) specialist. Analyse this CV/resume thoroughly and provide detailed feedback.

CRITICAL: This MUST be a CV/Resume. If the document does not appear to be a CV/Resume (e.g., it's a random text file, article, or other document), respond with:
{
  "error": "not_a_cv",
  "message": "This document does not appear to be a CV or resume. Please upload a proper CV/Resume."
}

Rate the CV across these 5 buckets (each out of 20 points):

1. **CV Professionalism & Formatting** (/20)
   - Structure, layout, visual appeal
   - Grammar, spelling, punctuation
   - Contact information completeness
   - Consistent formatting, dates, fonts

2. **Projects & Experience** (/20)
   - Quality and relevance of projects
   - Work experience depth
   - Measurable outcomes and impact
   - Clear descriptions of responsibilities

3. **Technical Skills** (/20)
   - Breadth and depth of technical skills
   - Relevance to modern industry standards
   - Tools, frameworks, languages listed
   - Evidence of practical application

4. **Soft Skills** (/20)
   - Communication abilities (demonstrated in CV language)
   - Leadership examples
   - Teamwork and collaboration mentions
   - Problem-solving demonstrations

5. **Education & Certifications** (/20)
   - Educational background
   - Relevant certifications
   - Continuous learning indicators
   - Academic achievements

For EACH bucket, provide:
- **score**: Number from 0-20
- **strengths**: Array of 2-3 specific strengths found (be specific, not generic)
- **recommendations**: Array of 2-3 actionable improvements (specific and practical)

Also provide:
- **overall_score**: Sum of all bucket scores (out of 100)
- **summary**: 3-4 sentences of encouraging, professional feedback about the overall CV
- **top_priorities**: Array of 3 most important improvements across all buckets

CV CONTENT:
${cvText}

${
  Object.keys(questionnaire).length > 0
    ? `ADDITIONAL CONTEXT:\n${JSON.stringify(questionnaire, null, 2)}`
    : ""
}

CRITICAL: Return ONLY valid JSON in this exact format (no markdown, no explanations, no code blocks):
{
  "overall_score": 75,
  "buckets": [
    {
      "name": "CV Professionalism & Formatting",
      "score": 16,
      "strengths": ["Well-structured layout with clear sections", "Error-free grammar throughout"],
      "recommendations": ["Add LinkedIn URL to contact section", "Use consistent bullet point formatting"]
    },
    {
      "name": "Projects & Experience",
      "score": 14,
      "strengths": ["3 relevant projects with clear descriptions"],
      "recommendations": ["Quantify project outcomes with metrics", "Add technologies used for each project"]
    },
    {
      "name": "Technical Skills",
      "score": 17,
      "strengths": ["Modern tech stack including React and Node.js"],
      "recommendations": ["Group skills by category (Frontend, Backend, Tools)"]
    },
    {
      "name": "Soft Skills",
      "score": 12,
      "strengths": ["Mentions team collaboration in project descriptions"],
      "recommendations": ["Add specific leadership examples", "Highlight communication achievements"]
    },
    {
      "name": "Education & Certifications",
      "score": 16,
      "strengths": ["Bachelor's degree listed with GPA", "Recent bootcamp completion"],
      "recommendations": ["Add relevant online courses or certifications"]
    }
  ],
  "summary": "Your CV demonstrates a solid foundation with relevant technical skills and project experience. The formatting is professional and easy to read. With some enhancements to quantify your achievements and better showcase soft skills, you'll be highly competitive for entry to mid-level positions.",
  "top_priorities": [
    "Add quantifiable metrics to project descriptions (e.g., 'Improved performance by 40%')",
    "Include more specific examples of leadership and teamwork",
    "Add LinkedIn profile and portfolio links to contact section"
  ]
}`;

  try {
    // Use Gemini 2.0 Flash for analysis
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    console.log("Raw Gemini response length:", responseText.length);

    // Try to parse JSON response
    let analysis;
    try {
      // Remove any markdown formatting if present
      let cleanedText = responseText.trim();

      // Remove markdown code blocks
      cleanedText = cleanedText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "");

      // Try to find JSON object
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanedText = jsonMatch[0];
      }

      analysis = JSON.parse(cleanedText);

      // Check if AI detected this isn't a CV
      if (analysis.error === "not_a_cv") {
        throw new Error(
          analysis.message ||
            "This document does not appear to be a CV or resume."
        );
      }
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", parseError);
      console.log("Raw response:", responseText.substring(0, 500));

      // Check if response contains "not a CV" message
      if (
        responseText.toLowerCase().includes("not a cv") ||
        responseText.toLowerCase().includes("not a resume")
      ) {
        throw new Error(
          "This document does not appear to be a CV or resume. Please upload a proper CV/Resume document."
        );
      }

      throw new Error("AI returned invalid format. Please try again.");
    }

    // Validate structure
    if (!analysis.buckets || !Array.isArray(analysis.buckets)) {
      throw new Error("Invalid analysis structure");
    }

    // Ensure all scores are numbers
    analysis.buckets = analysis.buckets.map((bucket) => ({
      ...bucket,
      score:
        typeof bucket.score === "number"
          ? bucket.score
          : parseInt(bucket.score) || 0,
    }));

    // Recalculate overall score to be sure
    const totalScore = analysis.buckets.reduce(
      (sum, bucket) => sum + bucket.score,
      0
    );
    analysis.overall_score = totalScore;

    return analysis;
  } catch (error) {
    console.error("Gemini Analysis error:", error);

    // More helpful error messages
    if (error.message?.includes("API key")) {
      throw new Error("Invalid Gemini API key. Please check your .env file.");
    }
    if (error.message?.includes("quota")) {
      throw new Error(
        "API quota exceeded. Please try again later or check your Gemini quota."
      );
    }
    if (
      error.message?.includes("not a CV") ||
      error.message?.includes("not a resume")
    ) {
      throw error; // Pass through CV validation errors
    }

    throw new Error(`AI analysis failed: ${error.message}`);
  }
}

/**
 * Handle chat messages with context using Gemini
 */
async function handleChat(message, conversationHistory = [], context = {}) {
  // Build conversation context
  let conversationContext = "";
  if (conversationHistory && conversationHistory.length > 1) {
    conversationContext = "\nPREVIOUS CONVERSATION:\n";
    conversationHistory.slice(0, -1).forEach((msg) => {
      conversationContext += `${msg.role === "user" ? "User" : "PrepPal"}: ${
        msg.content
      }\n`;
    });
  }

  const prompt = `You are PrepPal, a helpful and encouraging career counsellor assistant. You are having an ongoing conversation with a user about their CV analysis.

IMPORTANT CONVERSATION RULES:
- This is a CONTINUING conversation, not a new one each time
- Do not reintroduce yourself or repeat previous information unless the user asks
- Always refer to the user's CV analysis context when providing advice
- Use the user's name if known and/or provided
- You are designed ONLY to support users with CV analysis, CV improvement and directly related career advice
- You must not answer any questions outside of CVs or career advice, even ifasked in natural language
- If the user asks something outside your scope, politely respond: "Sorry, I can only assist with CV analysis and related career advice."
- Use the CONTEXT provided to inform your responses
- NO unnecessary courtesy repetitons
- Do NOT greet the user on every message (only greet once at start of conversation)
- If user says "thank you" or "thanks" with no further questions, respond briefly: "You're welcome! Let me know if you need anything else."
- Do not repeat this in future responses unless the user restarts the conversation or says "thank you" or "thanks" again
- If user asks for your name, respond: "I am PrepPal, your career counsellor assistant."
- Keep responses concise and natural, like a real conversation
- Use emojis VERY sparingly (max 1 per response, and only when appropriate)
- Avoid repetitive phrases
- Do not mention you are an AI model or developed by CloudCTRL
- Do not mention Gemini or Google in responses
- Do not mention any internal error details to the user
- Do not apologise excessively
- Do not offer disclaimers about AI limitations or speculations
- If unsure whether a question is in scope, politely ask the user for clarification

Your personality:
- Friendly and conversational
- Professional but approachable
- Use British English spelling (analyse, colour, etc.)
- Be helpful and specific
- Keep responses under 150 words unless asked for detailed explanation

${conversationContext}

${
  context.analysis
    ? `CV ANALYSIS CONTEXT:\n${JSON.stringify(context.analysis, null, 2)}\n`
    : ""
}

CURRENT USER MESSAGE: ${message}

Respond naturally as if continuing a conversation. Be concise and helpful.`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("PrepPal Chat error:", error);
    throw new Error(`Chat failed: ${error.message}`);
  }
}

module.exports = { analyseCV, handleChat };
