/**
 * seed.js — Creates admin account + sample events
 * Run ONCE:  node seed.js
 * Safe to re-run: deletes old admin & events, re-creates fresh ones
 */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const User     = require('./models/User');
const Event    = require('./models/Event');

const MONGO_URI    = process.env.MONGO_URI || 'mongodb://localhost:27017/eventx';
const ADMIN_EMAIL  = process.env.ADMIN_EMAIL  || 'admin@eventx.com';
const ADMIN_PASS   = process.env.ADMIN_PASS   || 'admin123';

const sampleEvents = [
  {
    title: 'Chennai Tech Summit 2026',
    description: 'A premier technology conference bringing together India\'s top engineers, startup founders, and innovators for a full day of keynotes and workshops.',
    date: new Date('2026-06-15'),
    time: '9:00 AM',
    location: 'Chennai Trade Centre, Nandambakkam',
    category: 'Technology',
    totalSeats: 200,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
  },
  {
    title: 'Jazz & Blues Night',
    description: 'An enchanting evening of live jazz and blues music featuring artists from across South India. Dinner and beverages included.',
    date: new Date('2026-07-20'),
    time: '7:00 PM',
    location: 'The Music Academy, T.Nagar, Chennai',
    category: 'Music',
    totalSeats: 120,
    image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600&q=80',
  },
  {
    title: 'Full Stack Bootcamp',
    description: 'Intensive one-day hands-on workshop covering React, Node.js, MongoDB and deployment. Beginner friendly with mentorship.',
    date: new Date('2026-06-01'),
    time: '10:00 AM',
    location: 'IIT Madras Research Park, Taramani',
    category: 'Workshop',
    totalSeats: 60,
    image: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=600&q=80',
  },
  {
    title: 'Startup Pitch Battle',
    description: 'Top 10 early-stage startups pitch live to a panel of VCs and angel investors. Networking dinner follows the event.',
    date: new Date('2026-07-04'),
    time: '5:00 PM',
    location: 'Tidel Park, OMR, Chennai',
    category: 'Business',
    totalSeats: 150,
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&q=80',
  },
  {
    title: 'International Food Festival',
    description: 'Sample cuisines from 25+ countries prepared by award-winning chefs. Live cooking demos, food contests and cultural performances.',
    date: new Date('2026-08-10'),
    time: '11:00 AM',
    location: 'Nungambakkam Cultural Centre, Chennai',
    category: 'Food',
    totalSeats: 300,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80',
  },
  {
    title: 'AI & Machine Learning Conference',
    description: 'Deep-dive talks on LLMs, computer vision, and responsible AI by researchers from Google, Microsoft and local academia.',
    date: new Date('2026-08-12'),
    time: '9:30 AM',
    location: 'Anna University, Guindy, Chennai',
    category: 'Technology',
    totalSeats: 180,
    image: 'https://images.unsplash.com/photo-1591453089816-0fbb971b454c?w=600&q=80',
  },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('\n✅ Connected to MongoDB\n');

  // ── Admin Account ─────────────────────────────────────────────
  await User.deleteOne({ email: ADMIN_EMAIL });

  // Hash password manually so we can confirm it works
  const hashedPassword = await bcrypt.hash(ADMIN_PASS, 12);

  // Use insertOne to bypass pre-save hook (password is already hashed above)
  const adminDoc = await User.collection.insertOne({
    name: 'Javith Admin',
    email: ADMIN_EMAIL,
    password: hashedPassword,
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const adminId = adminDoc.insertedId;
  console.log(`👑 Admin account ready`);
  console.log(`   Email    : ${ADMIN_EMAIL}`);
  console.log(`   Password : ${ADMIN_PASS}\n`);

  // ── Sample Events ─────────────────────────────────────────────
  await Event.deleteMany({});
  const events = sampleEvents.map((e) => ({
    ...e,
    createdBy: adminId,
    bookedSeats: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
  await Event.collection.insertMany(events);
  console.log(`🎉 ${events.length} sample events created\n`);

  console.log('─────────────────────────────────────────');
  console.log('  Seed complete! Start the server and');
  console.log(`  login at http://localhost:5173`);
  console.log('─────────────────────────────────────────\n');

  process.exit(0);
}

seed().catch((err) => {
  console.error('\n❌ Seed failed:', err.message);
  process.exit(1);
});
