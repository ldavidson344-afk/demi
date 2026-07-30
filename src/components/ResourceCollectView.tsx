import React, { useState } from 'react';
import { 
  Building2, 
  ChevronRight, 
  ChevronDown, 
  Search, 
  Plus, 
  RotateCw, 
  Play, 
  FileCode2, 
  Database, 
  DownloadCloud, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  Code, 
  Table as TableIcon, 
  SlidersHorizontal, 
  Eye, 
  Terminal, 
  Trash2, 
  Edit3, 
  Upload, 
  Layers, 
  X, 
  Sparkles,
  Info,
  Check,
  Zap,
  FolderOpen,
  Folder
} from 'lucide-react';

// 组织机构节点数据类型
export interface OrgNode {
  id: string;
  name: string;
  code: string;
  taskCount: number;
  children?: OrgNode[];
}

// 采集任务数据类型
export interface CollectionTask {
  id: string;
  taskName: string;
  taskCode: string;
  collectType: 'db_table' | 'script_parse'; // 库表采集 | 脚本解析采集
  orgId: string;
  orgName: string;
  // 库表采集字段
  dbName?: string;
  dbType?: string;
  hostPort?: string;
  tableScope?: string;
  // 脚本解析采集字段
  fileName?: string;
  dialect?: string;
  sqlContent?: string;
  
  scheduleType: string; // 每日 02:00 / 每小时增量 / 单次离线解析
  status: 'running' | 'success' | 'failed' | 'idle';
  parsedTablesCount: number;
  parsedFieldsCount: number;
  lastRunAt: string;
  duration?: string;
  logs?: string[];
}

// 初始组织机构树 mock 数据
const INITIAL_ORG_TREE: OrgNode[] = [
  {
    id: 'org_all',
    name: '市市场监督管理局',
    code: 'ORG-SCJG-000',
    taskCount: 12,
    children: [
      {
        id: 'org_djzc',
        name: '登记注册指导处 (企业注册局)',
        code: 'ORG-SCJG-01',
        taskCount: 3,
      },
      {
        id: 'org_zhjc',
        name: '执法稽查局',
        code: 'ORG-SCJG-02',
        taskCount: 2,
      },
      {
        id: 'org_fld',
        name: '反垄断与反不正当竞争局',
        code: 'ORG-SCJG-03',
        taskCount: 2,
      },
      {
        id: 'org_wljy',
        name: '网络交易监督管理司',
        code: 'ORG-SCJG-04',
        taskCount: 2,
      },
      {
        id: 'org_ggjg',
        name: '广告监督管理司',
        code: 'ORG-SCJG-05',
        taskCount: 1,
      },
      {
        id: 'org_zlfz',
        name: '质量发展与产品安全监管局',
        code: 'ORG-SCJG-06',
        taskCount: 1,
      },
      {
        id: 'org_spaq',
        name: '食品安全协调与抽检监管局',
        code: 'ORG-SCJG-07',
        taskCount: 1,
      },
      {
        id: 'org_tzsb',
        name: '特种设备安全监察局',
        code: 'ORG-SCJG-08',
        taskCount: 1,
      },
      {
        id: 'org_xyjg',
        name: '信用监督管理司',
        code: 'ORG-SCJG-09',
        taskCount: 1,
      }
    ]
  }
];

