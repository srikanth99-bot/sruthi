import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Gift, Bell, Star, Sparkles, Heart, Zap } from 'lucide-react';

const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 4000);
    }
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Ultra Modern Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-red-500" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
      
      {/* Enhanced Decorative Elements */}
      <div className="absolute top-10 left-10 opacity-10 animate-pulse">
        <Star className="h-32 w-32 text-white" />
      </div>
      <div className="absolute bottom-10 right-10 opacity-10 animate-bounce">
        <Gift className="h-40 w-40 text-white" />
      </div>
      <div className="absolute top-1/2 left-1/4 opacity-5 animate-spin" style={{ animationDuration: '20s' }}>
        <Bell className="h-48 w-48 text-white" />
      </div>
      <div className="absolute top-20 right-1/4 opacity-10">
        <Sparkles className="h-24 w-24 text-white animate-pulse" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-white"
        >
          {/* Enhanced Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-28 h-28 bg-white/20 backdrop-blur-sm rounded-full mb-12 border-4 border-white/30 shadow-2xl"
          >
            <Mail className="h-14 w-14 text-white" />
          </motion.div>

          {/* Enhanced Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-black mb-6"
          >
            Stay in the Loop
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-2xl md:text-3xl mb-12 text-white/90 max-w-3xl mx-auto leading-relaxed font-medium"
          >
            Get exclusive access to new collections, special offers, and styling tips delivered to your inbox
          </motion.p>

          {/* Enhanced Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          >
            {[
              { icon: Sparkles, text: 'Exclusive early access' },
              { icon: Gift, text: 'Special subscriber discounts' },
              { icon: Heart, text: 'Style inspiration & tips' },
              { icon: Zap, text: 'New arrival notifications' }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-6 border border-white/20 text-center"
              >
                <benefit.icon className="h-8 w-8 mx-auto mb-3 text-yellow-300" />
                <span className="text-sm font-bold">{benefit.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Enhanced Newsletter Form */}
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            onSubmit={handleSubmit}
            className="max-w-2xl mx-auto"
          >
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-8 py-6 rounded-2xl bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-4 focus:ring-white/50 focus:border-white/50 transition-all duration-300 text-lg font-medium"
                  required
                />
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-purple-600 font-black px-12 py-6 rounded-2xl hover:bg-gray-100 transition-colors duration-200 shadow-2xl text-lg"
              >
                Subscribe Now
              </motion.button>
            </div>
          </motion.form>

          {/* Enhanced Success Message */}
          {isSubscribed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="mt-8 bg-green-500/20 backdrop-blur-sm border-2 border-green-400/30 rounded-2xl p-6 text-green-100"
            >
              <div className="flex items-center justify-center space-x-3 mb-2">
                <Gift className="h-6 w-6" />
                <span className="text-xl font-black">Welcome to the family!</span>
              </div>
              <p>Check your email for a special welcome gift 🎁</p>
            </motion.div>
          )}

          {/* Enhanced Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1 }}
            className="mt-12 text-lg text-white/70"
          >
            <div className="flex items-center justify-center space-x-8 mb-4">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="font-bold">10,000+ subscribers</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-red-400 fill-current" />
                <span className="font-bold">No spam guarantee</span>
              </div>
            </div>
            <p>Join our community of fashion enthusiasts • Unsubscribe anytime</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;