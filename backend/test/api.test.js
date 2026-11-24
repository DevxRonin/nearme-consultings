// Comprehensive API Test Suite for NearMe Consulting Backend
const http = require('http');
const { app, startServer } = require('../server');

let server;
const PORT = 5099;

const makeRequest = (options, postData = null) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: body ? JSON.parse(body) : null
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            rawBody: body
          });
        }
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(JSON.stringify(postData));
    }
    req.end();
  });
};

const runTests = async () => {
  console.log('🧪 Starting NearMe Consulting Backend API Verification Suite...\n');
  process.env.PORT = PORT;

  server = app.listen(PORT);
  const { connectDB } = require('../config/db');
  await connectDB();

  const Booking = require('../models/Booking');
  // Clean up any test booking slot from prior runs
  await Booking.deleteMany({ bookingDate: '2026-12-05', bookingTime: '02:00 PM' });

  let authToken = '';
  let businessId = '';
  let bookingReference = '';
  let passed = 0;
  let failed = 0;

  const assert = (name, condition, details = '') => {
    if (condition) {
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${name} ${details}`);
      failed++;
    }
  };

  try {
    // 1. Health check
    const health = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: '/api/health',
      method: 'GET'
    });
    assert('Health Check (GET /api/health)', health.status === 200 && health.body.status === 'OK');

    // 2. User registration
    const testEmail = `testuser_${Date.now()}@example.com`;
    const regRes = await makeRequest(
      {
        hostname: 'localhost',
        port: PORT,
        path: '/api/auth/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      },
      {
        name: 'Sneha Patel',
        email: testEmail,
        password: 'password123',
        phone: '+91 99887 76655'
      }
    );
    assert('User Registration (POST /api/auth/register)', regRes.status === 201 && regRes.body.data.token);
    authToken = regRes.body?.data?.token;

    // 3. User login
    const loginRes = await makeRequest(
      {
        hostname: 'localhost',
        port: PORT,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      },
      {
        email: testEmail,
        password: 'password123'
      }
    );
    assert('User Login (POST /api/auth/login)', loginRes.status === 200 && loginRes.body.success === true);

    // 4. Get Current User Profile
    const meRes = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/me',
      method: 'GET',
      headers: { Authorization: `Bearer ${authToken}` }
    });
    assert('Get User Profile (GET /api/auth/me)', meRes.status === 200 && meRes.body.data.email === testEmail);

    // 5. Get Categories
    const catRes = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: '/api/businesses/categories',
      method: 'GET'
    });
    assert(
      'Get Categories (GET /api/businesses/categories)',
      catRes.status === 200 && Array.isArray(catRes.body.data) && catRes.body.data.length >= 6
    );

    // 6. Get Businesses
    const bizRes = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: '/api/businesses?page=1&limit=6',
      method: 'GET'
    });
    assert(
      'Get Businesses List (GET /api/businesses)',
      bizRes.status === 200 && bizRes.body.data.length > 0
    );
    if (bizRes.body.data.length > 0) {
      businessId = bizRes.body.data[0]._id;
    }

    // 7. Get Business By ID
    const singleBizRes = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: `/api/businesses/${businessId}`,
      method: 'GET'
    });
    assert(
      'Get Business Details (GET /api/businesses/:id)',
      singleBizRes.status === 200 && singleBizRes.body.data.name
    );

    // 8. Nearby Businesses with Coordinates
    const nearbyRes = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: '/api/businesses/nearby?latitude=18.6279&longitude=73.8009&radius=25',
      method: 'GET'
    });
    assert(
      'Nearby Businesses Query (GET /api/businesses/nearby)',
      nearbyRes.status === 200 && nearbyRes.body.data.length > 0 && nearbyRes.body.data[0].distanceKm !== undefined
    );

    // 9. AI Chat Assistant
    const aiChatRes = await makeRequest(
      {
        hostname: 'localhost',
        port: PORT,
        path: '/api/ai/chat',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      },
      {
        question: 'Find the best IT consultant near Pimpri under 1500',
        location: 'Pimpri'
      }
    );
    assert(
      'AI Chat Assistant (POST /api/ai/chat)',
      aiChatRes.status === 200 &&
        aiChatRes.body.success === true &&
        aiChatRes.body.results.length > 0 &&
        typeof aiChatRes.body.answer === 'string'
    );

    // 10. Check Slot Availability
    const timeParam = encodeURIComponent('02:00 PM');
    const availRes = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: `/api/bookings/check-availability?businessId=${businessId}&bookingDate=2026-12-05&bookingTime=${timeParam}`,
      method: 'GET'
    });
    assert(
      'Check Slot Availability (GET /api/bookings/check-availability)',
      availRes.status === 200 && availRes.body.available === true
    );

    // 11. Create Booking
    const bookRes = await makeRequest(
      {
        hostname: 'localhost',
        port: PORT,
        path: '/api/bookings',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        }
      },
      {
        businessId,
        customerName: 'Sneha Patel',
        email: testEmail,
        phone: '9988776655',
        service: 'Cloud Architecture & DevOps Advisory',
        bookingDate: '2026-12-05',
        bookingTime: '02:00 PM',
        location: 'Virtual Video Meet',
        requirements: 'Need audit of production Kubernetes cluster and cost optimization.'
      }
    );
    assert(
      'Create Consultation Booking (POST /api/bookings)',
      bookRes.status === 201 && bookRes.body.data.bookingReference
    );
    bookingReference = bookRes.body?.data?.bookingReference;

    // 12. Check Availability Conflict (Slot should now be occupied!)
    const conflictRes = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: `/api/bookings/check-availability?businessId=${businessId}&bookingDate=2026-12-05&bookingTime=${timeParam}`,
      method: 'GET'
    });
    assert(
      'Prevent Conflicting Booking Slot (GET /api/bookings/check-availability)',
      conflictRes.status === 200 && conflictRes.body.available === false
    );

    // 13. Get My Bookings
    const myBookingsRes = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: `/api/bookings/my?email=${encodeURIComponent(testEmail)}`,
      method: 'GET',
      headers: { Authorization: `Bearer ${authToken}` }
    });
    assert(
      'Get My Bookings (GET /api/bookings/my)',
      myBookingsRes.status === 200 && myBookingsRes.body.data.length >= 1
    );

    // 14. Cancel Booking
    const cancelRes = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: `/api/bookings/${bookingReference}/cancel`,
      method: 'PATCH',
      headers: { Authorization: `Bearer ${authToken}` }
    });
    assert(
      'Cancel Booking (PATCH /api/bookings/:id/cancel)',
      cancelRes.status === 200 && cancelRes.body.data.status === 'cancelled'
    );

    // 15. Create Review
    const reviewRes = await makeRequest(
      {
        hostname: 'localhost',
        port: PORT,
        path: '/api/reviews',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        }
      },
      {
        businessId,
        userName: 'Sneha Patel',
        rating: 5,
        comment: 'Outstanding consultation! Practical insights and clear roadmap.'
      }
    );
    assert('Submit Review (POST /api/reviews)', reviewRes.status === 201);

  } catch (err) {
    console.error('Test Execution Error:', err);
    failed++;
  } finally {
    server.close();
    console.log(`\n========================================`);
    console.log(`TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
    console.log(`========================================\n`);
    process.exit(failed > 0 ? 1 : 0);
  }
};

runTests();
