import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Database,
  Layers,
  Shield,
  Tag,
  BookOpen,
  FileCheck,
  AlertCircle,
  Edit3,
  Save,
  Building2,
  ExternalLink,
  RefreshCw,
  ChevronRight,
  ChevronDown,
  Check,
  CheckSquare,
  Square,
  SlidersHorizontal,
  ArrowRight,
  Info,
  HelpCircle,
  Zap,
  ListFilter,
  RotateCcw,
  Send,
  Lock,
  Globe,
  Share2,
  Key,
  Hash,
  Cpu,
  FileText,
  LayoutGrid,
  GitFork,
  Link,
  Trash2,
  Plus,
  Wand2,
  AlertTriangle
} from 'lucide-react';

export interface TableRelationItem {
  id: string;
  sourceField: string;
  targetTable: string;
  targetField: string;
  relationType: '1:1' | '1:N' | 'N:M';
  description: string;
}

export interface CollectedTableItem {
  id: string;
  tableName: string;         // 物理表名
  suggestedName: string;     // 自动推测中文名
  systemName: string;        // 来源系统
  dbName: string;            // 数据库名
  dbType: string;            // 数据库类型 (MySQL, PostgreSQL, Oracle etc.)
  deptName: string;          // 归属单位/部门
  fieldCount: number;        // 字段数
  rowCount: string;          // 记录数
  collectTime: string;       // 采集时间
  healthStatus: 'healthy' | 'warning' | 'unverified'; // 探测状态
  status: 'collected_unconfirmed' | 'pending_catalog' | 'cataloged'; // 当前状态
  
  // 物理表结构属性
  primaryKey?: string;       // 主键列
  indexCount?: number;       // 索引数量
  partitionType?: string;    // 分区方式
  storageEngine?: string;    // 存储引擎
  createdAt?: string;        // 创建时间

  // 技术信息主要补全
  tableCnDescription?: string;   // 数据表中文描述
  tableRelations?: TableRelationItem[]; // 表关联关系

  // 业务信息 - 基本要素
  catalogCode?: string;                 // 数据目录编码
  catalogTitle?: string;                // 数据目录名称
  subjectDomain?: string;               // 数据所属分类
  categoryCode?: string;                // 分类编码
  industryCategory?: string;            // 数据所属领域
  sourceBasicCatalogName?: string;      // 数据来源事项基本目录名称
  sourceBasicCatalogCode?: string;      // 数据来源事项基本目录编码
  sourceBusinessItemName?: string;      // 数据来源事项业务项名称
  sourceBusinessItemCode?: string;      // 数据来源事项业务项编码
  dataLevel?: string;                   // 数据所在层级 (市级/省级/区县级)
  description?: string;                 // 政务数据摘要

  // 业务信息 - 扩展要素
  sharingType?: '无条件共享' | '有条件共享' | '不予共享'; // 共享属性
  sharingScope?: string;                // 共享范围
  usePurpose?: string;                  // 使用用途
  nonSharingReason?: string;            // 不予共享理由及依据
  sharingMethod?: string;               // 共享方式
  implementationListTitle?: string;     // 数据来源事项实施清单名称
  relatedCatalogTitle?: string;         // 数据关联事项基本目录名称
  securityLevel?: 'L1 (公开)' | 'L2 (内部)' | 'L3 (受控)' | 'L4 (极密)'; // 数据分级
  processingLevel?: string;             // 数据加工程度
  regionScope?: string;                 // 数据区域范围
  timeScope?: string;                   // 数据时间范围
  providerUnit?: string;                // 政务数据提供单位
  updateFreq?: '实时' | '每日' | '每周' | '每月' | '每季' | '每年'; // 数据更新频率

  dataOwner?: string;        // 数据责任人
  completionRate?: number;   // 补全进度百分比

  // 字段明细 / 数据项信息
  fields: {
    id: string;
    name: string;            // 数据项英文名称
    label: string;           // 数据项中文名称
    type: string;            // 数据格式
    isPk: boolean;
    sensitivity?: '公开' | '脱敏' | '高敏';
    systemCategory?: string; // 系统所属分类 (无、自建自用、国直、省直、市直、县直)
    sourceSystem?: string;   // 来源系统
    termMapping?: string;    // 国标术语映射
    description?: string;    // 字段中文描述 (技术信息)
  }[];
}

export const formatDataType = (typeStr: string): string => {
  if (!typeStr) return 'c100';
  const val = typeStr.trim();
  if (/^[cnd]\d+/i.test(val)) return val;
  
  if (/^varchar\((\d+)\)/i.test(val)) {
    const m = val.match(/^varchar\((\d+)\)/i);
    return m ? `c${m[1]}` : 'c100';
  }
  if (/^char\((\d+)\)/i.test(val)) {
    const m = val.match(/^char\((\d+)\)/i);
    return m ? `c${m[1]}` : 'c10';
  }
  if (/^decimal\((\d+,\d+)\)/i.test(val)) {
    const m = val.match(/^decimal\((\d+,\d+)\)/i);
    return m ? `n${m[1]}` : 'n12,2';
  }
  if (/^int/i.test(val) || /^number/i.test(val)) {
    return 'n12';
  }
  if (/^date/i.test(val) || /^timestamp/i.test(val)) {
    return 'd8';
  }
  if (val === 'text') {
    return 'c100';
  }
  return 'c100';
};