// 初始采集任务列表 Mock 数据
const INITIAL_TASKS: CollectionTask[] = [
  {
    id: 'TSK-202601',
    taskName: '市场主体登记注册数据库全量元数据采集',
    taskCode: 'COLLECT_CORP_REGISTER_DB',
    collectType: 'db_table',
    orgId: 'org_djzc',
    orgName: '登记注册指导处 (企业注册局)',
    dbName: 'corp_register_db',
    dbType: 'PostgreSQL',
    hostPort: '10.208.32.105:5432',
    tableScope: '包含特定前缀 (tb_corp_*)',
    scheduleType: '每日 02:00 自动探针扫描',
    status: 'success',
    parsedTablesCount: 18,
    parsedFieldsCount: 246,
    lastRunAt: '2026-07-29 02:00:15',
    duration: '1.2 秒',
    logs: [
      '2026-07-29 02:00:00 [INFO] 触发定时采集任务...',
      '2026-07-29 02:00:01 [INFO] 成功建立 PostgreSQL 数据库长连接 (10.208.32.105:5432)',
      '2026-07-29 02:00:01 [INFO] 扫描到 符合匹配规则表: 18 张，元数据字段: 246 个',
      '2026-07-29 02:00:02 [SUCCESS] 元数据字典探针索引构建完成，已自动挂载至待补全工作池。'
    ]
  },
  {
    id: 'TSK-202602',
    taskName: '网络交易平台经营者备案 DDL 离线脚本解析',
    taskCode: 'SCRIPT_ECOMMERCE_DDL',
    collectType: 'script_parse',
    orgId: 'org_wljy',
    orgName: '网络交易监督管理司',
    fileName: 'e_commerce_platform_schema_v2026.sql',
    dialect: 'MySQL 8.0 DDL',
    sqlContent: `CREATE TABLE tb_e_commerce_platform (
  platform_id VARCHAR(32) NOT NULL PRIMARY KEY COMMENT '平台备案标识',
  platform_name VARCHAR(120) NOT NULL COMMENT '网络交易平台名称',
  domain_name VARCHAR(100) COMMENT '平台域名网址',
  corp_uscc VARCHAR(18) NOT NULL COMMENT '运营主体统一社会信用代码',
  merchant_count INT COMMENT '平台网店商家数量'
) ENGINE=InnoDB COMMENT='网络交易平台主体备案登记表';`,
    scheduleType: '离线 SQL 脚本一键解析',
    status: 'success',
    parsedTablesCount: 4,
    parsedFieldsCount: 52,
    lastRunAt: '2026-07-28 16:30:22',
    duration: '0.4 秒',
    logs: [
      '2026-07-28 16:30:22 [INFO] 开始解析由用户上传的 MySQL 8.0 DDL SQL 语法树...',
      '2026-07-28 16:30:22 [INFO] 成功抽取 4 个 CREATE TABLE 实体模型与列注释...',
      '2026-07-28 16:30:22 [SUCCESS] DDL 结构解析完成，自动推导生成 52 个信息项草稿。'
    ]
  },
  {
    id: 'TSK-202603',
    taskName: '食品安全抽检与溯源数据库元数据采集',
    taskCode: 'COLLECT_FOOD_SAFETY_DB',
    collectType: 'db_table',
    orgId: 'org_spaq',
    orgName: '食品安全协调与抽检监管局',
    dbName: 'db_food_safety',
    dbType: 'Oracle 19c',
    hostPort: '10.128.45.10:1521',
    tableScope: '全库所有数据表 (48 张)',
    scheduleType: '每小时增量变更探针',
    status: 'running',
    parsedTablesCount: 48,
    parsedFieldsCount: 512,
    lastRunAt: '2026-07-29 01:00:00',
    duration: '进行中...',
    logs: [
      '2026-07-29 01:00:00 [INFO] 开始执行每小时增量探针采集...',
      '2026-07-29 01:00:01 [INFO] 正在与 10.128.45.10 进行 Schema 字段对比...'
    ]
  },
  {
    id: 'TSK-202604',
    taskName: '特种设备监察及检验登记 SQL 导出解析',
    taskCode: 'SCRIPT_SPECIAL_EQUIP_DDL',
    collectType: 'script_parse',
    orgId: 'org_tzsb',
    orgName: '特种设备安全监察局',
    fileName: 'special_equip_inspection_ddl.sql',
    dialect: 'PostgreSQL DDL',
    sqlContent: `CREATE TABLE tb_special_equip_reg (
  equip_reg_code VARCHAR(32) PRIMARY KEY,
  equip_type_code VARCHAR(10) NOT NULL,
  equip_name VARCHAR(100) NOT NULL,
  use_corp_name VARCHAR(120) NOT NULL,
  next_inspect_date DATE
);`,
    scheduleType: '离线 SQL 脚本一键解析',
    status: 'success',
    parsedTablesCount: 6,
    parsedFieldsCount: 88,
    lastRunAt: '2026-07-25 14:10:05',
    duration: '0.6 秒',
    logs: [
      '2026-07-25 14:10:05 [INFO] 批量解析表结构 SQL 成功！',
      '2026-07-25 14:10:05 [SUCCESS] 解析获得 6 张表结构，88 个字典字段。'
    ]
  },
  {
    id: 'TSK-202605',
    taskName: '市场监管执法稽查案件处理系统探针采集',
    taskCode: 'COLLECT_CASE_INSPECTION_DB',
    collectType: 'db_table',
    orgId: 'org_zhjc',
    orgName: '执法稽查局',
    dbName: 'market_case_inspect',
    dbType: 'MySQL 8.0',
    hostPort: '10.190.22.8:3306',
    tableScope: '全库数据表',
    scheduleType: '每日 03:00 自动探针扫描',
    status: 'idle',
    parsedTablesCount: 12,
    parsedFieldsCount: 134,
    lastRunAt: '2026-07-28 03:00:10',
    duration: '0.9 秒',
    logs: [
      '2026-07-28 03:00:10 [SUCCESS] 定时采集完成。'
    ]
  },
  {
    id: 'TSK-202606',
    taskName: '经营异常名录与严重违法失信名单数据库采集',
    taskCode: 'COLLECT_CREDIT_ABNORMAL_DB',
    collectType: 'db_table',
    orgId: 'org_xyjg',
    orgName: '信用监督管理司',
    dbName: 'db_market_credit',
    dbType: 'DM (达梦数据库)',
    hostPort: '10.130.60.15:5236',
    tableScope: '全库数据表',
    scheduleType: '每日 02:00 自动探针扫描',
    status: 'success',
    parsedTablesCount: 10,
    parsedFieldsCount: 112,
    lastRunAt: '2026-07-29 02:00:00',
    duration: '0.7 秒',
    logs: [
      '2026-07-29 02:00:00 [SUCCESS] 达梦数据库信用节点表结构索引探针抽取成功。'
    ]
  }
];

// 可选的已注册数据库列表 (库表采集使用)
const REGISTERED_DATABASES = [
  { name: 'gov_approval_db', dbType: 'PostgreSQL', hostPort: '10.208.12.44:5432', username: 'meta_reader', sysName: '综合政务审批系统' },
  { name: 'tax_core_prod', dbType: 'Oracle 19c', hostPort: '10.150.88.20:1521', username: 'tax_meta_user', sysName: '电子税务服务平台' },
  { name: 'traffic_gps_stream', dbType: 'MySQL 8.0', hostPort: '10.190.22.8:3306', username: 'traffic_reader', sysName: '智慧交通调度中心平台' },
  { name: 'db_health_prod', dbType: 'PostgreSQL', hostPort: '10.128.45.10:5432', username: 'health_meta_reader', sysName: '全市医疗卫生基础系统' },
  { name: 'db_market_reg', dbType: 'Oracle 19c', hostPort: '10.130.60.15:1521', username: 'market_meta', sysName: '企业市场监管登记平台' }
];

