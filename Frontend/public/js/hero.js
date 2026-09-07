/* ============================================================
   VOYAGER — Hero Enhancements
   ============================================================ */

document.addEventListener('DOMContentLoaded', function() {
  const nav = document.getElementById('global-nav');
  const heroEyebrow = document.getElementById('hero-eyebrow-text');
  const heroTitle = document.getElementById('hero-title');
  const heroTemp = document.getElementById('hero-temp');
  const heroWeather = document.getElementById('hero-weather-label');
  const indicators = document.querySelectorAll('.hero-indicator');
  const btnPrev = document.getElementById('hero-prev');
  const btnNext = document.getElementById('hero-next');

  // Navbar scroll
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  const slides = [
    { eyebrow: 'The Andaman Islands', title: 'Andaman & Nicobar', temp: '28°C', weather: 'Tropical & Warm', image: 'andaman.jpg' },
    { eyebrow: 'The Himalayas', title: 'Manali Valley', temp: '14°C', weather: 'Crisp & Cool', image: 'manali.jpg' },
    { eyebrow: 'The Coastline', title: 'South Goa Beaches', temp: '31°C', weather: 'Sunny & Humid', image: 'goa.jpg' },
    { eyebrow: 'The Desert State', title: 'Jaipur Heritage', temp: '34°C', weather: 'Dry & Sunny', image: 'jaipur.jpg' }
  ];

  let currentSlide = 0;

  function setSlide(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    currentSlide = index;

    // Update text
    heroEyebrow.textContent = slides[currentSlide].eyebrow;
    heroTitle.textContent = slides[currentSlide].title;
    heroTemp.textContent = slides[currentSlide].temp;
    heroWeather.textContent = slides[currentSlide].weather;
    
    // Update background image with fade transition
    const bgImg = document.getElementById('hero-bg-img');
    if (bgImg) {
      bgImg.style.opacity = '0';
      setTimeout(() => {
        bgImg.style.backgroundImage = 'url("img/' + slides[currentSlide].image + '")';
        bgImg.style.opacity = '1';
      }, 400);
    }

    // Update indicators
    indicators.forEach(ind => ind.classList.remove('active'));
    indicators[currentSlide].classList.add('active');

    // Trigger reflow for animation
    const contents = [heroEyebrow.parentElement, heroTitle, heroTemp.parentElement.parentElement];
    contents.forEach(el => {
      el.style.animation = 'none';
      el.offsetHeight; // trigger reflow
      el.style.animation = null;
    });
  }

  if (btnPrev && btnNext) {
    btnPrev.addEventListener('click', () => setSlide(currentSlide - 1));
    btnNext.addEventListener('click', () => setSlide(currentSlide + 1));
  }

  indicators.forEach((ind, i) => {
    ind.addEventListener('click', () => setSlide(i));
  });

  // Auto rotate
  setInterval(() => setSlide(currentSlide + 1), 5000);
});
