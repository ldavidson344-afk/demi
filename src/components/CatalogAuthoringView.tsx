import React, { useState } from 'react';
import {
  Building2,
  Database,
  Layers,
  Plus,
  Search,
  ChevronRight,
  ChevronDown,
  Filter,
  CheckCircle2,
  X,
  Sparkles,
  Tag,
  Shield,
  FileText,
  Trash2,
  Edit3,
  Clock,
  RotateCcw,
  Eye,
  Check,
  FolderOpen,
  Folder,
  SlidersHorizontal,
  Info,
  Save,
  Lock,
  Activity,
  CheckCircle,
  AlertCircle,
  Link2
} from 'lucide-react';
import { InformationItem, SharingType, UpdateFrequency, DataFormat, ResourceStatus } from '../types';

// Core Business Catalog Item Interface aligned with 业务信息编目
export interface AuthoringCatalogItem {
  id: string;
  catalogName: string;         // 数据目录名称 (与资源名称一致)
  catalogCode: string;         // 数据目录编码 (与资源代码一致)
  primaryCategory: '直属单位' | '基础库' | '主体库'; // 一级分类
  secondaryCategory: string;   // 二级分类
  deptName: string;            // 政务数据提供单位/部门
  sharingType: SharingType;    // 共享类型: 无条件共享 | 有条件共享 | 不予共享
  updateFreq: UpdateFrequency; // 更新频率: 实时 | 每日 | 每周 | 每月 | 每季 | 每年
  dataFormat: DataFormat;      // 数据存储格式: RDBMS | REST API | CSV / Excel | JSON / XML | PDF文件
  fieldCount: number;          // 核心数据项数量
  status: ResourceStatus | '已编制'; // 编目状态
  description: string;         // 业务摘要说明
  dataLevel?: string;          // 数据所在层级 (市级/省级/区县级)
  createdTime: string;         // 编目时间
  updatedTime?: string;        // 最新更新时间
  dataSource?: string;         // 挂接数据源
  attachStatus?: '已挂接' | '待挂接' | '挂接异常'; // 挂接状态
  infoItems: InformationItem[];// 关联元数据信息项定义
}

