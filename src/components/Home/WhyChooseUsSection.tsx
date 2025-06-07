import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Truck, Award, Heart, Users, Sparkles } from 'lucide-react';

const WhyChooseUsSection: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: 'Authentic Handloom',
      description: 'Genuine Ikkat textiles crafted by skilled artisans using traditional techniques passed down through generations.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'Complimentary shipping on all orders above ₹2000. Fast and secure delivery to your doorstep.',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'Each piece is carefully inspected for quality. We guarantee the finest materials and craftsmanship.',
      gradient: 'from-yellow-500 to-orange-500',
    },
    {
      icon: Heart,
      title: 'Customer Love',
      description: 'Over 10,000 happy customers trust us for their ethnic wear needs. Join our growing family.',
      gradient: 'from-pink-500 to-red-500',
    },
    {
      icon: Users,
      title: 'Expert Support',
      description: 'Our knowledgeable team is here to help you choose the perfect piece for any occasion.',
      gradient: 'from-purple-500 to-indigo-500',
    },
    {
      icon: Sparkles,
      title: 'Custom Tailoring',
      description: 'Professional tailoring services available. Get the perfect fit for your special moments.',
      gradient: 'from-teal-500 to-blue-500',
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4"
          >
            Why Choose looom.shop?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            We're committed to bringing you the finest Ikkat textiles with exceptional service and authentic craftsmanship
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 h-full">
                {/* Icon */}
                <div className="relative mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  {/* Decorative ring */}
                  <div className={`absolute inset-0 w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} opacity-20 scale-125 group-hover:scale-150 transition-transform duration-500`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover effect line */}
                <div className={`mt-6 h-1 w-0 bg-gradient-to-r ${feature.gradient} group-hover:w-full transition-all duration-500 rounded-full`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '10K+', label: 'Happy Customers' },
              { number: '500+', label: 'Products' },
              { number: '50+', label: 'Artisan Partners' },
              { number: '99%', label: 'Satisfaction Rate' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;