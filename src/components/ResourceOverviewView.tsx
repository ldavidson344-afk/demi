import React, { useState, useMemo } from 'react';
import { 
  Server, 
  Database, 
  Table as TableIcon, 
  Search, 
  ChevronRight, 
  ChevronDown, 
  Layers, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  HardDrive, 
  Code, 
  FileText, 
  Sparkles, 
  Download, 
  RefreshCw, 
  Cpu, 
  Key, 
  Hash, 
  Building2,
  FolderTree,
  ExternalLink,
  Info,
  Check,
  Zap,
  Tag,
  GitFork,
  Link2,
  ArrowRight,
  CornerDownRight,
  Network,
  ArrowUpRight,
  Workflow,
  Share2
} from 'lucide-react';

// ==================== DATA STRUCTURE TYPES ====================
export interface TableField {
  name: string;
  label: string;
  type: string;
  length?: string;
  isPrimary?: boolean;
  isNullable?: boolean;
  sensitiveTag?: string;
  sampleValue?: string;
  description?: string;
}

export interface TableNode {
  id: string;
  name: string; // 物理表名 tb_...
  label: string; // 中文名称
  code: string;
  recordCount: string;
  storageSize: string;
  primaryKey: string;
  indexCount?: number;
  partitionType?: string;
  storageEngine?: string;
  createdAt?: string;
  description: string;
  securityLevel: 'L1' | 'L2' | 'L3';
  updateFreq: string;
  fields: TableField[];
  sampleRows?: Record<string, string>[];
}

export interface DatabaseNode {
  id: string;
  name: string; // 数据库名
  label: string;
  dbType: 'PostgreSQL' | 'MySQL 8.0' | 'Oracle 19c' | 'DM (达梦)';
  hostPort: string;
  charset: string;
  status: 'online' | 'syncing' | 'offline';
  lastProbeTime: string;
  tableCount: number;
  tables: TableNode[];
}

export interface SystemNode {
  id: string;
  name: string; // 系统名称
  code: string;
  deptName: string; // 责任司局
  status: 'active' | 'maintenance';
  securityLevel: 'L1' | 'L2' | 'L3';
  techStack: string;
  contactPerson: string;
  contactPhone: string;
  description: string;
  databases: DatabaseNode[];
}

export interface TableRelation {
  id: string;
  relationRole: 'parent_of' | 'child_of'; // child_of = 本表是子表，关联某主表; parent_of = 本表是主表，被某子表关联
  relatedSysId: string;
  relatedDbId: string;
  relatedTableId: string;
  relatedSysName: string;
  relatedDbName: string;
  relatedTableName: string;
  relatedTableLabel: string;
  currentField: string;
  relatedField: string;
  cardinality: '1:1' | '1:N' | 'N:1' | 'N:M';
  relationType: 'FK_HARD' | 'SOFT_BUSINESS';
  constraintName?: string;
  cascadeRule?: string;
  description: string;
}

export const GET_TABLE_RELATIONS = (tableId: string): TableRelation[] => {
  const map: Record<string, TableRelation[]> = {
    'tbl_corp_basic_info': [
      {
        id: 'rel_corp_sh',
        relationRole: 'parent_of',
        relatedSysId: 'sys_corp_reg',
        relatedDbId: 'db_corp_register',
        relatedTableId: 'tbl_corp_shareholder',
        relatedSysName: '市场主体登记注册系统',
        relatedDbName: 'corp_register_db',
        relatedTableName: 'tb_corp_shareholder',
        relatedTableLabel: '企业股东与出资明细表',
        currentField: 'corp_id',
        relatedField: 'corp_id',
        cardinality: '1:N',
        relationType: 'FK_HARD',
        constraintName: 'fk_sh_corp_id',
        cascadeRule: 'ON DELETE RESTRICT',
        description: '主从关联：1家企业主表对应多条股东认缴/实缴出资明细记录'
      },
      {
        id: 'rel_corp_lic',
        relationRole: 'parent_of',
        relatedSysId: 'sys_corp_reg',
        relatedDbId: 'db_corp_register',
        relatedTableId: 'tbl_corp_license',
        relatedSysName: '市场主体登记注册系统',
        relatedDbName: 'corp_register_db',
        relatedTableName: 'tb_corp_license',
        relatedTableLabel: '企业许可证照绑定表',
        currentField: 'corp_id',
        relatedField: 'corp_id',
        cardinality: '1:N',
        relationType: 'FK_HARD',
        constraintName: 'fk_license_corp_id',
        cascadeRule: 'ON DELETE CASCADE',
        description: '主从关联：1家企业绑定多张经营许可证件（食品经营、特种设备等）'
      },
      {
        id: 'rel_corp_arch',
        relationRole: 'parent_of',
        relatedSysId: 'sys_corp_reg',
        relatedDbId: 'db_corp_archive',
        relatedTableId: 'tbl_arch_electron_file',
        relatedSysName: '市场主体登记注册系统',
        relatedDbName: 'corp_archive_db',
        relatedTableName: 'tb_arch_electron_file',
        relatedTableLabel: '电子档案卷宗索引表',
        currentField: 'corp_id',
        relatedField: 'corp_id',
        cardinality: '1:N',
        relationType: 'FK_HARD',
        constraintName: 'fk_arch_corp_id',
        cascadeRule: 'ON DELETE RESTRICT',
        description: '跨库主从：企业基础表关联档案库中的卷宗扫描件存储路径'
      },
      {
        id: 'rel_corp_case',
        relationRole: 'parent_of',
        relatedSysId: 'sys_case_inspect',
        relatedDbId: 'db_market_case',
        relatedTableId: 'tbl_case_info_master',
        relatedSysName: '执法稽查办案平台',
        relatedDbName: 'market_case_db',
        relatedTableName: 'tb_case_info_master',
        relatedTableLabel: '行政处罚办案主表',
        currentField: 'uscc',
        relatedField: 'party_uscc',
        cardinality: '1:N',
        relationType: 'SOFT_BUSINESS',
        constraintName: '跨系统统一信用代码关联',
        cascadeRule: '无级联',
        description: '跨系统软关联：通过统一社会信用代码关联执法办案系统的行政处罚案卷'
      }
    ],
    'tbl_corp_shareholder': [
      {
        id: 'rel_sh_corp',
        relationRole: 'child_of',
        relatedSysId: 'sys_corp_reg',
        relatedDbId: 'db_corp_register',
        relatedTableId: 'tbl_corp_basic_info',
        relatedSysName: '市场主体登记注册系统',
        relatedDbName: 'corp_register_db',
        relatedTableName: 'tb_corp_basic_info',
        relatedTableLabel: '企业主体基础登记信息表',
        currentField: 'corp_id',
        relatedField: 'corp_id',
        cardinality: 'N:1',
        relationType: 'FK_HARD',
        constraintName: 'fk_sh_corp_id',
        cascadeRule: 'ON DELETE RESTRICT',
        description: '子表外键约束：股东记录必须从属于唯一存在且有效登记的企业主表'
      }
    ],
    'tbl_corp_license': [
      {
        id: 'rel_lic_corp',
        relationRole: 'child_of',
        relatedSysId: 'sys_corp_reg',
        relatedDbId: 'db_corp_register',
        relatedTableId: 'tbl_corp_basic_info',
        relatedSysName: '市场主体登记注册系统',
        relatedDbName: 'corp_register_db',
        relatedTableName: 'tb_corp_basic_info',
        relatedTableLabel: '企业主体基础登记信息表',
        currentField: 'corp_id',
        relatedField: 'corp_id',
        cardinality: 'N:1',
        relationType: 'FK_HARD',
        constraintName: 'fk_license_corp_id',
        cascadeRule: 'ON DELETE CASCADE',
        description: '子表外键约束：许可证照记录必须从属于特定企业主体'
      }
    ],
    'tbl_arch_electron_file': [
      {
        id: 'rel_arch_corp',
        relationRole: 'child_of',
        relatedSysId: 'sys_corp_reg',
        relatedDbId: 'db_corp_register',
        relatedTableId: 'tbl_corp_basic_info',
        relatedSysName: '市场主体登记注册系统',
        relatedDbName: 'corp_register_db',
        relatedTableName: 'tb_corp_basic_info',
        relatedTableLabel: '企业主体基础登记信息表',
        currentField: 'corp_id',
        relatedField: 'corp_id',
        cardinality: 'N:1',
        relationType: 'FK_HARD',
        constraintName: 'fk_arch_corp_id',
        cascadeRule: 'ON DELETE RESTRICT',
        description: '跨库子表外键：电子卷宗档案索引归属于特定企业主体'
      }
    ],
    'tbl_case_info_master': [
      {
        id: 'rel_case_corp',
        relationRole: 'child_of',
        relatedSysId: 'sys_corp_reg',
        relatedDbId: 'db_corp_register',
        relatedTableId: 'tbl_corp_basic_info',
        relatedSysName: '市场主体登记注册系统',
        relatedDbName: 'corp_register_db',
        relatedTableName: 'tb_corp_basic_info',
        relatedTableLabel: '企业主体基础登记信息表',
        currentField: 'party_uscc',
        relatedField: 'uscc',
        cardinality: 'N:1',
        relationType: 'SOFT_BUSINESS',
        constraintName: '跨系统统一信用代码软关联',
        cascadeRule: '无级联',
        description: '跨系统关联：当当事人为企业时，通过统一社会信用代码关联市场主体基本信息表'
      },
      {
        id: 'rel_case_punish',
        relationRole: 'parent_of',
        relatedSysId: 'sys_case_inspect',
        relatedDbId: 'db_market_case',
        relatedTableId: 'tbl_case_punish_detail',
        relatedSysName: '执法稽查办案平台',
        relatedDbName: 'market_case_db',
        relatedTableName: 'tb_case_punish_detail',
        relatedTableLabel: '行政处罚决定及罚没款明细表',
        currentField: 'case_id',
        relatedField: 'case_id',
        cardinality: '1:N',
        relationType: 'FK_HARD',
        constraintName: 'fk_punish_case_id',
        cascadeRule: 'ON DELETE CASCADE',
        description: '主从表关系：1个行政处罚案件主表对应多条具体的没收违法所得与罚金执结明细'
      }
    ],
    'tbl_case_punish_detail': [
      {
        id: 'rel_punish_case',
        relationRole: 'child_of',
        relatedSysId: 'sys_case_inspect',
        relatedDbId: 'db_market_case',
        relatedTableId: 'tbl_case_info_master',
        relatedSysName: '执法稽查办案平台',
        relatedDbName: 'market_case_db',
        relatedTableName: 'tb_case_info_master',
        relatedTableLabel: '行政处罚办案主表',
        currentField: 'case_id',
        relatedField: 'case_id',
        cardinality: 'N:1',
        relationType: 'FK_HARD',
        constraintName: 'fk_punish_case_id',
        cascadeRule: 'ON DELETE CASCADE',
        description: '子表外键约束：处罚明细记录必须关联有效的行政处罚案件主表'
      }
    ],
    'tbl_e_commerce_platform': [
      {
        id: 'rel_pf_corp',
        relationRole: 'child_of',
        relatedSysId: 'sys_corp_reg',
        relatedDbId: 'db_corp_register',
        relatedTableId: 'tbl_corp_basic_info',
        relatedSysName: '市场主体登记注册系统',
        relatedDbName: 'corp_register_db',
        relatedTableName: 'tb_corp_basic_info',
        relatedTableLabel: '企业主体基础登记信息表',
        currentField: 'corp_uscc',
        relatedField: 'uscc',
        cardinality: 'N:1',
        relationType: 'SOFT_BUSINESS',
        constraintName: '跨系统统一信用代码软关联',
        cascadeRule: '无级联',
        description: '跨系统软关联：电商平台运营主体通过统一社会信用代码关联企业登记主表'
      },
      {
        id: 'rel_pf_shop',
        relationRole: 'parent_of',
        relatedSysId: 'sys_ecomm_monitor',
        relatedDbId: 'db_e_commerce',
        relatedTableId: 'tbl_online_shop_merchant',
        relatedSysName: '网络交易监管平台',
        relatedDbName: 'e_commerce_db',
        relatedTableName: 'tb_online_shop_merchant',
        relatedTableLabel: '网店经营者身份匹配表',
        currentField: 'platform_id',
        relatedField: 'platform_id',
        cardinality: '1:N',
        relationType: 'FK_HARD',
        constraintName: 'fk_shop_platform_id',
        cascadeRule: 'ON DELETE RESTRICT',
        description: '主从关系：1个网络交易平台主表托管与映射多个网店店铺经营者数据'
      }
    ],
    'tbl_online_shop_merchant': [
      {
        id: 'rel_shop_pf',
        relationRole: 'child_of',
        relatedSysId: 'sys_ecomm_monitor',
        relatedDbId: 'db_e_commerce',
        relatedTableId: 'tbl_e_commerce_platform',
        relatedSysName: '网络交易监管平台',
        relatedDbName: 'e_commerce_db',
        relatedTableName: 'tb_e_commerce_platform',
        relatedTableLabel: '网络交易平台主体备案登记表',
        currentField: 'platform_id',
        relatedField: 'platform_id',
        cardinality: 'N:1',
        relationType: 'FK_HARD',
        constraintName: 'fk_shop_platform_id',
        cascadeRule: 'ON DELETE RESTRICT',
        description: '子表外键约束：店铺经营者记录关联所属的备案电商平台'
      }
    ],
    'tbl_food_sampling_task': [
      {
        id: 'rel_food_corp',
        relationRole: 'child_of',
        relatedSysId: 'sys_corp_reg',
        relatedDbId: 'db_corp_register',
        relatedTableId: 'tbl_corp_basic_info',
        relatedSysName: '市场主体登记注册系统',
        relatedDbName: 'corp_register_db',
        relatedTableName: 'tb_corp_basic_info',
        relatedTableLabel: '企业主体基础登记信息表',
        currentField: 'sampled_corp_name',
        relatedField: 'corp_name',
        cardinality: 'N:1',
        relationType: 'SOFT_BUSINESS',
        constraintName: '跨系统企业名称业务匹配',
        cascadeRule: '无级联',
        description: '跨系统软关联：被抽样单位名称与市场主体企业登记名称实时关联匹配'
      }
    ],
    'tbl_special_equip_master': [
      {
        id: 'rel_equip_corp',
        relationRole: 'child_of',
        relatedSysId: 'sys_corp_reg',
        relatedDbId: 'db_corp_register',
        relatedTableId: 'tbl_corp_basic_info',
        relatedSysName: '市场主体登记注册系统',
        relatedDbName: 'corp_register_db',
        relatedTableName: 'tb_corp_basic_info',
        relatedTableLabel: '企业主体基础登记信息表',
        currentField: 'use_corp_name',
        relatedField: 'corp_name',
        cardinality: 'N:1',
        relationType: 'SOFT_BUSINESS',
        constraintName: '跨系统企业产权单位关联',
        cascadeRule: '无级联',
        description: '跨系统软关联：特种设备使用登记单位关联登记注册局的企业法人主体'
      }
    ]
  };

  return map[tableId] || [];
};

