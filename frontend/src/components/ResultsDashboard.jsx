import { motion } from 'framer-motion';
import { ArrowLeft, Download, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';
import { generatePDFReport } from '../utils/pdfGenerator';

function ResultsDashboard({ data, onBack, filename = 'CV' }) {
  const { overall_score, buckets, summary, top_priorities } = data;

  // Determine overall rating
  const getRating = (score) => {
    if (score >= 85) return { text: 'Excellent', color: '#10b981', emoji: '🌟' };
    if (score >= 70) return { text: 'Good', color: '#3b82f6', emoji: '✨' };
    if (score >= 50) return { text: 'Fair', color: '#f59e0b', emoji: '⚡' };
    return { text: 'Needs Work', color: '#ef4444', emoji: '💪' };
  };

  const rating = getRating(overall_score);

  // Prepare data for radial chart
  const chartData = [{
    name: 'Score',
    value: overall_score,
    fill: rating.color
  }];

  const handleDownloadPDF = () => {
    try {
      generatePDFReport(data, filename);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div className="results-container">
      {/* Header */}
      <div className="results-header">
        <button onClick={onBack} className="back-btn">
          <ArrowLeft size={20} />
          Analyse Another CV
        </button>
        
        <button className="download-btn" onClick={handleDownloadPDF}>
          <Download size={20} />
          Download Report
        </button>
      </div>

      {/* Overall Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="overall-score-card"
      >
        <div className="score-visual">
          <ResponsiveContainer width={200} height={200}>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="70%"
              outerRadius="100%"
              data={chartData}
              startAngle={90}
              endAngle={-270}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar
                background
                dataKey="value"
                cornerRadius={10}
              />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="score-text">
            <h2>{overall_score}</h2>
            <p>/100</p>
          </div>
        </div>

        <div className="score-info">
          <h3>Your Career Readiness Score</h3>
          <div className="rating-badge" style={{ backgroundColor: `${rating.color}20`, color: rating.color }}>
            <span>{rating.emoji}</span>
            <span>{rating.text}</span>
          </div>
          <p className="summary-text">{summary}</p>
        </div>
      </motion.div>

      {/* Bucket Scores */}
      <div className="buckets-grid">
        {buckets.map((bucket, index) => (
          <motion.div
            key={bucket.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bucket-card"
          >
            <div className="bucket-header">
              <h4>{bucket.name}</h4>
              <div className="bucket-score">
                <span className="score-value">{bucket.score}</span>
                <span className="score-max">/20</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="progress-bar">
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${(bucket.score / 20) * 100}%` }}
                transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                style={{ 
                  backgroundColor: bucket.score >= 16 ? '#10b981' : 
                                  bucket.score >= 12 ? '#3b82f6' : 
                                  bucket.score >= 8 ? '#f59e0b' : '#ef4444'
                }}
              />
            </div>

            {/* Strengths */}
            {bucket.strengths && bucket.strengths.length > 0 && (
              <div className="bucket-section">
                <h5><CheckCircle size={16} /> Strengths</h5>
                <ul className="strengths-list">
                  {bucket.strengths.map((strength, i) => (
                    <li key={i}>{strength}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {bucket.recommendations && bucket.recommendations.length > 0 && (
              <div className="bucket-section">
                <h5><TrendingUp size={16} /> Recommendations</h5>
                <ul className="recommendations-list">
                  {bucket.recommendations.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Top Priorities */}
      {top_priorities && top_priorities.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="priorities-card"
        >
          <h3><AlertCircle size={24} /> Top Priority Improvements</h3>
          <ol className="priorities-list">
            {top_priorities.map((priority, i) => (
              <li key={i}>{priority}</li>
            ))}
          </ol>
        </motion.div>
      )}
    </div>
  );
}

export default ResultsDashboard;