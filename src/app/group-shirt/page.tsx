'use client';

import { useState } from 'react';
import Header from '../../components/Header';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { db } from '../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import './group-shirt.css';

export default function GroupShirtPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    eventType: 'College Fest',
    pieces: '',
    colour: '',
    notes: ''
  });

  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  const sizes = ['22', '24', '26', '28', '30', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleWhatsAppEnquiry = async () => {
    const { name, phone, eventType, pieces, colour, notes } = formData;
    
    // 1. Save to Admin database
    if (db) {
      try {
        await addDoc(collection(db, 'groupOrders'), {
          event: eventType,
          customerName: name,
          phone,
          count: parseInt(pieces) || 0,
          color: colour,
          notes,
          sizes: selectedSizes,
          status: 'pending',
          revenue: 0,
          createdAt: new Date().toISOString()
        });
      } catch (err) {
        console.error('Failed to save group order to DB:', err);
      }
    }

    // 2. Construct the WhatsApp message
    let message = `*New Group Shirt Enquiry* \n\n`;
    message += `*Name:* ${name || 'N/A'}\n`;
    message += `*Phone:* ${phone || 'N/A'}\n`;
    message += `*Event Type:* ${eventType}\n`;
    message += `*Pieces Needed:* ${pieces || 'N/A'}\n`;
    message += `*Sizes Required:* ${selectedSizes.length > 0 ? selectedSizes.join(', ') : 'N/A'}\n`;
    message += `*Colour Choice:* ${colour || 'N/A'}\n`;
    if (notes) {
      message += `*Special Notes:* ${notes}\n`;
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = '918667321060'; // Replace with actual number
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="group-page-wrapper">
      <Header />
      <Navbar />

      <main className="group-main-container">
        <div className="group-content-grid">
          
          <div className="enquiry-form-section">
            <h1 className="section-heading">ENQUIRE NOW</h1>
            
            <div className="form-row">
              <div className="form-group">
                <label>NAME</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>PHONE NUMBER</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>EVENT TYPE</label>
                <select name="eventType" value={formData.eventType} onChange={handleInputChange}>
                  <option value="College Fest">College Fest</option>
                  <option value="Corporate Event">Corporate Event</option>
                  <option value="Wedding / Family">Wedding / Family Functions</option>
                  <option value="Sports Tournament">Sports Tournament</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>PIECES NEEDED</label>
                <input type="number" name="pieces" value={formData.pieces} onChange={handleInputChange} />
              </div>
            </div>

            <div className="form-group full-width">
              <label>SIZES REQUIRED</label>
              <div className="size-selector-grid">
                {sizes.map(size => (
                  <button 
                    key={size}
                    className={`size-btn ${selectedSizes.includes(size) ? 'selected' : ''}`}
                    onClick={() => toggleSize(size)}
                    type="button"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>COLOUR CHOICE</label>
                <input 
                  type="text" 
                  name="colour" 
                  placeholder="e.g. Jet Black, Gold Foil" 
                  value={formData.colour} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="form-group">
                <label>SPECIAL NOTES</label>
                <input 
                  type="text" 
                  name="notes" 
                  value={formData.notes} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>

            <button 
              className="whatsapp-enquire-btn"
              onClick={handleWhatsAppEnquiry}
              type="button"
            >
              ENQUIRE ON WHATSAPP
            </button>
          </div>

          <div className="info-section">
            <div className="size-guide-container">
              <h2 className="section-heading" style={{ color: '#000' }}>SIZE GUIDE</h2>
              
              <table className="size-guide-table">
                <thead>
                  <tr>
                    <th>SIZE</th>
                    <th>CHEST (IN)</th>
                    <th>LENGTH (IN)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="kids-row">
                    <td>22-30</td>
                    <td>KIDS RANGE</td>
                    <td>N/A</td>
                  </tr>
                  <tr><td>S</td><td>38"</td><td>27"</td></tr>
                  <tr><td>M</td><td>40"</td><td>28"</td></tr>
                  <tr><td>L</td><td>42"</td><td>29"</td></tr>
                  <tr><td>XL</td><td>44"</td><td>30"</td></tr>
                  <tr><td>2XL</td><td>48"</td><td>31"</td></tr>
                  <tr><td>3XL</td><td>52"</td><td>32"</td></tr>
                  <tr><td>4XL</td><td>56"</td><td>33"</td></tr>
                  <tr><td>5XL</td><td>60"</td><td>34"</td></tr>
                </tbody>
              </table>
            </div>

            <div className="special-banner">
              <h3>DINDIGUL SPECIAL</h3>
              <p>Priority production for local colleges and sports academies in Dindigul. Express 48-hour sampling available.</p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
} 
