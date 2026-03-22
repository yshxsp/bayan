import React, { useState } from 'react';
import './WikiSection.css';
import { ChevronDown, ChevronUp } from 'lucide-react';

const slangData = [
  { term: "Словить огрызок", def: "Взять очень невыгодный, тяжелый заказ на стройке с нищенской оплатой." },
  { term: "Навести глянец", def: "Идеально выполнить финишную отделку, чтобы сияло, как отполированное яблоко." },
  { term: "Червивый прораб", def: "Недобросовестный начальник, обманывающий с оплатой или сроками." },
  { term: "Дать по яблоку", def: "Усердно работать до седьмого пота, отдаваясь процессу." },
  { term: "Сбор урожая", def: "День выдачи зарплаты яблоками." },
  { term: "Яблочный Раствор (Сидр)", def: "Бетонная или клеевая смесь для кладки безупречного качества." }
];

const WikiSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="wiki-section">
      <div className="glass-panel">
        <h2 className="text-gradient" style={{ textAlign: 'center' }}>Сленг Разнорабочих</h2>
        <div className="accordion">
          {slangData.map((item, index) => (
            <div key={index} className="accordion-item">
              <div className="accordion-header" onClick={() => toggleAccordion(index)}>
                <h3>{item.term}</h3>
                {openIndex === index ? <ChevronUp className="icon"/> : <ChevronDown className="icon"/>}
              </div>
              {openIndex === index && (
                <div className="accordion-body">
                  <p>{item.def}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WikiSection;
