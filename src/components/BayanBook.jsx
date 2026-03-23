import React, { useState, useEffect } from 'react';

const bayanRules = [
  "1. Не возжелай запчасти на Жигули, ибо Истина только в Покрышках на Волгу R15.",
  "2. Не клади кирпич на сухую, но всегда используй Яблочный Раствор (Сидр), нарушающий законы гравитации.",
  "3. Если узришь Петуха Окаянного возле Кабеля Истины — заклевать немедля и сотворить священный Стейк 28/9.",
  "4. Чти матуху свою, дабы не остасывала она всем народу причмокивая, а гордилась сыном-разнорабочим.",
  "5. Запрещено словить огрызок на стройке! Трудись лишь за целые, наливные яблоки.",
  "6. Всякий червивый прораб должен быть обматерен и предан суду Глазастых Яблок.",
  "7. Не верь глобусам и картам Иллюзии Континентов. Земля — это бесконечные гаражные кооперативы Сумской области.",
  "8. Давать по яблоку и пускать сок на работе — твоя святая обязанность.",
  "9. Глазастые Яблоки наблюдают за тобой из вазочки на кухне. Не прячь от них лицо.",
  "10. Волга — артефакт, покрышка — мощи. Храни ржавый домкрат в углу гаража своего, пока не придет Время Разборки."
];

const BayanBook = () => {
  return (
    <section className="bayan-book glass-panel" style={{ padding: '3rem', borderRadius: '30px', margin: '2rem auto', maxWidth: '1000px' }}>
      <h2 className="biblical-header" style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '2.5rem' }}>10 Правил Баяностана</h2>
      <p style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '1.2rem', color: '#9ca3af' }}>Свод священных догматов для каждого истинного разнорабочего.</p>
      
      <div className="book-columns" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '850px', margin: '0 auto' }}>
        {bayanRules.map((rule, idx) => (
          <article key={idx} className="chapter-verse" style={{
            borderLeft: '5px solid var(--apple-green)', 
            padding: '1.5rem 2rem', 
            background: 'rgba(255, 255, 255, 0.03)', 
            borderRadius: '15px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderLeftColor: 'var(--apple-green)',
            transition: 'transform 0.3s ease',
            cursor: 'default'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(10px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
          >
            <strong style={{ color: 'var(--apple-green)', fontSize: '1.1rem', display: 'block', marginBottom: '0.5rem' }}>Правило {idx + 1}:</strong> 
            <span style={{ fontSize: '1.1rem', color: '#fff', lineHeight: '1.6' }}>{rule.substring(rule.indexOf('.') + 2)}</span>
          </article>
        ))}
      </div>
    </section>
  );
};

export default BayanBook;
