'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { Sparkles, Zap, Brain, ArrowRight, CheckCircle } from 'lucide-react';

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
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-orange opacity-10 rounded-full filter blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary-orange opacity-5 rounded-full filter blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary-orange/5 to-transparent rounded-full"></div>
      </div>

      {/* Navigation */}
      <motion.nav 
        className="relative z-10 flex justify-between items-center p-6 md:p-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center space-x-2">
          <Image
            src="/logo1.svg"
            alt="FreeLunch Logo"
            width={40}
            height={40}
            className="rounded-lg"
          />
          <span className="text-xl font-bold">FreeLunch</span>
        </div>
        <motion.button
          className="px-4 py-2 border border-primary-orange text-primary-orange hover:bg-primary-orange hover:text-black transition-all duration-300 rounded-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Sign In
        </motion.button>
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
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Sparkles className="w-4 h-4 text-primary-orange" />
            <span className="text-sm text-gray-300">AI-Powered Intelligence • Coming Soon</span>
            <Sparkles className="w-4 h-4 text-primary-orange" />
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <span className="bg-orange-gradient bg-clip-text text-transparent animate-glow">
              Freelunch AI
            </span>{' '}
            will make
            <span className="block">
              2-person startup unicorns a reality.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            All-in-one, ai-native, open-source backend platform for startups post-MVP. Gives
            startups Google-level maturity while being cheaper, easier to use and more flexible
            than the popular combo of VSCode + Heroku/Render/Railway. Give you the
            PaaS experience of Heroku + intuitive GUI of n8n + AI assistance of Cursor.
          </motion.p>

          {/* Waitlist Form */}
          <motion.div
            className="max-w-md mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            {!isSubmitted ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-orange-gradient hover:shadow-lg hover:shadow-primary-orange/25 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <span>Join the Waitlist</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
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
                <p className="text-gray-400">We&apos;ll notify you when FreeLunch launches.</p>
              </motion.div>
            )}
          </motion.div>

          {/* Feature Icons */}
          <motion.div
            className="flex justify-center space-x-8 md:space-x-12 mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            {[
              { icon: Brain, label: 'Smart AI' },
              { icon: Zap, label: 'Lightning Fast' },
              { icon: Sparkles, label: 'Innovative' },
            ].map((feature) => (
              <motion.div
                key={feature.label}
                className="flex flex-col items-center space-y-2 text-gray-400 hover:text-primary-orange transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <feature.icon className="w-8 h-8" />
                <span className="text-sm font-medium">{feature.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer
        className="relative z-10 text-center py-8 px-6 border-t border-gray-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.4 }}
      >
        <p className="text-gray-500 text-sm">
          © 2025 FreeLunch. All rights reserved. | Coming to{' '}
          <span className="text-primary-orange font-semibold">freelunch.dev</span>
        </p>
      </motion.footer>
    </div>
  );
}
