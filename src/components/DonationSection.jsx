import React, { useState } from 'react';
import { Copy, CheckCircle, ExternalLink, Smartphone } from 'lucide-react';
import './DonationSection.css';

const DonationSection = () => {
  const [copied, setCopied] = useState(false);
  const tonAddress = 'UQBwPqILb-tdMmp07f8X2JHmgcG1Pm8kZSv4JYGRpP-Xeewa';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(tonAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="donation-container">
      <div className="donation-glass-card">
        <h2 className="biblical-header donation-title">Подношения на Сад и Раствор</h2>
        <p className="donation-desc">
          Чтобы Яблоки не червивели, а раствор не сох в гаражных кооперативах Великого Баяна — 
          поддержи проект своим праведным вкладом. Любое подношение ускоряет Глянец и укрепляет Континенты.
        </p>

        <div className="ton-address-box">
          <div className="ton-header">
            <Smartphone size={20} className="ton-icon" />
            <span>TON Address (Tonkeeper)</span>
          </div>
          <div className="address-display">
            <code>{tonAddress}</code>
            <button 
              className={`copy-btn ${copied ? 'copied' : ''}`} 
              onClick={copyToClipboard}
              title="Скопировать путь к истине"
            >
              {copied ? <CheckCircle size={20} /> : <Copy size={20} />}
            </button>
          </div>
          {copied && <span className="copy-toast">Адрес впитан буфером обмена!</span>}
        </div>

        <div className="donation-footer">
          <a 
            href={`https://tonviewer.com/${tonAddress}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="ton-link"
          >
            Посмотреть в блокчейне <ExternalLink size={14} />
          </a>
        </div>
      </div>

      <div className="bayan-quote-box">
        <p className="bayan-quote">
          "Пока ты жадничаешь на яблочный раствор, где-то в Сумах один прораб плачет кровавыми слезами. 
          Не будь червивым огрызком, уматузи донат!"
        </p>
        <span className="quote-author">— Из Неизданных Проповедей Юрия</span>
      </div>
    </div>
  );
};

export default DonationSection;
