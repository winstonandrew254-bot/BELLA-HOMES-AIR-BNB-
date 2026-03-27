/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bed, Wifi, MessageCircle, ChevronRight, Shield, Clock, Sparkles, Star, X, CheckCircle, MapPin, Search, Calendar, Loader2, AlertCircle, Share2, Facebook, Mail, Link as LinkIcon } from 'lucide-react';
import { format, addDays, startOfToday, isAfter, eachDayOfInterval, isSameDay } from 'date-fns';
import { BookingCalendar } from './components/BookingCalendar';
import { FollowUpForm } from './components/FollowUpForm';
import { Lightbox } from './components/Lightbox';
import { WelcomeVideo } from './components/WelcomeVideo';

const today = startOfToday();

const featuredProperties = [
  { 
    id: 1, 
    title: 'Modern Luxury Studio - Elburgon', 
    price: '1,500 KES', 
    beds: '1 6x6 Bed',
    description: 'A premium one-bedroom sanctuary featuring modern finishes, a fully equipped kitchen, and high-speed internet. Perfect for business or leisure.',
    benefits: ['24/7 Security', 'Secure Parking', 'High-speed Wi-Fi', 'Smart TV'],
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1594498653385-d5172b532c00?auto=format&fit=crop&w=800&q=80'
    ],
    bookedDates: [addDays(today, 2), addDays(today, 3), addDays(today, 7), addDays(today, 8)]
  },
  { 
    id: 2, 
    title: 'The Serene Luxury Haven', 
    price: '2,500 KES', 
    beds: '1 6x6 Bed',
    description: 'A masterclass in minimalist luxury. This serene haven combines high-end finishes with a warm, cozy atmosphere, offering an understated yet expensive living experience in Elburgon.',
    benefits: ['Premium Linens', 'Ambient Lighting', 'Smart Home Features', 'Lush Surroundings'],
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618221469555-7f3ad97540d6?auto=format&fit=crop&w=800&q=80'
    ],
    bookedDates: [addDays(today, 5), addDays(today, 6), addDays(today, 12)]
  },
  { 
    id: 3, 
    title: 'The Urban Loft - Elburgon', 
    price: '2,500 KES', 
    beds: '1 6x6 Bed',
    description: 'Contemporary design meets comfort. This loft offers a unique living experience with industrial accents and all the luxury amenities you need.',
    benefits: ['Contemporary Design', 'Backup Generator', 'Laundry Area', 'Near Amenities'],
    image: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560184897-ae75f418493e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?auto=format&fit=crop&w=800&q=80'
    ],
    bookedDates: [addDays(today, 1), addDays(today, 4), addDays(today, 10), addDays(today, 11)]
  },
];

const testimonials = [
  {
    id: 1,
    name: 'Sarah Wanjiku',
    role: 'Family Traveler',
    content: 'The Elburgon Home was exactly what we needed for our family getaway. Clean, spacious, and the service was top-notch!',
    image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 2,
    name: 'James Kamau',
    role: 'Nature Enthusiast',
    content: 'Molo BnB is a hidden gem. The tranquility and the views are unmatched. Highly recommend Bella Homes for direct bookings.',
    image: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 3,
    name: 'Anita Mutua',
    role: 'Business Traveler',
    content: 'Stayed at the Modern Studio and it was perfect for my business trip. Fast Wi-Fi and very comfortable.',
    image: 'https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?auto=format&fit=crop&w=150&q=80'
  }
];

