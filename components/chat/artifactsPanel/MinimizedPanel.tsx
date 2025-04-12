import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronsRightLeft } from 'lucide-react';
import { MinimizedPanelProps, ANIMATION_VARIANTS } from './types';

export function MinimizedPanel({ onExpand }: MinimizedPanelProps) {
  return (
    <motion.div
      key="minimized-bar"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={ANIMATION_VARIANTS.minimizedBar}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="absolute inset-y-0 right-0 flex items-center justify-center w-[50px] bg-slate-100 border-l"
    >
      <Button variant="ghost" size="icon" onClick={onExpand} aria-label="Expand artifacts panel">
        <ChevronsRightLeft className="h-5 w-5" />
      </Button>
    </motion.div>
  );
}
