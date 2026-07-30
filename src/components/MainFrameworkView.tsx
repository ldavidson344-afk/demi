import React, { useState } from 'react';
import { DashboardOverviewView } from './DashboardOverviewView';
import { SystemRegistrationView } from './SystemRegistrationView';
import { ResourceCollectView } from './ResourceCollectView';
import { ResourceOverviewView } from './ResourceOverviewView';
import { CatalogCompletionView } from './CatalogCompletionView';
import { CatalogAuthoringView } from './CatalogAuthoringView';
import { 
  PieChart,
  LayoutDashboard, 
  FilePlus, 
  DownloadCloud, 
  Sparkles, 
  BookOpen, 
  Settings,
  Plus,
  RotateCw,
  SlidersHorizontal,
  Layers,
  Search,
  CheckCircle2,
  Clock,
  Database,
  Tag,
  ShieldAlert,
  ChevronRight,
  FileText,
  Code,
  ArrowUpRight,
  Filter,
  Info,
  Check,
  Zap,
  HardDrive
} from 'lucide-react';

interface MainFrameworkViewProps {
  activeTopNav: string;
  onSelectTopNav?: (id: string) => void;
}

interface CatalogRecord {
  id: string;
  name: string;
  code: string;
  type: 'database' | 'api' | 'file' | 'table';
  systemName: string;
  deptName: string;
  status: 'published' | 'draft' | 'pending';
  completionRate: number;
  securityLevel: 'L1' | 'L2' | 'L3';
  fieldCount: number;
  updatedAt: string;
}

const MOCK_CATALOG_RECORDS: CatalogRecord[] = [
  {
    id: 'cat-001',
    name: '企业法人基本登记信息',
    code: 'GOV_DATA_ENT_REGISTER_2026',
    type: 'database',
    systemName: '综合政务审批系统',
    deptName: '市场监督管理局',
    status: 'published',
    completionRate: 100,
    securityLevel: 'L2',
    fieldCount: 42,
    updatedAt: '10分钟前'
  },
  {
    id: 'cat-002',
    name: '实时纳税申报与发票明细 API',
    code: 'API_TAX_DECLARE_REALTIME',
    type: 'api',
    systemName: '电子税务服务平台',
    deptName: '国家税务总局分支局',
    status: 'pending',
    completionRate: 78,
    securityLevel: 'L3',
    fieldCount: 18,
    updatedAt: '35分钟前'
  },
  {
    id: 'cat-003',
    name: '高新技术企业认定资质名录',
    code: 'TBL_HI_TECH_QUALIFICATION',
    type: 'table',
    systemName: '科技创新管理系统',
    deptName: '科学技术局',
    status: 'published',
    completionRate: 95,
    securityLevel: 'L1',
    fieldCount: 26,
    updatedAt: '2小时前'
  },
  {
    id: 'cat-004',
    name: '城市交通一卡通刷卡流水数据集',
    code: 'FILE_CARD_TRANSACTION_LOG',
    type: 'file',
    systemName: '智慧交通调度中心平台',
    deptName: '交通运输局',
    status: 'draft',
    completionRate: 60,
    securityLevel: 'L2',
    fieldCount: 14,
    updatedAt: '5小时前'
  },
  {
    id: 'cat-005',
    name: '不动产登记与房屋产权检索数据库',
    code: 'DB_REAL_ESTATE_OWNERSHIP',
    type: 'database',
    systemName: '不动产登记综合平台',
    deptName: '自然资源与规划局',
    status: 'pending',
    completionRate: 85,
    securityLevel: 'L3',
    fieldCount: 64,
    updatedAt: '1天前'
  }
];

