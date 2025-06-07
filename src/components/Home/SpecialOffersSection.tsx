import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Clock, Star, Zap, Crown, Heart } from 'lucide-react';

const SpecialOffersSection: React.FC = () => {
  const offers = [
    {
      id: 1,
      title: 'Flash Sale',
      subtitle: 'Up to 60% Off',
      description: 'Limited time offer on premium sarees',
      image: 'https://images.pexels.com/photos/8193085/pexels-photo-8193085.jpeg',
      icon: Zap,
      badge: 'Hot Deal',
      timeLeft: '2 hours left',
      gradient: 'from-red-500 to-pink-500',
      buttonText: 'Shop Now',
    },
    {
      id: 2,
      title: 'New Arrivals',
      subtitle: 'Fresh Collection',
      description: 'Latest Ikkat designs just arrived',
      image: 'https://images.pexels.com/photos/5560021/pexels-photo-5560021.jpeg',
      icon: Star,
      badge: 'New',
      timeLeft: 'Just launched',
      gradient: 'from-blue-500 to-purple-500',
      buttonText: 'Explore',
    },
    {
      id: 3,
      title: 'Premium Collection',
      subtitle: 'Exclusive Designs',
      description: 'Handpicked luxury pieces',
      image: 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg',
      icon: Crown,
      badge: 'Premium',
      timeLeft: 'Limited stock',
      gradient: 'from-yellow-500 to-orange-500',
      buttonText: 'View Collection',
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4"
          >
            Special Offers
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Don't miss out on these amazing deals and exclusive collections
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {offers.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500"
            >
              {/* Background Image */}
              <div className="relative h-80 overflow-hidden">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${offer.gradient} opacity-80`} />
                
                {/* Badge */}
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white bg-black/30 backdrop-blur-sm border border-white/20">
                    <offer.icon className="h-3 w-3 mr-1" />
                    {offer.badge}
                  </span>
                </div>

                {/* Time Left */}
                <div className="absolute top-4 right-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 border border-white/30">
                    <div className="flex items-center space-x-1 text-white text-xs font-medium">
                      <Clock className="h-3 w-3" />
                      <span>{offer.timeLeft}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3 className="text-2xl font-bold mb-2">{offer.title}</h3>
                    <p className="text-3xl font-extrabold mb-2 text-yellow-300">
                      {offer.subtitle}
                    </p>
                    <p className="text-sm opacity-90 mb-4 leading-relaxed">
                      {offer.description}
                    </p>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white text-gray-900 font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors duration-200 shadow-lg"
                    >
                      {offer.buttonText}
                    </motion.button>
                  </motion.div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10">
                  <Gift className="h-32 w-32 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 border border-primary-100">
            <div className="flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-primary-500 mr-2" />
              <h3 className="text-2xl font-bold text-gray-900">Love What You See?</h3>
            </div>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust us for authentic Ikkat textiles. 
              Get exclusive access to new collections and special offers.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold px-8 py-4 rounded-xl hover:shadow-lg transition-all duration-200"
            >
              View All Offers
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SpecialOffersSection;