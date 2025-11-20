import jsPDF from 'jspdf';

/**
 * Generate a beautiful PDF report from CV analysis data
 * @param {Object} analysisData - The CV analysis results
 * @param {string} filename - Original CV filename
 */
export const generatePDFReport = (analysisData, filename = 'CV') => {
  const doc = new jsPDF();
  
  // Colors
  const primaryBlue = [59, 130, 246];
  const primaryPurple = [168, 85, 247];
  const darkGray = [31, 41, 59];
  const lightGray = [148, 163, 184];
  const success = [16, 185, 129];
  
  let yPos = 20;
  
  // ==================== HEADER ====================
  doc.setFillColor(...primaryBlue);
  doc.rect(0, 0, 210, 40, 'F');
  
  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('PrepCheck', 105, 20, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Career Readiness Analysis Report', 105, 30, { align: 'center' });
  
  yPos = 50;
  
  // ==================== OVERALL SCORE ====================
  doc.setTextColor(...darkGray);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Overall Readiness Score', 20, yPos);
  
  yPos += 10;
  
  // Score circle background
  doc.setFillColor(240, 240, 255);
  doc.circle(105, yPos + 15, 20, 'F');
  
  // Score number
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  const scoreColor = analysisData.overall_score >= 85 ? success : 
                     analysisData.overall_score >= 70 ? primaryBlue : 
                     [245, 158, 11];
  doc.setTextColor(...scoreColor);
  doc.text(`${analysisData.overall_score}`, 105, yPos + 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setTextColor(...lightGray);
  doc.text('/100', 105, yPos + 27, { align: 'center' });
  
  yPos += 45;
  
  // Rating badge
  const rating = analysisData.overall_score >= 85 ? 'Excellent' :
                 analysisData.overall_score >= 70 ? 'Good' :
                 analysisData.overall_score >= 50 ? 'Fair' : 'Needs Work';
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...scoreColor);
  doc.text(rating, 105, yPos, { align: 'center' });
  
  yPos += 15;
  
  // Summary
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...darkGray);
  const summaryLines = doc.splitTextToSize(analysisData.summary, 170);
  doc.text(summaryLines, 20, yPos);
  
  yPos += summaryLines.length * 6 + 10;
  
  // ==================== BUCKET SCORES ====================
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkGray);
  doc.text('Detailed Analysis', 20, yPos);
  
  yPos += 10;
  
  analysisData.buckets.forEach((bucket, index) => {
    // Check if we need a new page
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    // Bucket name and score
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...darkGray);
    doc.text(bucket.name, 20, yPos);
    
    doc.setTextColor(...primaryBlue);
    doc.text(`${bucket.score}/20`, 180, yPos);
    
    yPos += 6;
    
    // Progress bar background
    doc.setFillColor(240, 240, 255);
    doc.roundedRect(20, yPos, 170, 6, 3, 3, 'F');
    
    // Progress bar fill
    const percentage = (bucket.score / 20) * 100;
    const barColor = bucket.score >= 16 ? success :
                     bucket.score >= 12 ? primaryBlue :
                     bucket.score >= 8 ? [245, 158, 11] : [239, 68, 68];
    doc.setFillColor(...barColor);
    doc.roundedRect(20, yPos, (170 * percentage) / 100, 6, 3, 3, 'F');
    
    yPos += 12;
    
    // Strengths
    if (bucket.strengths && bucket.strengths.length > 0) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...success);
      doc.text('✓ Strengths', 25, yPos);
      
      yPos += 5;
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...darkGray);
      bucket.strengths.forEach(strength => {
        const lines = doc.splitTextToSize(`• ${strength}`, 160);
        doc.text(lines, 30, yPos);
        yPos += lines.length * 5;
      });
      
      yPos += 2;
    }
    
    // Recommendations
    if (bucket.recommendations && bucket.recommendations.length > 0) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...primaryBlue);
      doc.text('→ Recommendations', 25, yPos);
      
      yPos += 5;
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...darkGray);
      bucket.recommendations.forEach(rec => {
        const lines = doc.splitTextToSize(`• ${rec}`, 160);
        doc.text(lines, 30, yPos);
        yPos += lines.length * 5;
      });
    }
    
    yPos += 8;
    
    // Divider line
    if (index < analysisData.buckets.length - 1) {
      doc.setDrawColor(...lightGray);
      doc.line(20, yPos, 190, yPos);
      yPos += 8;
    }
  });
  
  // ==================== TOP PRIORITIES ====================
  // Check if we need a new page
  if (yPos > 230) {
    doc.addPage();
    yPos = 20;
  } else {
    yPos += 10;
  }
  
  if (analysisData.top_priorities && analysisData.top_priorities.length > 0) {
    doc.setFillColor(255, 245, 230);
    doc.roundedRect(15, yPos, 180, 15 + (analysisData.top_priorities.length * 10), 5, 5, 'F');
    
    yPos += 8;
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryBlue);
    doc.text('🎯 Top Priority Improvements', 20, yPos);
    
    yPos += 8;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...darkGray);
    
    analysisData.top_priorities.forEach((priority, i) => {
      const lines = doc.splitTextToSize(`${i + 1}. ${priority}`, 165);
      doc.text(lines, 25, yPos);
      yPos += lines.length * 5 + 2;
    });
  }
  
  // ==================== FOOTER ====================
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    doc.setFontSize(8);
    doc.setTextColor(...lightGray);
    doc.text(
      `Generated by PrepCheck • ${new Date().toLocaleDateString()}`,
      105,
      285,
      { align: 'center' }
    );
    
    doc.text(
      `Page ${i} of ${pageCount}`,
      190,
      285,
      { align: 'right' }
    );
  }
  
  // ==================== SAVE PDF ====================
  const cleanFilename = filename.replace(/\.[^/.]+$/, ''); // Remove extension
  doc.save(`${cleanFilename}-PrepCheck-Report.pdf`);
};