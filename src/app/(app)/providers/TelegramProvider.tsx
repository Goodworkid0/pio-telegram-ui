'use client';

import { useEffect, type ReactNode } from 'react';

interface TelegramProviderProps {
  children: ReactNode;
}

// Extend Window interface for Telegram WebApp
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          show: () => void;
          hide: () => void;
          enable: () => void;
          disable: () => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
        };
        BackButton: {
          isVisible: boolean;
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
        };
        themeParams: {
          bg_color?: string;
          text_color?: string;
          hint_color?: string;
          link_color?: string;
          button_color?: string;
          button_text_color?: string;
          secondary_bg_color?: string;
        };
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
        };
      };
    };
  }
}

export function TelegramProvider({ children }: TelegramProviderProps) {
  useEffect(() => {
    // Initialize Telegram WebApp SDK
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      
      try {
        // Ready signal
        tg.ready();
        
        // Expand to full height
        tg.expand();
        
        // Apply theme colors to CSS variables
        const theme = tg.themeParams;
        if (theme) {
          document.documentElement.style.setProperty('--tg-bg-color', theme.bg_color || '#ffffff');
          document.documentElement.style.setProperty('--tg-text-color', theme.text_color || '#000000');
          document.documentElement.style.setProperty('--tg-hint-color', theme.hint_color || '#999999');
          document.documentElement.style.setProperty('--tg-link-color', theme.link_color || '#2481cc');
          document.documentElement.style.setProperty('--tg-button-color', theme.button_color || '#2481cc');
          document.documentElement.style.setProperty('--tg-button-text-color', theme.button_text_color || '#ffffff');
          document.documentElement.style.setProperty('--tg-secondary-bg-color', theme.secondary_bg_color || '#f0f0f0');
        }
        
        // Hide back button by default
        tg.BackButton.hide();
        
        console.log('✅ Telegram WebApp initialized', tg.initDataUnsafe);
      } catch (error) {
        console.error('❌ Failed to initialize Telegram WebApp:', error);
      }
    } else {
      console.warn('⚠️ Telegram WebApp not available (likely not in Telegram)');
    }
  }, []);

  return <>{children}</>;
}
