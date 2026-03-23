import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './GelbooruGallery.css';

const GelbooruGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const apiKey = import.meta.env.VITE_GELBOORU_API_KEY;
        const userId = import.meta.env.VITE_GELBOORU_USER_ID;
        const targetUrl = encodeURIComponent(`https://gelbooru.com/index.php?page=dapi&s=post&q=index&tags=apple+-rating:explicit&api_key=${apiKey}&user_id=${userId}&json=1&limit=8`);
        const res = await axios.get(`https://api.allorigins.win/raw?url=${targetUrl}`);
        if (res.data && res.data.post) {
          setImages(res.data.post);
        }
      } catch (error) {
        console.error("Ошибка API Gelbooru:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  return (
    <section className="gallery-section">
      <div className="glass-panel">
        <h2 className="text-gradient hover-effect" style={{ textAlign: 'center' }}>Святилище Артов</h2>
        <p style={{ textAlign: 'center', marginBottom: '2rem' }}>Живая галерея Яблок Сумской области с закрытых серверов (Gelbooru).</p>
        
        {loading ? (
          <p style={{ textAlign: 'center' }}>Сбор урожая картинок...</p>
        ) : (
          <div className="gallery-grid">
            {images.map((img) => (
              <a key={img.id} href={img.file_url} target="_blank" rel="noreferrer" className="gallery-img-wrapper">
                <img src={img.preview_url} alt="Яблоко" loading="lazy" />
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default GelbooruGallery;
