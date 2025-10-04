import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { ChartData, TimeSeriesDataPoint, CategoryDataPoint } from './types/chart'

// =========================================
// CHART EXPORT UTILITIES
// =========================================

export async function exportChartAsPNG(
  chartElement: HTMLElement,
  filename: string = 'chart'
): Promise<void> {
  try {
    // Use html2canvas to capture the chart
    const html2canvas = (await import('html2canvas')).default
    const canvas = await html2canvas(chartElement, {
      backgroundColor: '#ffffff',
      scale: 2, // Higher resolution
      useCORS: true
    })

    // Convert to blob and download
    canvas.toBlob((blob) => {
      if (blob) {
        downloadBlob(blob, `${filename}.png`)
      }
    }, 'image/png')
  } catch (error) {
    console.error('Error exporting chart as PNG:', error)
    throw new Error('Failed to export chart as PNG')
  }
}

export async function exportChartAsSVG(
  chartElement: HTMLElement,
  filename: string = 'chart'
): Promise<void> {
  try {
    // Get the SVG content from the chart
    const svgElement = chartElement.querySelector('svg')
    if (!svgElement) {
      throw new Error('No SVG element found in chart')
    }

    // Serialize SVG
    const serializer = new XMLSerializer()
    const svgString = serializer.serializeToString(svgElement)

    // Create blob and download
    const blob = new Blob([svgString], { type: 'image/svg+xml' })
    downloadBlob(blob, `${filename}.svg`)
  } catch (error) {
    console.error('Error exporting chart as SVG:', error)
    throw new Error('Failed to export chart as SVG')
  }
}

export function exportChartDataAsCSV(
  data: ChartData,
  filename: string = 'chart-data'
): void {
  try {
    let csvContent = ''

    if (data.timeSeries && data.timeSeries.length > 0) {
      // Time series data
      const headers = Object.keys(data.timeSeries[0])
      csvContent = headers.join(',') + '\n'

      data.timeSeries.forEach(row => {
        const values = headers.map(header => {
          const value = (row as any)[header]
          return typeof value === 'number' ? value.toString() : `"${value}"`
        })
        csvContent += values.join(',') + '\n'
      })
    } else if (data.categories && data.categories.length > 0) {
      // Category data
      csvContent = 'Category,Value,Percentage,Color\n'
      data.categories.forEach(category => {
        csvContent += `"${category.name}",${category.value},${category.percentage},"${category.color}"\n`
      })
    }

    // Create and download blob
    const blob = new Blob([csvContent], { type: 'text/csv' })
    downloadBlob(blob, `${filename}.csv`)
  } catch (error) {
    console.error('Error exporting chart data as CSV:', error)
    throw new Error('Failed to export chart data as CSV')
  }
}

export async function exportChartAsPDF(
  chartElement: HTMLElement,
  data: ChartData,
  filename: string = 'chart-report'
): Promise<void> {
  try {
    const pdf = new jsPDF()

    // Add title
    pdf.setFontSize(16)
    pdf.text('Financial Chart Report', 20, 20)

    // Add metadata
    pdf.setFontSize(10)
    if (data.metadata) {
      pdf.text(`Generated: ${new Date(data.metadata.lastUpdated).toLocaleDateString()}`, 20, 35)
      pdf.text(`Timeframe: ${data.metadata.timeframe}`, 20, 45)
      pdf.text(`Data View: ${data.metadata.dataView}`, 20, 55)
    }

    let yPosition = 70

    // Add summary data if available
    if (data.summary) {
      pdf.setFontSize(12)
      pdf.text('Summary', 20, yPosition)
      yPosition += 10

      pdf.setFontSize(10)
      if (data.summary.totalIncome) {
        pdf.text(`Total Income: $${data.summary.totalIncome.toLocaleString()}`, 20, yPosition)
        yPosition += 8
      }
      if (data.summary.totalExpenses) {
        pdf.text(`Total Expenses: $${data.summary.totalExpenses.toLocaleString()}`, 20, yPosition)
        yPosition += 8
      }
      if (data.summary.netIncome) {
        pdf.text(`Net Income: $${data.summary.netIncome.toLocaleString()}`, 20, yPosition)
        yPosition += 8
      }

      yPosition += 10
    }

    // Add data table
    if (data.timeSeries && data.timeSeries.length > 0) {
      const tableData = data.timeSeries.map(row => [
        row.date,
        row.income?.toString() || '',
        row.expenses?.toString() || '',
        row.net?.toString() || ''
      ])

      ;(pdf as any).autoTable({
        head: [['Date', 'Income', 'Expenses', 'Net']],
        body: tableData,
        startY: yPosition,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [41, 128, 185] }
      })
    } else if (data.categories && data.categories.length > 0) {
      const tableData = data.categories.map(cat => [
        cat.name,
        cat.value.toString(),
        `${cat.percentage.toFixed(1)}%`
      ])

      ;(pdf as any).autoTable({
        head: [['Category', 'Amount', 'Percentage']],
        body: tableData,
        startY: yPosition,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [41, 128, 185] }
      })
    }

    // Save the PDF
    pdf.save(`${filename}.pdf`)
  } catch (error) {
    console.error('Error exporting chart as PDF:', error)
    throw new Error('Failed to export chart as PDF')
  }
}

// =========================================
// HELPER FUNCTIONS
// =========================================

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// =========================================
// EXPORT UTILITY CLASS
// =========================================

export class ChartExporter {
  static async export(
    format: 'png' | 'svg' | 'csv' | 'pdf',
    chartElement: HTMLElement | null,
    data: ChartData,
    filename?: string
  ): Promise<void> {
    const baseFilename = filename || `chart-${new Date().toISOString().split('T')[0]}`

    switch (format) {
      case 'png':
        if (!chartElement) throw new Error('Chart element required for PNG export')
        await exportChartAsPNG(chartElement, baseFilename)
        break
      case 'svg':
        if (!chartElement) throw new Error('Chart element required for SVG export')
        await exportChartAsSVG(chartElement, baseFilename)
        break
      case 'csv':
        exportChartDataAsCSV(data, baseFilename)
        break
      case 'pdf':
        if (!chartElement) throw new Error('Chart element required for PDF export')
        await exportChartAsPDF(chartElement, data, baseFilename)
        break
      default:
        throw new Error(`Unsupported export format: ${format}`)
    }
  }
}