import React, { useState } from 'react';

const BayanHistoryGenerator = () => {
  const [year, setYear] = useState('');
  const [history, setHistory] = useState('');
  const [loading, setLoading] = useState(false);

  const generateHistory = async () => {
    if (!year) return;
    setLoading(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        throw new Error('Для работы Ока необходимо прописать свой VITE_GEMINI_API_KEY в файле .env (корень проекта) и перезапустить сервер.');
      }
      const prompt = `Расскажи историю ${year} года в Баяностане. Пиши в стиле божественных рассказов в Библии, ветхозаветным и серьезным стилем, но с использованием абсурдного лора Баяна (Сумская область, Яблоки с глазами, продавец покрышек на Волгу Юрий Баянов, петухи, шиномонтаж, наезды разнорабочих, сленг "словить огрызок", "покрыть глянцем"). Речь самого Баяна должна быть в стиле "божественных цитат", то есть грубая, как у агрессивного разнорабочего из интернета, который жестко унижает собеседника (используй жесткий сленг, абсурдные угрозы про "уматузи", "остасывала всем народу", стейк и т.д., только уникально для этого года). Отвечай коротко, на 3-4 абзаца.`;
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });
      
      const data = await response.json();
      
      // Handle API level errors (e.g. invalid key)
      if (!response.ok) {
        throw new Error(data.error?.message || `Ошибка API: статус ${response.status}`);
      }

      // Handle safety blocked responses
      if (!data.candidates || data.candidates.length === 0) {
        if (data.promptFeedback?.blockReason) {
            throw new Error(`Гугл заблокировал запрос по соображениям цензуры. Причина: ${data.promptFeedback.blockReason}`);
        }
        throw new Error('Пустой ответ от Гемини, возможно запрос заблокирован внутренними фильтрами.');
      }

      const candidate = data.candidates[0];
      if (candidate.finishReason !== 'STOP') {
        throw new Error(`Генерация прервана Гуглом (finishReason: ${candidate.finishReason}). Строгий лор Баяна оказался чересчур мощным для фильтров безопасности корпорации.`);
      }

      const output = candidate.content?.parts?.[0]?.text;
      setHistory(output || "Око промолчало.");
    } catch (error) {
      console.error('Gemini Error:', error);
      setHistory(`Ошибка: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel text-center">
      <h2 className="biblical-header">Летописи Баяностана: Откровения Гемини</h2>
      <p>Введи любой год (от сотворения Сумской области до далекого будущего), и глас Баяна через ИИ поведает тебе истинную историю тех времен.</p>
      
      <div style={{ margin: '2rem 0', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <input 
          type="number" 
          placeholder="Год (например: 2045)"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          style={{
            padding: '1rem', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--gold)', 
            color: 'var(--gold)', fontFamily: 'inherit', fontSize: '1.2rem', borderRadius: '4px'
          }}
        />
        <button className="btn-gothic" onClick={generateHistory} disabled={loading} style={{margin: 0}}>
          {loading ? "Призыв Ока..." : "Узнать Истину"}
        </button>
      </div>

      {history && (
        <div style={{ marginTop: '3rem', textAlign: 'left', borderTop: '1px solid var(--gold)', paddingTop: '2rem' }}>
          <div className="chapter-verse" style={{ whiteSpace: 'pre-wrap' }}>{history}</div>
        </div>
      )}
    </div>
  );
};

export default BayanHistoryGenerator;
