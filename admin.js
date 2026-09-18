const ownerPin = '2026';
const storageKey = 'barberQueenBookings';
const login = document.getElementById('adminLogin');
const dashboard = document.getElementById('adminDashboard');
const loginForm = document.getElementById('adminLoginForm');
const pinInput = document.getElementById('adminPin');
const error = document.getElementById('adminError');
const list = document.getElementById('bookingList');
const logout = document.getElementById('adminLogout');
const search = document.getElementById('bookingSearch');
const statusFilter = document.getElementById('statusFilter');
const totalCount = document.getElementById('totalCount');
const pendingCount = document.getElementById('pendingCount');
const approvedCount = document.getElementById('approvedCount');
const rejectedCount = document.getElementById('rejectedCount');

const getBookings = () => JSON.parse(localStorage.getItem(storageKey) || '[]');
const saveBookings = (bookings) => localStorage.setItem(storageKey, JSON.stringify(bookings));

const escapeHtml = (value) => String(value).replace(/[&<>\'"]/g, (character) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  "'": '&#39;',
  '"': '&quot;'
}[character]));

const renderBookings = () => {
  const bookings = getBookings();
  const query = search.value.trim().toLowerCase();
  const selectedStatus = statusFilter.value;
  const filteredBookings = bookings.filter((booking) => {
    const searchable = `${booking.name} ${booking.service} ${booking.phone}`.toLowerCase();
    return (!query || searchable.includes(query)) && (selectedStatus === 'all' || booking.status === selectedStatus);
  });

  totalCount.textContent = bookings.length;
  pendingCount.textContent = bookings.filter((booking) => booking.status === 'pending').length;
  approvedCount.textContent = bookings.filter((booking) => booking.status === 'approved').length;
  rejectedCount.textContent = bookings.filter((booking) => booking.status === 'rejected').length;
  list.innerHTML = '';

  if (!filteredBookings.length) {
    list.innerHTML = `<div class="empty-state"><strong>${bookings.length ? 'No matching bookings' : 'No booking requests yet'}</strong><span>${bookings.length ? 'Try another search or status filter.' : 'New requests will appear here after a client submits the form.'}</span></div>`;
    return;
  }

  filteredBookings.forEach((booking) => {
    const card = document.createElement('article');
    card.className = 'booking-admin-card';
    card.innerHTML = `
      <div class="booking-details">
        <div class="booking-card-topline"><span class="booking-status-label ${escapeHtml(booking.status)}">${escapeHtml(booking.status)}</span><span class="booking-id">#${escapeHtml(booking.id)}</span></div>
        <h2>${escapeHtml(booking.name)}</h2>
        <p class="booking-service"><span>Booking type</span><strong>${escapeHtml(booking.service)}</strong></p>
        <p class="booking-time"><strong>${escapeHtml(booking.date)}</strong><span>${escapeHtml(booking.time)} ${escapeHtml(booking.period)}</span></p>
        <a class="booking-phone" href="tel:${escapeHtml(booking.phone)}">${escapeHtml(booking.phone)}</a>
      </div>
      <div class="booking-actions">
        <button class="button approve-button" type="button" data-action="approved" data-id="${escapeHtml(booking.id)}">Approve & text client</button>
        <button class="button button-secondary" type="button" data-action="rejected" data-id="${escapeHtml(booking.id)}">Reject</button>
        <button class="text-button" type="button" data-action="delete" data-id="${escapeHtml(booking.id)}">Delete</button>
      </div>`;
    list.appendChild(card);
  });
};

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (pinInput.value !== ownerPin) {
    error.textContent = 'Incorrect owner PIN.';
    return;
  }
  sessionStorage.setItem('barberQueenAdmin', 'true');
  login.hidden = true;
  dashboard.hidden = false;
  renderBookings();
});

search.addEventListener('input', renderBookings);
statusFilter.addEventListener('change', renderBookings);

list.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const action = button.dataset.action;
  const id = Number(button.dataset.id);
  let bookings = getBookings();
  if (action === 'delete') {
    bookings = bookings.filter((booking) => booking.id !== id);
  } else {
    bookings = bookings.map((booking) => booking.id === id ? { ...booking, status: action } : booking);
  }
  saveBookings(bookings);
  if (action === 'approved') {
    const booking = getBookings().find((item) => item.id === id);
    const message = `Hello ${booking.name}, your BARBER QUEEN booking for ${booking.service} on ${booking.date} at ${booking.time} ${booking.period} has been APPROVED. We look forward to welcoming you at JKUAT Towers, Nairobi CBD.`;
    window.location.href = `sms:${booking.phone}?body=${encodeURIComponent(message)}`;
  }
  renderBookings();
});

logout.addEventListener('click', () => {
  sessionStorage.removeItem('barberQueenAdmin');
  dashboard.hidden = true;
  login.hidden = false;
  pinInput.value = '';
});

if (sessionStorage.getItem('barberQueenAdmin') === 'true') {
  login.hidden = true;
  dashboard.hidden = false;
  renderBookings();
}