const INITIAL_COLLECTED_TABLES: CollectedTableItem[] = [
  {
    id: 'coll-101',
    tableName: 'tb_market_entity_basic',
    suggestedName: '全市市场主体登记注册及基础信息表',
    systemName: '市场监督管理一体化综合业务平台',
    dbName: 'db_samr_core',
    dbType: 'PostgreSQL',
    deptName: '市市场监督管理局',
    fieldCount: 22,
    rowCount: '1,850,000 条',
    collectTime: '2026-07-29 18:30',
    healthStatus: 'healthy',
    status: 'collected_unconfirmed',
    primaryKey: 'unsc_code',
    indexCount: 5,
    partitionType: '按登记机关与区域范围分区 (RANGE)',
    storageEngine: 'PostgreSQL Heap',
    createdAt: '2026-01-10 09:30:00',
    catalogTitle: '全市市场主体登记注册及基础信息表',
    catalogCode: 'RES-330100-SAMR-001',
    subjectDomain: '法人单位主题',
    categoryCode: 'CAT-330100-SAMR-01',
    industryCategory: '市场监督管理与企业登记',
    sourceBasicCatalogName: '企业及个体工商户设立与变更登记事项基本目录',
    sourceBasicCatalogCode: 'GOV-MAT-330100-SAMR-001',
    sourceBusinessItemName: '市场主体设立、变更、注销登记与经营范围核准',
    sourceBusinessItemCode: 'BUS-ITEM-330100-SAMR-101',
    dataLevel: '市级',
    sharingType: '有条件共享',
    sharingScope: '全市各级政务部门、公共服务机构及金融监管节点',
    usePurpose: '用于跨部门联合审批、信用联合惩戒及市场主体画像分析',
    nonSharingReason: '涉及企业法定代表人身份证件及联系电话等敏感信息，需按有条件申请并在脱敏后使用',
    sharingMethod: 'RESTful API 接口服务 + 数据库批量同步',
    implementationListTitle: '杭州市市场主体登记注册与信用归集实施清单',
    relatedCatalogTitle: '全市企业信用信息共享平台与失信被执行人名录库',
    securityLevel: 'L3 (受控)',
    processingLevel: '清洗脱敏 + 逻辑融合',
    regionScope: '杭州市全域 (含各区县市)',
    timeScope: '2020年01月01日至今 (实时全量数据)',
    providerUnit: '市市场监督管理局',
    updateFreq: '每日',
    description: '归集全市各类企业、个体工商户、农民专业合作社的统一社会信用代码、法定代表人、注册资本、许可经营范围及登记状态。',
    dataOwner: '登记注册处 - 刘处长',
    completionRate: 45,
    fields: [
      { id: 'f1', name: 'unsc_code', label: '统一社会信用代码', type: 'varchar(18)', isPk: true, sensitivity: '高敏', termMapping: 'GB/T 32100-2015', sourceSystem: '市场监督管理一体化综合业务平台', description: '企业、个体工商户等市场主体的18位唯一社会信用代码' },
      { id: 'f2', name: 'ent_name', label: '市场主体名称', type: 'varchar(200)', isPk: false, sensitivity: '公开', termMapping: 'GB/T 20000', sourceSystem: '市场监督管理一体化综合业务平台', description: '经市场监管部门核准的名称' },
      { id: 'f3', name: 'legal_rep', label: '法定代表人/负责人', type: 'varchar(50)', isPk: false, sensitivity: '脱敏', termMapping: 'GB/T 32100', sourceSystem: '市场监督管理一体化综合业务平台', description: '市场主体登记的法定代表人或负责人姓名' },
      { id: 'f4', name: 'reg_capital', label: '注册资本(万元)', type: 'decimal(18,2)', isPk: false, sensitivity: '公开', termMapping: 'GB/T 32100', sourceSystem: '市场监督管理一体化综合业务平台', description: '企业在登记机关登记注册的资金数额' },
      { id: 'f5', name: 'op_scope', label: '许可经营范围描述', type: 'text', isPk: false, sensitivity: '公开', termMapping: 'GB/T 4754', sourceSystem: '市场监督管理一体化综合业务平台', description: '市场主体依法核准从事的经营活动范围' }
    ]
  },
  {
    id: 'coll-102',
    tableName: 'tb_food_drug_license',
    suggestedName: '食品药品经营许可与执业资质登记表',
    systemName: '食品药品安全监管与许可系统',
    dbName: 'db_samr_food_drug',
    dbType: 'Oracle',
    deptName: '市市场监督管理局',
    fieldCount: 26,
    rowCount: '240,000 条',
    collectTime: '2026-07-29 17:15',
    healthStatus: 'warning',
    status: 'collected_unconfirmed',
    primaryKey: 'license_no',
    indexCount: 4,
    partitionType: '按发证年份及许可类别列表分区 (LIST)',
    storageEngine: 'Oracle HighPerf Heap',
    createdAt: '2026-02-18 14:15:00',
    catalogTitle: '全市食品药品经营许可与执业资质登记表',
    catalogCode: 'RES-330100-SAMR-002',
    subjectDomain: '法人单位主题',
    categoryCode: 'CAT-330100-SAMR-02',
    industryCategory: '食品药品安全监管',
    sourceBasicCatalogName: '食品药品生产经营许可事项基本目录',
    sourceBasicCatalogCode: 'GOV-MAT-330100-SAMR-002',
    sourceBusinessItemName: '食品经营许可证与药品零售许可发放及核验',
    sourceBusinessItemCode: 'BUS-ITEM-330100-SAMR-102',
    dataLevel: '市级',
    sharingType: '无条件共享',
    sharingScope: '全网政务部门、公共安全及卫健系统',
    usePurpose: '用于食品药品安全协同监管、阳光餐饮核验及公共卫生联防联控',
    nonSharingReason: '',
    sharingMethod: 'RESTful API 接口服务',
    implementationListTitle: '食品药品经营许可证在线核验与跨部门监管实施清单',
    relatedCatalogTitle: '全市餐饮与药品零售企业主体信用档案数据库',
    securityLevel: 'L1 (公开)',
    processingLevel: '标准化清洗 + 规则校验',
    regionScope: '杭州市全域',
    timeScope: '2021年01月01日至今',
    providerUnit: '市市场监督管理局',
    updateFreq: '每日',
    description: '包含全市餐饮服务、食品流通、药品零售企业许可执业凭证号、许可具体项目、发证机关及许可有效期限。',
    dataOwner: '食品消费监管处 - 陈科长',
    completionRate: 35,
    fields: [
      { id: 'f11', name: 'license_no', label: '许可证件编号', type: 'varchar(32)', isPk: true, sensitivity: '公开', termMapping: 'GB/T 32100-2015', sourceSystem: '食品药品安全监管与许可系统', description: '食品药品经营许可的唯一证号' },
      { id: 'f12', name: 'unsc_code', label: '统一社会信用代码', type: 'varchar(18)', isPk: false, sensitivity: '高敏', termMapping: 'GB/T 32100', sourceSystem: '食品药品安全监管与许可系统', description: '持证主体的18位统一社会信用代码' },
      { id: 'f13', name: 'store_name', label: '经营场所/店铺名称', type: 'varchar(150)', isPk: false, sensitivity: '公开', termMapping: 'GB/T 20000', sourceSystem: '食品药品安全监管与许可系统', description: '实际经营门面或仓库名称' },
      { id: 'f14', name: 'permit_category', label: '许可项目类别', type: 'varchar(50)', isPk: false, sensitivity: '公开', termMapping: 'GB/T 32100', sourceSystem: '食品药品安全监管与许可系统', description: '热食类制售、预包装食品销售等细分核准类目' }
    ]
  },
  {
    id: 'coll-103',
    tableName: 'tb_special_equipment_inspect',
    suggestedName: '特种设备安全检验与运行监控台账',
    systemName: '特种设备全生命周期安全监管平台',
    dbName: 'db_samr_equipment',
    dbType: 'SQL Server',
    deptName: '市市场监督管理局',
    fieldCount: 30,
    rowCount: '520,000 条',
    collectTime: '2026-07-29 16:00',
    healthStatus: 'healthy',
    status: 'collected_unconfirmed',
    primaryKey: 'equip_code',
    indexCount: 5,
    partitionType: 'Hash 哈希散列分区',
    storageEngine: 'SQL Server Primary Engine',
    createdAt: '2025-11-05 11:00:00',
    catalogTitle: '特种设备安全检验与运行监控台账',
    catalogCode: 'RES-330100-SAMR-003',
    subjectDomain: '法人单位主题',
    categoryCode: 'CAT-330100-SAMR-03',
    industryCategory: '特种设备安全监察',
    sourceBasicCatalogName: '特种设备使用登记与定期检验事项基本目录',
    sourceBasicCatalogCode: 'GOV-MAT-330100-SAMR-003',
    sourceBusinessItemName: '电梯/压力容器/起重机械使用登记与检测监察',
    sourceBusinessItemCode: 'BUS-ITEM-330100-SAMR-103',
    dataLevel: '市级',
    sharingType: '有条件共享',
    sharingScope: '应急管理、住建及消防救援部门',
    usePurpose: '用于城市安全风险预警、电梯应急救援及特种设备隐患排查',
    nonSharingReason: '涉及大型公共场所及特种设施精确定位防灾数据，需按特定安全协议共享',
    sharingMethod: 'API 接口 + 实时推送',
    implementationListTitle: '特种设备安全监察与故障预警应急响应实施清单',
    relatedCatalogTitle: '城市生命线安全运行监测与应急救援联动指挥系统',
    securityLevel: 'L2 (内部)',
    processingLevel: '实时流式清洗 + 动态打标',
    regionScope: '杭州市全域',
    timeScope: '2022年01月01日至今',
    providerUnit: '市市场监督管理局',
    updateFreq: '实时',
    description: '覆盖辖区内电梯、压力容器、起重机械等特种设备使用登记证号、定期检验机构、下次检验日期及安检运行状态。',
    dataOwner: '特种设备安全监察处 - 赵工',
    completionRate: 50,
    fields: [
      { id: 'f21', name: 'equip_code', label: '特种设备注册代码', type: 'varchar(30)', isPk: true, sensitivity: '公开', termMapping: 'GB/T 20000', sourceSystem: '特种设备全生命周期安全监管平台', description: '设备唯一识别编码' },
      { id: 'f22', name: 'equip_type', label: '设备类别名称', type: 'varchar(50)', isPk: false, sensitivity: '公开', termMapping: 'GB/T 20000', sourceSystem: '特种设备全生命周期安全监管平台', description: '电梯/客运索道/起重机械/压力容器等' },
      { id: 'f23', name: 'use_unit_code', label: '使用单位信用代码', type: 'varchar(18)', isPk: false, sensitivity: '脱敏', termMapping: 'GB/T 32100', sourceSystem: '特种设备全生命周期安全监管平台', description: '特种设备管理与维护责任单位代码' },
      { id: 'f24', name: 'safety_status', label: '安全运行状态', type: 'varchar(20)', isPk: false, sensitivity: '公开', termMapping: 'GB/T 20000', sourceSystem: '特种设备全生命周期安全监管平台', description: '合格/应检未检/维保停运/存在隐患' }
    ]
  },
  {
    id: 'coll-104',
    tableName: 'tb_enterprise_annual_report',
    suggestedName: '企业年度报告公示与经营异常名录数据库',
    systemName: '国家企业信用信息公示系统(杭州分中心)',
    dbName: 'db_samr_credit',
    dbType: 'ClickHouse',
    deptName: '市市场监督管理局',
    fieldCount: 20,
    rowCount: '3,200,000 条',
    collectTime: '2026-07-29 15:20',
    healthStatus: 'healthy',
    status: 'collected_unconfirmed',
    primaryKey: 'report_id',
    indexCount: 2,
    partitionType: 'ClickHouse MergeTree 季度分区',
    storageEngine: 'ClickHouse MergeTree',
    createdAt: '2026-03-01 08:00:00',
    catalogTitle: '企业年度报告公示与经营异常名录数据库',
    catalogCode: 'RES-330100-SAMR-004',
    subjectDomain: '法人单位主题',
    categoryCode: 'CAT-330100-SAMR-04',
    industryCategory: '信用监管与失信惩戒',
    sourceBasicCatalogName: '企业年报公示与经营异常名录移入移出事项基本目录',
    sourceBasicCatalogCode: 'GOV-MAT-330100-SAMR-004',
    sourceBusinessItemName: '企业年报补报公示与经营异常状态解除审理',
    sourceBusinessItemCode: 'BUS-ITEM-330100-SAMR-104',
    dataLevel: '市级',
    sharingType: '无条件共享',
    sharingScope: '全市政务部门、司法机关、银行金融机构及社会公众平台',
    usePurpose: '用于招投标资格审查、信用等级评价、政府补贴发放及金融授信校验',
    nonSharingReason: '',
    sharingMethod: '库表定时同步 + API 接口',
    implementationListTitle: '企业信用年报公示与经营异常名录信用监管实施清单',
    relatedCatalogTitle: '全国企业信用信息公示系统（浙江）协同平台',
    securityLevel: 'L1 (公开)',
    processingLevel: '离线批处理清洗 + 逻辑整合',
    regionScope: '杭州市全域',
    timeScope: '2018年01月01日至今',
    providerUnit: '市市场监督管理局',
    updateFreq: '实时',
    description: '实时归集企业公示年报经营状况、社保缴纳人数、列入/移出经营异常名录的原因、决定机关及信用修复记录。',
    dataOwner: '信用监督管理处 - 王处长',
    completionRate: 45,
    fields: [
      { id: 'f31', name: 'report_id', label: '年报唯一流水号', type: 'varchar(36)', isPk: true, sensitivity: '公开', termMapping: 'GB/T 32100', sourceSystem: '国家企业信用信息公示系统', description: '企业年报填报系统生成唯一编号' },
      { id: 'f32', name: 'unsc_code', label: '统一社会信用代码', type: 'varchar(18)', isPk: false, sensitivity: '高敏', termMapping: 'GB/T 32100', sourceSystem: '国家企业信用信息公示系统', description: '企业的统一社会信用代码' },
      { id: 'f33', name: 'report_year', label: '年报所属年度', type: 'varchar(4)', isPk: false, sensitivity: '公开', termMapping: 'GB/T 20000', sourceSystem: '国家企业信用信息公示系统', description: '年报对应的公历年份' },
      { id: 'f34', name: 'is_abnormal', label: '是否列入经营异常名录', type: 'varchar(2)', isPk: false, sensitivity: '公开', termMapping: 'GB/T 32100', sourceSystem: '国家企业信用信息公示系统', description: '是/否' }
    ]
  },
  {
    id: 'coll-105',
    tableName: 'tb_market_price_inspection',
    suggestedName: '市场价格监督检查与违法案件查处记录',
    systemName: '价格监督检查与反不正当竞争执法系统',
    dbName: 'db_samr_price_case',
    dbType: 'MySQL',
    deptName: '市市场监督管理局',
    fieldCount: 28,
    rowCount: '115,000 条',
    collectTime: '2026-07-29 14:10',
    healthStatus: 'healthy',
    status: 'pending_catalog', // 已在待编目中
    primaryKey: 'case_id',
    indexCount: 3,
    partitionType: '按月范围分区 (RANGE)',
    storageEngine: 'InnoDB',
    createdAt: '2026-04-12 16:20:00',
    catalogTitle: '全市市场价格监督检查与违法案件查处记录数据集',
    catalogCode: 'RES-330100-SAMR-005',
    subjectDomain: '法人单位主题',
    categoryCode: 'CAT-330100-SAMR-05',
    industryCategory: '价格监管与反垄断执法',
    sourceBasicCatalogName: '价格监督检查与价格违法行为查处事项基本目录',
    sourceBasicCatalogCode: 'GOV-MAT-330100-SAMR-005',
    sourceBusinessItemName: '民生商品价格监测与不正当价格行为查处',
    sourceBusinessItemCode: 'BUS-ITEM-330100-SAMR-105',
    dataLevel: '市级',
    sharingType: '有条件共享',
    sharingScope: '发改委、商务局、公安局及发展审计部门',
    usePurpose: '用于民生保供稳价分析、跨部门联合执法及反垄断不正当竞争合规审查',
    nonSharingReason: '包含尚未结案的立案侦查文书及企业商业秘密，需按有条件审批使用',
    sharingMethod: 'RESTful API 接口 + 库表定时同步',
    implementationListTitle: '市场价格稳价保供与价格违法案件查处实施清单',
    relatedCatalogTitle: '全市民生重要商品价格监测与物价稳控数据库',
    securityLevel: 'L2 (内部)',
    processingLevel: '脱敏清洗 + 案卷分类映射',
    regionScope: '杭州市全域 (含各区县市)',
    timeScope: '2022年01月01日至今',
    providerUnit: '市市场监督管理局',
    updateFreq: '每日',
    description: '记录重要民生商品价格监测巡查日志、哄抬价格、串通涨价与虚假折扣等行政处罚案件文书号与结果。',
    dataOwner: '价监竞争局 - 孙处长',
    completionRate: 70,
    fields: [
      { id: 'f41', name: 'case_id', label: '行政处罚案件唯一编号', type: 'varchar(32)', isPk: true, sensitivity: '公开', termMapping: 'GB/T 32100', sourceSystem: '价格监督检查与反不正当竞争执法系统', description: '立案查处编号' },
      { id: 'f42', name: 'unsc_code', label: '被检查单位信用代码', type: 'varchar(18)', isPk: false, sensitivity: '高敏', termMapping: 'GB/T 32100', sourceSystem: '价格监督检查与反不正当竞争执法系统', description: '被处罚主体的18位统一社会信用代码' },
      { id: 'f43', name: 'illegal_type', label: '违法行为分类描述', type: 'varchar(100)', isPk: false, sensitivity: '公开', termMapping: 'GB/T 20000', sourceSystem: '价格监督检查与反不正当竞争执法系统', description: '哄抬价格/价格欺诈/明码标价不规范等' },
      { id: 'f44', name: 'penalty_amount', label: '行政处罚金额(元)', type: 'decimal(12,2)', isPk: false, sensitivity: '公开', termMapping: 'GB/T 20000', sourceSystem: '价格监督检查与反不正当竞争执法系统', description: '没收违法所得及罚款合计数额' }
    ]
  },
  {
    id: 'coll-106',
    tableName: 'tb_ipr_patent_trademark',
    suggestedName: '商标专利知识产权质押与维权援助台账',
    systemName: '知识产权保护与高价值专利运营服务平台',
    dbName: 'db_samr_ipr',
    dbType: 'PostgreSQL',
    deptName: '市市场监督管理局',
    fieldCount: 24,
    rowCount: '86,000 条',
    collectTime: '2026-07-29 12:00',
    healthStatus: 'healthy',
    status: 'pending_catalog', // 已在待编目中
    primaryKey: 'ipr_reg_no',
    indexCount: 3,
    partitionType: '未分区 (全局表)',
    storageEngine: 'PostgreSQL Heap',
    createdAt: '2026-05-20 10:45:00',
    catalogTitle: '全市商标专利知识产权质押与维权援助台账',
    catalogCode: 'RES-330100-SAMR-006',
    subjectDomain: '法人单位主题',
    categoryCode: 'CAT-330100-SAMR-06',
    industryCategory: '知识产权保护与运营',
    sourceBasicCatalogName: '专利商标质押登记与知识产权维权事项基本目录',
    sourceBasicCatalogCode: 'GOV-MAT-330100-SAMR-006',
    sourceBusinessItemName: '知识产权质押融资登记与侵权维权处置',
    sourceBusinessItemCode: 'BUS-ITEM-330100-SAMR-106',
    dataLevel: '市级',
    sharingType: '无条件共享',
    sharingScope: '全网政务部门、科技金融机构、法院及版权保护中心',
    usePurpose: '用于高新技术企业扶持、知识产权质押贷款授信及侵权预警处置',
    nonSharingReason: '',
    sharingMethod: 'API 接口 + 数据订阅',
    implementationListTitle: '知识产权质押融资与快速维权综合服务实施清单',
    relatedCatalogTitle: '浙江省知识产权大数据与高价值专利培育数据库',
    securityLevel: 'L1 (公开)',
    processingLevel: '结构化提取 + 专利库对接',
    regionScope: '杭州市全域',
    timeScope: '2020年01月01日至今',
    providerUnit: '市市场监督管理局',
    updateFreq: '每月',
    description: '归集辖区企业专利授权量、商标注册号、知识产权质押融资担保金额及侵权维权援助服务记录。',
    dataOwner: '知识产权保护处 - 周科长',
    completionRate: 85,
    fields: [
      { id: 'f51', name: 'ipr_reg_no', label: '知识产权注册/专利号', type: 'varchar(40)', isPk: true, sensitivity: '公开', termMapping: 'GB/T 32100', sourceSystem: '知识产权保护与高价值专利运营服务平台', description: '国家知识产权局核发的专利号或商标注册号' },
      { id: 'f52', name: 'unsc_code', label: '权利人统一社会信用代码', type: 'varchar(18)', isPk: false, sensitivity: '高敏', termMapping: 'GB/T 32100', sourceSystem: '知识产权保护与高价值专利运营服务平台', description: '知识产权所有权主体信用代码' },
      { id: 'f53', name: 'ipr_type', label: '知识产权类别', type: 'varchar(30)', isPk: false, sensitivity: '公开', termMapping: 'GB/T 20000', sourceSystem: '知识产权保护与高价值专利运营服务平台', description: '发明专利/实用新型/外观设计/注册商标' },
      { id: 'f54', name: 'pledge_amount', label: '质押融资金额(万元)', type: 'decimal(14,2)', isPk: false, sensitivity: '公开', termMapping: 'GB/T 20000', sourceSystem: '知识产权保护与高价值专利运营服务平台', description: '通过质押评估获得的银行贷款额度' }
    ]
  },
  {
    id: 'coll-107',
    tableName: 'tb_12315_consumer_complaint',
    suggestedName: '12315消费者投诉举报与维权调解明细表',
    systemName: '12315行政执法与消费者权益保护平台',
    dbName: 'db_samr_12315',
    dbType: 'MySQL',
    deptName: '市市场监督管理局',
    fieldCount: 25,
    rowCount: '420,000 条',
    collectTime: '2026-07-28 16:40',
    healthStatus: 'healthy',
    status: 'cataloged', // 已编目完成
    primaryKey: 'complaint_id',
    indexCount: 3,
    partitionType: '按年度列表分区 (LIST)',
    storageEngine: 'InnoDB',
    createdAt: '2026-06-01 09:10:00',
    catalogTitle: '12315消费者投诉举报与维权调解明细表',
    catalogCode: 'RES-330100-SAMR-007',
    subjectDomain: '法人单位主题',
    categoryCode: 'CAT-330100-SAMR-07',
    industryCategory: '消费者权益保护',
    sourceBasicCatalogName: '消费者投诉举报受理与调解事项基本目录',
    sourceBasicCatalogCode: 'GOV-MAT-330100-SAMR-007',
    sourceBusinessItemName: '12315热线投诉转办与满意度回访',
    sourceBusinessItemCode: 'BUS-ITEM-330100-SAMR-107',
    dataLevel: '市级',
    sharingType: '无条件共享',
    sharingScope: '全市政务部门及各区县消费者权益保护委员会',
    usePurpose: '用于消费环境指数测评、预付款消费风险预警及消费维权联动',
    nonSharingReason: '',
    sharingMethod: 'API 接口 + 消息队列',
    implementationListTitle: '12315投诉举报处置与消费维权快速响应实施清单',
    relatedCatalogTitle: '全国12315互联网平台与消费维权云端协同平台',
    securityLevel: 'L2 (内部)',
    processingLevel: '清洗脱敏 + 智能文本分类',
    regionScope: '杭州市全域',
    timeScope: '2021年01月01日至今',
    providerUnit: '市市场监督管理局',
    updateFreq: '每季',
    description: '汇总市民通过12315热线及网络平台提交的商品质量、预付卡退款、餐饮卫生投诉及调解成功率。',
    dataOwner: '消保分局 - 钱队长',
    completionRate: 100,
    fields: [
      { id: 'f61', name: 'complaint_id', label: '12315投诉工单号', type: 'varchar(32)', isPk: true, sensitivity: '公开', termMapping: 'GB/T 32100', sourceSystem: '12315平台', description: '工单唯一标识' },
      { id: 'f62', name: 'target_unsc', label: '被投诉主体信用代码', type: 'varchar(18)', isPk: false, sensitivity: '高敏', termMapping: 'GB/T 32100', sourceSystem: '12315平台', description: '涉事商家18位社会信用代码' },
      { id: 'f63', name: 'problem_type', label: '问题分类描述', type: 'varchar(50)', isPk: false, sensitivity: '公开', termMapping: 'GB/T 20000', sourceSystem: '12315平台', description: '质量不合格/虚假宣传/退款拒绝/服务态度' }
    ]
  }
];

