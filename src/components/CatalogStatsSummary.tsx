import React from 'react';
import { Database, Clock, CheckCircle2, FileCode2, Share2, Layers } from 'lucide-react';
import { CatalogResource } from '../types';

interface CatalogStatsSummaryProps {
  resources: CatalogResource[];
}

export const CatalogStatsSummary: React.FC<CatalogStatsSummaryProps> = ({ resources }) => {
  const totalCount = resources.length;
  const pendingCount = resources.filter(r => r.status === '待上报').length;
  const reportedCount = resources.filter(r => r.status === '已上报').length;
  const publishedCount = resources.filter(r => r.status === '已发布').length;
  const totalInfoItems = resources.reduce((acc, r) => acc + (r.infoItems?.length || r.fieldCount || 0), 0);
  const attachedCount = resources.filter(r => r.attachStatus === '已挂接').length;
  const attachRate = totalCount > 0 ? Math.round((attachedCount / totalCount) * 100) : 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-3">
      {/* Stat Card 1 */}
      <div className="bg-white border border-slate-200 rounded-lg py-2 px-3 shadow-2xs flex items-center justify-between">
        <div>
          <div className="text-[11px] font-medium text-slate-500">目录总数</div>
          <div className="text-lg font-bold text-slate-800 font-mono mt-0.5">{totalCount} <span className="text-[11px] text-slate-400 font-normal">个</span></div>
        </div>
        <div className="w-7 h-7 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
          <Database className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Stat Card 2 */}
      <div className="bg-white border border-amber-200/80 rounded-lg py-2 px-3 shadow-2xs flex items-center justify-between bg-amber-50/20">
        <div>
          <div className="text-[11px] font-medium text-amber-700">待上报编目</div>
          <div className="text-lg font-bold text-amber-800 font-mono mt-0.5">{pendingCount} <span className="text-[11px] text-amber-600 font-normal">项</span></div>
        </div>
        <div className="w-7 h-7 rounded-md bg-amber-100/70 text-amber-600 flex items-center justify-center">
          <Clock className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Stat Card 3 */}
      <div className="bg-white border border-blue-200/80 rounded-lg py-2 px-3 shadow-2xs flex items-center justify-between bg-blue-50/20">
        <div>
          <div className="text-[11px] font-medium text-blue-700">已上报审核</div>
          <div className="text-lg font-bold text-blue-800 font-mono mt-0.5">{reportedCount} <span className="text-[11px] text-blue-600 font-normal">项</span></div>
        </div>
        <div className="w-7 h-7 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center">
          <CheckCircle2 className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Stat Card 4 */}
      <div className="bg-white border border-emerald-200/80 rounded-lg py-2 px-3 shadow-2xs flex items-center justify-between bg-emerald-50/20">
        <div>
          <div className="text-[11px] font-medium text-emerald-700">已发布共享</div>
          <div className="text-lg font-bold text-emerald-800 font-mono mt-0.5">{publishedCount} <span className="text-[11px] text-emerald-600 font-normal">项</span></div>
        </div>
        <div className="w-7 h-7 rounded-md bg-emerald-100 text-emerald-600 flex items-center justify-center">
          <Share2 className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Stat Card 5 */}
      <div className="bg-white border border-slate-200 rounded-lg py-2 px-3 shadow-2xs flex items-center justify-between">
        <div>
          <div className="text-[11px] font-medium text-slate-500">已梳理信息项</div>
          <div className="text-lg font-bold text-slate-800 font-mono mt-0.5">{totalInfoItems} <span className="text-[11px] text-slate-400 font-normal">个</span></div>
        </div>
        <div className="w-7 h-7 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <FileCode2 className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Stat Card 6 */}
      <div className="bg-white border border-slate-200 rounded-lg py-2 px-3 shadow-2xs flex items-center justify-between">
        <div>
          <div className="text-[11px] font-medium text-slate-500">数据源挂接率</div>
          <div className="text-lg font-bold text-slate-800 font-mono mt-0.5">{attachRate}%</div>
        </div>
        <div className="w-7 h-7 rounded-md bg-violet-50 text-violet-600 flex items-center justify-center">
          <Layers className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
