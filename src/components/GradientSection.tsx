'use client';

import { motion } from 'framer-motion';

export default function GradientSection() {
  return (
    <div 
      className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 md:px-12 lg:px-16 xl:px-20 2xl:px-24 py-16 sm:py-20 md:py-24 bg-stone-50"
    >
      {/* Content Text */}
      <motion.div
        className="w-full max-w-6xl mb-16 sm:mb-20 md:mb-24"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <motion.p
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-black leading-relaxed text-left max-w-full"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          Our first product is an open source platform for backends. PaaS platforms (e.g. <em className="text-black">Heroku</em>) make backend DevOps easier, but have several problems: are expensive, lock you in, separate from where you design and code, not ai-native, not cloud-agnostic, don&apos;t offer the control DevOps engineers need sometimes, don&apos;t integrate well with their existing infra, don&apos;t have stellar UX.
          <br /><br />
          That&apos;s why a lot of companies still prefer to juggle a DevOps team + MLOps team + 10 different Ops tools + IDE. But we are building a better option.
          <br /><br />
          Imagine the PaaS experience of <em className="text-black">Heroku</em> + the intuitive GUI of <em className="text-black">N8N</em> + the AI support of <em className="text-black">MLFlow</em> + the AI-assistance of <em className="text-black">Cursor</em> in a single platform, without taking away control from low-level engineers.
        </motion.p>
      </motion.div>
    </div>
  );
}
