import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote, Heart, Award, Users } from 'lucide-react';

const TestimonialSection: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: 'Priya Sharma',
      location: 'Bangalore',
      rating: 5,
      comment: 'Absolutely love the quality of Ikkat sarees! The handwoven patterns are stunning and the fabric is so comfortable. The colors are vibrant and true to the pictures. Will definitely order again.',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
      product: 'Traditional Ikkat Silk Saree',
      verified: true,
      orderDate: '2 weeks ago',
    },
    {
      id: 2,
      name: 'Anjali Reddy',
      location: 'Hyderabad',
      rating: 5,
      comment: 'The dress materials are of excellent quality and the colors are vibrant. Fast delivery and beautiful packaging. The customer service team was very helpful in choosing the right size.',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
      product: 'Ikkat Dress Material Set',
      verified: true,
      orderDate: '1 month ago',
    },
    {
      id: 3,
      name: 'Meera Krishnan',
      location: 'Chennai',
      rating: 5,
      comment: 'Beautiful collection of frocks for my daughter. The Ikkat patterns are unique and the quality is outstanding. Great value for money and the fit is perfect.',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
      product: 'Cotton Ikkat Frock',
      verified: true,
      orderDate: '3 weeks ago',
    },
    {
      id: 4,
      name: 'Kavitha Nair',
      location: 'Kochi',
      rating: 5,
      comment: 'Amazing experience shopping here! The kurtas are beautifully designed and the fabric quality is top-notch. Received so many compliments when I wore it to a wedding.',
      avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg',
      product: 'Designer Ikkat Kurta',
      verified: true,
      orderDate: '1 week ago',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-24 bg-gradient-to-br from-purple-50 via-white to-pink-50 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-20 animate-pulse">
          <Quote className="h-40 w-40 text-purple-500" />
        </div>
        <div className="absolute bottom-20 left-20 animate-bounce">
          <Heart className="h-32 w-32 text-pink-500" />
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-10 shadow-2xl"
          >
            <Users className="h-12 w-12 text-white" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-6xl font-black bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 bg-clip-text text-transparent mb-8"
          >
            Customer Love Stories
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
          >
            Real stories from our satisfied customers who love our authentic Ikkat collection
          </motion.p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.7 }}
              className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100 relative overflow-hidden"
            >
              {/* Enhanced Quote Icon */}
              <div className="absolute top-8 left-8 text-purple-200">
                <Quote className="h-16 w-16" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
                {/* Enhanced Customer Info */}
                <div className="text-center lg:text-left">
                  <div className="relative inline-block mb-6">
                    <img
                      src={testimonials[currentTestimonial].avatar}
                      alt={testimonials[currentTestimonial].name}
                      className="h-24 w-24 rounded-full object-cover shadow-xl mx-auto lg:mx-0 border-4 border-white"
                    />
                    {testimonials[currentTestimonial].verified && (
                      <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 shadow-lg">
                        <Star className="h-4 w-4 text-white fill-current" />
                      </div>
                    )}
                  </div>
                  
                  <h4 className="text-2xl font-black text-gray-900 mb-2">
                    {testimonials[currentTestimonial].name}
                  </h4>
                  <p className="text-gray-500 mb-4 text-lg">
                    {testimonials[currentTestimonial].location}
                  </p>
                  
                  {/* Enhanced Rating */}
                  <div className="flex justify-center lg:justify-start mb-4">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                    ))}
                  </div>

                  {/* Enhanced Product Info */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl px-4 py-3 text-sm text-purple-800 font-bold mb-4">
                    Purchased: {testimonials[currentTestimonial].product}
                  </div>

                  <div className="text-sm text-gray-500">
                    {testimonials[currentTestimonial].orderDate}
                  </div>
                </div>

                {/* Enhanced Testimonial Content */}
                <div className="lg:col-span-2">
                  <blockquote className="text-2xl text-gray-700 leading-relaxed italic mb-8 font-medium">
                    "{testimonials[currentTestimonial].comment}"
                  </blockquote>
                  
                  <div className="flex items-center justify-between">
                    {testimonials[currentTestimonial].verified && (
                      <div className="flex items-center text-green-600 font-bold">
                        <Award className="h-5 w-5 mr-2 fill-current" />
                        Verified Purchase
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2 text-gray-500">
                      <Heart className="h-4 w-4 text-red-500 fill-current" />
                      <span className="text-sm">Loved by customer</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Enhanced Navigation Buttons */}
          <motion.button
            onClick={prevTestimonial}
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.9 }}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-6 lg:-translate-x-16 p-5 rounded-full bg-white shadow-2xl hover:shadow-3xl transition-all duration-300 border border-gray-100 group"
          >
            <ChevronLeft className="h-8 w-8 text-gray-600 group-hover:text-purple-600 transition-colors" />
          </motion.button>
          
          <motion.button
            onClick={nextTestimonial}
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.9 }}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-6 lg:translate-x-16 p-5 rounded-full bg-white shadow-2xl hover:shadow-3xl transition-all duration-300 border border-gray-100 group"
          >
            <ChevronRight className="h-8 w-8 text-gray-600 group-hover:text-purple-600 transition-colors" />
          </motion.button>
        </div>

        {/* Enhanced Testimonial Indicators */}
        <div className="flex justify-center space-x-4 mt-16">
          {testimonials.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentTestimonial(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={`transition-all duration-300 ${
                index === currentTestimonial 
                  ? 'w-12 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full' 
                  : 'w-4 h-4 bg-gray-300 hover:bg-gray-400 rounded-full'
              }`}
            />
          ))}
        </div>

        {/* Enhanced Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { number: '4.9/5', label: 'Average Rating', icon: Star },
            { number: '10K+', label: 'Happy Customers', icon: Users },
            { number: '99%', label: 'Satisfaction Rate', icon: Heart },
            { number: '24/7', label: 'Customer Support', icon: Award },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4">
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-bold">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialSection;