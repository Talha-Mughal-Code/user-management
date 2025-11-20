'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  variant?: 'default' | 'pills';
  lazyLoad?: boolean;
}

export const Tabs = ({
  tabs,
  defaultTab,
  activeTab: controlledActiveTab,
  onTabChange,
  variant = 'default',
  lazyLoad = false,
}: TabsProps) => {
  const [internalActiveTab, setInternalActiveTab] = React.useState(
    defaultTab || tabs[0]?.id
  );

  const isControlled = controlledActiveTab !== undefined;
  const activeTab = isControlled ? controlledActiveTab : internalActiveTab;

  const handleTabClick = (tabId: string) => {
    if (!isControlled) {
      setInternalActiveTab(tabId);
    }
    onTabChange?.(tabId);
  };

  const activeTabIndex = tabs.findIndex((tab) => tab.id === activeTab);

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    let newIndex = index;

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        newIndex = index > 0 ? index - 1 : tabs.length - 1;
        break;
      case 'ArrowRight':
        event.preventDefault();
        newIndex = index < tabs.length - 1 ? index + 1 : 0;
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    while (tabs[newIndex]?.disabled) {
      if (event.key === 'ArrowLeft' || event.key === 'End') {
        newIndex = newIndex > 0 ? newIndex - 1 : tabs.length - 1;
      } else {
        newIndex = newIndex < tabs.length - 1 ? newIndex + 1 : 0;
      }
    }

    handleTabClick(tabs[newIndex].id);
  };

  const loadedTabs = React.useRef<Set<string>>(new Set([activeTab]));
  if (activeTab) {
    loadedTabs.current.add(activeTab);
  }

  return (
    <div className="w-full">
      <div
        role="tablist"
        className={cn(
          'flex',
          variant === 'default' && 'border-b border-gray-200',
          variant === 'pills' && 'gap-2 rounded-lg bg-gray-100 p-1'
        )}
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-controls={`panel-${tab.id}`}
            aria-selected={activeTab === tab.id}
            tabIndex={activeTab === tab.id ? 0 : -1}
            disabled={tab.disabled}
            onClick={() => handleTabClick(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={cn(
              'px-4 py-2 text-sm font-medium transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              variant === 'default' &&
                cn(
                  'border-b-2 border-transparent',
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:border-gray-300 hover:text-gray-900'
                ),
              variant === 'pills' &&
                cn(
                  'rounded-md',
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                )
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {tabs.map((tab) => {
          const shouldRender = !lazyLoad || loadedTabs.current.has(tab.id);

          return (
            <div
              key={tab.id}
              role="tabpanel"
              id={`panel-${tab.id}`}
              aria-labelledby={`tab-${tab.id}`}
              hidden={activeTab !== tab.id}
              className={cn(
                'focus:outline-none',
                activeTab === tab.id ? 'block' : 'hidden'
              )}
              tabIndex={0}
            >
              {shouldRender && tab.content}
            </div>
          );
        })}
      </div>
    </div>
  );
};

Tabs.displayName = 'Tabs';

