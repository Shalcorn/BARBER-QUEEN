const year = document.getElementById('year');
if (year) {
  year.textContent = new Date().getFullYear();
}

const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

const slideshow = document.querySelector('[data-slideshow]');

if (slideshow) {
  const image = slideshow.querySelector('[data-slide-image]');
  const title = slideshow.querySelector('[data-slide-title]');
  const dots = slideshow.querySelector('[data-slide-dots]');
  const previous = slideshow.querySelector('[data-slide-prev]');
  const next = slideshow.querySelector('[data-slide-next]');
  const slides = [
    { image: 'barber Q4.jpg', title: 'Fresh fade and textured finish' },
    { image: 'barber-queen-photo.jpg', title: 'A confident BARBER QUEEN look' },
    { image: 'barber.jpg', title: 'Professional grooming in action' },
    { image: 'kalii-photo-2.jpg', title: 'Kalii haircut with a bold shaved pattern' }
  ];
  let currentSlide = 0;

  const renderSlide = (index) => {
    currentSlide = (index + slides.length) % slides.length;
    const slide = slides[currentSlide];
    image.src = slide.image;
    image.alt = slide.title;
    title.textContent = slide.title;
    dots.querySelectorAll('button').forEach((dot, dotIndex) => {
      dot.classList.toggle('active', dotIndex === currentSlide);
      dot.setAttribute('aria-current', dotIndex === currentSlide ? 'true' : 'false');
    });
  };

  slides.forEach((slide, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'slide-dot';
    dot.setAttribute('aria-label', `Show ${slide.title}`);
    dot.addEventListener('click', () => renderSlide(index));
    dots.appendChild(dot);
  });

  previous.addEventListener('click', () => renderSlide(currentSlide - 1));
  next.addEventListener('click', () => renderSlide(currentSlide + 1));
  renderSlide(0);
  setInterval(() => renderSlide(currentSlide + 1), 5000);
}

const bookingForm = document.getElementById('bookingForm');
const bookingStatus = document.getElementById('bookingStatus');

if (bookingForm && bookingStatus) {
  const capitalizeWords = (value) => value.replace(/\b\w/g, (letter) => letter.toUpperCase());
  const nameInput = bookingForm.querySelector('[name="name"]');

  if (nameInput) {
    nameInput.addEventListener('blur', () => {
      nameInput.value = capitalizeWords(nameInput.value);
    });
  }

  bookingForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(bookingForm);
    const name = capitalizeWords(formData.get('name'));
    const service = formData.get('service');
    const date = formData.get('date');
    const time = formData.get('time');
    const period = formData.get('period');
    const phone = bookingForm.dataset.bookingPhone;
    const clientPhone = formData.get('phone');
    const booking = {
      id: Date.now(),
      name,
      service,
      date,
      time,
      period,
      phone: clientPhone,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    const bookings = JSON.parse(localStorage.getItem('barberQueenBookings') || '[]');
    bookings.unshift(booking);
    localStorage.setItem('barberQueenBookings', JSON.stringify(bookings));
    const message = `NEW BOOKING REQUEST - APPROVAL NEEDED. Client: ${name}. Service: ${service}. Date: ${date}. Time: ${time} ${period}. Client phone: ${clientPhone}. Please reply APPROVED or suggest another time.`;

    bookingStatus.textContent = 'Your booking message is ready. Please send it from your SMS app.';
    window.location.href = `sms:${phone}?body=${encodeURIComponent(message)}`;
  });
}