// Initial Mock Data aligned with 3 Primary Categories and complete 业务信息编目 schema
const INITIAL_AUTHORING_CATALOGS: AuthoringCatalogItem[] = [
  // 1. 直属单位
  {
    id: 'auth-101',
    catalogName: '全市市场主体登记注册及变更信息表',
    catalogCode: 'RES-330100-SAMR-001',
    primaryCategory: '直属单位',
    secondaryCategory: '市市场监督管理局',
    deptName: '市市场监督管理局',
    sharingType: '有条件共享',
    updateFreq: '每日',
    dataFormat: 'RDBMS',
    fieldCount: 5,
    status: '已发布',
    dataLevel: '市级',
    description: '归集全市各类企业、个体工商户的统一社会信用代码、法定代表人、注册资本、许可经营范围及存续状态。',
    createdTime: '2026-07-20 14:30',
    updatedTime: '2026-07-28 09:15',
    dataSource: 'MySQL - db_samr.tb_corp_registration',
    attachStatus: '已挂接',
    infoItems: [
      { id: 'f-101-1', fieldName: 'unsc_code', fieldLabel: '统一社会信用代码', dataType: 'varchar', length: '18', isPrimaryKey: true, isRequired: true, maskRule: '无', sharingCondition: '全网共享', description: '18位国家统一社会信用代码' },
      { id: 'f-101-2', fieldName: 'corp_name', fieldLabel: '企业名称', dataType: 'varchar', length: '100', isPrimaryKey: false, isRequired: true, maskRule: '无', sharingCondition: '全网共享', description: '市场主体登记全称' },
      { id: 'f-101-3', fieldName: 'legal_person', fieldLabel: '法定代表人', dataType: 'varchar', length: '50', isPrimaryKey: false, isRequired: true, maskRule: '姓名脱敏', sharingCondition: '申请审批共享', description: '企业法定代表人姓名' },
      { id: 'f-101-4', fieldName: 'reg_capital', fieldLabel: '注册资本(万元)', dataType: 'decimal', length: '14,2', isPrimaryKey: false, isRequired: false, maskRule: '无', sharingCondition: '全网共享', description: '币种为人民币万元' },
      { id: 'f-101-5', fieldName: 'establish_date', fieldLabel: '成立日期', dataType: 'datetime', length: '19', isPrimaryKey: false, isRequired: true, maskRule: '无', sharingCondition: '全网共享', description: '核准设立登记时间' }
    ]
  },
  {
    id: 'auth-102',
    catalogName: '医疗卫生机构及从业人员资质名录',
    catalogCode: 'RES-330100-HC-002',
    primaryCategory: '直属单位',
    secondaryCategory: '市卫生健康委员会',
    deptName: '市卫生健康委员会',
    sharingType: '无条件共享',
    updateFreq: '每月',
    dataFormat: 'RDBMS',
    fieldCount: 4,
    status: '已编制',
    dataLevel: '市级',
    description: '收录全市各级医院、社区卫生服务中心及诊所的标准名称、执业许可及医疗卫生从业人员资质明细。',
    createdTime: '2026-07-22 10:15',
    updatedTime: '2026-07-29 11:00',
    dataSource: 'PostgreSQL - db_health.tb_hospitals',
    attachStatus: '已挂接',
    infoItems: [
      { id: 'f-102-1', fieldName: 'hospital_code', fieldLabel: '医疗机构代码', dataType: 'varchar', length: '18', isPrimaryKey: true, isRequired: true, maskRule: '无', sharingCondition: '全网共享', description: '医疗卫生机构统一标识码' },
      { id: 'f-102-2', fieldName: 'hospital_name', fieldLabel: '机构名称', dataType: 'varchar', length: '100', isPrimaryKey: false, isRequired: true, maskRule: '无', sharingCondition: '全网共享', description: '医疗机构官方注册全称' },
      { id: 'f-102-3', fieldName: 'hospital_grade', fieldLabel: '医院等次', dataType: 'varchar', length: '20', isPrimaryKey: false, isRequired: true, maskRule: '无', sharingCondition: '全网共享', description: '如三级甲等、二级甲等' },
      { id: 'f-102-4', fieldName: 'legal_rep', fieldLabel: '负责人姓名', dataType: 'varchar', length: '50', isPrimaryKey: false, isRequired: true, maskRule: '姓名脱敏', sharingCondition: '申请审批共享', description: '主要负责人/院长姓名' }
    ]
  },
  {
    id: 'auth-103',
    catalogName: '常住人口户籍登记及身份核验数据集',
    catalogCode: 'RES-330100-PS-003',
    primaryCategory: '直属单位',
    secondaryCategory: '市公安局',
    deptName: '市公安局',
    sharingType: '有条件共享',
    updateFreq: '每日',
    dataFormat: 'REST API',
    fieldCount: 4,
    status: '已发布',
    dataLevel: '市级',
    description: '用于全市户籍人口、流动人口基本身份核验、常住地址绑定及跨部门业务协同确认。',
    createdTime: '2026-07-18 16:40',
    updatedTime: '2026-07-28 17:20',
    dataSource: 'API - https://api.police.gov/v1/citizen/verify',
    attachStatus: '已挂接',
    infoItems: [
      { id: 'f-103-1', fieldName: 'id_card', fieldLabel: '公民身份证号', dataType: 'varchar', length: '18', isPrimaryKey: true, isRequired: true, maskRule: '身份证脱敏', sharingCondition: '申请审批共享', description: '公民唯一身份识别号' },
      { id: 'f-103-2', fieldName: 'person_name', fieldLabel: '姓名', dataType: 'varchar', length: '50', isPrimaryKey: false, isRequired: true, maskRule: '姓名脱敏', sharingCondition: '申请审批共享', description: '人口登记姓名' },
      { id: 'f-103-3', fieldName: 'gender', fieldLabel: '性别', dataType: 'varchar', length: '2', isPrimaryKey: false, isRequired: true, maskRule: '无', sharingCondition: '全网共享', description: '男 / 女' },
      { id: 'f-103-4', fieldName: 'residence_addr', fieldLabel: '户籍地址', dataType: 'varchar', length: '200', isPrimaryKey: false, isRequired: true, maskRule: '地址模糊化', sharingCondition: '申请审批共享', description: '公安登记常住户籍地址' }
    ]
  },
  {
    id: 'auth-104',
    catalogName: '社会组织及民办非企业单位登记目录',
    catalogCode: 'RES-330100-MCA-004',
    primaryCategory: '直属单位',
    secondaryCategory: '市民政局',
    deptName: '市民政局',
    sharingType: '无条件共享',
    updateFreq: '每月',
    dataFormat: 'CSV / Excel',
    fieldCount: 3,
    status: '已编制',
    dataLevel: '市级',
    description: '全市社会团体、民办非企业单位及基金会的成立登记、法定代表人、业务主管单位及年检结果。',
    createdTime: '2026-07-25 09:20',
    updatedTime: '2026-07-27 14:00',
    dataSource: 'MySQL - db_mca.tb_social_orgs',
    attachStatus: '待挂接',
    infoItems: [
      { id: 'f-104-1', fieldName: 'org_code', fieldLabel: '社会组织统一代码', dataType: 'varchar', length: '18', isPrimaryKey: true, isRequired: true, maskRule: '无', sharingCondition: '全网共享', description: '社会组织统一社会信用代码' },
      { id: 'f-104-2', fieldName: 'org_name', fieldLabel: '组织名称', dataType: 'varchar', length: '100', isPrimaryKey: false, isRequired: true, maskRule: '无', sharingCondition: '全网共享', description: '社会团体登记全称' },
      { id: 'f-104-3', fieldName: 'org_type', fieldLabel: '组织类型', dataType: 'varchar', length: '30', isPrimaryKey: false, isRequired: true, maskRule: '无', sharingCondition: '全网共享', description: '社会团体 / 民办非企业单位' }
    ]
  },
  {
    id: 'auth-105',
    catalogName: '水环境质量实时监测与排污口检测库',
    catalogCode: 'RES-330100-EPB-005',
    primaryCategory: '直属单位',
    secondaryCategory: '市生态环境局',
    deptName: '市生态环境局',
    sharingType: '无条件共享',
    updateFreq: '实时',
    dataFormat: 'JSON / XML',
    fieldCount: 4,
    status: '已编制',
    dataLevel: '市级',
    description: '全市主要水系、国控与省控水质断面监测指标（溶解氧、氨氮、高锰酸盐指数）实时采集数据。',
    createdTime: '2026-07-26 11:05',
    updatedTime: '2026-07-29 15:30',
    dataSource: 'API - https://epb.gov.cn/api/water/realtime',
    attachStatus: '已挂接',
    infoItems: [
      { id: 'f-105-1', fieldName: 'station_id', fieldLabel: '监测站点编号', dataType: 'varchar', length: '20', isPrimaryKey: true, isRequired: true, maskRule: '无', sharingCondition: '全网共享', description: '水质自动监测站编码' },
      { id: 'f-105-2', fieldName: 'river_name', fieldLabel: '所属河流名称', dataType: 'varchar', length: '50', isPrimaryKey: false, isRequired: true, maskRule: '无', sharingCondition: '全网共享', description: '国控水系名称' },
      { id: 'f-105-3', fieldName: 'water_quality', fieldLabel: '水质类别', dataType: 'varchar', length: '10', isPrimaryKey: false, isRequired: true, maskRule: '无', sharingCondition: '全网共享', description: 'Ⅰ类 / Ⅱ类 / Ⅲ类 / 劣Ⅴ类' },
      { id: 'f-105-4', fieldName: 'ph_val', fieldLabel: 'pH值', dataType: 'decimal', length: '4,2', isPrimaryKey: false, isRequired: false, maskRule: '无', sharingCondition: '全网共享', description: '酸碱度指示值' }
    ]
  },

  // 2. 基础库
  {
    id: 'auth-201',
    catalogName: '全民人口基础数据库 (人口库)',
    catalogCode: 'BASE-POP-330100-01',
    primaryCategory: '基础库',
    secondaryCategory: '全民人口基础库',
    deptName: '市公安局 / 市民政局 / 市人社局',
    sharingType: '有条件共享',
    updateFreq: '实时',
    dataFormat: 'RDBMS',
    fieldCount: 4,
    status: '已发布',
    dataLevel: '市级',
    description: '整合公安户籍、民政婚姻、人社社保等多部门人口基础信息，构建全市统一的人口基准主数据。',
    createdTime: '2026-07-10 08:30',
    updatedTime: '2026-07-29 08:00',
    dataSource: 'Oracle - db_base.tb_pop_master',
    attachStatus: '已挂接',
    infoItems: [
      { id: 'f-201-1', fieldName: 'citizen_id', fieldLabel: '身份证号', dataType: 'varchar', length: '18', isPrimaryKey: true, isRequired: true, maskRule: '身份证脱敏', sharingCondition: '申请审批共享', description: '自然人身份证唯一标识' },
      { id: 'f-201-2', fieldName: 'name', fieldLabel: '姓名', dataType: 'varchar', length: '50', isPrimaryKey: false, isRequired: true, maskRule: '姓名脱敏', sharingCondition: '申请审批共享', description: '人口真实全名' },
      { id: 'f-201-3', fieldName: 'birth_date', fieldLabel: '出生日期', dataType: 'datetime', length: '19', isPrimaryKey: false, isRequired: true, maskRule: '无', sharingCondition: '全网共享', description: '公历出生年月日' },
      { id: 'f-201-4', fieldName: 'ethnicity', fieldLabel: '民族', dataType: 'varchar', length: '10', isPrimaryKey: false, isRequired: false, maskRule: '无', sharingCondition: '全网共享', description: '汉族 / 少数民族' }
    ]
  },
  {
    id: 'auth-202',
    catalogName: '法人单位基础数据库 (法人库)',
    catalogCode: 'BASE-CORP-330100-02',
    primaryCategory: '基础库',
    secondaryCategory: '法人单位基础库',
    deptName: '市市场监督管理局 / 市编办',
    sharingType: '有条件共享',
    updateFreq: '实时',
    dataFormat: 'RDBMS',
    fieldCount: 3,
    status: '已发布',
    dataLevel: '市级',
    description: '覆盖企业法人、机关法人、事业单位法人、社会团体法人及其他组织的统一归集与唯一身份识别。',
    createdTime: '2026-07-12 14:20',
    updatedTime: '2026-07-29 10:30',
    dataSource: 'MySQL - db_base.tb_legal_entities',
    attachStatus: '已挂接',
    infoItems: [
      { id: 'f-202-1', fieldName: 'uscc', fieldLabel: '统一社会信用代码', dataType: 'varchar', length: '18', isPrimaryKey: true, isRequired: true, maskRule: '无', sharingCondition: '全网共享', description: '法人单位统一代码' },
      { id: 'f-202-2', fieldName: 'legal_entity_name', fieldLabel: '法人单位名称', dataType: 'varchar', length: '100', isPrimaryKey: false, isRequired: true, maskRule: '无', sharingCondition: '全网共享', description: '机构官方全称' },
      { id: 'f-202-3', fieldName: 'entity_type', fieldLabel: '法人类型', dataType: 'varchar', length: '30', isPrimaryKey: false, isRequired: true, maskRule: '无', sharingCondition: '全网共享', description: '企业 / 机关 / 事业单位' }
    ]
  },
  {
    id: 'auth-203',
    catalogName: '自然资源与空间地理基础信息库',
    catalogCode: 'BASE-GEO-330100-03',
    primaryCategory: '基础库',
    secondaryCategory: '自然资源与空间地理库',
    deptName: '市自然资源与规划局',
    sharingType: '无条件共享',
    updateFreq: '每月',
    dataFormat: 'JSON / XML',
    fieldCount: 3,
    status: '已编制',
    dataLevel: '市级',
    description: '包含城市地形地貌、行政区划边界、三维建筑白模及土地利用现状等基础矢量数据。',
    createdTime: '2026-07-15 17:00',
    updatedTime: '2026-07-26 14:10',
    dataSource: 'GIS GeoJSON - db_spatial.layers',
    attachStatus: '待挂接',
    infoItems: [
      { id: 'f-203-1', fieldName: 'geo_id', fieldLabel: '空间要素标识', dataType: 'varchar', length: '32', isPrimaryKey: true, isRequired: true, maskRule: '无', sharingCondition: '全网共享', description: '空间要素UUID' },
      { id: 'f-203-2', fieldName: 'feature_name', fieldLabel: '地理要素名称', dataType: 'varchar', length: '100', isPrimaryKey: false, isRequired: true, maskRule: '无', sharingCondition: '全网共享', description: '地图要素显示文本' },
      { id: 'f-203-3', fieldName: 'spatial_type', fieldLabel: '空间几何类型', dataType: 'varchar', length: '20', isPrimaryKey: false, isRequired: true, maskRule: '无', sharingCondition: '全网共享', description: 'Point / LineString / Polygon' }
    ]
  },
  {
    id: 'auth-204',
    catalogName: '电子证照基础资源目录库',
    catalogCode: 'BASE-CERT-330100-04',
    primaryCategory: '基础库',
    secondaryCategory: '电子证照基础库',
    deptName: '市数据资源管理局',
    sharingType: '有条件共享',
    updateFreq: '实时',
    dataFormat: 'REST API',
    fieldCount: 3,
    status: '已发布',
    dataLevel: '市级',
    description: '汇聚全市各部门核发的营业执照、不动产权证、结婚证、出生医学证明等核心证照目录及元数据。',
    createdTime: '2026-07-16 09:40',
    updatedTime: '2026-07-29 16:45',
    dataSource: 'API - https://cert.gov.cn/api/v1/license',
    attachStatus: '已挂接',
    infoItems: [
      { id: 'f-204-1', fieldName: 'license_id', fieldLabel: '证照流水号', dataType: 'varchar', length: '32', isPrimaryKey: true, isRequired: true, maskRule: '无', sharingCondition: '全网共享', description: '电子证照标识编码' },
      { id: 'f-204-2', fieldName: 'license_name', fieldLabel: '电子证照名称', dataType: 'varchar', length: '100', isPrimaryKey: false, isRequired: true, maskRule: '无', sharingCondition: '全网共享', description: '证照类型名称' },
      { id: 'f-204-3', fieldName: 'holder_code', fieldLabel: '持证主体代码', dataType: 'varchar', length: '18', isPrimaryKey: false, isRequired: true, maskRule: '身份证脱敏', sharingCondition: '申请审批共享', description: '身份证或统一信用代码' }
    ]
  },
  {
    id: 'auth-205',
    catalogName: '宏观经济与社会发展统计指标基础库',
    catalogCode: 'BASE-ECON-330100-05',
    primaryCategory: '基础库',
    secondaryCategory: '宏观经济基础库',
    deptName: '市统计局 / 市发改委',
    sharingType: '无条件共享',
    updateFreq: '每月',
    dataFormat: 'CSV / Excel',
    fieldCount: 3,
    status: '已编制',
    dataLevel: '市级',
    description: '全市地区生产总值(GDP)、固定资产投资、社会消费品零售总额、进出口贸易额等经济统计指标。',
    createdTime: '2026-07-21 15:10',
    updatedTime: '2026-07-27 11:20',
    dataSource: 'MySQL - db_econ.tb_macro_stats',
    attachStatus: '已挂接',
    infoItems: [
      { id: 'f-205-1', fieldName: 'stat_id', fieldLabel: '指标记录ID', dataType: 'varchar', length: '32', isPrimaryKey: true, isRequired: true, maskRule: '无', sharingCondition: '全网共享', description: '统计维度主键' },
      { id: 'f-205-2', fieldName: 'metric_name', fieldLabel: '经济指标名称', dataType: 'varchar', length: '100', isPrimaryKey: false, isRequired: true, maskRule: '无', sharingCondition: '全网共享', description: '如GDP同比增速' },
      { id: 'f-205-3', fieldName: 'metric_val', fieldLabel: '指标数值', dataType: 'decimal', length: '16,2', isPrimaryKey: false, isRequired: true, maskRule: '无', sharingCondition: '全网共享', description: '统计结果数值' }
    ]
  },

  // 3. 主体库
  {
    id: 'auth-301',
    catalogName: '市场主体综合监管与信用评价库',
    catalogCode: 'SUBJ-SAMR-330100-01',
    primaryCategory: '主体库',
    secondaryCategory: '市场主体综合库',
    deptName: '市市场监督管理局',
    sharingType: '有条件共享',
    updateFreq: '每日',
    dataFormat: 'RDBMS',
    fieldCount: 3,
    status: '已发布',
    dataLevel: '市级',
    description: '涵盖市场主体经营异常名录、严重违法失信名单、双随机抽查结果及综合信用风险分级分类指标。',
    createdTime: '2026-07-14 11:25',
    updatedTime: '2026-07-28 13:10',
    dataSource: 'PostgreSQL - db_credit.tb_market_subject',
    attachStatus: '已挂接',
    infoItems: [
      { id: 'f-301-1', fieldName: 'corp_uscc', fieldLabel: '统一社会信用代码', dataType: 'varchar', length: '18', isPrimaryKey: true, isRequired: true, maskRule: '无', sharingCondition: '全网共享', description: '主体统一社会信用代码' },
      { id: 'f-301-2', fieldName: 'credit_score', fieldLabel: '信用综合得分', dataType: 'decimal', length: '5,1', isPrimaryKey: false, isRequired: true, maskRule: '无', sharingCondition: '全网共享', description: '信用评级分值(0-100)' },
      { id: 'f-301-3', fieldName: 'risk_level', fieldLabel: '风险等级分类', dataType: 'varchar', length: '10', isPrimaryKey: false, isRequired: true, maskRule: '无', sharingCondition: '全网共享', description: '高 / 中 / 低 / 极低' }
    ]
  },
  {
    id: 'auth-302',
    catalogName: '综合行政执法办案与行政处罚数据集',
    catalogCode: 'SUBJ-LAW-330100-02',
    primaryCategory: '主体库',
    secondaryCategory: '执法办案与行政处罚库',
    deptName: '市司法局 / 市市场监督管理局',
    sharingType: '有条件共享',
    updateFreq: '每周',
    dataFormat: 'RDBMS',
    fieldCount: 3,
    status: '已编制',
    dataLevel: '市级',
    description: '归集跨部门行政处罚决定书、违法事实认定、处罚金额及执行状态，支持“互联网+监管”协同。',
    createdTime: '2026-07-19 13:50',
    updatedTime: '2026-07-28 10:00',
    dataSource: 'MySQL - db_law.tb_penalties',
    attachStatus: '已挂接',
    infoItems: [
      { id: 'f-302-1', fieldName: 'case_no', fieldLabel: '执法办案文号', dataType: 'varchar', length: '50', isPrimaryKey: true, isRequired: true, maskRule: '无', sharingCondition: '全网共享', description: '行政处罚决定书文号' },
      { id: 'f-302-2', fieldName: 'party_name', fieldLabel: '当事人名称', dataType: 'varchar', length: '100', isPrimaryKey: false, isRequired: true, maskRule: '姓名脱敏', sharingCondition: '申请审批共享', description: '被处罚对象名称' },
      { id: 'f-302-3', fieldName: 'punish_amount', fieldLabel: '处罚金额(元)', dataType: 'decimal', length: '12,2', isPrimaryKey: false, isRequired: false, maskRule: '无', sharingCondition: '全网共享', description: '行政罚款金额' }
    ]
  },
  {
    id: 'auth-303',
    catalogName: '特种设备安全监察及定期检验名录表',
    catalogCode: 'SUBJ-SPEC-330100-03',
    primaryCategory: '主体库',
    secondaryCategory: '特种设备安全监管库',
    deptName: '市市场监督管理局',
    sharingType: '有条件共享',
    updateFreq: '每日',
    dataFormat: 'RDBMS',
    fieldCount: 3,
    status: '已编制',
    dataLevel: '市级',
    description: '电梯、起重机械、压力容器、场(厂)内专用机动车辆的登记代码、使用单位、检验合格有效期及维保记录。',
    createdTime: '2026-07-23 16:15',
    updatedTime: '2026-07-28 15:40',
    dataSource: 'MySQL - db_equip.tb_special_equip',
    attachStatus: '已挂接',
    infoItems: [
      { id: 'f-303-1', fieldName: 'equip_code', fieldLabel: '特种设备代码', dataType: 'varchar', length: '20', isPrimaryKey: true, isRequired: true, maskRule: '无', sharingCondition: '全网共享', description: '设备登记唯一代码' },
      { id: 'f-303-2', fieldName: 'equip_type', fieldLabel: '设备类别', dataType: 'varchar', length: '30', isPrimaryKey: false, isRequired: true, maskRule: '无', sharingCondition: '全网共享', description: '如电梯、压力容器' },
      { id: 'f-303-3', fieldName: 'next_inspect_date', fieldLabel: '下次定检日期', dataType: 'datetime', length: '19', isPrimaryKey: false, isRequired: true, maskRule: '无', sharingCondition: '全网共享', description: '定期安全检验到期时间' }
    ]
  },
  {
    id: 'auth-304',
    catalogName: '专利申请与知识产权运营保护数据集',
    catalogCode: 'SUBJ-IPR-330100-04',
    primaryCategory: '主体库',
    secondaryCategory: '知识产权与专利运营库',
    deptName: '市市场监督管理局 (知识产权局)',
    sharingType: '无条件共享',
    updateFreq: '每月',
    dataFormat: 'CSV / Excel',
    fieldCount: 3,
    status: '已发布',
    dataLevel: '市级',
    description: '全市发明专利、实用新型、外观设计授权量、专利权人、高价值专利标识及知识产权维权援助记录。',
    createdTime: '2026-07-24 10:45',
    updatedTime: '2026-07-28 09:30',
    dataSource: 'PostgreSQL - db_ipr.tb_patents',
    attachStatus: '已挂接',
    infoItems: [
      { id: 'f-304-1', fieldName: 'patent_no', fieldLabel: '专利申请号', dataType: 'varchar', length: '30', isPrimaryKey: true, isRequired: true, maskRule: '无', sharingCondition: '全网共享', description: '国家知识产权局专利号' },
      { id: 'f-304-2', fieldName: 'patent_title', fieldLabel: '专利名称', dataType: 'varchar', length: '200', isPrimaryKey: false, isRequired: true, maskRule: '无', sharingCondition: '全网共享', description: '专利申请核准名称' },
      { id: 'f-304-3', fieldName: 'applicant', fieldLabel: '专利权人', dataType: 'varchar', length: '100', isPrimaryKey: false, isRequired: true, maskRule: '无', sharingCondition: '全网共享', description: '专利所有人/申请单位' }
    ]
  },
  {
    id: 'auth-305',
    catalogName: '消费维权与 12315 热线投诉举报调解库',
    catalogCode: 'SUBJ-12315-330100-05',
    primaryCategory: '主体库',
    secondaryCategory: '消费维权与12315投诉库',
    deptName: '市市场监督管理局',
    sharingType: '有条件共享',
    updateFreq: '每周',
    dataFormat: 'RDBMS',
    fieldCount: 3,
    status: '已编制',
    dataLevel: '市级',
    description: '汇总市民通过12315热线及网络平台提交的商品质量、预付卡退款、餐饮卫生投诉工单及调解成功率。',
    createdTime: '2026-07-27 14:00',
    updatedTime: '2026-07-29 14:20',
    dataSource: 'MySQL - db_12315.tb_complaints',
    attachStatus: '待挂接',
    infoItems: [
      { id: 'f-305-1', fieldName: 'complaint_id', fieldLabel: '投诉工单号', dataType: 'varchar', length: '32', isPrimaryKey: true, isRequired: true, maskRule: '无', sharingCondition: '全网共享', description: '12315热线工单ID' },
      { id: 'f-305-2', fieldName: 'target_uscc', fieldLabel: '被投诉主体信用代码', dataType: 'varchar', length: '18', isPrimaryKey: false, isRequired: true, maskRule: '无', sharingCondition: '全网共享', description: '被举报商户统一代码' },
      { id: 'f-305-3', fieldName: 'problem_type', fieldLabel: '问题分类', dataType: 'varchar', length: '50', isPrimaryKey: false, isRequired: true, maskRule: '无', sharingCondition: '全网共享', description: '预付卡退款 / 餐饮卫生' }
    ]
  }
];