export default function App() {
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [viewProperty, setViewProperty] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  
  // Customer Details State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  
  // Follow-up State
  const [pendingFollowUp, setPendingFollowUp] = useState<any>(null);
  
  // Availability Check State
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);

  // Lightbox State
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Booking Step State
  const [bookingStep, setBookingStep] = useState(1);

  // Load bookings and check for follow-ups
  React.useEffect(() => {
    const savedBookings = localStorage.getItem('bella_homes_bookings');
    if (savedBookings) {
      const bookings = JSON.parse(savedBookings);
      const pastBooking = bookings.find((b: any) => 
        isAfter(today, new Date(b.checkOut)) && !b.reviewed
      );
      if (pastBooking) {
        setPendingFollowUp(pastBooking);
      }
    }
  }, []);

  const handleBookNow = async (property: any) => {
    if (!checkIn || !checkOut) return;
    
    setIsCheckingAvailability(true);
    setAvailabilityError(null);

    // Simulate a server-side availability check
    await new Promise(resolve => setTimeout(resolve, 1500));

    const selectedInterval = eachDayOfInterval({ start: checkIn, end: checkOut });
    const isConflict = selectedInterval.some(date => 
      property.bookedDates?.some((bookedDate: Date) => isSameDay(date, bookedDate))
    );

    setIsCheckingAvailability(false);

    if (isConflict) {
      setAvailabilityError("We're sorry, but some of the selected dates have just been booked by another guest. Please choose different dates.");
    } else {
      setSelectedProperty(property);
    }
  };

  const handleShare = async (property: any) => {
    const shareData = {
      title: `Bella Homes - ${property.title}`,
      text: `Check out this amazing property at Bella Homes: ${property.title}. Starting at ${property.price} per night.`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy link:', err);
      }
    }
  };

  const closeModal = () => {
    setSelectedProperty(null);
    setCustomerName('');
    setCustomerPhone('');
    setCustomerEmail('');
    setBookingStep(1);
  };

  const closeDetail = () => {
    setViewProperty(null);
    setCheckIn(null);
    setCheckOut(null);
    window.scrollTo(0, 0);
  };

  const confirmBooking = () => {
    const newBooking = {
      id: Date.now(),
      propertyId: selectedProperty.id,
      propertyTitle: selectedProperty.title,
      checkIn: checkIn?.toISOString(),
      checkOut: checkOut?.toISOString(),
      customerName,
      customerPhone,
      customerEmail,
      reviewed: false
    };

    const savedBookings = localStorage.getItem('bella_homes_bookings');
    const bookings = savedBookings ? JSON.parse(savedBookings) : [];
    bookings.push(newBooking);
    localStorage.setItem('bella_homes_bookings', JSON.stringify(bookings));

    // Construct WhatsApp message
    const message = `Hello Bella Homes,
I would like to book the ${selectedProperty.title} (${selectedProperty.price}/night).

Details:
- Name: ${customerName}
- Phone: ${customerPhone}
- Email: ${customerEmail}
- Check-in: ${checkIn ? format(checkIn, 'MMM dd, yyyy') : ''}
- Check-out: ${checkOut ? format(checkOut, 'MMM dd, yyyy') : ''}

Please confirm availability.`;

    window.open(`https://wa.me/254799590951?text=${encodeURIComponent(message)}`, '_blank');
    closeModal();
  };

  const filteredProperties = featuredProperties.filter(property => 
    property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.benefits.some(benefit => benefit.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-dark">
      {/* Sticky Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div 
            className="text-2xl font-bold tracking-tighter cursor-pointer"
            onClick={closeDetail}
          >
            BELLA<span className="text-gold">HOMES</span>
          </div>
          
          {!viewProperty && (
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by location, type, or features..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-neutral-100 border-none rounded-full focus:ring-2 focus:ring-gold/50 transition-all outline-none text-sm"
              />
            </div>
          )}

          <nav className="hidden md:flex gap-8 text-sm font-semibold">
            <a href="#home" onClick={closeDetail} className="hover:text-gold transition-colors">Home</a>
            <a href="#properties" onClick={closeDetail} className="hover:text-gold transition-colors">Properties</a>
            <a href="#about" onClick={closeDetail} className="hover:text-gold transition-colors">About</a>
            <a href="#contact" onClick={closeDetail} className="hover:text-gold transition-colors">Contact</a>
          </nav>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {viewProperty ? (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="pt-24 pb-20 px-4 max-w-7xl mx-auto"
          >
            <div className="flex items-center justify-between mb-8">
              <button 
                onClick={closeDetail}
                className="flex items-center gap-2 text-gold font-bold hover:underline"
              >
                <ChevronRight className="rotate-180" size={20} /> Back to Listings
              </button>
              
              <button 
                onClick={() => handleShare(viewProperty)}
                className="flex items-center gap-2 bg-white border border-neutral-200 px-4 py-2 rounded-full text-sm font-bold hover:bg-neutral-50 transition-colors shadow-sm"
              >
                <Share2 size={18} className="text-gold" /> Share Property
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Image Gallery */}
              <div className="space-y-4">
                <div 
                  className="rounded-2xl overflow-hidden shadow-lg aspect-video cursor-pointer hover:opacity-95 transition-opacity"
                  onClick={() => setLightboxIndex(0)}
                >
                  <img 
                    src={viewProperty.image} 
                    alt={viewProperty.title} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {viewProperty.gallery.map((img: string, i: number) => (
                    <div 
                      key={i} 
                      className="group relative rounded-xl overflow-hidden shadow-sm aspect-square cursor-pointer transition-all"
                      onClick={() => setLightboxIndex(i + 1)}
                    >
                      <img 
                        src={img} 
                        alt="Gallery" 
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" 
                        referrerPolicy="no-referrer" 
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Property Info */}
              <div className="flex flex-col">
                <div className="mb-6">
                  <h1 className="text-4xl font-bold mb-2">{viewProperty.title}</h1>
                  <p className="text-gold text-2xl font-bold">{viewProperty.price} <span className="text-neutral-500 text-lg font-normal">/ night</span></p>
                </div>

                <div className="prose prose-neutral max-w-none text-neutral-600 mb-8">
                  <p className="text-lg leading-relaxed">{viewProperty.description}</p>
                  <p>Experience the perfect blend of luxury and comfort in our meticulously designed space. Every corner is crafted to provide you with a high-end living experience that feels just like home.</p>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-neutral-100 shadow-sm">
                    <Bed className="text-gold" size={24} />
                    <div>
                      <p className="text-xs text-neutral-500 uppercase font-bold tracking-wider">Beds</p>
                      <p className="font-bold">{viewProperty.beds}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-neutral-100 shadow-sm">
                    <Wifi className="text-gold" size={24} />
                    <div>
                      <p className="text-xs text-neutral-500 uppercase font-bold tracking-wider">Internet</p>
                      <p className="font-bold">High-speed Wi-Fi</p>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4">Amenities & Features</h3>
                  <div className="grid grid-cols-2 gap-y-3">
                    {viewProperty.benefits.map((benefit: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-neutral-600">
                        <CheckCircle className="text-gold" size={18} />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <BookingCalendar 
                    checkIn={checkIn} 
                    checkOut={checkOut} 
                    onSelectDates={(inDate, outDate) => {
                      setCheckIn(inDate);
                      setCheckOut(outDate);
                      setAvailabilityError(null);
                    }}
                    bookedDates={viewProperty.bookedDates}
                  />
                  {availabilityError && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-sm"
                    >
                      <AlertCircle size={18} className="shrink-0 mt-0.5" />
                      <p>{availabilityError}</p>
                    </motion.div>
                  )}
                </div>

                <button 
                  onClick={() => handleBookNow(viewProperty)}
                  disabled={!checkIn || !checkOut || isCheckingAvailability}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2 ${
                    !checkIn || !checkOut || isCheckingAvailability
                    ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed shadow-none' 
                    : 'bg-gold hover:bg-gold-dark text-white shadow-gold/20'
                  }`}
                >
                  {isCheckingAvailability ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Checking Availability...
                    </>
                  ) : (
                    <>
                      <MessageCircle size={20} /> 
                      {!checkIn || !checkOut ? 'Select Dates to Book' : 'Book This Property'}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Map Section */}
            <div className="mt-20">
              <h3 className="text-2xl font-bold mb-6">Location & Neighborhood</h3>
              <div className="rounded-2xl overflow-hidden shadow-lg border border-neutral-200 h-[400px] relative">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.758362624584!2d35.8115623!3d-0.3134375!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1829910000000001%3A0x0!2zMMKwMTgnNDguNCJTIDM1wrA0OCczOS42IkU!5e0!3m2!1sen!2ske!4v1711530000000!5m2!1sen!2ske" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Property Location"
                ></iframe>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-2 text-neutral-600">
                  <MapPin className="text-gold" size={20} />
                  <span>Elburgon, Kenya</span>
                </div>
                <a 
                  href="https://maps.app.goo.gl/WSnZ4fceaLv2aoXj6?g_st=aw" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gold font-bold hover:underline"
                >
                  Open in Google Maps
                </a>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Hero Section */}
            <section id="home" className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 text-gold rounded-full text-sm font-bold tracking-wider uppercase">
                    <Sparkles size={16} /> Luxury Living in Elburgon
                  </div>
                  <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight">
                    Experience the <span className="text-gold">Gold Standard</span> of Hospitality
                  </h1>
                  <p className="text-xl text-neutral-600 leading-relaxed max-w-lg">
                    Discover our curated collection of luxury one-bedroom apartments, where modern comfort meets Kenyan warmth.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <a 
                      href="#properties"
                      className="bg-gold hover:bg-gold-dark text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-gold/20 text-center"
                    >
                      View All Listings
                    </a>
                    <a 
                      href="#contact"
                      className="bg-white border-2 border-neutral-100 hover:border-gold text-dark px-8 py-4 rounded-xl font-bold text-lg transition-all text-center"
                    >
                      Contact Support
                    </a>
                  </div>

                  <div className="grid grid-cols-3 gap-8 pt-8 border-t border-neutral-200">
                    <div>
                      <p className="text-3xl font-bold">100%</p>
                      <p className="text-sm text-neutral-500 font-medium">Secure Access</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold">24/7</p>
                      <p className="text-sm text-neutral-500 font-medium">Guest Support</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold">5.0</p>
                      <p className="text-sm text-neutral-500 font-medium">Guest Rating</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="relative"
                >
                  <WelcomeVideo />
                  
                  {/* Floating Booking Options Card */}
                  <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-2xl border border-neutral-100 max-w-xs hidden md:block">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gold/10 text-gold rounded-full flex items-center justify-center">
                        <Calendar size={24} />
                      </div>
                      <div>
                        <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest">Quick Booking</p>
                        <p className="font-bold">Check Availability</p>
                      </div>
                    </div>
                    <p className="text-sm text-neutral-500 mb-4">
                      Select your preferred dates to see our best available rates for luxury stays.
                    </p>
                    <button 
                      onClick={() => document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth' })}
                      className="w-full bg-dark text-white py-3 rounded-xl font-bold text-sm hover:bg-neutral-800 transition-colors"
                    >
                      Browse Properties
                    </button>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Search & Filter Section (Booking Options) */}
            <section className="py-12 px-4 max-w-7xl mx-auto">
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-neutral-100 -mt-10 relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-grow w-full">
                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">Search Properties</label>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
                      <input 
                        type="text" 
                        placeholder="Search by location, type, or features..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-neutral-50 border-2 border-transparent focus:border-gold/30 rounded-2xl transition-all outline-none text-lg font-medium"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4 w-full md:w-auto">
                    <button className="flex-1 md:flex-none bg-neutral-100 hover:bg-neutral-200 text-dark px-8 py-4 rounded-2xl font-bold transition-colors flex items-center justify-center gap-2">
                      <Star size={20} className="text-gold" /> Popular
                    </button>
                    <button className="flex-1 md:flex-none bg-gold hover:bg-gold-dark text-white px-8 py-4 rounded-2xl font-bold transition-colors shadow-lg shadow-gold/20 flex items-center justify-center gap-2">
                      <Search size={20} /> Find Stays
                    </button>
                  </div>
                </div>
              </div>
            </section>

      {/* About Us Section */}
      <section id="about" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80" 
                alt="Hospitality" 
                className="w-full h-[500px] object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gold/10 mix-blend-multiply"></div>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">About Bella Homes</h2>
            <p className="text-neutral-600 mb-6 leading-relaxed text-lg">
              At Bella Homes, we believe that a great BnB is more than just a place to sleep—it's an experience. Founded on the principles of exceptional hospitality and refined living, we curate the finest one-bedroom luxury apartments in Elburgon to provide our guests with a sanctuary of comfort.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-gold/20 p-1 rounded-full text-gold"><Sparkles size={18} /></div>
                <p className="text-neutral-700 font-medium">Curated Comfort: Every detail is chosen to ensure your maximum relaxation.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-gold/20 p-1 rounded-full text-gold"><Sparkles size={18} /></div>
                <p className="text-neutral-700 font-medium">Local Warmth: Experience the true spirit of Kenyan hospitality in every stay.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-gold/20 p-1 rounded-full text-gold"><Sparkles size={18} /></div>
                <p className="text-neutral-700 font-medium">Uncompromising Quality: From high-speed Wi-Fi to 24/7 security, we never settle for less.</p>
              </div>
            </div>
            <p className="text-neutral-500 italic">
              "Our mission is to redefine the staycation experience in Elburgon, offering a blend of modern luxury and serene surroundings that make every visit unforgettable."
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Listings */}
      <section id="properties" className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Luxury 1-Bedroom Apartments</h2>
          <p className="text-neutral-600">Discover the finest living spaces in Elburgon, designed for the discerning traveler.</p>
          <div className="h-1 w-20 bg-gold mx-auto rounded-full mt-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property, index) => (
              <motion.div 
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ 
                  y: -8, 
                  scale: 1.01,
                  borderColor: '#D4AF37',
                  boxShadow: "0 20px 25px -5px rgba(212, 175, 55, 0.08), 0 10px 10px -5px rgba(212, 175, 55, 0.03)",
                  transition: { duration: 0.4, ease: "easeOut" } 
                }}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-neutral-100 group flex flex-col"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={property.image} 
                    alt={property.title} 
                    className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-700 flex items-center justify-center">
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white/95 backdrop-blur-sm px-6 py-2 rounded-full text-dark font-bold text-sm shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-y-4 group-hover:translate-y-0"
                    >
                      View Details
                    </motion.div>
                  </div>
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gold shadow-sm">
                    Luxury Suite
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow cursor-pointer" onClick={() => setViewProperty(property)}>
                  <motion.h3 
                    whileHover={{ x: 2 }}
                    className="text-xl font-bold mb-2 group-hover:text-gold transition-all duration-700"
                  >
                    {property.title}
                  </motion.h3>
                  <p className="text-neutral-500 text-sm mb-4 line-clamp-2">
                    {property.description}
                  </p>
                  <div className="flex items-center gap-4 text-neutral-500 text-sm mb-4">
                    <motion.span 
                      whileHover={{ scale: 1.02, color: '#D4AF37' }}
                      className="flex items-center gap-1 transition-colors duration-500"
                    >
                      <Bed size={16} /> {property.beds}
                    </motion.span>
                    <motion.span 
                      whileHover={{ scale: 1.02, color: '#D4AF37' }}
                      className="flex items-center gap-1 transition-colors duration-500"
                    >
                      <Wifi size={16} /> High-speed Wi-Fi
                    </motion.span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {property.benefits?.map((benefit, i) => (
                      <motion.span 
                        key={i} 
                        whileHover={{ scale: 1.02, backgroundColor: '#FDFCF0' }}
                        className="text-[10px] uppercase tracking-wider font-bold bg-neutral-100 text-neutral-600 px-2 py-1 rounded transition-all duration-500"
                      >
                        {benefit}
                      </motion.span>
                    ))}
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-neutral-100">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="transition-transform duration-500"
                    >
                      <span className="text-2xl font-bold text-dark">{property.price}</span>
                      <span className="text-neutral-500 text-sm"> / night</span>
                    </motion.div>
                    <motion.button 
                      whileHover={{ scale: 1.02, backgroundColor: '#D4AF37', color: '#FFFFFF' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookNow(property);
                      }}
                      className="border-2 border-gold text-gold px-4 py-2 rounded-lg font-bold transition-all shadow-sm hover:shadow-gold/10"
                    >
                      Book Now
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="bg-neutral-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
                <Search size={40} />
              </div>
              <h3 className="text-xl font-bold mb-2">No properties found</h3>
              <p className="text-neutral-500">Try adjusting your search keywords to find what you're looking for.</p>
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-6 text-gold font-bold hover:underline"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Customer Services Section */}
      <section className="py-20 bg-neutral-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Premium Services</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">We go above and beyond to ensure your stay is comfortable, secure, and memorable.</p>
            <div className="h-1 w-20 bg-gold mx-auto rounded-full mt-4"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-200 text-center"
            >
              <div className="w-16 h-16 bg-gold/10 text-gold rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">24/7 Support</h3>
              <p className="text-neutral-600">Our dedicated team is always available to assist you with any needs during your stay.</p>
            </motion.div>
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-200 text-center"
            >
              <div className="w-16 h-16 bg-gold/10 text-gold rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Professional Cleaning</h3>
              <p className="text-neutral-600">We maintain the highest standards of cleanliness with professional housekeeping services.</p>
            </motion.div>
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-200 text-center"
            >
              <div className="w-16 h-16 bg-gold/10 text-gold rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Secure Bookings</h3>
              <p className="text-neutral-600">Your safety and privacy are our priority. We offer secure and verified booking processes.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white border-y border-neutral-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Guests Say</h2>
            <div className="h-1 w-20 bg-gold mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-2xl bg-neutral-50 border border-neutral-100 flex flex-col h-full"
              >
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gold/20"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="font-bold text-dark">{testimonial.name}</h4>
                    <p className="text-xs text-neutral-500 uppercase tracking-wider">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-neutral-600 italic leading-relaxed flex-grow">
                  "{testimonial.content}"
                </p>
                <div className="mt-6 flex gap-1 text-gold">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Submit Testimonial Section */}
      <section id="contact" className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-neutral-100">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-4">Share Your Experience</h2>
              <p className="text-neutral-600">We value your feedback! Tell us about your stay with Bella Homes.</p>
            </div>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Rating</label>
                <div className="flex gap-2 text-neutral-300">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" className="hover:text-gold transition-colors">
                      <Star size={24} fill="currentColor" />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Your Testimonial</label>
                <textarea 
                  rows={4}
                  placeholder="Tell us about your stay..."
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all resize-none"
                ></textarea>
              </div>
              <button className="w-full bg-gold hover:bg-gold-dark text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg">
                Submit Testimonial
              </button>
            </form>
          </div>

          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
            <p className="text-neutral-600 mb-8 leading-relaxed">
              Have questions about our Elburgon luxury apartments? Our team is ready to assist you with bookings, special requests, or any inquiries you might have.
            </p>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gold/10 text-gold rounded-full flex items-center justify-center">
                  <MessageCircle size={24} />
                </div>
                <div>
                  <p className="text-sm text-neutral-500 font-medium">Main Contact (WhatsApp)</p>
                  <a href="https://wa.me/254799590951" className="text-xl font-bold hover:text-gold transition-colors">0799590951</a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gold/10 text-gold rounded-full flex items-center justify-center">
                  <Clock size={24} />
                </div>
                <div>
                  <p className="text-sm text-neutral-500 font-medium">Response Time</p>
                  <p className="text-xl font-bold">Under 30 Minutes</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gold/10 text-gold rounded-full flex items-center justify-center">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-sm text-neutral-500 font-medium">Location</p>
                  <a 
                    href="https://maps.app.goo.gl/WSnZ4fceaLv2aoXj6?g_st=aw" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xl font-bold hover:text-gold transition-colors"
                  >
                    View on Google Maps
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-10 rounded-2xl overflow-hidden shadow-lg border border-neutral-200">
              <img 
                src="https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&w=800&q=80" 
                alt="Contact Us" 
                className="w-full h-48 object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Policy Section */}
      <section id="privacy" className="py-20 bg-white border-t border-neutral-100">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Privacy Policy</h2>
            <div className="h-1 w-20 bg-gold mx-auto rounded-full"></div>
          </div>
          <div className="prose prose-neutral max-w-none text-neutral-600 space-y-6">
            <p>
              At Bella Homes, your privacy is our priority. This policy outlines how we handle your information when you use our services.
            </p>
            <div>
              <h3 className="text-xl font-bold text-dark mb-2">1. Information We Collect</h3>
              <p>We collect information necessary to process your bookings, such as your name, contact details, and payment information. We also collect feedback through our testimonial forms to improve our services.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-dark mb-2">2. How We Use Your Data</h3>
              <p>Your data is used solely for managing your stays, communicating booking details, and providing personalized customer support. We do not sell your personal information to third parties.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-dark mb-2">3. Security</h3>
              <p>We implement industry-standard security measures to protect your data from unauthorized access. Our WhatsApp-based booking system ensures a direct and secure line of communication.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-dark mb-2">4. Your Rights</h3>
              <p>You have the right to access, correct, or request the deletion of your personal data at any time. Simply contact us via our main WhatsApp line.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-dark py-20 px-4 text-center text-white">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready for your Kenya staycation?</h2>
          <p className="text-white/70 mb-10 text-lg">
            Contact us directly via WhatsApp for personalized booking assistance and exclusive offers.
          </p>
          <a 
            href="https://wa.me/254799590951"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gold hover:bg-gold-dark text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors shadow-lg flex items-center gap-2 mx-auto w-fit"
          >
            <MessageCircle size={20} /> Chat on WhatsApp
          </a>
        </motion.div>
      </section>
    </motion.div>
  )}
</AnimatePresence>

      {/* Booking Confirmation Modal (Global) */}
      <AnimatePresence>
        {selectedProperty && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
            >
              <button 
                onClick={closeModal}
                className="absolute top-4 right-4 text-neutral-400 hover:text-dark transition-colors z-10"
              >
                <X size={24} />
              </button>
              
              <div className="p-8">
                {/* Progress Indicator */}
                <div className="flex items-center justify-between mb-8 relative">
                  <div className="absolute top-1/2 left-0 w-full h-0.5 bg-neutral-100 -translate-y-1/2 z-0" />
                  <div 
                    className="absolute top-1/2 left-0 h-0.5 bg-gold -translate-y-1/2 z-0 transition-all duration-500" 
                    style={{ width: `${((bookingStep - 1) / 2) * 100}%` }}
                  />
                  {[1, 2, 3].map((step) => (
                    <div 
                      key={step}
                      className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                        bookingStep >= step ? 'bg-gold text-white scale-110' : 'bg-white border-2 border-neutral-100 text-neutral-400'
                      }`}
                    >
                      {bookingStep > step ? <CheckCircle size={16} /> : step}
                    </div>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {bookingStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h2 className="text-2xl font-bold mb-2">Guest Details</h2>
                      <p className="text-neutral-600 mb-6 text-sm">Please provide your contact information to proceed.</p>
                      
                      <div className="space-y-4 mb-8">
                        <div>
                          <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Full Name</label>
                          <input
                            type="text"
                            placeholder="e.g. John Doe"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Phone Number</label>
                            <input
                              type="tel"
                              placeholder="07..."
                              value={customerPhone}
                              onChange={(e) => setCustomerPhone(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Email (Optional)</label>
                            <input
                              type="email"
                              placeholder="john@example.com"
                              value={customerEmail}
                              onChange={(e) => setCustomerEmail(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => setBookingStep(2)}
                        disabled={!customerName || !customerPhone}
                        className={`w-full py-4 rounded-xl font-bold transition-all ${
                          !customerName || !customerPhone 
                          ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed' 
                          : 'bg-gold hover:bg-gold-dark text-white shadow-lg shadow-gold/20'
                        }`}
                      >
                        Continue to Summary
                      </button>
                    </motion.div>
                  )}

                  {bookingStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h2 className="text-2xl font-bold mb-2">Booking Summary</h2>
                      <p className="text-neutral-600 mb-6 text-sm">Review your stay details before confirming.</p>

                      <div className="bg-neutral-50 rounded-xl p-5 mb-8 border border-neutral-100 space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold">{selectedProperty.title}</h3>
                            <p className="text-xs text-neutral-500">{selectedProperty.beds}</p>
                          </div>
                          <span className="font-bold text-gold">{selectedProperty.price}</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-white rounded-lg border border-neutral-100">
                            <p className="text-[10px] text-neutral-400 uppercase font-bold mb-0.5">Check-in</p>
                            <p className="text-sm font-bold">{checkIn ? format(checkIn, 'MMM dd, yyyy') : 'N/A'}</p>
                          </div>
                          <div className="p-3 bg-white rounded-lg border border-neutral-100">
                            <p className="text-[10px] text-neutral-400 uppercase font-bold mb-0.5">Check-out</p>
                            <p className="text-sm font-bold">{checkOut ? format(checkOut, 'MMM dd, yyyy') : 'N/A'}</p>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-neutral-200/50">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-neutral-500">Guest</span>
                            <span className="font-bold">{customerName}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-neutral-500">Contact</span>
                            <span className="font-bold">{customerPhone}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button 
                          onClick={() => setBookingStep(1)}
                          className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 py-4 rounded-xl font-bold transition-colors"
                        >
                          Back
                        </button>
                        <button 
                          onClick={() => setBookingStep(3)}
                          className="flex-[2] bg-gold hover:bg-gold-dark text-white py-4 rounded-xl font-bold transition-colors shadow-lg shadow-gold/20"
                        >
                          Confirm Details
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {bookingStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center"
                    >
                      <div className="flex items-center justify-center mb-6">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                          <CheckCircle size={48} />
                        </div>
                      </div>
                      <h2 className="text-2xl font-bold mb-2">Ready to Book!</h2>
                      <p className="text-neutral-600 mb-8">
                        Your booking request is ready. Click below to send it to us via WhatsApp for final confirmation.
                      </p>

                      <div className="space-y-3">
                        <button 
                          onClick={confirmBooking}
                          className="w-full bg-gold hover:bg-gold-dark text-white py-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-gold/20"
                        >
                          <MessageCircle size={20} /> Send WhatsApp Request
                        </button>
                        <button 
                          onClick={() => setBookingStep(2)}
                          className="w-full text-neutral-400 hover:text-neutral-600 py-2 text-sm font-medium transition-colors"
                        >
                          Review Summary Again
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Follow-up Form Modal */}
      <AnimatePresence>
        {pendingFollowUp && (
          <FollowUpForm 
            propertyTitle={pendingFollowUp.propertyTitle}
            checkIn={pendingFollowUp.checkIn}
            checkOut={pendingFollowUp.checkOut}
            onClose={() => {
              const savedBookings = localStorage.getItem('bella_homes_bookings');
              if (savedBookings) {
                const bookings = JSON.parse(savedBookings);
                const updatedBookings = bookings.map((b: any) => 
                  b.id === pendingFollowUp.id ? { ...b, reviewed: true } : b
                );
                localStorage.setItem('bella_homes_bookings', JSON.stringify(updatedBookings));
              }
              setPendingFollowUp(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && viewProperty && (
          <Lightbox 
            images={[viewProperty.image, ...viewProperty.gallery]}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-neutral-100 py-12 px-4 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-2xl font-bold tracking-tighter">
            BELLA<span className="text-gold">HOMES</span>
          </div>
          <div className="flex gap-8 text-neutral-600 text-sm font-medium">
            <a href="#properties" className="hover:text-gold transition-colors">Properties</a>
            <a href="#about" className="hover:text-gold transition-colors">About Us</a>
            <a href="#contact" className="hover:text-gold transition-colors">Contact</a>
            <a href="#privacy" className="hover:text-gold transition-colors">Privacy Policy</a>
          </div>
          <p className="text-neutral-400 text-xs">
            © 2026 Bella Homes Kenya. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
