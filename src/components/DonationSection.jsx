import React, { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import './DonationSection.css';

const DonationSection = () => {
  const [copied, setCopied] = useState(false);
  const tonAddress = 'UQBwPqILb-tdMmp07f8X2JHmgcG1Pm8kZSv4JYGRpP-Xeewa';

  const copyAddress = () => {
    navigator.clipboard.writeText(tonAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="donation-container glass-panel">
      <div className="donation-header">
        <div className="bayan-coin">🍎</div>
        <h2 className="biblical-header">Подношения Баяну</h2>
        <p className="donation-subtitle">Поддержи Великое Сумское Государство яблочным раствором (TON)</p>
      </div>

      <div className="donation-card">
        <label className="wallet-label">Адрес Tonkeeper</label>
        <div className="wallet-box">
          <code className="wallet-address">{tonAddress}</code>
          <button className={`copy-btn ${copied ? 'copied' : ''}`} onClick={copyAddress}>
            {copied ? <Check size={20} /> : <Copy size={20} />}
          </button>
        </div>

        <div className="donation-guide">
          <div className="guide-step">
            <span className="step-num">1</span>
            <p>Открой Tonkeeper или любой другой кошелек TON</p>
          </div>
          <div className="guide-step">
            <span className="step-num">2</span>
            <p>Скопируй адрес выше (проверь каждый символ, червивый прораб!)</p>
          </div>
          <div className="guide-step">
            <span className="step-num">3</span>
            <p>Отправь пожертвование, и твоя карма покроется глянцем</p>
          </div>
        </div>

        <a 
          href={`https://tonviewer.com/${tonAddress}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="explorer-link"
        >
          Посмотреть в блокчейне <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
};

export default DonationSection;
