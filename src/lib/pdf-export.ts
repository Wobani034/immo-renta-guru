import { SimulationInputs, SimulationResults, formatCurrency, formatPercent } from './calculations';

export function generatePdfContent(
  inputs: SimulationInputs,
  results: SimulationResults
): string {
  const date = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>${inputs.title || 'Simulation immobilière'}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Helvetica Neue', Arial, sans-serif; 
      color: #1a1a2e; 
      line-height: 1.6;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }
    .header { 
      border-bottom: 3px solid #1e3a5f; 
      padding-bottom: 20px; 
      margin-bottom: 30px;
    }
    .header h1 { 
      color: #1e3a5f; 
      font-size: 28px; 
      margin-bottom: 8px;
    }
    .header .date { 
      color: #666; 
      font-size: 14px;
    }
    .section { 
      margin-bottom: 30px;
    }
    .section-title { 
      font-size: 16px; 
      font-weight: 600; 
      color: #1e3a5f; 
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid #e0e0e0;
    }
    .grid { 
      display: grid; 
      grid-template-columns: 1fr 1fr; 
      gap: 16px;
    }
    .item { 
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;
    }
    .item-label { 
      color: #666;
      font-size: 14px;
    }
    .item-value { 
      font-weight: 600;
      font-size: 14px;
    }
    .highlight-box {
      background: linear-gradient(135deg, #1e3a5f 0%, #2c7a7b 100%);
      color: white;
      padding: 24px;
      border-radius: 12px;
      margin: 24px 0;
    }
    .highlight-box h3 {
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 1px;
      opacity: 0.9;
      margin-bottom: 8px;
    }
    .highlight-box .value {
      font-size: 32px;
      font-weight: 700;
    }
    .result-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-top: 20px;
    }
    .result-card {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
    }
    .result-card .label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .result-card .value {
      font-size: 24px;
      font-weight: 700;
      color: #1e3a5f;
      margin-top: 4px;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      font-size: 12px;
      color: #999;
      text-align: center;
    }
    @media print {
      body { padding: 20px; }
      .highlight-box { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .result-card { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${inputs.title || 'Simulation de rentabilité immobilière'}</h1>
    <div class="date">Générée le ${date}</div>
  </div>

  <div class="section">
    <div class="section-title">Paramètres du bien</div>
    <div class="item">
      <span class="item-label">Loyer mensuel attendu</span>
      <span class="item-value">${formatCurrency(inputs.monthlyRent)}</span>
    </div>
    <div class="item">
      <span class="item-label">Prix net vendeur</span>
      <span class="item-value">${formatCurrency(inputs.netSellerPrice)}</span>
    </div>
    <div class="item">
      <span class="item-label">Frais d'agence</span>
      <span class="item-value">${formatCurrency(inputs.agencyFees)}</span>
    </div>
    <div class="item">
      <span class="item-label">Enveloppe travaux</span>
      <span class="item-value">${formatCurrency(inputs.renovationBudget)}</span>
    </div>
    <div class="item">
      <span class="item-label">Frais de notaire</span>
      <span class="item-value">${inputs.notaryFeesPercent}% (${formatCurrency(results.notaryFees)})</span>
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

  <div class="highlight-box">
    <h3>Coût total du projet</h3>
    <div class="value">${formatCurrency(results.totalProjectCost)}</div>
  </div>

  <div class="section">
    <div class="section-title">Résultats</div>
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
        <div class="label">Objectif rentabilité</div>
        <div class="value">${inputs.targetProfitability}%</div>
      </div>
    </div>
  </div>

  <div class="highlight-box" style="background: linear-gradient(135deg, #2c7a7b 0%, #38a169 100%);">
    <h3>Prix net vendeur max pour ${inputs.targetProfitability}% de rentabilité</h3>
    <div class="value">${formatCurrency(results.maxNetSellerPrice)}</div>
    <div style="margin-top: 8px; opacity: 0.9; font-size: 14px;">
      Coût total max : ${formatCurrency(results.maxTotalCost)}
    </div>
  </div>

  <div class="footer">
    Simulation générée avec Calculateur de Rentabilité Immobilière
  </div>
</body>
</html>
  `;
}

export function exportToPdf(inputs: SimulationInputs, results: SimulationResults): void {
  const content = generatePdfContent(inputs, results);
  
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.focus();
    
    // Wait for content to load then print
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }
}
