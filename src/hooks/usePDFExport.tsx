
import { useCallback } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface AnalyticsData {
  visitorStats: {
    total_visitors: number;
    unique_visitors: number;
    avg_time_spent: number;
    total_page_views: number;
    bounce_rate: number;
  };
  dailyStats: Array<{
    date: string;
    visitors: number;
    page_views: number;
    avg_time: number;
  }>;
  pageStats: Array<{
    page_path: string;
    views: number;
    avg_time: number;
  }>;
}

export const usePDFExport = () => {
  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  };

  const exportAnalyticsToPDF = useCallback(async (data: AnalyticsData) => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;

      // Add title
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Analytics Dashboard Report', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      // Add date
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 20;

      // Overview Stats
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Overview Statistics', 20, yPosition);
      yPosition += 10;

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      
      const stats = [
        ['Total Visitors', data.visitorStats.total_visitors.toString()],
        ['Unique Visitors', data.visitorStats.unique_visitors.toString()],
        ['Average Time Spent', formatDuration(data.visitorStats.avg_time_spent)],
        ['Total Page Views', data.visitorStats.total_page_views.toString()],
        ['Bounce Rate', `${data.visitorStats.bounce_rate}%`]
      ];

      stats.forEach(([label, value]) => {
        pdf.text(`${label}: ${value}`, 25, yPosition);
        yPosition += 8;
      });

      yPosition += 10;

      // Daily Stats Table
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Daily Statistics (Last 7 Days)', 20, yPosition);
      yPosition += 15;

      // Table headers
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Date', 25, yPosition);
      pdf.text('Visitors', 70, yPosition);
      pdf.text('Page Views', 110, yPosition);
      pdf.text('Avg Time', 150, yPosition);
      yPosition += 8;

      // Draw line under headers
      pdf.line(20, yPosition - 2, pageWidth - 20, yPosition - 2);
      yPosition += 5;

      // Table data
      pdf.setFont('helvetica', 'normal');
      data.dailyStats.forEach(stat => {
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.text(stat.date, 25, yPosition);
        pdf.text(stat.visitors.toString(), 70, yPosition);
        pdf.text(stat.page_views.toString(), 110, yPosition);
        pdf.text(formatDuration(stat.avg_time), 150, yPosition);
        yPosition += 8;
      });

      yPosition += 15;

      // Top Pages
      if (yPosition > pageHeight - 80) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Top Pages by Views', 20, yPosition);
      yPosition += 15;

      // Table headers
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Page Path', 25, yPosition);
      pdf.text('Views', 120, yPosition);
      pdf.text('Avg Time', 150, yPosition);
      yPosition += 8;

      // Draw line under headers
      pdf.line(20, yPosition - 2, pageWidth - 20, yPosition - 2);
      yPosition += 5;

      // Table data
      pdf.setFont('helvetica', 'normal');
      data.pageStats.slice(0, 10).forEach(page => {
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = 20;
        }
        const path = page.page_path.length > 30 ? page.page_path.substring(0, 30) + '...' : page.page_path;
        pdf.text(path, 25, yPosition);
        pdf.text(page.views.toString(), 120, yPosition);
        pdf.text(formatDuration(page.avg_time), 150, yPosition);
        yPosition += 8;
      });

      // Save the PDF
      pdf.save(`analytics-report-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  }, []);

  return { exportAnalyticsToPDF };
};
