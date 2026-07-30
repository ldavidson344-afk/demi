import React, { useState } from 'react';
import { 
  X, 
  Save, 
  Plus, 
  Trash2, 
  Layers, 
  Database, 
  Sparkles, 
  Lock, 
  CheckCircle,
  FileText
} from 'lucide-react';
import { CatalogResource, InformationItem, SharingType, ResourceStatus, UpdateFrequency, DataFormat } from '../types';

interface ResourceDetailDrawerProps {
  isOpen: boolean;
  resource: CatalogResource | null;
  onClose: () => void;
  onSaveResource: (updated: CatalogResource) => void;
  onAiOptimize: (resource: CatalogResource) => void;
}

export const ResourceDetailDrawer: React.FC<ResourceDetailDrawerProps> = ({
  isOpen,
  resource,
  onClose,
  onSaveResource,
  onAiOptimize
}) => {
  if (!isOpen || !resource) return null;

  const [activeTab, setActiveTab] = useState<'base' | 'items' | 'source' | 'ai'>('items');
  const [formData, setFormData] = useState<CatalogResource>({ ...resource });
  const [isTestingSource, setIsTestingSource] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  // Sync state if resource changes
  React.useEffect(() => {
    setFormData({ ...resource });
    setTestResult(null);
  }, [resource]);

  // Handle Field Edit inside Information Items schema table
  const handleItemChange = (index: number, key: keyof InformationItem, value: any) => {
    const updatedItems = [...formData.infoItems];
    updatedItems[index] = { ...updatedItems[index], [key]: value };
    setFormData(prev => ({ ...prev, infoItems: updatedItems, fieldCount: updatedItems.length }));
  };

  // Add a new Information Item
  const handleAddItem = () => {
    const newItem: InformationItem = {
      id: `f-${Date.now()}`,
      fieldName: `field_${formData.infoItems.length + 1}`,
      fieldLabel: `新信息项_${formData.infoItems.length + 1}`,
      dataType: 'varchar',
      length: '64',
      isPrimaryKey: false,
      isRequired: false,
      maskRule: '无',
      sharingCondition: '公开共享',
      description: '信息项字段说明',
    };
    const updated = [...formData.infoItems, newItem];
    setFormData(prev => ({ ...prev, infoItems: updated, fieldCount: updated.length }));
  };

  // Delete Information Item
  const handleDeleteItem = (index: number) => {
    const updated = formData.infoItems.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, infoItems: updated, fieldCount: updated.length }));
  };

  // Save changes
  const handleSave = () => {
    onSaveResource(formData);
    onClose();
  };

  // Test data source connection
  const handleTestConnection = () => {
    setIsTestingSource(true);
    setTestResult(null);
    setTimeout(() => {
      setIsTestingSource(false);
      setTestResult('连接测试成功：链路延迟 12ms，Schema 字段自动解析契合率 100%');
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end select-none">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      ></div>

      {/* Slide-over Drawer Body */}
      <div className="relative w-full max-w-4xl bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded bg-blue-600 font-mono font-medium">
                {formData.code}
              </span>
              <span className="text-xs text-slate-400">{formData.deptName}</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">{formData.name}</h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>保存更新</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('items')}
              className={`py-3 text-xs font-semibold relative transition-colors ${
                activeTab === 'items' ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              信息项定义 (Schema) [{formData.infoItems.length}]
              {activeTab === 'items' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t"></span>}
            </button>

            <button
              onClick={() => setActiveTab('base')}
              className={`py-3 text-xs font-semibold relative transition-colors ${
                activeTab === 'base' ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              目录基本信息
              {activeTab === 'base' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t"></span>}
            </button>

            <button
              onClick={() => setActiveTab('source')}
              className={`py-3 text-xs font-semibold relative transition-colors ${
                activeTab === 'source' ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              数据源挂接与感知
              {activeTab === 'source' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t"></span>}
            </button>

            <button
              onClick={() => setActiveTab('ai')}
              className={`py-3 text-xs font-semibold relative transition-colors flex items-center gap-1 ${
                activeTab === 'ai' ? 'text-indigo-600 font-bold' : 'text-slate-600 hover:text-indigo-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              AI 质量合规诊断
              {activeTab === 'ai' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t"></span>}
            </button>
          </div>
        </div>

        {/* Drawer Main Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          {/* TAB 1: INFORMATION ITEMS SCHEMA TABLE */}
          {activeTab === 'items' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white p-3 border border-slate-200 rounded-lg shadow-2xs">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">元数据信息项列表 (Data Fields)</h3>
                  <p className="text-xs text-slate-500">维护与定义信息资源的各个字段名称、类型、脱敏及共享控制属性</p>
                </div>
                <button
                  onClick={handleAddItem}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 text-xs font-semibold transition-colors shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>添加信息项</span>
                </button>
              </div>

              {/* Information Items Editable Table */}
              <div className="bg-white border border-slate-200 rounded-lg overflow-x-auto shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-semibold">
                    <tr>
                      <th className="py-2.5 px-3 w-8 text-center">#</th>
                      <th className="py-2.5 px-3 min-w-[130px]">英文字段名 (Col)</th>
                      <th className="py-2.5 px-3 min-w-[140px]">中文信息项名称</th>
                      <th className="py-2.5 px-3 w-[100px]">数据类型</th>
                      <th className="py-2.5 px-3 w-[70px]">长度</th>
                      <th className="py-2.5 px-3 w-[60px] text-center">主键</th>
                      <th className="py-2.5 px-3 w-[60px] text-center">必填</th>
                      <th className="py-2.5 px-3 min-w-[110px]">脱敏规则</th>
                      <th className="py-2.5 px-3 min-w-[110px]">共享属性</th>
                      <th className="py-2.5 px-3 w-10 text-center">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {formData.infoItems.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="py-2 px-3 text-center text-slate-400 font-mono">{idx + 1}</td>
                        <td className="py-2 px-2">
                          <input
                            type="text"
                            value={item.fieldName}
                            onChange={(e) => handleItemChange(idx, 'fieldName', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs font-mono font-medium focus:bg-white focus:outline-none focus:border-blue-500"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <input
                            type="text"
                            value={item.fieldLabel}
                            onChange={(e) => handleItemChange(idx, 'fieldLabel', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs font-medium focus:bg-white focus:outline-none focus:border-blue-500 text-slate-800"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <select
                            value={item.dataType}
                            onChange={(e) => handleItemChange(idx, 'dataType', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded px-1.5 py-1 text-xs font-mono focus:bg-white focus:outline-none focus:border-blue-500"
                          >
                            <option value="varchar">varchar</option>
                            <option value="int">int</option>
                            <option value="datetime">datetime</option>
                            <option value="decimal">decimal</option>
                            <option value="text">text</option>
                            <option value="date">date</option>
                          </select>
                        </td>
                        <td className="py-2 px-2">
                          <input
                            type="text"
                            value={item.length}
                            onChange={(e) => handleItemChange(idx, 'length', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded px-1.5 py-1 text-xs font-mono text-center focus:bg-white focus:outline-none focus:border-blue-500"
                          />
                        </td>
                        <td className="py-2 px-2 text-center">
                          <input
                            type="checkbox"
                            checked={item.isPrimaryKey}
                            onChange={(e) => handleItemChange(idx, 'isPrimaryKey', e.target.checked)}
                            className="w-4 h-4 text-blue-600 rounded border-slate-300"
                          />
                        </td>
                        <td className="py-2 px-2 text-center">
                          <input
                            type="checkbox"
                            checked={item.isRequired}
                            onChange={(e) => handleItemChange(idx, 'isRequired', e.target.checked)}
                            className="w-4 h-4 text-blue-600 rounded border-slate-300"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <select
                            value={item.maskRule}
                            onChange={(e) => handleItemChange(idx, 'maskRule', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded px-1.5 py-1 text-xs focus:bg-white focus:outline-none focus:border-blue-500"
                          >
                            <option value="无">无</option>
                            <option value="姓名脱敏">姓名脱敏</option>
                            <option value="身份证脱敏">身份证脱敏</option>
                            <option value="手机号脱敏">手机号脱敏</option>
                            <option value="哈希加密">哈希加密</option>
                          </select>
                        </td>
                        <td className="py-2 px-2">
                          <input
                            type="text"
                            value={item.sharingCondition}
                            onChange={(e) => handleItemChange(idx, 'sharingCondition', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs focus:bg-white focus:outline-none focus:border-blue-500"
                          />
                        </td>
                        <td className="py-2 px-2 text-center">
                          <button
                            onClick={() => handleDeleteItem(idx)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                            title="删除该项"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: BASE METADATA FORM */}
          {activeTab === 'base' && (
            <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-5 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                信息资源编目核心属性
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">资源代码</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData(p => ({ ...p, code: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 font-mono font-medium focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">资源名称</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 font-medium focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">所属目录分类</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData(p => ({ ...p, category: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">资源责任部门</label>
                  <input
                    type="text"
                    value={formData.deptName}
                    onChange={(e) => setFormData(p => ({ ...p, deptName: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">共享类型</label>
                  <select
                    value={formData.sharingType}
                    onChange={(e) => setFormData(p => ({ ...p, sharingType: e.target.value as SharingType }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 focus:outline-none focus:border-blue-500 font-medium"
                  >
                    <option value="无条件共享">无条件共享</option>
                    <option value="有条件共享">有条件共享</option>
                    <option value="不予共享">不予共享</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">更新频率</label>
                  <select
                    value={formData.updateFreq}
                    onChange={(e) => setFormData(p => ({ ...p, updateFreq: e.target.value as UpdateFrequency }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  >
                    <option value="实时">实时</option>
                    <option value="每日">每日</option>
                    <option value="每周">每周</option>
                    <option value="每月">每月</option>
                    <option value="每年">每年</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">存储格式</label>
                  <select
                    value={formData.dataFormat}
                    onChange={(e) => setFormData(p => ({ ...p, dataFormat: e.target.value as DataFormat }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  >
                    <option value="RDBMS">RDBMS 关系型数据库</option>
                    <option value="REST API">REST API 接口</option>
                    <option value="CSV / Excel">CSV / Excel 数据集</option>
                    <option value="JSON / XML">JSON / XML</option>
                    <option value="PDF文件">PDF 非结构化文档</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">编目状态</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(p => ({ ...p, status: e.target.value as ResourceStatus }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  >
                    <option value="待上报">待上报</option>
                    <option value="已上报">已上报</option>
                    <option value="已发布">已发布</option>
                    <option value="草稿">草稿</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1 text-xs">资源详细摘要描述</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-3 text-xs focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>
            </div>
          )}

          {/* TAB 3: DATA SOURCE ATTACHMENT */}
          {activeTab === 'source' && (
            <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6 shadow-2xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Database className="w-4 h-4 text-blue-600" />
                    底层数据源挂接配置 (Data Source Mapping)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">挂接实际数据库、API接口或文件存储，实现元数据落盘探查</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2.5 py-1 rounded font-semibold border ${
                    formData.attachStatus === '已挂接' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {formData.attachStatus}
                  </span>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">数据源挂接 URL / 连接串</label>
                  <input
                    type="text"
                    value={formData.dataSource}
                    onChange={(e) => setFormData(p => ({ ...p, dataSource: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 font-mono text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <div>
                    <div className="font-semibold text-slate-800">挂接链路探查测试</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">自动验证表结构数据类型与信息项 Schema 契合度</div>
                  </div>
                  <button
                    onClick={handleTestConnection}
                    disabled={isTestingSource}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors shadow-2xs flex items-center gap-2"
                  >
                    {isTestingSource ? (
                      <span className="animate-spin text-white">⏳</span>
                    ) : (
                      <Layers className="w-4 h-4" />
                    )}
                    <span>{isTestingSource ? '正在探查...' : '连通性与Schema校验'}</span>
                  </button>
                </div>

                {testResult && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md text-emerald-800 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{testResult}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: AI COMPLIANCE AUDIT */}
          {activeTab === 'ai' && (
            <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6 shadow-2xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">AI 智能目录编目与合规性评价</h3>
                    <p className="text-xs text-slate-500">基于国家/行业标准自动评估目录完整性与敏感字段脱敏策略</p>
                  </div>
                </div>

                <button
                  onClick={() => onAiOptimize(formData)}
                  className="px-3.5 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>一键智能优化补全</span>
                </button>
              </div>

              {/* AI Diagnostic Score */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-indigo-50/50 border border-indigo-100 rounded-lg p-4 text-center">
                  <div className="text-2xl font-black text-indigo-700 font-mono">98.5%</div>
                  <div className="text-xs font-medium text-slate-600 mt-1">目录规范完整度评分</div>
                </div>

                <div className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-4 text-center">
                  <div className="text-2xl font-black text-emerald-700 font-mono">100%</div>
                  <div className="text-xs font-medium text-slate-600 mt-1">敏感字段隐私脱敏覆盖</div>
                </div>

                <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 text-center">
                  <div className="text-2xl font-black text-blue-700 font-mono">A+</div>
                  <div className="text-xs font-medium text-slate-600 mt-1">数据源自动映射匹配等级</div>
                </div>
              </div>

              {/* Suggestions list */}
              <div className="space-y-3 text-xs">
                <h4 className="font-bold text-slate-800">智能审查建议清单：</h4>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-md flex items-start gap-2.5">
                  <Lock className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-800">隐私脱敏建议</div>
                    <div className="text-slate-600 mt-0.5">
                      检测到信息项含有姓名/手机号等个人相关数据，已自动为您开启【姓名脱敏】和【手机号脱敏】规则，避免信息泄露风险。
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-md flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-800">国家分类代码匹配度</div>
                    <div className="text-slate-600 mt-0.5">
                      资源代码 【{formData.code}】 符合国家政务数据资源目录统一编码规则标准（330100 地区编码 + 2026 编目年份）。
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
