'use client';

import React from 'react';
import { Star, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUserStore } from '@/store/useUserStore';

export default function VipClub() {
  const { loyaltyCount } = useUserStore();
  
  // Calculate display values
  const currentProgress = Math.min(loyaltyCount, 6);
  const remainingPurchases = Math.max(5 - currentProgress, 0);
  const isRewardUnlocked = currentProgress >= 5;

  const steps = [1, 2, 3, 4, 5];

  return (
    <div className="w-full max-w-3xl mx-auto p-8 md:p-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
      {/* Title Section */}
      <h2 className="text-2xl md:text-3xl font-bold tracking-tighter text-gray-900 mb-2 uppercase">
        The Star VIP Club
      </h2>
      <p className="text-gray-500 mb-12 text-sm md:text-base">
        Earn your reward. Buy 5 shirts, get the 6th free.
      </p>

      {/* Progress Section */}
      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mb-12">
        {steps.map((step) => {
          const isCompleted = currentProgress >= step;
          
          return (
            <motion.div
              key={step}
              initial={false}
              animate={{ 
                scale: isCompleted ? [1, 1.1, 1] : 1,
                borderColor: isCompleted ? '#000' : '#e5e7eb'
              }}
              className={`
                relative w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full border-2 
                ${isCompleted ? 'border-black bg-white shadow-md' : 'border-dashed border-gray-300 text-gray-400'}
              `}
            >
              {isCompleted ? (
                <Star className="w-6 h-6 md:w-8 md:h-8 fill-black text-black" />
              ) : (
                <span className="text-lg md:text-xl font-semibold opacity-30">{step}</span>
              )}
            </motion.div>
          );
        })}

        {/* 6th Slot - The Reward */}
        <motion.div
           animate={{ 
             scale: isRewardUnlocked ? [1, 1.05, 1] : 1,
             backgroundColor: isRewardUnlocked ? '#f9fafb' : '#f9fafb'
           }}
           className={`
             w-14 h-14 md:w-20 md:h-20 flex items-center justify-center rounded-xl border-2 transition-colors
             ${isRewardUnlocked ? 'border-green-500 bg-green-50/30' : 'border-gray-100 bg-gray-50/50 text-gray-300'}
           `}
        >
          <ShieldCheck className={`w-8 h-8 md:w-12 md:h-12 ${isRewardUnlocked ? 'text-green-600' : 'text-gray-300'}`} />
        </motion.div>
      </div>

      {/* Status Msg */}
      <div className="text-gray-600 md:text-lg">
        {isRewardUnlocked ? (
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-green-600 font-bold"
          >
            🎉 Reward Unlocked! You've earned a free branded shirt.
          </motion.p>
        ) : (
          <p>
            <span className="font-bold border-b-2 border-black pb-0.5">
              {remainingPurchases} purchase{remainingPurchases !== 1 ? 's' : ''}
            </span>{' '}
            away from your free branded shirt.
          </p>
        )}
      </div>
    </div>
  );
}
