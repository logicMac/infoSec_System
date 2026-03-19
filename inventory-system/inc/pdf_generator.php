<?php
/**
 * Simple PDF Generator - No External Dependencies Required
 * Generates PDF reports using HTML to PDF conversion
 */

class SimplePDFGenerator {
    private $title = '';
    private $content = '';
    private $filename = '';
    
    public function __construct($title = 'Report') {
        $this->title = $title;
        $this->filename = 'Report_' . date('Y-m-d_H-i-s') . '.pdf';
    }
    
    public function setContent($html) {
        $this->content = $html;
        return $this;
    }
    
    public function setFilename($filename) {
        $this->filename = $filename;
        return $this;
    }
    
    public function download() {
        // Set PDF headers
        header('Content-Type: application/pdf');
        header('Content-Disposition: attachment; filename="' . $this->filename . '"');
        header('Cache-Control: no-cache, no-store, must-revalidate');
        header('Pragma: no-cache');
        header('Expires: 0');
        
        // Output HTML (browser will handle PDF conversion)
        echo $this->content;
        exit;
    }
    
    public function downloadAsHTML() {
        // Alternative: Download as HTML file that can be printed to PDF
        header('Content-Type: text/html; charset=utf-8');
        header('Content-Disposition: attachment; filename="' . str_replace('.pdf', '.html', $this->filename) . '"');
        
        echo $this->content;
        exit;
    }
    
    /**
     * Generate HTML content for report
     */
    public static function generateReportHTML($title, $dateRange, $summary, $tableRows, $generatedBy = 'System') {
        $summaryHTML = '';
        foreach ($summary as $label => $value) {
            $summaryHTML .= '
            <div class="summary-item">
                <h3>' . $label . '</h3>
                <p>' . $value . '</p>
            </div>';
        }
        
        $tableHTML = '';
        foreach ($tableRows as $row) {
            $tableHTML .= '<tr>';
            foreach ($row as $cell) {
                $tableHTML .= '<td>' . htmlspecialchars($cell) . '</td>';
            }
            $tableHTML .= '</tr>';
        }
        
        $html = '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>' . htmlspecialchars($title) . '</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; 
            color: #333; 
            line-height: 1.6;
            background: #fff;
        }
        .container { max-width: 900px; margin: 0 auto; padding: 20px; }
        .header { 
            text-align: center; 
            margin-bottom: 30px; 
            border-bottom: 3px solid #2563eb; 
            padding-bottom: 20px; 
        }
        .header h1 { 
            color: #1e3a8a; 
            font-size: 28px; 
            margin-bottom: 5px; 
        }
        .header h2 { 
            color: #2563eb; 
            font-size: 18px; 
            margin-bottom: 10px; 
        }
        .header p { 
            color: #666; 
            font-size: 12px; 
        }
        .summary { 
            display: flex; 
            gap: 15px; 
            margin-bottom: 30px; 
            flex-wrap: wrap;
        }
        .summary-item { 
            flex: 1;
            min-width: 200px;
            border: 2px solid #e5e7eb; 
            padding: 20px; 
            text-align: center; 
            border-radius: 8px;
            background: #f9fafb;
        }
        .summary-item h3 { 
            color: #2563eb; 
            font-size: 13px; 
            margin-bottom: 10px; 
            font-weight: bold; 
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .summary-item p { 
            font-size: 24px; 
            font-weight: bold; 
            color: #1e3a8a; 
        }
        table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 20px; 
            border: 1px solid #ddd;
        }
        th { 
            background-color: #2563eb; 
            color: white; 
            padding: 12px; 
            text-align: left; 
            font-weight: bold; 
            font-size: 12px;
            border: 1px solid #2563eb;
        }
        td { 
            padding: 10px 12px; 
            border: 1px solid #ddd; 
            font-size: 11px; 
        }
        tr:nth-child(even) { 
            background-color: #f9fafb; 
        }
        tr:hover {
            background-color: #f0f4f8;
        }
        .footer { 
            margin-top: 40px; 
            text-align: center; 
            font-size: 11px; 
            color: #999; 
            border-top: 1px solid #ddd; 
            padding-top: 15px; 
        }
        .page-break { 
            page-break-after: always; 
        }
        @media print {
            body { background: white; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Inventory Management System</h1>
            <h2>' . htmlspecialchars($title) . '</h2>
            <p>Generated on: ' . date('F d, Y H:i:s') . '</p>
            ' . ($dateRange ? '<p>Date Range: ' . htmlspecialchars($dateRange) . '</p>' : '') . '
        </div>
        
        <div class="summary">
            ' . $summaryHTML . '
        </div>
        
        <table>
            <thead>
                <tr>
                    <th>Type</th>
                    <th>Reference ID</th>
                    <th>Date</th>
                    <th>Subject</th>
                    <th>Total (₱)</th>
                    <th>Generated By</th>
                </tr>
            </thead>
            <tbody>
                ' . ($tableHTML ?: '<tr><td colspan="6" style="text-align: center;">No data found</td></tr>') . '
            </tbody>
        </table>
        
        <div class="footer">
            <p>This is an automatically generated report from the Inventory Management System.</p>
            <p>For more information, please contact your system administrator.</p>
        </div>
    </div>
</body>
</html>';
        
        return $html;
    }
}
?>
