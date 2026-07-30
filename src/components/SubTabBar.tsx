import React from 'react';
import { X, Plus, RotateCw, Sparkles } from 'lucide-react';
import { SubTab } from '../types';

interface SubTabBarProps {
  tabs: SubTab[];
  activeTabId: string;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
  onAddTab: () => void;
  onRefresh: () => void;
}

export const SubTabBar: React.FC<SubTabBarProps> = ({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onAddTab,
  onRefresh
}) => {
  return (
    <div className="h-9 bg-slate-100/90 border-b border-slate-200 flex items-center justify-between px-3 select-none">
      {/* Sub tabs list */}
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`group flex items-center gap-2 px-3 py-1 rounded-t-md text-xs font-semibold cursor-pointer transition-all border-t border-x ${
                isActive
                  ? 'bg-white border-slate-200/90 text-indigo-600 font-bold shadow-2xs -mb-px relative z-10'
                  : 'bg-slate-200/40 border-transparent text-slate-500 hover:bg-slate-200/70 hover:text-slate-800'
              }`}
            >
              <span className="flex items-center gap-1.5">
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
                {tab.title}
              </span>
              {tab.closable && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseTab(tab.id);
                  }}
                  className={`p-0.5 rounded hover:bg-slate-200 transition-colors ${
                    isActive ? 'text-slate-400 hover:text-slate-700' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                  title="关闭页签"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}

        <button
          onClick={onAddTab}
          className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors ml-1"
          title="打开新视图页签"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <button
          onClick={onRefresh}
          className="flex items-center gap-1 px-2 py-0.5 rounded-md hover:text-slate-700 hover:bg-slate-200/60 transition-colors text-slate-500 font-medium"
          title="刷新当前视图"
        >
          <RotateCw className="w-3 h-3 text-slate-400" />
          <span className="hidden sm:inline">刷新数据</span>
        </button>
      </div>
    </div>
  );
};

