import React, { useState } from 'react';
import { ShieldCheck, Truck, Lock, CheckCircle, ArrowLeft, Building2, CreditCard, Award } from 'lucide-react';
import { CartItem, Currency, PageView } from '../types';
import { formatPrice } from '../utils/currency';

interface CheckoutPageProps {
  cartItems: CartItem[];
  clearCart: () => void;
  activeCurrency: Currency;
  setCurrentPage: (page: PageView) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  cartItems,
  clearCart,
  activeCurrency,
  setCurrentPage,
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'United Kingdom',
    postalCode: '',
    deliveryNotes: '',
    paymentMethod: 'invoice', // 'invoice' | 'card' | 'wire'
  });

  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderRef, setOrderRef] = useState('');

  const subtotalUSD = cartItems.reduce((acc, item) => acc + item.artwork.priceUSD * item.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email || !formData.address) return;

    const ref = `RFA-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderRef(ref);
    setOrderConfirmed(true);
    clearCart();
  };

  return (
    <div className="py-16 bg-[#1C1B19] min-h-screen text-[#E8E6E1]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb Back */}
        <button
          onClick={() => setCurrentPage('gallery')}
          className="inline-flex items-center space-x-2 text-xs tracking-[0.2em] text-[#B08D57] uppercase hover:text-[#E8E6E1] transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Return to Gallery</span>
        </button>

        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[#B08D57] text-xs tracking-[0.35em] uppercase font-sans-clean block mb-2">
            Secure Acquisition Protocol
          </span>
          <h1 className="font-serif-display text-4xl text-[#E8E6E1]">
            Collector Private Checkout
          </h1>
          <div className="w-12 h-[1px] bg-[#B08D57] mx-auto mt-3" />
        </div>

        {orderConfirmed ? (
          /* Order Confirmation Screen */
          <div className="max-w-2xl mx-auto bg-[#151413] border border-[#B08D57]/40 p-8 sm:p-12 rounded-sm text-center space-y-6 art-frame-glow animate-fadeIn font-sans-clean">
            <CheckCircle className="w-16 h-16 text-[#B08D57] mx-auto" />
            <span className="text-xs tracking-[0.3em] uppercase text-[#B08D57] block">
              Acquisition Confirmed
            </span>
            <h2 className="font-serif-display text-3xl text-[#E8E6E1]">
              Order Reference #{orderRef}
            </h2>
            <p className="text-xs text-[#C2C0BA] font-light leading-relaxed">
              Thank you, {formData.firstName} {formData.lastName}. Your acquisition request has been registered in the Riad Fine Art archives. An official invoice and white-glove shipping schedule have been transmitted to <strong className="text-[#E8E6E1]">{formData.email}</strong>.
            </p>

            <div className="p-4 bg-[#1C1B19] border border-[#B08D57]/20 rounded-sm text-left space-y-2 text-xs text-[#8C8983]">
              <div className="flex justify-between">
                <span>Shipping Destination:</span>
                <span className="text-[#E8E6E1]">{formData.city}, {formData.country}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Preference:</span>
                <span className="text-[#E8E6E1] uppercase">{formData.paymentMethod}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#B08D57]/15">
                <span>Authenticity Certificate:</span>
                <span className="text-[#B08D57]">Included (Wax Stamped)</span>
              </div>
            </div>

            <button
              onClick={() => setCurrentPage('home')}
              className="px-8 py-3.5 bg-[#B08D57] text-[#1C1B19] text-xs uppercase tracking-[0.25em] font-semibold hover:bg-[#CBB07E] transition-colors rounded-sm"
            >
              Return to Gallery Main Salon
            </button>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-20 bg-[#151413] border border-[#B08D57]/30 rounded-sm p-8 font-sans-clean">
            <h2 className="font-serif-display text-2xl text-[#E8E6E1] mb-3">No Artworks in Bag</h2>
            <p className="text-xs text-[#8C8983] mb-6">Select a painting or limited print from our collection to complete your acquisition.</p>
            <button
              onClick={() => setCurrentPage('gallery')}
              className="px-6 py-3 bg-[#B08D57] text-[#1C1B19] text-xs tracking-[0.2em] uppercase font-semibold rounded-sm"
            >
              Browse Gallery Works
            </button>
          </div>
        ) : (
          /* Checkout Form & Summary Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 font-sans-clean">
            
            {/* Form Column */}
            <div className="lg:col-span-7 bg-[#151413] border border-[#B08D57]/30 p-8 rounded-sm art-frame-glow">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div>
                  <h3 className="font-serif-display text-2xl text-[#E8E6E1] mb-4">1. Collector Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] tracking-[0.2em] text-[#B08D57] uppercase block mb-1">First Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full bg-[#1C1B19] border border-[#B08D57]/30 text-[#E8E6E1] text-xs px-4 py-3 focus:outline-none focus:border-[#B08D57] rounded-sm"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] tracking-[0.2em] text-[#B08D57] uppercase block mb-1">Last Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full bg-[#1C1B19] border border-[#B08D57]/30 text-[#E8E6E1] text-xs px-4 py-3 focus:outline-none focus:border-[#B08D57] rounded-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="text-[10px] tracking-[0.2em] text-[#B08D57] uppercase block mb-1">Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-[#1C1B19] border border-[#B08D57]/30 text-[#E8E6E1] text-xs px-4 py-3 focus:outline-none focus:border-[#B08D57] rounded-sm"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] tracking-[0.2em] text-[#B08D57] uppercase block mb-1">Phone / WhatsApp</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-[#1C1B19] border border-[#B08D57]/30 text-[#E8E6E1] text-xs px-4 py-3 focus:outline-none focus:border-[#B08D57] rounded-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#B08D57]/20">
                  <h3 className="font-serif-display text-2xl text-[#E8E6E1] mb-4">2. Destination & Delivery</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] tracking-[0.2em] text-[#B08D57] uppercase block mb-1">Street Address *</label>
                      <input
                        type="text"
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Estate / Residence / Gallery Address"
                        className="w-full bg-[#1C1B19] border border-[#B08D57]/30 text-[#E8E6E1] text-xs px-4 py-3 focus:outline-none focus:border-[#B08D57] rounded-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-[10px] tracking-[0.2em] text-[#B08D57] uppercase block mb-1">City *</label>
                        <input
                          type="text"
                          required
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full bg-[#1C1B19] border border-[#B08D57]/30 text-[#E8E6E1] text-xs px-4 py-3 focus:outline-none focus:border-[#B08D57] rounded-sm"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] tracking-[0.2em] text-[#B08D57] uppercase block mb-1">Postal Code</label>
                        <input
                          type="text"
                          value={formData.postalCode}
                          onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                          className="w-full bg-[#1C1B19] border border-[#B08D57]/30 text-[#E8E6E1] text-xs px-4 py-3 focus:outline-none focus:border-[#B08D57] rounded-sm"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] tracking-[0.2em] text-[#B08D57] uppercase block mb-1">Country *</label>
                        <select
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          className="w-full bg-[#1C1B19] border border-[#B08D57]/30 text-[#E8E6E1] text-xs px-4 py-3 focus:outline-none focus:border-[#B08D57] rounded-sm cursor-pointer"
                        >
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="United States">United States</option>
                          <option value="France">France</option>
                          <option value="Monaco">Monaco</option>
                          <option value="United Arab Emirates">United Arab Emirates</option>
                          <option value="Switzerland">Switzerland</option>
                          <option value="Morocco">Morocco</option>
                          <option value="Other">International (Other)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#B08D57]/20">
                  <h3 className="font-serif-display text-2xl text-[#E8E6E1] mb-4">3. Preferred Payment Method</h3>
                  <div className="space-y-3">
                    {[
                      { id: 'invoice', label: 'Pro-Forma Concierge Invoice & Bank Wire', desc: 'An official invoice with bank coordinates will be generated for direct transfer.' },
                      { id: 'card', label: 'Credit Card / Amex / Private Vault', desc: 'Encrypted white-glove credit processing.' },
                    ].map((m) => (
                      <div
                        key={m.id}
                        onClick={() => setFormData({ ...formData, paymentMethod: m.id })}
                        className={`p-4 border rounded-sm cursor-pointer transition-colors ${
                          formData.paymentMethod === m.id
                            ? 'border-[#B08D57] bg-[#B08D57]/10'
                            : 'border-[#B08D57]/20 bg-[#1C1B19]'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-semibold text-[#E8E6E1]">{m.label}</span>
                          <span className={`w-4 h-4 rounded-full border ${formData.paymentMethod === m.id ? 'bg-[#B08D57] border-[#B08D57]' : 'border-[#8C8983]'}`} />
                        </div>
                        <p className="text-[10px] text-[#8C8983] mt-1">{m.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#B08D57] text-[#1C1B19] text-xs tracking-[0.25em] uppercase font-semibold hover:bg-[#CBB07E] transition-all rounded-sm shadow-xl"
                >
                  Confirm & Finalize Acquisition
                </button>

              </form>
            </div>

            {/* Order Summary Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#151413] border border-[#B08D57]/30 p-6 rounded-sm art-frame-glow">
                <h3 className="font-serif-display text-2xl text-[#E8E6E1] mb-4 pb-3 border-b border-[#B08D57]/20">
                  Acquisition Record
                </h3>

                <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div key={item.artwork.id} className="flex space-x-3 text-xs">
                      <img
                        src={item.artwork.primaryImage}
                        alt={item.artwork.title}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 object-cover rounded-sm border border-[#B08D57]/30 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] uppercase text-[#B08D57] block">{item.artwork.artistName}</span>
                        <h4 className="font-serif-display text-sm text-[#E8E6E1] truncate">{item.artwork.title}</h4>
                        <p className="text-[10px] text-[#8C8983]">{item.customFraming || 'Museum Standard Unframed'}</p>
                        <p className="text-xs text-[#E8E6E1] font-semibold mt-1">
                          {formatPrice(item.artwork.priceUSD, activeCurrency)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-[#B08D57]/20 mt-4 space-y-2 text-xs">
                  <div className="flex justify-between text-[#8C8983]">
                    <span>Artwork Subtotal:</span>
                    <span>{formatPrice(subtotalUSD, activeCurrency)}</span>
                  </div>
                  <div className="flex justify-between text-[#8C8983]">
                    <span>Insured Crate Delivery:</span>
                    <span className="text-[#B08D57] uppercase font-semibold">Complimentary</span>
                  </div>
                  <div className="flex justify-between text-[#8C8983]">
                    <span>Authenticity Seal:</span>
                    <span className="text-[#B08D57] uppercase font-semibold">Included</span>
                  </div>
                  <div className="flex justify-between text-base font-serif-display text-[#E8E6E1] pt-3 border-t border-[#B08D57]/20 font-bold">
                    <span>Total Acquisition:</span>
                    <span className="text-[#B08D57]">{formatPrice(subtotalUSD, activeCurrency)}</span>
                  </div>
                </div>
              </div>

              {/* Guarantees Box */}
              <div className="bg-[#151413] border border-[#B08D57]/20 p-6 rounded-sm space-y-3 text-xs">
                <div className="flex items-start space-x-2">
                  <ShieldCheck className="w-4 h-4 text-[#B08D57] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-[#E8E6E1]">Lifetime Provenance Guarantee</h4>
                    <p className="text-[11px] text-[#8C8983]">Guaranteed direct studio authenticity with stamped certificate.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Truck className="w-4 h-4 text-[#B08D57] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-[#E8E6E1]">Insured Climate Transit</h4>
                    <p className="text-[11px] text-[#8C8983]">Specialist art couriers handle custom wooden crate delivery.</p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
