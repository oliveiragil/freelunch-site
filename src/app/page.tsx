'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { CheckCircle } from 'lucide-react';
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
      {/* First Section - Unicorns Background */}
      <div className="relative min-h-screen text-white overflow-hidden">
        {/* Background with CSS fallback - Fantasy Forest Theme */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4)),
              url('/unicorns-forrest.jpg')
            `,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        ></div>
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30 z-10"></div>

      {/* Navigation */}
      <motion.nav 
        className="relative z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="absolute top-6 md:top-8 lg:top-12 right-4 sm:right-6 md:right-12 lg:right-16 xl:right-20 2xl:right-24 flex items-center space-x-4 md:space-x-6 lg:space-x-8">
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
            style={{
              fontFamily: "Carter One, Impact, Arial Black, cursive", 
              color: "#48341B",
              textShadow: "0 0 2px white, 0 0 4px white, 1px 1px 0 white, -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white"
            }}
          >
            Freelunch
          </span>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="relative z-20 h-[calc(100vh-120px)] px-4 sm:px-6 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
        {/* Main Headline - Canto Superior Direito */}
        <motion.h1
          className="absolute top-24 sm:top-28 md:top-32 lg:top-36 xl:top-40 2xl:top-44 right-4 sm:right-6 md:right-12 lg:right-16 xl:right-20 2xl:right-24 text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-black font-headline text-white leading-tight tracking-wide text-right"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <span className="text-white block text-right">
            <span className="block whitespace-nowrap">POWERING 2-PERSON</span>
            <span className="block whitespace-nowrap">STARTUP UNICORNS</span>
            <span className="block whitespace-nowrap">OF TOMORROW.</span>
          </span>
        </motion.h1>

        {/* Texto acima da Waitlist */}
        <motion.div
          className="absolute bottom-40 sm:bottom-44 md:bottom-48 lg:bottom-52 xl:bottom-56 left-4 sm:left-6 md:left-12 lg:left-16 xl:left-20 2xl:left-24"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          <p className="text-white font-bold text-base sm:text-lg md:text-xl lg:text-2xl leading-tight">
            <span className="block">DEVOPS/MLOPS</span>
            <span className="block">OPEN SOURCE</span>
            <span className="block">PLATFORM COMING SOON</span>
          </p>
        </motion.div>

        {/* Waitlist Form - Canto Inferior Esquerdo */}
        <motion.div
          className="absolute bottom-8 sm:bottom-10 md:bottom-12 lg:bottom-16 xl:bottom-20 left-4 sm:left-6 md:left-12 lg:left-16 xl:left-20 2xl:left-24 w-[90%] max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xs xl:max-w-sm"
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
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-primary-gray border border-white rounded-lg focus:outline-none focus:border-primary-orange transition-all duration-300 text-white placeholder-gray-400 text-sm sm:text-base"
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

        {/* Link para lunchSTEM - Abaixo da Waitlist */}
        <motion.div
          className="absolute -bottom-4 sm:-bottom-2 md:bottom-0 lg:bottom-1 xl:bottom-2 left-4 sm:left-6 md:left-12 lg:left-16 xl:left-20 2xl:left-24 w-[90%] max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xs xl:max-w-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <a
            href="https://github.com/Freelunch-AI/lunch-stem"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-[#1E6091] hover:bg-[#1a5178] text-white px-3 py-3 rounded-lg transition-all duration-300 text-xs sm:text-sm font-medium text-center leading-tight"
          >
            <span className="block">CREATORS OF LUNCHSTEM: THE BEST</span>
            <span className="block">STEM KNOWLEDGE BASE IN THE WORLD</span>
          </a>
        </motion.div>

      {/* Footer */}
      <motion.footer
        className="relative z-20 text-center py-8 px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.4 }}
      >
      </motion.footer>
      </main>
      </div>

      {/* Gradient Section - Between first and second sections */}
      <GradientSection />

      {/* Second Section - Light with Features */}
      <FeaturesSection />
    </>
  );
}
