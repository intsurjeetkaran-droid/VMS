/**
 * Full Seed Script
 * Creates: 1 admin, 3 receptionists, 10 employees
 * + 30 visitors (various statuses), check-in/out logs, appointments
 * Run: node src/scripts/seedAll.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Visitor = require('../models/Visitor');
const Log = require('../models/Log');
const Appointment = require('../models/Appointment');

// ─── User Data ────────────────────────────────────────────────────────────────

const adminData = [
  { name: 'Surjeet Karan',    email: 'admin@vms.com',        password: 'Admin@123',       role: 'admin',         department: 'Management' },
];

const receptionistData = [
  { name: 'Priya Sharma',     email: 'priya@vms.com',        password: 'Reception@123',   role: 'receptionist',  department: 'Front Desk' },
  { name: 'Rahul Verma',      email: 'rahul@vms.com',        password: 'Reception@123',   role: 'receptionist',  department: 'Front Desk' },
  { name: 'Sneha Patel',      email: 'sneha@vms.com',        password: 'Reception@123',   role: 'receptionist',  department: 'Front Desk' },
];

const employeeData = [
  { name: 'Amit Kumar',       email: 'amit@vms.com',         password: 'Employee@123',    role: 'employee',      department: 'Engineering' },
  { name: 'Neha Singh',       email: 'neha@vms.com',         password: 'Employee@123',    role: 'employee',      department: 'Engineering' },
  { name: 'Vikram Rao',       email: 'vikram@vms.com',       password: 'Employee@123',    role: 'employee',      department: 'Sales' },
  { name: 'Pooja Mehta',      email: 'pooja@vms.com',        password: 'Employee@123',    role: 'employee',      department: 'HR' },
  { name: 'Arjun Nair',       email: 'arjun@vms.com',        password: 'Employee@123',    role: 'employee',      department: 'Finance' },
  { name: 'Kavya Reddy',      email: 'kavya@vms.com',        password: 'Employee@123',    role: 'employee',      department: 'Marketing' },
  { name: 'Rohan Gupta',      email: 'rohan@vms.com',        password: 'Employee@123',    role: 'employee',      department: 'Engineering' },
  { name: 'Divya Joshi',      email: 'divya@vms.com',        password: 'Employee@123',    role: 'employee',      department: 'Operations' },
  { name: 'Sanjay Tiwari',    email: 'sanjay@vms.com',       password: 'Employee@123',    role: 'employee',      department: 'Legal' },
  { name: 'Meera Iyer',       email: 'meera@vms.com',        password: 'Employee@123',    role: 'employee',      department: 'Design' },
];

// ─── Visitor Data ─────────────────────────────────────────────────────────────

const visitorNames = [
  'Rajesh Khanna',    'Sunita Devi',     'Mohan Lal',       'Geeta Bai',
  'Suresh Babu',      'Anita Kumari',    'Deepak Jain',     'Rekha Sharma',
  'Manoj Tiwari',     'Seema Gupta',     'Arun Mishra',     'Nisha Yadav',
  'Prakash Chandra',  'Usha Rani',       'Vinod Kumar',     'Lata Mangeshkar',
  'Harish Chandra',   'Savita Devi',     'Ramesh Babu',     'Poonam Singh',
  'Ajay Devgan',      'Kajol Mukherjee', 'Sonu Nigam',      'Shreya Ghoshal',
  'Ranbir Kapoor',    'Deepika Padukone','Virat Kohli',     'Anushka Sharma',
  'Rohit Sharma',     'Priyanka Chopra',
];

const phones = [
  '9876543210', '9123456789', '9988776655', '9871234567', '9765432109',
  '9654321098', '9543210987', '9432109876', '9321098765', '9210987654',
  '8987654321', '8876543210', '8765432109', '8654321098', '8543210987',
  '8432109876', '8321098765', '8210987654', '7987654321', '7876543210',
  '7765432109', '7654321098', '7543210987', '7432109876', '7321098765',
  '7210987654', '6987654321', '6876543210', '6765432109', '6654321098',
];

const purposes = [
  'Business Meeting', 'Job Interview', 'Client Visit', 'Vendor Meeting',
  'Product Demo', 'Contract Signing', 'Training Session', 'Audit Visit',
  'Partnership Discussion', 'Technical Support', 'Delivery', 'Maintenance',
];

const companies = [
  'TechCorp India', 'Infosys Ltd', 'Wipro Technologies', 'HCL Tech',
  'Tata Consultancy', 'Reliance Industries', 'HDFC Bank', 'ICICI Bank',
  'Mahindra Group', 'Bajaj Auto', 'Freelancer', 'Self Employed',
];

const statuses = [
  'pending', 'pending', 'pending',
  'approved', 'approved',
  'checked-in', 'checked-in', 'checked-in', 'checked-in',
  'checked-out', 'checked-out', 'checked-out', 'checked-out', 'checked-out',
  'rejected',
];

// ─── Appointment Data ─────────────────────────────────────────────────────────

const appointmentPurposes = [
  'Quarterly Review Meeting', 'New Project Kickoff', 'Budget Discussion',
  'Performance Appraisal', 'Technical Interview', 'Client Onboarding',
  'Partnership Proposal', 'Product Roadmap Review',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
};

const hoursAgo = (n) => {
  const d = new Date();
  d.setHours(d.getHours() - n);
  return d;
};

const futureDays = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
};

// ─── Main Seed ────────────────────────────────────────────────────────────────

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB Atlas\n');

  // Clear existing data
  await Promise.all([
    User.deleteMany({}),
    Visitor.deleteMany({}),
    Log.deleteMany({}),
    Appointment.deleteMany({}),
  ]);
  console.log('🗑️  Cleared existing data\n');

  // ── Create Users ──
  // Note: User model pre('save') hook handles hashing — do NOT pre-hash here
  const allUserData = [...adminData, ...receptionistData, ...employeeData];
  const createdUsers = [];

  for (const u of allUserData) {
    const user = await User.create({ ...u }); // model hook hashes password automatically
    createdUsers.push(user);
  }

  const admin        = createdUsers.find((u) => u.role === 'admin');
  const receptionists = createdUsers.filter((u) => u.role === 'receptionist');
  const employees    = createdUsers.filter((u) => u.role === 'employee');

  console.log(`👤 Created ${adminData.length} admin`);
  console.log(`🧑‍💻 Created ${receptionists.length} receptionists`);
  console.log(`👨‍💼 Created ${employees.length} employees\n`);

  // ── Create Visitors ──
  const createdVisitors = [];

  for (let i = 0; i < 30; i++) {
    const status   = statuses[i % statuses.length];
    const host     = employees[i % employees.length];
    const recept   = receptionists[i % receptionists.length];
    const daysBack = Math.floor(i / 5); // spread over last 6 days

    const entryTime = (status === 'checked-in' || status === 'checked-out')
      ? hoursAgo(Math.floor(Math.random() * 6) + 1)
      : null;

    const exitTime = status === 'checked-out'
      ? new Date(entryTime.getTime() + (Math.floor(Math.random() * 120) + 30) * 60000)
      : null;

    const visitor = await Visitor.create({
      name:          visitorNames[i],
      phone:         phones[i],
      email:         `visitor${i + 1}@example.com`,
      purpose:       pick(purposes),
      company:       pick(companies),
      host_id:       host._id,
      registered_by: recept._id,
      status,
      entry_time:    entryTime,
      exit_time:     exitTime,
      is_blacklisted: i === 29, // last visitor is blacklisted
      notes:         i === 29 ? 'Blacklisted: Unauthorized access attempt' : '',
      createdAt:     daysAgo(daysBack),
    });

    createdVisitors.push(visitor);
  }

  console.log(`🧑 Created ${createdVisitors.length} visitors\n`);

  // ── Create Logs for checked-in and checked-out visitors ──
  const logsToCreate = [];

  for (const v of createdVisitors) {
    const recept = receptionists[Math.floor(Math.random() * receptionists.length)];

    if (v.status === 'checked-in' || v.status === 'checked-out') {
      logsToCreate.push({
        type:         'checkin',
        visitor_id:   v._id,
        performed_by: recept._id,
        timestamp:    v.entry_time,
      });
    }

    if (v.status === 'checked-out') {
      logsToCreate.push({
        type:         'checkout',
        visitor_id:   v._id,
        performed_by: recept._id,
        timestamp:    v.exit_time,
      });
    }
  }

  await Log.insertMany(logsToCreate);
  console.log(`📋 Created ${logsToCreate.length} activity logs\n`);

  // ── Create Appointments ──
  const appointmentVisitorNames = [
    'Kiran Bedi', 'Sachin Tendulkar', 'Saina Nehwal', 'Mary Kom',
    'Milkha Singh', 'PT Usha', 'Leander Paes', 'Sania Mirza',
  ];

  const appointmentStatuses = ['pending', 'pending', 'approved', 'rejected', 'pending', 'approved', 'pending', 'approved'];

  for (let i = 0; i < 8; i++) {
    const host = employees[i % employees.length];
    await Appointment.create({
      visitor_name:  appointmentVisitorNames[i],
      visitor_phone: `98000${10000 + i}`,
      visitor_email: `appt${i + 1}@example.com`,
      purpose:       pick(appointmentPurposes),
      host_id:       host._id,
      scheduled_time: i < 4 ? futureDays(i + 1) : daysAgo(i - 3),
      status:        appointmentStatuses[i],
      notes:         i % 2 === 0 ? 'Please bring ID proof' : '',
    });
  }

  console.log(`📅 Created 8 appointments\n`);

  // ── Summary ──
  console.log('═══════════════════════════════════════════════');
  console.log('           SEED COMPLETE — CREDENTIALS          ');
  console.log('═══════════════════════════════════════════════');
  console.log('\n🔑 ADMIN');
  console.log(`   Email:    admin@vms.com`);
  console.log(`   Password: Admin@123`);

  console.log('\n🧑‍💻 RECEPTIONISTS');
  receptionistData.forEach((r) => {
    console.log(`   ${r.name.padEnd(18)} | ${r.email.padEnd(22)} | Reception@123`);
  });

  console.log('\n👨‍💼 EMPLOYEES');
  employeeData.forEach((e) => {
    console.log(`   ${e.name.padEnd(18)} | ${e.email.padEnd(22)} | Employee@123`);
  });

  console.log('\n═══════════════════════════════════════════════\n');

  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
