import React, { useState } from 'react';
import { 
  PieChart, 
  BarChart3, 
  TrendingUp, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Database, 
  FilePlus, 
  DownloadCloud, 
  BookOpen, 
  FolderTree, 
  Settings, 
  Search, 
  Users, 
  Building2, 
  Layers, 
  Zap, 
  RefreshCw, 
  SlidersHorizontal, 
  ExternalLink, 
  Shield, 
  Tag, 
  Activity, 
  ChevronRight,
  HardDrive,
  FileText,
  AlertTriangle,
  ArrowUpRight,
  Check
} from 'lucide-react';

interface DashboardOverviewViewProps {
  onNavigateNav?: (navId: string) => void;
}

export const DashboardOverviewView: React.FC<DashboardOverviewViewProps> = ({ onNavigateNav }) => {
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'year'>('week');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshSuccess, setRefreshSuccess] = useState<string | null>(null);

  const handleRefreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setRefreshSuccess('全量数据总览与元数据探针已刷新并完成健康度校验');
      setTimeout(() => setRefreshSuccess(null), 3000);
    }, 1000);
  };

  const handleNavigate = (navId: string) => {
    if (onNavigateNav) {
      onNavigateNav(navId);
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-4 p-5 bg-[#f8fafc] overflow-y-auto select-none">
      
      {/* 1. Header Banner Zone */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-xl p-5 text-white shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Decorative Background Waves */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-40 -top-10 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-mono font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              全量元数据治理控制塔
            </span>
            <span className="text-slate-400 text-xs">|</span>
            <span className="text-slate-300 text-xs font-mono">GB/T 21062-2026 政务信息目录规范</span>
          </div>
          <h1 className="text-lg md:text-xl font-bold tracking-tight text-white flex items-center gap-2">
            数据目录治理概览驾驶舱
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl font-normal leading-relaxed">
            实时管控全域业务系统、数据库与表元数据，贯通「系统登记 → 自动采集 → AI智能补全 → 目录编制 → 资源总览」全流程。
          </p>
        </div>

        {/* Quick Action Group */}
        <div className="flex items-center gap-2.5 z-10 shrink-0">
          <div className="bg-slate-800/80 border border-slate-700/80 p-1 rounded-lg flex items-center text-xs font-medium">
            {(['today', 'week', 'month', 'year'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTimeRange(t)}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  timeRange === t 
                    ? 'bg-indigo-600 text-white font-semibold shadow-xs' 
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {t === 'today' ? '今日' : t === 'week' ? '本周' : t === 'month' ? '本月' : '本年'}
              </button>
            ))}
          </div>

          <button
            onClick={handleRefreshData}
            disabled={isRefreshing}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors"
            title="刷新概览指标"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Toast Alert */}
      {refreshSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 px-4 text-xs font-medium text-emerald-800 flex items-center justify-between animate-in fade-in slide-in-from-top-1 duration-150 shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{refreshSuccess}</span>
          </div>
        </div>
      )}

      {/* 2. Top 5 Key Performance Indicators Cards (KPI Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        
        {/* KPI 1 */}
        <div 
          onClick={() => handleNavigate('system_reg')}
          className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">已纳管业务系统</span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <FilePlus className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold tracking-tight text-slate-900 font-mono">128</span>
              <span className="text-xs text-slate-500">个系统</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px]">
              <span className="text-emerald-600 font-bold font-mono">+3 本周</span>
              <span className="text-slate-400">• 覆盖率 94.2%</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>核心政务系统全接入</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 group-hover:text-blue-600 transition-all" />
          </div>
        </div>

        {/* KPI 2 */}
        <div 
          onClick={() => handleNavigate('resource_collect')}
          className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">探针数据库/数据表</span>
            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold tracking-tight text-slate-900 font-mono">324</span>
              <span className="text-xs text-slate-500">库 / 1,842 表</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px]">
              <span className="text-purple-600 font-bold font-mono">42,850 项</span>
              <span className="text-slate-400">• 物理字段元数据</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>99.1% 探针健康在线</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 group-hover:text-purple-600 transition-all" />
          </div>
        </div>

        {/* KPI 3 */}
        <div 
          onClick={() => handleNavigate('catalog_completion')}
          className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">AI 智能补全达标率</span>
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold tracking-tight text-indigo-600 font-mono">91.5%</span>
              <span className="text-xs text-slate-500">补全率</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px]">
              <span className="text-emerald-600 font-bold font-mono">99.2%</span>
              <span className="text-slate-400">• 规范推导准确率</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>待人工审核 124 项</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 group-hover:text-indigo-600 transition-all" />
          </div>
        </div>

        {/* KPI 4 */}
        <div 
          onClick={() => handleNavigate('catalog_authoring')}
          className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">标准编制目录总数</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold tracking-tight text-slate-900 font-mono">1,280</span>
              <span className="text-xs text-slate-500">条目录</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px]">
              <span className="text-emerald-600 font-bold font-mono">1,028 条已发布</span>
              <span className="text-slate-400">• 15,420 信息项</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>国家规范合格标准</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 group-hover:text-emerald-600 transition-all" />
          </div>
        </div>

        {/* KPI 5 */}
        <div 
          onClick={() => handleNavigate('overview')}
          className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">数据共享与开放成效</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <FolderTree className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold tracking-tight text-slate-900 font-mono">93.0%</span>
              <span className="text-xs text-slate-500">共享率</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px]">
              <span className="text-blue-600 font-bold font-mono">42% 无条件</span>
              <span className="text-slate-400">• 51% 有条件</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>穿透检索 3 级全景树</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 group-hover:text-amber-600 transition-all" />
          </div>
        </div>

      </div>

      {/* 3. Cataloging Pipeline Navigation Banner (治理闭环链路) */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold text-slate-900 tracking-tight">
              数据目录治理全生命周期能力闭环流水线
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Click step to enter submodule</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative">
          {[
            {
              step: '01',
              title: '系统登记',
              desc: '纳管业务系统与元数据探针注册',
              navId: 'system_reg',
              badge: '128 系统',
              icon: <FilePlus className="w-4 h-4 text-blue-600" />,
              bg: 'bg-blue-50/60 hover:bg-blue-50 border-blue-200/80',
              accent: 'text-blue-700'
            },
            {
              step: '02',
              title: '资源采集',
              desc: '多源元数据采集与库表结构探针',
              navId: 'resource_collect',
              badge: '324 数据库',
              icon: <DownloadCloud className="w-4 h-4 text-purple-600" />,
              bg: 'bg-purple-50/60 hover:bg-purple-50 border-purple-200/80',
              accent: 'text-purple-700'
            },
            {
              step: '03',
              title: '目录补全',
              desc: '未编目智能识别与 AI 缺失补充',
              navId: 'catalog_completion',
              badge: 'AI 智能推导',
              icon: <Sparkles className="w-4 h-4 text-indigo-600" />,
              bg: 'bg-indigo-50/60 hover:bg-indigo-50 border-indigo-200/80',
              accent: 'text-indigo-700'
            },
            {
              step: '04',
              title: '目录编制',
              desc: 'GB/T 标准目录映射与信息项发布',
              navId: 'catalog_authoring',
              badge: '1,280 目录',
              icon: <BookOpen className="w-4 h-4 text-emerald-600" />,
              bg: 'bg-emerald-50/60 hover:bg-emerald-50 border-emerald-200/80',
              accent: 'text-emerald-700'
            },
            {
              step: '05',
              title: '资源总览',
              desc: '系统-库-表-字段三级树穿透全景',
              navId: 'overview',
              badge: '全景穿透',
              icon: <FolderTree className="w-4 h-4 text-amber-600" />,
              bg: 'bg-amber-50/60 hover:bg-amber-50 border-amber-200/80',
              accent: 'text-amber-700'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleNavigate(item.navId)}
              className={`p-3.5 rounded-xl border ${item.bg} transition-all cursor-pointer group relative flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <div className="p-1.5 rounded-lg bg-white shadow-2xs">
                    {item.icon}
                  </div>
                  <span className="font-mono font-extrabold text-xs text-slate-400">{item.step}</span>
                </div>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded bg-white/90 border border-slate-200/60 ${item.accent}`}>
                  {item.badge}
                </span>
              </div>

              <div>
                <h4 className={`text-xs font-bold ${item.accent} group-hover:underline flex items-center gap-1`}>
                  <span>{item.title}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                  {item.desc}
                </p>
              </div>

              <div className="mt-3 text-[10px] font-semibold text-slate-400 group-hover:text-slate-800 flex items-center gap-1">
                <span>进入模块</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Analytics & Charts Grid Area */}
      <div className="space-y-4">
        
        {/* Funnel & Category Distribution */}
        <div className="space-y-4">
          
          {/* Chart Card 1: Catalogue Status Funnel & Processing Progress */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-bold text-slate-900 tracking-tight">
                  目录编制全流程状态漏斗与完成分布
                </h3>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                总计 1,280 条全量业务目录
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {[
                { label: '已正式发布共享', count: 1028, pct: '80.3%', color: 'bg-emerald-500', bgText: 'text-emerald-700 bg-emerald-50' },
                { label: '编目完成待合规审核', count: 86, pct: '6.7%', color: 'bg-blue-500', bgText: 'text-blue-700 bg-blue-50' },
                { label: '待补全扩展要素/数据项', count: 124, pct: '9.7%', color: 'bg-indigo-500', bgText: 'text-indigo-700 bg-indigo-50' },
                { label: '源数据表变更需重新校准', count: 39, pct: '3.0%', color: 'bg-amber-500', bgText: 'text-amber-700 bg-amber-50' },
                { label: '挂接接口/库表探针异常', count: 3, pct: '0.2%', color: 'bg-rose-500', bgText: 'text-rose-700 bg-rose-50' },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${item.color}`}></span>
                      <span>{item.label}</span>
                    </span>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="font-bold text-slate-900">{item.count} 条</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${item.bgText}`}>{item.pct}</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${item.color} transition-all duration-500`} style={{ width: item.pct }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chart Card 2: Subject Domain & Industry Classification */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Subject Domains */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-blue-600" />
                  <h3 className="text-xs font-bold text-slate-900">核心主题分类目录占比</h3>
                </div>
              </div>

              <div className="mt-3 space-y-2.5 text-xs">
                {[
                  { name: '法人单位主题', count: '448 条', ratio: 35, color: 'bg-blue-500' },
                  { name: '全民人口主题', count: '358 条', ratio: 28, color: 'bg-indigo-500' },
                  { name: '价格监管与反垄断主题', count: '230 条', ratio: 18, color: 'bg-purple-500' },
                  { name: '自然资源与规划主题', count: '154 条', ratio: 12, color: 'bg-emerald-500' },
                  { name: '宏观经济与公共服务', count: '90 条', ratio: 7, color: 'bg-amber-500' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-sm ${item.color}`}></span>
                      <span className="text-slate-700 font-medium">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-slate-500">{item.count}</span>
                      <span className="font-bold text-slate-800">{item.ratio}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sharing Attributes & Security Matrix */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs font-bold text-slate-900">共享属性与数据分级管控</h3>
                </div>
              </div>

              <div className="mt-3 space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1 font-medium text-slate-600">
                    <span>共享类型分布</span>
                    <span className="font-mono">42% 无条件 | 51% 有条件 | 7% 不予共享</span>
                  </div>
                  <div className="flex h-2.5 rounded-full overflow-hidden bg-slate-100">
                    <div className="bg-emerald-500 h-full" style={{ width: '42%' }} title="无条件共享 42%"></div>
                    <div className="bg-blue-500 h-full" style={{ width: '51%' }} title="有条件共享 51%"></div>
                    <div className="bg-rose-500 h-full" style={{ width: '7%' }} title="不予共享 7%"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1 font-medium text-slate-600">
                    <span>数据密级分布 (L1~L4)</span>
                    <span className="font-mono">L1公开 25% | L2内部 55% | L3受控 18%</span>
                  </div>
                  <div className="flex h-2.5 rounded-full overflow-hidden bg-slate-100">
                    <div className="bg-slate-400 h-full" style={{ width: '25%' }}></div>
                    <div className="bg-indigo-500 h-full" style={{ width: '55%' }}></div>
                    <div className="bg-amber-500 h-full" style={{ width: '18%' }}></div>
                    <div className="bg-rose-600 h-full" style={{ width: '2%' }}></div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                  <span>高敏字段自动脱敏率: <strong className="text-emerald-600 font-mono">100%</strong></span>
                  <span className="text-indigo-600 hover:underline cursor-pointer" onClick={() => handleNavigate('catalog_authoring')}>
                    规则设置 →
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Leaderboard: Dept Resource Contribution */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-purple-600" />
                <h3 className="text-xs font-bold text-slate-900">核心数源责任单位编目贡献与规范完成度</h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Top 5 部门榜单</span>
            </div>

            <div className="mt-3 divide-y divide-slate-100 text-xs">
              {[
                { name: '市市场监督管理局', sysCount: '12 系统', catalogCount: '420 条目录', completionRate: '98.5%', tag: '优等' },
                { name: '市卫生健康委员会', sysCount: '8 系统', catalogCount: '280 条目录', completionRate: '96.2%', tag: '优等' },
                { name: '市交通运输局', sysCount: '6 系统', catalogCount: '210 条目录', completionRate: '94.0%', tag: '良好' },
                { name: '市生态环境局', sysCount: '5 系统', catalogCount: '180 条目录', completionRate: '92.8%', tag: '良好' },
                { name: '市发展和改革委员会', sysCount: '4 系统', catalogCount: '150 条目录', completionRate: '90.5%', tag: '良好' },
              ].map((dept, i) => (
                <div key={i} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded bg-slate-100 text-slate-600 font-bold font-mono text-[11px] flex items-center justify-center shrink-0">
                      0{i + 1}
                    </span>
                    <div>
                      <span className="font-bold text-slate-800">{dept.name}</span>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {dept.sysCount} • {dept.catalogCount}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-mono font-bold text-emerald-600">{dept.completionRate}</div>
                      <div className="text-[10px] text-slate-400">规范达标率</div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100">
                      {dept.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
