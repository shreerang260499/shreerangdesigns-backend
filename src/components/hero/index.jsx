import React, { useState, useEffect } from 'react';
import HeroSection from './HeroSection';

const Hero = ({ variant = 'default' }) => {
  const [content, setContent] = useState(null);

  useEffect(() => {
    // Load hero content from JSON file
    fetch('/hero/content/hero-content.json')
      .then(res => res.json())
      .then(data => {
        setContent(data[variant] || data.default);
      })
      .catch(err => {
        console.error('Error loading hero content:', err);
        // Fallback to default content if loading fails
        setContent(data.default);
      });
  }, [variant]);

  if (!content) return null; // Or a loading state

  return <HeroSection content={content} />;
};

export default Hero;
