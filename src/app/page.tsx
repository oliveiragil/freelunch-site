'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { CircleDot, CheckCircle } from 'lucide-react';
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
        className="relative z-10 flex justify-between items-center p-6 md:p-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="flex items-center space-x-4">
          <div>
            <Image
              src="/logo_freelunch.svg"
              alt="Freelunch Logo"
              width={40}
              height={40}
              className="rounded-lg md:scale-125"
            />
          </div>
          <span className="text-xl md:text-2xl font-bold font-carter-one text-orange-500" style={{fontFamily: "Carter One, Impact, Arial Black, cursive"}}>Freelunch</span>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-100px)] px-6 text-center">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Hero Badge */}
          <motion.div
            className="inline-flex items-center space-x-2 bg-primary-gray border border-primary-orange/20 rounded-full px-4 py-2 mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <CircleDot className="w-4 h-4 text-primary-orange" />
            <span className="text-sm text-gray-300">Open-source, all-in-one infrastructure to support startups post-MVP</span>
            <CircleDot className="w-4 h-4 text-primary-orange" />
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <span className="bg-orange-gradient bg-clip-text text-transparent animate-glow">
              2-person Startup Unicorns
            </span>{' '}
            are the future,
            <span className="block">
              and we are building it.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Our first product is an open source platform for backends. PaaS platforms (e.g. <em>Heroku</em>) make backend DevOps easier, but have several problems: are expensive, lock you in, separate from where you design and code, not ai-native, not cloud-agnostic, don&apos;t offer the control DevOps engineers need sometimes, don&apos;t integrate well with their existing infra, don&apos;t have stellar UX.
            <br /><br />
            That&apos;s why a lot of companies still prefer to juggle a DevOps team + MLOps team + 10 different Ops tools + IDE. But we are building a better option.
            <br /><br />
            Imagine the PaaS experience of <em>Heroku</em> + the intuitive GUI of <em>N8N</em> + the AI support of <em>MLFlow</em> + the AI-assistance of <em>Cursor</em> in a single platform, without taking away control from low-level engineers.
          </motion.p>

          {/* Waitlist Form */}
          <motion.div
            className="max-w-md mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3 }}
          >
            {!isSubmitted ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gray-900/50 border border-primary-orange hover:border-primary-orange hover:bg-gray-900/70 text-primary-orange hover:text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
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
                    className="w-full px-6 py-4 bg-primary-gray border border-gray-700 rounded-lg focus:outline-none focus:border-primary-orange transition-all duration-300 text-white placeholder-gray-400"
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