// Tree structure categories
interface CategoryTreeStructure {
  id: string;
  name: '直属单位' | '基础库' | '主体库';
  icon: React.ReactNode;
  children: {
    id: string;
    name: string;
  }[];
}

const CATEGORY_TREE_STRUCTURE: CategoryTreeStructure[] = [
  {
    id: 'cat_unit',
    name: '直属单位',
    icon: <Building2 className="w-4 h-4 text-indigo-600" />,
    children: [
      { id: 'unit_1', name: '市市场监督管理局' },
      { id: 'unit_2', name: '市卫生健康委员会' },
      { id: 'unit_3', name: '市公安局' },
      { id: 'unit_4', name: '市民政局' },
      { id: 'unit_5', name: '市生态环境局' },
      { id: 'unit_6', name: '市数据资源管理局' },
    ]
  },
  {
    id: 'cat_base',
    name: '基础库',
    icon: <Database className="w-4 h-4 text-blue-600" />,
    children: [
      { id: 'base_1', name: '全民人口基础库' },
      { id: 'base_2', name: '法人单位基础库' },
      { id: 'base_3', name: '自然资源与空间地理库' },
      { id: 'base_4', name: '电子证照基础库' },
      { id: 'base_5', name: '宏观经济基础库' },
    ]
  },
  {
    id: 'cat_subject',
    name: '主体库',
    icon: <Layers className="w-4 h-4 text-emerald-600" />,
    children: [
      { id: 'subj_1', name: '市场主体综合库' },
      { id: 'subj_2', name: '执法办案与行政处罚库' },
      { id: 'subj_3', name: '特种设备安全监管库' },
      { id: 'subj_4', name: '知识产权与专利运营库' },
      { id: 'subj_5', name: '消费维权与12315投诉库' },
    ]
  }
];

