// RESPONSIBILITY: Encapsulates logic, UI, or types for this module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Single source of truth for ALL hardcoded UI data in the Landing module.
// When backend APIs are ready, replace these arrays one-by-one with API calls — zero UI changes needed.
// Rule 3: No hardcoded data is allowed in .tsx view files. Rule 35: No magic strings.
import { Dumbbell, ArrowRight, Heart, Zap as Lightning, Users, Shield, Award, Clock } from 'lucide-react';

// ─── Hero Stats Strip ─────────────────────────────────────────────────────── //
export const STATS = [
  { value: '5000+', label: 'Happy Members' },
  { value: '10+',   label: 'Expert Trainers' },
  { value: '24/7',  label: 'Always Open' },
  { value: '15+',   label: 'Years Experience' },
];

// ─── Services / Programs ──────────────────────────────────────────────────── //
// colorClass maps to a .landing-service-icon--* class defined in landing.css
// (Rule 4/36: no dynamic Tailwind gradient strings in JSX)
export const SERVICES = [
  { icon: Dumbbell,  title: 'Bodybuilding',      desc: 'State-of-the-art equipment for strength & muscle building with expert guidance',              colorClass: 'landing-service-icon--bodybuilding' },
  { icon: ArrowRight,title: 'Weight Loss',        desc: 'Effective fat loss programs combining cardio, diet, and strength training',                   colorClass: 'landing-service-icon--weightloss' },
  { icon: ArrowRight,title: 'Weight Gain',        desc: 'Specialized programs and nutrition for healthy weight and muscle mass gain',                   colorClass: 'landing-service-icon--weightgain' },
  { icon: Heart,     title: 'Cardio',             desc: 'Modern treadmills, cycles and ellipticals for endurance training',                            colorClass: 'landing-service-icon--cardio' },
  { icon: Lightning, title: 'Crossfit',           desc: 'High-intensity functional training for maximum calorie burn and performance',                  colorClass: 'landing-service-icon--crossfit' },
  { icon: Users,     title: 'Yoga',               desc: 'Improve flexibility, mental focus, and core strength in peaceful sessions',                    colorClass: 'landing-service-icon--yoga' },
  { icon: Users,     title: 'Zumba',              desc: 'Fun and energetic dance fitness classes to burn calories with joy',                            colorClass: 'landing-service-icon--zumba' },
  { icon: Shield,    title: 'Personal Training',  desc: 'One-on-one certified trainer sessions with custom diet & workout plans',                       colorClass: 'landing-service-icon--personaltraining' },
  { icon: Award,     title: 'Diet Plan',          desc: '5M+ food database with custom meal plans designed for your fitness goals',                     colorClass: 'landing-service-icon--dietplan' },
];

// ─── Trainer Team ─────────────────────────────────────────────────────────── //
// avatarClass maps to a .landing-trainer-avatar--* class defined in landing.css
export const TRAINERS = [
  { name: 'Rajesh Kumar', role: 'Head Trainer & Nutritionist', exp: '12 yrs', spec: 'Bodybuilding, Strength', cert: 'ACE Certified',  initials: 'RK', avatarClass: 'landing-trainer-avatar--rk' },
  { name: 'Pooja Sharma', role: 'Yoga & Wellness Coach',       exp: '8 yrs',  spec: 'Yoga, Mindfulness',      cert: 'RYT 500',        initials: 'PS', avatarClass: 'landing-trainer-avatar--ps' },
  { name: 'Arjun Mehta',  role: 'CrossFit Specialist',         exp: '6 yrs',  spec: 'HIIT, CrossFit',         cert: 'CrossFit L2',    initials: 'AM', avatarClass: 'landing-trainer-avatar--am' },
  { name: 'Sunita Rao',   role: 'Cardio & Zumba Expert',       exp: '9 yrs',  spec: 'Cardio, Dance Fitness',  cert: 'Zumba Pro',      initials: 'SR', avatarClass: 'landing-trainer-avatar--sr' },
];

// ─── About Section — Stats Cards ──────────────────────────────────────────── //
// iconClass maps to .landing-stat-icon--* in landing.css
// Extracted from LandingAbout.tsx inline definition (Violation 2 fix)
export const ABOUT_STATS_CARDS = [
  { label: 'Happy Members',    value: '5000+', icon: Users,  iconClass: 'landing-stat-icon--members' },
  { label: 'Expert Trainers',  value: '10+',   icon: Award,  iconClass: 'landing-stat-icon--trainers' },
  { label: 'Hours Open',       value: '24/7',  icon: Clock,  iconClass: 'landing-stat-icon--hours' },
  { label: 'Transformations',  value: '2000+', icon: Heart,  iconClass: 'landing-stat-icon--transformations' },
];

// ─── About Section — Feature Checklist ───────────────────────────────────── //
// Extracted from LandingAbout.tsx inline definition (Violation 2 fix)
export const ABOUT_FEATURES = [
  '10+ Certified Trainers',
  '24/7 Open',
  '5M+ Food Database',
  'Ladies Only Sections',
  'Steam & Locker Rooms',
  'Free Diet Consultation',
];