// 示例 DDL SQL 模版 (脚本解析采集试用)
const SAMPLE_DDL_SQL = `-- 示例 DDL SQL 脚本: 包含表结构及注释定义
CREATE TABLE tb_person_basic_info (
  person_id VARCHAR(32) NOT NULL PRIMARY KEY COMMENT '公民标识号',
  id_card_no VARCHAR(18) NOT NULL COMMENT '公民身份号码',
  full_name VARCHAR(50) NOT NULL COMMENT '姓名',
  gender VARCHAR(2) COMMENT '性别',
  birth_date DATE COMMENT '出生日期',
  register_address VARCHAR(200) COMMENT '户籍所在地门牌地址',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '记录接入时间'
) ENGINE=InnoDB COMMENT='全市人口基础信息登记表';

CREATE TABLE tb_corporate_license (
  license_id VARCHAR(32) PRIMARY KEY COMMENT '许可证书标识',
  uscc_code VARCHAR(18) NOT NULL COMMENT '统一社会信用代码',
  corp_name VARCHAR(120) NOT NULL COMMENT '企业主体全称',
  license_no VARCHAR(50) COMMENT '行政许可证编号',
  approve_dept VARCHAR(100) COMMENT '审批发证机关',
  valid_until DATE COMMENT '有效期至'
) ENGINE=InnoDB COMMENT='企业行政许可资质登记表';`;

