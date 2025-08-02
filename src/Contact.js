import React, { useState } from 'react';
import { Mail, MessageCircle, Send, MapPin, Phone, Globe } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Get in Touch</h1>
        <p className="text-xl text-white/70 max-w-2xl mx-auto">
          Have questions, feedback, or need support? We'd love to hear from you!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <MessageCircle className="text-primary-400" />
            Send us a message
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-primary-400 focus:outline-none transition-colors duration-300"
                  placeholder="Your full name"
                />
              </div>
              
              <div>
                <label className="block text-white/70 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-primary-400 focus:outline-none transition-colors duration-300"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-white/70 mb-2">Subject</label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-primary-400 focus:outline-none transition-colors duration-300"
              >
                <option value="">Select a subject</option>
                <option value="general">General Inquiry</option>
                <option value="support">Technical Support</option>
                <option value="feedback">Feature Request</option>
                <option value="bug">Bug Report</option>
                <option value="partnership">Partnership</option>
              </select>
            </div>
            
            <div>
              <label className="block text-white/70 mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-primary-400 focus:outline-none transition-colors duration-300 resize-none"
                placeholder="Tell us how we can help you..."
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <Send size={20} />
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div className="space-y-8">
          {/* Contact Details */}
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary-500/20 rounded-lg">
                  <Mail className="text-primary-400" size={24} />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Email</h3>
                  <p className="text-white/70">support@goalmaster.com</p>
                  <p className="text-white/70">hello@goalmaster.com</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-secondary-500/20 rounded-lg">
                  <Phone className="text-secondary-400" size={24} />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Phone</h3>
                  <p className="text-white/70">+1 (555) 123-4567</p>
                  <p className="text-white/60 text-sm">Mon-Fri, 9AM-6PM EST</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-accent-500/20 rounded-lg">
                  <MapPin className="text-accent-400" size={24} />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Address</h3>
                  <p className="text-white/70">123 Productivity Street</p>
                  <p className="text-white/70">San Francisco, CA 94107</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <Globe className="text-green-400" size={24} />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Website</h3>
                  <p className="text-white/70">www.goalmaster.com</p>
                  <p className="text-white/70">blog.goalmaster.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-white font-semibold mb-2">How do I reset my password?</h3>
                <p className="text-white/70 text-sm">You can reset your password by clicking the "Forgot Password" link on the login page.</p>
              </div>
              
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-white font-semibold mb-2">Can I sync my data across devices?</h3>
                <p className="text-white/70 text-sm">Yes! Your data is automatically synced across all your devices when you're logged in.</p>
              </div>
              
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-white font-semibold mb-2">Is there a mobile app?</h3>
                <p className="text-white/70 text-sm">We're currently working on mobile apps for iOS and Android. Stay tuned!</p>
              </div>
              
              <div>
                <h3 className="text-white font-semibold mb-2">How can I export my data?</h3>
                <p className="text-white/70 text-sm">You can export your data from the Settings page in CSV or JSON format.</p>
              </div>
            </div>
          </div>

          {/* Response Time */}
          <div className="glass-card p-6 text-center">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="text-white font-semibold mb-2">Quick Response</h3>
            <p className="text-white/70 text-sm">We typically respond within 24 hours</p>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold text-white mb-6">Follow Us</h2>
        <div className="flex justify-center gap-6">
          {[
            { name: 'Twitter', icon: '🐦', color: 'hover:bg-blue-500/20' },
            { name: 'LinkedIn', icon: '💼', color: 'hover:bg-blue-600/20' },
            { name: 'Instagram', icon: '📸', color: 'hover:bg-pink-500/20' },
            { name: 'YouTube', icon: '📺', color: 'hover:bg-red-500/20' }
          ].map(social => (
            <button
              key={social.name}
              className={`p-4 glass-card ${social.color} transition-colors duration-300 group`}
            >
              <span className="text-2xl group-hover:scale-110 transition-transform duration-300 block">
                {social.icon}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contact;
