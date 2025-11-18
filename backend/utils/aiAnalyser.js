const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
const genAI = new GoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  apiEndpoint: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
});

/**
 * Analyze CV with Google Gemini AI and return structured scores
 * @param {string} cvText - Extracted CV text
 * @param {Object} questionnaire - Optional user responses
 * @returns {Promise<Object>} - Analysis results
 */
async function analyseCV(cvText, questionnaire = {}) {
  const prompt = `You are an expert career counselor and ATS (Applicant Tracking System) specialist. Analyse this CV/resume thoroughly and provide detailed feedback.
 d
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

${Object.keys(questionnaire).length > 0 ? `ADDITIONAL CONTEXT:\n${JSON.stringify(questionnaire, null, 2)}` : ''}

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
    // Use Gemini 1.5 Flash (free and fast)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    console.log('Raw Gemini response length:', responseText.length);

    // Try to parse JSON response
    let analysis;
    try {
      // Remove any markdown formatting if present
      let cleanedText = responseText.trim();
      
      // Remove markdown code blocks
      cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      // Try to find JSON object
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanedText = jsonMatch[0];
      }
      
      analysis = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError);
      console.log('Raw response:', responseText.substring(0, 500));
      throw new Error('AI returned invalid format. Please try again.');
    }

    // Validate structure
    if (!analysis.buckets || !Array.isArray(analysis.buckets)) {
      throw new Error('Invalid analysis structure');
    }

    // Ensure all scores are numbers
    analysis.buckets = analysis.buckets.map(bucket => ({
      ...bucket,
      score: typeof bucket.score === 'number' ? bucket.score : parseInt(bucket.score) || 0
    }));

    // Recalculate overall score to be sure
    const totalScore = analysis.buckets.reduce((sum, bucket) => sum + bucket.score, 0);
    analysis.overall_score = totalScore;

    return analysis;

  } catch (error) {
    console.error('Gemini Analysis error:', error);
    
    // More helpful error messages
    if (error.message?.includes('API key')) {
      throw new Error('Invalid Gemini API key. Please check your .env file.');
    }
    if (error.message?.includes('quota')) {
      throw new Error('API quota exceeded. Please try again later or check your Gemini quota.');
    }
    
    throw new Error(`AI analysis failed: ${error.message}`);
  }
}

/**
 * Handle chat messages with context using Gemini
 */
async function handleChat(message, context = {}) {
  const prompt = `You are a helpful career counselor assistant. The user has just received CV analysis feedback and has a question.

${context.analysis ? `PREVIOUS CV ANALYSIS:\n${JSON.stringify(context.analysis, null, 2)}\n` : ''}

USER QUESTION: ${message}

Provide a helpful, concise, and encouraging response. Be specific and actionable. Keep your response under 200 words.`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();

  } catch (error) {
    console.error('Gemini Chat error:', error);
    throw new Error(`Chat failed: ${error.message}`);
  }
}

module.exports = { analyseCV, handleChat };