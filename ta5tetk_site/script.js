// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function () {
    const startBtn = document.getElementById('startBtn');
    const assessmentForm = document.getElementById('assessmentForm');
    const restartBtn = document.getElementById('restartBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const homeSection = document.getElementById('home');
    const questionnaireSection = document.getElementById('questionnaire');
    const resultsSection = document.getElementById('results');
    const resultsContent = document.getElementById('resultsContent');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');

    // Show questionnaire on start
    startBtn.addEventListener('click', function () {
        homeSection.classList.add('d-none');
        questionnaireSection.classList.remove('d-none');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        updateProgress();
    });

    // Restart assessment
    restartBtn.addEventListener('click', function () {
        assessmentForm.reset();
        resultsSection.classList.add('d-none');
        homeSection.classList.remove('d-none');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (progressBar) { progressBar.style.width = '0%'; }
        if (progressText) { progressText.textContent = '0%'; }
    });

    // Generate report for download
    downloadBtn.addEventListener('click', function () {
        generateReport();
    });

    // Handle form submission
    assessmentForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const companyName = document.getElementById('companyName').value.trim();
        if (!companyName) {
            alert('Please enter the company name.');
            return;
        }

        const inputs = assessmentForm.querySelectorAll('input[type="radio"]:checked');
        let totalPoints = 0;
        const categoryPoints = {};
        const categoryMaxPoints = {};
        const answerMap = {};

        inputs.forEach(input => {
            const value = parseInt(input.value, 10);
            const category = input.dataset.category;
            const name = input.name;
            totalPoints += value;

            if (!categoryPoints[category]) {
                categoryPoints[category] = 0;
            }
            categoryPoints[category] += value;

            answerMap[name] = value;
        });

        // Compute maximum points per category
        const radioGroups = {};
        assessmentForm.querySelectorAll('input[type="radio"]').forEach(input => {
            const name = input.name;
            const category = input.dataset.category;
            const value = parseInt(input.value, 10);
            if (!radioGroups[name]) radioGroups[name] = { category: category, max: 0 };
            if (value > radioGroups[name].max) radioGroups[name].max = value;
        });

        Object.keys(radioGroups).forEach(name => {
            const { category, max } = radioGroups[name];
            if (!categoryMaxPoints[category]) categoryMaxPoints[category] = 0;
            categoryMaxPoints[category] += max;
        });

        let totalMaxPoints = 0;
        Object.keys(categoryMaxPoints).forEach(cat => {
            totalMaxPoints += categoryMaxPoints[cat];
        });

        const riskPercent = Math.round((totalPoints / totalMaxPoints) * 100);

        let classification = '';
        if (riskPercent <= 30) {
            classification = 'Low Risk';
        } else if (riskPercent <= 60) {
            classification = 'Medium Risk';
        } else {
            classification = 'High Risk';
        }

        const costEstimate = Math.round(riskPercent * 2500);

        const categoryBreakdown = {};
        Object.keys(categoryPoints).forEach(cat => {
            const max = categoryMaxPoints[cat] || 1;
            const percent = Math.round((categoryPoints[cat] / max) * 100);
            categoryBreakdown[cat] = percent;
        });

        const highRiskCategories = Object.keys(categoryBreakdown).filter(cat => categoryBreakdown[cat] > 50);

        let strategyRecommendation = '';

        // --- NEW: M&A Integration Recommendation (Core Task 1) ---
        let integrationDecision = '';

        if (riskPercent <= 30) {
            integrationDecision = `
                <div class="decision low">
                    <h4 style="color:#198754;">✔ Recommended Action: Full Integration</h4>
                    <p>The target organization meets the minimum cyber hygiene and shows low-risk indicators. 
                    Systems may be connected directly to the parent company with standard monitoring.</p>
                </div>
            `;
        } 
        else if (riskPercent <= 60) {
            integrationDecision = `
                <div class="decision medium">
                    <h4 style="color:#fd7e14;">⚠ Recommended Action: Segmented Integration</h4>
                    <p>Some areas require remediation before full connection. Keep high-risk systems isolated 
                    until fixes are applied. Low-risk assets may be connected gradually.</p>
                </div>
            `;
        } 
        else {
            integrationDecision = `
                <div class="decision high">
                    <h4 style="color:#dc3545;">✖ Recommended Action: Ring-Fenced Environment</h4>
                    <p>The target shows critical weaknesses. All systems must remain isolated. 
                    A secure clean-room rebuild is recommended before integration.</p>
                </div>
            `;
        }

        if (classification === 'Low Risk') {
            strategyRecommendation = '<strong>Integration Strategy:</strong> Full integration is recommended. Systems and networks can be merged with minimal restrictions, ensuring standard security controls and continuous monitoring.';
        } else if (classification === 'Medium Risk') {
            strategyRecommendation = '<strong>Integration Strategy:</strong> Segmented integration is advisable. High-risk systems should remain isolated until remedial measures are completed; low-risk systems may be integrated gradually.';
        } else {
            strategyRecommendation = '<strong>Integration Strategy:</strong> Ring-fenced or clean-room rebuild is required. Critical systems must be isolated, and rebuilding them in a secure environment is recommended before any integration.';
        }

        let remediation = '<strong>Recommended Remediation:</strong><ul>';
        if (highRiskCategories.length === 0) {
            remediation += '<li>Overall security posture is healthy. Continue to maintain and monitor existing controls.</li>';
        } else {
            highRiskCategories.forEach(cat => {
                if (cat === 'Systems') {
                    remediation += '<li>Update or replace unsupported operating systems. Implement an automated patch management program.</li>';
                } else if (cat === 'Identity') {
                    remediation += '<li>Deploy a centralized identity management system and enforce multi-factor authentication for all critical systems.</li>';
                } else if (cat === 'Network') {
                    remediation += '<li>Reconfigure firewalls and ensure network segmentation to limit lateral movement.</li>';
                } else if (cat === 'Threat') {
                    remediation += '<li>Perform comprehensive vulnerability scans and implement a vulnerability management lifecycle. Investigate and remediate any breaches immediately.</li>';
                } else if (cat === 'Logging') {
                    remediation += '<li>Enable comprehensive logging and deploy a Security Information and Event Management (SIEM) solution to monitor logs continuously.</li>';
                } else if (cat === 'Data') {
                    remediation += '<li>Ensure regular backups are performed and tested. Encrypt sensitive data both at rest and in transit.</li>';
                } else if (cat === 'Compliance') {
                    remediation += '<li>Align with recognised security standards (e.g., ISO 27001) and conduct assessments on all SaaS providers.</li>';
                } else if (cat === 'Continuity') {
                    remediation += '<li>Create or update incident response and business continuity plans. Conduct regular drills and updates.</li>';
                } else if (cat === 'Awareness') {
                    remediation += '<li>Provide regular cybersecurity awareness training to all employees.</li>';
                } else if (cat === 'Physical') {
                    remediation += '<li>Enhance physical security controls and implement measures against insider threats.</li>';
                } else if (cat === 'Supply') {
                    remediation += '<li>Conduct security assessments for all suppliers and partners to ensure supply chain security.</li>';
                } else if (cat === 'Cloud') {
                    remediation += '<li>Review cloud configurations to ensure least privilege and encryption. Apply security best practices to all cloud services.</li>';
                }
            });
        }
        remediation += '</ul>';

        let consequences = '<strong>Potential Consequences if Not Addressed:</strong><ul>';
        consequences += '<li>Increased likelihood of data breaches and loss of sensitive information.</li>';
        consequences += '<li>Regulatory penalties for non-compliance and potential legal liabilities.</li>';
        consequences += '<li>Operational disruptions leading to downtime and lost productivity.</li>';
        consequences += '<li>Reputational damage and loss of customer trust.</li>';
        consequences += '</ul>';

        let html = '';
        html += `<h3>${companyName}</h3>`;
        html += `<p><strong>Total Risk Score:</strong> ${totalPoints} / ${totalMaxPoints}</p>`;
        html += `<p><strong>Risk Percentage:</strong> ${riskPercent}%</p>`;

        let classificationColor;
        if (classification === 'Low Risk') classificationColor = '#198754';
        else if (classification === 'Medium Risk') classificationColor = '#fd7e14';
        else classificationColor = '#dc3545';

        html += `<p><strong>Classification:</strong> <span style="color:${classificationColor}; font-weight:600;">${classification}</span></p>`;
        html += `<p><strong>Estimated Remediation Cost:</strong> ${costEstimate.toLocaleString('en-US')} EGP</p>`;

        // Integration decision block (new visible task)
        html += `<div class="integration-decision-block">${integrationDecision}</div>`;

        // Chart canvas
        html += '<div class="my-4"><canvas id="riskChart" height="250"></canvas></div>';

        html += `<p>${strategyRecommendation}</p>`;
        html += remediation;
        html += consequences;

        resultsContent.innerHTML = html;

        questionnaireSection.classList.add('d-none');
        resultsSection.classList.remove('d-none');

        {
            const canvas = document.getElementById('riskChart');
            const labels = Object.keys(categoryBreakdown);
            const data = labels.map(label => categoryBreakdown[label]);
            drawCustomBarChart(canvas, labels, data);
        }

        window.secureMergeData = {
            companyName: companyName,
            totalPoints: totalPoints,
            totalMaxPoints: totalMaxPoints,
            riskPercent: riskPercent,
            classification: classification,
            costEstimate: costEstimate,
            categoryBreakdown: categoryBreakdown,
            strategyRecommendation: strategyRecommendation,
            remediation: remediation,
            consequences: consequences,
            integrationDecision: integrationDecision
        };
    });

    // Update progress bar
    function updateProgress() {
        if (!assessmentForm) return;
        const totalQuestions = new Set(
            Array.from(assessmentForm.querySelectorAll('input[type="radio"]')).map(i => i.name)
        ).size;
        const answered = assessmentForm.querySelectorAll('input[type="radio"]:checked').length;
        const percent = totalQuestions === 0 ? 0 : Math.round((answered / totalQuestions) * 100);
        if (progressBar) progressBar.style.width = percent + '%';
        if (progressText) progressText.textContent = percent + '%';
    }

    assessmentForm.addEventListener('change', function (e) {
        if (e.target && e.target.matches('input[type="radio"]')) {
            updateProgress();
        }
    });

    // PDF report
    function generateReport() {
        if (!window.secureMergeData) {
            alert('No assessment data available. Please complete the questionnaire first.');
            return;
        }
        const data = window.secureMergeData;

        if (typeof window.jspdf === 'undefined' || typeof window.jspdf.jsPDF === 'undefined') {
            alert('PDF library not loaded. Unable to generate report.');
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        let y = 10;

        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(`Cyber Risk Assessment Report`, 105, y, { align: 'center' });
        y += 10;

        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Company: ${data.companyName}`, 10, y);
        y += 8;
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 10, y);
        y += 8;
        doc.text(`Total Risk Score: ${data.totalPoints} / ${data.totalMaxPoints}`, 10, y);
        y += 8;
        doc.text(`Risk Percentage: ${data.riskPercent}%`, 10, y);
        y += 8;
        doc.text(`Classification: ${data.classification}`, 10, y);
        y += 8;
        doc.text(`Estimated Remediation Cost: ${data.costEstimate.toLocaleString('en-US')} EGP`, 10, y);
        y += 12;

        // Integration decision (new section)
        doc.setFont('helvetica', 'bold');
        doc.text('Integration Decision', 10, y);
        y += 6;
        doc.setFont('helvetica', 'normal');
        const decisionText = stripHTML(data.integrationDecision || '');
        const decisionLines = doc.splitTextToSize(decisionText, 180);
        doc.text(decisionLines, 10, y);
        y += decisionLines.length * 6 + 6;

        doc.setFont('helvetica', 'bold');
        doc.text('Integration Strategy', 10, y);
        y += 6;
        doc.setFont('helvetica', 'normal');
        const strategyLines = doc.splitTextToSize(stripHTML(data.strategyRecommendation), 180);
        doc.text(strategyLines, 10, y);
        y += strategyLines.length * 6 + 6;

        doc.setFont('helvetica', 'bold');
        doc.text('Recommended Remediation', 10, y);
        y += 6;
        doc.setFont('helvetica', 'normal');
        const remediationText = stripHTML(data.remediation);
        const remediationLines = doc.splitTextToSize(remediationText, 180);
        doc.text(remediationLines, 10, y);
        y += remediationLines.length * 6 + 6;

        doc.setFont('helvetica', 'bold');
        doc.text('Consequences if Not Addressed', 10, y);
        y += 6;
        doc.setFont('helvetica', 'normal');
        const consequencesText = stripHTML(data.consequences);
        const consequencesLines = doc.splitTextToSize(consequencesText, 180);
        doc.text(consequencesLines, 10, y);

        doc.save(`${data.companyName.replace(/\s+/g, '_')}_Cyber_Risk_Report.pdf`);
    }

    // Strip HTML for PDF
    function stripHTML(html) {
        const tmp = document.createElement('DIV');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    }

    // Simple bar chart
    function drawCustomBarChart(canvas, labels, data) {
        if (!canvas || !canvas.getContext) return;
        const ctx = canvas.getContext('2d');

        const width = canvas.clientWidth || canvas.width;
        const height = canvas.height;

        if (canvas.width !== width) {
            canvas.width = width;
        }

        ctx.clearRect(0, 0, width, height);

        const margin = 40;
        const chartWidth = width - margin * 2;
        const chartHeight = height - margin * 2;
        const barSpace = chartWidth / labels.length;
        const barWidth = barSpace * 0.6;
        const gap = barSpace - barWidth;

        ctx.strokeStyle = '#777';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(margin, margin);
        ctx.lineTo(margin, height - margin);
        ctx.lineTo(width - margin, height - margin);
        ctx.stroke();

        ctx.fillStyle = '#555';
        ctx.font = '10px sans-serif';
        for (let i = 0; i <= 4; i++) {
            const value = i * 25;
            const y = margin + chartHeight * (1 - i / 4);
            ctx.beginPath();
            ctx.moveTo(margin - 3, y);
            ctx.lineTo(margin, y);
            ctx.stroke();
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${value}%`, margin - 6, y);
        }

        labels.forEach((label, index) => {
            const x = margin + index * barSpace + gap / 2;
            const barHeight = chartHeight * (data[index] / 100);

            ctx.fillStyle = '#007bff';
            ctx.fillRect(x, height - margin - barHeight, barWidth, barHeight);

            ctx.fillStyle = '#000';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText(`${data[index]}%`, x + barWidth / 2, height - margin - barHeight - 2);

            ctx.textBaseline = 'top';
            const labelLines = wrapText(label, barSpace * 0.9, ctx);
            labelLines.forEach((line, j) => {
                ctx.fillText(line, x + barWidth / 2, height - margin + 4 + j * 12);
            });
        });
    }

    // Wrap text helper
    function wrapText(text, maxWidth, ctx) {
        const words = text.split(/\s+/);
        const lines = [];
        let line = '';
        for (let i = 0; i < words.length; i++) {
            const testLine = line ? line + ' ' + words[i] : words[i];
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && line) {
                lines.push(line);
                line = words[i];
            } else {
                line = testLine;
            }
        }
        if (line) lines.push(line);
        return lines;
    }
});
