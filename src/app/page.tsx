'use client';

import { useState, useEffect } from 'react';
import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type EmailForm = z.infer<typeof emailSchema>;

// Terminal Typing Component
function TerminalTyping() {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const text = "Powering 2-person Startup Unicorns of tomorrow";

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, Math.random() * 100 + 50);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  const renderTextWithUnicornColors = (text: string) => {
    if (text.includes("2-person Startup Unicorns")) {
      return text
        .replace(/2-person/g, '<span class="unicorn-word unicorn-word-1">2-person</span>')
        .replace(/Startup/g, '<span class="unicorn-word unicorn-word-2">Startup</span>')
        .replace(/Unicorns/g, '<span class="unicorn-word unicorn-word-3">Unicorns</span>');
    }
    return text;
  };

  return (
    <div className="terminal-container mb-10">
      <div className="terminal-content">
        <div className="typing-line">
          <span className="terminal-prompt">~$</span>
          <div className="terminal-text-container">
            <span className="terminal-text-hidden">{text}</span>
            <span 
              className="terminal-text unicorn-text" 
              dangerouslySetInnerHTML={{ __html: renderTextWithUnicornColors(displayedText) }}
            />
          </div>
          <span className={`cursor ${showCursor ? 'opacity-100' : 'opacity-0'}`}>|</span>
        </div>
      </div>
    </div>
  );
}

// Toggle Functions Component
function ToggleSection({ 
  children, 
  isVisible, 
  className = '' 
}: { 
  children: React.ReactNode; 
  isVisible: boolean; 
  className?: string; 
}) {
  return (
    <div className={`${isVisible ? 'block opacity-100' : 'hidden opacity-0'} transition-all duration-500 ease-in-out ${className}`}>
      {children}
    </div>
  );
}