export const CatalogAuthoringView: React.FC = () => {
  // State for Catalog Records
  const [catalogs, setCatalogs] = useState<AuthoringCatalogItem[]>(INITIAL_AUTHORING_CATALOGS);

  // Selection Filter State for Classification Tree
  const [selectedTreeCategory, setSelectedTreeCategory] = useState<string | null>(null);
  const [selectedPrimaryFilter, setSelectedPrimaryFilter] = useState<'全部' | '直属单位' | '基础库' | '主体库'>('全部');

  // Tree Expansion State
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    '直属单位': true,
    '基础库': true,
    '主体库': true
  });

  // Search & Filter state for List
  const [searchQuery, setSearchQuery] = useState('');
  const [treeSearchKeyword, setTreeSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<AuthoringCatalogItem | null>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Toggle Category Tree Expansion
  const toggleCategoryExpand = (catName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCategories(prev => ({ ...prev, [catName]: !prev[catName] }));
  };

  // Helper to count catalog items in category
  const countItems = (primary?: string, secondary?: string) => {
    return catalogs.filter(item => {
      if (primary && item.primaryCategory !== primary) return false;
      if (secondary && item.secondaryCategory !== secondary) return false;
      return true;
    }).length;
  };

  // Filter Catalog List based on Tree selection, Primary Filter, Status, and Search Query
  const filteredCatalogs = catalogs.filter(item => {
    // Top Primary Filter Tab (if selected)
    if (selectedPrimaryFilter !== '全部' && item.primaryCategory !== selectedPrimaryFilter) {
      return false;
    }

    // Left Tree Selection
    if (selectedTreeCategory) {
      if (selectedTreeCategory === '直属单位' || selectedTreeCategory === '基础库' || selectedTreeCategory === '主体库') {
        if (item.primaryCategory !== selectedTreeCategory) return false;
      } else {
        if (item.secondaryCategory !== selectedTreeCategory && item.deptName !== selectedTreeCategory) return false;
      }
    }

    // Status Filter
    if (statusFilter !== 'all' && item.status !== statusFilter) {
      return false;
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.catalogName.toLowerCase().includes(q) ||
        item.catalogCode.toLowerCase().includes(q) ||
        item.deptName.toLowerCase().includes(q) ||
        item.secondaryCategory.toLowerCase().includes(q)
      );
    }

    return true;
  });

  // Action: Add New Catalog Handler
  const handleAddNewCatalog = (newCatalog: AuthoringCatalogItem) => {
    setCatalogs(prev => [newCatalog, ...prev]);
    showToast(`🎉 成功创建新业务编目【${newCatalog.catalogName}】！`);
  };

  // Action: Save Updated Catalog Details
  const handleSaveCatalogDetails = (updated: AuthoringCatalogItem) => {
    setCatalogs(prev => prev.map(c => c.id === updated.id ? updated : c));
    showToast(`已成功保存【${updated.catalogName}】的结构更新`);
  };

  // Action: Publish Catalog
  const handlePublishCatalog = (id: string, name: string) => {
    setCatalogs(prev => prev.map(c => c.id === id ? { ...c, status: '已发布' } : c));
    showToast(`已成功发布编目【${name}】！`);
  };

  // Action: Delete Catalog
  const handleDeleteCatalog = (id: string, name: string) => {
    setCatalogs(prev => prev.filter(c => c.id !== id));
    showToast(`已成功移除编目【${name}】`);
  };

  return (
    <div className="flex-1 flex flex-col gap-4 p-5 bg-[#f8fafc] overflow-y-auto select-none min-h-[650px]">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200 border border-slate-700">
          <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* VIEW HEADER & SUMMARY METRICS BAR */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-100 shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 tracking-tight leading-none">
                政务数据业务信息目录编制
              </h2>
              <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 font-mono">
                标准三级分类
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-normal">
              面向直属单位、基础库与主体库进行核心业务编目管理，规范化定义与业务信息编目完全保持一致的信息项 Schema。
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => {
              setSelectedTreeCategory(null);
              setSelectedPrimaryFilter('全部');
              setSearchQuery('');
              setStatusFilter('all');
              showToast('重置全量视图与筛选条件');
            }}
            className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition-all flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>重置筛选</span>
          </button>

          {/* Core Button: 新增编目 */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-200 flex items-center gap-1.5 active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>新增编目</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA: LEFT CLASSIFICATION TREE (分类树) + RIGHT CORE LIST (右侧核心列表) */}
      <div className="grid grid-cols-12 gap-4 flex-1 items-start">
        
        {/* LEFT SIDE: CATEGORY TREE */}
        <div className="col-span-12 lg:col-span-3 bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col min-h-[580px] overflow-hidden">
          
          {/* Tree Header */}
          <div className="p-3.5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>目录分类树 (Category Tree)</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
              共 {catalogs.length} 条
            </span>
          </div>

          {/* Search Box in Tree */}
          <div className="p-3 border-b border-slate-100 bg-white">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="搜索分类或单位..."
                value={treeSearchKeyword}
                onChange={(e) => setTreeSearchKeyword(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Category Tree List Body */}
          <div className="p-2 space-y-1 overflow-y-auto max-h-[520px] flex-1 font-sans text-xs">
            
            {/* Root "全部目录" Option */}
            <div
              onClick={() => {
                setSelectedTreeCategory(null);
                setSelectedPrimaryFilter('全部');
              }}
              className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-all ${
                selectedTreeCategory === null && selectedPrimaryFilter === '全部'
                  ? 'bg-indigo-600 text-white font-bold shadow-sm shadow-indigo-100'
                  : 'hover:bg-slate-100/80 text-slate-800 font-semibold'
              }`}
            >
              <div className="flex items-center gap-2">
                <FolderOpen className={`w-4 h-4 ${selectedTreeCategory === null && selectedPrimaryFilter === '全部' ? 'text-white' : 'text-indigo-600'}`} />
                <span>全部数据目录</span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                selectedTreeCategory === null && selectedPrimaryFilter === '全部'
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {catalogs.length}
              </span>
            </div>

            <div className="my-1.5 border-t border-slate-100"></div>

            {/* Render Primary Categories */}
            {CATEGORY_TREE_STRUCTURE.map((catGroup) => {
              const isExpanded = expandedCategories[catGroup.name];
              const isPrimarySelected = selectedTreeCategory === catGroup.name || selectedPrimaryFilter === catGroup.name;
              const groupCount = countItems(catGroup.name);

              const matchedChildren = catGroup.children.filter(child =>
                !treeSearchKeyword.trim() || child.name.toLowerCase().includes(treeSearchKeyword.toLowerCase())
              );

              if (treeSearchKeyword.trim() && matchedChildren.length === 0 && !catGroup.name.includes(treeSearchKeyword)) {
                return null;
              }

              return (
                <div key={catGroup.id} className="space-y-0.5">
                  <div
                    onClick={() => {
                      setSelectedTreeCategory(catGroup.name);
                      setSelectedPrimaryFilter(catGroup.name);
                    }}
                    className={`flex items-center justify-between px-2.5 py-2 rounded-xl cursor-pointer transition-all ${
                      isPrimarySelected
                        ? 'bg-indigo-50 border border-indigo-200/90 text-indigo-950 font-bold'
                        : 'hover:bg-slate-50 text-slate-800 font-semibold'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => toggleCategoryExpand(catGroup.name, e)}
                        className="p-1 hover:bg-slate-200/60 rounded text-slate-500 transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <div className="flex items-center gap-1.5">
                        {catGroup.icon}
                        <span className="text-xs font-bold">{catGroup.name}</span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      isPrimarySelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {groupCount}
                    </span>
                  </div>

                  {/* 2nd Level Children Nodes */}
                  {isExpanded && (
                    <div className="pl-6 space-y-0.5 border-l-2 border-indigo-100/80 ml-4 py-0.5">
                      {matchedChildren.map((child) => {
                        const isChildSelected = selectedTreeCategory === child.name;
                        const childCount = countItems(catGroup.name, child.name);

                        return (
                          <div
                            key={child.id}
                            onClick={() => {
                              setSelectedTreeCategory(child.name);
                              setSelectedPrimaryFilter('全部');
                            }}
                            className={`flex items-center justify-between py-1.5 px-2.5 rounded-lg cursor-pointer text-xs transition-all ${
                              isChildSelected
                                ? 'bg-indigo-600 text-white font-bold shadow-xs'
                                : 'hover:bg-slate-100/80 text-slate-600 font-medium'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 truncate">
                              <Tag className={`w-3 h-3 shrink-0 ${isChildSelected ? 'text-indigo-200' : 'text-slate-400'}`} />
                              <span className="truncate">{child.name}</span>
                            </div>
                            <span className={`text-[10px] font-mono shrink-0 ml-1 font-semibold ${
                              isChildSelected ? 'text-indigo-100' : 'text-slate-400'
                            }`}>
                              {childCount}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

          </div>

          {/* Tree Footer Tip */}
          <div className="p-3 bg-slate-50/90 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span>点击树节点联动右侧目录明细</span>
          </div>
        </div>

        {/* RIGHT SIDE: CORE LIST */}
        <div className="col-span-12 lg:col-span-9 bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col min-h-[580px] overflow-hidden">
          
          {/* Top Filter Tabs & Search Controls */}
          <div className="p-4 bg-slate-50/80 border-b border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
            
            {/* Primary Category Quick Filters */}
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
              {(['全部', '直属单位', '基础库', '主体库'] as const).map((tab) => {
                const isActive = selectedPrimaryFilter === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => {
                      setSelectedPrimaryFilter(tab);
                      setSelectedTreeCategory(tab === '全部' ? null : tab);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {tab}
                    <span className={`ml-1.5 text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {tab === '全部' ? catalogs.length : countItems(tab)}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right Search Input and Status Dropdown */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl focus:outline-none focus:border-indigo-500 shadow-2xs"
              >
                <option value="all">所有状态</option>
                <option value="已发布">已发布</option>
                <option value="已编制">已编制</option>
                <option value="待上报">待上报</option>
                <option value="草稿">草稿</option>
              </select>

              <div className="relative flex-1 md:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="搜索目录名称、编码或归属单位..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-400 shadow-2xs"
                />
              </div>
            </div>

          </div>

          {/* CORE TABLE */}
          <div className="flex-1 overflow-x-auto">
            {filteredCatalogs.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <Info className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-700">暂无符合条件的编目数据</p>
                <p className="text-xs text-slate-500">
                  请尝试重置筛选搜索条件，或点击右上角“新增编目”创建新的数据目录。
                </p>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="mt-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold"
                >
                  新增编目
                </button>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/90 border-b border-slate-200/80 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    <th className="py-3 px-4 w-12 text-center whitespace-nowrap shrink-0">序号</th>
                    <th className="py-3 px-4">目录名称</th>
                    <th className="py-3 px-4">目录编码</th>
                    <th className="py-3 px-4">责任部门</th>
                    <th className="py-3 px-4">共享方式</th>
                    <th className="py-3 px-4 text-center">发布状态</th>
                    <th className="py-3 px-4 text-right whitespace-nowrap">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-sans">
                  {filteredCatalogs.map((item, index) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/90 transition-colors group cursor-pointer"
                      onClick={() => setDetailItem(item)}
                    >
                      {/* Index */}
                      <td className="py-3.5 px-4 font-mono text-slate-400 text-center font-medium whitespace-nowrap">
                        {index + 1}
                      </td>

                      {/* Catalog Name */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                          {item.catalogName}
                        </div>
                      </td>

                      {/* Catalog Code */}
                      <td className="py-3.5 px-4 font-mono font-bold text-indigo-700 text-[11px] shrink-0">
                        {item.catalogCode}
                      </td>

                      {/* Responsible Dept */}
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-800">{item.deptName}</span>
                      </td>

                      {/* Sharing Mode */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-block ${
                          item.sharingType === '无条件共享'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                            : item.sharingType === '有条件共享'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200/80'
                            : 'bg-rose-50 text-rose-700 border border-rose-200/80'
                        }`}>
                          {item.sharingType}
                        </span>
                      </td>

                      {/* Publish Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold inline-block ${
                          item.status === '已发布'
                            ? 'bg-emerald-500 text-white'
                            : item.status === '已编制' || item.status === '已审核'
                            ? 'bg-indigo-600 text-white'
                            : item.status === '待上报' || item.status === '已上报'
                            ? 'bg-amber-500 text-white'
                            : 'bg-slate-200 text-slate-700'
                        }`}>
                          {item.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {item.status !== '已发布' && (
                            <button
                              onClick={() => handlePublishCatalog(item.id, item.catalogName)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 text-xs font-bold transition-all shadow-2xs"
                              title="发布目录"
                            >
                              发布
                            </button>
                          )}
                          <button
                            onClick={() => setDetailItem(item)}
                            className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white border border-indigo-200 text-xs font-bold transition-all shadow-2xs"
                            title="变更/修改明细"
                          >
                            变更
                          </button>
                          <button
                            onClick={() => handleDeleteCatalog(item.id, item.catalogName)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="移除此编目"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Table Footer */}
          <div className="p-3 px-4 bg-slate-50/80 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500 font-sans">
            <div>
              显示 <span className="font-bold text-slate-800">{filteredCatalogs.length}</span> / {catalogs.length} 条业务编目
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              元数据结构与业务信息编目完整对齐
            </div>
          </div>

        </div>

      </div>

      {/* MODAL: ADD NEW CATALOG */}
      {isAddModalOpen && (
        <AddCatalogModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddNewCatalog}
        />
      )}

      {/* MODAL: CATALOG DETAIL OVERLAY */}
      {detailItem && (
        <CatalogDetailModal
          item={detailItem}
          onClose={() => setDetailItem(null)}
          onSave={handleSaveCatalogDetails}
        />
      )}

    </div>
  );
};

// ============================================================================
// ADD CATALOG MODAL COMPONENT (新增编目弹窗 - 与待编目/信息补全之业务信息编目基本/扩展/数据项完全保持一致)
// ============================================================================
interface AddCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (catalog: AuthoringCatalogItem) => void;
}

const AddCatalogModal: React.FC<AddCatalogModalProps> = ({ isOpen, onClose, onAdd }) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'basic' | 'extended' | 'fields'>('basic');

  // 基本要素 states (匹配图片1)
  const [catalogName, setCatalogName] = useState('全市市场价格监督检查与违法案件查处记录数据集');
  const [catalogCode, setCatalogCode] = useState('RES-330100-SAMR-005');
  const [subjectDomain, setSubjectDomain] = useState('法人单位主题');
  const [categoryCode, setCategoryCode] = useState('CAT-330100-SAMR-05');
  const [industryCategory, setIndustryCategory] = useState('价格监管与反垄断执法');
  const [dataLevel, setDataLevel] = useState('市级');
  const [primaryCategory, setPrimaryCategory] = useState<'直属单位' | '基础库' | '主体库'>('直属单位');
  const [secondaryCategory, setSecondaryCategory] = useState('市市场监督管理局');
  const [sourceBasicCatalogName, setSourceBasicCatalogName] = useState('价格监督检查与价格违法行为查处事项基本目录');
  const [sourceBasicCatalogCode, setSourceBasicCatalogCode] = useState('GOV-MAT-330100-SAMR-005');
  const [sourceBusinessItemName, setSourceBusinessItemName] = useState('民生商品价格监测与不正当价格行为查处');
  const [sourceBusinessItemCode, setSourceBusinessItemCode] = useState('BUS-ITEM-330100-SAMR-105');
  const [description, setDescription] = useState('记录重要民生商品价格监测巡查日志、哄抬价格、串通涨价与虚假折扣等行政处罚案件文书号与结果。');

  // 扩展要素 states (匹配图片2)
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
  const [deptName, setDeptName] = useState('市市场监督管理局');
  const [updateFreq, setUpdateFreq] = useState<UpdateFrequency>('每日');
  const [dataFormat, setDataFormat] = useState<DataFormat>('RDBMS');
  const [dataSource, setDataSource] = useState('MySQL - db_samr_price_case.tb_market_price_inspection');

  // Rich Information Items list (匹配图片3)
  const [infoItems, setInfoItems] = useState<InformationItem[]>([
    { id: `f-1`, fieldName: 'case_id', fieldLabel: '行政处罚案件唯一编号', dataType: 'c32', length: '32', isPrimaryKey: true, isRequired: true, maskRule: '无', sharingCondition: '有条件共享', description: '立案查处编号', sourceSystem: '价格监督检查与反不正当竞争执法系统', systemCategory: '自建自用' },
    { id: `f-2`, fieldName: 'unsc_code', fieldLabel: '被检查单位信用代码', dataType: 'c18', length: '18', isPrimaryKey: false, isRequired: true, maskRule: '高敏', sharingCondition: '有条件共享', description: '被处罚主体的18位统一社会信用代码', sourceSystem: '价格监督检查与反不正当竞争执法系统', systemCategory: '自建自用' },
    { id: `f-3`, fieldName: 'illegal_type', fieldLabel: '违法行为分类描述', dataType: 'c100', length: '100', isPrimaryKey: false, isRequired: true, maskRule: '无', sharingCondition: '有条件共享', description: '哄抬价格/价格欺诈/明码标价不规范等', sourceSystem: '价格监督检查与反不正当竞争执法系统', systemCategory: '自建自用' },
    { id: `f-4`, fieldName: 'penalty_amount', fieldLabel: '行政处罚金额(元)', dataType: 'n12,2', length: '12,2', isPrimaryKey: false, isRequired: false, maskRule: '无', sharingCondition: '有条件共享', description: '没收违法所得及罚款合计数额', sourceSystem: '价格监督检查与反不正当竞争执法系统', systemCategory: '自建自用' },
  ]);

  // Secondary category mappings
  const secondaryOptionsMap: Record<'直属单位' | '基础库' | '主体库', string[]> = {
    '直属单位': ['市市场监督管理局', '市卫生健康委员会', '市公安局', '市民政局', '市生态环境局', '市数据资源管理局'],
    '基础库': ['全民人口基础库', '法人单位基础库', '自然资源与空间地理库', '电子证照基础库', '宏观经济基础库'],
    '主体库': ['市场主体综合库', '执法办案与行政处罚库', '特种设备安全监管库', '知识产权与专利运营库', '消费维权与12315投诉库']
  };

  const handlePrimaryChange = (val: '直属单位' | '基础库' | '主体库') => {
    setPrimaryCategory(val);
    const opts = secondaryOptionsMap[val];
    setSecondaryCategory(opts[0]);
    if (val === '直属单位') {
      setDeptName(opts[0]);
    }
  };

  const handleAddInfoItem = () => {
    const nextIdx = infoItems.length + 1;
    setInfoItems(prev => [
      ...prev,
      {
        id: `f-${Date.now()}-${nextIdx}`,
        fieldName: `field_${nextIdx}`,
        fieldLabel: `新信息项_${nextIdx}`,
        dataType: 'c100',
        length: '100',
        isPrimaryKey: false,
        isRequired: false,
        maskRule: '无',
        sharingCondition: '全网共享',
        description: '信息项字段说明'
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
    if (!catalogName.trim()) return;

    const newItem: AuthoringCatalogItem = {
      id: `auth-${Date.now()}`,
      catalogName: catalogName.trim(),
      catalogCode: catalogCode.trim(),
      primaryCategory,
      secondaryCategory,
      deptName: deptName.trim() || secondaryCategory,
      sharingType,
      updateFreq,
      dataFormat,
      fieldCount: infoItems.length,
      status: '已编制',
      dataLevel,
      description: description.trim() || '新建政务数据业务编目信息资源描述。',
      createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
      updatedTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
      dataSource,
      attachStatus: '待挂接',
      infoItems
    };

    onAdd(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"></div>

      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 z-10 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600 rounded-xl text-white font-bold">
              <Plus className="w-4 h-4 stroke-[3]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">新增政务业务信息编目</h3>
              <p className="text-[11px] text-slate-300">与待编目 (信息补全) 之业务信息编目结构 (基本/扩展/数据项) 完全一致</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs Bar (与信息补全完全一致) */}
        <div className="px-6 pt-3 pb-2 bg-slate-50 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-xl text-xs font-medium border border-slate-300/60">
            <button
              type="button"
              onClick={() => setActiveTab('basic')}
              className={`flex-1 py-1.5 rounded-lg text-center font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'basic'
                  ? 'bg-indigo-600 text-white shadow-xs'
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
                  ? 'bg-indigo-600 text-white shadow-xs'
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
                  ? 'bg-indigo-600 text-white shadow-xs'
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
          
          {/* TAB 1: 基本要素 */}
          {activeTab === 'basic' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-150">
              
              {/* Catalog Name */}
              <div className="md:col-span-2">
                <label className="block text-slate-700 font-bold mb-1">
                  数据目录名称 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="例: 全市食品经营许可及餐饮服务监督数据"
                  value={catalogName}
                  onChange={(e) => setCatalogName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white shadow-2xs"
                />
              </div>

              {/* Catalog Code */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  数据目录编码 <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={catalogCode}
                    onChange={(e) => setCatalogCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs font-bold text-indigo-700 focus:outline-none focus:border-indigo-500 focus:bg-white shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setCatalogCode(`RES-330100-2026-${Math.floor(100 + Math.random() * 900)}`)}
                    className="px-2.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs shrink-0"
                    title="生成随机编码"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  </button>
                </div>
              </div>

              {/* Primary & Secondary Category */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  目录编制分类 <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={primaryCategory}
                    onChange={(e) => handlePrimaryChange(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-xl bg-indigo-50/70 border border-indigo-200 text-xs font-bold text-indigo-950 focus:outline-none focus:border-indigo-500 shadow-2xs"
                  >
                    <option value="直属单位">直属单位</option>
                    <option value="基础库">基础库</option>
                    <option value="主体库">主体库</option>
                  </select>
                  <select
                    value={secondaryCategory}
                    onChange={(e) => {
                      setSecondaryCategory(e.target.value);
                      if (primaryCategory === '直属单位') {
                        setDeptName(e.target.value);
                      }
                    }}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 shadow-2xs"
                  >
                    {secondaryOptionsMap[primaryCategory].map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subject Domain (数据所属分类) */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">数据所属分类</label>
                <select
                  value={subjectDomain}
                  onChange={(e) => setSubjectDomain(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 shadow-2xs"
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

              {/* Category Code (分类编码) */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">分类编码</label>
                <input
                  type="text"
                  value={categoryCode}
                  onChange={(e) => setCategoryCode(e.target.value)}
                  placeholder="例: CAT-330100-POP-01"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800 focus:outline-none focus:border-indigo-500 shadow-2xs"
                />
              </div>

              {/* Industry Category (数据所属领域) */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">数据所属领域</label>
                <input
                  type="text"
                  value={industryCategory}
                  onChange={(e) => setIndustryCategory(e.target.value)}
                  placeholder="例: 政务服务与公共管理"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 shadow-2xs"
                />
              </div>

              {/* Data Level (数据所在层级) */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">数据所在层级</label>
                <select
                  value={dataLevel}
                  onChange={(e) => setDataLevel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 shadow-2xs"
                >
                  <option value="省级">省级</option>
                  <option value="市级">市级</option>
                  <option value="区县级">区县级</option>
                  <option value="乡镇/街道级">乡镇/街道级</option>
                </select>
              </div>

              {/* Source Basic Catalog Name */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">数据来源事项基本目录名称</label>
                <input
                  type="text"
                  value={sourceBasicCatalogName}
                  onChange={(e) => setSourceBasicCatalogName(e.target.value)}
                  placeholder="例: 统一社会信用代码赋码核发"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 shadow-2xs"
                />
              </div>

              {/* Source Basic Catalog Code */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">数据来源事项基本目录编码</label>
                <input
                  type="text"
                  value={sourceBasicCatalogCode}
                  onChange={(e) => setSourceBasicCatalogCode(e.target.value)}
                  placeholder="例: ITEM-330000-00123"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800 focus:outline-none focus:border-indigo-500 shadow-2xs"
                />
              </div>

              {/* Source Business Item Name */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">数据来源事项业务项名称</label>
                <input
                  type="text"
                  value={sourceBusinessItemName}
                  onChange={(e) => setSourceBusinessItemName(e.target.value)}
                  placeholder="例: 法人开办变更登记业务项"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 shadow-2xs"
                />
              </div>

              {/* Source Business Item Code */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">数据来源事项业务项编码</label>
                <input
                  type="text"
                  value={sourceBusinessItemCode}
                  onChange={(e) => setSourceBusinessItemCode(e.target.value)}
                  placeholder="例: BIZ-009231"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800 focus:outline-none focus:border-indigo-500 shadow-2xs"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-slate-700 font-bold mb-1">
                  政务数据摘要 <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="请简要说明该政务数据集归集背景、适用范围及核心业务含义..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 shadow-2xs"
                />
              </div>

            </div>
          )}

          {/* TAB 2: 扩展要素 */}
          {activeTab === 'extended' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-150">
              
              {/* Sharing Type */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">共享属性</label>
                <select
                  value={sharingType}
                  onChange={(e) => setSharingType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 shadow-2xs"
                >
                  <option value="无条件共享">无条件共享</option>
                  <option value="有条件共享">有条件共享</option>
                  <option value="不予共享">不予共享</option>
                </select>
              </div>

              {/* Sharing Method */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">共享方式</label>
                <input
                  type="text"
                  value={sharingMethod}
                  onChange={(e) => setSharingMethod(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500 shadow-2xs"
                />
              </div>

              {/* Sharing Scope */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">共享范围</label>
                <input
                  type="text"
                  value={sharingScope}
                  onChange={(e) => setSharingScope(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500 shadow-2xs"
                />
              </div>

              {/* Security Level */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">数据分级</label>
                <select
                  value={securityLevel}
                  onChange={(e) => setSecurityLevel(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 shadow-2xs"
                >
                  <option value="L1 (公开)">L1 (公开)</option>
                  <option value="L2 (内部)">L2 (内部)</option>
                  <option value="L3 (受控)">L3 (受控)</option>
                  <option value="L4 (极密)">L4 (极密)</option>
                </select>
              </div>

              {/* Use Purpose */}
              <div className="md:col-span-2">
                <label className="block text-slate-700 font-bold mb-1">使用用途</label>
                <input
                  type="text"
                  value={usePurpose}
                  onChange={(e) => setUsePurpose(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500 shadow-2xs"
                />
              </div>

              {/* Non Sharing Reason */}
              {sharingType === '不予共享' && (
                <div className="md:col-span-2">
                  <label className="block text-rose-700 font-bold mb-1">不予共享理由及依据</label>
                  <input
                    type="text"
                    value={nonSharingReason}
                    onChange={(e) => setNonSharingReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-rose-50/50 border border-rose-200 text-xs text-rose-900 focus:outline-none focus:border-rose-500 shadow-2xs"
                  />
                </div>
              )}

              {/* Implementation List Title */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">数据来源事项实施清单名称</label>
                <input
                  type="text"
                  value={implementationListTitle}
                  onChange={(e) => setImplementationListTitle(e.target.value)}
                  placeholder="例: 全市个体工商户设立开办实施清单"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 shadow-2xs"
                />
              </div>

              {/* Related Catalog Title */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">数据关联事项基本目录名称</label>
                <input
                  type="text"
                  value={relatedCatalogTitle}
                  onChange={(e) => setRelatedCatalogTitle(e.target.value)}
                  placeholder="例: 全市不动产登记及房屋产权目录"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 shadow-2xs"
                />
              </div>

              {/* Processing Level */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">数据加工程度</label>
                <input
                  type="text"
                  value={processingLevel}
                  onChange={(e) => setProcessingLevel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 shadow-2xs"
                />
              </div>

              {/* Provider Unit */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">政务数据提供单位</label>
                <input
                  type="text"
                  required
                  value={deptName}
                  onChange={(e) => setDeptName(e.target.value)}
                  placeholder="例: 市市场监督管理局"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500 shadow-2xs"
                />
              </div>

              {/* Region Scope */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">数据区域范围</label>
                <input
                  type="text"
                  value={regionScope}
                  onChange={(e) => setRegionScope(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 shadow-2xs"
                />
              </div>

              {/* Time Scope */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">数据时间范围</label>
                <input
                  type="text"
                  value={timeScope}
                  onChange={(e) => setTimeScope(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 shadow-2xs"
                />
              </div>

              {/* Update Frequency */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">数据更新频率</label>
                <select
                  value={updateFreq}
                  onChange={(e) => setUpdateFreq(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 shadow-2xs"
                >
                  <option value="实时">实时更新</option>
                  <option value="每日">每日更新</option>
                  <option value="每周">每周更新</option>
                  <option value="每月">每月更新</option>
                  <option value="每季">每季更新</option>
                  <option value="每年">每年更新</option>
                </select>
              </div>

              {/* Data Format */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">数据存储格式</label>
                <select
                  value={dataFormat}
                  onChange={(e) => setDataFormat(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 shadow-2xs"
                >
                  <option value="RDBMS">RDBMS 关系型数据库</option>
                  <option value="REST API">REST API 接口服务</option>
                  <option value="CSV / Excel">CSV / Excel 电子表格</option>
                  <option value="JSON / XML">JSON / XML 结构化数据</option>
                  <option value="PDF文件">PDF 文档非结构化</option>
                </select>
              </div>

              {/* Data Source */}
              <div className="md:col-span-2">
                <label className="block text-slate-700 font-bold mb-1">挂接数据源 URI</label>
                <input
                  type="text"
                  value={dataSource}
                  onChange={(e) => setDataSource(e.target.value)}
                  placeholder="例: MySQL - db_system.tb_samr_corp"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500 shadow-2xs"
                />
              </div>

            </div>
          )}

          {/* TAB 3: 数据项信息明细 (完全匹配图片3) */}
          {activeTab === 'fields' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-indigo-600" />
                  3. 数据项信息明细 - 共 {infoItems.length} 个数据项
                </span>
                <button
                  type="button"
                  onClick={handleAddInfoItem}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>添加数据项</span>
                </button>
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
                              className="w-32 px-2 py-1 rounded bg-slate-50 border border-slate-200 font-mono font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
                            />
                          </div>
                        </td>
                        <td className="py-2.5 px-3 font-sans">
                          <input
                            type="text"
                            value={item.fieldLabel}
                            onChange={(e) => handleInfoItemChange(i, 'fieldLabel', e.target.value)}
                            className="w-full min-w-[160px] px-2.5 py-1 rounded bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
                          />
                        </td>
                        <td className="py-2.5 px-3 font-mono">
                          <input
                            type="text"
                            value={item.dataType}
                            onChange={(e) => handleInfoItemChange(i, 'dataType', e.target.value)}
                            className="w-20 px-2 py-1 rounded bg-slate-50 border border-slate-200 font-mono font-bold text-indigo-700 text-xs focus:outline-none focus:border-indigo-500"
                          />
                        </td>
                        <td className="py-2.5 px-3 font-sans">
                          <input
                            type="text"
                            value={item.sourceSystem || '价格监督检查与反不正当竞争执法系统'}
                            onChange={(e) => handleInfoItemChange(i, 'sourceSystem', e.target.value)}
                            className="w-full min-w-[200px] px-2.5 py-1 rounded bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
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

          {/* Form Actions */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
            <div className="text-xs text-slate-500 font-medium">
              当前编辑: <span className="font-bold text-indigo-600">{activeTab === 'basic' ? '基本要素' : activeTab === 'extended' ? '扩展要素' : '数据项信息'}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-100 transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-md shadow-indigo-100 flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>保存并提交编目</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};

// ============================================================================
// CATALOG DETAIL MODAL COMPONENT (查看与修改编目明细 - 与业务信息编目完全保持一致)
// ============================================================================
interface CatalogDetailModalProps {
  item: AuthoringCatalogItem;
  onClose: () => void;
  onSave?: (updated: AuthoringCatalogItem) => void;
}

const CatalogDetailModal: React.FC<CatalogDetailModalProps> = ({ item, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState<'items' | 'base' | 'source' | 'ai'>('items');
  const [formData, setFormData] = useState<AuthoringCatalogItem>({ ...item });
  const [isTestingSource, setIsTestingSource] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  // Sync state if item updates
  React.useEffect(() => {
    setFormData({ ...item });
    setTestResult(null);
  }, [item]);

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
      sharingCondition: '全网共享',
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
    if (onSave) onSave(formData);
    onClose();
  };

  // Test data source connection
  const handleTestConnection = () => {
    setIsTestingSource(true);
    setTestResult(null);
    setTimeout(() => {
      setIsTestingSource(false);
      setTestResult('连接测试成功：数据库链路响应时延 12ms，数据项解析契合度 100%');
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"></div>

      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 z-10 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded bg-indigo-600 font-mono font-bold">
                {formData.catalogCode}
              </span>
              <span className="text-xs text-indigo-300 font-semibold">{formData.primaryCategory} • {formData.secondaryCategory}</span>
              <span className="text-xs text-slate-400">({formData.deptName})</span>
            </div>
            <h2 className="text-base font-bold text-white mt-1">{formData.catalogName}</h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>保存修改</span>
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
        <div className="bg-slate-100 border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('items')}
              className={`py-3 text-xs font-semibold relative transition-colors ${
                activeTab === 'items' ? 'text-indigo-600 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              信息项定义 (Schema) [{formData.infoItems.length}]
              {activeTab === 'items' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t"></span>}
            </button>

            <button
              onClick={() => setActiveTab('base')}
              className={`py-3 text-xs font-semibold relative transition-colors ${
                activeTab === 'base' ? 'text-indigo-600 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              目录基本信息
              {activeTab === 'base' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t"></span>}
            </button>

            <button
              onClick={() => setActiveTab('source')}
              className={`py-3 text-xs font-semibold relative transition-colors ${
                activeTab === 'source' ? 'text-indigo-600 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              数据源挂接与感知
              {activeTab === 'source' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t"></span>}
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

        {/* Modal Main Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          
          {/* TAB 1: INFORMATION ITEMS SCHEMA TABLE */}
          {activeTab === 'items' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white p-3 border border-slate-200 rounded-xl shadow-2xs">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">元数据信息项列表 (Data Fields)</h3>
                  <p className="text-xs text-slate-500">维护与定义信息资源的各个字段名称、类型、脱敏及共享控制属性</p>
                </div>
                <button
                  onClick={handleAddItem}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 text-xs font-semibold transition-colors shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>添加信息项</span>
                </button>
              </div>

              {/* Information Items Editable Table */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-semibold">
                    <tr>
                      <th className="py-2.5 px-3 w-8 text-center">#</th>
                      <th className="py-2.5 px-3">英文标识</th>
                      <th className="py-2.5 px-3">中文名称</th>
                      <th className="py-2.5 px-3">数据类型</th>
                      <th className="py-2.5 px-3 w-16 text-center">长度</th>
                      <th className="py-2.5 px-3 w-16 text-center">主键</th>
                      <th className="py-2.5 px-3 w-16 text-center">必填</th>
                      <th className="py-2.5 px-3">脱敏规则</th>
                      <th className="py-2.5 px-3">共享条件</th>
                      <th className="py-2.5 px-3 text-right w-12">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {formData.infoItems.map((item, index) => (
                      <tr key={item.id || index} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2 px-3 text-center text-slate-400 font-mono text-[11px]">{index + 1}</td>
                        
                        {/* 英文标识 */}
                        <td className="py-2 px-3 font-mono font-bold text-slate-800">
                          <input 
                            type="text" 
                            value={item.fieldName} 
                            onChange={(e) => handleItemChange(index, 'fieldName', e.target.value)}
                            className="w-full bg-transparent border border-transparent hover:border-slate-300 focus:border-indigo-500 rounded px-1.5 py-0.5 focus:bg-white transition-all font-mono font-bold"
                          />
                        </td>

                        {/* 中文名称 */}
                        <td className="py-2 px-3 font-medium text-slate-900">
                          <input 
                            type="text" 
                            value={item.fieldLabel} 
                            onChange={(e) => handleItemChange(index, 'fieldLabel', e.target.value)}
                            className="w-full bg-transparent border border-transparent hover:border-slate-300 focus:border-indigo-500 rounded px-1.5 py-0.5 focus:bg-white transition-all"
                          />
                        </td>

                        {/* 数据类型 */}
                        <td className="py-2 px-3">
                          <select 
                            value={item.dataType} 
                            onChange={(e) => handleItemChange(index, 'dataType', e.target.value)}
                            className="bg-transparent border border-transparent hover:border-slate-300 focus:border-indigo-500 rounded px-1 py-0.5 text-indigo-700 font-mono font-bold focus:bg-white"
                          >
                            <option value="varchar">varchar</option>
                            <option value="int">int</option>
                            <option value="datetime">datetime</option>
                            <option value="decimal">decimal</option>
                            <option value="text">text</option>
                          </select>
                        </td>

                        {/* 长度 */}
                        <td className="py-2 px-3 text-center">
                          <input 
                            type="text" 
                            value={item.length} 
                            onChange={(e) => handleItemChange(index, 'length', e.target.value)}
                            className="w-12 text-center bg-transparent border border-transparent hover:border-slate-300 focus:border-indigo-500 rounded py-0.5 focus:bg-white font-mono"
                          />
                        </td>

                        {/* 主键 */}
                        <td className="py-2 px-3 text-center">
                          <input 
                            type="checkbox" 
                            checked={item.isPrimaryKey} 
                            onChange={(e) => handleItemChange(index, 'isPrimaryKey', e.target.checked)}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                          />
                        </td>

                        {/* 必填 */}
                        <td className="py-2 px-3 text-center">
                          <input 
                            type="checkbox" 
                            checked={item.isRequired} 
                            onChange={(e) => handleItemChange(index, 'isRequired', e.target.checked)}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                          />
                        </td>

                        {/* 脱敏规则 */}
                        <td className="py-2 px-3">
                          <select 
                            value={item.maskRule} 
                            onChange={(e) => handleItemChange(index, 'maskRule', e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-slate-700 font-medium text-[11px]"
                          >
                            <option value="无">无</option>
                            <option value="姓名脱敏">姓名脱敏</option>
                            <option value="身份证脱敏">身份证脱敏</option>
                            <option value="手机号脱敏">手机号脱敏</option>
                            <option value="地址模糊化">地址模糊化</option>
                          </select>
                        </td>

                        {/* 共享条件 */}
                        <td className="py-2 px-3 text-slate-600">
                          <input 
                            type="text" 
                            value={item.sharingCondition} 
                            onChange={(e) => handleItemChange(index, 'sharingCondition', e.target.value)}
                            className="w-full bg-transparent border border-transparent hover:border-slate-300 focus:border-indigo-500 rounded px-1 py-0.5 focus:bg-white text-[11px]"
                          />
                        </td>

                        {/* 操作 */}
                        <td className="py-2 px-3 text-right">
                          <button 
                            onClick={() => handleDeleteItem(index)}
                            className="text-slate-400 hover:text-rose-600 transition-colors p-1"
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

          {/* TAB 2: BASE INFORMATION */}
          {activeTab === 'base' && (
            <div className="space-y-4">
              <div className="bg-white p-4 border border-slate-200 rounded-xl space-y-4 shadow-2xs">
                <h3 className="text-sm font-bold text-slate-800 pb-2 border-b border-slate-100">核心属性配置</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-500 text-[11px] mb-1">数据目录名称</label>
                    <input 
                      type="text" 
                      value={formData.catalogName} 
                      onChange={(e) => setFormData({ ...formData, catalogName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold text-slate-800 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 text-[11px] mb-1">目录编码</label>
                    <input 
                      type="text" 
                      value={formData.catalogCode} 
                      onChange={(e) => setFormData({ ...formData, catalogCode: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono text-indigo-700 font-bold text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 text-[11px] mb-1">一级分类</label>
                    <input 
                      type="text" 
                      value={formData.primaryCategory} 
                      disabled
                      className="w-full bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold text-slate-700 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 text-[11px] mb-1">二级分类</label>
                    <input 
                      type="text" 
                      value={formData.secondaryCategory} 
                      onChange={(e) => setFormData({ ...formData, secondaryCategory: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 text-[11px] mb-1">提供/责任部门</label>
                    <input 
                      type="text" 
                      value={formData.deptName} 
                      onChange={(e) => setFormData({ ...formData, deptName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 text-[11px] mb-1">共享类型</label>
                    <select 
                      value={formData.sharingType} 
                      onChange={(e) => setFormData({ ...formData, sharingType: e.target.value as SharingType })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 font-bold text-slate-800 text-xs"
                    >
                      <option value="无条件共享">无条件共享</option>
                      <option value="有条件共享">有条件共享</option>
                      <option value="不予共享">不予共享</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-500 text-[11px] mb-1">更新频率</label>
                    <select 
                      value={formData.updateFreq} 
                      onChange={(e) => setFormData({ ...formData, updateFreq: e.target.value as UpdateFrequency })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 font-bold text-slate-800 text-xs"
                    >
                      <option value="实时">实时更新</option>
                      <option value="每日">每日更新</option>
                      <option value="每周">每周更新</option>
                      <option value="每月">每月更新</option>
                      <option value="每季">每季更新</option>
                      <option value="每年">每年更新</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-500 text-[11px] mb-1">存储格式</label>
                    <select 
                      value={formData.dataFormat} 
                      onChange={(e) => setFormData({ ...formData, dataFormat: e.target.value as DataFormat })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 font-bold text-slate-800 text-xs"
                    >
                      <option value="RDBMS">RDBMS 关系数据库</option>
                      <option value="REST API">REST API 服务</option>
                      <option value="CSV / Excel">CSV / Excel 电子表格</option>
                      <option value="JSON / XML">JSON / XML 结构化</option>
                      <option value="PDF文件">PDF 文档非结构化</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-500 text-[11px] mb-1">编目状态</label>
                    <select 
                      value={formData.status} 
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 font-bold text-indigo-700 text-xs"
                    >
                      <option value="已编制">已编制</option>
                      <option value="待上报">待上报</option>
                      <option value="已发布">已发布</option>
                      <option value="草稿">草稿</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 text-[11px] mb-1">业务摘要与归集说明</label>
                  <textarea 
                    rows={3} 
                    value={formData.description} 
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 leading-relaxed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DATA SOURCE CONNECTIVITY */}
          {activeTab === 'source' && (
            <div className="space-y-4">
              <div className="bg-white p-4 border border-slate-200 rounded-xl space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-sm font-bold text-slate-800">关联物理数据源</h3>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    formData.attachStatus === '已挂接' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {formData.attachStatus || '待挂接'}
                  </span>
                </div>

                <div>
                  <label className="block text-slate-500 text-[11px] mb-1">物理表 / 数据源链接 URI</label>
                  <input 
                    type="text" 
                    value={formData.dataSource || 'MySQL - db_system.tb_resource'} 
                    onChange={(e) => setFormData({ ...formData, dataSource: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 font-mono text-xs font-bold text-slate-800 rounded-lg px-3 py-2"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button 
                    onClick={handleTestConnection}
                    disabled={isTestingSource}
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <Activity className={`w-3.5 h-3.5 ${isTestingSource ? 'animate-spin' : ''}`} />
                    <span>{isTestingSource ? '连接测试中...' : '测试数据库链路连接'}</span>
                  </button>

                  <span className="text-[11px] text-slate-400 font-mono">
                    Schema 映射对齐度: 100%
                  </span>
                </div>

                {testResult && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium flex items-center gap-2 animate-in fade-in duration-150">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{testResult}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: AI COMPLIANCE AUDIT */}
          {activeTab === 'ai' && (
            <div className="space-y-4">
              <div className="bg-white p-4 border border-slate-200 rounded-xl space-y-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-sm font-bold text-slate-800">AI 规范合规诊断报告</h3>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-mono">
                    健康度 98 / 100 分
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-emerald-50/60 border border-emerald-100 rounded-xl flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><b>字段命名规范:</b> 全部英文标识符合标准蛇形命名，未发现保留字冲突。</span>
                  </div>
                  <div className="p-2.5 bg-emerald-50/60 border border-emerald-100 rounded-xl flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><b>敏感数据脱敏:</b> 姓名/身份证号/手机号已按政务合规规则正确选择脱敏。</span>
                  </div>
                  <div className="p-2.5 bg-indigo-50/60 border border-indigo-100 rounded-xl flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span><b>主键定义约束:</b> 存在且唯一指定业务唯一键标识。</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-400 font-mono">
            最后更新于: {formData.updatedTime || formData.createdTime}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
          >
            关闭
          </button>
        </div>

      </div>
    </div>
  );
};
