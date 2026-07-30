import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight, Wand2, ShieldAlert } from 'lucide-react';
import { CatalogResource, InformationItem } from '../types';

interface AiCatalogAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyAiCatalog: (resource: CatalogResource) => void;
}

export const AiCatalogAssistantModal: React.FC<AiCatalogAssistantModalProps> = ({
  isOpen,
  onClose,
  onApplyAiCatalog
}) => {
  if (!isOpen) return null;

  const [inputPrompt, setInputPrompt] = useState(
    '帮我梳理并编目一个【社会保障卡申领与发放信息集】，提供方是市人力资源和社会保障局。包含字段：社保卡号、持卡人姓名、公民身份证号码、联系手机、发卡日期、卡状态。'
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<CatalogResource | null>(null);

  const handleRunAiAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    setTimeout(() => {
      setIsAnalyzing(false);
      const mockResult: CatalogResource = {
        id: `cat-ai-${Date.now()}`,
        code: `RES-330100-2026-888`,
        name: '全市社会保障卡申领与发放信息集',
        category: '全民人口主题 / 人力资源和社会保障',
        deptName: '市人力资源和社会保障局',
        fieldCount: 6,
        sharingType: '有条件共享',
        updateFreq: '实时',
        status: '待上报',
        dataFormat: 'RDBMS',
        description: '自动解析自非结构化文本：记载辖区内参保人员社保卡激活、发卡日期、联系方式及证件编号的民生服务数据集。',
        createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
        updatedTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
        dataSource: 'PostgreSQL - db_hrss.tb_social_card',
        attachStatus: '已挂接',
        infoItems: [
          { id: 'f-ai-1', fieldName: 'card_no', fieldLabel: '社保卡号', dataType: 'varchar', length: '20', isPrimaryKey: true, isRequired: true, maskRule: '无', sharingCondition: '政务内部共享', description: '社保实体卡面编号' },
          { id: 'f-ai-2', fieldName: 'user_name', fieldLabel: '持卡人姓名', dataType: 'varchar', length: '50', isPrimaryKey: false, isRequired: true, maskRule: '姓名脱敏', sharingCondition: '有条件共享', description: '持卡人法定真实姓名' },
          { id: 'f-ai-3', fieldName: 'id_card', fieldLabel: '公民身份证号码', dataType: 'varchar', length: '18', isPrimaryKey: false, isRequired: true, maskRule: '身份证脱敏', sharingCondition: '严格受控共享', description: '18位二代居民身份证' },
          { id: 'f-ai-4', fieldName: 'phone', fieldLabel: '联系手机', dataType: 'varchar', length: '11', isPrimaryKey: false, isRequired: false, maskRule: '手机号脱敏', sharingCondition: '有条件共享', description: '绑定短信通知手机' },
          { id: 'f-ai-5', fieldName: 'issue_date', fieldLabel: '发卡日期', dataType: 'date', length: '10', isPrimaryKey: false, isRequired: true, maskRule: '无', sharingCondition: '政务内部共享', description: '首次领卡核发日期' },
          { id: 'f-ai-6', fieldName: 'card_status', fieldLabel: '卡状态', dataType: 'varchar', length: '10', isPrimaryKey: false, isRequired: true, maskRule: '无', sharingCondition: '政务内部共享', description: '正常/挂失/注销' },
        ],
      };
      setAnalysisResult(mockResult);
    }, 1200);
  };

  const handleApply = () => {
    if (analysisResult) {
      onApplyAiCatalog(analysisResult);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"></div>

      <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200 z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/80 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">AI 智能信息资源自动编目</h3>
              <p className="text-[11px] text-indigo-200">输入任意业务描述或数据描述，AI 将自动解析分类与 Schema 规范</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5 flex items-center justify-between">
              <span>请输入业务数据描述 / 表结构描述文本：</span>
              <span className="text-indigo-600 font-normal text-[11px]">支持自然语言、SQL DDL或字典描述</span>
            </label>
            <textarea
              rows={4}
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800 font-medium focus:outline-none focus:border-indigo-500 focus:bg-white"
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleRunAiAnalysis}
              disabled={isAnalyzing}
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all shadow-xs flex items-center gap-2"
            >
              {isAnalyzing ? (
                <span className="animate-spin text-white">🌀</span>
              ) : (
                <Wand2 className="w-4 h-4" />
              )}
              <span>{isAnalyzing ? '正在智能解析与标准匹配...' : '一键智能解析编目'}</span>
            </button>
          </div>

          {/* Analysis Output Result Preview */}
          {analysisResult && (
            <div className="bg-indigo-50/40 border border-indigo-200/80 rounded-xl p-4 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-indigo-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-indigo-600 text-white font-mono text-[11px] font-bold">
                      {analysisResult.code}
                    </span>
                    <h4 className="font-bold text-slate-800 text-sm">{analysisResult.name}</h4>
                  </div>
                  <div className="text-slate-500 text-[11px] mt-1">
                    所属分类：{analysisResult.category} | 提供部门：{analysisResult.deptName}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                    契合度 99%
                  </span>
                </div>
              </div>

              {/* Information items table preview */}
              <div>
                <div className="font-semibold text-slate-700 mb-2">解析提炼的 6 项核心信息项 Schema：</div>
                <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-100 border-b border-slate-200 font-semibold text-slate-600">
                      <tr>
                        <th className="py-2 px-3">英文字段名</th>
                        <th className="py-2 px-3">中文名称</th>
                        <th className="py-2 px-3">数据类型</th>
                        <th className="py-2 px-3">主键</th>
                        <th className="py-2 px-3">脱敏推荐</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {analysisResult.infoItems.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="py-1.5 px-3 font-mono text-indigo-700 font-medium">{item.fieldName}</td>
                          <td className="py-1.5 px-3 font-medium text-slate-800">{item.fieldLabel}</td>
                          <td className="py-1.5 px-3 font-mono text-slate-500">{item.dataType}({item.length})</td>
                          <td className="py-1.5 px-3">{item.isPrimaryKey ? '是' : '-'}</td>
                          <td className="py-1.5 px-3">
                            {item.maskRule !== '无' ? (
                              <span className="text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                                {item.maskRule}
                              </span>
                            ) : (
                              <span className="text-slate-400">标准无脱敏</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2 flex justify-end gap-3">
                <button
                  onClick={handleApply}
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all shadow-xs flex items-center gap-1.5 text-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>采纳并导入目录清单</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
