// High-Performance In-Memory Store & MongoDB Fallback for NearMe Consulting
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

class MemoryStore {
  constructor() {
    this.users = [];
    this.businesses = [];
    this.bookings = [];
    this.reviews = [];
    this.initialized = false;
  }

  generateId() {
    return crypto.randomBytes(12).toString('hex');
  }

  async init(demoData = null) {
    if (this.initialized) return;

    if (demoData) {
      // Seed users
      const salt = await bcrypt.genSalt(10);
      const adminHash = await bcrypt.hash('admin123', salt);
      const customerHash = await bcrypt.hash('customer123', salt);

      this.users = [
        {
          _id: this.generateId(),
          name: 'Admin User',
          email: 'admin@nearme.com',
          passwordHash: adminHash,
          phone: '+91 98000 00001',
          role: 'admin',
          createdAt: new Date().toISOString()
        },
        {
          _id: this.generateId(),
          name: 'Pooja Verma',
          email: 'customer@nearme.com',
          passwordHash: customerHash,
          phone: '+91 98000 00002',
          role: 'customer',
          createdAt: new Date().toISOString()
        }
      ];

      // Seed businesses
      this.businesses = demoData.businesses.map((b) => ({
        ...b,
        _id: b._id || this.generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));

      // Seed reviews
      this.reviews = demoData.reviews.map((r, i) => ({
        ...r,
        _id: this.generateId(),
        businessId: this.businesses[i % this.businesses.length]._id,
        createdAt: new Date().toISOString()
      }));

      // Seed booking
      this.bookings = [
        {
          _id: this.generateId(),
          userId: this.users[1]._id,
          businessId: this.businesses[0]._id,
          customerName: this.users[1].name,
          email: this.users[1].email,
          phone: this.users[1].phone,
          service: this.businesses[0].services[0],
          bookingDate: '2026-11-28',
          bookingTime: '11:00 AM',
          location: 'Online Video Consultation',
          requirements: 'Need advice on cloud cost optimization and infrastructure scaling.',
          status: 'confirmed',
          bookingReference: 'NMC-20261128-DEMO1',
          createdAt: new Date().toISOString()
        }
      ];
    }
    this.initialized = true;
    console.log(`📦 [In-Memory Demo Mode] Initialized with ${this.businesses.length} businesses, ${this.users.length} users, and ${this.bookings.length} bookings.`);
  }
}

const memoryStore = new MemoryStore();
module.exports = memoryStore;
