'use client';
import React, { createContext, useContext, useState } from 'react';
import { cn } from '@/lib/utils';

interface TabsContextType {
  active: string;
  setActive: (value: string) => void;
}

const TabsContext = createContext<TabsContextType>({ active: '', setActive: () => {} });

interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
  className?: string;
  onChange?: (value: string) => void;
}

export function Tabs({ defaultValue, children, className, onChange }: TabsProps) {
  const [active, setActive] = useState(defaultValue);

  const handleChange = (value: string) => {
    setActive(value);
    onChange?.(value);
  };

  return (
    <TabsContext.Provider value={{ active, setActive: handleChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

interface TabListProps {
  children: React.ReactNode;
  className?: string;
}

export function TabList({ children, className }: TabListProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-1 border-b border-gray-200',
        className
      )}
    >
      {children}
    </div>
  );
}

interface TabProps {
  value: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  count?: number;
  className?: string;
}

export function Tab({ value, children, icon, count, className }: TabProps) {
  const { active, setActive } = useContext(TabsContext);
  const isActive = active === value;

  return (
    <button
      onClick={() => setActive(value)}
      className={cn(
        'relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors duration-150',
        isActive
          ? 'text-brand-600'
          : 'text-dark-500 hover:text-dark-800',
        className
      )}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
      {count !== undefined && (
        <span
          className={cn(
            'ml-1 px-1.5 py-0.5 rounded-full text-xs font-semibold',
            isActive ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-600'
          )}
        >
          {count}
        </span>
      )}
      {isActive && (
        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full" />
      )}
    </button>
  );
}

interface TabPanelProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function TabPanel({ value, children, className }: TabPanelProps) {
  const { active } = useContext(TabsContext);
  if (active !== value) return null;
  return <div className={cn('animate-fade-in', className)}>{children}</div>;
}