// ─── Transformations / Success Stories ───────────────────────────────────── //
export const TRANSFORMATIONS = [
  { name: 'Rahul Sharma', type: 'Fat Loss',            before: '98 kg',  after: '72 kg', duration: '6 months', initials: 'RS', review: 'Lost 26kg! GymSmart trainers are the best. Life changing experience!' },
  { name: 'Priya Patel',  type: 'Muscle Gain',         before: '48 kg',  after: '58 kg', duration: '4 months', initials: 'PP', review: 'Gained lean muscle, feel so confident now. Best gym in the city!' },
  { name: 'Amit Verma',   type: 'Body Transformation', before: '110 kg', after: '78 kg', duration: '8 months', initials: 'AV', review: 'From XL to M size! The diet plans and training were perfectly tailored.' },
];

// ─── Testimonials ─────────────────────────────────────────────────────────── //
export const TESTIMONIALS = [
  { name: 'Sneha Mehta', rating: 5, text: 'GymSmart has completely transformed my lifestyle. The trainers are professional and the facilities are world-class. 100% recommended!', member: 'Premium Member – 2 years',   initials: 'SM' },
  { name: 'Vijay Singh', rating: 5, text: 'Best gym in Mumbai! The 24/7 access is super convenient for my work schedule. Diet plans actually work!',                               member: 'Gold Member – 1 year',      initials: 'VS' },
  { name: 'Anita Gupta', rating: 5, text: 'Lost 15kg in 4 months with the personalized program. The team is super supportive and motivating!',                                     member: 'Annual Member – 3 years',   initials: 'AG' },
  { name: 'Rohit Yadav', rating: 5, text: 'Amazing equipment, clean facilities, and expert trainers. The GymSmart app makes tracking progress so easy!',                           member: 'Premium Member – 18 months', initials: 'RY' },
];

// ─── Membership Plans ─────────────────────────────────────────────────────── //
export const PLANS = [
  { name: '1 Month',          price: '₹1,500',  oldPrice: '₹2,000',  duration: '1 month',  features: ['General Gym Access', 'Locker facility', 'Cardio equipment'],                        color: 'border-border' },
  { name: '3 Months',         price: '₹4,000',  oldPrice: '₹4,500',  duration: '3 months', features: ['Everything in 1 Month', 'Basic Diet Guidance', 'Group Classes'],                    color: 'border-info',    badge: 'Popular' },
  { name: '6 Months',         price: '₹7,500',  oldPrice: '₹9,000',  duration: '6 months', features: ['Everything in 3 Months', '1 PT Session/month', 'Body comp analysis'],               color: 'border-warning' },
  { name: '12 Months',        price: '₹12,000', oldPrice: '₹18,000', duration: 'Annual',   features: ['Everything in 6 Months', '2 months FREE', 'Advanced Meal Planning'],                color: 'border-warning', badge: 'Best Value' },
  { name: 'Personal Training',price: '₹8,000',  oldPrice: '₹10,000', duration: '/month',   features: ['1-on-1 Dedicated Trainer', 'Custom Daily Diet', 'Priority Access'],                 color: 'border-primary' },
];

// ─── Class Schedule Timetable ─────────────────────────────────────────────── //
export const SCHEDULE = [
  { time: '06:00 AM - 08:00 AM', monday: 'Cardio (Sunita)',   tuesday: 'CrossFit (Arjun)',  wednesday: 'Yoga (Pooja)',      thursday: 'Strength (Rajesh)', friday: 'Zumba (Sunita)',   saturday: 'CrossFit (Arjun)', sunday: 'Rest' },
  { time: '08:00 AM - 10:00 AM', monday: 'Strength (Rajesh)', tuesday: 'Yoga (Pooja)',      wednesday: 'Cardio (Sunita)',   thursday: 'CrossFit (Arjun)', friday: 'Strength (Rajesh)',saturday: 'Yoga (Pooja)',     sunday: 'Open Gym' },
  { time: '06:00 PM - 08:00 PM', monday: 'Zumba (Sunita)',    tuesday: 'Strength (Rajesh)', wednesday: 'CrossFit (Arjun)', thursday: 'Yoga (Pooja)',      friday: 'Cardio (Sunita)',  saturday: 'Zumba (Sunita)',   sunday: 'Open Gym' },
  { time: '08:00 PM - 10:00 PM', monday: 'CrossFit (Arjun)',  tuesday: 'Cardio (Sunita)',   wednesday: 'Strength (Rajesh)',thursday: 'Zumba (Sunita)',    friday: 'Yoga (Pooja)',     saturday: 'Rest',             sunday: 'Closed' },
];

// ─── Form Default States ──────────────────────────────────────────────────── //
export const EMPTY_BOOKING_FORM = {
  name:  '',
  email: '',
  phone: '',
  date:  '',
  type:  'trial',
};

export const EMPTY_CONTACT_FORM = {
  name:    '',
  email:   '',
  message: '',
};

