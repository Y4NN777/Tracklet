'use client';

import { Logo } from '@/components/logo';
import { useIntlayer } from 'next-intlayer';
import { motion } from 'framer-motion';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const i = useIntlayer('auth-layout');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
         <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
         <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-lg px-4 relative z-10">
        <motion.div
          className="flex flex-col items-center space-y-6 mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="scale-125">
             <Logo />
          </div>
          <p className="text-lg text-muted-foreground text-center font-medium max-w-[280px]">
            {i.subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
           {children}
        </motion.div>
      </div>

      <div className="mt-12 text-center text-xs text-muted-foreground opacity-50 uppercase tracking-widest font-bold">
         Secure • Encrypted • Private
      </div>
    </div>
  );
}
