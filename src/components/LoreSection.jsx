import React from 'react';
import './LoreSection.css';

const theories = [
  { title: "Теория 1: Яблоки с Глазами", content: "Миром управляют Яблоки с Глазами. Их семечки — это органические передатчики, а сок — способ контроля разума." },
  { title: "Теория 2: Разгадка «Сына Человеческого»", content: "На картине Магритта изображен сам Баян. Яблоко — это не просто фрукт, это его истинное всевидящее Око." },
  { title: "Теория 3: Иллюзия Континентов", content: "Вся поверхность планеты — это микрорайоны и переулки Сумской области, где выращивают те самые Яблоки с Глазами." }
];

const bayanovTimeline = [
  { age: "13 лет", desc: "Никому неизвестный продавец покрышек на Волгу." },
  { age: "18 лет", desc: "Мать упала в колодец." },
  { age: "40 лет", desc: "Заклеван петухом, но стал известным и никому не нужным продавцом покрышек на Волгу." },
  { age: "67-69 лет", desc: "Потерялся в лесу, находился там до 69 лет. Развил Деменцию." }
];

const LoreSection = () => {
  return (
    <section className="lore-section">
      <div className="glass-panel lore-content">
        <h2 className="text-gradient hover-effect">Великая Борьба за Яблоки</h2>
        <p>
          Давным-давно мир был серым, пока <strong>Руслана</strong> — легендарная Архи-Разнорабочая — не принесла из глубин Сумской области первый саженец Истинной Яблони. Так появилась Яблочная Экономика, где государственная валюта — это свежая антоновка.
        </p>
      </div>

      <div className="theories-grid">
        {theories.map((theory, idx) => (
          <div key={idx} className="glass-panel theory-card">
            <h3>{theory.title}</h3>
            <p>{theory.content}</p>
          </div>
        ))}
      </div>

      <div className="glass-panel lore-content" style={{ marginTop: '3rem' }}>
        <h2 className="text-gradient hover-effect">Хит-парад Жизни Юрия Баянова</h2>
        <ul style={{ textAlign: 'left', listStyle: 'none', padding: 0, fontSize: '1.2rem', lineHeight: '1.8' }}>
          {bayanovTimeline.map((item, idx) => (
            <li key={idx} style={{ marginBottom: '1rem', borderLeft: '3px solid var(--apple-green)', paddingLeft: '1rem' }}>
              <strong>Юрий Баянов, {item.age}:</strong> {item.desc}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default LoreSection;
