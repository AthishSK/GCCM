const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const marked = require('marked');
const mermaid = require('mermaid');

// Initialize mermaid
mermaid.initialize({ startOnLoad: true });

// Read the markdown file
const markdown = fs.readFileSync(path.join(__dirname, 'docs', 'authentication.md'), 'utf-8');

// Convert markdown to HTML
const html = marked(markdown);

// Create a complete HTML document
const fullHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>GitLab Authentication Documentation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        h1, h2, h3 {
            color: #2c3e50;
            margin-top: 30px;
        }
        code {
            background-color: #f8f9fa;
            padding: 2px 5px;
            border-radius: 3px;
            font-family: 'Courier New', Courier, monospace;
        }
        pre {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
        }
        .mermaid {
            margin: 20px 0;
            text-align: center;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 20px 0;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f8f9fa;
        }
        img {
            max-width: 100%;
            height: auto;
        }
    </style>
</head>
<body>
    ${html}
    <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
    <script>
        mermaid.initialize({ startOnLoad: true });
    </script>
</body>
</html>
`;

// Write the HTML file
fs.writeFileSync(path.join(__dirname, 'docs', 'authentication.html'), fullHtml);

// Generate PDF using Puppeteer
async function generatePDF() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Load the HTML file
    await page.goto(`file:${path.join(__dirname, 'docs', 'authentication.html')}`, {
        waitUntil: 'networkidle0'
    });
    
    // Generate PDF
    await page.pdf({
        path: path.join(__dirname, 'docs', 'authentication.pdf'),
        format: 'A4',
        margin: {
            top: '20px',
            right: '20px',
            bottom: '20px',
            left: '20px'
        }
    });
    
    await browser.close();
}

generatePDF().catch(console.error); 