const MODULE_META: Record<string, { title: string; subtitle: string; icon: React.ReactNode; tag: string }> = {
  dashboard: {
    title: '系统概览',
    subtitle: '数据目录治理全景驾驶舱与综合指标治理指挥中心',
    icon: <PieChart className="w-5 h-5 text-indigo-600" />,
    tag: '治理指挥中心'
  },
  overview: {
    title: '资源总览',
    subtitle: '数据资源系统、数据库与表结构三级树全景穿透与字典总览',
    icon: <LayoutDashboard className="w-5 h-5 text-indigo-600" />,
    tag: '系统-库-表树'
  },
  system_reg: {
    title: '系统登记',
    subtitle: '业务系统接入管理、数据库元数据自动探测与注册',
    icon: <FilePlus className="w-5 h-5 text-indigo-600" />,
    tag: '元数据注册'
  },
  resource_collect: {
    title: '资源采集',
    subtitle: '多源元数据采集任务调度、同步日志与采集规则设置',
    icon: <DownloadCloud className="w-5 h-5 text-indigo-600" />,
    tag: '自动采集'
  },
  catalog_completion: {
    title: '目录补全',
    subtitle: '未编目资源自动识别、属性智能补充与合规校验',
    icon: <Sparkles className="w-5 h-5 text-indigo-600" />,
    tag: '智能推导'
  },
  catalog_authoring: {
    title: '目录编制',
    subtitle: '信息资源目录标准编制、分类挂载、信息项定义与发布管理',
    icon: <BookOpen className="w-5 h-5 text-indigo-600" />,
    tag: '编目管理'
  },
  system_mgmt: {
    title: '系统管理',
    subtitle: '编目规范配置、分类字典管理、用户权限与审计日志',
    icon: <Settings className="w-5 h-5 text-indigo-600" />,
    tag: '基础设置'
  }
};