export default function Home() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [showCopyButton, setShowCopyButton] = useState(true);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  
  // Toggle states
  const [showMoreProblems, setShowMoreProblems] = useState(false);
  const [showMoreFAQ, setShowMoreFAQ] = useState(false);
  const [showMoreTools, setShowMoreTools] = useState(false);
  const [showMoreFeatures, setShowMoreFeatures] = useState(false);

  // Contact modal functions
  const toggleContactModal = () => {
    setIsContactModalOpen(!isContactModalOpen);
  };

  const closeContactModal = () => {
    setIsContactModalOpen(false);
    // Reset copy button state when closing
    setShowCopyButton(true);
    setShowCopySuccess(false);
  };

  const copyEmailAndClose = async () => {
    const email = 'freelunch@freelunch.dev';
    try {
      await navigator.clipboard.writeText(email);
      // Hide copy button and show success message
      setShowCopyButton(false);
      setShowCopySuccess(true);
      
      // Close modal after 2 seconds
      setTimeout(() => {
        closeContactModal();
      }, 2000);
    } catch (error) {
      // Fallback - show success message anyway
      setShowCopyButton(false);
      setShowCopySuccess(true);
      
      setTimeout(() => {
        closeContactModal();
      }, 2000);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
  });

  // Supabase functionality (mantido do código original)
  const testConnection = async () => {
    console.log('🧪 Testando conexão com Supabase...');
    try {
      const { data, error } = await supabase
        .from('emails')
        .select('count', { count: 'exact', head: true });
      
      console.log('📊 Resultado do teste:', { data, error });
      if (error) {
        console.error('❌ Erro no teste de conexão:', error);
        return false;
      }
      console.log('✅ Teste de conexão bem-sucedido');
      return true;
    } catch (err) {
      console.error('💥 Erro inesperado no teste:', err);
      return false;
    }
  };

  React.useEffect(() => {
    testConnection();
  }, []);

  const onSubmit = async (data: EmailForm) => {
    console.log('🚀 Iniciando submissão do email:', data.email);
    setIsLoading(true);
    setError(null);
    
    try {
      const connectionTest = await testConnection();
      if (!connectionTest) {
        throw new Error('Falha no teste de conexão');
      }

      console.log('📝 Inserindo email na base de dados...');
      
      const { data: insertedData, error: insertError } = await supabase
        .from('emails')
        .insert([
          { email_address: data.email }
        ])
        .select();

      console.log('📊 Resultado da inserção:', { 
        insertedData, 
        insertError,
        hasError: !!insertError,
        insertSuccess: !insertError && insertedData?.length > 0
      });

      if (insertError) {
        console.error('❌ Erro na inserção:', insertError);
        
        if (
          insertError.code === '23505' || 
          insertError.message?.includes('duplicate') ||
          insertError.message?.includes('unique') ||
          insertError.message?.includes('already exists') ||
          insertError.details?.includes('duplicate') ||
          insertError.details?.includes('unique') ||
          insertError.hint?.includes('duplicate') ||
          insertError.hint?.includes('unique')
        ) {
          console.log('✅ Email já existe - exibindo sucesso para o usuário');
          setIsSubmitted(true);
          reset();
          setIsLoading(false);
          return;
        }
        
        throw insertError;
      }

      console.log('🎉 Email salvo com sucesso!', insertedData);
      setIsSubmitted(true);
      reset();
    } catch (err: unknown) {
      console.error('💥 Erro completo no processo:', err);
      
      const errorMsg = String(err);
      
      if (
        errorMsg.includes('duplicate') ||
        errorMsg.includes('unique') ||
        errorMsg.includes('already exists') ||
        errorMsg.includes('23505') ||
        errorMsg.includes('constraint') ||
        (err && typeof err === 'object' && 'code' in err && err.code === '23505')
      ) {
        console.log('✅ Email duplicado capturado no catch - exibindo sucesso para o usuário');
        setIsSubmitted(true);
        reset();
        setIsLoading(false);
        return;
      }
      
      if (errorMsg.includes('relation "emails" does not exist')) {
        setError('❌ Tabela não encontrada. Execute o script SQL no Supabase Dashboard.');
      } else if (errorMsg.includes('permission denied')) {
        setError('❌ Permissão negada. Verifique as políticas RLS no Supabase.');
      } else if (errorMsg.includes('Falha no teste de conexão')) {
        setError('❌ Falha na conexão com Supabase. Verifique as credenciais.');
      } else {
        setError('❌ Erro ao salvar email. Verifique a configuração do Supabase.');
      }
    } finally {
      setIsLoading(false);
      console.log('🏁 Processo de submissão finalizado');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="header-enhanced flex flex-col lg:flex-row justify-center lg:justify-between items-center px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 md:py-12 relative">
        <div className="header-nav flex flex-col lg:flex-row justify-center lg:justify-between items-center w-full gap-6 lg:gap-0">
          <button className="flex items-center justify-center lg:justify-start space-x-3 logo-enhanced px-4 py-3 rounded-lg border-0 bg-transparent cursor-pointer">
            <Image 
              src="/logo_freelunch.svg" 
              alt="Freelunch Logo" 
              width={60}
              height={60}
              className="flex-shrink-0"
            />
            <span className="logo-text text-2xl md:text-3xl lg:text-4xl font-bold" style={{color: 'var(--brown)', fontFamily: 'var(--font-carter-one), cursive'}}>
              Freelunch
            </span>
          </button>
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 lg:gap-8 w-full md:w-auto justify-center lg:justify-end items-center">
            <a href="https://github.com/Freelunch-AI/lunch-stem"
               className="btn-header-enhanced px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-lg text-sm sm:text-base md:text-lg font-semibold text-center whitespace-nowrap flex items-center gap-5">
               From the creators of lunch-stem
               <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" className="inline-block flex-shrink-0">
                 <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
               </svg>
            </a>
            <div className="dropdown-waitlist">
              <button 
                onClick={toggleContactModal}
                className="btn-header-enhanced px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-lg text-sm sm:text-base md:text-lg font-semibold text-center flex items-center">
                Contact
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Section */}
      <main className="grid grid-cols-1 lg:grid-cols-2 gap-24 px-6 md:px-8 lg:px-12 py-12 max-w-[90vw] mx-auto min-h-[80vh] items-center">
        
        {/* LEFT COLUMN */}
        <section className="flex flex-col justify-center">
          <TerminalTyping />
          
          <p className="tagline-shimmer text-2xl md:text-3xl lg:text-4xl font-medium leading-relaxed tracking-wide cursor-pointer">
            <span style={{color: 'var(--green)'}}>Coming soon:</span>{' '}
            <span style={{color: 'var(--dark-brown)'}}>the first all-in-one, AI-assisted, open source Dev/Data/ML/LLMOps platform for backend engineers.</span>
          </p>
        </section>

        {/* RIGHT COLUMN */}
        <section className="flex flex-col justify-center">
          <div className="space-y-10">
            {/* Code Editor */}
            <div className="code-editor w-full">
              <div className="editor-header">
                <span className="dot" style={{background:'#ff5f56'}}></span>
                <span className="dot" style={{background:'#ffbd2e'}}></span>
                <span className="dot" style={{background:'#27c93f'}}></span>
              </div>
              <div className="flex p-6">
                <div className="line-numbers text-2xl leading-10">1<br/>2<br/>3<br/>4</div>
                <div className="text-2xl leading-10">
                  <span className="token-key">from</span> <span className="token-str">freelunch</span> <span className="token-key">import</span> <span className="token-fn">open_source</span><br/>
                  <br/>
                  <span className="token-var">lunchbox</span><span className="token-op"> = </span>
                  <span className="token-fn">open_source</span><span className="token-par">(</span>
                  <span className="token-str">&quot;cursor&quot; + &quot;heroku&quot; + &quot;sagemaker&quot;</span>
                  <span className="token-par">)</span>
                </div>
              </div>
            </div>

            {/* Waitlist Form */}
            {!isSubmitted ? (
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-4 w-full">
                <input
                  {...register('email')}
                  type="email"
                  placeholder="your@email.com"
                  className="input-pro border-2 border-[color:var(--brown)] rounded-xl p-4 flex-1 text-lg bg-white/90 backdrop-blur-sm focus:outline-none focus:border-[color:var(--green)] transition-all font-medium"
                />
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="btn-retro text-white px-8 py-4 rounded-xl text-xl whitespace-nowrap"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
                  ) : (
                    'Join waitlist'
                  )}
                </motion.button>
                {errors.email && (
                  <p className="text-red-400 text-sm mt-2">{errors.email.message}</p>
                )}
                {error && (
                  <p className="text-red-400 text-sm mt-2">{error}</p>
                )}
              </form>
            ) : (
              <motion.div
                className="flex items-center space-x-3"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <CheckCircle className="w-6 h-6 text-green-400" />
                <div>
                  <h3 className="text-lg font-semibold text-green-400">You&apos;re on the list!</h3>
                  <p className="text-sm text-gray-600">We&apos;ll notify you when Freelunch launches.</p>
                </div>
              </motion.div>
            )}
          </div>
        </section>
      </main>

      {/* PROBLEMS SECTION */}
      <section className="py-20 px-6 md:px-8 lg:px-12 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6" style={{color: 'var(--dark-brown)', fontFamily: "'Fira Code', monospace"}}>
              THE &quot;RAW&quot; MODERN INFRA STACK
            </h2>
            <p className="text-2xl md:text-3xl font-medium" style={{color: 'var(--brown)'}}>
              Why building software today feels like assembling IKEA furniture... blindfolded
            </p>
          </div>

          {/* Initial Problems Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            
            {/* Problem 1 */}
            <div className="code-editor">
              <div className="editor-header">
                <span className="dot" style={{background:'#ff5f56'}}></span>
                <span className="dot" style={{background:'#ffbd2e'}}></span>
                <span className="dot" style={{background:'#27c93f'}}></span>
                <span className="text-gray-400 ml-4 text-lg font-medium">startup_pain.py</span>
              </div>
              <div className="flex p-6">
                <div className="line-numbers text-lg leading-8">1<br/>2<br/>3<br/>4</div>
                <div className="text-lg leading-8">
                  <span className="token-key">class</span> <span className="token-fn">ModernInfraStack</span><span className="token-par">:</span><br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;<span className="token-var">initial_setup_time</span> <span className="token-op">=</span> <span className="token-str">&quot;weeks_to_months&quot;</span><br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;<span className="token-var">developer_sanity</span> <span className="token-op">=</span> <span className="token-str">&quot;rapidly_declining&quot;</span><br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;<span className="token-var">productivity</span> <span className="token-op">=</span> <span className="token-str">&quot;blocked_by_tooling&quot;</span>
                </div>
              </div>
            </div>

            {/* Problem 2 */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border-2 shadow-lg" style={{borderColor: 'var(--green)'}}>
              <div className="flex items-center mb-4">
                <div className="w-4 h-4 rounded-full mr-3" style={{background: 'var(--green)'}}></div>
                <h3 className="text-2xl font-bold" style={{color: 'var(--dark-brown)'}}>Tool Jumping Chaos</h3>
              </div>
              <p className="text-lg" style={{color: 'var(--brown)'}}>
                Docker → Kubernetes → Terraform → GitHub Actions → AWS Console → Grafana → Slack → Repeat...
                <br/><br/>
                <span className="font-semibold">Result:</span> Context switching kills focus and momentum.
              </p>
            </div>

          </div>

          {/* Show More Problems Button */}
          <div className="text-center mb-8">
            <button 
              onClick={() => setShowMoreProblems(!showMoreProblems)}
              className="bg-white/90 backdrop-blur-sm rounded-xl px-8 py-4 border-2 shadow-lg font-bold text-lg transition-all hover:scale-105 border-red-400" 
              style={{color: 'var(--dark-brown)'}}
            >
              <span>{showMoreProblems ? 'Show Less Problems' : 'See More Problems'}</span>
              <span className="ml-2">{showMoreProblems ? '😌' : '😰'}</span>
            </button>
          </div>

          {/* Additional Problems Section */}
          <ToggleSection isVisible={showMoreProblems}>
            
            {/* More Problems Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
              
              {/* Problem 3 */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border-2 shadow-lg" style={{borderColor: 'var(--green)'}}>
                <div className="flex items-center mb-4">
                  <div className="w-4 h-4 rounded-full mr-3" style={{background: 'var(--green)'}}></div>
                  <h3 className="text-2xl font-bold" style={{color: 'var(--dark-brown)'}}>AI Fragmentation</h3>
                </div>
                <p className="text-lg" style={{color: 'var(--brown)'}}>
                  Every tool has its own AI assistant, but none understand your full stack.
                  <br/><br/>
                  <span className="font-semibold">Result:</span> Isolated help without shared context across your workflow.
                </p>
              </div>

              {/* Problem 4 */}
              <div className="code-editor">
                <div className="editor-header">
                  <span className="dot" style={{background:'#ff5f56'}}></span>
                  <span className="dot" style={{background:'#ffbd2e'}}></span>
                  <span className="dot" style={{background:'#27c93f'}}></span>
                  <span className="text-gray-400 ml-4 text-lg font-medium">observability_nightmare.py</span>
                </div>
                <div className="flex p-6">
                  <div className="line-numbers text-lg leading-8">1<br/>2<br/>3<br/>4<br/>5</div>
                  <div className="text-lg leading-8">
                    <span className="token-key">def</span> <span className="token-fn">debug_production_issue</span><span className="token-par">():</span><br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="token-key">while</span> <span className="token-var">True</span><span className="token-par">:</span><br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="token-fn">check_logs_in_5_different_places</span><span className="token-par">()</span><br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="token-fn">correlate_metrics_manually</span><span className="token-par">()</span><br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="token-fn">pray_to_debugging_gods</span><span className="token-par">()</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Problems Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border-2 shadow-lg" style={{borderColor: 'var(--green)'}}>
                <div className="flex items-center mb-4">
                  <div className="w-4 h-4 rounded-full mr-3" style={{background: 'var(--green)'}}></div>
                  <h3 className="text-xl font-bold" style={{color: 'var(--dark-brown)'}}>No Declarative Interface</h3>
                </div>
                <p className="text-base" style={{color: 'var(--brown)'}}>
                  Everything is imperative commands and configuration files scattered across repos.
                </p>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border-2 shadow-lg" style={{borderColor: 'var(--green)'}}>
                <div className="flex items-center mb-4">
                  <div className="w-4 h-4 rounded-full mr-3" style={{background: 'var(--green)'}}></div>
                  <h3 className="text-xl font-bold" style={{color: 'var(--dark-brown)'}}>Maintenance Hell</h3>
                </div>
                <p className="text-base" style={{color: 'var(--brown)'}}>
                  Version upgrades, integration work, bug fixes, and keeping everything compatible.
                </p>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border-2 shadow-lg" style={{borderColor: 'var(--green)'}}>
                <div className="flex items-center mb-4">
                  <div className="w-4 h-4 rounded-full mr-3" style={{background: 'var(--green)'}}></div>
                  <h3 className="text-xl font-bold" style={{color: 'var(--dark-brown)'}}>No Marketplace</h3>
                </div>
                <p className="text-base" style={{color: 'var(--brown)'}}>
                  Everyone rebuilds the same infrastructure patterns from scratch.
                </p>
              </div>

            </div>

          </ToggleSection>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="inline-block text-white px-8 py-4 rounded-2xl text-2xl font-bold shadow-lg transform hover:scale-105 transition-all" style={{background: 'linear-gradient(135deg, var(--green) 0%, var(--brown) 100%)'}}>
              There&apos;s got to be a better way... 🤔
            </div>
          </div>

        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-20 px-6 md:px-8 lg:px-12" style={{background: 'linear-gradient(135deg, var(--beige) 0%, var(--light-beige) 100%)'}}>
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6" style={{color: 'var(--dark-brown)', fontFamily: "'Fira Code', monospace"}}>
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <p className="text-2xl md:text-3xl font-medium" style={{color: 'var(--brown)'}}>
              Let&apos;s clear up some confusion about what Lunchbox actually is
            </p>
          </div>

          {/* Initial FAQ */}
          <div className="space-y-12">
            
            {/* FAQ 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="code-editor">
                <div className="editor-header">
                  <span className="dot" style={{background:'#ff5f56'}}></span>
                  <span className="dot" style={{background:'#ffbd2e'}}></span>
                  <span className="dot" style={{background:'#27c93f'}}></span>
                  <span className="text-gray-400 ml-4 text-lg font-medium">faq_lovable.py</span>
                </div>
                <div className="flex p-6">
                  <div className="line-numbers text-lg leading-8">1<br/>2<br/>3<br/>4</div>
                  <div className="text-lg leading-8">
                    <span className="token-key">if</span> <span className="token-var">project_type</span> <span className="token-op">==</span> <span className="token-str">&quot;vibe_coding&quot;</span><span className="token-par">:</span><br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="token-var">use_tool</span> <span className="token-op">=</span> <span className="token-str">&quot;lovable&quot;</span><br/>
                    <span className="token-key">elif</span> <span className="token-var">project_type</span> <span className="token-op">==</span> <span className="token-str">&quot;serious_backend&quot;</span><span className="token-par">:</span><br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="token-var">use_tool</span> <span className="token-op">=</span> <span className="token-str">&quot;lunchbox&quot;</span>
                  </div>
                </div>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border-2 shadow-lg" style={{borderColor: 'var(--green)'}}>
                <h3 className="text-2xl font-bold mb-4" style={{color: 'var(--dark-brown)'}}>Is this a vibe coding tool like Lovable?</h3>
                <p className="text-lg" style={{color: 'var(--brown)'}}>
                  <strong>No</strong>, it&apos;s a platform for serious backend/AI engineering. Teams that hit the ceiling with Lovable can move to Lunchbox to build robust and scalable microservice-based backends that use Big Data and AI.
                </p>
              </div>
            </div>

            {/* FAQ 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border-2 shadow-lg order-2 lg:order-1" style={{borderColor: 'var(--green)'}}>
                <h3 className="text-2xl font-bold mb-4" style={{color: 'var(--dark-brown)'}}>Is this an IDE like Cursor?</h3>
                <p className="text-lg" style={{color: 'var(--brown)'}}>
                  <strong>No</strong>, it&apos;s more than an IDE. It&apos;s a platform with an AI-powered IDE (built on VSCode) inside it. Think of it as your entire development ecosystem, not just a code editor.
                </p>
              </div>
              <div className="code-editor order-1 lg:order-2">
                <div className="editor-header">
                  <span className="dot" style={{background:'#ff5f56'}}></span>
                  <span className="dot" style={{background:'#ffbd2e'}}></span>
                  <span className="dot" style={{background:'#27c93f'}}></span>
                  <span className="text-gray-400 ml-4 text-lg font-medium">platform_vs_ide.py</span>
                </div>
                <div className="flex p-6">
                  <div className="line-numbers text-lg leading-8">1<br/>2<br/>3<br/>4<br/>5</div>
                  <div className="text-lg leading-8">
                    <span className="token-var">cursor</span> <span className="token-op">=</span> <span className="token-str">&quot;just_an_ide&quot;</span><br/>
                    <span className="token-var">lunchbox</span> <span className="token-op">=</span> <span className="token-par">&#123;</span><br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="token-str">&quot;ide&quot;</span><span className="token-par">:</span> <span className="token-str">&quot;vscode_based&quot;</span><span className="token-par">,</span><br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="token-str">&quot;platform&quot;</span><span className="token-par">:</span> <span className="token-str">&quot;full_devops_lifecycle&quot;</span><br/>
                    <span className="token-par">&#125;</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Show More FAQ Button */}
          <div className="text-center my-12">
            <button 
              onClick={() => setShowMoreFAQ(!showMoreFAQ)}
              className="bg-white/90 backdrop-blur-sm rounded-xl px-8 py-4 border-2 shadow-lg font-bold text-lg transition-all hover:scale-105 border-blue-400" 
              style={{color: 'var(--dark-brown)'}}
            >
              <span>{showMoreFAQ ? 'Show Less Questions' : 'Show More Questions'}</span>
              <span className="ml-2">{showMoreFAQ ? '✅' : '❓'}</span>
            </button>
          </div>

          {/* Additional FAQ Section */}
          <ToggleSection isVisible={showMoreFAQ}>
            
            {/* Additional FAQ Grid */}
            <div className="space-y-12">

              {/* FAQ 3 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="code-editor">
                  <div className="editor-header">
                    <span className="dot" style={{background:'#ff5f56'}}></span>
                    <span className="dot" style={{background:'#ffbd2e'}}></span>
                    <span className="dot" style={{background:'#27c93f'}}></span>
                    <span className="text-gray-400 ml-4 text-lg font-medium">cloud_agnostic.py</span>
                  </div>
                  <div className="flex p-6">
                    <div className="line-numbers text-lg leading-8">1<br/>2<br/>3<br/>4</div>
                    <div className="text-lg leading-8">
                      <span className="token-var">supported_clouds</span> <span className="token-op">=</span> <span className="token-par">[</span><br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;<span className="token-str">&quot;aws&quot;</span><span className="token-par">,</span> <span className="token-str">&quot;gcp&quot;</span><span className="token-par">,</span> <span className="token-str">&quot;azure&quot;</span><span className="token-par">,</span> <span className="token-str">&quot;digital_ocean&quot;</span><span className="token-par">,</span><br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;<span className="token-str">&quot;your_preferred_cloud_here&quot;</span><br/>
                      <span className="token-par">]</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border-2 shadow-lg" style={{borderColor: 'var(--green)'}}>
                  <h3 className="text-2xl font-bold mb-4" style={{color: 'var(--dark-brown)'}}>Will I be able to deploy to my preferred cloud?</h3>
                  <p className="text-lg" style={{color: 'var(--brown)'}}>
                    <strong>Yes</strong>, it&apos;s cloud agnostic. Whether you&apos;re team AWS, GCP, Azure, or something else entirely - Lunchbox adapts to your infrastructure preferences.
                  </p>
                </div>
              </div>

              {/* FAQ 4 & 5 Combined */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border-2 shadow-lg" style={{borderColor: 'var(--green)'}}>
                  <div className="flex items-center mb-4">
                    <div className="w-4 h-4 rounded-full mr-3" style={{background: 'var(--green)'}}></div>
                    <h3 className="text-xl font-bold" style={{color: 'var(--dark-brown)'}}>What about vendor lock-in?</h3>
                  </div>
                  <p className="text-lg" style={{color: 'var(--brown)'}}>
                    <strong>No lock-in.</strong> Lunchbox is open source and has a super friendly eject option. You own your code and infrastructure.
                  </p>
                </div>
                
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border-2 shadow-lg" style={{borderColor: 'var(--green)'}}>
                  <div className="flex items-center mb-4">
                    <div className="w-4 h-4 rounded-full mr-3" style={{background: 'var(--green)'}}></div>
                    <h3 className="text-xl font-bold" style={{color: 'var(--dark-brown)'}}>Does it use popular tools under the hood?</h3>
                  </div>
                  <p className="text-lg" style={{color: 'var(--brown)'}}>
                    <strong>Yes.</strong> Built on popular open source tools. Switch between them (e.g., Postgres → MariaDB) while maintaining a stable higher-level API.
                  </p>
                </div>
              </div>

            </div>

          </ToggleSection>

          {/* Bottom Call to Action */}
          <div className="text-center mt-16">
            <div className="inline-block text-white px-8 py-4 rounded-2xl text-2xl font-bold shadow-lg transform hover:scale-105 transition-all" style={{background: 'linear-gradient(135deg, var(--green) 0%, var(--brown) 100%)'}}>
              Ready to escape the tooling chaos? 🚀
            </div>
          </div>

        </div>
      </section>

      {/* TOOLS INTEGRATION SECTION */}
      <section className="py-20 px-6 md:px-8 lg:px-12 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{color: 'var(--dark-brown)', fontFamily: "'Fira Code', monospace"}}>
              COMBINES THE BEST OF POPULAR TOOLS
            </h2>
            <p className="text-2xl md:text-3xl font-medium" style={{color: 'var(--brown)'}}>
              In a single, unified experience
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            
            {/* Container Orchestration */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 shadow-lg border-emerald-400">
              <div className="flex items-center mb-3">
                <div className="w-3 h-3 rounded-full mr-3 bg-emerald-500"></div>
                <h3 className="text-lg font-bold" style={{color: 'var(--dark-brown)'}}>Docker & Kubernetes</h3>
              </div>
              <p className="text-sm" style={{color: 'var(--brown)'}}>Container orchestration</p>
            </div>

            {/* Simple Concurrency */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 shadow-lg border-green-400">
              <div className="flex items-center mb-3">
                <div className="w-3 h-3 rounded-full mr-3 bg-green-500"></div>
                <h3 className="text-lg font-bold" style={{color: 'var(--dark-brown)'}}>Goroutines</h3>
              </div>
              <p className="text-sm" style={{color: 'var(--brown)'}}>Simple Concurrency</p>
            </div>

            {/* Code Parallelization */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 shadow-lg border-teal-400">
              <div className="flex items-center mb-3">
                <div className="w-3 h-3 rounded-full mr-3 bg-teal-500"></div>
                <h3 className="text-lg font-bold" style={{color: 'var(--dark-brown)'}}>Numba</h3>
              </div>
              <p className="text-sm" style={{color: 'var(--brown)'}}>Automatic code parallelization</p>
            </div>

            {/* Virtual Clusters */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 shadow-lg border-lime-400">
              <div className="flex items-center mb-3">
                <div className="w-3 h-3 rounded-full mr-3 bg-lime-500"></div>
                <h3 className="text-lg font-bold" style={{color: 'var(--dark-brown)'}}>Netmaker</h3>
              </div>
              <p className="text-sm" style={{color: 'var(--brown)'}}>Virtual clusters</p>
            </div>

            {/* Security & Compliance */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 shadow-lg border-emerald-500">
              <div className="flex items-center mb-3">
                <div className="w-3 h-3 rounded-full mr-3 bg-emerald-600"></div>
                <h3 className="text-lg font-bold" style={{color: 'var(--dark-brown)'}}>Openshift</h3>
              </div>
              <p className="text-sm" style={{color: 'var(--brown)'}}>Security & Compliance for k8s</p>
            </div>

            {/* PaaS Experience */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 shadow-lg border-green-500">
              <div className="flex items-center mb-3">
                <div className="w-3 h-3 rounded-full mr-3 bg-green-600"></div>
                <h3 className="text-lg font-bold" style={{color: 'var(--dark-brown)'}}>Harness</h3>
              </div>
              <p className="text-sm" style={{color: 'var(--brown)'}}>OSS PaaS experience</p>
            </div>

            {/* AI Assistance */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 shadow-lg border-teal-500">
              <div className="flex items-center mb-3">
                <div className="w-3 h-3 rounded-full mr-3 bg-teal-600"></div>
                <h3 className="text-lg font-bold" style={{color: 'var(--dark-brown)'}}>Cursor</h3>
              </div>
              <p className="text-sm" style={{color: 'var(--brown)'}}>GUI AI assistance for engineers</p>
            </div>

            {/* Block-based Building */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 shadow-lg border-lime-500">
              <div className="flex items-center mb-3">
                <div className="w-3 h-3 rounded-full mr-3 bg-lime-600"></div>
                <h3 className="text-lg font-bold" style={{color: 'var(--dark-brown)'}}>N8N</h3>
              </div>
              <p className="text-sm" style={{color: 'var(--brown)'}}>Block-based system building</p>
            </div>

            {/* Experiment Tracking */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 shadow-lg border-emerald-600">
              <div className="flex items-center mb-3">
                <div className="w-3 h-3 rounded-full mr-3 bg-emerald-700"></div>
                <h3 className="text-lg font-bold" style={{color: 'var(--dark-brown)'}}>MLFlow</h3>
              </div>
              <p className="text-sm" style={{color: 'var(--brown)'}}>Experiment Tracking + Artifact Storage</p>
            </div>

          </div>

          {/* Show More Button */}
          <div className="text-center mb-8">
            <button 
              onClick={() => setShowMoreTools(!showMoreTools)}
              className="bg-white/90 backdrop-blur-sm rounded-xl px-8 py-4 border-2 shadow-lg font-bold text-lg transition-all hover:scale-105 border-green-400" 
              style={{color: 'var(--dark-brown)'}}
            >
              <span>{showMoreTools ? 'Show Less Tools' : 'Show More Tools'}</span>
              <span className="ml-2">{showMoreTools ? '▲' : '▼'}</span>
            </button>
          </div>

          {/* Additional Tools Grid */}
          <ToggleSection isVisible={showMoreTools} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            
            {/* Row 1 */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border-2 shadow-sm border-emerald-300">
              <h4 className="font-bold text-sm mb-1" style={{color: 'var(--dark-brown)'}}>Dapr</h4>
              <p className="text-xs" style={{color: 'var(--brown)'}}>Helper APIs for microservices</p>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border-2 shadow-sm border-green-300">
              <h4 className="font-bold text-sm mb-1" style={{color: 'var(--dark-brown)'}}>Meshery</h4>
              <p className="text-xs" style={{color: 'var(--brown)'}}>Meta service mesh</p>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border-2 shadow-sm border-teal-300">
              <h4 className="font-bold text-sm mb-1" style={{color: 'var(--dark-brown)'}}>OpenFaas</h4>
              <p className="text-xs" style={{color: 'var(--brown)'}}>Function-to-k8s-workloads builds</p>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border-2 shadow-sm border-lime-300">
              <h4 className="font-bold text-sm mb-1" style={{color: 'var(--dark-brown)'}}>Data Stack</h4>
              <p className="text-xs" style={{color: 'var(--brown)'}}>Datahub + Trino + Superset</p>
            </div>

            {/* Row 2 */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border-2 shadow-sm border-emerald-400">
              <h4 className="font-bold text-sm mb-1" style={{color: 'var(--dark-brown)'}}>Great Expectations</h4>
              <p className="text-xs" style={{color: 'var(--brown)'}}>Online data testing</p>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border-2 shadow-sm border-green-400">
              <h4 className="font-bold text-sm mb-1" style={{color: 'var(--dark-brown)'}}>Observability Stack</h4>
              <p className="text-xs" style={{color: 'var(--brown)'}}>OpenTelemetry + SigNoz + more</p>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border-2 shadow-sm border-teal-400">
              <h4 className="font-bold text-sm mb-1" style={{color: 'var(--dark-brown)'}}>DVC</h4>
              <p className="text-xs" style={{color: 'var(--brown)'}}>Git-based workflow + data versioning</p>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border-2 shadow-sm border-lime-400">
              <h4 className="font-bold text-sm mb-1" style={{color: 'var(--dark-brown)'}}>Langfuse</h4>
              <p className="text-xs" style={{color: 'var(--brown)'}}>AI system Quality Assurance</p>
            </div>

            {/* Row 3 */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border-2 shadow-sm border-emerald-500">
              <h4 className="font-bold text-sm mb-1" style={{color: 'var(--dark-brown)'}}>Trace</h4>
              <p className="text-xs" style={{color: 'var(--brown)'}}>Auto code learning</p>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border-2 shadow-sm border-green-500">
              <h4 className="font-bold text-sm mb-1" style={{color: 'var(--dark-brown)'}}>DSPy</h4>
              <p className="text-xs" style={{color: 'var(--brown)'}}>Auto-finetuning within code</p>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border-2 shadow-sm border-teal-500">
              <h4 className="font-bold text-sm mb-1" style={{color: 'var(--dark-brown)'}}>Marimo</h4>
              <p className="text-xs" style={{color: 'var(--brown)'}}>Advanced notebooks</p>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border-2 shadow-sm border-lime-500">
              <h4 className="font-bold text-sm mb-1" style={{color: 'var(--dark-brown)'}}>Grafana</h4>
              <p className="text-xs" style={{color: 'var(--brown)'}}>Crisp visualizations</p>
            </div>

            {/* Row 4 */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border-2 shadow-sm border-emerald-600">
              <h4 className="font-bold text-sm mb-1" style={{color: 'var(--dark-brown)'}}>Backstage</h4>
              <p className="text-xs" style={{color: 'var(--brown)'}}>Unified GUI for engineers</p>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border-2 shadow-sm border-green-600">
              <h4 className="font-bold text-sm mb-1" style={{color: 'var(--dark-brown)'}}>Label Studio</h4>
              <p className="text-xs" style={{color: 'var(--brown)'}}>Data annotation</p>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border-2 shadow-sm border-teal-600">
              <h4 className="font-bold text-sm mb-1" style={{color: 'var(--dark-brown)'}}>Edge Computing</h4>
              <p className="text-xs" style={{color: 'var(--brown)'}}>Thingsboard + KubeEdge</p>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border-2 shadow-sm border-lime-600">
              <h4 className="font-bold text-sm mb-1" style={{color: 'var(--dark-brown)'}}>And more...</h4>
              <p className="text-xs" style={{color: 'var(--brown)'}}>All integrated seamlessly</p>
            </div>

          </ToggleSection>

        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-20 px-6 md:px-8 lg:px-12" style={{background: 'linear-gradient(135deg, var(--beige) 0%, var(--light-beige) 100%)'}}>
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{color: 'var(--dark-brown)', fontFamily: "'Fira Code', monospace"}}>
              FEATURES THAT MAKE THE DIFFERENCE
            </h2>
            <p className="text-2xl md:text-3xl font-medium" style={{color: 'var(--brown)'}}>
              Everything you need to build, deploy, and scale modern software systems
            </p>
          </div>

          {/* Core Features Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            
            {/* Multi-Language & Library Agnostic */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 shadow-lg border-emerald-400">
              <div className="flex items-center mb-4">
                <div className="w-4 h-4 rounded-full mr-3 bg-emerald-500"></div>
                <h3 className="text-xl font-bold" style={{color: 'var(--dark-brown)'}}>Multi-Language & Library Agnostic</h3>
              </div>
              <p className="text-base" style={{color: 'var(--brown)'}}>
                Build-time DSL that extends Python, Rust, Go, and more. Continue using your favourite libraries, no changes required.
              </p>
            </div>
            
            {/* Declarative Over Imperative */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 shadow-lg border-green-400">
              <div className="flex items-center mb-4">
                <div className="w-4 h-4 rounded-full mr-3 bg-green-500"></div>
                <h3 className="text-xl font-bold" style={{color: 'var(--dark-brown)'}}>Declarative Over Imperative</h3>
              </div>
              <p className="text-base" style={{color: 'var(--brown)'}}>
                Describe what you want, not how to build it. Self-serve platform that handles the complexity for you.
              </p>
            </div>
            
            {/* Distributed Feels Local */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 shadow-lg border-teal-400">
              <div className="flex items-center mb-4">
                <div className="w-4 h-4 rounded-full mr-3 bg-teal-500"></div>
                <h3 className="text-xl font-bold" style={{color: 'var(--dark-brown)'}}>Distributed Feels Local</h3>
              </div>
              <p className="text-base" style={{color: 'var(--brown)'}}>
                Write code that feels like local single-threaded computing. Then, add build-time decorators that make it parallel, concurrent and distributed.
              </p>
            </div>

          </div>

          {/* Show More Features Button */}
          <div className="text-center mb-8">
            <button 
              onClick={() => setShowMoreFeatures(!showMoreFeatures)}
              className="bg-white/90 backdrop-blur-sm rounded-xl px-8 py-4 border-2 shadow-lg font-bold text-lg transition-all hover:scale-105 border-green-400" 
              style={{color: 'var(--dark-brown)'}}
            >
              <span>{showMoreFeatures ? 'Show Less Features' : 'Show More Features'}</span>
              <span className="ml-2">{showMoreFeatures ? '▲' : '▼'}</span>
            </button>
          </div>

          {/* Additional Features Section */}
          <ToggleSection isVisible={showMoreFeatures}>

          {/* Reusable Blocks Section */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold mb-8 text-center" style={{color: 'var(--dark-brown)'}}>Reusable & Shareable Building Blocks</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Code Blocks */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 shadow-lg border-emerald-500">
                <div className="flex items-center mb-4">
                  <div className="w-4 h-4 rounded-full mr-3 bg-emerald-600"></div>
                  <h4 className="text-lg font-bold" style={{color: 'var(--dark-brown)'}}>Code Blocks</h4>
                </div>
                <ul className="text-sm space-y-2" style={{color: 'var(--brown)'}}>
                  <li>• Services & Microservices</li>
                  <li>• Tasks & Event Handlers</li>
                  <li>• Processes & Threads</li>
                  <li>• Reusable Components</li>
                </ul>
              </div>

              {/* Infrastructure Blocks */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 shadow-lg border-green-500">
                <div className="flex items-center mb-4">
                  <div className="w-4 h-4 rounded-full mr-3 bg-green-600"></div>
                  <h4 className="text-lg font-bold" style={{color: 'var(--dark-brown)'}}>Infrastructure Blocks</h4>
                </div>
                <ul className="text-sm space-y-2" style={{color: 'var(--brown)'}}>
                  <li>• Physical Clusters</li>
                  <li>• VM & VPN Clusters</li>
                  <li>• Kubernetes Clusters</li>
                  <li>• Platform Policies</li>
                </ul>
              </div>

              {/* Physical Elements */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 shadow-lg border-teal-500">
                <div className="flex items-center mb-4">
                  <div className="w-4 h-4 rounded-full mr-3 bg-teal-600"></div>
                  <h4 className="text-lg font-bold" style={{color: 'var(--dark-brown)'}}>Edge & Physical</h4>
                </div>
                <ul className="text-sm space-y-2" style={{color: 'var(--brown)'}}>
                  <li>• Robots & IoT Devices</li>
                  <li>• Mechanical Elements</li>
                  <li>• Motors & Electronics</li>
                  <li>• Thermal Systems</li>
                </ul>
              </div>

            </div>
          </div>

          {/* Edge Computing Section */}
          <div className="text-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border-2 shadow-lg border-lime-600 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold mb-4" style={{color: 'var(--dark-brown)'}}>Edge Computing & Digital Twins</h3>
              <p className="text-lg" style={{color: 'var(--brown)'}}>
                Edge devices simulated in the cloud with Digital Twin visualization of your entire physical edge system. 
                See the complete picture of your embedded devices and their environment.
              </p>
            </div>
          </div>

          </ToggleSection>

        </div>
      </section>

      {/* Contact Modal */}
      <div 
        className={`contact-modal ${isContactModalOpen ? 'show' : ''}`}
        onClick={closeContactModal}
      >
        <div 
          className="contact-modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={closeContactModal}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold transition-colors"
          >
            ×
          </button>
          <div className="flex flex-col gap-4 w-full text-center">
            <h3 className="text-2xl font-bold" style={{color: 'var(--dark-brown)'}}>Get in Touch</h3>
            <div className="bg-gray-50 rounded-xl p-4 border-2 shadow-lg" style={{borderColor: 'var(--green)'}}>
              <p className="text-sm font-medium mb-2" style={{color: 'var(--brown)'}}>Email me directly:</p>
              <a 
                href="mailto:freelunch@freelunch.dev" 
                className="text-xl font-bold hover:underline transition-colors"
                style={{color: 'var(--dark-brown)'}}
                onClick={closeContactModal}
              >
                freelunch@freelunch.dev
              </a>
            </div>
            {showCopyButton && (
              <button 
                onClick={copyEmailAndClose}
                className="btn-retro text-white px-6 py-3 rounded-xl text-lg font-semibold transition-all"
              >
                Copy Email
              </button>
            )}
            {showCopySuccess && (
              <div className="bg-green-100 text-green-800 px-6 py-3 rounded-xl text-lg font-semibold border-2 border-green-300">
                📧 Email copied to clipboard!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
