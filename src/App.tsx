import React, { useState } from 'react';
import { HeaderNav } from './components/HeaderNav';
import { SubTabBar } from './components/SubTabBar';
import { MainFrameworkView } from './components/MainFrameworkView';
import { SubTab } from './types';
import { INITIAL_SUB_TABS, TOP_NAV_ITEMS } from './data/mockCatalogData';

export default function App() {
  // Navigation & Tabs State
  const [activeTopNav, setActiveTopNav] = useState('dashboard');
  const [subTabs, setSubTabs] = useState<SubTab[]>(INITIAL_SUB_TABS);
  const [activeTabId, setActiveTabId] = useState('tab_dashboard');

  // Notification Toast Message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Top Nav Selection Handler (一级菜单切换时打开或激活对应页签)
  const handleSelectTopNav = (id: string) => {
    setActiveTopNav(id);
    const navItem = TOP_NAV_ITEMS.find(item => item.id === id);
    const label = navItem ? navItem.label : id;

    // 检查是否已有该模块的页签
    const existingTab = subTabs.find(tab => tab.navId === id || tab.id === `tab_${id}`);
    if (existingTab) {
      setActiveTabId(existingTab.id);
      showToast(`已切换至【${existingTab.title}】页签`);
    } else {
      // 创建新页签
      const newTabId = `tab_${id}`;
      const titleName = id === 'dashboard' ? '系统概览' : `${label}管理`;
      const newTab: SubTab = {
        id: newTabId,
        title: titleName,
        closable: id !== 'dashboard',
        navId: id,
      };
      setSubTabs(prev => [...prev, newTab]);
      setActiveTabId(newTabId);
      showToast(`已打开新页签：【${newTab.title}】`);
    }
  };

  // Sub Tab Handlers
  const handleSelectSubTab = (id: string) => {
    setActiveTabId(id);
    const tab = subTabs.find(t => t.id === id);
    if (tab && tab.navId) {
      setActiveTopNav(tab.navId);
    }
  };

  const handleCloseSubTab = (id: string) => {
    const nextTabs = subTabs.filter(t => t.id !== id);
    setSubTabs(nextTabs);
    if (activeTabId === id && nextTabs.length > 0) {
      const activeTab = nextTabs[nextTabs.length - 1];
      setActiveTabId(activeTab.id);
      if (activeTab.navId) {
        setActiveTopNav(activeTab.navId);
      }
    }
  };

  const handleAddSubTab = () => {
    const newTabId = `tab_${Date.now()}`;
    const newTab: SubTab = {
      id: newTabId,
      title: `新UI框架视图_${subTabs.length + 1}`,
      closable: true,
      active: true,
    };
    setSubTabs(prev => [...prev, newTab]);
    setActiveTabId(newTabId);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 antialiased overflow-hidden">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 bg-slate-900 text-white px-4 py-2 rounded-lg shadow-xl text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top duration-200">
          <span className="w-2 h-2 rounded-full bg-blue-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. 顶部 Header 导航栏 (系统名称：目录系统，一级菜单：资源概览、系统登记、资源采集、目录补全、目录编制、系统管理) */}
      <HeaderNav
        activeTopNav={activeTopNav}
        onSelectTopNav={handleSelectTopNav}
        onOpenAiAssistant={() => showToast('已打开 AI 编目助手框架')}
      />

      {/* 2. 顶部 SubTabBar 页签栏 */}
      <SubTabBar
        tabs={subTabs}
        activeTabId={activeTabId}
        onSelectTab={handleSelectSubTab}
        onCloseTab={handleCloseSubTab}
        onAddTab={handleAddSubTab}
        onRefresh={() => showToast('UI 框架视图已刷新')}
      />

      {/* 3. 中间主要视图区域 (移除了左侧二级菜单，直接为自适应中间主要列表视图框架) */}
      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 flex flex-col overflow-hidden bg-slate-100/60">
          <MainFrameworkView 
            activeTopNav={activeTopNav} 
            onSelectTopNav={handleSelectTopNav}
          />
        </main>
      </div>
    </div>
  );
}
