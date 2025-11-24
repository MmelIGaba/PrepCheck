# PrepCheck
<h3>AI-Powered Work Readiness Screener</h3>

**Revolutionising career readiness assessment with AI-powered CV analysis and personalised recommendations.**  

PrepCheck is an intelligent career readiness platform that provides instant, actionable feedback on CVs. Using advanced AI (Google Gemini), it analyses CVs across five critical dimensions and offers specific recommendations to help job seekers stand out in a competitive market.


## 💡 Why We Created PrepCheck

Traditional CV feedback is:  

-**Expensive:** Career counselling costs R400+ per session, CV analysis R300+.  
-**Slow:** Wait days or weeks for professional review.  
-**Generic:** One-size-fits-all advice lacking specificity.  
-**Inaccessible:** Not financially accessible to students and career changers.  

PrepCheck solves this by providing instant, intelligent, personalised feedback at no cost, making professional CV analysis accessible to everyone.   

**Try PrepCheck now - No installation required!**  
🔗 **Live Demo:**  [PrepCheck](https://prepcheck-1.onrender.com)

Click the link above to start receiving personalised CV analyses! 💕🎨🌟


## 🎨 Features

✨ Key Features:  
🔍 Comprehensive CV Analysis  

Five-Bucket Scoring System (100 points total):

- CV Professionalism and Formatting (20 points).  
- Projects and Experience (20 points).  
- Technical Skills (20 points)  
- Soft Skills (20 points).  
- Education & Certifications (20 points).  


🤖 PrepPal AI Assistant  

- Conversational AI that answers follow-up questions in real-time.  
- Spelling-tolerant and context-aware.  
- Maintains conversation history for relevant responses.  
- Sound notifications for enhanced UX.  
- Animated robot avatar with smooth animations.  

📊 Visual Analytics  

- Radial charts for score visualisation.  
- Progress indicators for each bucket.  
- Dark/light mode with system detection.  
- Responsive design (mobile-first approach).  

📄 PDF Report Generation  

- Professional branded reports.  
- Complete score breakdown with visual elements.  
- Actionable recommendations.  
- Top priority improvements highlighted.  

🔒 Security & Privacy  

- CVs processed securely and not stored.  
- Environment variable-based configuration.  
- Kubernetes secrets for sensitive data.  
- CORS protection and input validation.  


## ⚙ How PrepCheck Works

1. User uploads their CV in either PDF or Word format.   
2. Backend verifies if the file is an appropriate CV.   
3. Once passed verification- the backend sends this file to Gemini's API.  
4. The AI returns a personalised CV analysis.  
6. Users can chat to PrepPal for more information on the CV analysis.  


## 💌 Themes

- Light mode: light blues and purples with black font. 
- Dark mode: dark blues and purples with white font. 

## 📷 Preview

Landing page: 
<img width="1342" height="622" alt="2025-11-21 (5)" src="https://github.com/user-attachments/assets/bf7a3e94-d1b8-488c-8e27-20cd77f3e499" />  
*Users are prompted to upload a CV for analysis*

<img width="1329" height="614" alt="2025-11-21 (7)" src="https://github.com/user-attachments/assets/65e62ace-a985-4e0c-84b9-b2297ed4ef9e" />  
*Dark mode*

Generated CV Analysis  
<img width="1344" height="606" alt="2025-11-21 (8)" src="https://github.com/user-attachments/assets/735405e7-ce26-421c-a96f-020eaa2eab0b" />  
*After CV file is verified- CV Analysis is done*

<img width="1324" height="611" alt="2025-11-21 (17)" src="https://github.com/user-attachments/assets/60ceada9-5dcf-4594-b528-a6148cbb70bd" />  
*Dark mode*

PrepPal
<img width="1352" height="617" alt="2025-11-21 (12)" src="https://github.com/user-attachments/assets/59b12640-74c5-42eb-afe9-c8f67fa94689" />
*Light mode* 

<img width="1326" height="602" alt="2025-11-21 (19)" src="https://github.com/user-attachments/assets/7a6b3e6b-8d51-4986-8b7b-854d5e507645" />  
*Dark mode* 


## ⛓ Tech Stack

🛠 Technology Stack  
**Frontend**  

**React 18** - Modern UI library with hooks.  
**Vite** - Lightning-fast build tool.  
**Framer Motion** - Smooth animations.  
**Recharts** - Data visualisation.  
**Lucide React** - Icon library.  
**Axios** - HTTP client.  

**Backend**  

**Node.js v20** - JavaScript runtime.  
**Express.js** - Web framework.  
**Multer** - File upload handling.  
**pdf-parse** - PDF text extraction.  
**Mammoth** - DOCX text extraction.  
**@google/generative-ai** - Gemini API SDK.  

**AI/ML**  

**Google Gemini 2.0 Flash** - Large language model.  
Natural Language Processing.  
Structured JSON output generation.  
Conversational AI capabilities.  

**DevOps**

**Docker** - Containerisation.  
**Kubernetes** - Container orchestration.  
**GitHub Actions** - CI/CD automation.  
**Docker Hub** - Container registry.  


## 🖥 How to Run  

**Note:** PrepCheck is already live at [PrepCheck](https://prepcheck-1.onrender.com)   
These instructions are for running the project on your local machine for development.  

**Prerequisites**

Node.js v20 or higher.  
Docker Desktop (for containerisation).  
Kubernetes cluster (Minikube for local, OpenShift for production).  
Google Gemini API key [Get one here](https://aistudio.google.com/app/apikey).   

**1. Clone the Repository**  
Open your terminal and run:  

``` bash
git clone https://github.com/MmelIGaba/PrepCheck.git  
cd PrepCheck
```

**2. Install Backend Dependencies**

```bash  
cd backend  
npm install
```

**3. Configure Environment Variables**  

Create a .env file in the backend folder.  
Copy the content from .env.example into your new .env file.  
Add your own Gemini API key:  

```
PORT=5000  
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

**4. Start the Backend Server:**

```bash  
npm run dev
```

The backend will run on http://localhost:3000 by default.  

**5. Serve the Frontend**  
Open a new terminal window:  

```bash
cd frontend  
npm install
```

**6. Configure Environment Variables**  
Create a .env file in the server folder.  
Copy the content from .env.example into your new .env file.  
Add VITE_API_URL  

```bash  
VITE_API_URL=http://localhost:5000
```
**7. Serve the Frontend**  
Open a new terminal window:  

```bash  
cd frontend
npm run dev
```

Or use the Live Server extension in VS Code.  
The frontend will run on http://localhost:3000.  

**8. Open in Browser**  
Navigate to http://localhost:3000 and start analysing your CV!


## 🚀 Docker Deployment  

Building Images  
**Backend:**

```bash  
cd backend  
docker build -t mmeligab/prepcheck-backend:latest .
```

**Frontend:**

```bash  
cd frontend  
docker build -t mmeligab/prepcheck-frontend:latest .  
```

**Using Docker Compose**  

```bash  
*Start all services*   
docker-compose up -d  

*View logs*  
docker-compose logs -f  

*Stop services*  
docker-compose down
```

Access the application at http://localhost:80  

**Pushing to Docker Hub**  

```bash  
*Login to Docker Hub*  
docker login

*Push images*    
docker push mmeligab/prepcheck-backend:latest  
docker push mmeligab/prepcheck-frontend:latest
```

**Docker Hub Repository:** mmeligab/prepcheck


## 🚀 Deployment  

This project is deployed using: 

- **Frontend:** Render (serves static files from `frontend/` folder).  
- **Backend:** Render (Node.js/Express server from `backend/` folder).  

### Deploy Your Own Instance:

**Backend (Render):**
1. Create an account at [Render](https://render.com/). 
2. New Web Service → Connect Git repo. 
3. Root Directory: `backend`.  
4. Build: `npm install`.  
5. Start: `npm start`.  
6. Add `GEMINI_API_KEY` environment variable.  

**Frontend (Render):**
1. Create an account at [Render](https://render.com/).  
2. New Static Site → Connect Git repo.   
3. Root Directory: `frontend`.  
4. Publish Directory: `dist`.  
5. Build: `npm install & npm run build`.   
6. Add `VITE_APP_URL` with backend Render URL environment variable.  


## 📂 API Documentation  

**Base URL**  

```
Production: https://prepcheck-prepcheck.apps.<cluster-name>.com  
Development: http://localhost:5000
```

# Endpoints
**1. Health Check**  

``` http  
GET /api/health
```

**Response:**  

```json  
{   
  "status”:“ok”,“message”:“Server is running!”   
}
```

**2. Analyse CV**  

```http  
POST /api/analyse  
Content-Type: multipart/form-data
```

**Request Body:** 

cv (file): PDF or DOCX file (max 10MB)  
```json  
{  
  "success": true,  
  "analysis": {  
    "overall_score": 75,  
    "summary": "Your CV shows strong technical skills...",  
    "buckets": [  
      {  
        "name": "CV Professionalism & Formatting",  
        "score": 15,  
        "strengths": ["Clear structure", "Professional layout"],  
        "recommendations": ["Add contact information", "Use consistent formatting"]  
      }  
      // ... 4 more buckets  
    ],  
    "top_priorities": [  
      "Expand on project descriptions",  
      "Add quantifiable achievements",  
      "Include relevant certifications"  
    ]  
  }  
}  
```

**Error Responses**
```json
{  
  "error": "This is not a CV. Please upload a proper CV/Resume.",  
  "type": "invalid_cv"  
}
```

**3. PrepPal Chat**
```http
POST /api/chat  
Content-Type: application/json
```

**Request Body:** 
```json  
{  
  "message": "How can I improve my CV?",  
  "conversationHistory": [  
    {  
      "role": "user",  
      "content": "What's my score?"  
    },  
    {  
      "role": "assistant",  
      "content": "Your overall score is 75/100."  
    }  
  ]  
}
```

**Response**
```json  
{  
  "success": true,  
  "reply": "To improve your CV, focus on quantifying your achievements..."  
}
```

**File Upload Constraints**  

- **Supported formats:** PDF (.pdf), DOCX (.docx).  
- **Maximum size:** 10MB.  
- **Validation:** Must contain CV-related content.  

**Rate Limiting**  

-**Google Gemini Free Tier:** 1,500 requests/day.  
-No rate limiting on API endpoints (controlled by Gemini).  


## 📊 System Architecture

┌─────────────────────────────────────────┐  
│         USER INTERFACE                  │  
│     (Web Browser / Mobile)              │  
└──────────────┬──────────────────────────┘  
               │ HTTPS  
               ▼  
┌─────────────────────────────────────────┐    
│      FRONTEND (React + Vite)            │    
│  • React 18 with hooks                  │    
│  • Framer Motion animations             │    
│  • Recharts visualisation               │    
│  • Dark/light mode support              │    
│  • Responsive design                    │    
└──────────────┬──────────────────────────┘    
               │ REST API (HTTP/JSON)    
               ▼    
┌─────────────────────────────────────────┐   
│    BACKEND (Node.js + Express)          │   
│  • RESTful API endpoints                │   
│  • File upload handling                 │   
│  • Text extraction (PDF/DOCX)           │   
│  • CV validation layer                  │   
│  • Error handling & logging             │   
└──────────────┬──────────────────────────┘   
               │ API Calls (HTTPS)   
               ▼    
┌─────────────────────────────────────────┐   
│  AI SERVICE (Google Gemini 2.0)         │   
│  • Natural language processing          │   
│  • Structured JSON generation           │   
│  • Conversational AI (PrepPal)          │   
│  • Context understanding                │   
└─────────────────────────────────────────┘   
               │    
               ▼    
┌─────────────────────────────────────────┐     
│     DOCKER CONTAINERS                   │    
│  • Frontend: Nginx Alpine               │    
│  • Backend: Node 22 Bullseye            │    
│  • Multi-stage builds                   │    
└──────────────┬──────────────────────────┘      
               │    
               ▼    
┌─────────────────────────────────────────┐    
│   KUBERNETES ORCHESTRATION              │    
│  • Deployments (3 replicas/service)     │    
│  • Services (load balancing)            │    
│  • Secrets (API keys)                   │    
│  • ConfigMaps (configuration)           │    
│  • Rolling updates (zero-downtime)      │    
└─────────────────────────────────────────┘    


## 🔒 Security Notes

⚠️ Never commit .env files - They contain sensitive API keys.  
✔️ Always use an .env.example as a template for team members.  
✔️ Regenerate API keys if accidentally exposed.  
✔️ Use environment variables for all secrets.  


## 📄 License
This project was created as part of a coding bootcamp group's AI-Powered Low-Code App- Containerised DevOps Capstone.  


## 📞 Support  
If you encounter any issues:  

- Check that your Gemini API key is valid.  
- Ensure both frontend and backend servers are running.  
- Check browser console for errors.  


## 👩🏽‍💻 The CloudCTRL Team

| Name | Role | Profile |
|------|------|---------|
| **Mmeli Dyantyi** | Scrum Master | [GitHub](https://github.com/MmelIGaba) |
| **Nqobile Masombuka** | Fullstack Developer | [GitHub](https://github.com/n-qobile) |
| **Boipelo Ngakane** | Fullstack Developer | [GitHub](https://github.com/boipelo-codes) |  

<h3>Made with 💜 by CloudCTRL.</h3>  

