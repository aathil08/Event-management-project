import API from './axios';

// ── Auth ──────────────────────────────────────────────────────
export const registerUser  = (data)        => API.post('/auth/register', data);
export const loginUser     = (data)        => API.post('/auth/login', data);
export const getMe         = ()            => API.get('/auth/me');

// ── Events ────────────────────────────────────────────────────
export const fetchEvents   = (params)      => API.get('/events', { params });
export const fetchEventById = (id)         => API.get(`/events/${id}`);
export const createEvent   = (data)        => API.post('/events', data);
export const updateEvent   = (id, data)    => API.put(`/events/${id}`, data);
export const deleteEvent   = (id)          => API.delete(`/events/${id}`);

// ── Bookings ──────────────────────────────────────────────────
export const bookTickets   = (data)        => API.post('/bookings', data);
export const getMyBookings = ()            => API.get('/bookings/my');
export const getAllBookings = ()            => API.get('/bookings/all');
export const cancelBooking = (id)          => API.delete(`/bookings/${id}`);

// ── Admin ─────────────────────────────────────────────────────
export const getDashboardStats = ()        => API.get('/admin/stats');
