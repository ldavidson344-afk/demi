export type SharingType = '无条件共享' | '有条件共享' | '不予共享';

export type ResourceStatus = '待上报' | '已上报' | '已审核' | '已发布' | '草稿';

export type UpdateFrequency = '实时' | '每日' | '每周' | '每月' | '每季' | '每年';

export type DataFormat = 'RDBMS' | 'REST API' | 'CSV / Excel' | 'JSON / XML' | 'PDF文件';

export interface InformationItem {
  id: string;
  fieldName: string;       // 英文名称/数据库列名
  fieldLabel: string;      // 中文名称/信息项名称
  dataType: string;        // 数据类型: varchar, int, datetime, text, decimal
  length: string;          // 长度: 32, 255, 11,2
  isPrimaryKey: boolean;   // 是否主键
  isRequired: boolean;     // 是否必填
  maskRule: string;        // 脱敏规则: 无, 姓名脱敏, 身份证脱敏, 手机号脱敏
  sharingCondition: string;// 共享条件说明
  description: string;     // 字段备注说明
  sourceSystem?: string;   // 来源系统
  systemCategory?: string; // 系统所属分类 (自建自用, 统一建设, 外部引入)
}

export interface CatalogResource {
  id: string;
  code: string;            // 资源代码 (如 RES-330100-2026-001)
  name: string;            // 资源名称
  category: string;        // 所属分类
  deptName: string;        // 提供部门/单位
  fieldCount: number;      // 信息项数量
  sharingType: SharingType;// 共享类型
  updateFreq: UpdateFrequency;// 更新频率
  status: ResourceStatus;  // 目录状态
  dataFormat: DataFormat;  // 数据存储格式
  description: string;     // 资源简述
  createdTime: string;     // 编目时间
  updatedTime: string;     // 最新更新时间
  infoItems: InformationItem[]; // 关联信息项定义
  dataSource: string;      // 挂接数据源
  attachStatus: '已挂接' | '待挂接' | '挂接异常'; // 挂接状态
}

export interface CategoryTreeNode {
  id: string;
  label: string;
  code?: string;
  count?: number;
  children?: CategoryTreeNode[];
}

export interface TopNavItem {
  id: string;
  label: string;
  iconName: string;
  badge?: number;
}

export interface SubTab {
  id: string;
  title: string;
  closable: boolean;
  active?: boolean;
  navId?: string;
}

export interface CatalogFilterState {
  statusTab: string; // '全部' | '待上报' | '已上报' | '已审核' | '已下架'
  keyword: string;
  categoryType: string; // '行业分类' | '主题分类' | '部门分类' | '基础库分类'
  selectedNodeId: string | null;
  sharingFilter: string;
}