// ==================== MOCK RESOURCE TREE DATA ====================
export const OVERVIEW_TREE_DATA: SystemNode[] = [
  {
    id: 'sys_corp_reg',
    name: '市场主体登记注册系统',
    code: 'SYS-SCJG-202601',
    deptName: '登记注册指导处 (企业注册局)',
    status: 'active',
    securityLevel: 'L2',
    techStack: 'Spring Boot 3.2 / Vue 3 / PostgreSQL 14 / Redis',
    contactPerson: '张建国 (处长)',
    contactPhone: '0571-88991201',
    description: '负责全市各类企业、个体工商户及农民专业合作社的设立、变更、注销登记全流程数据管理与归档。',
    databases: [
      {
        id: 'db_corp_register',
        name: 'corp_register_db',
        label: '市场主体核心登记数据库',
        dbType: 'PostgreSQL',
        hostPort: '10.208.32.105:5432',
        charset: 'UTF-8',
        status: 'online',
        lastProbeTime: '2026-07-29 02:00:01',
        tableCount: 3,
        tables: [
          {
            id: 'tbl_corp_basic_info',
            name: 'tb_corp_basic_info',
            label: '企业主体基础登记信息表',
            code: 'TBL-CORP-01',
            recordCount: '1,280,450',
            storageSize: '1.42 GB',
            primaryKey: 'corp_id',
            description: '存储所有通过统一审批平台登记纳管的企业主体法人全量基础属性信息。',
            securityLevel: 'L2',
            updateFreq: '实时 (Trigger同步)',
            fields: [
              { name: 'corp_id', label: '企业唯一标识', type: 'VARCHAR', length: '32', isPrimary: true, isNullable: false, description: '系统自动生成的 GUID 主键', sampleValue: 'CORP_330100_202607290001' },
              { name: 'corp_name', label: '企业全称', type: 'VARCHAR', length: '120', isPrimary: false, isNullable: false, description: '营业执照注册名称', sampleValue: '浙江云智创新科技有限公司' },
              { name: 'uscc', label: '统一社会信用代码', type: 'VARCHAR', length: '18', isPrimary: false, isNullable: false, sensitiveTag: '脱敏:完整显示', description: '18位国家标准信用代码', sampleValue: '91330100MA23789X1Y' },
              { name: 'legal_rep_name', label: '法定代表人姓名', type: 'VARCHAR', length: '50', isPrimary: false, isNullable: false, sensitiveTag: '脱敏:姓名掩码', description: '登记之法定代表人', sampleValue: '李*强' },
              { name: 'legal_rep_idcard', label: '法定代表人身份证号', type: 'VARCHAR', length: '18', isPrimary: false, isNullable: true, sensitiveTag: '脱敏:前6后4', description: '身份证件号码', sampleValue: '330106********1234' },
              { name: 'reg_capital', label: '注册资本(万元)', type: 'DECIMAL', length: '14,2', isPrimary: false, isNullable: true, description: '认缴注册资金金额', sampleValue: '5000.00' },
              { name: 'currency_code', label: '币种代码', type: 'VARCHAR', length: '10', isPrimary: false, isNullable: true, description: 'CNY-人民币, USD-美元', sampleValue: 'CNY' },
              { name: 'establishment_date', label: '成立日期', type: 'DATE', length: '8', isPrimary: false, isNullable: false, description: '营业执照签发设立日期', sampleValue: '2021-03-15' },
              { name: 'business_status', label: '存续状态', type: 'VARCHAR', length: '20', isPrimary: false, isNullable: false, description: '在营/注销/吊销/迁出', sampleValue: '在营(开业)' },
              { name: 'reg_authority', label: '登记机关名称', type: 'VARCHAR', length: '100', isPrimary: false, isNullable: false, description: '签发执照之市场监管局', sampleValue: '市市场监督管理局高新区分局' },
              { name: 'address', label: '住所/经营场所', type: 'VARCHAR', length: '200', isPrimary: false, isNullable: true, description: '企业实际注册地址', sampleValue: '杭州市滨江区江南大道 888 号科技大厦 18 层' },
            ],
            sampleRows: [
              { corp_id: 'CORP_330100_001', corp_name: '浙江数智未来科技有限公司', uscc: '91330100MA23789X1Y', legal_rep_name: '王*民', reg_capital: '1000.00', business_status: '在营(开业)' },
              { corp_id: 'CORP_330100_002', corp_name: '杭州西湖食品连锁有限公司', uscc: '91330106MA28890K3L', legal_rep_name: '陈*华', reg_capital: '200.00', business_status: '在营(开业)' },
              { corp_id: 'CORP_330100_003', corp_name: '钱塘特种智能设备服务部', uscc: '92330109MA29901M8P', legal_rep_name: '张*伟', reg_capital: '50.00', business_status: '在营(开业)' },
            ]
          },
          {
            id: 'tbl_corp_shareholder',
            name: 'tb_corp_shareholder',
            label: '企业股东与出资明细表',
            code: 'TBL-CORP-02',
            recordCount: '3,450,200',
            storageSize: '2.10 GB',
            primaryKey: 'sh_id',
            description: '记录企业主要股东认缴/实缴出资额、持股比例与股东类型信息。',
            securityLevel: 'L2',
            updateFreq: '每日定时探针增量',
            fields: [
              { name: 'sh_id', label: '股东记录ID', type: 'VARCHAR', length: '32', isPrimary: true, isNullable: false, sampleValue: 'SH_2026_001' },
              { name: 'corp_id', label: '关联企业ID', type: 'VARCHAR', length: '32', isPrimary: false, isNullable: false, description: '外键关联 tb_corp_basic_info', sampleValue: 'CORP_330100_001' },
              { name: 'shareholder_name', label: '股东名称/姓名', type: 'VARCHAR', length: '120', isPrimary: false, isNullable: false, sampleValue: '杭州云创投资管理合伙企业(有限合伙)' },
              { name: 'shareholder_type', label: '股东类型', type: 'VARCHAR', length: '20', isPrimary: false, isNullable: false, description: '自然人/企业法人/社会组织', sampleValue: '企业法人' },
              { name: 'subscript_amount', label: '认缴出资额(万元)', type: 'DECIMAL', length: '14,2', isPrimary: false, isNullable: true, sampleValue: '3500.00' },
              { name: 'holding_ratio', label: '持股比例(%)', type: 'DECIMAL', length: '5,2', isPrimary: false, isNullable: true, sampleValue: '70.00' },
            ]
          },
          {
            id: 'tbl_corp_license',
            name: 'tb_corp_license',
            label: '企业许可证照绑定表',
            code: 'TBL-CORP-03',
            recordCount: '890,120',
            storageSize: '680 MB',
            primaryKey: 'license_bind_id',
            description: '关联市场监管核发的食品经营许可证、特种设备许可证等后置许可。',
            securityLevel: 'L1',
            updateFreq: '每日增量同步',
            fields: [
              { name: 'license_bind_id', label: '绑定记录ID', type: 'VARCHAR', length: '32', isPrimary: true, isNullable: false, sampleValue: 'LIC_BIND_0099' },
              { name: 'corp_id', label: '企业唯一标识', type: 'VARCHAR', length: '32', isPrimary: false, isNullable: false, sampleValue: 'CORP_330100_002' },
              { name: 'license_no', label: '许可证编号', type: 'VARCHAR', length: '50', isPrimary: false, isNullable: false, sampleValue: 'JY13301060012398' },
              { name: 'license_type_name', label: '许可证类别', type: 'VARCHAR', length: '80', isPrimary: false, isNullable: false, sampleValue: '食品经营许可证' },
              { name: 'valid_until', label: '有效截止日期', type: 'DATE', length: '8', isPrimary: false, isNullable: true, sampleValue: '2029-06-30' },
            ]
          }
        ]
      },
      {
        id: 'db_corp_archive',
        name: 'corp_archive_db',
        label: '企业电子档案影像数据库',
        dbType: 'Oracle 19c',
        hostPort: '10.208.32.108:1521',
        charset: 'AL32UTF8',
        status: 'online',
        lastProbeTime: '2026-07-29 01:30:00',
        tableCount: 1,
        tables: [
          {
            id: 'tbl_arch_electron_file',
            name: 'tb_arch_electron_file',
            label: '电子档案卷宗索引表',
            code: 'TBL-ARCH-01',
            recordCount: '5,600,000',
            storageSize: '18.5 GB',
            primaryKey: 'archive_no',
            description: '企业章程、股东会决议等原始扫描件索引及存储路径。',
            securityLevel: 'L3',
            updateFreq: '实时追加',
            fields: [
              { name: 'archive_no', label: '档案卷宗号', type: 'VARCHAR2', length: '40', isPrimary: true, isNullable: false, sampleValue: 'ARC_2026_3301_00192' },
              { name: 'corp_id', label: '关联企业ID', type: 'VARCHAR2', length: '32', isPrimary: false, isNullable: false, sampleValue: 'CORP_330100_001' },
              { name: 'file_category', label: '卷宗材料分类', type: 'VARCHAR2', length: '50', isPrimary: false, isNullable: false, sampleValue: '设立登记章程与股东决议' },
              { name: 'file_path_oss', label: '对象存储 URI', type: 'VARCHAR2', length: '255', isPrimary: false, isNullable: false, sensitiveTag: '内部地址', sampleValue: 'oss://market-archive/2026/07/arc_00192.pdf' },
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'sys_case_inspect',
    name: '执法稽查办案平台',
    code: 'SYS-SCJG-202602',
    deptName: '执法稽查局',
    status: 'active',
    securityLevel: 'L3',
    techStack: 'Java / MySQL 8.0 / ShardingSphere / Redis',
    contactPerson: '刘维 (局长)',
    contactPhone: '0571-88991302',
    description: '处理全域市场监管违法线索移送、立案调查、行政处罚听证与结案归档全流程。',
    databases: [
      {
        id: 'db_market_case',
        name: 'market_case_db',
        label: '执法办案全量数据库',
        dbType: 'MySQL 8.0',
        hostPort: '10.190.22.8:3306',
        charset: 'utf8mb4',
        status: 'online',
        lastProbeTime: '2026-07-28 23:10:00',
        tableCount: 2,
        tables: [
          {
            id: 'tbl_case_info_master',
            name: 'tb_case_info_master',
            label: '行政处罚办案主表',
            code: 'TBL-CASE-01',
            recordCount: '320,150',
            storageSize: '890 MB',
            primaryKey: 'case_id',
            description: '记录立案文号、当事人信息、违法案由、立案时间及办案人员。',
            securityLevel: 'L3',
            updateFreq: '实时',
            fields: [
              { name: 'case_id', label: '案件唯一ID', type: 'VARCHAR', length: '32', isPrimary: true, isNullable: false, sampleValue: 'CASE_2026_0331001' },
              { name: 'case_code', label: '行政处罚立案号', type: 'VARCHAR', length: '60', isPrimary: false, isNullable: false, sampleValue: '杭市监处罚〔2026〕0128号' },
              { name: 'party_name', label: '涉案当事人名称', type: 'VARCHAR', length: '120', isPrimary: false, isNullable: false, sampleValue: '某某鲜生超市有限公司' },
              { name: 'cause_type', label: '违法案由分类', type: 'VARCHAR', length: '80', isPrimary: false, isNullable: false, sampleValue: '销售不符合食品安全标准食品案' },
              { name: 'case_status', label: '案件办理阶段', type: 'VARCHAR', length: '20', isPrimary: false, isNullable: false, sampleValue: '已结案(已执行完毕)' },
              { name: 'fine_amount', label: '罚没款金额(元)', type: 'DECIMAL', length: '12,2', isPrimary: false, isNullable: true, sampleValue: '50000.00' },
            ]
          },
          {
            id: 'tbl_case_punish_detail',
            name: 'tb_case_punish_detail',
            label: '行政处罚决定及罚没款明细表',
            code: 'TBL-CASE-02',
            recordCount: '310,000',
            storageSize: '450 MB',
            primaryKey: 'punish_detail_id',
            description: '记录行政处罚决定书文号、处罚种类、没收违法所得金额与缴纳状态。',
            securityLevel: 'L3',
            updateFreq: '每日更新',
            fields: [
              { name: 'punish_detail_id', label: '明细记录ID', type: 'VARCHAR', length: '32', isPrimary: true, isNullable: false, sampleValue: 'PUN_DETAIL_0019' },
              { name: 'case_id', label: '案件唯一ID', type: 'VARCHAR', length: '32', isPrimary: false, isNullable: false, sampleValue: 'CASE_2026_0331001' },
              { name: 'punish_doc_no', label: '处罚决定书文号', type: 'VARCHAR', length: '80', isPrimary: false, isNullable: false, sampleValue: '杭市监罚决〔2026〕0128号' },
              { name: 'confiscate_amount', label: '没收违法所得(元)', type: 'DECIMAL', length: '12,2', isPrimary: false, isNullable: true, sampleValue: '12400.00' },
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'sys_ecomm_monitor',
    name: '网络交易监管平台',
    code: 'SYS-SCJG-202603',
    deptName: '网络交易监督管理司',
    status: 'active',
    securityLevel: 'L2',
    techStack: 'Go / Python / MySQL 8.0 / ClickHouse',
    contactPerson: '孙明 (司长)',
    contactPhone: '0571-88991405',
    description: '对辖区内电商平台、网络交易经营者、网店店铺、网络促销活动等进行全天候监测与合规监管。',
    databases: [
      {
        id: 'db_e_commerce',
        name: 'e_commerce_db',
        label: '网络交易与电商监测数据库',
        dbType: 'MySQL 8.0',
        hostPort: '10.208.40.12:3306',
        charset: 'utf8mb4',
        status: 'online',
        lastProbeTime: '2026-07-29 00:00:00',
        tableCount: 2,
        tables: [
          {
            id: 'tbl_e_commerce_platform',
            name: 'tb_e_commerce_platform',
            label: '网络交易平台主体备案登记表',
            code: 'TBL-ECOMM-01',
            recordCount: '1,240',
            storageSize: '15 MB',
            primaryKey: 'platform_id',
            description: '网络交易平台（含电商、直播平台、社交电商）法定备案登记数据。',
            securityLevel: 'L2',
            updateFreq: '每周同步',
            fields: [
              { name: 'platform_id', label: '平台备案标识', type: 'VARCHAR', length: '32', isPrimary: true, isNullable: false, sampleValue: 'PF_330100_001' },
              { name: 'platform_name', label: '网络交易平台名称', type: 'VARCHAR', length: '120', isPrimary: false, isNullable: false, sampleValue: '某某淘选电商平台' },
              { name: 'domain_name', label: '平台域名网址', type: 'VARCHAR', length: '100', isPrimary: false, isNullable: true, sampleValue: 'https://www.taoxuan-mall.com' },
              { name: 'corp_uscc', label: '运营主体信用代码', type: 'VARCHAR', length: '18', isPrimary: false, isNullable: false, sampleValue: '91330100MA2110298X' },
              { name: 'merchant_count', label: '平台网店商家数量', type: 'INT', length: '11', isPrimary: false, isNullable: true, sampleValue: '14200' },
            ]
          },
          {
            id: 'tbl_online_shop_merchant',
            name: 'tb_online_shop_merchant',
            label: '网店经营者身份匹配表',
            code: 'TBL-ECOMM-02',
            recordCount: '850,000',
            storageSize: '1.20 GB',
            primaryKey: 'shop_id',
            description: '归集各平台网店亮照亮证、经营者身份证/营业执照校验数据。',
            securityLevel: 'L2',
            updateFreq: '每日更新',
            fields: [
              { name: 'shop_id', label: '网店唯一编号', type: 'VARCHAR', length: '32', isPrimary: true, isNullable: false, sampleValue: 'SHOP_2026_09892' },
              { name: 'platform_id', label: '所属平台ID', type: 'VARCHAR', length: '32', isPrimary: false, isNullable: false, sampleValue: 'PF_330100_001' },
              { name: 'shop_title', label: '网店店铺名称', type: 'VARCHAR', length: '150', isPrimary: false, isNullable: false, sampleValue: '杭州特产官方授权旗舰店' },
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'sys_food_safety',
    name: '食品安全抽检与追溯平台',
    code: 'SYS-SCJG-202604',
    deptName: '食品安全协调与抽检监管局',
    status: 'active',
    securityLevel: 'L2',
    techStack: 'Java / Node.js / Oracle 19c / MongoDB',
    contactPerson: '周艳 (局长)',
    contactPhone: '0571-88991508',
    description: '负责全市食品安全监督抽检任务下达、样品采样、实验室检测结果归集与食用农产品追溯码管控。',
    databases: [
      {
        id: 'db_food_safety',
        name: 'db_food_safety',
        label: '食品安全抽检全流程数据库',
        dbType: 'Oracle 19c',
        hostPort: '10.128.45.10:1521',
        charset: 'AL32UTF8',
        status: 'online',
        lastProbeTime: '2026-07-29 01:00:00',
        tableCount: 1,
        tables: [
          {
            id: 'tbl_food_sampling_task',
            name: 'tb_food_sampling_task',
            label: '食品安全监督抽检采样单',
            code: 'TBL-FOOD-01',
            recordCount: '450,000',
            storageSize: '1.15 GB',
            primaryKey: 'sample_id',
            description: '记录抽样编号、被抽样单位、样品名称、生产日期、采样人及检测机构。',
            securityLevel: 'L2',
            updateFreq: '实时',
            fields: [
              { name: 'sample_id', label: '抽样单编号', type: 'VARCHAR2', length: '36', isPrimary: true, isNullable: false, sampleValue: 'SP2026330100010029' },
              { name: 'sample_name', label: '抽检样品名称', type: 'VARCHAR2', length: '100', isPrimary: false, isNullable: false, sampleValue: '鲜土鸡蛋 (普通鸡蛋)' },
              { name: 'sampled_corp_name', label: '被抽样单位名称', type: 'VARCHAR2', length: '120', isPrimary: false, isNullable: false, sampleValue: '杭州市西湖区好生鲜超市' },
              { name: 'test_result_conclusion', label: '检验结论', type: 'VARCHAR2', length: '30', isPrimary: false, isNullable: false, sampleValue: '合格' },
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'sys_special_equip',
    name: '特种设备安全监察管理系统',
    code: 'SYS-SCJG-202605',
    deptName: '特种设备安全监察局',
    status: 'active',
    securityLevel: 'L2',
    techStack: '.NET Core 8 / PostgreSQL 15',
    contactPerson: '郑刚 (局长)',
    contactPhone: '0571-88991612',
    description: '对电梯、锅炉、压力容器、起重机械等特种设备的使用登记、定期检验与隐患排查治理进行数字化监控。',
    databases: [
      {
        id: 'db_special_equip',
        name: 'special_equip_db',
        label: '特种设备全生命周期数据库',
        dbType: 'PostgreSQL',
        hostPort: '10.130.20.5:5432',
        charset: 'UTF-8',
        status: 'online',
        lastProbeTime: '2026-07-28 22:30:00',
        tableCount: 1,
        tables: [
          {
            id: 'tbl_special_equip_master',
            name: 'tb_special_equip_master',
            label: '特种设备身份卡片台账表',
            code: 'TBL-EQUIP-01',
            recordCount: '680,200',
            storageSize: '1.80 GB',
            primaryKey: 'equip_reg_code',
            description: '记录特种设备使用登记证号、设备代码、类型、使用单位、安装地址及下次检验日期。',
            securityLevel: 'L2',
            updateFreq: '每日探针',
            fields: [
              { name: 'equip_reg_code', label: '设备注册代码', type: 'VARCHAR', length: '32', isPrimary: true, isNullable: false, sampleValue: '311033010020260001' },
              { name: 'equip_name', label: '设备名称', type: 'VARCHAR', length: '100', isPrimary: false, isNullable: false, sampleValue: '乘客电梯 (有机房)' },
              { name: 'use_corp_name', label: '使用单位全称', type: 'VARCHAR', length: '120', isPrimary: false, isNullable: false, sampleValue: '绿城物业服务集团有限公司杭州分公司' },
              { name: 'next_inspect_date', label: '下次定期检验日期', type: 'DATE', length: '8', isPrimary: false, isNullable: false, sampleValue: '2027-01-15' },
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'sys_credit_mgmt',
    name: '市场监管信用与异常名录系统',
    code: 'SYS-SCJG-202606',
    deptName: '信用监督管理司',
    status: 'active',
    securityLevel: 'L1',
    techStack: 'Java / DM (达梦数据库)',
    contactPerson: '陈红 (司长)',
    contactPhone: '0571-88991700',
    description: '汇总经营异常名录、严重违法失信名单、双随机一公开抽查结果，并提供跨部门信用联合惩戒接口。',
    databases: [
      {
        id: 'db_market_credit',
        name: 'db_market_credit',
        label: '市场信用监管与失信约束数据库',
        dbType: 'DM (达梦)',
        hostPort: '10.130.60.15:5236',
        charset: 'GB18030',
        status: 'online',
        lastProbeTime: '2026-07-29 02:00:00',
        tableCount: 1,
        tables: [
          {
            id: 'tbl_abnormal_list',
            name: 'tb_abnormal_list',
            label: '经营异常名录列入与移出表',
            code: 'TBL-CREDIT-01',
            recordCount: '540,000',
            storageSize: '780 MB',
            primaryKey: 'abnormal_record_id',
            description: '因未按时年报或通过登记住所无法联系而被列入经营异常名录的企业记录。',
            securityLevel: 'L1',
            updateFreq: '每日更新',
            fields: [
              { name: 'abnormal_record_id', label: '名录记录ID', type: 'VARCHAR', length: '32', isPrimary: true, isNullable: false, sampleValue: 'ABN_2026_001923' },
              { name: 'corp_uscc', label: '企业统一社会信用代码', type: 'VARCHAR', length: '18', isPrimary: false, isNullable: false, sampleValue: '91330108MA2319028L' },
              { name: 'in_reason_type', label: '列入异常原因', type: 'VARCHAR', length: '100', isPrimary: false, isNullable: false, sampleValue: '未按规定期限公示年度报告' },
              { name: 'in_date', label: '列入异常日期', type: 'DATE', length: '8', isPrimary: false, isNullable: false, sampleValue: '2025-07-10' },
            ]
          }
        ]
      }
    ]
  }
];

export const ResourceOverviewView: React.FC = () => {
  // Navigation Selection State: systemId, dbId, tableId
  const [selectedSystemId, setSelectedSystemId] = useState<string | null>(null);
  const [selectedDbId, setSelectedDbId] = useState<string | null>(null);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);

  // Tree Expand States
  const [expandedSystems, setExpandedSystems] = useState<Record<string, boolean>>({
    'sys_corp_reg': true,
    'sys_case_inspect': true,
  });
  const [expandedDbs, setExpandedDbs] = useState<Record<string, boolean>>({
    'db_corp_register': true,
  });

  // Search Filter in Tree
  const [treeSearch, setTreeSearch] = useState('');
  // Active Tab inside Right Table detail view
  const [activeTableTab, setActiveTableTab] = useState<'fields' | 'sample' | 'ddl' | 'relations'>('fields');

  // Toggle System Node Expansion
  const toggleSystemExpand = (sysId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedSystems(prev => ({ ...prev, [sysId]: !prev[sysId] }));
  };

  // Toggle DB Node Expansion
  const toggleDbExpand = (dbId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedDbs(prev => ({ ...prev, [dbId]: !prev[dbId] }));
  };

  // Select System
  const handleSelectSystem = (sysId: string) => {
    setSelectedSystemId(sysId);
    setSelectedDbId(null);
    setSelectedTableId(null);
  };

  // Select Database
  const handleSelectDb = (sysId: string, dbId: string) => {
    setSelectedSystemId(sysId);
    setSelectedDbId(dbId);
    setSelectedTableId(null);
  };

  // Select Table
  const handleSelectTable = (sysId: string, dbId: string, tableId: string) => {
    setSelectedSystemId(sysId);
    setSelectedDbId(dbId);
    setSelectedTableId(tableId);
    setActiveTableTab('fields');
  };

  // Reset to All Resources / Global View
  const handleResetToAll = () => {
    setSelectedSystemId(null);
    setSelectedDbId(null);
    setSelectedTableId(null);
  };

  // Calculated active nodes
  const currentSystem = useMemo(() => {
    return OVERVIEW_TREE_DATA.find(s => s.id === selectedSystemId) || null;
  }, [selectedSystemId]);

  const currentDb = useMemo(() => {
    if (!currentSystem || !selectedDbId) return null;
    return currentSystem.databases.find(d => d.id === selectedDbId) || null;
  }, [currentSystem, selectedDbId]);

  const currentTable = useMemo(() => {
    if (!currentDb || !selectedTableId) return null;
    return currentDb.tables.find(t => t.id === selectedTableId) || null;
  }, [currentDb, selectedTableId]);

  // Overall Statistics across all trees
  const globalStats = useMemo(() => {
    let totalSys = OVERVIEW_TREE_DATA.length;
    let totalDb = 0;
    let totalTbl = 0;
    let totalFields = 0;

    OVERVIEW_TREE_DATA.forEach(s => {
      totalDb += s.databases.length;
      s.databases.forEach(d => {
        totalTbl += d.tables.length;
        d.tables.forEach(t => {
          totalFields += t.fields.length;
        });
      });
    });

    return { totalSys, totalDb, totalTbl, totalFields };
  }, []);

  // Filter tree data based on search keyword
  const filteredTree = useMemo(() => {
    if (!treeSearch.trim()) return OVERVIEW_TREE_DATA;

    const q = treeSearch.toLowerCase();
    return OVERVIEW_TREE_DATA.map(sys => {
      const sysMatch = sys.name.toLowerCase().includes(q) || sys.code.toLowerCase().includes(q) || sys.deptName.toLowerCase().includes(q);
      
      const filteredDbs = sys.databases.map(db => {
        const dbMatch = db.name.toLowerCase().includes(q) || db.label.toLowerCase().includes(q);
        const filteredTables = db.tables.filter(tbl => 
          tbl.name.toLowerCase().includes(q) || tbl.label.toLowerCase().includes(q)
        );

        if (dbMatch || filteredTables.length > 0) {
          return { ...db, tables: filteredTables.length > 0 ? filteredTables : db.tables };
        }
        return null;
      }).filter(Boolean) as DatabaseNode[];

      if (sysMatch || filteredDbs.length > 0) {
        return { ...sys, databases: filteredDbs.length > 0 ? filteredDbs : sys.databases };
      }
      return null;
    }).filter(Boolean) as SystemNode[];
  }, [treeSearch]);

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-100/70 overflow-hidden">
      {/* Container header banner */}
      <div className="bg-white border-b border-slate-200/90 px-5 py-2 flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <FolderTree className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">资源总览</h2>
        </div>

        {/* Global summary badge pills */}
        <div className="hidden lg:flex items-center gap-2.5 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-lg">
          <div className="text-center px-1.5">
            <div className="text-[10px] text-slate-400 font-medium">应用系统</div>
            <div className="text-xs font-bold text-slate-800 font-mono">{globalStats.totalSys} 个</div>
          </div>
          <div className="h-5 w-px bg-slate-200"></div>
          <div className="text-center px-1.5">
            <div className="text-[10px] text-slate-400 font-medium">数据库</div>
            <div className="text-xs font-bold text-indigo-600 font-mono">{globalStats.totalDb} 个</div>
          </div>
          <div className="h-5 w-px bg-slate-200"></div>
          <div className="text-center px-1.5">
            <div className="text-[10px] text-slate-400 font-medium">数据表</div>
            <div className="text-xs font-bold text-emerald-600 font-mono">{globalStats.totalTbl} 张</div>
          </div>
          <div className="h-5 w-px bg-slate-200"></div>
          <div className="text-center px-1.5">
            <div className="text-[10px] text-slate-400 font-medium">元数据项</div>
            <div className="text-xs font-bold text-amber-600 font-mono">{globalStats.totalFields} 项</div>
          </div>
        </div>
      </div>

      {/* Main split area: Left Tree (280px) + Right Detail Panel */}
      <div className="flex-1 flex overflow-hidden p-4 gap-4">
        
        {/* ==================== LEFT SIDEBAR: 3-LEVEL RESOURCE TREE ==================== */}
        <div className="w-80 bg-white rounded-xl border border-slate-200/90 shadow-2xs flex flex-col overflow-hidden shrink-0">
          
          {/* Tree Header & Search */}
          <div className="p-3 border-b border-slate-200/80 bg-slate-50/50 space-y-2.5">
            <div className="flex items-center justify-between">
              <button 
                onClick={handleResetToAll}
                className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${
                  !selectedSystemId ? 'text-indigo-600' : 'text-slate-700 hover:text-indigo-600'
                }`}
              >
                <Building2 className="w-4 h-4 text-indigo-600" />
                <span>市市场监督管理局 (全局)</span>
              </button>
              <span className="text-[10px] bg-slate-200/70 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                {globalStats.totalSys}系统
              </span>
            </div>

            {/* Tree search input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={treeSearch}
                onChange={e => setTreeSearch(e.target.value)}
                placeholder="搜索系统、数据库或表名..."
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Tree Scroll List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1 text-xs select-none">
            {filteredTree.map(sys => {
              const isSysExpanded = expandedSystems[sys.id] ?? true;
              const isSysSelected = selectedSystemId === sys.id && !selectedDbId && !selectedTableId;

              return (
                <div key={sys.id} className="space-y-0.5">
                  {/* LEVEL 1: SYSTEM NODE */}
                  <div 
                    onClick={() => handleSelectSystem(sys.id)}
                    className={`group flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer transition-all ${
                      isSysSelected 
                        ? 'bg-indigo-50 text-indigo-900 font-semibold ring-1 ring-indigo-200' 
                        : 'text-slate-800 hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                      <button 
                        onClick={(e) => toggleSystemExpand(sys.id, e)}
                        className="p-0.5 rounded hover:bg-slate-200/60 text-slate-400 hover:text-slate-700 shrink-0"
                      >
                        {isSysExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      </button>
                      <Server className={`w-3.5 h-3.5 shrink-0 ${isSysSelected ? 'text-indigo-600' : 'text-slate-500 group-hover:text-indigo-600'}`} />
                      <span className="truncate text-xs tracking-tight" title={sys.name}>{sys.name}</span>
                    </div>
                    <span className="text-[10px] bg-slate-100 group-hover:bg-white text-slate-500 px-1.5 py-0.2 rounded border border-slate-200/60 shrink-0 font-mono ml-1">
                      系统
                    </span>
                  </div>

                  {/* LEVEL 2: DATABASE NODES (Under System) */}
                  {isSysExpanded && sys.databases.map(db => {
                    const isDbExpanded = expandedDbs[db.id] ?? true;
                    const isDbSelected = selectedDbId === db.id && !selectedTableId;

                    return (
                      <div key={db.id} className="pl-4 space-y-0.5">
                        <div 
                          onClick={() => handleSelectDb(sys.id, db.id)}
                          className={`group flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer transition-all ${
                            isDbSelected 
                              ? 'bg-indigo-50/80 text-indigo-900 font-semibold ring-1 ring-indigo-200/80' 
                              : 'text-slate-700 hover:bg-slate-100/80'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 min-w-0 flex-1">
                            <button 
                              onClick={(e) => toggleDbExpand(db.id, e)}
                              className="p-0.5 rounded hover:bg-slate-200/60 text-slate-400 hover:text-slate-700 shrink-0"
                            >
                              {isDbExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                            </button>
                            <Database className={`w-3.5 h-3.5 shrink-0 ${isDbSelected ? 'text-indigo-600' : 'text-indigo-500/80'}`} />
                            <span className="truncate text-xs font-mono" title={db.name}>{db.name}</span>
                          </div>
                          <span className="text-[9px] text-slate-400 font-mono border border-slate-200/50 px-1 rounded bg-slate-50 shrink-0">
                            库
                          </span>
                        </div>

                        {/* LEVEL 3: TABLE NODES (Under Database) */}
                        {isDbExpanded && db.tables.map(tbl => {
                          const isTableSelected = selectedTableId === tbl.id;

                          return (
                            <div key={tbl.id} className="pl-5">
                              <div
                                onClick={() => handleSelectTable(sys.id, db.id, tbl.id)}
                                className={`flex items-center justify-between px-2 py-1 rounded-md cursor-pointer transition-all text-xs ${
                                  isTableSelected
                                    ? 'bg-indigo-600 text-white font-medium shadow-2xs'
                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                }`}
                              >
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <TableIcon className={`w-3 h-3 shrink-0 ${isTableSelected ? 'text-indigo-200' : 'text-emerald-600'}`} />
                                  <span className="truncate font-mono text-[11px]" title={`${tbl.name} (${tbl.label})`}>
                                    {tbl.name}
                                  </span>
                                </div>
                                <span className={`text-[9px] px-1 rounded font-mono shrink-0 ${
                                  isTableSelected ? 'bg-indigo-700/60 text-indigo-100' : 'text-slate-400 bg-slate-100'
                                }`}>
                                  表
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Tree Footer Info */}
          <div className="p-2.5 border-t border-slate-200/80 bg-slate-50 text-[11px] text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              元数据探针引擎正常
            </span>
            <button 
              onClick={handleResetToAll}
              className="text-indigo-600 hover:underline font-medium text-[10px]"
            >
              重置选中
            </button>
          </div>
        </div>

        {/* ==================== RIGHT PANEL: CORRESPONDING LEVEL CONTENT ==================== */}
        <div className="flex-1 bg-white rounded-xl border border-slate-200/90 shadow-2xs flex flex-col overflow-hidden">
          
          {/* Top Breadcrumb Header */}
          <div className="bg-slate-50/70 border-b border-slate-200/80 px-5 py-2.5 flex items-center justify-between text-xs shrink-0">
            <div className="flex items-center gap-2 text-slate-500">
              <button onClick={handleResetToAll} className="hover:text-indigo-600 font-medium">
                市市场监督管理局
              </button>
              {currentSystem && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className={`font-semibold ${!currentDb ? 'text-slate-900 font-bold' : ''}`}>
                    {currentSystem.name}
                  </span>
                </>
              )}
              {currentDb && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className={`font-mono ${!currentTable ? 'text-slate-900 font-bold' : ''}`}>
                    {currentDb.name}
                  </span>
                </>
              )}
              {currentTable && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-indigo-600 font-bold font-mono">
                    {currentTable.name} ({currentTable.label})
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 rounded text-slate-600 hover:bg-slate-50 transition-colors text-[11px]">
                <RefreshCw className="w-3 h-3 text-slate-400" />
                <span>更新探针</span>
              </button>
              <button className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 border border-indigo-200 rounded text-indigo-700 hover:bg-indigo-100 transition-colors text-[11px] font-medium">
                <Download className="w-3 h-3 text-indigo-600" />
                <span>导出字典</span>
              </button>
            </div>
          </div>

          {/* Dynamic Content Panel Depending on Selected Level */}
          <div className="flex-1 overflow-y-auto p-3.5">

            {/* ----------------- LEVEL CASE 1: TABLE SELECTED (表层级) ----------------- */}
            {currentTable && currentDb && currentSystem ? (
              <div className="space-y-3">
                {/* Table Header Card */}
                <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-xl p-3.5 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-400/30">
                          数据表
                        </span>
                        <span className="text-xs text-slate-300 font-mono">
                          {currentSystem.name} / {currentDb.name}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold font-mono tracking-tight mt-0.5 text-white">
                        {currentTable.name}
                      </h3>
                      <p className="text-xs text-indigo-200/90 mt-0.5 font-medium">
                        {currentTable.label} · {currentTable.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg px-2.5 py-1.5 text-center">
                        <div className="text-[10px] text-slate-300">记录总数</div>
                        <div className="text-xs font-bold font-mono text-emerald-400">{currentTable.recordCount}</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg px-2.5 py-1.5 text-center">
                        <div className="text-[10px] text-slate-300">存储容量</div>
                        <div className="text-xs font-bold font-mono text-amber-300">{currentTable.storageSize}</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg px-2.5 py-1.5 text-center">
                        <div className="text-[10px] text-slate-300">字段数量</div>
                        <div className="text-xs font-bold font-mono text-indigo-300">{currentTable.fields.length} 个</div>
                      </div>
                    </div>
                  </div>

                  {/* Attributes Pills */}
                  <div className="mt-2.5 pt-2 border-t border-white/10 flex flex-wrap items-center gap-4 text-xs text-slate-300">
                    <span className="flex items-center gap-1">
                      <Key className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>主键列:</span> <code className="font-mono text-amber-200">{currentTable.primaryKey}</code>
                    </span>
                    <span className="text-white/20">|</span>
                    <span className="flex items-center gap-1">
                      <Hash className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>索引数量:</span> <strong className="font-mono text-indigo-200">{currentTable.indexCount ?? 3} 个</strong>
                    </span>
                    <span className="text-white/20">|</span>
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>分区方式:</span> <span className="text-blue-200">{currentTable.partitionType || '按月范围分区 (RANGE)'}</span>
                    </span>
                    <span className="text-white/20">|</span>
                    <span className="flex items-center gap-1">
                      <Cpu className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>存储引擎:</span> <code className="font-mono text-emerald-200">{currentTable.storageEngine || 'InnoDB'}</code>
                    </span>
                    <span className="text-white/20">|</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>创建时间:</span> <span className="font-mono text-slate-200">{currentTable.createdAt || '2026-03-15 10:00:00'}</span>
                    </span>
                  </div>
                </div>

                {/* Tabs inside Table View: Fields / Sample Data / DDL */}
                <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
                  <div className="border-b border-slate-200 px-3 flex items-center justify-between bg-slate-50/80">
                    <div className="flex gap-1">
                      <button
                        onClick={() => setActiveTableTab('fields')}
                        className={`px-3 py-2 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                          activeTableTab === 'fields'
                            ? 'border-indigo-600 text-indigo-600 bg-white shadow-2xs'
                            : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>元数据字典 ({currentTable.fields.length})</span>
                      </button>
                      <button
                        onClick={() => setActiveTableTab('sample')}
                        className={`px-3 py-2 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                          activeTableTab === 'sample'
                            ? 'border-indigo-600 text-indigo-600 bg-white shadow-2xs'
                            : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>数据预览 (样例)</span>
                      </button>
                      <button
                        onClick={() => setActiveTableTab('ddl')}
                        className={`px-3 py-2 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                          activeTableTab === 'ddl'
                            ? 'border-indigo-600 text-indigo-600 bg-white shadow-2xs'
                            : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        <Code className="w-3.5 h-3.5" />
                        <span>DDL 建表结构</span>
                      </button>
                      <button
                        onClick={() => setActiveTableTab('relations')}
                        className={`px-3 py-2 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                          activeTableTab === 'relations'
                            ? 'border-indigo-600 text-indigo-600 bg-white shadow-2xs'
                            : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        <GitFork className="w-3.5 h-3.5 text-indigo-600" />
                        <span>表关联 ({GET_TABLE_RELATIONS(currentTable.id).length})</span>
                      </button>
                    </div>

                    <span className="text-[11px] text-slate-400">
                      自动探测自 {currentDb.hostPort}
                    </span>
                  </div>

                  {/* TAB CONTENT 1: METADATA FIELDS */}
                  {activeTableTab === 'fields' && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold text-[11px]">
                            <th className="py-2.5 px-4 w-12 text-center">#</th>
                            <th className="py-2.5 px-4">物理字段名</th>
                            <th className="py-2.5 px-4">中文名称</th>
                            <th className="py-2.5 px-4">数据类型</th>
                            <th className="py-2.5 px-4">主键/必填</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
                          {currentTable.fields.map((field, idx) => (
                            <tr key={field.name} className="hover:bg-slate-50/80 transition-colors">
                              <td className="py-2.5 px-4 text-center font-mono text-slate-400 text-[11px]">
                                {idx + 1}
                              </td>
                              <td className="py-2.5 px-4 font-mono font-bold text-slate-900">
                                <div className="flex items-center gap-1.5">
                                  {field.isPrimary && (
                                    <Key className="w-3 h-3 text-amber-500 shrink-0" title="主键" />
                                  )}
                                  <span>{field.name}</span>
                                </div>
                              </td>
                              <td className="py-2.5 px-4 font-medium text-slate-800">
                                {field.label}
                              </td>
                              <td className="py-2.5 px-4 font-mono text-indigo-600 bg-indigo-50/30">
                                {field.type}{field.length ? `(${field.length})` : ''}
                              </td>
                              <td className="py-2.5 px-4">
                                <div className="flex items-center gap-1.5">
                                  {field.isPrimary && (
                                    <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded text-[10px] font-semibold border border-amber-200">
                                      主键 PK
                                    </span>
                                  )}
                                  {!field.isNullable ? (
                                    <span className="px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded text-[10px]">
                                      NOT NULL
                                    </span>
                                  ) : (
                                    <span className="text-[10px] text-slate-400">可空</span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* TAB CONTENT 2: SAMPLE DATA */}
                  {activeTableTab === 'sample' && (
                    <div className="p-4 space-y-3">
                      <div className="text-xs text-slate-500 flex items-center justify-between">
                        <span>显示最新探针抽取的 3 条脱敏脱密示例记录:</span>
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-mono">
                          真实环境支持线上 SQL 实时抓取
                        </span>
                      </div>
                      {currentTable.sampleRows && currentTable.sampleRows.length > 0 ? (
                        <div className="overflow-x-auto border border-slate-200 rounded-lg">
                          <table className="w-full text-left text-xs font-mono">
                            <thead>
                              <tr className="bg-slate-100 text-slate-600 border-b border-slate-200 font-semibold">
                                {Object.keys(currentTable.sampleRows[0]).map(key => (
                                  <th key={key} className="py-2 px-3 border-r border-slate-200 last:border-r-0 whitespace-nowrap">
                                    {key}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                              {currentTable.sampleRows.map((row, rIdx) => (
                                <tr key={rIdx} className="hover:bg-slate-50">
                                  {Object.values(row).map((val, cIdx) => (
                                    <td key={cIdx} className="py-2 px-3 border-r border-slate-200 last:border-r-0 whitespace-nowrap text-slate-700">
                                      {val}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="py-8 text-center text-slate-400 text-xs">
                          尚无自动挂载的样例数据
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB CONTENT 3: DDL PREVIEW */}
                  {activeTableTab === 'ddl' && (
                    <div className="p-4 bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto rounded-b-xl leading-relaxed">
                      <pre className="text-emerald-400">
{`-- 数据库建表 DDL 语句 (自动推导生成)
CREATE TABLE ${currentTable.name} (
${currentTable.fields.map(f => `  ${f.name.padEnd(20)} ${f.type}${f.length ? `(${f.length})` : ''} ${!f.isNullable ? 'NOT NULL' : 'NULL'}${f.isPrimary ? ' PRIMARY KEY' : ''}`).join(',\n')}
);

-- 列注释补充
${currentTable.fields.map(f => `COMMENT ON COLUMN ${currentTable.name}.${f.name} IS '${f.label}';`).join('\n')}
`}
                      </pre>
                    </div>
                  )}

                  {/* TAB CONTENT 4: TABLE RELATIONS (表关联 - ER 实体图模式) */}
                  {activeTableTab === 'relations' && (() => {
                    const relations = GET_TABLE_RELATIONS(currentTable.id);
                    const parentRelations = relations.filter(r => r.relationRole === 'child_of'); // 本表是子表，关联的主表
                    const childRelations = relations.filter(r => r.relationRole === 'parent_of');  // 本表是主表，引用的子表

                    return (
                      <div className="p-4 space-y-4 bg-slate-50/50">
                        {/* Header Info & Legend Bar */}
                        <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-2xs">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-600 shrink-0">
                              <Workflow className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                                <span>实体关系模型 (ER Diagram) 拓扑</span>
                                <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-mono font-semibold">
                                  {relations.length} 个关联实体
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                清晰可视化展示当前表与主表（1端）及子表（N端）的外键映射与基数关系
                              </p>
                            </div>
                          </div>

                          {/* Inline Legend & Counters */}
                          <div className="flex flex-wrap items-center gap-3 text-xs shrink-0">
                            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200/80 text-[11px] font-semibold">
                              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                              <span>关联主表 (1端): {parentRelations.length}</span>
                            </div>
                            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[11px] font-semibold">
                              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                              <span>引用子表 (N端): {childRelations.length}</span>
                            </div>
                          </div>
                        </div>

                        {/* Visual ER Diagram Canvas */}
                        <div className="bg-slate-900 text-slate-100 p-5 md:p-6 rounded-2xl border border-slate-800 shadow-xl overflow-x-auto min-h-[460px] relative">
                          {/* Top Canvas Legend */}
                          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-800 text-[11px] text-slate-400 font-mono">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1.5 text-amber-300">
                                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                                1端: 主键提供方 (Master)
                              </span>
                              <span className="flex items-center gap-1.5 text-indigo-300">
                                <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                                当前上下文表 (Central Entity)
                              </span>
                              <span className="flex items-center gap-1.5 text-emerald-300">
                                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                                N端: 外键持有方 (Detail)
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-[10px]">
                              <span>🔑 PK: 主键</span>
                              <span>🔗 FK: 外键</span>
                              <span className="text-emerald-400">━━ 实线: 物理外键</span>
                              <span className="text-blue-400">┈┈ 虚线: 业务软关联</span>
                            </div>
                          </div>

                          {relations.length === 0 ? (
                            <div className="text-center py-16 space-y-3">
                              <Workflow className="w-12 h-12 text-slate-600 mx-auto" />
                              <div className="text-sm font-semibold text-slate-300">暂无关联的 ER 实体节点</div>
                              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                                该数据表当前作为独立基础实体运行，尚未配置与其他系统的物理外键约束或业务软关联。
                              </p>
                            </div>
                          ) : (
                            <div className="min-w-[840px]">
                              {/* ER Columns Layout */}
                              <div className="grid grid-cols-11 gap-2 items-center">

                                {/* LEFT COLUMN: PARENT MASTER TABLES (3 cols) */}
                                <div className="col-span-3 space-y-3">
                                  <div className="text-center text-[11px] font-mono text-amber-400 font-bold bg-amber-950/60 border border-amber-800/60 py-1 rounded-md">
                                    ▲ 关联主表 (1端 / Master)
                                  </div>

                                  {parentRelations.length > 0 ? (
                                    parentRelations.map((rel) => (
                                      <div key={rel.id} className="bg-slate-800/90 border border-amber-500/50 hover:border-amber-400 rounded-xl overflow-hidden shadow-md transition-all">
                                        {/* Table Header */}
                                        <div className="bg-amber-950/80 px-3 py-2 border-b border-amber-500/30 flex items-center justify-between">
                                          <div className="flex items-center gap-1.5 truncate">
                                            <Database className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                            <span className="font-mono text-xs font-bold text-amber-200 truncate">
                                              {rel.relatedTableName}
                                            </span>
                                          </div>
                                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/30 text-amber-300 font-mono font-bold border border-amber-400/40 shrink-0">
                                            1
                                          </span>
                                        </div>

                                        {/* Sub Info */}
                                        <div className="px-3 py-1 bg-slate-950/70 text-[10px] text-slate-400 flex justify-between border-b border-slate-800">
                                          <span className="truncate">{rel.relatedTableLabel}</span>
                                          <span className="font-mono text-slate-500 shrink-0">{rel.relatedSysName}</span>
                                        </div>

                                        {/* Key Field Mapping */}
                                        <div className="p-2.5 space-y-1 text-xs font-mono">
                                          <div className="flex items-center justify-between text-amber-300 bg-amber-950/30 px-2 py-1 rounded border border-amber-500/30">
                                            <span className="text-[10px] text-slate-400">主键列 (PK):</span>
                                            <span className="font-bold">{rel.relatedField}</span>
                                          </div>
                                          <div className="text-[10px] text-slate-400 px-1 pt-0.5 flex items-center justify-between">
                                            <span>关联外键:</span>
                                            <span className="text-indigo-300 font-semibold">{rel.currentField}</span>
                                          </div>
                                        </div>

                                        {/* Action Link */}
                                        <div className="px-2.5 py-1.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[10px]">
                                          <span className="text-slate-500 font-mono truncate">{rel.constraintName || '外键约束'}</span>
                                          <button
                                            onClick={() => handleSelectTable(rel.relatedSysId, rel.relatedDbId, rel.relatedTableId)}
                                            className="text-amber-300 hover:text-amber-100 font-semibold flex items-center gap-0.5 shrink-0 hover:underline"
                                          >
                                            <span>查看该表</span>
                                            <ArrowUpRight className="w-3 h-3" />
                                          </button>
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="border border-dashed border-slate-800 rounded-xl p-5 text-center text-xs text-slate-500 bg-slate-950/40">
                                      无上游关联主表
                                    </div>
                                  )}
                                </div>

                                {/* CONNECTOR AREA 1: LEFT TO MIDDLE (1 col) */}
                                <div className="col-span-1 flex flex-col justify-center items-center py-4 relative h-full min-h-[200px]">
                                  {parentRelations.length > 0 ? (
                                    parentRelations.map((rel, idx) => (
                                      <div key={rel.id || idx} className="w-full flex flex-col items-center justify-center my-auto py-2">
                                        <div className="w-full relative flex items-center justify-center my-1">
                                          <svg className="w-full h-8 overflow-visible" preserveAspectRatio="none">
                                            <defs>
                                              <marker id={`arrow-amber-${idx}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                                <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
                                              </marker>
                                            </defs>
                                            <line
                                              x1="0%"
                                              y1="50%"
                                              x2="100%"
                                              y2="50%"
                                              stroke="#f59e0b"
                                              strokeWidth="2"
                                              strokeDasharray={rel.relationType === 'FK_HARD' ? 'none' : '4 3'}
                                              markerEnd={`url(#arrow-amber-${idx})`}
                                            />
                                          </svg>
                                        </div>

                                        <div className="px-1.5 py-0.5 rounded bg-amber-950 border border-amber-500/60 text-amber-300 text-[10px] font-mono text-center shadow-md font-bold shrink-0 z-10">
                                          {rel.cardinality || '1:N'}
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="w-full border-t border-dashed border-slate-800 my-auto"></div>
                                  )}
                                </div>

                                {/* MIDDLE COLUMN: CURRENT ACTIVE TABLE (3 cols) */}
                                <div className="col-span-3 space-y-2">
                                  <div className="text-center text-[11px] font-mono text-indigo-400 font-bold bg-indigo-950/60 border border-indigo-800/60 py-1 rounded-md">
                                    ★ 当前表 (Central Entity)
                                  </div>

                                  <div className="bg-slate-800 border-2 border-indigo-500 rounded-xl overflow-hidden shadow-2xl ring-4 ring-indigo-500/20">
                                    {/* Table Header */}
                                    <div className="bg-gradient-to-r from-indigo-900 via-slate-800 to-indigo-950 px-3.5 py-2.5 border-b border-indigo-500/50 flex items-center justify-between">
                                      <div>
                                        <div className="flex items-center gap-1.5">
                                          <TableIcon className="w-4 h-4 text-indigo-400 shrink-0" />
                                          <span className="font-mono text-sm font-bold text-white tracking-tight">
                                            {currentTable.name}
                                          </span>
                                        </div>
                                        <div className="text-[11px] text-indigo-200 mt-0.5">
                                          {currentTable.label}
                                        </div>
                                      </div>
                                      <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-200 font-mono font-bold border border-indigo-400/40 shrink-0">
                                        {currentTable.recordCount} 条
                                      </span>
                                    </div>

                                    {/* System & DB Info */}
                                    <div className="px-3 py-1 bg-slate-950 text-[10px] text-slate-400 flex items-center justify-between border-b border-slate-700">
                                      <span>系统: {currentSystem?.name}</span>
                                      <span>库: {currentDb?.name}</span>
                                    </div>

                                    {/* Fields List (Only Primary and Foreign Key Fields + total summary) */}
                                    <div className="p-3 space-y-1.5 max-h-[260px] overflow-y-auto font-mono text-xs">
                                      {currentTable.fields.map((field) => {
                                        const isParentFk = parentRelations.some(r => r.currentField === field.name);
                                        const isChildPk = childRelations.some(r => r.currentField === field.name);

                                        return (
                                          <div
                                            key={field.name}
                                            className={`p-1.5 rounded-lg border flex items-center justify-between transition-all ${
                                              field.isPrimary
                                                ? 'bg-amber-950/50 border-amber-500/60 text-amber-200 font-bold'
                                                : isParentFk
                                                ? 'bg-indigo-950/60 border-indigo-500/60 text-indigo-200 font-bold'
                                                : isChildPk
                                                ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-200 font-bold'
                                                : 'bg-slate-900/70 border-slate-700/60 text-slate-300'
                                            }`}
                                          >
                                            <div className="flex items-center gap-1.5 truncate">
                                              {field.isPrimary && (
                                                <span className="text-[9px] px-1 bg-amber-500/30 text-amber-300 rounded font-bold shrink-0">PK</span>
                                              )}
                                              {isParentFk && (
                                                <span className="text-[9px] px-1 bg-indigo-500/30 text-indigo-300 rounded font-bold shrink-0">FK</span>
                                              )}
                                              <span className="truncate">{field.name}</span>
                                            </div>
                                            <span className="text-[10px] text-slate-400 shrink-0 ml-1">
                                              {field.type}
                                            </span>
                                          </div>
                                        );
                                      })}
                                    </div>

                                    {/* Table Footer Summary */}
                                    <div className="px-3 py-2 bg-slate-950 border-t border-slate-800 text-[10px] text-slate-400 flex flex-wrap items-center justify-between gap-2 font-mono">
                                      <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-amber-300">主键: {currentTable.primaryKey}</span>
                                        <span className="text-slate-600">•</span>
                                        <span>索引: {currentTable.indexCount ?? 3}个</span>
                                        <span className="text-slate-600">•</span>
                                        <span>分区: {currentTable.partitionType || 'RANGE'}</span>
                                        <span className="text-slate-600">•</span>
                                        <span>引擎: {currentTable.storageEngine || 'InnoDB'}</span>
                                      </div>
                                      <span className="text-indigo-400 font-semibold shrink-0">{currentTable.fields.length} 个字段</span>
                                    </div>
                                  </div>
                                </div>

                                {/* CONNECTOR AREA 2: MIDDLE TO RIGHT (1 col) */}
                                <div className="col-span-1 flex flex-col justify-center items-center py-4 relative h-full min-h-[200px]">
                                  {childRelations.length > 0 ? (
                                    childRelations.map((rel, idx) => (
                                      <div key={rel.id || idx} className="w-full flex flex-col items-center justify-center my-auto py-2">
                                        <div className="w-full relative flex items-center justify-center my-1">
                                          <svg className="w-full h-8 overflow-visible" preserveAspectRatio="none">
                                            <defs>
                                              <marker id={`arrow-emerald-${idx}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                                <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
                                              </marker>
                                            </defs>
                                            <line
                                              x1="0%"
                                              y1="50%"
                                              x2="100%"
                                              y2="50%"
                                              stroke="#10b981"
                                              strokeWidth="2"
                                              strokeDasharray={rel.relationType === 'FK_HARD' ? 'none' : '4 3'}
                                              markerEnd={`url(#arrow-emerald-${idx})`}
                                            />
                                          </svg>
                                        </div>

                                        <div className="px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-500/60 text-emerald-300 text-[10px] font-mono text-center shadow-md font-bold shrink-0 z-10">
                                          {rel.cardinality || '1:N'}
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="w-full border-t border-dashed border-slate-800 my-auto"></div>
                                  )}
                                </div>

                                {/* RIGHT COLUMN: CHILD DETAIL TABLES (3 cols) */}
                                <div className="col-span-3 space-y-3">
                                  <div className="text-center text-[11px] font-mono text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/60 py-1 rounded-md">
                                    ▼ 引用子表 (N端 / Detail)
                                  </div>

                                  {childRelations.length > 0 ? (
                                    childRelations.map((rel) => (
                                      <div key={rel.id} className="bg-slate-800/90 border border-emerald-500/50 hover:border-emerald-400 rounded-xl overflow-hidden shadow-md transition-all">
                                        {/* Table Header */}
                                        <div className="bg-emerald-950/80 px-3 py-2 border-b border-emerald-500/30 flex items-center justify-between">
                                          <div className="flex items-center gap-1.5 truncate">
                                            <Database className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                            <span className="font-mono text-xs font-bold text-emerald-200 truncate">
                                              {rel.relatedTableName}
                                            </span>
                                          </div>
                                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/30 text-emerald-300 font-mono font-bold border border-emerald-400/40 shrink-0">
                                            N
                                          </span>
                                        </div>

                                        {/* Sub Info */}
                                        <div className="px-3 py-1 bg-slate-950/70 text-[10px] text-slate-400 flex justify-between border-b border-slate-800">
                                          <span className="truncate">{rel.relatedTableLabel}</span>
                                          <span className="font-mono text-slate-500 shrink-0">{rel.relatedSysName}</span>
                                        </div>

                                        {/* Key Field Mapping */}
                                        <div className="p-2.5 space-y-1 text-xs font-mono">
                                          <div className="flex items-center justify-between text-emerald-300 bg-emerald-950/30 px-2 py-1 rounded border border-emerald-500/30">
                                            <span className="text-[10px] text-slate-400">外键列 (FK):</span>
                                            <span className="font-bold">{rel.relatedField}</span>
                                          </div>
                                          <div className="text-[10px] text-slate-400 px-1 pt-0.5 flex items-center justify-between">
                                            <span>对应主表主键:</span>
                                            <span className="text-indigo-300 font-semibold">{rel.currentField}</span>
                                          </div>
                                        </div>

                                        {/* Action Link */}
                                        <div className="px-2.5 py-1.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[10px]">
                                          <span className="text-slate-500 font-mono truncate">{rel.constraintName || '外键引用'}</span>
                                          <button
                                            onClick={() => handleSelectTable(rel.relatedSysId, rel.relatedDbId, rel.relatedTableId)}
                                            className="text-emerald-300 hover:text-emerald-100 font-semibold flex items-center gap-0.5 shrink-0 hover:underline"
                                          >
                                            <span>查看该表</span>
                                            <ArrowUpRight className="w-3 h-3" />
                                          </button>
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="border border-dashed border-slate-800 rounded-xl p-5 text-center text-xs text-slate-500 bg-slate-950/40">
                                      无下游引用子表
                                    </div>
                                  )}
                                </div>

                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            ) : currentDb && currentSystem ? (

              /* ----------------- LEVEL CASE 2: DATABASE SELECTED (库层级) ----------------- */
              <div className="space-y-3">
                {/* Database Header */}
                <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-2xs space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-200/80">
                          数据库
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          所属系统: {currentSystem.name} ({currentSystem.code})
                        </span>
                      </div>
                      <h3 className="text-lg font-bold font-mono text-slate-900 tracking-tight mt-0.5 flex items-center gap-2">
                        <Database className="w-4 h-4 text-indigo-600" />
                        <span>{currentDb.name}</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">{currentDb.label}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        在线连接正常
                      </span>
                    </div>
                  </div>

                  {/* DB Specs Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2.5 border-t border-slate-100 text-xs">
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <div className="text-[10px] text-slate-400">数据库类型</div>
                      <div className="font-bold font-mono text-slate-800 mt-0.5">{currentDb.dbType}</div>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <div className="text-[10px] text-slate-400">连接地址与端口</div>
                      <div className="font-bold font-mono text-slate-800 mt-0.5">{currentDb.hostPort}</div>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <div className="text-[10px] text-slate-400">字符编码</div>
                      <div className="font-bold font-mono text-slate-800 mt-0.5">{currentDb.charset}</div>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <div className="text-[10px] text-slate-400">最近元数据探针时间</div>
                      <div className="font-bold font-mono text-slate-800 mt-0.5">{currentDb.lastProbeTime}</div>
                    </div>
                  </div>
                </div>

                {/* Table List inside this DB */}
                <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
                  <div className="p-3 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <TableIcon className="w-4 h-4 text-emerald-600" />
                      <span>数据库表列表 ({currentDb.tables.length} 张)</span>
                    </h4>
                    <span className="text-[11px] text-slate-500">点击表行可穿透查看表结构字段字典</span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {currentDb.tables.map(tbl => (
                      <div 
                        key={tbl.id}
                        onClick={() => handleSelectTable(currentSystem.id, currentDb.id, tbl.id)}
                        className="p-3 hover:bg-slate-50/90 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 group"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                              {tbl.name}
                            </span>
                            <span className="text-xs font-medium text-slate-600">
                              ({tbl.label})
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-1">{tbl.description}</p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 text-xs">
                          <div className="text-right">
                            <div className="font-mono font-bold text-slate-800">{tbl.recordCount} 条</div>
                            <div className="text-[10px] text-slate-400">{tbl.fields.length} 个字段 · {tbl.storageSize}</div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : currentSystem ? (

              /* ----------------- LEVEL CASE 3: SYSTEM SELECTED (系统层级) ----------------- */
              <div className="space-y-3">
                {/* System Header */}
                <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-2xs space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-indigo-600 text-white text-[10px] font-bold">
                          业务系统
                        </span>
                        <span className="text-xs font-mono text-slate-500">{currentSystem.code}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 tracking-tight mt-0.5">
                        {currentSystem.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{currentSystem.description}</p>
                    </div>

                    <div className="shrink-0 bg-slate-50 border border-slate-200/80 rounded-lg p-2.5 text-right">
                      <div className="text-[10px] text-slate-400">责任部门 (业务司局)</div>
                      <div className="text-xs font-bold text-slate-800 mt-0.5">{currentSystem.deptName}</div>
                    </div>
                  </div>

                  {/* System Stats Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2.5 border-t border-slate-100 text-xs">
                    <div className="p-2 bg-indigo-50/50 border border-indigo-100 rounded-lg">
                      <div className="text-[10px] text-indigo-600 font-medium">数据库数量</div>
                      <div className="text-base font-bold text-indigo-900 font-mono mt-0.5">{currentSystem.databases.length} 个</div>
                    </div>
                    <div className="p-2 bg-emerald-50/50 border border-emerald-100 rounded-lg">
                      <div className="text-[10px] text-emerald-600 font-medium">包含数据表</div>
                      <div className="text-base font-bold text-emerald-900 font-mono mt-0.5">
                        {currentSystem.databases.reduce((acc, d) => acc + d.tables.length, 0)} 张
                      </div>
                    </div>
                    <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg">
                      <div className="text-[10px] text-slate-500 font-medium">系统责任联系人</div>
                      <div className="text-xs font-bold text-slate-800 mt-0.5">{currentSystem.contactPerson}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{currentSystem.contactPhone}</div>
                    </div>
                  </div>
                </div>

                {/* Databases Under System */}
                <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-3 space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <Database className="w-4 h-4 text-indigo-600" />
                    <span>该系统纳管的数据库 ({currentSystem.databases.length} 个)</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {currentSystem.databases.map(db => (
                      <div
                        key={db.id}
                        onClick={() => handleSelectDb(currentSystem.id, db.id)}
                        className="p-3 border border-slate-200/80 hover:border-indigo-300 rounded-xl hover:bg-indigo-50/30 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {db.name}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono">
                            {db.dbType}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{db.label}</p>
                        <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                          <span>{db.hostPort}</span>
                          <span className="text-indigo-600 font-semibold group-hover:underline">
                            {db.tables.length} 张表 &rarr;
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (

              /* ----------------- LEVEL CASE 4: GLOBAL ALL SUMMARY (未选中特定节点/根节点) ----------------- */
              <div className="space-y-4">
                {/* Welcome Summary Banner */}
                <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold">
                    <Building2 className="w-4 h-4" />
                    <span>市市场监督管理局 · 信息资源资产总览</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3 pt-3 border-t border-white/10">
                    <div className="bg-white/10 rounded-lg p-2.5 backdrop-blur-sm">
                      <div className="text-[10px] text-slate-300">包含业务系统</div>
                      <div className="text-base font-bold font-mono text-white mt-0.5">{globalStats.totalSys} 个</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-2.5 backdrop-blur-sm">
                      <div className="text-[10px] text-slate-300">部署数据库</div>
                      <div className="text-base font-bold font-mono text-indigo-300 mt-0.5">{globalStats.totalDb} 个</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-2.5 backdrop-blur-sm">
                      <div className="text-[10px] text-slate-300">摸清数据表</div>
                      <div className="text-base font-bold font-mono text-emerald-300 mt-0.5">{globalStats.totalTbl} 张</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-2.5 backdrop-blur-sm">
                      <div className="text-[10px] text-slate-300">梳理元数据字段</div>
                      <div className="text-base font-bold font-mono text-amber-300 mt-0.5">{globalStats.totalFields} 项</div>
                    </div>
                  </div>
                </div>

                {/* System Cards Grid Overview */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center justify-between">
                    <span>各业务司局纳管系统概览 ({OVERVIEW_TREE_DATA.length} 个)</span>
                    <span className="text-[11px] text-slate-500 font-normal">点击卡片可快速定位至左侧树</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2.5">
                    {OVERVIEW_TREE_DATA.map(sys => (
                      <div
                        key={sys.id}
                        onClick={() => handleSelectSystem(sys.id)}
                        className="bg-white rounded-xl border border-slate-200/90 hover:border-indigo-400 p-3 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100">
                              {sys.deptName}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">{sys.code}</span>
                          </div>
                          <h5 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mt-1.5">
                            {sys.name}
                          </h5>
                          <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{sys.description}</p>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                          <span className="font-mono text-[11px]">
                            {sys.databases.length} 库 / {sys.databases.reduce((acc, d) => acc + d.tables.length, 0)} 表
                          </span>
                          <span className="text-indigo-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 text-[11px]">
                            展开系统 &rarr;
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
