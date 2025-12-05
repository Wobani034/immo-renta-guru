import { SimulationInputs, SimulationResults, formatCurrency } from './calculations';

// Base64 encoded Alpaca logo - we'll use a placeholder that gets replaced at runtime
const ALPACA_LOGO_BASE64 = 'data:image/png;base64,';

export function generatePdfContent(
  inputs: SimulationInputs,
  results: SimulationResults,
  logoBase64?: string
): string {
  const date = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const logoSrc = logoBase64 || ALPACA_LOGO_BASE64;

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Rapport de simulation de rentabilité – Alpaca Immobilier</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @page {
      size: A4;
      margin: 20mm 15mm 30mm 15mm;
    }
    body { 
      font-family: 'Helvetica Neue', Arial, sans-serif; 
      color: #1c3f7c; 
      line-height: 1.6;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
      background: white;
      position: relative;
      min-height: 100vh;
    }
    .page-footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 15px 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid #e0e0e0;
      background: white;
    }
    .footer-logo {
      height: 40px;
      width: auto;
    }
    .footer-contact {
      text-align: right;
      font-size: 11px;
      color: #666;
    }
    .footer-contact a {
      color: #1c3f7c;
      text-decoration: none;
    }
    .header { 
      display: flex;
      align-items: center;
      gap: 20px;
      border-bottom: 3px solid #1c3f7c; 
      padding-bottom: 20px; 
      margin-bottom: 30px;
    }
    .header-logo {
      height: 60px;
      width: auto;
    }
    .header-content h1 { 
      color: #1c3f7c; 
      font-size: 22px; 
      margin-bottom: 4px;
    }
    .header-content .subtitle {
      font-size: 14px;
      color: #1c3f7c;
      font-weight: 500;
    }
    .header-content .date { 
      color: #666; 
      font-size: 12px;
      margin-top: 4px;
    }
    .section { 
      margin-bottom: 24px;
    }
    .section-title { 
      font-size: 14px; 
      font-weight: 600; 
      color: #1c3f7c; 
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 12px;
      padding-bottom: 6px;
      border-bottom: 1px solid #e0e0e0;
    }
    .item { 
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #f0f0f0;
    }
    .item-label { 
      color: #666;
      font-size: 13px;
    }
    .item-value { 
      font-weight: 600;
      font-size: 13px;
      color: #1c3f7c;
    }
    .highlight-box {
      background: #1c3f7c;
      color: white;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .highlight-box h3 {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      opacity: 0.9;
      margin-bottom: 6px;
    }
    .highlight-box .value {
      font-size: 28px;
      font-weight: 700;
    }
    .result-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-top: 16px;
    }
    .result-card {
      background: #f5f7fa;
      padding: 16px;
      border-radius: 6px;
      border-left: 3px solid #1c3f7c;
    }
    .result-card .label {
      font-size: 11px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .result-card .value {
      font-size: 20px;
      font-weight: 700;
      color: #1c3f7c;
      margin-top: 4px;
    }
    .disclaimer {
      margin-top: 30px;
      padding: 12px;
      background: #fef9e7;
      border-radius: 6px;
      font-size: 11px;
      color: #666;
      text-align: center;
      font-style: italic;
    }
    .page-break {
      page-break-before: always;
      margin-top: 40px;
    }
    .content-wrapper {
      padding-bottom: 80px;
    }
    @media print {
      body { 
        padding: 20px; 
        -webkit-print-color-adjust: exact; 
        print-color-adjust: exact; 
      }
      .highlight-box { 
        -webkit-print-color-adjust: exact; 
        print-color-adjust: exact; 
      }
      .result-card { 
        -webkit-print-color-adjust: exact; 
        print-color-adjust: exact; 
      }
      .page-footer {
        position: fixed;
        bottom: 0;
      }
    }
  </style>
</head>
<body>
  <div class="content-wrapper">
    <!-- Page 1: Header and Parameters -->
    <div class="header">
      <img src="${logoSrc}" alt="Alpaca Immobilier" class="header-logo" />
      <div class="header-content">
        <h1>Rapport de simulation de rentabilité</h1>
        <div class="subtitle">${inputs.title || 'Simulation immobilière'}</div>
        <div class="date">Généré le ${date}</div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Coût d'acquisition</div>
      <div class="item">
        <span class="item-label">Prix net vendeur</span>
        <span class="item-value">${formatCurrency(inputs.netSellerPrice)}</span>
      </div>
      <div class="item">
        <span class="item-label">Frais d'agence</span>
        <span class="item-value">${formatCurrency(inputs.agencyFees)}</span>
      </div>
      <div class="item">
        <span class="item-label">Frais de notaire (${inputs.notaryFeesPercent}%)</span>
        <span class="item-value">${formatCurrency(results.notaryFees)}</span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Travaux</div>
      <div class="item">
        <span class="item-label">Enveloppe travaux</span>
        <span class="item-value">${formatCurrency(inputs.renovationBudget)}</span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Revenus locatifs</div>
      <div class="item">
        <span class="item-label">Loyer mensuel attendu</span>
        <span class="item-value">${formatCurrency(inputs.monthlyRent)}</span>
      </div>
      <div class="item">
        <span class="item-label">Loyer annuel</span>
        <span class="item-value">${formatCurrency(inputs.monthlyRent * 12)}</span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Financement</div>
      <div class="item">
        <span class="item-label">Durée du crédit</span>
        <span class="item-value">${inputs.creditDuration} ans</span>
      </div>
      <div class="item">
        <span class="item-label">Taux d'emprunt</span>
        <span class="item-value">${inputs.interestRate}%</span>
      </div>
      <div class="item">
        <span class="item-label">Part financée</span>
        <span class="item-value">${inputs.financingPercent}%</span>
      </div>
      <div class="item">
        <span class="item-label">Montant emprunté</span>
        <span class="item-value">${formatCurrency(results.loanAmount)}</span>
      </div>
    </div>

    <!-- Page 2: Results -->
    <div class="page-break">
      <div class="highlight-box">
        <h3>Coût total du projet</h3>
        <div class="value">${formatCurrency(results.totalProjectCost)}</div>
      </div>

      <div class="section">
        <div class="section-title">Résultats de la simulation</div>
        <div class="result-grid">
          <div class="result-card">
            <div class="label">Rentabilité brute actuelle</div>
            <div class="value">${results.currentProfitability.toFixed(2)}%</div>
          </div>
          <div class="result-card">
            <div class="label">Mensualité crédit</div>
            <div class="value">${formatCurrency(results.monthlyPayment)}</div>
          </div>
          <div class="result-card">
            <div class="label">Coût total des intérêts</div>
            <div class="value">${formatCurrency(results.totalInterestCost)}</div>
          </div>
          <div class="result-card">
            <div class="label">Objectif de rentabilité</div>
            <div class="value">${inputs.targetProfitability}%</div>
          </div>
        </div>
      </div>

      <div class="highlight-box" style="background: #2d7d6e;">
        <h3>Prix net vendeur maximum pour ${inputs.targetProfitability}% de rentabilité</h3>
        <div class="value">${formatCurrency(results.maxNetSellerPrice)}</div>
        <div style="margin-top: 6px; opacity: 0.9; font-size: 13px;">
          Coût total max : ${formatCurrency(results.maxTotalCost)}
        </div>
      </div>

      <div class="disclaimer">
        Simulation indicative et non contractuelle. Les résultats sont fournis à titre informatif.
      </div>
    </div>
  </div>

  <!-- Fixed Footer -->
  <div class="page-footer">
    <img src="${logoSrc}" alt="Alpaca Immobilier" class="footer-logo" />
    <div class="footer-contact">
      <div><a href="https://alpaca.immo">alpaca.immo</a></div>
      <div><a href="mailto:contact@alpaca.immo">contact@alpaca.immo</a></div>
      <div><a href="tel:0970703107">09 70 70 31 07</a></div>
    </div>
  </div>
</body>
</html>
  `;
}

// Convert image to base64
async function getLogoBase64(): Promise<string> {
  try {
    const response = await fetch('/src/assets/alpaca-logo.png');
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Failed to load logo:', error);
    return '';
  }
}

export async function exportToPdf(inputs: SimulationInputs, results: SimulationResults): Promise<void> {
  // Load logo as base64
  const logoBase64 = await getLogoBase64();
  const content = generatePdfContent(inputs, results, logoBase64);
  
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.focus();
    
    // Wait for content and images to load then print
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }
}
