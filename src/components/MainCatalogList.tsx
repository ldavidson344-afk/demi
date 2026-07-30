import React, { useState } from 'react';
import { 
  Search, 
  RotateCcw, 
  Plus, 
  Send, 
  Download, 
  Eye, 
  Edit3, 
  Trash2, 
  CheckSquare, 
  Square, 
  Sparkles,
  ChevronLeft, 
  ChevronRight,
  Filter,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import { CatalogResource } from '../types';

interface MainCatalogListProps {
  resources: CatalogResource[];
  selectedStatusTab: string;
  onSelectStatusTab: (status: string) => void;
  keyword: string;
  onKeywordChange: (val: string) => void;
  sharingFilter: string;
  onSharingFilterChange: (val: string) => void;
  onSearch: () => void;
  onReset: () => void;
  selectedCategoryName?: string | null;
  onViewResource: (resource: CatalogResource) => void;
  onEditResource: (resource: CatalogResource) => void;
  onDeleteResource: (id: string) => void;
  onReportResource: (id: string) => void;
  onBatchReport: (ids: string[]) => void;
  onOpenCreateModal: () => void;
  onExportExcel: () => void;
  onOpenAiAssistant: () => void;
}

export const MainCatalogList: React.FC<MainCatalogListProps> = ({
  resources,
  selectedStatusTab,
  onSelectStatusTab,
  keyword,
  onKeywordChange,
  sharingFilter,
  onSharingFilterChange,
  onSearch,
  onReset,
  selectedCategoryName,
  onViewResource,
  onEditResource,
  onDeleteResource,
  onReportResource,
  onBatchReport,
  onOpenCreateModal,
  onExportExcel,
  onOpenAiAssistant
}) => {
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const STATUS_TABS = ['全部', '待上报', '已上报', '已发布', '草稿'];

  // Handle Select All
  const handleSelectAll = () => {
    if (selectedRowIds.length === resources.length) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(resources.map(r => r.id));
    }
  };

  const handleToggleRow = (id: string) => {
    if (selectedRowIds.includes(id)) {
      setSelectedRowIds(prev => prev.filter(item => item !== id));
    } else {
      setSelectedRowIds(prev => [...prev, id]);
    }
  };

  // Pagination calculation
  const totalItems = resources.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const pageResources = resources.slice(startIndex, startIndex + pageSize);

  // Sharing type badge styles
  const getSharingBadge = (type: string) => {
    switch (type) {
      case '无条件共享':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">无条件共享</span>;
      case '有条件共享':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">有条件共享</span>;
      case '不予共享':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200">不予共享</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600">{type}</span>;
    }
  };

  // Status tag styles
  const getStatusBadge = (status: string) => {
    switch (status) {
      case '待上报':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            待上报
          </span>
        );
      case '已上报':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            已上报
          </span>
        );
      case '已发布':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            已发布
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="flex-1 bg-white border border-slate-200 rounded-lg shadow-2xs flex flex-col overflow-hidden">
      {/* 1. Status Filter Tabs Row (全部 / 待上报 / 已上报...) */}
      <div className="border-b border-slate-200 bg-slate-50/50 px-4 pt-2 flex items-center justify-between">
        <div className="flex items-center gap-6">
          {STATUS_TABS.map((tab) => {
            const isActive = selectedStatusTab === tab;
            return (
              <button
                key={tab}
                onClick={() => onSelectStatusTab(tab)}
                className={`pb-2.5 text-xs font-semibold relative transition-colors ${
                  isActive ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full"></span>
                )}
              </button>
            );
          })}
        </div>

        {selectedCategoryName && (
          <div className="text-xs text-slate-500 font-medium pb-2 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-blue-500" />
            <span>当前筛选分类:</span>
            <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
              {selectedCategoryName}
            </span>
          </div>
        )}
      </div>

      {/* 2. Search & Action Toolbar (查询与操作栏) */}
      <div className="p-4 bg-white border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
        {/* Left Search Inputs */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Keyword Input */}
          <div className="relative min-w-[220px]">
            <input
              type="text"
              placeholder="请输入产品名称 / 资源代码"
              value={keyword}
              onChange={(e) => onKeywordChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSearch()}
              className="w-full bg-white border border-slate-200 rounded-md pl-3 pr-8 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs"
            />
          </div>

          {/* Sharing filter dropdown */}
          <select
            value={sharingFilter}
            onChange={(e) => onSharingFilterChange(e.target.value)}
            className="bg-white border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs"
          >
            <option value="全部类型">共享类型 (全部)</option>
            <option value="无条件共享">无条件共享</option>
            <option value="有条件共享">有条件共享</option>
            <option value="不予共享">不予共享</option>
          </select>

          {/* Query Button (Primary Blue) */}
          <button
            onClick={onSearch}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span>查询</span>
          </button>

          {/* Reset Button */}
          <button
            onClick={onReset}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium shadow-2xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>重置</span>
          </button>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          {/* AI Catalog Button */}
          <button
            onClick={onOpenAiAssistant}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 text-xs font-medium transition-colors shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI 智能梳理</span>
          </button>

          {/* Export Excel */}
          <button
            onClick={onExportExcel}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors shadow-2xs"
            title="导出数据目录文件"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">导出Excel</span>
          </button>

          {/* Create New Catalog */}
          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>新建目录</span>
          </button>
        </div>
      </div>

      {/* Selected Batch Action Banner */}
      {selectedRowIds.length > 0 && (
        <div className="bg-blue-50/80 px-4 py-2 border-b border-blue-100 flex items-center justify-between text-xs text-blue-800">
          <div className="flex items-center gap-2 font-medium">
            <span>已选中 <strong className="font-bold text-blue-900 font-mono">{selectedRowIds.length}</strong> 项目录</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onBatchReport(selectedRowIds);
                setSelectedRowIds([]);
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium text-[11px]"
            >
              <Send className="w-3 h-3" />
              <span>批量提交上报</span>
            </button>
            <button
              onClick={() => setSelectedRowIds([])}
              className="text-slate-500 hover:text-slate-700 underline text-[11px]"
            >
              取消选择
            </button>
          </div>
        </div>
      )}

      {/* 3. Main Data Table View */}
      <div className="flex-1 overflow-x-auto overflow-y-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold sticky top-0 z-10 select-none">
            <tr>
              <th className="py-2.5 px-3 w-10 text-center">
                <button onClick={handleSelectAll} className="p-0.5 hover:text-blue-600">
                  {selectedRowIds.length === resources.length && resources.length > 0 ? (
                    <CheckSquare className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400" />
                  )}
                </button>
              </th>
              <th className="py-2.5 px-3 min-w-[150px]">资源代码</th>
              <th className="py-2.5 px-3 min-w-[200px]">资源名称 / 简述</th>
              <th className="py-2.5 px-3 min-w-[150px]">所属分类</th>
              <th className="py-2.5 px-3 min-w-[130px]">提供部门</th>
              <th className="py-2.5 px-3 min-w-[80px] text-center">信息项</th>
              <th className="py-2.5 px-3 min-w-[100px]">共享类型</th>
              <th className="py-2.5 px-3 min-w-[80px]">更新频率</th>
              <th className="py-2.5 px-3 min-w-[90px] text-center">挂接状态</th>
              <th className="py-2.5 px-3 min-w-[80px] text-center">状态</th>
              <th className="py-2.5 px-3 min-w-[160px] text-right pr-4">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {pageResources.length > 0 ? (
              pageResources.map((item) => {
                const isSelected = selectedRowIds.includes(item.id);
                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isSelected ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-2.5 px-3 text-center">
                      <button onClick={() => handleToggleRow(item.id)} className="p-0.5">
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-300 hover:text-slate-500" />
                        )}
                      </button>
                    </td>

                    {/* Code */}
                    <td className="py-2.5 px-3 font-mono font-medium text-slate-600">
                      {item.code}
                    </td>

                    {/* Name & Description */}
                    <td className="py-2.5 px-3">
                      <div
                        onClick={() => onViewResource(item)}
                        className="font-bold text-slate-800 hover:text-blue-600 cursor-pointer transition-colors leading-snug"
                      >
                        {item.name}
                      </div>
                      <div className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">
                        {item.description}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-2.5 px-3 text-slate-600 font-medium">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] text-slate-600 inline-block max-w-[160px] truncate">
                        {item.category}
                      </span>
                    </td>

                    {/* Department */}
                    <td className="py-2.5 px-3 text-slate-700">
                      {item.deptName}
                    </td>

                    {/* Info Items Count */}
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-blue-700">
                      <span className="bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        {item.infoItems?.length || item.fieldCount} 项
                      </span>
                    </td>

                    {/* Sharing Type */}
                    <td className="py-2.5 px-3">
                      {getSharingBadge(item.sharingType)}
                    </td>

                    {/* Update Frequency */}
                    <td className="py-2.5 px-3 text-slate-600 font-medium">
                      {item.updateFreq}
                    </td>

                    {/* Attach Status */}
                    <td className="py-2.5 px-3 text-center">
                      {item.attachStatus === '已挂接' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                          <Layers className="w-3 h-3 text-emerald-600" />
                          已挂接
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                          待挂接
                        </span>
                      )}
                    </td>

                    {/* Status Tag */}
                    <td className="py-2.5 px-3 text-center">
                      {getStatusBadge(item.status)}
                    </td>

                    {/* Operations */}
                    <td className="py-2.5 px-3 text-right pr-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onViewResource(item)}
                          className="px-2 py-1 rounded text-[11px] font-medium text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-0.5"
                          title="查看详情"
                        >
                          <Eye className="w-3 h-3" />
                          <span>查看</span>
                        </button>

                        <button
                          onClick={() => onEditResource(item)}
                          className="px-2 py-1 rounded text-[11px] font-medium text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center gap-0.5"
                          title="信息项梳理编目"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>梳理</span>
                        </button>

                        {item.status === '待上报' && (
                          <button
                            onClick={() => onReportResource(item.id)}
                            className="px-2 py-1 rounded text-[11px] font-medium text-emerald-600 hover:bg-emerald-50 transition-colors flex items-center gap-0.5"
                            title="提交审核上报"
                          >
                            <Send className="w-3 h-3" />
                            <span>上报</span>
                          </button>
                        )}

                        <button
                          onClick={() => onDeleteResource(item.id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="删除目录"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={11} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Search className="w-8 h-8 text-slate-300" />
                    <p className="text-sm font-medium text-slate-500">暂无符合筛选条件的信息资源目录</p>
                    <p className="text-xs text-slate-400">请尝试更换关键词或在左侧重选分类节点</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 4. Pagination Bar */}
      <div className="p-3 bg-slate-50/70 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 select-none">
        <div>
          显示第 <span className="font-semibold text-slate-800">{totalItems > 0 ? startIndex + 1 : 0}</span> 到{' '}
          <span className="font-semibold text-slate-800">{Math.min(startIndex + pageSize, totalItems)}</span> 条，共{' '}
          <span className="font-bold text-blue-700 font-mono">{totalItems}</span> 条记录
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <span className="px-2 font-medium">
            <strong className="text-blue-700 font-mono">{currentPage}</strong> / {totalPages} 页
          </span>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
