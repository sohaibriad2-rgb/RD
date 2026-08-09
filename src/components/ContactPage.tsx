import React, { useState } from 'react';
import { Mail, Phone, MapPin, Calendar, Clock, CheckCircle, Send, MessageSquare } from 'lucide-react';
import { EnquiryForm } from '../types';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<EnquiryForm>({
    name: '',
    email: '',
    phone: '',
    type: 'private_viewing',
    message: '',
    locationPreference: 'Casablanca Gallery',
    preferredDate: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setIsSubmitted(true);
  };

  return (
    <div className="py-16 bg-[#1C1B19] min-h-screen text-[#E8E6E1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#B08D57] text-xs tracking-[0.35em] uppercase font-sans-clean block mb-3">
            Gallery Inquiries & Consultations
          </span>
          <h1 className="font-serif-display text-4xl sm:text-6xl text-[#E8E6E1] font-normal tracking-[0.05em] mb-4">
            Connect With Our Curators
          </h1>
          <div className="w-16 h-[1px] bg-[#B08D57] mx-auto mb-4" />
          <p className="text-[#8C8983] text-sm font-light font-sans-clean">
            Inquire about artwork acquisitions, custom master commissions, or general curatorial consultations with our gallery team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-7 bg-[#151413] border border-[#B08D57]/30 p-8 sm:p-12 rounded-sm art-frame-glow">
            <h2 className="font-serif-display text-3xl text-[#E8E6E1] mb-2">Gallery Inquiry & Contact</h2>
            <p className="text-xs text-[#8C8983] font-light mb-8 font-sans-clean">
              Please complete the form below. A senior gallery curator will respond within 12 hours.
            </p>

            {isSubmitted ? (
              <div className="bg-[#B08D57]/10 border border-[#B08D57]/40 p-8 text-center rounded-sm space-y-4 animate-fadeIn">
                <CheckCircle className="w-12 h-12 text-[#B08D57] mx-auto" />
                <h3 className="font-serif-display text-2xl text-[#E8E6E1]">Enquiry Received</h3>
                <p className="text-xs text-[#C2C0BA] font-light leading-relaxed max-w-md mx-auto font-sans-clean">
                  Thank you, {formData.name}. Our senior curator at Riad Fine Art will review your request and contact you shortly.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({
                      name: '',
                      email: '',
                      phone: '',
                      type: 'private_viewing',
                      message: '',
                      locationPreference: 'Casablanca Gallery',
                      preferredDate: '',
                    });
                  }}
                  className="px-6 py-2.5 bg-[#B08D57] text-[#1C1B19] text-xs uppercase tracking-widest font-semibold rounded-sm"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 font-sans-clean">
                
                {/* Inquiry Type Radio / Buttons */}
                <div>
                  <label className="text-[10px] tracking-[0.2em] text-[#B08D57] uppercase block mb-3">
                    Nature of Inquiry
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'private_viewing', label: 'Private Salon Viewing' },
                      { id: 'price_inquiry', label: 'Artwork Acquisition' },
                      { id: 'commission', label: 'Custom Commission' },
                      { id: 'advisory', label: 'Curatorial Advisory' },
                    ].map((item) => (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => setFormData({ ...formData, type: item.id as any })}
                        className={`py-3 px-3 text-xs tracking-wider border rounded-sm transition-colors text-center ${
                          formData.type === item.id
                            ? 'border-[#B08D57] bg-[#B08D57]/20 text-[#B08D57] font-semibold'
                            : 'border-[#B08D57]/20 text-[#8C8983] hover:border-[#B08D57]/50'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] tracking-[0.2em] text-[#B08D57] uppercase block mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Lord Harrington"
                      className="w-full bg-[#1C1B19] border border-[#B08D57]/30 text-[#E8E6E1] placeholder-[#8C8983] text-xs px-4 py-3 focus:outline-none focus:border-[#B08D57] rounded-sm"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] tracking-[0.2em] text-[#B08D57] uppercase block mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="collector@domain.com"
                      className="w-full bg-[#1C1B19] border border-[#B08D57]/30 text-[#E8E6E1] placeholder-[#8C8983] text-xs px-4 py-3 focus:outline-none focus:border-[#B08D57] rounded-sm"
                    />
                  </div>
                </div>

                {/* Phone & Location Preference */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] tracking-[0.2em] text-[#B08D57] uppercase block mb-2">
                      Telephone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+212 636-260361"
                      className="w-full bg-[#1C1B19] border border-[#B08D57]/30 text-[#E8E6E1] placeholder-[#8C8983] text-xs px-4 py-3 focus:outline-none focus:border-[#B08D57] rounded-sm"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] tracking-[0.2em] text-[#B08D57] uppercase block mb-2">
                      Preferred Location
                    </label>
                    <select
                      value={formData.locationPreference}
                      onChange={(e) => setFormData({ ...formData, locationPreference: e.target.value as any })}
                      className="w-full bg-[#1C1B19] border border-[#B08D57]/30 text-[#E8E6E1] text-xs px-4 py-3 focus:outline-none focus:border-[#B08D57] rounded-sm cursor-pointer"
                    >
                      <option value="Casablanca Gallery">Casablanca Flagship Gallery</option>
                      <option value="Agadir Gallery">Agadir Showroom Salon</option>
                      <option value="Virtual Advisory">Virtual Video Advisory</option>
                      <option value="Private Residence">Private Estate Consultation</option>
                    </select>
                  </div>
                </div>

                {/* Preferred Date */}
                <div>
                  <label className="text-[10px] tracking-[0.2em] text-[#B08D57] uppercase block mb-2">
                    Preferred Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="w-full bg-[#1C1B19] border border-[#B08D57]/30 text-[#E8E6E1] text-xs px-4 py-3 focus:outline-none focus:border-[#B08D57] rounded-sm"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="text-[10px] tracking-[0.2em] text-[#B08D57] uppercase block mb-2">
                    Your Message or Collection Interests
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Specify particular artworks, framing preferences, or collection requirements..."
                    className="w-full bg-[#1C1B19] border border-[#B08D57]/30 text-[#E8E6E1] placeholder-[#8C8983] text-xs p-4 focus:outline-none focus:border-[#B08D57] rounded-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#B08D57] text-[#1C1B19] text-xs tracking-[0.25em] uppercase font-semibold hover:bg-[#CBB07E] transition-all rounded-sm flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmit Private Request</span>
                </button>

              </form>
            )}

          </div>

          {/* Right Column: Gallery Locations & Direct Contact */}
          <div className="lg:col-span-5 space-y-8 font-sans-clean">
            
            {/* Casablanca Gallery Card */}
            <div className="bg-[#151413] border border-[#B08D57]/30 p-6 rounded-sm space-y-4 art-frame-glow">
              <span className="text-[10px] tracking-[0.3em] text-[#B08D57] uppercase block">Flagship Sanctuary</span>
              <h3 className="font-serif-display text-2xl text-[#E8E6E1]">Casablanca Gallery</h3>
              <div className="space-y-2 text-xs text-[#C2C0BA] font-light">
                <p className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-[#B08D57] shrink-0 mt-0.5" />
                  <span>Boulevard d'Anfa, Casablanca, Morocco</span>
                </p>
                <p className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-[#B08D57] shrink-0" />
                  <span>Tue – Sun: 10:00 – 19:00 (Private Viewing by Appointment)</span>
                </p>
                <p className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-[#B08D57] shrink-0" />
                  <a href="tel:+212636260361" className="hover:text-[#B08D57] transition-colors">+212 636-260361 (0636260361)</a>
                </p>
              </div>
            </div>

            {/* Direct WhatsApp Concierge Button */}
            <a
              href="https://wa.me/212636260361?text=Hello%20Riad%20Fine%20Art,%20I%20would%20like%20to%20inquire%20about%20a%20private%20art%20viewing."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-6 bg-[#25D366]/10 border border-[#25D366]/60 text-[#25D366] hover:bg-[#25D366] hover:text-black text-xs tracking-[0.2em] uppercase font-semibold transition-all rounded-sm flex items-center justify-center space-x-3 text-center shadow-lg"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>Instant WhatsApp Concierge (+212 636-260361)</span>
            </a>

            {/* Official Social Media Card */}
            <div className="bg-[#151413] border border-[#B08D57]/30 p-6 rounded-sm space-y-4 art-frame-glow">
              <span className="text-[10px] tracking-[0.3em] text-[#B08D57] uppercase block">Official Digital Channels</span>
              <h3 className="font-serif-display text-xl text-[#E8E6E1]">Follow Riad Fine Art</h3>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <a
                  href="https://www.instagram.com/rd_fine_art/?hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 bg-[#1C1B19] border border-[#B08D57]/30 text-[#E8E6E1] hover:border-[#B08D57] hover:text-[#B08D57] text-xs transition-colors rounded-sm flex items-center justify-center space-x-2"
                >
                  <span className="font-semibold">Instagram</span>
                  <span className="text-[10px] text-[#8C8983]">@rd_fine_art</span>
                </a>
                <a
                  href="https://www.tiktok.com/@riad.fine.art"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 bg-[#1C1B19] border border-[#B08D57]/30 text-[#E8E6E1] hover:border-[#B08D57] hover:text-[#B08D57] text-xs transition-colors rounded-sm flex items-center justify-center space-x-2"
                >
                  <span className="font-semibold">TikTok</span>
                  <span className="text-[10px] text-[#8C8983]">@riad.fine.art</span>
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
