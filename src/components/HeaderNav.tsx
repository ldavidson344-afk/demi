import React from 'react';
import { 
  FolderTree, 
  LayoutDashboard, 
  FilePlus, 
  DownloadCloud, 
  Sparkles, 
  BookOpen, 
  Settings,
  Bell,
  Search,
  User,
  ChevronDown,
  Command,
  PieChart
} from 'lucide-react';
import { TopNavItem } from '../types';
import { TOP_NAV_ITEMS } from '../data/mockCatalogData';

interface HeaderNavProps {
  activeTopNav: string;
  onSelectTopNav: (id: string) => void;
  onOpenAiAssistant: () => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  PieChart: <PieChart className="w-4 h-4" />,
  FolderTree: <FolderTree className="w-4 h-4" />,
  LayoutDashboard: <LayoutDashboard className="w-4 h-4" />,
  FilePlus: <FilePlus className="w-4 h-4" />,
  DownloadCloud: <DownloadCloud className="w-4 h-4" />,
  Sparkles: <Sparkles className="w-4 h-4" />,
  BookOpen: <BookOpen className="w-4 h-4" />,
  Settings: <Settings className="w-4 h-4" />,
};

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeTopNav,
  onSelectTopNav,
  onOpenAiAssistant
}) => {
  return (
    <header className="h-14 bg-white border-b border-slate-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.03)] flex items-center justify-between px-5 sticky top-0 z-30 select-none gap-4">
      {/* Left section: Brand Logo, Title & Top Nav (一级菜单居左显示) */}
      <div className="flex items-center gap-4 flex-1 min-w-0 overflow-hidden">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3 pr-5 border-r border-slate-200/60 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-sm ring-1 ring-slate-950/10">
            <FolderTree className="w-4 h-4 stroke-[2.2]" />
          </div>
          <h1 className="text-sm font-bold text-slate-900 tracking-tight leading-none whitespace-nowrap">
            数据目录系统
          </h1>
        </div>

        {/* Top Navigation Bar (一级菜单: 资源概览、系统登记、资源采集、目录补全、目录编制、系统管理) */}
        <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
          {TOP_NAV_ITEMS.map((item: TopNavItem) => {
            const isActive = activeTopNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTopNav(item.id)}
                className={`relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 whitespace-nowrap ${
                  isActive
                    ? 'text-slate-900 bg-slate-100/90 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span className={isActive ? 'text-indigo-600' : 'text-slate-400'}>
                  {ICON_MAP[item.iconName] || <FolderTree className="w-4 h-4" />}
                </span>
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-2.5 right-2.5 h-[2px] bg-indigo-600 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right: Quick Tools & User Profile */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Notifications */}
        <button className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-800 relative transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white"></span>
        </button>

        {/* User Info */}
        <div className="flex items-center gap-2 pl-1 cursor-pointer group">
          <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
            A
          </div>
          <div className="hidden xl:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">
              系统管理员
            </span>
            <span className="text-[10px] text-slate-400 leading-none">Admin User</span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
        </div>
      </div>
    </header>
  );
};