export const MainFrameworkView: React.FC<MainFrameworkViewProps> = ({ activeTopNav, onSelectTopNav }) => {
  if (activeTopNav === 'dashboard') {
    return <DashboardOverviewView onNavigateNav={onSelectTopNav} />;
  }
  if (activeTopNav === 'overview') {
    return <ResourceOverviewView />;
  }
  if (activeTopNav === 'system_reg') {
    return <SystemRegistrationView />;
  }
  if (activeTopNav === 'resource_collect') {
    return <ResourceCollectView />;
  }
  if (activeTopNav === 'catalog_completion') {
    return <CatalogCompletionView />;
  }
  if (activeTopNav === 'catalog_authoring') {
    return <CatalogAuthoringView />;
  }

  const meta = MODULE_META[activeTopNav] || MODULE_META['catalog_authoring'];
  
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'published' | 'pending' | 'draft'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<CatalogRecord | null>(MOCK_CATALOG_RECORDS[0]);
  const [aiCompleting, setAiCompleting] = useState(false);
  const [completedNotification, setCompletedNotification] = useState<string | null>(null);

  const filteredRecords = MOCK_CATALOG_RECORDS.filter(rec => {
    if (selectedFilter !== 'all' && rec.status !== selectedFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        rec.name.toLowerCase().includes(q) ||
        rec.code.toLowerCase().includes(q) ||
        rec.deptName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleRunAiCompletion = () => {
    setAiCompleting(true);
    setTimeout(() => {
      setAiCompleting(false);
      setCompletedNotification('AI 智能关联补全完成！已自动为 3 项目录推导中文注释与密级标准。');
      setTimeout(() => setCompletedNotification(null), 4000);
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col gap-4 p-5 bg-[#f8fafc] overflow-y-auto select-none">
      {/* 模块 Header 框架 (Design MD Standard Header Card) */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-indigo-50/80 border border-indigo-100 flex items-center justify-center shadow-2xs">
            {meta.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 tracking-tight leading-none">
                {meta.title}
              </h2>
              <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100/80 font-mono">
                {meta.tag}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-normal">{meta.subtitle}</p>
          </div>
        </div>

        {/* 顶部工具栏按钮组 */}
        <div className="flex items-center gap-2">
          <button 
            onClick={handleRunAiCompletion}
            disabled={aiCompleting}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all shadow-xs active:scale-[0.98] disabled:opacity-70"
          >
            <Sparkles className={`w-3.5 h-3.5 ${aiCompleting ? 'animate-spin' : ''}`} />
            <span>{aiCompleting ? 'AI 分析补全中...' : '一键 AI 智能补全'}</span>
          </button>
          
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span>高阶筛选</span>
          </button>
          <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-medium text-white transition-colors shadow-2xs">
            <Plus className="w-3.5 h-3.5" />
            <span>新增{meta.title}资源</span>
          </button>
        </div>
      </div>

      {/* Complete Notification Alert */}
      {completedNotification && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 px-4 text-xs font-medium text-emerald-800 flex items-center justify-between animate-in fade-in slide-in-from-top-1 duration-150 shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{completedNotification}</span>
          </div>
          <button onClick={() => setCompletedNotification(null)} className="text-emerald-500 hover:text-emerald-700">
            关闭
          </button>
        </div>
      )}

      {/* 4 统计概览指标卡片组 (Design MD Stat Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            title: '总编目数据源', 
            value: '128', 
            unit: '个系统', 
            trend: '+12%', 
            sub: '已覆盖 94% 核心业务部门', 
            color: 'text-slate-900',
            icon: <HardDrive className="w-4 h-4 text-slate-400" />
          },
          { 
            title: '信息项发布总数', 
            value: '3,842', 
            unit: '字段', 
            trend: '+240 项本周', 
            sub: '满足国家政务数据共享标准', 
            color: 'text-indigo-600',
            icon: <Database className="w-4 h-4 text-indigo-500" />
          },
          { 
            title: 'AI 自动补全率', 
            value: '91.5%', 
            unit: '达标', 
            trend: '符合率 99.2%', 
            sub: '字段中文名与密级推荐已开启', 
            color: 'text-emerald-600',
            icon: <Zap className="w-4 h-4 text-emerald-500" />
          },
          { 
            title: '未编目合规检测', 
            value: '4', 
            unit: '项待审核', 
            trend: '低风险', 
            sub: '需要分配责任部门归口梳理', 
            color: 'text-amber-600',
            icon: <Clock className="w-4 h-4 text-amber-500" />
          }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">{stat.title}</span>
              <div className="p-1 rounded bg-slate-100/80">{stat.icon}</div>
            </div>
            <div className="my-2 flex items-baseline gap-1.5">
              <span className={`text-2xl font-bold tracking-tight ${stat.color}`}>
                {stat.value}
              </span>
              <span className="text-xs text-slate-400 font-normal">{stat.unit}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] border-t border-slate-100 pt-2 mt-1">
              <span className="text-slate-500 truncate">{stat.sub}</span>
              <span className="font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded font-mono">
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 主数据列表与右侧详情面板 布局区 */}
      <div className="grid grid-cols-12 gap-4 flex-1 items-start">
        {/* 左侧主目录列表卡片 (Design MD Data Grid Layout) */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col min-h-[460px]">
          {/* Header & Filter Controls */}
          <div className="p-4 border-b border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setSelectedFilter('all')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  selectedFilter === 'all' 
                    ? 'bg-slate-900 text-white shadow-2xs' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                全部资源 ({MOCK_CATALOG_RECORDS.length})
              </button>
              <button 
                onClick={() => setSelectedFilter('published')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  selectedFilter === 'published' 
                    ? 'bg-emerald-600 text-white shadow-2xs' 
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60 hover:bg-emerald-100'
                }`}
              >
                已发布 (2)
              </button>
              <button 
                onClick={() => setSelectedFilter('pending')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  selectedFilter === 'pending' 
                    ? 'bg-indigo-600 text-white shadow-2xs' 
                    : 'bg-indigo-50 text-indigo-700 border border-indigo-200/60 hover:bg-indigo-100'
                }`}
              >
                编目补全中 (2)
              </button>
            </div>

            {/* Search Input Box */}
            <div className="relative w-full sm:w-60">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input 
                type="text"
                placeholder="搜索资源名称或编码..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/90 text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-500 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Catalog Resource Table / Cards List */}
          <div className="divide-y divide-slate-100 flex-1 overflow-y-auto max-h-[500px]">
            {filteredRecords.map((record) => {
              const isSelected = selectedRecord?.id === record.id;
              return (
                <div 
                  key={record.id}
                  onClick={() => setSelectedRecord(record)}
                  className={`p-4 flex items-center justify-between cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-indigo-50/50 border-l-4 border-l-indigo-600 pl-3.5' 
                      : 'hover:bg-slate-50/80 border-l-4 border-l-transparent'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg mt-0.5 border ${
                      record.type === 'database' ? 'bg-blue-50 border-blue-100 text-blue-600' :
                      record.type === 'api' ? 'bg-purple-50 border-purple-100 text-purple-600' :
                      record.type === 'table' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                      'bg-amber-50 border-amber-100 text-amber-600'
                    }`}>
                      {record.type === 'database' && <Database className="w-4 h-4" />}
                      {record.type === 'api' && <Code className="w-4 h-4" />}
                      {record.type === 'table' && <Layers className="w-4 h-4" />}
                      {record.type === 'file' && <FileText className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-900 tracking-tight">
                          {record.name}
                        </h4>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded">
                          {record.securityLevel}
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-slate-500 mt-0.5">{record.code}</p>
                      
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1 text-slate-600 font-medium">
                          {record.deptName}
                        </span>
                        <span>•</span>
                        <span>{record.systemName}</span>
                        <span>•</span>
                        <span>{record.fieldCount} 个元数据信息项</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div className="hidden sm:flex flex-col items-end">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-400">完成度</span>
                        <span className="text-xs font-bold font-mono text-slate-700">
                          {record.completionRate}%
                        </span>
                      </div>
                      <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                        <div 
                          className={`h-full rounded-full ${
                            record.completionRate === 100 ? 'bg-emerald-500' : 'bg-indigo-500'
                          }`}
                          style={{ width: `${record.completionRate}%` }}
                        />
                      </div>
                    </div>

                    <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isSelected ? 'translate-x-0.5 text-indigo-600' : ''}`} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Table Footer Summary */}
          <div className="p-3 px-4 bg-slate-50/80 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
            <span>当前显示 {filteredRecords.length} / {MOCK_CATALOG_RECORDS.length} 条已登记资源</span>
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> 遵循 GB/T 21062 政务目录编制规范
            </div>
          </div>
        </div>

        {/* 右侧选定资源属性与 AI 补全检视面板 (Design MD Inspector Card) */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-xl border border-slate-200/90 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col gap-4">
          {selectedRecord ? (
            <>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    目录属性与元数据检视
                  </h3>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  {selectedRecord.status === 'published' ? '已通过合规审核' : '编目推导中'}
                </span>
              </div>

              {/* Resource Profile Header */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/70">
                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  {selectedRecord.name}
                </h4>
                <p className="text-xs font-mono text-slate-500 mt-1">{selectedRecord.code}</p>
              </div>

              {/* Detail Property Rows */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">数源接入单位</span>
                  <span className="font-medium text-slate-800">{selectedRecord.deptName}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">关联业务系统</span>
                  <span className="font-medium text-slate-800">{selectedRecord.systemName}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">共享安全级别</span>
                  <span className="font-semibold text-indigo-600 font-mono bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-100">
                    {selectedRecord.securityLevel} (受控共享)
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">信息项数量</span>
                  <span className="font-semibold text-slate-800 font-mono">{selectedRecord.fieldCount} 列</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400">最近探针探测</span>
                  <span className="text-slate-500 font-mono">{selectedRecord.updatedAt}</span>
                </div>
              </div>

              {/* AI Completion Suggestions Widget */}
              <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-50/70 to-slate-50 border border-indigo-100 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="text-xs font-bold text-indigo-900">AI 智能属性推导建议</span>
                  </div>
                  <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-1.5 py-0.2 rounded">
                    建议就绪
                  </span>
                </div>
                
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  系统已通过 AI 结合行业分类字典推导，建议为该资源的「统一社会信用代码」关联国家标准数据类型 (GB/T 32100-2015)。
                </p>

                <div className="flex items-center gap-2 mt-1">
                  <button className="flex-1 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors shadow-2xs">
                    采用 AI 建议
                  </button>
                  <button className="px-3 py-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-medium transition-colors">
                    忽略
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button className="flex-1 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1 shadow-2xs">
                  <span>进入详细编制界面</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center text-slate-400">
              <Info className="w-8 h-8 mb-2 stroke-[1.5]" />
              <p className="text-xs">请在左侧选择资源进行属性检视</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
