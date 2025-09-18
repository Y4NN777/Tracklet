import ExcelJS from 'exceljs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  date: string;
  created_at: string;
  categories?: {
    id: string;
    name: string;
    color: string;
    icon: string;
  };
  accounts?: {
    id: string;
    name: string;
    type: string;
  };
}

export const exportToXLSX = async (transactions: Transaction[], filename: string = 'transactions', currency: string = 'USD') => {
  // Create workbook
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Transactions');

  // Add headers
  worksheet.columns = [
    { header: 'Date', key: 'date', width: 12 },
    { header: 'Description', key: 'description', width: 30 },
    { header: 'Category', key: 'category', width: 15 },
    { header: 'Account', key: 'account', width: 15 },
    { header: 'Amount', key: 'amount', width: 12 },
    { header: 'Type', key: 'type', width: 10 },
    { header: 'Created At', key: 'createdAt', width: 20 }
  ];

  // Style header row
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4A90E2' }
  };

  // Add data
  transactions.forEach(txn => {
    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(txn.amount);

    worksheet.addRow({
      date: txn.date,
      description: txn.description,
      category: txn.categories?.name || 'Uncategorized',
      account: txn.accounts?.name || 'No Account',
      amount: formattedAmount,
      type: txn.type,
      createdAt: txn.created_at
    });
  });

  // Save file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.xlsx`;
  link.click();
  URL.revokeObjectURL(url);
};

export const exportToPDF = (transactions: Transaction[], filename: string = 'transactions', currency: string = 'USD') => {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(20);
  doc.text('Transaction Report', 14, 22);

  // Add date
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);

  // Prepare table data
  const tableData = transactions.map(txn => [
    txn.date,
    txn.description,
    txn.categories?.name || 'Uncategorized',
    txn.accounts?.name || 'No Account',
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(txn.amount),
    txn.type
  ]);

  // Add table using the imported autoTable function
  autoTable(doc, {
    head: [['Date', 'Description', 'Category', 'Account', 'Amount', 'Type']],
    body: tableData,
    startY: 40,
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontSize: 9,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    margin: { top: 40 },
  });

  // Add summary
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Get the final Y position after the table
  const pageHeight = doc.internal.pageSize.height;
  const currentY = (doc as any).lastAutoTable?.finalY || 120;
  const finalY = currentY + 20;

  doc.setFontSize(12);
  doc.text('Summary:', 14, finalY);
  doc.setFontSize(10);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  doc.text(`Total Income: ${formatCurrency(totalIncome)}`, 14, finalY + 10);
  doc.text(`Total Expenses: ${formatCurrency(totalExpenses)}`, 14, finalY + 20);
  doc.text(`Net Amount: ${formatCurrency(totalIncome - totalExpenses)}`, 14, finalY + 30);

  // Save file
  doc.save(`${filename}.pdf`);
};

export const exportToCSV = (transactions: Transaction[], filename: string = 'transactions', currency: string = 'USD') => {
  // Create CSV content
  const headers = ['Date', 'Description', 'Category', 'Account', 'Amount', 'Type', 'Created At'];
  const csvContent = [
    headers.join(','),
    ...transactions.map(txn => {
      const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
      }).format(txn.amount);

      return `"${txn.date}","${txn.description}","${txn.categories?.name || 'Uncategorized'}","${txn.accounts?.name || 'No Account'}","${formattedAmount}","${txn.type}","${txn.created_at}"`;
    })
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};