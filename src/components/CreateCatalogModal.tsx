import React, { useState } from 'react';
import { X, Sparkles, Plus, Tag, FileText, SlidersHorizontal, Trash2, Check, Shield, Layers } from 'lucide-react';
import { CatalogResource, SharingType, UpdateFrequency, DataFormat, InformationItem } from '../types';

interface CreateCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateResource: (resource: CatalogResource) => void;
}

export const CreateCatalogModal: React.FC<CreateCatalogModalProps> = ({
  isOpen,
  onClose,
  onCreateResource,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'basic' | 'extended' | 'fields'>('basic');

  // 基本要素 states (与图片 1 完全一致)
  const [name, setName] = useState('全市市场价格监督检查与违法案件查处记录数据集');
  const [code, setCode] = useState('RES-330100-SAMR-005');
  const [category, setCategory] = useState('法人单位主题');
  const [categoryCode, setCategoryCode] = useState('CAT-330100-SAMR-05');
  const [industryCategory, setIndustryCategory] = useState('价格监管与反垄断执法');
  const [dataLevel, setDataLevel] = useState('市级');
  const [deptName, setDeptName] = useState('市市场监督管理局');
  const [sourceBasicCatalogName, setSourceBasicCatalogName] = useState('价格监督检查与价格违法行为查处事项基本目录');
  const [sourceBasicCatalogCode, setSourceBasicCatalogCode] = useState('GOV-MAT-330100-SAMR-005');
  const [sourceBusinessItemName, setSourceBusinessItemName] = useState('民生商品价格监测与不正当价格行为查处');
  const [sourceBusinessItemCode, setSourceBusinessItemCode] = useState('BUS-ITEM-330100-SAMR-105');
  const [description, setDescription] = useState('记录重要民生商品价格监测巡查日志、哄抬价格、串通涨价与虚假折扣等行政处罚案件文书号与结果。');

  // 扩展要素 states (与图片 2 完全一致)
  const [sharingType, setSharingType] = useState<SharingType>('有条件共享');
  const [sharingMethod, setSharingMethod] = useState('RESTful API 接口 + 库表定时同步');
  const [sharingScope, setSharingScope] = useState('发改委、商务局、公安局及发展审计部门');
  const [usePurpose, setUsePurpose] = useState('用于民生保供稳价分析、跨部门联合执法及反垄断不正当竞争合规审查');
  const [nonSharingReason, setNonSharingReason] = useState('包含尚未结案的立案侦查文书及企业商业秘密，需按有条件审批使用');
  const [implementationListTitle, setImplementationListTitle] = useState('市场价格稳价保供与价格违法案件查处实施清单');
  const [relatedCatalogTitle, setRelatedCatalogTitle] = useState('全市民生重要商品价格监测与物价稳控数据库');
  const [securityLevel, setSecurityLevel] = useState<'L1 (公开)' | 'L2 (内部)' | 'L3 (受控)' | 'L4 (极密)'>('L2 (内部)');
  const [processingLevel, setProcessingLevel] = useState('脱敏清洗 + 案卷分类映射');
  const [regionScope, setRegionScope] = useState('杭州市全域 (含各区县市)');
  const [timeScope, setTimeScope] = useState('2022年01月01日至今');
  const [updateFreq, setUpdateFreq] = useState<UpdateFrequency>('每日');
  const [dataFormat, setDataFormat] = useState<DataFormat>('RDBMS');
  const [dataSource, setDataSource] = useState('MySQL - db_samr_price_case.tb_market_price_inspection');

  // 数据项信息 states (与图片 3 完全一致)
  const [infoItems, setInfoItems] = useState<InformationItem[]>([
    {
      id: `f-p1`,
      fieldName: 'case_id',
      fieldLabel: '行政处罚案件唯一编号',
      dataType: 'c32',
      length: '32',
      isPrimaryKey: true,
      isRequired: true,
      maskRule: '无',
      sharingCondition: '有条件共享',
      description: '立案查处编号',
      sourceSystem: '价格监督检查与反不正当竞争执法系统',
      systemCategory: '自建自用'
    },
    {
      id: `f-p2`,
      fieldName: 'unsc_code',
      fieldLabel: '被检查单位信用代码',
      dataType: 'c18',
      length: '18',
      isPrimaryKey: false,
      isRequired: true,
      maskRule: '高敏',
      sharingCondition: '有条件共享',
      description: '被处罚主体的18位统一社会信用代码',
      sourceSystem: '价格监督检查与反不正当竞争执法系统',
      systemCategory: '自建自用'
    },
    {
      id: `f-p3`,
      fieldName: 'illegal_type',
      fieldLabel: '违法行为分类描述',
      dataType: 'c100',
      length: '100',
      isPrimaryKey: false,
      isRequired: true,
      maskRule: '无',
      sharingCondition: '有条件共享',
      description: '哄抬价格/价格欺诈/明码标价不规范等',
      sourceSystem: '价格监督检查与反不正当竞争执法系统',
      systemCategory: '自建自用'
    },
    {
      id: `f-p4`,
      fieldName: 'penalty_amount',
      fieldLabel: '行政处罚金额(元)',
      dataType: 'n12,2',
      length: '12,2',
      isPrimaryKey: false,
      isRequired: false,
      maskRule: '无',
      sharingCondition: '有条件共享',
      description: '没收违法所得及罚款合计数额',
      sourceSystem: '价格监督检查与反不正当竞争执法系统',
      systemCategory: '自建自用'
    }
  ]);

  const handleGenerateCode = () => {
    setCode(`RES-330100-SAMR-${Math.floor(100 + Math.random() * 900)}`);
  };

  const handleAddInfoItem = () => {
    const nextIdx = infoItems.length + 1;
    setInfoItems(prev => [
      ...prev,
      {
        id: `f-n${Date.now()}-${nextIdx}`,
        fieldName: `field_${nextIdx}`,
        fieldLabel: `新数据项_${nextIdx}`,
        dataType: 'c100',
        length: '100',
        isPrimaryKey: false,
        isRequired: false,
        maskRule: '无',
        sharingCondition: '有条件共享',
        description: '数据项说明',
        sourceSystem: '价格监督检查与反不正当竞争执法系统',
        systemCategory: '自建自用'
      }
    ]);
  };

  const handleRemoveInfoItem = (idx: number) => {
    setInfoItems(prev => prev.filter((_, i) => i !== idx));
  };

  const handleInfoItemChange = (idx: number, field: keyof InformationItem, val: any) => {
    setInfoItems(prev => prev.map((item, i) => i === idx ? { ...item, [field]: val } : item));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newResource: CatalogResource = {
      id: `cat-${Date.now()}`,
      code,
      name,
      category,
      deptName,
      fieldCount: infoItems.length,
      sharingType,
      updateFreq,
      status: '待上报',
      dataFormat,
      description: description || '新编目信息资源详细描述',
      createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
      updatedTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
      dataSource,
      attachStatus: '待挂接',
      infoItems,
    };

    onCreateResource(newResource);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"></div>

      {/* Modal Dialog Body */}
      <div className="relative w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200 z-10 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center text-white">
              <Plus className="w-4 h-4 stroke-[3]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">新增信息资源编目 (Directory Item)</h3>
              <p className="text-[11px] text-slate-300">与待编目(信息补全)之业务信息编目结构(基本/扩展/数据项)完全一致</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="px-6 pt-3 pb-2 bg-slate-50 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-xl text-xs font-medium border border-slate-300/60">
            <button
              type="button"
              onClick={() => setActiveTab('basic')}
              className={`flex-1 py-1.5 rounded-lg text-center font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'basic'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>基本要素</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('extended')}
              className={`flex-1 py-1.5 rounded-lg text-center font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'extended'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>扩展要素</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('fields')}
              className={`flex-1 py-1.5 rounded-lg text-center font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'fields'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>数据项信息 ({infoItems.length})</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs overflow-y-auto flex-1">
          
          {/* TAB 1: 基本要素 (完全匹配图片1) */}
          {activeTab === 'basic' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-100">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <Tag className="w-4 h-4 text-indigo-600" />
                  <span>1. 基本要素补全 (Mandatory Core Metadata)</span>
                </div>
                <span className="text-slate-500 text-[11px] font-mono">
                  政务标准基本集
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-150">
                <div className="sm:col-span-1">
                  <label className="block text-slate-700 font-bold mb-1">
                    数据目录名称 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="全市市场价格监督检查与违法案件查处记录数据集"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-medium focus:outline-none focus:border-blue-500 shadow-2xs"
                  />
                </div>

                <div className="sm:col-span-1">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-700 font-bold">
                      数据目录编码 <span className="text-rose-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleGenerateCode}
                      className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 font-normal"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>随机生成</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 font-mono font-semibold text-slate-800 focus:outline-none focus:border-blue-500 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">数据所属分类</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500 font-bold shadow-2xs"
                  >
                    <option value="法人单位主题">法人单位主题</option>
                    <option value="全民人口主题">全民人口主题</option>
                    <option value="自然资源主题">自然资源主题</option>
                    <option value="宏观经济主题">宏观经济主题</option>
                    <option value="医疗卫生与健康">医疗卫生与健康</option>
                    <option value="交通运输与物流">交通运输与物流</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">分类编码</label>
                  <input
                    type="text"
                    value={categoryCode}
                    onChange={(e) => setCategoryCode(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 font-mono text-slate-800 focus:outline-none focus:border-blue-500 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">数据所属领域</label>
                  <input
                    type="text"
                    value={industryCategory}
                    onChange={(e) => setIndustryCategory(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">数据所在层级</label>
                  <select
                    value={dataLevel}
                    onChange={(e) => setDataLevel(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500 font-bold shadow-2xs"
                  >
                    <option value="省级">省级</option>
                    <option value="市级">市级</option>
                    <option value="区县级">区县级</option>
                    <option value="乡镇/街道级">乡镇/街道级</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">数据来源事项基本目录名称</label>
                  <input
                    type="text"
                    value={sourceBasicCatalogName}
                    onChange={(e) => setSourceBasicCatalogName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">数据来源事项基本目录编码</label>
                  <input
                    type="text"
                    value={sourceBasicCatalogCode}
                    onChange={(e) => setSourceBasicCatalogCode(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 font-mono text-slate-800 focus:outline-none focus:border-blue-500 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">数据来源事项业务项名称</label>
                  <input
                    type="text"
                    value={sourceBusinessItemName}
                    onChange={(e) => setSourceBusinessItemName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">数据来源事项业务项编码</label>
                  <input
                    type="text"
                    value={sourceBusinessItemCode}
                    onChange={(e) => setSourceBusinessItemCode(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 font-mono text-slate-800 focus:outline-none focus:border-blue-500 shadow-2xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">政务数据摘要 *</label>
                  <textarea
                    rows={3}
                    placeholder="请输入该政务数据集的具体业务含义、适用范围及归集背景说明..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg p-3 text-slate-800 focus:outline-none focus:border-blue-500 shadow-2xs font-medium"
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 扩展要素 (完全匹配图片2) */}
          {activeTab === 'extended' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-100">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span>2. 扩展要素补全 (Governance & Scope Elements)</span>
                </div>
                <span className="text-slate-500 text-[11px] font-mono">
                  共享与安全属性
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-150">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">共享属性</label>
                  <select
                    value={sharingType}
                    onChange={(e) => setSharingType(e.target.value as SharingType)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500 font-bold shadow-2xs"
                  >
                    <option value="有条件共享">有条件共享 (需审批授权后使用)</option>
                    <option value="无条件共享">无条件共享</option>
                    <option value="不予共享">不予共享</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">共享方式</label>
                  <input
                    type="text"
                    value={sharingMethod}
                    onChange={(e) => setSharingMethod(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">共享范围</label>
                  <input
                    type="text"
                    value={sharingScope}
                    onChange={(e) => setSharingScope(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">使用用途</label>
                  <input
                    type="text"
                    value={usePurpose}
                    onChange={(e) => setUsePurpose(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500 shadow-2xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-amber-900 font-bold mb-1 flex items-center gap-1">
                    <span>不予共享理由及依据</span>
                    <span className="text-[10px] text-amber-700 font-normal">(若选不予共享或有条件共享时需详述)</span>
                  </label>
                  <input
                    type="text"
                    value={nonSharingReason}
                    onChange={(e) => setNonSharingReason(e.target.value)}
                    className="w-full bg-amber-50/60 border border-amber-200 rounded-lg px-3 py-2 text-amber-950 focus:outline-none focus:border-amber-500 font-medium shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">数据来源事项实施清单名称</label>
                  <input
                    type="text"
                    value={implementationListTitle}
                    onChange={(e) => setImplementationListTitle(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">数据关联事项基本目录名称</label>
                  <input
                    type="text"
                    value={relatedCatalogTitle}
                    onChange={(e) => setRelatedCatalogTitle(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">数据分级</label>
                  <select
                    value={securityLevel}
                    onChange={(e) => setSecurityLevel(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500 font-bold shadow-2xs"
                  >
                    <option value="L1 (公开)">L1 (公开)</option>
                    <option value="L2 (内部)">L2 (部门内部)</option>
                    <option value="L3 (受控)">L3 (受控)</option>
                    <option value="L4 (极密)">L4 (极密)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">数据加工程度</label>
                  <input
                    type="text"
                    value={processingLevel}
                    onChange={(e) => setProcessingLevel(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">数据区域范围</label>
                  <input
                    type="text"
                    value={regionScope}
                    onChange={(e) => setRegionScope(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">数据时间范围</label>
                  <input
                    type="text"
                    value={timeScope}
                    onChange={(e) => setTimeScope(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">政务数据提供单位</label>
                  <input
                    type="text"
                    value={deptName}
                    onChange={(e) => setDeptName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">数据更新频率</label>
                  <select
                    value={updateFreq}
                    onChange={(e) => setUpdateFreq(e.target.value as UpdateFrequency)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500 font-bold shadow-2xs"
                  >
                    <option value="实时">实时更新</option>
                    <option value="每日">每日更新</option>
                    <option value="每周">每周更新</option>
                    <option value="每月">每月更新</option>
                    <option value="每年">每年更新</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 数据项信息明细 (完全匹配图片3) */}
          {activeTab === 'fields' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span>3. 数据项信息明细</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 text-[11px] font-mono">
                    共 {infoItems.length} 个数据项
                  </span>
                  <button
                    type="button"
                    onClick={handleAddInfoItem}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 transition-colors shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>添加数据项</span>
                  </button>
                </div>
              </div>

              {/* Exact Table matching Screenshot 3 */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                    <tr>
                      <th className="py-2.5 px-3">数据项英文名称</th>
                      <th className="py-2.5 px-3">数据项中文名称</th>
                      <th className="py-2.5 px-3">数据格式</th>
                      <th className="py-2.5 px-3">来源系统</th>
                      <th className="py-2.5 px-3">系统所属分类</th>
                      <th className="py-2.5 px-3 text-center">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {infoItems.map((item, i) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3 font-bold text-slate-900">
                          <div className="flex items-center gap-1.5 font-mono">
                            {item.isPrimaryKey && <span className="text-amber-500 shrink-0 font-sans" title="主键">🔑</span>}
                            <input
                              type="text"
                              value={item.fieldName}
                              onChange={(e) => handleInfoItemChange(i, 'fieldName', e.target.value)}
                              className="w-32 px-2 py-1 rounded bg-slate-50 border border-slate-200 font-mono font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                            />
                          </div>
                        </td>
                        <td className="py-2.5 px-3 font-sans">
                          <input
                            type="text"
                            value={item.fieldLabel}
                            onChange={(e) => handleInfoItemChange(i, 'fieldLabel', e.target.value)}
                            className="w-full min-w-[160px] px-2.5 py-1 rounded bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                          />
                        </td>
                        <td className="py-2.5 px-3 font-mono">
                          <input
                            type="text"
                            value={item.dataType}
                            onChange={(e) => handleInfoItemChange(i, 'dataType', e.target.value)}
                            className="w-20 px-2 py-1 rounded bg-slate-50 border border-slate-200 font-mono font-bold text-indigo-700 text-xs focus:outline-none focus:border-blue-500"
                          />
                        </td>
                        <td className="py-2.5 px-3 font-sans">
                          <input
                            type="text"
                            value={item.sourceSystem || '价格监督检查与反不正当竞争执法系统'}
                            onChange={(e) => handleInfoItemChange(i, 'sourceSystem', e.target.value)}
                            className="w-full min-w-[200px] px-2.5 py-1 rounded bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                          />
                        </td>
                        <td className="py-2.5 px-3 font-sans">
                          <select
                            value={item.systemCategory || '自建自用'}
                            onChange={(e) => handleInfoItemChange(i, 'systemCategory', e.target.value)}
                            className="px-2.5 py-1 rounded-lg border border-amber-200 bg-amber-50/80 text-amber-900 font-bold text-xs focus:outline-none shadow-2xs cursor-pointer"
                          >
                            <option value="自建自用">自建自用</option>
                            <option value="统一建设">统一建设</option>
                            <option value="外部引入">外部引入</option>
                            <option value="国直/省直">国直/省直</option>
                          </select>
                        </td>
                        <td className="py-2.5 px-3 text-center font-sans">
                          <button
                            type="button"
                            onClick={() => handleRemoveInfoItem(i)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                            title="删除数据项"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="pt-3 flex items-center justify-between border-t border-slate-100 shrink-0">
            <span className="text-xs text-slate-500 font-medium">
              当前: <span className="font-bold text-blue-600">{activeTab === 'basic' ? '1. 基本要素' : activeTab === 'extended' ? '2. 扩展要素' : '3. 数据项信息'}</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors shadow-xs flex items-center gap-1"
              >
                <Check className="w-4 h-4" />
                <span>确认创建</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
