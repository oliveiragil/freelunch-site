'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { CheckCircle } from 'lucide-react';
import InteractiveBackground from '@/components/InteractiveBackground';
import FeaturesSection from '@/components/FeaturesSection';
import GradientSection from '@/components/GradientSection';

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type EmailForm = z.infer<typeof emailSchema>;

export default function Home() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
  });

  const onSubmit = async (data: EmailForm) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Email submitted:', data.email);
    setIsSubmitted(true);
    setIsLoading(false);
    reset();
  };

  return (
    <>
      {/* First Section - Dark with Interactive Background */}
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        {/* Interactive Background - Limited to first section */}
        <InteractiveBackground height="100vh" />

      {/* Navigation */}
      <motion.nav 
        className="relative z-10 flex justify-center items-center p-6 md:p-8 lg:p-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="flex items-center space-x-4 md:space-x-6 lg:space-x-8">
          <div>
            <Image
              src="/logo_freelunch.svg"
              alt="Freelunch Logo"
              width={60}
              height={60}
              className="rounded-lg sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 2xl:w-32 2xl:h-32"
            />
          </div>
          <span 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold font-carter-one" 
            style={{fontFamily: "Carter One, Impact, Arial Black, cursive", color: "#B4884B"}}
          >
            Freelunch
          </span>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col justify-start lg:justify-center min-h-[calc(100vh-100px)] px-4 sm:px-6 md:px-12 lg:px-16 xl:px-20 2xl:px-24 py-8 lg:py-0">
        <motion.div
          className="max-w-full w-full flex flex-col lg:flex-row lg:items-start lg:gap-8 xl:gap-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Main Headline */}
          <motion.h1
            className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-black font-headline mb-4 sm:mb-6 md:mb-6 lg:mb-0 text-white leading-tight uppercase tracking-wide flex-1 text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <span className="text-white block text-left">
              <span className="block whitespace-nowrap">FREELUNCH WILL MAKE</span>
              <span className="block whitespace-nowrap">2-PERSON STARTUP</span>
              <span className="block whitespace-nowrap">UNICORNS A</span>
              <span className="block whitespace-nowrap">REALITY.</span>
            </span>
          </motion.h1>

          {/* Waitlist Form */}
          <motion.div
            className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-sm xl:max-w-md lg:flex-shrink-0 lg:self-center mb-6 sm:mb-8 md:mb-10 lg:mb-0"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3 }}
          >
            {!isSubmitted ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gray-900/50 border border-primary-orange hover:border-primary-orange hover:bg-gray-900/70 text-primary-orange hover:text-white font-medium py-3 sm:py-4 px-4 sm:px-6 rounded-lg transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm text-sm sm:text-base"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <span>Join the Waitlist</span>
                  )}
                </motion.button>
                <div className="relative">
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-primary-gray border border-gray-700 rounded-lg focus:outline-none focus:border-primary-orange transition-all duration-300 text-white placeholder-gray-400 text-sm sm:text-base"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-2 text-left">{errors.email.message}</p>
                  )}
                </div>
              </form>
            ) : (
              <motion.div
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-2">You&apos;re on the list!</h3>
                <p className="text-gray-400">We&apos;ll notify you when Freelunch launches.</p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer
        className="relative z-10 text-center py-8 px-6 border-t border-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.4 }}
      >
      </motion.footer>
      </div>

      {/* Gradient Section - Between first and second sections */}
      <GradientSection />

      {/* Second Section - Light with Features */}
      <FeaturesSection />
    </>
  );
}
