const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { connectDB, disconnectDB } = require('./config/db');
const Business = require('./models/Business');
const User = require('./models/User');
const Review = require('./models/Review');
const Booking = require('./models/Booking');

dotenv.config();

const demoBusinesses = [
  {
    name: 'TechForge IT & Cloud Solutions',
    slug: 'techforge-it-cloud-solutions',
    description:
      'Premier technology consultancy specializing in enterprise cloud architecture, cybersecurity audits, full-stack modernization, and AI workflow integration. Over 10 years guiding startups and scale-ups.',
    category: 'IT Consulting',
    address: '402 Cyber Heights, Phase 1, Hinjawadi',
    city: 'Hinjawadi, Pune',
    state: 'Maharashtra',
    location: {
      type: 'Point',
      coordinates: [73.7389, 18.5913] // [lon, lat]
    },
    rating: 4.9,
    reviewCount: 48,
    price: 999,
    services: [
      'Cloud Architecture (AWS/GCP/Azure)',
      'Cybersecurity & Compliance Audit',
      'AI & Machine Learning Integration',
      'DevOps CI/CD Automation'
    ],
    phone: '+91 98230 11223',
    email: 'contact@techforge-consulting.example.com',
    images: [
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80'
    ],
    workingHours: 'Mon - Fri: 9:00 AM - 7:00 PM',
    experienceYears: 10,
    isVerified: true,
    isDemo: true,
    isActive: true
  },
  {
    name: 'Apex Strategy & Business Advisory',
    slug: 'apex-strategy-business-advisory',
    description:
      'Holistic business consultancy for entrepreneurs and mid-market enterprises. We assist in market entry, operational restructuring, go-to-market scaling, and strategic fundraising pitch design.',
    category: 'Business Consulting',
    address: 'B-Block, Commercial Complex, Pimpri Colony',
    city: 'Pimpri, PCMC',
    state: 'Maharashtra',
    location: {
      type: 'Point',
      coordinates: [73.8009, 18.6279]
    },
    rating: 4.8,
    reviewCount: 34,
    price: 799,
    services: [
      'Business Plan & Pitch Deck Advisory',
      'Go-To-Market & Revenue Modeling',
      'Operations Optimization',
      'Startup Mentorship & Scaling'
    ],
    phone: '+91 98224 44556',
    email: 'info@apexadvisory.example.com',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80'
    ],
    workingHours: 'Mon - Sat: 9:30 AM - 6:30 PM',
    experienceYears: 12,
    isVerified: true,
    isDemo: true,
    isActive: true
  },
  {
    name: 'Vanguard Wealth & Tax Consultants',
    slug: 'vanguard-wealth-tax-consultants',
    description:
      'Certified Chartered Accountants and wealth advisors delivering comprehensive corporate taxation, GST advisory, personal wealth planning, and forensic accounting services.',
    category: 'Financial Consulting',
    address: 'Suite 201, Sterling Centre, Aundh',
    city: 'Aundh, Pune',
    state: 'Maharashtra',
    location: {
      type: 'Point',
      coordinates: [73.8031, 18.5602]
    },
    rating: 4.9,
    reviewCount: 52,
    price: 899,
    services: [
      'Corporate Tax Planning & Filing',
      'GST Audit & Statutory Compliance',
      'Investment & Wealth Advisory',
      'Startup CFO Services'
    ],
    phone: '+91 98212 99887',
    email: 'support@vanguardwealth.example.com',
    images: [
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80'
    ],
    workingHours: 'Mon - Sat: 10:00 AM - 7:00 PM',
    experienceYears: 14,
    isVerified: true,
    isDemo: true,
    isActive: true
  },
  {
    name: 'LexJuris Corporate Legal Associates',
    slug: 'lexjuris-corporate-legal-associates',
    description:
      'Full-service commercial and intellectual property law practice. We draft solid founders agreements, protect patents and trademarks, and ensure regulatory compliance for growing businesses.',
    category: 'Legal Consulting',
    address: 'Level 5, Metro Court, Shivaji Nagar',
    city: 'Shivaji Nagar, Pune',
    state: 'Maharashtra',
    location: {
      type: 'Point',
      coordinates: [73.8446, 18.5314]
    },
    rating: 4.7,
    reviewCount: 29,
    price: 1200,
    services: [
      'Corporate Contracts & Commercial Agreements',
      'Trademark, Copyright & Patent Filing',
      'Company Incorporation & RoC Compliance',
      'Dispute Mediation & Employment Law'
    ],
    phone: '+91 98901 33445',
    email: 'counsel@lexjuris.example.com',
    images: [
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80'
    ],
    workingHours: 'Mon - Fri: 10:00 AM - 6:00 PM',
    experienceYears: 16,
    isVerified: true,
    isDemo: true,
    isActive: true
  },
  {
    name: 'Ascend Career & Executive Coaching',
    slug: 'ascend-career-executive-coaching',
    description:
      'Certified career transformation coaches offering executive coaching, resume revamp, FAANG interview preparation, and leadership development for working professionals.',
    category: 'Career Consulting',
    address: 'Plaza One, Kaspate Vasti, Wakad',
    city: 'Wakad, PCMC',
    state: 'Maharashtra',
    location: {
      type: 'Point',
      coordinates: [73.766, 18.5987]
    },
    rating: 4.8,
    reviewCount: 65,
    price: 649,
    services: [
      'Executive Resume & LinkedIn Optimization',
      'Tech & Leadership Mock Interviews',
      'Career Transition Strategy',
      'Salary Negotiation Advisory'
    ],
    phone: '+91 97654 22110',
    email: 'coaching@ascendcareers.example.com',
    images: [
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'
    ],
    workingHours: 'Mon - Sun: 8:00 AM - 8:00 PM',
    experienceYears: 8,
    isVerified: true,
    isDemo: true,
    isActive: true
  },
  {
    name: 'PulseGrowth Digital Marketing Lab',
    slug: 'pulsegrowth-digital-marketing-lab',
    description:
      'Performance-driven growth consultancy helping B2B and consumer brands generate qualified pipeline through technical SEO, paid performance ads, high-converting copy, and brand storytelling.',
    category: 'Marketing Consulting',
    address: 'Regus Business Hub, Baner High Street',
    city: 'Baner, Pune',
    state: 'Maharashtra',
    location: {
      type: 'Point',
      coordinates: [73.7868, 18.559]
    },
    rating: 4.9,
    reviewCount: 41,
    price: 749,
    services: [
      'Technical SEO & Content Strategy',
      'Paid Ads (Google & Meta Ads)',
      'Conversion Rate Optimization (CRO)',
      'Brand Identity & Position Design'
    ],
    phone: '+91 99701 55667',
    email: 'growth@pulsegrowth.example.com',
    images: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
    ],
    workingHours: 'Mon - Fri: 9:00 AM - 6:00 PM',
    experienceYears: 9,
    isVerified: true,
    isDemo: true,
    isActive: true
  },
  {
    name: 'Optima Management & Operations Consultants',
    slug: 'optima-management-operations-consultants',
    description:
      'Transformational management consulting optimizing supply chains, corporate operational workflows, lean Six Sigma implementations, and change management programs.',
    category: 'Management Consulting',
    address: 'ICC Tech Tower, Senapati Bapat Road',
    city: 'Pune Central',
    state: 'Maharashtra',
    location: {
      type: 'Point',
      coordinates: [73.8294, 18.5362]
    },
    rating: 4.6,
    reviewCount: 22,
    price: 1150,
    services: [
      'Lean Six Sigma Process Audits',
      'Supply Chain & Logistics Strategy',
      'Organizational Restructuring',
      'Change Management Workshops'
    ],
    phone: '+91 98811 77889',
    email: 'advisory@optima.example.com',
    images: [
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80'
    ],
    workingHours: 'Mon - Fri: 9:00 AM - 6:30 PM',
    experienceYears: 15,
    isVerified: true,
    isDemo: true,
    isActive: true
  },
  {
    name: 'CyberShield IT Security & PenTesting',
    slug: 'cybershield-it-security-pentesting',
    description:
      'Certified ethical hackers and cybersecurity auditors providing vulnerability assessment, penetration testing (VAPT), ISO 27001 compliance, and incident response.',
    category: 'IT Consulting',
    address: 'Prestige Point, Chinchwad Station Road',
    city: 'Chinchwad, PCMC',
    state: 'Maharashtra',
    location: {
      type: 'Point',
      coordinates: [73.7997, 18.6298]
    },
    rating: 4.9,
    reviewCount: 38,
    price: 1499,
    services: [
      'Web & Mobile App PenTesting',
      'SOC 2 & ISO 27001 Readiness',
      'Cloud Security Hardening',
      'Employee Cybersecurity Training'
    ],
    phone: '+91 98500 44332',
    email: 'security@cybershield.example.com',
    images: [
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80'
    ],
    workingHours: 'Mon - Sat: 9:00 AM - 7:00 PM',
    experienceYears: 11,
    isVerified: true,
    isDemo: true,
    isActive: true
  },
  {
    name: 'FinGrowth Capital Advisory',
    slug: 'fingrowth-capital-advisory',
    description:
      'Specialized fundraising and M&A advisors helping early and growth-stage companies prepare financial models, valuation reports, and debt/equity syndication.',
    category: 'Financial Consulting',
    address: 'Trade Centre, Bund Garden Road',
    city: 'Pune City',
    state: 'Maharashtra',
    location: {
      type: 'Point',
      coordinates: [73.8828, 18.5367]
    },
    rating: 4.8,
    reviewCount: 27,
    price: 1099,
    services: [
      'Valuation & Financial Modeling',
      'Debt Financing & Bank Term Loans',
      'Investor Due Diligence Prep',
      'Cash Flow Forecasting'
    ],
    phone: '+91 97300 88991',
    email: 'deals@fingrowth.example.com',
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'
    ],
    workingHours: 'Mon - Fri: 10:00 AM - 6:30 PM',
    experienceYears: 13,
    isVerified: true,
    isDemo: true,
    isActive: true
  },
  {
    name: 'NextStep Career Pathways & HR',
    slug: 'nextstep-career-pathways-hr',
    description:
      'Friendly and affordable career counselling for recent graduates and mid-level software professionals looking to switch roles into Product, Data, or Engineering leadership.',
    category: 'Career Consulting',
    address: 'Near D.Y. Patil College, Pimpri',
    city: 'Pimpri, PCMC',
    state: 'Maharashtra',
    location: {
      type: 'Point',
      coordinates: [73.8045, 18.625]
    },
    rating: 4.7,
    reviewCount: 49,
    price: 499,
    services: [
      'Fresher & Graduate Career Mapping',
      'Profile Review & Portfolio Building',
      'Interview Confidence Workshops',
      'Study Abroad Guidance'
    ],
    phone: '+91 98235 66778',
    email: 'contact@nextstepcareer.example.com',
    images: [
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80'
    ],
    workingHours: 'Mon - Sun: 9:00 AM - 8:00 PM',
    experienceYears: 6,
    isVerified: true,
    isDemo: true,
    isActive: true
  },
  {
    name: 'BrandForge Omni-Channel Strategy',
    slug: 'brandforge-omni-channel-strategy',
    description:
      'Creative agency and consultancy specializing in modern direct-to-consumer (D2C) brand storytelling, influencer campaigns, packaging design, and omni-channel distribution.',
    category: 'Marketing Consulting',
    address: 'EON Free Zone, Kharadi',
    city: 'Kharadi, Pune',
    state: 'Maharashtra',
    location: {
      type: 'Point',
      coordinates: [73.9348, 18.5516]
    },
    rating: 4.8,
    reviewCount: 31,
    price: 899,
    services: [
      'Omnichannel Strategy & Retailing',
      'Influencer Marketing & PR',
      'Creative Packaging & Visual Identity',
      'Social Media Brand Growth'
    ],
    phone: '+91 99600 12345',
    email: 'hello@brandforge.example.com',
    images: [
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80'
    ],
    workingHours: 'Mon - Fri: 10:00 AM - 7:00 PM',
    experienceYears: 7,
    isVerified: true,
    isDemo: true,
    isActive: true
  },
  {
    name: 'Integrity Law & Regulatory Counsel',
    slug: 'integrity-law-regulatory-counsel',
    description:
      'Trusted legal advisors for real estate transactions, start-up compliances, employment contracts, and consumer protection litigation across Pune and Pimpri-Chinchwad.',
    category: 'Legal Consulting',
    address: '4th Floor, City Square, Alandi Road',
    city: 'Alandi, Pune',
    state: 'Maharashtra',
    location: {
      type: 'Point',
      coordinates: [73.896, 18.6775]
    },
    rating: 4.6,
    reviewCount: 19,
    price: 699,
    services: [
      'Real Estate Title Search & Deeds',
      'RERA & Property Legal Advice',
      'Commercial Lease Agreements',
      'Consumer Disputes Representation'
    ],
    phone: '+91 98800 77112',
    email: 'legal@integritycounsel.example.com',
    images: [
      'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80'
    ],
    workingHours: 'Mon - Sat: 9:30 AM - 6:00 PM',
    experienceYears: 18,
    isVerified: true,
    isDemo: true,
    isActive: true
  },
  {
    name: 'Elevate Business Dynamics',
    slug: 'elevate-business-dynamics',
    description:
      'Franchise expansion, business valuation, and operational efficiency consulting for retail and service SMEs seeking systematic growth.',
    category: 'Business Consulting',
    address: 'Phoenix Market City Area, Viman Nagar',
    city: 'Viman Nagar, Pune',
    state: 'Maharashtra',
    location: {
      type: 'Point',
      coordinates: [73.9143, 18.5679]
    },
    rating: 4.7,
    reviewCount: 26,
    price: 850,
    services: [
      'Franchise Model Structuring',
      'Retail Footprint Optimization',
      'Unit Economics Improvement',
      'SOP & Standard Operating Procedures'
    ],
    phone: '+91 97600 33221',
    email: 'info@elevatebiz.example.com',
    images: [
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80'
    ],
    workingHours: 'Mon - Fri: 9:00 AM - 6:00 PM',
    experienceYears: 10,
    isVerified: true,
    isDemo: true,
    isActive: true
  }
];

