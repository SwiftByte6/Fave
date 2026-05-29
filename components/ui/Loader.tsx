'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';

type LoaderProps = {
  fullScreen?: boolean;
  className?: string;
  message?: string;
};

export default function Loader({
  fullScreen = true,
  className = '',
  message = 'Crafting your premium fashion experience',
}: LoaderProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className={[
        fullScreen ? 'fixed inset-0' : 'relative w-full min-h-60',
        'overflow-hidden',
        className,
      ].join(' ')}
      style={{
        zIndex: fullScreen ? 2147483647 : undefined,
        backgroundColor: 'var(--background)',
      }}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(199,138,43,0.12),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(122,31,42,0.12),transparent_45%)]" />

      <div className="relative z-10 flex h-full min-h-[inherit] w-full items-center justify-center px-6">
        <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-5 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 6 }}
            animate={
              shouldReduceMotion
                ? { opacity: 1, scale: 1, y: 0 }
                : { opacity: 1, scale: 1, y: [0, -4, 0] }
            }
            transition={
              shouldReduceMotion
                ? { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
                : {
                    opacity: { duration: 0.45, ease: [0.4, 0, 0.2, 1] },
                    scale: { duration: 0.45, ease: [0.4, 0, 0.2, 1] },
                    y: { duration: 2.2, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' },
                  }
            }
            className="relative"
          >
            <Image
              src="/logo.png"
              alt="Favee logo"
              width={86}
              height={86}
              priority
              className="object-contain"
              style={{ width: 86, height: 86 }}
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="dancing text-4xl"
            style={{ color: 'var(--primary)' }}
          >
            Favee
          </motion.p>

          <div className="mt-1 w-full" style={{ maxWidth: 280 }}>
            <div
              className="relative w-full overflow-hidden rounded-full"
              style={{
                height: 3,
                backgroundColor: 'color-mix(in srgb, var(--fav-blush) 80%, transparent)',
              }}
            >
              <motion.div
                initial={{ x: '-115%' }}
                animate={{ x: '115%' }}
                transition={{
                  duration: shouldReduceMotion ? 1.8 : 1.25,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'easeInOut',
                }}
                className="absolute left-0 top-0 h-full w-1/2 rounded-full bg-[linear-gradient(90deg,var(--fav-gold),var(--primary),var(--fav-soft-gold))]"
              />
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.22, duration: 0.4 }}
            className="text-sm"
            style={{ color: 'var(--muted-foreground)' }}
          >
            {message}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