export const CatalogCompletionView: React.FC = () => {
  // Main Sub-Tab State inside 目录补全
  // Tab 1: 'collect_confirm' (采集数据确认)
  // Tab 2: 'pending_catalog' (待编目列表 / 编目补全)
  const [activeTab, setActiveTab] = useState<'collect_confirm' | 'pending_catalog'>('collect_confirm');

  // Master State of Tables
  const [tables, setTables] = useState<CollectedTableItem[]>(INITIAL_COLLECTED_TABLES);
  
  // Selection State in Tab 1 (采集待确认)
  const [selectedCollectIds, setSelectedCollectIds] = useState<string[]>([]);
  
  // Selected Item for Editor in Tab 2 (待编目)
  const [activeEditingId, setActiveEditingId] = useState<string | null>('coll-105');

  // Sub-tab State inside Tab 2 Editor Workspace (技术信息 vs 业务信息)
  const [activeEditorCategory, setActiveEditorCategory] = useState<'business' | 'technical'>('technical');
  
  // Sub-section State inside Business Info (基本要素 vs 扩展要素 vs 数据项信息)
  const [activeBusinessSection, setActiveBusinessSection] = useState<'basic' | 'extended' | 'fields'>('basic');

  // Table Relation Form State (in Technical Info)
  const [newRelSourceField, setNewRelSourceField] = useState('');
  const [newRelTargetTable, setNewRelTargetTable] = useState('');
  const [newRelTargetField, setNewRelTargetField] = useState('');
  const [newRelType, setNewRelType] = useState<'1:1' | '1:N' | 'N:M'>('1:N');
  const [newRelDesc, setNewRelDesc] = useState('');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSysFilter, setSelectedSysFilter] = useState('all');

  // AI Operation Loading States
  const [aiRunning, setAiRunning] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Derived filtered items for each tab
  const collectedUnconfirmedList = tables.filter(t => t.status === 'collected_unconfirmed');
  const pendingCatalogList = tables.filter(t => t.status === 'pending_catalog');

  // Active table being edited in Tab 2
  const currentEditingTable = tables.find(t => t.id === activeEditingId) || pendingCatalogList[0];

  // Search filter helper
  const filterList = (list: CollectedTableItem[]) => {
    return list.filter(item => {
      if (selectedSysFilter !== 'all' && item.systemName !== selectedSysFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.tableName.toLowerCase().includes(q) ||
          item.suggestedName.toLowerCase().includes(q) ||
          item.deptName.toLowerCase().includes(q) ||
          (item.catalogTitle && item.catalogTitle.toLowerCase().includes(q))
        );
      }
      return true;
    });
  };

  // Action 1: Confirm Single Collected Table -> Move to 待编目
  const handleConfirmSingleToCatalog = (id: string) => {
    setTables(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: 'pending_catalog',
          completionRate: Math.max(item.completionRate || 50, 60)
        };
      }
      return item;
    }));
    const item = tables.find(t => t.id === id);
    showToast(`已确认物理表【${item?.tableName}】，推送到【待编目】页签！`);
  };

  // Action 2: Batch Confirm Selected Collected Tables -> Move to 待编目
  const handleBatchConfirmToCatalog = () => {
    if (selectedCollectIds.length === 0) return;
    const count = selectedCollectIds.length;
    setTables(prev => prev.map(item => {
      if (selectedCollectIds.includes(item.id)) {
        return {
          ...item,
          status: 'pending_catalog',
          completionRate: Math.max(item.completionRate || 50, 60)
        };
      }
      return item;
    }));
    setSelectedCollectIds([]);
    showToast(`成功批量确认 ${count} 个采集表，已推送到【待编目】列表中！`);
    // Auto navigate to pending tab
    setTimeout(() => {
      setActiveTab('pending_catalog');
    }, 600);
  };

  // Select all toggle for Tab 1
  const filteredUnconfirmed = filterList(collectedUnconfirmedList);
  const isAllUnconfirmedSelected = filteredUnconfirmed.length > 0 && filteredUnconfirmed.every(i => selectedCollectIds.includes(i.id));

  const toggleSelectAllUnconfirmed = () => {
    if (isAllUnconfirmedSelected) {
      setSelectedCollectIds([]);
    } else {
      setSelectedCollectIds(filteredUnconfirmed.map(i => i.id));
    }
  };

  const toggleSelectUnconfirmed = (id: string) => {
    setSelectedCollectIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Action 3: AI Auto-fill for active editing table in Tab 2
  const handleAiAutoFillEditingTable = () => {
    if (!currentEditingTable) return;
    setAiRunning(true);
    setTimeout(() => {
      setAiRunning(false);
      setTables(prev => prev.map(t => {
        if (t.id === currentEditingTable.id) {
          return {
            ...t,
            completionRate: 100,
            catalogTitle: t.suggestedName,
            catalogCode: t.catalogCode || `RES-330100-${t.tableName.substring(3, 8).toUpperCase()}-001`,
            subjectDomain: t.subjectDomain || '法人单位主题',
            categoryCode: t.categoryCode || 'CAT-330100-SAMR-01',
            industryCategory: t.industryCategory || '市场监督管理与企业服务',
            sourceBasicCatalogName: t.sourceBasicCatalogName || '市场主体登记及许可监察事项基本目录',
            sourceBasicCatalogCode: t.sourceBasicCatalogCode || 'GOV-MAT-330100-SAMR-001',
            sourceBusinessItemName: t.sourceBusinessItemName || '市场主体设立许可与市场监督综合执法',
            sourceBusinessItemCode: t.sourceBusinessItemCode || 'BUS-ITEM-330100-SAMR-101',
            dataLevel: t.dataLevel || '市级',
            description: t.description || `本数据集来源于【${t.systemName}】，已通过AI推导对列属性、中文标注、共享密级、事项关联进行标准化合规映射。`,
            
            sharingType: t.sharingType || '有条件共享',
            sharingScope: t.sharingScope || '全市各级政务部门、公共服务机构及政务云协同节点',
            usePurpose: t.usePurpose || '用于跨部门协同审批、信用联合惩戒及市场主体精准监管',
            nonSharingReason: t.nonSharingReason || '包含企业敏感联系人及法定代表人身份信息，需通过有条件申请并脱敏后使用',
            sharingMethod: t.sharingMethod || 'RESTful API 接口服务 + 库表定时同步',
            implementationListTitle: t.implementationListTitle || '杭州市市场监督管理局数据资源编目管理实施清单',
            relatedCatalogTitle: t.relatedCatalogTitle || '全市企业信用信息共享平台与失信被执行人名录库',
            securityLevel: t.securityLevel || 'L3 (受控)',
            processingLevel: t.processingLevel || '清洗脱敏 + 逻辑融合',
            regionScope: t.regionScope || '杭州市全域 (含各区县市)',
            timeScope: t.timeScope || '2020年01月01日至今 (实时全量数据)',
            providerUnit: t.providerUnit || t.deptName,
            updateFreq: t.updateFreq || '每日',

            // 技术信息
            tableCnDescription: t.tableCnDescription || `存储【${t.suggestedName}】的完整物理结构表，包含主键索引及归属业务归档日志，用于满足每日跨系统数据流转。`,
            tableRelations: t.tableRelations && t.tableRelations.length > 0 ? t.tableRelations : [
              {
                id: 'rel-auto-1',
                sourceField: t.fields[0]?.name || 'id',
                targetTable: 'tb_administrative_division',
                targetField: 'div_code',
                relationType: '1:N',
                description: '关联行政区划代码基础维表'
              }
            ],
            fields: t.fields.map(f => ({
              ...f,
              sourceSystem: f.sourceSystem || t.systemName,
              description: f.description || `字段 ${f.name} 的业务技术含义：${f.label}`
            }))
          };
        }
        return t;
      }));
      showToast(`已运用 AI 智能补全【${currentEditingTable.suggestedName}】的技术与业务（基本/扩展/数据项）全套属性！`);
    }, 1000);
  };

  // Add & Delete Table Relation Handlers
  const handleAddTableRelation = () => {
    if (!currentEditingTable) return;
    if (!newRelTargetTable.trim() || !newRelTargetField.trim()) {
      showToast('请填写关联目标表名与目标字段！');
      return;
    }
    const newRel: TableRelationItem = {
      id: `rel-${Date.now()}`,
      sourceField: newRelSourceField || currentEditingTable.fields[0]?.name || 'id',
      targetTable: newRelTargetTable.trim(),
      targetField: newRelTargetField.trim(),
      relationType: newRelType,
      description: newRelDesc.trim() || '业务表间关联关系映射'
    };

    setTables(prev => prev.map(t => {
      if (t.id === currentEditingTable.id) {
        return {
          ...t,
          tableRelations: [...(t.tableRelations || []), newRel]
        };
      }
      return t;
    }));

    setNewRelTargetTable('');
    setNewRelTargetField('');
    setNewRelDesc('');
    showToast('已成功添加 1 条表关联关系！');
  };

  const handleDeleteTableRelation = (relId: string) => {
    if (!currentEditingTable) return;
    setTables(prev => prev.map(t => {
      if (t.id === currentEditingTable.id) {
        return {
          ...t,
          tableRelations: (t.tableRelations || []).filter(r => r.id !== relId)
        };
      }
      return t;
    }));
    showToast('已移除关联关系');
  };

  // Action 4: Save & Complete Cataloging -> Move to 已编目
  const handleCompleteCataloging = (id: string) => {
    setTables(prev => prev.map(t => {
      if (t.id === id) {
        return {
          ...t,
          status: 'cataloged',
          completionRate: 100
        };
      }
      return t;
    }));
    const target = tables.find(t => t.id === id);
    showToast(`🎉 成功完成【${target?.catalogTitle || target?.suggestedName}】目录编目补全并归档！`);
    
    // Switch editing table to next available pending
    const remainingPending = pendingCatalogList.filter(p => p.id !== id);
    if (remainingPending.length > 0) {
      setActiveEditingId(remainingPending[0].id);
    }
  };

  // Unique systems for dropdown filter
  const uniqueSystems = Array.from(new Set(tables.map(t => t.systemName)));

  return (
    <div className="flex-1 flex flex-col gap-4 p-5 bg-[#f8fafc] overflow-y-auto select-none min-h-[600px]">
      
      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200 border border-slate-700">
          <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* PRIMARY TAB NAVIGATION BAR (New Underline / Pill Hybrid Style) */}
      <div className="bg-white rounded-xl border border-slate-200/80 px-4 py-2 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* TAB 1: 采集数据确认 */}
          <button
            onClick={() => setActiveTab('collect_confirm')}
            className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'collect_confirm'
                ? 'bg-amber-500 text-white shadow-sm shadow-amber-200'
                : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/60'
            }`}
          >
            <Database className={`w-4 h-4 ${activeTab === 'collect_confirm' ? 'text-amber-100' : 'text-amber-500'}`} />
            <span>1. 采集数据确认</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
              activeTab === 'collect_confirm'
                ? 'bg-white/20 text-white'
                : 'bg-amber-100 text-amber-800'
            }`}>
              {collectedUnconfirmedList.length} 表待确认
            </span>
          </button>

          {/* TAB 2: 待编目列表 */}
          <button
            onClick={() => setActiveTab('pending_catalog')}
            className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'pending_catalog'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/60'
            }`}
          >
            <Edit3 className={`w-4 h-4 ${activeTab === 'pending_catalog' ? 'text-indigo-200' : 'text-indigo-600'}`} />
            <span>2. 待编目 (信息补全)</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
              activeTab === 'pending_catalog'
                ? 'bg-white/20 text-white'
                : 'bg-indigo-100 text-indigo-800'
            }`}>
              {pendingCatalogList.length} 个表待补全
            </span>
          </button>
        </div>
      </div>

      {/* TAB CONTENT 1: 采集数据确认 (COLLECT CONFIRM TAB) */}
      {activeTab === 'collect_confirm' && (
        <div className="space-y-4">
          
          {/* 待确认补全 检索条件 & 批量操作栏 */}
          <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-amber-900 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-xl text-amber-700 shrink-0">
                <Database className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-amber-900 text-sm">采集数据表待确认区</h4>
            </div>

            {/* 检索条件 (移至待确认补全栏) */}
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <div className="flex items-center gap-1.5 text-xs text-amber-900">
                <Filter className="w-3.5 h-3.5 text-amber-700" />
                <select
                  value={selectedSysFilter}
                  onChange={(e) => setSelectedSysFilter(e.target.value)}
                  className="bg-white border border-amber-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 font-medium"
                >
                  <option value="all">所有来源系统</option>
                  {uniqueSystems.map(sys => (
                    <option key={sys} value={sys}>{sys}</option>
                  ))}
                </select>
              </div>

              <div className="relative flex-1 md:w-60">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="搜索表名/推测名/单位..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white border border-amber-200 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-400"
                />
              </div>

              <button
                onClick={handleBatchConfirmToCatalog}
                disabled={selectedCollectIds.length === 0}
                className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                <CheckSquare className="w-4 h-4" />
                <span>确认补全 {selectedCollectIds.length > 0 ? `(${selectedCollectIds.length})` : ''}</span>
              </button>
            </div>
          </div>

          {/* Table Data Grid List */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
            {/* Table Header Controls */}
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleSelectAllUnconfirmed}
                  className="flex items-center gap-1.5 hover:text-slate-900 text-slate-700"
                >
                  {isAllUnconfirmedSelected ? (
                    <CheckSquare className="w-4 h-4 text-indigo-600" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400" />
                  )}
                  <span>全选 ({filteredUnconfirmed.length})</span>
                </button>
                <span className="text-slate-300">|</span>
                <span>采集表物理明细与初步关联推荐</span>
              </div>

              <div className="text-[11px] text-slate-400 font-mono">
                选中 {selectedCollectIds.length} / {filteredUnconfirmed.length} 项
              </div>
            </div>

            {/* List Body */}
            {filteredUnconfirmed.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <p className="text-sm font-bold text-slate-800">所有采集表均已确认推送！</p>
                <p className="text-xs text-slate-500">
                  当前暂无新采集待确认的数据表。您可以切换到【待编目】页签开始目录补全编制。
                </p>
                <button
                  onClick={() => setActiveTab('pending_catalog')}
                  className="mt-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
                >
                  前往【待编目】页签
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredUnconfirmed.map((item) => {
                  const isChecked = selectedCollectIds.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      className={`p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:bg-slate-50/80 ${
                        isChecked ? 'bg-amber-50/30' : ''
                      }`}
                    >
                      {/* Left Item Details */}
                      <div className="flex items-start gap-3.5 flex-1">
                        <button
                          onClick={() => toggleSelectUnconfirmed(item.id)}
                          className="mt-1 text-slate-400 hover:text-indigo-600 shrink-0"
                        >
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-indigo-600" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>

                        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100 text-amber-700 shrink-0">
                          <Database className="w-5 h-5" />
                        </div>

                        <div className="space-y-1 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-sm font-bold font-mono text-slate-900">
                              {item.tableName}
                            </h4>
                            <span className="text-xs font-semibold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded border border-amber-200">
                              推测名: {item.suggestedName}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                              {item.dbType}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-sans">
                            <span className="flex items-center gap-1 text-slate-700 font-medium">
                              <Building2 className="w-3.5 h-3.5 text-slate-400" />
                              {item.deptName}
                            </span>
                            <span>•</span>
                            <span>系统: {item.systemName} ({item.dbName})</span>
                            <span>•</span>
                            <span className="font-mono text-indigo-600 font-semibold">{item.fieldCount} 个列</span>
                            <span>•</span>
                            <span className="font-mono text-slate-600">{item.rowCount}</span>
                          </div>

                          {/* Field Badge Preview */}
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            {item.fields.map(f => (
                              <span key={f.id} className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                                {f.isPk && '🔑 '}{f.name} ({f.label})
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right Action */}
                      <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 justify-end">
                        <div className="text-right hidden lg:block">
                          <div className="text-[11px] text-slate-400">采集时间</div>
                          <div className="text-xs font-mono text-slate-600">{item.collectTime}</div>
                        </div>

                        <button
                          onClick={() => handleConfirmSingleToCatalog(item.id)}
                          className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs active:scale-[0.98]"
                        >
                          <Check className="w-3.5 h-3.5 text-amber-400" />
                          <span>确认补全</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: 待编目列表 (PENDING CATALOG COMPLETION WORKSPACE) */}
      {activeTab === 'pending_catalog' && (
        <div className="grid grid-cols-12 gap-4 flex-1 items-start">
          
          {/* Left: Pending Table Selection List (5 cols) */}
          <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col min-h-[500px]">
            <div className="p-3.5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  待补全目录列表 ({pendingCatalogList.length})
                </h3>
              </div>
              <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded font-semibold">
                已确认待编目
              </span>
            </div>

            {pendingCatalogList.length === 0 ? (
              <div className="p-8 text-center space-y-3">
                <Info className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs font-bold text-slate-700">暂无待补全的目录资源</p>
                <p className="text-[11px] text-slate-400">
                  请先在【1. 采集数据确认】页签中勾选采集来的物理数据表并点击“确认补全”。
                </p>
                <button
                  onClick={() => setActiveTab('collect_confirm')}
                  className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold hover:bg-amber-100 transition-colors"
                >
                  返回【1. 采集数据确认】
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 flex-1 overflow-y-auto max-h-[550px]">
                {pendingCatalogList.map((item) => {
                  const isActive = currentEditingTable?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setActiveEditingId(item.id)}
                      className={`p-3.5 cursor-pointer transition-all ${
                        isActive
                          ? 'bg-indigo-50/60 border-l-4 border-l-indigo-600 pl-3'
                          : 'hover:bg-slate-50 border-l-4 border-l-transparent'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-slate-900">
                            {item.catalogTitle || item.suggestedName}
                          </h4>
                          <div className="text-[11px] font-mono text-slate-500">
                            {item.tableName} ({item.dbType})
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500">
                            <span>{item.deptName}</span>
                            <span>•</span>
                            <span className="text-indigo-600 font-semibold">{item.subjectDomain || '待主题挂接'}</span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs font-bold font-mono text-indigo-600">
                            {item.completionRate || 50}%
                          </span>
                          <div className="w-14 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                            <div
                              className="h-full bg-indigo-600 rounded-full transition-all"
                              style={{ width: `${item.completionRate || 50}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Detailed Catalog Completion Workspace Form (8 cols) */}
          <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 space-y-5">
            {currentEditingTable ? (
              <>
                {/* Form Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {currentEditingTable.catalogTitle || currentEditingTable.suggestedName}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      来源: {currentEditingTable.systemName} | 单位: {currentEditingTable.deptName}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleAiAutoFillEditingTable}
                      disabled={aiRunning}
                      className="px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <Sparkles className={`w-3.5 h-3.5 ${aiRunning ? 'animate-spin' : ''}`} />
                      <span>{aiRunning ? 'AI 填报中...' : 'AI 智能一键填报'}</span>
                    </button>

                    <button
                      onClick={() => handleCompleteCataloging(currentEditingTable.id)}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
                    >
                      <Check className="w-4 h-4" />
                      <span>提交并完成编目</span>
                    </button>
                  </div>
                </div>

                {/* TWO MAIN CATEGORIES OF CATALOGING TOP-LEVEL TAB NAV (技术信息 vs 业务信息) */}
                <div className="flex items-center justify-between border-b border-slate-200/90 pb-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveEditorCategory('technical')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        activeEditorCategory === 'technical'
                          ? 'bg-slate-900 text-white shadow-sm shadow-slate-300'
                          : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
                      }`}
                    >
                      <Cpu className="w-4 h-4 text-amber-400" />
                      <span>技术信息编目</span>
                      <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] font-mono">
                        字段注释与标准
                      </span>
                    </button>

                    <button
                      onClick={() => setActiveEditorCategory('business')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        activeEditorCategory === 'business'
                          ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                          : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                      <span>业务信息编目</span>
                      <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] font-mono">
                        基本/扩展/数据项
                      </span>
                    </button>
                  </div>

                  {activeEditorCategory === 'business' && (
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-[11px] font-medium">
                      <button
                        onClick={() => setActiveBusinessSection('basic')}
                        className={`px-2.5 py-1 rounded-lg transition-all ${
                          activeBusinessSection === 'basic' ? 'bg-white text-indigo-700 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        基本要素
                      </button>
                      <button
                        onClick={() => setActiveBusinessSection('extended')}
                        className={`px-2.5 py-1 rounded-lg transition-all ${
                          activeBusinessSection === 'extended' ? 'bg-white text-indigo-700 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        扩展要素
                      </button>
                      <button
                        onClick={() => setActiveBusinessSection('fields')}
                        className={`px-2.5 py-1 rounded-lg transition-all ${
                          activeBusinessSection === 'fields' ? 'bg-white text-indigo-700 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        数据项信息 ({currentEditingTable.fields.length})
                      </button>
                    </div>
                  )}
                </div>

                {/* CATEGORY 1: BUSINESS INFORMATION (业务信息编目) */}
                {activeEditorCategory === 'business' && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    
                    {/* SECTION 1: BASIC ELEMENTS (基本要素) */}
                    {(activeBusinessSection === 'basic' || activeBusinessSection === 'basic') && (
                      <div className="space-y-3 border border-slate-200 rounded-xl overflow-hidden bg-white p-4 shadow-2xs">
                        <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-100">
                          <div className="flex items-center gap-1.5 font-bold text-slate-800">
                            <Tag className="w-4 h-4 text-indigo-600" />
                            <span>1. 基本要素补全 (Mandatory Core Metadata)</span>
                          </div>
                          <span className="text-slate-500 text-[11px] font-mono">
                            政务标准基本集
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                          <div>
                            <label className="block text-slate-700 font-semibold mb-1">数据目录名称 *</label>
                            <input
                              type="text"
                              value={currentEditingTable.catalogTitle || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setTables(prev => prev.map(t => t.id === currentEditingTable.id ? { ...t, catalogTitle: val } : t));
                              }}
                              className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 font-medium focus:border-indigo-500 focus:outline-none transition-all shadow-2xs"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-700 font-semibold mb-1">数据目录编码 *</label>
                            <input
                              type="text"
                              value={currentEditingTable.catalogCode || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setTables(prev => prev.map(t => t.id === currentEditingTable.id ? { ...t, catalogCode: val } : t));
                              }}
                              placeholder="例: RES-330100-POP-001"
                              className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 font-mono text-xs text-slate-800 font-semibold focus:border-indigo-500 focus:outline-none transition-all shadow-2xs"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-700 font-semibold mb-1">数据所属分类</label>
                            <select
                              value={currentEditingTable.subjectDomain || '全民人口主题'}
                              onChange={(e) => {
                                const val = e.target.value;
                                setTables(prev => prev.map(t => t.id === currentEditingTable.id ? { ...t, subjectDomain: val } : t));
                              }}
                              className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 font-medium focus:border-indigo-500 focus:outline-none transition-all shadow-2xs"
                            >
                              <option value="全民人口主题">全民人口主题</option>
                              <option value="法人单位主题">法人单位主题</option>
                              <option value="自然资源主题">自然资源主题</option>
                              <option value="宏观经济主题">宏观经济主题</option>
                              <option value="医疗卫生与健康">医疗卫生与健康</option>
                              <option value="交通运输与物流">交通运输与物流</option>
                              <option value="生态环境与气象">生态环境与气象</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-slate-700 font-semibold mb-1">分类编码</label>
                            <input
                              type="text"
                              value={currentEditingTable.categoryCode || 'CAT-330100-POP-01'}
                              onChange={(e) => {
                                const val = e.target.value;
                                setTables(prev => prev.map(t => t.id === currentEditingTable.id ? { ...t, categoryCode: val } : t));
                              }}
                              placeholder="例: CAT-330100-POP-01"
                              className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 font-mono text-xs text-slate-800 focus:border-indigo-500 focus:outline-none transition-all shadow-2xs"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-700 font-semibold mb-1">数据所属领域</label>
                            <input
                              type="text"
                              value={currentEditingTable.industryCategory || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setTables(prev => prev.map(t => t.id === currentEditingTable.id ? { ...t, industryCategory: val } : t));
                              }}
                              placeholder="例: 政务服务与公共管理"
                              className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none transition-all shadow-2xs"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-700 font-semibold mb-1">数据所在层级</label>
                            <select
                              value={currentEditingTable.dataLevel || '市级'}
                              onChange={(e) => {
                                const val = e.target.value;
                                setTables(prev => prev.map(t => t.id === currentEditingTable.id ? { ...t, dataLevel: val } : t));
                              }}
                              className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 font-medium focus:border-indigo-500 focus:outline-none transition-all shadow-2xs"
                            >
                              <option value="省级">省级</option>
                              <option value="市级">市级</option>
                              <option value="区县级">区县级</option>
                              <option value="乡镇/街道级">乡镇/街道级</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-slate-700 font-semibold mb-1">数据来源事项基本目录名称</label>
                            <input
                              type="text"
                              value={currentEditingTable.sourceBasicCatalogName || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setTables(prev => prev.map(t => t.id === currentEditingTable.id ? { ...t, sourceBasicCatalogName: val } : t));
                              }}
                              placeholder="例: 常住人口登记及户籍核验事项基本目录"
                              className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none transition-all shadow-2xs"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-700 font-semibold mb-1">数据来源事项基本目录编码</label>
                            <input
                              type="text"
                              value={currentEditingTable.sourceBasicCatalogCode || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setTables(prev => prev.map(t => t.id === currentEditingTable.id ? { ...t, sourceBasicCatalogCode: val } : t));
                              }}
                              placeholder="例: GOV-MAT-330100-019"
                              className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 font-mono text-xs text-slate-800 focus:border-indigo-500 focus:outline-none transition-all shadow-2xs"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-700 font-semibold mb-1">数据来源事项业务项名称</label>
                            <input
                              type="text"
                              value={currentEditingTable.sourceBusinessItemName || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setTables(prev => prev.map(t => t.id === currentEditingTable.id ? { ...t, sourceBusinessItemName: val } : t));
                              }}
                              placeholder="例: 户籍人口身份信息在线核查与变更登记"
                              className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none transition-all shadow-2xs"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-700 font-semibold mb-1">数据来源事项业务项编码</label>
                            <input
                              type="text"
                              value={currentEditingTable.sourceBusinessItemCode || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setTables(prev => prev.map(t => t.id === currentEditingTable.id ? { ...t, sourceBusinessItemCode: val } : t));
                              }}
                              placeholder="例: BUS-ITEM-330100-088"
                              className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 font-mono text-xs text-slate-800 focus:border-indigo-500 focus:outline-none transition-all shadow-2xs"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-slate-700 font-semibold mb-1">政务数据摘要 *</label>
                            <textarea
                              rows={2}
                              value={currentEditingTable.description || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setTables(prev => prev.map(t => t.id === currentEditingTable.id ? { ...t, description: val } : t));
                              }}
                              placeholder="请输入该政务数据集的具体业务含义、适用范围及归集背景说明..."
                              className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none transition-all shadow-2xs font-medium"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SECTION 2: EXTENDED ELEMENTS (扩展要素) */}
                    {(activeBusinessSection === 'extended' || activeBusinessSection === 'basic') && (
                      <div className="space-y-3 border border-slate-200 rounded-xl overflow-hidden bg-white p-4 shadow-2xs">
                        <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-100">
                          <div className="flex items-center gap-1.5 font-bold text-slate-800">
                            <Shield className="w-4 h-4 text-emerald-600" />
                            <span>2. 扩展要素补全 (Governance & Scope Elements)</span>
                          </div>
                          <span className="text-slate-500 text-[11px] font-mono">
                            共享与安全属性
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                          <div>
                            <label className="block text-slate-700 font-semibold mb-1">共享属性</label>
                            <select
                              value={currentEditingTable.sharingType || '有条件共享'}
                              onChange={(e) => {
                                const val = e.target.value;
                                setTables(prev => prev.map(t => t.id === currentEditingTable.id ? { ...t, sharingType: val as any } : t));
                              }}
                              className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 font-bold focus:border-indigo-500 focus:outline-none transition-all shadow-2xs"
                            >
                              <option value="无条件共享">无条件共享 (全网政务部门可用)</option>
                              <option value="有条件共享">有条件共享 (需审批授权后使用)</option>
                              <option value="不予共享">不予共享 (涉密或法律法规限定)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-slate-700 font-semibold mb-1">共享方式</label>
                            <input
                              type="text"
                              value={currentEditingTable.sharingMethod || 'RESTful API 接口服务 + 库表定时同步'}
                              onChange={(e) => {
                                const val = e.target.value;
                                setTables(prev => prev.map(t => t.id === currentEditingTable.id ? { ...t, sharingMethod: val } : t));
                              }}
                              placeholder="例: API 接口服务 / 库表对接 / 离线文件"
                              className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none transition-all shadow-2xs"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-700 font-semibold mb-1">共享范围</label>
                            <input
                              type="text"
                              value={currentEditingTable.sharingScope || '全市各级政务部门、公共服务机构'}
                              onChange={(e) => {
                                const val = e.target.value;
                                setTables(prev => prev.map(t => t.id === currentEditingTable.id ? { ...t, sharingScope: val } : t));
                              }}
                              placeholder="例: 全市各级政务部门"
                              className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none transition-all shadow-2xs"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-700 font-semibold mb-1">使用用途</label>
                            <input
                              type="text"
                              value={currentEditingTable.usePurpose || '用于跨部门协同审批、公共服务实名核验及人口大数据精准服务'}
                              onChange={(e) => {
                                const val = e.target.value;
                                setTables(prev => prev.map(t => t.id === currentEditingTable.id ? { ...t, usePurpose: val } : t));
                              }}
                              placeholder="例: 用于跨部门协同核验与业务审批"
                              className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none transition-all shadow-2xs"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-amber-900 font-bold mb-1 flex items-center gap-1">
                              <span>不予共享理由及依据</span>
                              <span className="text-[10px] text-amber-700 font-normal">(若选不予共享或有条件共享时需详述)</span>
                            </label>
                            <input
                              type="text"
                              value={currentEditingTable.nonSharingReason || '包含居民身份证号码及家庭住址敏感字段，需经公安部门授权并在脱敏后共享'}
                              onChange={(e) => {
                                const val = e.target.value;
                                setTables(prev => prev.map(t => t.id === currentEditingTable.id ? { ...t, nonSharingReason: val } : t));
                              }}
                              placeholder="例: 涉及个人隐私敏感信息，需按《数据安全法》严格脱敏审批"
                              className="w-full px-3 py-1.5 rounded-lg bg-amber-50/60 border border-amber-200 text-xs text-amber-950 focus:border-amber-500 font-medium"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-700 font-semibold mb-1">数据来源事项实施清单名称</label>
                            <input
                              type="text"
                              value={currentEditingTable.implementationListTitle || '杭州市常住人口信息登记核验服务实施清单'}
                              onChange={(e) => {
                                const val = e.target.value;
                                setTables(prev => prev.map(t => t.id === currentEditingTable.id ? { ...t, implementationListTitle: val } : t));
                              }}
                              className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none transition-all shadow-2xs"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-700 font-semibold mb-1">数据关联事项基本目录名称</label>
                            <input
                              type="text"
                              value={currentEditingTable.relatedCatalogTitle || '全市居民电子证照与社会保障卡基础数据库'}
                              onChange={(e) => {
                                const val = e.target.value;
                                setTables(prev => prev.map(t => t.id === currentEditingTable.id ? { ...t, relatedCatalogTitle: val } : t));
                              }}
                              className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none transition-all shadow-2xs"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-700 font-semibold mb-1">数据分级</label>
                            <select
                              value={currentEditingTable.securityLevel || 'L2 (内部)'}
                              onChange={(e) => {
                                const val = e.target.value;
                                setTables(prev => prev.map(t => t.id === currentEditingTable.id ? { ...t, securityLevel: val as any } : t));
                              }}
                              className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 focus:border-indigo-500 font-bold focus:outline-none transition-all shadow-2xs"
                            >
                              <option value="L1 (公开)">L1 (公开通用)</option>
                              <option value="L2 (内部)">L2 (部门内部)</option>
                              <option value="L3 (受控)">L3 (敏感受控)</option>
                              <option value="L4 (极密)">L4 (极度敏感)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-slate-700 font-semibold mb-1">数据加工程度</label>
                            <input
                              type="text"
                              value={currentEditingTable.processingLevel || '清洗脱敏 + 逻辑融合'}
                              onChange={(e) => {
                                const val = e.target.value;
                                setTables(prev => prev.map(t => t.id === currentEditingTable.id ? { ...t, processingLevel: val } : t));
                              }}
                              placeholder="例: 原始采集 / 清洗脱敏 / 融合加工"
                              className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none transition-all shadow-2xs"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-700 font-semibold mb-1">数据区域范围</label>
                            <input
                              type="text"
                              value={currentEditingTable.regionScope || '全市全域 (含各区县市)'}
                              onChange={(e) => {
                                const val = e.target.value;
                                setTables(prev => prev.map(t => t.id === currentEditingTable.id ? { ...t, regionScope: val } : t));
                              }}
                              className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none transition-all shadow-2xs"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-700 font-semibold mb-1">数据时间范围</label>
                            <input
                              type="text"
                              value={currentEditingTable.timeScope || '2020年01月01日至今 (实时全量数据)'}
                              onChange={(e) => {
                                const val = e.target.value;
                                setTables(prev => prev.map(t => t.id === currentEditingTable.id ? { ...t, timeScope: val } : t));
                              }}
                              className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none transition-all shadow-2xs"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-700 font-semibold mb-1">政务数据提供单位</label>
                            <input
                              type="text"
                              value={currentEditingTable.providerUnit || currentEditingTable.deptName}
                              onChange={(e) => {
                                const val = e.target.value;
                                setTables(prev => prev.map(t => t.id === currentEditingTable.id ? { ...t, providerUnit: val } : t));
                              }}
                              className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 focus:border-indigo-500 font-medium focus:outline-none transition-all shadow-2xs"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-700 font-semibold mb-1">数据更新频率</label>
                            <select
                              value={currentEditingTable.updateFreq || '每日'}
                              onChange={(e) => {
                                const val = e.target.value;
                                setTables(prev => prev.map(t => t.id === currentEditingTable.id ? { ...t, updateFreq: val as any } : t));
                              }}
                              className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none transition-all shadow-2xs"
                            >
                              <option value="实时">实时更新</option>
                              <option value="每日">每日更新</option>
                              <option value="每周">每周更新</option>
                              <option value="每月">每月更新</option>
                              <option value="每季">每季更新</option>
                              <option value="每年">每年更新</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SECTION 3: DATA ITEM INFORMATION (数据项信息) */}
                    {(activeBusinessSection === 'fields' || activeBusinessSection === 'basic') && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 font-bold text-slate-800">
                            <Layers className="w-4 h-4 text-indigo-600" />
                            <span>3. 数据项信息明细</span>
                          </div>
                          <span className="text-slate-500 text-[11px] font-mono">
                            共 {currentEditingTable.fields.length} 个数据项
                          </span>
                        </div>

                        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                          <table className="w-full text-left text-xs font-sans">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                              <tr>
                                <th className="py-2.5 px-3">数据项英文名称</th>
                                <th className="py-2.5 px-3">数据项中文名称</th>
                                <th className="py-2.5 px-3">数据格式</th>
                                <th className="py-2.5 px-3">来源系统</th>
                                <th className="py-2.5 px-3">系统所属分类</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-mono">
                              {currentEditingTable.fields.map((f) => (
                                <tr key={f.id} className="hover:bg-slate-50/80 transition-colors">
                                  <td className="py-2.5 px-3 font-bold text-slate-900">
                                    <div className="flex items-center gap-1.5 font-mono">
                                      {f.isPk && <span className="text-amber-500 shrink-0 font-sans" title="主键">🔑</span>}
                                      <span>{f.name}</span>
                                    </div>
                                  </td>
                                  <td className="py-2.5 px-3 font-sans">
                                    <input
                                      type="text"
                                      value={f.label}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setTables(prev => prev.map(t => {
                                          if (t.id === currentEditingTable.id) {
                                            return {
                                              ...t,
                                              fields: t.fields.map(fd => fd.id === f.id ? { ...fd, label: val } : fd)
                                            };
                                          }
                                          return t;
                                        }));
                                      }}
                                      className="w-full px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:outline-none"
                                    />
                                  </td>
                                  <td className="py-2.5 px-3 font-mono">
                                    <input
                                      type="text"
                                      value={formatDataType(f.type)}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setTables(prev => prev.map(t => {
                                          if (t.id === currentEditingTable.id) {
                                            return {
                                              ...t,
                                              fields: t.fields.map(fd => fd.id === f.id ? { ...fd, type: val } : fd)
                                            };
                                          }
                                          return t;
                                        }));
                                      }}
                                      placeholder="c100"
                                      className="w-24 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-mono font-bold text-indigo-700 focus:border-indigo-500 focus:outline-none"
                                    />
                                  </td>
                                  <td className="py-2.5 px-3 font-sans">
                                    <input
                                      type="text"
                                      value={f.sourceSystem || currentEditingTable.systemName}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setTables(prev => prev.map(t => {
                                          if (t.id === currentEditingTable.id) {
                                            return {
                                              ...t,
                                              fields: t.fields.map(fd => fd.id === f.id ? { ...fd, sourceSystem: val } : fd)
                                            };
                                          }
                                          return t;
                                        }));
                                      }}
                                      className="w-full px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:outline-none"
                                    />
                                  </td>
                                  <td className="py-2.5 px-3 font-sans">
                                    <select
                                      value={f.systemCategory || currentEditingTable.systemCategory || '自建自用'}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setTables(prev => prev.map(t => {
                                          if (t.id === currentEditingTable.id) {
                                            return {
                                              ...t,
                                              fields: t.fields.map(fd => fd.id === f.id ? { ...fd, systemCategory: val } : fd)
                                            };
                                          }
                                          return t;
                                        }));
                                      }}
                                      className="px-2.5 py-1 rounded-lg bg-amber-50/60 border border-amber-200/80 text-xs font-bold text-amber-900 focus:border-indigo-500 focus:outline-none shadow-2xs"
                                    >
                                      {['无', '自建自用', '国直', '省直', '市直', '县直'].map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                      ))}
                                    </select>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                  </div>
                )}

                {/* CATEGORY 2: TECHNICAL INFORMATION (技术信息编目 - 简洁聚焦表中文名与字段技术注释) */}
                {activeEditorCategory === 'technical' && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    
                    {/* 1. 数据表中文名称补全 */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-slate-800">
                          <FileText className="w-4 h-4 text-indigo-600" />
                          <span>数据表中文名称补全</span>
                        </div>
                        <span className="text-slate-500 text-[11px] font-mono">
                          物理表: {currentEditingTable.tableName}
                        </span>
                      </div>

                      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                        <table className="w-full text-left text-xs font-sans">
                          <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                            <tr>
                              <th className="py-2.5 px-3">物理表名</th>
                              <th className="py-2.5 px-3">状态</th>
                              <th className="py-2.5 px-3 w-2/3">表中文名称</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-mono">
                            <tr className="hover:bg-slate-50/80 transition-colors">
                              <td className="py-2.5 px-3 font-bold text-slate-900">
                                <div className="flex items-center gap-1.5 font-mono">
                                  <Database className="w-3.5 h-3.5 text-indigo-600 shrink-0 font-sans" />
                                  <span>{currentEditingTable.tableName}</span>
                                </div>
                                <span className="text-[10px] text-slate-400 font-normal block font-mono">
                                  {currentEditingTable.dbType || 'PostgreSQL'} · {currentEditingTable.dbName || 'db_samr'}
                                </span>
                              </td>

                              <td className="py-2.5 px-3 font-sans">
                                {currentEditingTable.suggestedName ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                                    <Check className="w-3 h-3" /> 已补全
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
                                    缺失名称
                                  </span>
                                )}
                              </td>

                              <td className="py-2.5 px-3 font-sans">
                                <div className="relative flex items-center">
                                  <input
                                    type="text"
                                    value={currentEditingTable.suggestedName || ''}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setTables(prev => prev.map(t => t.id === currentEditingTable.id ? { ...t, suggestedName: val, catalogTitle: val } : t));
                                    }}
                                    placeholder="请输入数据表的中文名称..."
                                    className="w-full px-2.5 py-1 rounded bg-white border border-slate-200 text-xs text-slate-900 font-bold focus:border-indigo-500"
                                  />
                                  <button
                                    onClick={() => {
                                      const autoName = currentEditingTable.catalogTitle || `${currentEditingTable.deptName || '市场监督管理局'}数据资源表`;
                                      setTables(prev => prev.map(t => t.id === currentEditingTable.id ? { ...t, suggestedName: autoName, catalogTitle: autoName } : t));
                                    }}
                                    className="ml-1 text-[10px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-1.5 py-1 rounded border border-indigo-200 shrink-0 flex items-center gap-0.5"
                                    title="单键 AI 推导表中文名称"
                                  >
                                    ⚡ 推导
                                  </button>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* 字段技术描述 */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-slate-800">
                          <LayoutGrid className="w-4 h-4 text-indigo-600" />
                          <span>字段技术描述补全</span>
                        </div>
                        <span className="text-slate-500 text-[11px] font-mono">
                          共 {currentEditingTable.fields.length} 列
                        </span>
                      </div>

                      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                        <table className="w-full text-left text-xs font-sans">
                          <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                            <tr>
                              <th className="py-2.5 px-3">物理列名</th>
                              <th className="py-2.5 px-3">状态</th>
                              <th className="py-2.5 px-3 w-2/3">字段技术描述</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-mono">
                            {currentEditingTable.fields.map((f) => {
                              const isCommentMissing = !f.description || f.description.includes('底层技术规范');
                              return (
                                <tr key={f.id} className={`hover:bg-slate-50/80 transition-colors ${isCommentMissing ? 'bg-amber-50/20' : ''}`}>
                                  <td className="py-2.5 px-3 font-bold text-slate-900">
                                    <div className="flex items-center gap-1">
                                      {f.isPk && <span className="text-amber-500 shrink-0 font-sans" title="主键">🔑</span>}
                                      <span>{f.name}</span>
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-normal block font-mono">
                                      {f.type}
                                    </span>
                                  </td>

                                  <td className="py-2.5 px-3 font-sans">
                                    {isCommentMissing ? (
                                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
                                        缺失注释
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                                        <Check className="w-3 h-3" /> 已补全
                                      </span>
                                    )}
                                  </td>

                                  <td className="py-2.5 px-3 font-sans">
                                    <div className="relative flex items-center">
                                      <input
                                        type="text"
                                        value={f.description && !f.description.includes('底层技术规范') ? f.description : ''}
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          setTables(prev => prev.map(t => {
                                            if (t.id === currentEditingTable.id) {
                                              return {
                                                ...t,
                                                fields: t.fields.map(fd => fd.id === f.id ? { ...fd, description: val } : fd)
                                              };
                                            }
                                            return t;
                                          }));
                                        }}
                                        placeholder={`请补充 ${f.name} 的底层字段含义...`}
                                        className={`w-full px-2.5 py-1 rounded bg-white border text-xs focus:border-indigo-500 ${
                                          isCommentMissing ? 'border-amber-300 text-amber-950 placeholder:text-amber-800/50' : 'border-slate-200 text-slate-800'
                                        }`}
                                      />
                                      <button
                                        onClick={() => {
                                          const autoDesc = `存储${f.label}（${f.name}），遵守相关政务监管规范，类型${f.type}。`;
                                          setTables(prev => prev.map(t => {
                                            if (t.id === currentEditingTable.id) {
                                              return {
                                                ...t,
                                                fields: t.fields.map(fd => fd.id === f.id ? { ...fd, description: autoDesc } : fd)
                                              };
                                            }
                                            return t;
                                          }));
                                        }}
                                        className="ml-1 text-[10px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-1.5 py-1 rounded border border-indigo-200 shrink-0"
                                        title="单键 AI 推导注释"
                                      >
                                        ⚡ 推导
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>

                  </div>
                )}
              </>
            ) : (
              <div className="py-20 text-center text-slate-400">
                <p className="text-xs">请在左侧待编目列表中选择要填报的资源</p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