export const ResourceCollectView: React.FC = () => {
  // 组织树与状态
  const [selectedOrgId, setSelectedOrgId] = useState<string>('org_all');
  const [orgSearchQuery, setOrgSearchQuery] = useState('');
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({ org_all: true });

  // 任务列表与筛选
  const [tasks, setTasks] = useState<CollectionTask[]>(INITIAL_TASKS);
  const [activeCollectType, setActiveCollectType] = useState<'all' | 'db_table' | 'script_parse'>('all');
  const [searchTaskQuery, setSearchTaskQuery] = useState('');

  // 模态框控制
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'db_table' | 'script_parse'>('db_table');

  // 新建任务表单状态
  const [createForm, setCreateForm] = useState({
    taskName: '',
    orgId: 'org_dsj',
    orgName: '市大数据局',
    // 库表采集
    dbName: 'gov_approval_db',
    tableScope: '包含特定前缀 (tb_*)',
    scheduleType: '每日 02:00 自动探针扫描',
    // 脚本解析采集
    fileName: '',
    dialect: 'MySQL 8.0 DDL',
    sqlContent: ''
  });
  const [formError, setFormError] = useState('');
  const [parsedPreview, setParsedPreview] = useState<{ tables: number; fields: number; names: string[] } | null>(null);

  // 查看任务详情/日志 Modal
  const [detailModalTask, setDetailModalTask] = useState<CollectionTask | null>(null);
  const [showLogDrawerTask, setShowLogDrawerTask] = useState<CollectionTask | null>(null);

  // 展开/收起组织树节点
  const toggleOrgExpand = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNodes(prev => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  // 根据左侧选择的组织机构，过滤右侧任务
  const currentOrgName = selectedOrgId === 'org_all' 
    ? '全部组织机构' 
    : INITIAL_ORG_TREE[0].children?.find(c => c.id === selectedOrgId)?.name || '未知机构';

  const filteredTasks = tasks.filter(task => {
    // 组织筛选
    if (selectedOrgId !== 'org_all' && task.orgId !== selectedOrgId) {
      return false;
    }
    // 采集类型筛选
    if (activeCollectType !== 'all' && task.collectType !== activeCollectType) {
      return false;
    }
    // 搜索关键字
    if (searchTaskQuery.trim()) {
      const q = searchTaskQuery.toLowerCase();
      return (
        task.taskName.toLowerCase().includes(q) ||
        task.taskCode.toLowerCase().includes(q) ||
        (task.dbName && task.dbName.toLowerCase().includes(q)) ||
        (task.fileName && task.fileName.toLowerCase().includes(q)) ||
        task.orgName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // 简单 DDL 解析器 (计算 SQL 里的 CREATE TABLE 及 字段行)
  const parseSqlDdl = (sql: string) => {
    if (!sql || !sql.trim()) return null;
    const tableMatches = sql.match(/CREATE\s+TABLE\s+([^\s\(\`]+)/gi) || [];
    const tableNames: string[] = [];
    tableMatches.forEach(m => {
      const name = m.replace(/CREATE\s+TABLE\s+/i, '').replace(/[\`\(\"\_]/g, '').trim();
      if (name) tableNames.push(name);
    });
    // 统计大致包含字段的行数 (排除纯注释、括号、关键字)
    const lines = sql.split('\n');
    let fieldCount = 0;
    lines.forEach(line => {
      const trimmed = line.trim();
      if (
        trimmed && 
        !trimmed.startsWith('--') && 
        !trimmed.startsWith('/*') && 
        !trimmed.toUpperCase().startsWith('CREATE TABLE') && 
        !trimmed.toUpperCase().startsWith('ENGINE=') &&
        !trimmed.toUpperCase().startsWith('COMMENT ON') &&
        !trimmed.startsWith(')')
      ) {
        fieldCount++;
      }
    });

    return {
      tables: Math.max(tableMatches.length, 1),
      fields: Math.max(fieldCount, tableMatches.length * 5),
      names: tableNames.length > 0 ? tableNames : ['tb_parsed_sample']
    };
  };

  // 填充示例 DDL 脚本
  const handleLoadSampleDdl = () => {
    setCreateForm(prev => ({
      ...prev,
      taskName: '示例-人口与企业资质 DDL 结构解析',
      fileName: 'sample_person_and_corp_ddl.sql',
      sqlContent: SAMPLE_DDL_SQL
    }));
    const parsed = parseSqlDdl(SAMPLE_DDL_SQL);
    setParsedPreview(parsed);
  };

  // 处理 SQL 输入变动
  const handleSqlContentChange = (val: string) => {
    setCreateForm(prev => ({ ...prev, sqlContent: val }));
    if (val.trim()) {
      const parsed = parseSqlDdl(val);
      setParsedPreview(parsed);
    } else {
      setParsedPreview(null);
    }
  };

  // 创建采集任务
  const handleCreateTask = () => {
    setFormError('');
    if (!createForm.taskName.trim()) {
      setFormError('请输入任务名称');
      return;
    }

    let parsedTables = 0;
    let parsedFields = 0;

    if (modalTab === 'script_parse') {
      if (!createForm.sqlContent.trim()) {
        setFormError('请粘贴或上传 DDL SQL 脚本内容');
        return;
      }
      const parsed = parseSqlDdl(createForm.sqlContent);
      if (parsed) {
        parsedTables = parsed.tables;
        parsedFields = parsed.fields;
      } else {
        parsedTables = 2;
        parsedFields = 24;
      }
    } else {
      // 库表采集
      parsedTables = Math.floor(Math.random() * 15) + 5;
      parsedFields = parsedTables * (Math.floor(Math.random() * 8) + 10);
    }

    const selectedOrg = INITIAL_ORG_TREE[0].children?.find(c => c.id === createForm.orgId);
    const orgName = selectedOrg ? selectedOrg.name : '市大数据局';

    const selectedDbObj = REGISTERED_DATABASES.find(d => d.name === createForm.dbName);

    const newTask: CollectionTask = {
      id: `TSK-${Date.now().toString().slice(-6)}`,
      taskName: createForm.taskName,
      taskCode: modalTab === 'db_table' ? `COLLECT_${createForm.dbName.toUpperCase()}` : `SCRIPT_PARSE_${Date.now().toString().slice(-4)}`,
      collectType: modalTab,
      orgId: createForm.orgId,
      orgName: orgName,
      dbName: modalTab === 'db_table' ? createForm.dbName : undefined,
      dbType: modalTab === 'db_table' ? selectedDbObj?.dbType : undefined,
      hostPort: modalTab === 'db_table' ? selectedDbObj?.hostPort : undefined,
      tableScope: modalTab === 'db_table' ? createForm.tableScope : undefined,
      fileName: modalTab === 'script_parse' ? (createForm.fileName || 'schema_export.sql') : undefined,
      dialect: modalTab === 'script_parse' ? createForm.dialect : undefined,
      sqlContent: modalTab === 'script_parse' ? createForm.sqlContent : undefined,
      scheduleType: modalTab === 'db_table' ? createForm.scheduleType : '离线 SQL 脚本一键解析',
      status: 'success',
      parsedTablesCount: parsedTables,
      parsedFieldsCount: parsedFields,
      lastRunAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      duration: '0.8 秒',
      logs: [
        `${new Date().toISOString().slice(0, 19)} [INFO] 任务【${createForm.taskName}】已创建并立即初始化`,
        modalTab === 'db_table' 
          ? `${new Date().toISOString().slice(0, 19)} [SUCCESS] 成功探测挂载库 ${createForm.dbName}，采集获 ${parsedTables} 张表。`
          : `${new Date().toISOString().slice(0, 19)} [SUCCESS] SQL DDL 脚本解析完成，解析出 ${parsedTables} 张表结构。`
      ]
    };

    setTasks(prev => [newTask, ...prev]);
    setIsCreateModalOpen(false);

    // 重置表单
    setCreateForm({
      taskName: '',
      orgId: 'org_dsj',
      orgName: '市大数据局',
      dbName: 'gov_approval_db',
      tableScope: '包含特定前缀 (tb_*)',
      scheduleType: '每日 02:00 自动探针扫描',
      fileName: '',
      dialect: 'MySQL 8.0 DDL',
      sqlContent: ''
    });
    setParsedPreview(null);
  };

  // 触发立即采集/重新解析
  const handleRunTask = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: 'running',
          lastRunAt: new Date().toISOString().replace('T', ' ').slice(0, 19)
        };
      }
      return t;
    }));

    setTimeout(() => {
      setTasks(prev => prev.map(t => {
        if (t.id === taskId) {
          const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
          const newLog = `${now} [SUCCESS] 探针重新采集/脚本解析完成！元数据版本已更新。`;
          return {
            ...t,
            status: 'success',
            duration: '0.9 秒',
            logs: t.logs ? [...t.logs, newLog] : [newLog]
          };
        }
        return t;
      }));
    }, 1200);
  };

  // 删除任务
  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('确定要删除该采集任务吗？')) {
      setTasks(prev => prev.filter(t => t.id !== taskId));
    }
  };

  // 统计数值
  const totalTaskCount = tasks.length;
  const dbTaskCount = tasks.filter(t => t.collectType === 'db_table').length;
  const scriptTaskCount = tasks.filter(t => t.collectType === 'script_parse').length;
  const totalTables = tasks.reduce((sum, t) => sum + t.parsedTablesCount, 0);

  return (
    <div className="flex-1 flex flex-col gap-4 p-5 bg-[#f8fafc] overflow-y-auto select-none min-h-screen">
      {/* 顶部页眉 Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-indigo-50/80 border border-indigo-100 flex items-center justify-center shadow-2xs">
            <DownloadCloud className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 tracking-tight leading-none">
                资源采集工作区
              </h2>
              <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100/80 font-mono">
                多源采集 & 离线解析
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-normal">
              支持基于在线数据库登记信息的库表探针采集，以及基于数据库导出表结构 DDL 脚本的离线解析采集
            </p>
          </div>
        </div>

        {/* 按钮组 */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all shadow-xs active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>新建采集任务</span>
          </button>
        </div>
      </div>

      {/* 顶部 4 统计指标卡片 (高度调低) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-lg border border-slate-200/90 py-2.5 px-3.5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">采集任务总数</span>
            <div className="p-1 rounded bg-slate-100/80"><DownloadCloud className="w-3.5 h-3.5 text-slate-500" /></div>
          </div>
          <div className="my-1 flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold tracking-tight text-slate-900 font-mono">{totalTaskCount}</span>
              <span className="text-[11px] text-slate-400 font-normal">个活跃任务</span>
            </div>
            <span className="text-[10px] text-slate-400">覆盖 9 个业务司局</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200/90 py-2.5 px-3.5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">库表采集任务</span>
            <div className="p-1 rounded bg-indigo-50"><Database className="w-3.5 h-3.5 text-indigo-600" /></div>
          </div>
          <div className="my-1 flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold tracking-tight text-indigo-600 font-mono">{dbTaskCount}</span>
              <span className="text-[11px] text-slate-400 font-normal">个在线数据库</span>
            </div>
            <span className="text-[10px] text-slate-400">实时探针扫描</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200/90 py-2.5 px-3.5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">脚本解析采集</span>
            <div className="p-1 rounded bg-emerald-50"><FileCode2 className="w-3.5 h-3.5 text-emerald-600" /></div>
          </div>
          <div className="my-1 flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold tracking-tight text-emerald-600 font-mono">{scriptTaskCount}</span>
              <span className="text-[11px] text-slate-400 font-normal">个离线 DDL 脚本</span>
            </div>
            <span className="text-[10px] text-slate-400">一键结构化解析</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200/90 py-2.5 px-3.5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">已采集解析数据表</span>
            <div className="p-1 rounded bg-amber-50"><TableIcon className="w-3.5 h-3.5 text-amber-600" /></div>
          </div>
          <div className="my-1 flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold tracking-tight text-amber-600 font-mono">{totalTables}</span>
              <span className="text-[11px] text-slate-400 font-normal">张数据表结构</span>
            </div>
            <span className="text-[10px] text-slate-400">自动挂载补全池</span>
          </div>
        </div>
      </div>

      {/* 主体工作区: 左侧组织结构树 + 右侧任务列表 */}
      <div className="grid grid-cols-12 gap-4 flex-1 items-start">
        
        {/* ================= 左侧：组织机构树面板 ================= */}
        <div className="col-span-12 lg:col-span-3 bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col min-h-[520px]">
          {/* 面板 Header */}
          <div className="p-3.5 border-b border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                组织机构层级
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded font-semibold">
              7 个单位
            </span>
          </div>

          {/* 搜索框 */}
          <div className="p-2.5 border-b border-slate-100">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input 
                type="text"
                placeholder="搜索组织机构名称..."
                value={orgSearchQuery}
                onChange={(e) => setOrgSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-500 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* 组织结构树列表 */}
          <div className="p-2 space-y-0.5 overflow-y-auto max-h-[440px] flex-1">
            {INITIAL_ORG_TREE.map(rootNode => {
              const isExpanded = expandedNodes[rootNode.id];
              const isSelected = selectedOrgId === rootNode.id;

              const filteredChildren = rootNode.children?.filter(child => {
                if (!orgSearchQuery.trim()) return true;
                return child.name.toLowerCase().includes(orgSearchQuery.toLowerCase()) || child.code.toLowerCase().includes(orgSearchQuery.toLowerCase());
              });

              return (
                <div key={rootNode.id} className="space-y-0.5">
                  {/* 根节点 */}
                  <div 
                    onClick={() => setSelectedOrgId(rootNode.id)}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-semibold flex items-center justify-between cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-indigo-50 text-indigo-900 border border-indigo-200/80 shadow-2xs' 
                        : 'text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <button 
                        onClick={(e) => toggleOrgExpand(rootNode.id, e)}
                        className="text-slate-400 hover:text-slate-600 p-0.5 rounded"
                      >
                        {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      </button>
                      <Building2 className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-600' : 'text-slate-500'}`} />
                      <span className="truncate">{rootNode.name}</span>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                      isSelected ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {totalTaskCount}
                    </span>
                  </div>

                  {/* 子节点列表 */}
                  {isExpanded && filteredChildren && (
                    <div className="ml-4 pl-2 border-l border-slate-200/70 space-y-0.5">
                      {filteredChildren.map(child => {
                        const isChildSelected = selectedOrgId === child.id;
                        // 计算该机构的任务数
                        const orgTaskCount = tasks.filter(t => t.orgId === child.id).length;

                        return (
                          <div 
                            key={child.id}
                            onClick={() => setSelectedOrgId(child.id)}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between cursor-pointer transition-all ${
                              isChildSelected 
                                ? 'bg-indigo-600 text-white font-semibold shadow-2xs' 
                                : 'text-slate-700 hover:bg-slate-100/80'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span className={`w-1.5 h-1.5 rounded-full ${isChildSelected ? 'bg-white' : 'bg-slate-300'}`}></span>
                              <span className="truncate">{child.name}</span>
                            </div>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                              isChildSelected ? 'bg-indigo-800 text-white' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {orgTaskCount}
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

          {/* 底部小提示 */}
          <div className="p-3 bg-slate-50 border-t border-slate-200/80 text-[11px] text-slate-500 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>点击节点按组织归口查看采集任务</span>
          </div>
        </div>

        {/* ================= 右侧：采集任务工作区 ================= */}
        <div className="col-span-12 lg:col-span-9 bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col min-h-[520px]">
          
          {/* Header & 采集类型切换 Tab */}
          <div className="p-4 border-b border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
                <button 
                  onClick={() => setActiveCollectType('all')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                    activeCollectType === 'all' 
                      ? 'bg-white text-slate-900 shadow-2xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  全部采集任务 ({tasks.filter(t => selectedOrgId === 'org_all' || t.orgId === selectedOrgId).length})
                </button>
                <button 
                  onClick={() => setActiveCollectType('db_table')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                    activeCollectType === 'db_table' 
                      ? 'bg-indigo-600 text-white shadow-2xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>库表采集 ({tasks.filter(t => t.collectType === 'db_table' && (selectedOrgId === 'org_all' || t.orgId === selectedOrgId)).length})</span>
                </button>
                <button 
                  onClick={() => setActiveCollectType('script_parse')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                    activeCollectType === 'script_parse' 
                      ? 'bg-emerald-600 text-white shadow-2xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileCode2 className="w-3.5 h-3.5" />
                  <span>脚本解析采集 ({tasks.filter(t => t.collectType === 'script_parse' && (selectedOrgId === 'org_all' || t.orgId === selectedOrgId)).length})</span>
                </button>
              </div>
            </div>

            {/* 搜索框 */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input 
                type="text"
                placeholder="搜索任务名称、数据库或 SQL 脚本..."
                value={searchTaskQuery}
                onChange={(e) => setSearchTaskQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/90 text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-500 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* 当前归口与筛选状态提示条 */}
          <div className="px-4 py-2 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">当前视角:</span>
              <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold border border-indigo-100">
                {currentOrgName}
              </span>
              <span className="text-slate-400">|</span>
              <span>符合筛选条件 <strong className="text-slate-900 font-mono">{filteredTasks.length}</strong> 项任务</span>
            </div>

            {selectedOrgId !== 'org_all' && (
              <button 
                onClick={() => setSelectedOrgId('org_all')}
                className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-0.5"
              >
                <span>清除机构筛选 (显示全部)</span>
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* 任务列表 Table/Cards Area */}
          <div className="divide-y divide-slate-100 flex-1 overflow-y-auto max-h-[500px]">
            {filteredTasks.length > 0 ? (
              filteredTasks.map(task => {
                const isDb = task.collectType === 'db_table';

                return (
                  <div key={task.id} className="p-4 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3">
                    {/* 左侧任务主信息 */}
                    <div className="flex items-start gap-3">
                      <div className={`p-2.5 rounded-xl border shrink-0 mt-0.5 ${
                        isDb ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 'bg-emerald-50 border-emerald-100 text-emerald-600'
                      }`}>
                        {isDb ? <Database className="w-5 h-5" /> : <FileCode2 className="w-5 h-5" />}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-xs font-bold text-slate-900">
                            {task.taskName}
                          </h4>
                          
                          {/* 采集类型 Tag */}
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                            isDb 
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}>
                            {isDb ? '库表采集 (数据探针)' : '脚本解析采集 (DDL解析)'}
                          </span>

                          {/* 状态 Badge */}
                          {task.status === 'running' && (
                            <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded flex items-center gap-1 animate-pulse">
                              <RotateCw className="w-3 h-3 animate-spin text-amber-600" />
                              <span>采集/解析中...</span>
                            </span>
                          )}
                          {task.status === 'success' && (
                            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>已就绪</span>
                            </span>
                          )}
                          {task.status === 'idle' && (
                            <span className="text-[10px] font-medium text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                              待触发
                            </span>
                          )}
                        </div>

                        {/* 数据源描述 */}
                        <div className="text-xs text-slate-600 flex items-center gap-3 font-mono flex-wrap">
                          {isDb ? (
                            <>
                              <span className="font-bold text-indigo-700 bg-slate-100 px-1.5 py-0.2 rounded">
                                {task.dbType}
                              </span>
                              <span>库名: <strong className="text-slate-800">{task.dbName}</strong></span>
                              <span className="text-slate-400">({task.hostPort})</span>
                            </>
                          ) : (
                            <>
                              <span className="font-bold text-emerald-700 bg-slate-100 px-1.5 py-0.2 rounded">
                                {task.dialect}
                              </span>
                              <span>SQL 脚本: <strong className="text-slate-800">{task.fileName}</strong></span>
                            </>
                          )}
                          <span className="text-slate-300">|</span>
                          <span className="text-slate-500 font-sans">归口: {task.orgName}</span>
                        </div>

                        {/* 采集成果与调度策略 */}
                        <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-0.5">
                          <span>
                            已结构化解析: <strong className="text-slate-900 font-mono">{task.parsedTablesCount}</strong> 张表 / <strong className="text-slate-900 font-mono">{task.parsedFieldsCount}</strong> 信息项
                          </span>
                          <span>•</span>
                          <span>策略: {task.scheduleType}</span>
                          <span>•</span>
                          <span>最近触发: {task.lastRunAt}</span>
                        </div>
                      </div>
                    </div>

                    {/* 右侧操作按钮 */}
                    <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
                      <button 
                        onClick={() => handleRunTask(task.id)}
                        disabled={task.status === 'running'}
                        className="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-colors flex items-center gap-1 border border-indigo-100 disabled:opacity-50"
                        title="立即触发采集/重新解析结构"
                      >
                        <Play className={`w-3.5 h-3.5 ${task.status === 'running' ? 'animate-spin' : ''}`} />
                        <span>{isDb ? '立即采集' : '重新解析'}</span>
                      </button>

                      <button 
                        onClick={() => setDetailModalTask(task)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors flex items-center gap-1 shadow-2xs"
                        title="查看已结构化解析出的元数据表和字段清单"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        <span>解析结构</span>
                      </button>

                      <button 
                        onClick={() => setShowLogDrawerTask(task)}
                        className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors"
                        title="查看运行日志"
                      >
                        <Terminal className="w-3.5 h-3.5" />
                      </button>

                      <button 
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                        title="删除任务"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-16 flex flex-col items-center justify-center text-slate-400">
                <FolderOpen className="w-10 h-10 mb-2 stroke-[1.5] text-slate-300" />
                <p className="text-xs font-medium text-slate-600">该组织机构下暂无符合条件的采集任务</p>
                <p className="text-[11px] text-slate-400 mt-1">您可以点击右上角「新建采集任务」添加库表采集或 SQL 解析任务</p>
              </div>
            )}
          </div>

          {/* 底部 Summary Footer */}
          <div className="p-3 px-4 bg-slate-50/80 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
            <span>列表共显示 {filteredTasks.length} 个采集任务</span>
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> 元数据探测探针运行正常
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: 新建采集任务 Modal (支持库表采集 vs 脚本解析采集) */}
      {/* ========================================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                  <DownloadCloud className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">新建资源采集任务</h3>
                  <p className="text-[11px] text-slate-500">选择采集类型建立数据库在线探针或 SQL 脚本离线解析任务</p>
                </div>
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 采集类型切换 Selector Tabs */}
            <div className="p-4 px-6 border-b border-slate-100 bg-slate-50/30 flex items-center gap-3">
              <button 
                onClick={() => {
                  setModalTab('db_table');
                  setFormError('');
                }}
                className={`flex-1 p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                  modalTab === 'db_table'
                    ? 'border-indigo-600 bg-indigo-50/60 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className={`p-2 rounded-lg ${modalTab === 'db_table' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">1. 库表采集</div>
                  <div className="text-[11px] text-slate-500">根据已登记的数据库建立在线数据表采集</div>
                </div>
              </button>

              <button 
                onClick={() => {
                  setModalTab('script_parse');
                  setFormError('');
                }}
                className={`flex-1 p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                  modalTab === 'script_parse'
                    ? 'border-emerald-600 bg-emerald-50/60 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className={`p-2 rounded-lg ${modalTab === 'script_parse' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <FileCode2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">2. 脚本解析采集</div>
                  <div className="text-[11px] text-slate-500">上传或粘贴表结构 DDL SQL 解析库和表信息</div>
                </div>
              </button>
            </div>

            {/* Modal Body Form */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs font-medium text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* 基础通用字段 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    采集任务名称 <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text"
                    placeholder={modalTab === 'db_table' ? "例如：综合政务审批数据库每日元数据采集" : "例如：税务局 2026 年核心表结构 DDL 脚本离线解析"}
                    value={createForm.taskName}
                    onChange={(e) => setCreateForm({ ...createForm, taskName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50/50 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    归口组织机构 <span className="text-rose-500">*</span>
                  </label>
                  <select 
                    value={createForm.orgId}
                    onChange={(e) => setCreateForm({ ...createForm, orgId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50/50 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    {INITIAL_ORG_TREE[0].children?.map(org => (
                      <option key={org.id} value={org.id}>{org.name}</option>
                    ))}
                  </select>
                </div>

                {modalTab === 'db_table' ? (
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      探针采集频率/周期 <span className="text-rose-500">*</span>
                    </label>
                    <select 
                      value={createForm.scheduleType}
                      onChange={(e) => setCreateForm({ ...createForm, scheduleType: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50/50 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option value="每日 02:00 自动探针扫描">每日 02:00 自动探针扫描 (推荐)</option>
                      <option value="每小时增量变更探针">每小时增量变更探针</option>
                      <option value="每周一次深度扫描">每周一次深度全量扫描</option>
                      <option value="单次手动触发采集">单次手动触发采集</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      SQL 方言语法方言 <span className="text-rose-500">*</span>
                    </label>
                    <select 
                      value={createForm.dialect}
                      onChange={(e) => setCreateForm({ ...createForm, dialect: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50/50 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option value="MySQL 8.0 DDL">MySQL 8.0 / 5.7 DDL</option>
                      <option value="Oracle 19c DDL">Oracle 19c DDL</option>
                      <option value="PostgreSQL DDL">PostgreSQL DDL</option>
                      <option value="达梦 DM DDL">达梦 DM DDL (国产化)</option>
                      <option value="人大金仓 Kingbase DDL">人大金仓 Kingbase DDL</option>
                    </select>
                  </div>
                )}
              </div>

              {/* 区分 Tab 具体的表单域 */}
              {modalTab === 'db_table' ? (
                /* =========== 库表采集专用设置 =========== */
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-indigo-600" />
                    <span>已登记数据库连接匹配</span>
                  </h4>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      选择目标登记数据库 <span className="text-rose-500">*</span>
                    </label>
                    <select 
                      value={createForm.dbName}
                      onChange={(e) => setCreateForm({ ...createForm, dbName: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono"
                    >
                      {REGISTERED_DATABASES.map(db => (
                        <option key={db.name} value={db.name}>
                          {db.dbType} - {db.name} ({db.hostPort}) [{db.sysName}]
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      采集数据表范围筛选
                    </label>
                    <select 
                      value={createForm.tableScope}
                      onChange={(e) => setCreateForm({ ...createForm, tableScope: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option value="全库所有数据表">全库所有数据表 (不限制)</option>
                      <option value="包含特定前缀 (tb_*)">包含特定业务前缀 (如 tb_*)</option>
                      <option value="排除临时表 (剔除 tmp_*, bak_*)">排除临时与备份表 (剔除 tmp_*, bak_*)</option>
                    </select>
                  </div>
                </div>
              ) : (
                /* =========== 脚本解析采集专用设置 =========== */
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <FileCode2 className="w-4 h-4 text-emerald-600" />
                      <span>SQL DDL 导出脚本内容解析</span>
                    </h4>

                    {/* 试用示例按钮 */}
                    <button 
                      onClick={handleLoadSampleDdl}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded border border-indigo-200 flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>加载试用示例 DDL</span>
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      脚本文件名称标识
                    </label>
                    <input 
                      type="text"
                      placeholder="如：approval_schema_export_2026.sql"
                      value={createForm.fileName}
                      onChange={(e) => setCreateForm({ ...createForm, fileName: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      粘贴 DDL SQL 代码内容 <span className="text-rose-500">*</span>
                    </label>
                    <textarea 
                      rows={6}
                      placeholder="请将用户导出的 CREATE TABLE 表结构定义 DDL 语句粘贴至此..."
                      value={createForm.sqlContent}
                      onChange={(e) => handleSqlContentChange(e.target.value)}
                      className="w-full p-3 rounded-lg border border-slate-200 bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    />
                  </div>

                  {/* 试用解析预览条 */}
                  {parsedPreview && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-800">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>
                          语法解析成功！探测到 <strong className="font-mono text-slate-900">{parsedPreview.tables}</strong> 张表结构，约 <strong className="font-mono text-slate-900">{parsedPreview.fields}</strong> 个元数据信息项列
                        </span>
                      </div>
                      <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">
                        解析就绪
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 px-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-2">
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
              <button 
                onClick={handleCreateTask}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors shadow-2xs"
              >
                创建并开始采集
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: 查看解析结果/元数据结构详情 Drawer */}
      {/* ========================================================================= */}
      {detailModalTask && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            
            <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                  <TableIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{detailModalTask.taskName} - 采集解析元数据预览</h3>
                  <p className="text-[11px] text-slate-500 font-mono">编码: {detailModalTask.taskCode}</p>
                </div>
              </div>
              <button onClick={() => setDetailModalTask(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-3 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <div><span className="text-slate-400">采集模式:</span> <strong className="text-slate-800">{detailModalTask.collectType === 'db_table' ? '在线库表采集' : '离线脚本解析'}</strong></div>
                <div><span className="text-slate-400">解析数据表:</span> <strong className="text-indigo-600 font-mono">{detailModalTask.parsedTablesCount} 张</strong></div>
                <div><span className="text-slate-400">抽样属性列:</span> <strong className="text-emerald-600 font-mono">{detailModalTask.parsedFieldsCount} 列</strong></div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900">结构化提取的元数据表样例：</h4>
                
                <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-semibold">
                      <tr>
                        <th className="p-2.5 pl-3">表物理名称</th>
                        <th className="p-2.5">字段名</th>
                        <th className="p-2.5">类型/长度</th>
                        <th className="p-2.5">主键</th>
                        <th className="p-2.5">中文备注说明</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                      <tr>
                        <td className="p-2.5 pl-3 font-bold text-indigo-700">tb_approval_main</td>
                        <td className="p-2.5 font-semibold text-slate-800">approval_id</td>
                        <td className="p-2.5 text-slate-500">VARCHAR(32)</td>
                        <td className="p-2.5 text-emerald-600 font-bold">是 (PK)</td>
                        <td className="p-2.5 text-slate-600 font-sans">审批事项唯一标识流水号</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 pl-3 font-bold text-indigo-700">tb_approval_main</td>
                        <td className="p-2.5 font-semibold text-slate-800">applicant_uscc</td>
                        <td className="p-2.5 text-slate-500">VARCHAR(18)</td>
                        <td className="p-2.5 text-slate-400">否</td>
                        <td className="p-2.5 text-slate-600 font-sans">申请企业统一社会信用代码</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 pl-3 font-bold text-indigo-700">tb_approval_main</td>
                        <td className="p-2.5 font-semibold text-slate-800">approve_status</td>
                        <td className="p-2.5 text-slate-500">VARCHAR(20)</td>
                        <td className="p-2.5 text-slate-400">否</td>
                        <td className="p-2.5 text-slate-600 font-sans">办件状态 (在办/核准/驳回)</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 pl-3 font-bold text-indigo-700">tb_tax_declare</td>
                        <td className="p-2.5 font-semibold text-slate-800">declare_amount</td>
                        <td className="p-2.5 text-slate-500">DECIMAL(14,2)</td>
                        <td className="p-2.5 text-slate-400">否</td>
                        <td className="p-2.5 text-slate-600 font-sans">申报纳税总额(元)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="p-4 px-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button 
                onClick={() => setDetailModalTask(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
              >
                关闭预览
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: 运行日志 Drawer Modal */}
      {/* ========================================================================= */}
      {showLogDrawerTask && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-slate-950 rounded-2xl border border-slate-800 max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col text-slate-100 font-mono text-xs max-h-[80vh]">
            <div className="p-3.5 px-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-slate-200">{showLogDrawerTask.taskName} - 探针执行终端日志</span>
              </div>
              <button onClick={() => setShowLogDrawerTask(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-2 bg-black/90 min-h-[260px] text-[11px] leading-relaxed">
              {showLogDrawerTask.logs && showLogDrawerTask.logs.length > 0 ? (
                showLogDrawerTask.logs.map((line, idx) => (
                  <div key={idx} className={line.includes('[SUCCESS]') ? 'text-emerald-400 font-semibold' : 'text-slate-300'}>
                    {line}
                  </div>
                ))
              ) : (
                <div className="text-slate-500">暂无运行日志输出</div>
              )}
            </div>

            <div className="p-3 px-5 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between text-slate-400 text-[11px]">
              <span>日志打印就绪 | 线程状态: PASS</span>
              <button 
                onClick={() => setShowLogDrawerTask(null)}
                className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-sans text-xs font-semibold"
              >
                关闭日志
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