const sampleReviews = [
  {
    userName: 'Rohan Deshmukh',
    rating: 5,
    comment:
      'Exceptional guidance! Helped us migrate our on-premise infrastructure to AWS in record time with zero downtime. Saved over 30% in monthly cloud bills.'
  },
  {
    userName: 'Priya Kulkarni',
    rating: 5,
    comment:
      'Extremely professional and thorough consultation. The pricing was transparent and the session gave us a crystal-clear financial plan.'
  },
  {
    userName: 'Anil Sharma',
    rating: 4,
    comment:
      'Great advice on our company partnership agreements and IP registration. Very responsive on WhatsApp and email.'
  },
  {
    userName: 'Sneha Patel',
    rating: 5,
    comment:
      'The resume optimization and mock interview coaching gave me the exact confidence needed to crack my senior engineering manager role!'
  }
];

const seedData = async () => {
  try {
    console.log('🌱 Starting NearMe Consulting database seeding...');
    await connectDB();

    // 1. Seed Admin User
    await User.deleteMany({ email: { $in: ['admin@nearme.com', 'customer@nearme.com'] } });
    
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@nearme.com',
      passwordHash: 'admin123',
      phone: '+91 98000 00001',
      role: 'admin'
    });

    const customerUser = await User.create({
      name: 'Pooja Verma',
      email: 'customer@nearme.com',
      passwordHash: 'customer123',
      phone: '+91 98000 00002',
      role: 'customer'
    });

    console.log('✅ Demo Users created:');
    console.log('   Admin:    admin@nearme.com / admin123');
    console.log('   Customer: customer@nearme.com / customer123');

    // 2. Clear existing demo businesses
    await Business.deleteMany({ isDemo: true });

    // 3. Insert demo businesses
    const insertedBusinesses = await Business.insertMany(demoBusinesses);
    console.log(`✅ Inserted ${insertedBusinesses.length} verified consulting businesses with 2dsphere GeoJSON points.`);

    // 4. Seed sample reviews for the businesses
    await Review.deleteMany({});
    let reviewCount = 0;
    for (let i = 0; i < insertedBusinesses.length; i++) {
      const b = insertedBusinesses[i];
      const reviewTemplate = sampleReviews[i % sampleReviews.length];
      await Review.create({
        userId: customerUser._id,
        userName: reviewTemplate.userName,
        businessId: b._id,
        rating: reviewTemplate.rating,
        comment: reviewTemplate.comment
      });
      reviewCount++;
    }
    console.log(`✅ Seeded ${reviewCount} customer reviews.`);

    // 5. Seed sample booking
    await Booking.deleteMany({});
    const sampleBooking = await Booking.create({
      userId: customerUser._id,
      businessId: insertedBusinesses[0]._id,
      customerName: customerUser.name,
      email: customerUser.email,
      phone: customerUser.phone,
      service: insertedBusinesses[0].services[0],
      bookingDate: '2026-11-28',
      bookingTime: '11:00 AM',
      location: 'Online Video Consultation',
      requirements: 'Need advice on cloud cost optimization and infrastructure scaling.',
      status: 'confirmed',
      bookingReference: 'NMC-20261128-DEMO1'
    });
    console.log(`✅ Seeded sample booking with reference: ${sampleBooking.bookingReference}`);

    console.log('🎉 Seeding successfully completed!');
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
  } finally {
    await disconnectDB();
    process.exit(0);
  }
};

if (require.main === module) {
  seedData();
}

module.exports = { seedData };
