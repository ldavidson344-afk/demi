import React, { useState } from 'react';
import { 
  FilePlus, 
  Search, 
  Plus, 
  Building2, 
  Server, 
  UserCheck, 
  Phone, 
  Wrench, 
  CheckCircle2, 
  X, 
  Trash2, 
  Eye, 
  AlertCircle,
  HardDrive,
  Database,
  Edit3,
  Layers,
  Check,
  RefreshCw,
  Users,
  ChevronDown
} from 'lucide-react';

export interface MountedDatabase {
  id: string;
  dbType: string;      // e.g. MySQL, Oracle, PostgreSQL, DM (达梦)
  dbName: string;      // e.g. db_approval_prod
  hostPort: string;    // e.g. 10.128.45.10:3306
  username: string;
  connectionString?: string; // 数据库连接信息
  deployMode?: string;   // 数据库部署模式 (如：主备集群, 单机部署)
  dbVersion?: string;    // 数据库版本 (如：8.0.32, 19c Enterprise)
  backupPolicy?: string; // 备份策略及周期 (如：每日 02:00 全量备份)
  syncInterval?: string; // e.g. 每日 02:00
  mountedAt: string;
  status: 'connected' | 'syncing' | 'error';
  tablesCount?: number;
}

export const SYSTEM_CATEGORY_OPTIONS = ['无', '自建自用', '国直', '省直', '市直', '县直'];

export interface BusinessSystem {
  id: string;
  name: string;             // 系统名称
  systemCategory?: string;  // 系统所属分类 (数据字典: 无、自建自用、国直、省直、市直、县直)
  department: string;       // 系统所属部门 (主责部门概览)
  mainDepartment: string;   // 主责部门
  businessDepartments: string[]; // 业务部门 / 共用部门 (一个系统多个部门共用)
  serverLocation: string;   // 机房部署位置
  businessOwner: string;    // 业务负责人
  businessContact: string;  // 业务负责人联系方式
  vendorOwner: string;      // 厂商负责人
  vendorContact: string;    // 厂商负责人联系方式
  registeredAt: string;
  networkType?: string;
  remark?: string;
  mountedDatabases?: MountedDatabase[];
}

const INITIAL_BUSINESS_SYSTEMS: BusinessSystem[] = [
  {
    id: 'SYS-001',
    name: '综合政务审批系统',
    systemCategory: '市直',
    department: '市行政审批局',
    mainDepartment: '市行政审批局',
    businessDepartments: ['科信司', '市场监管局', '自然资源局', '税务局', '住建局'],
    serverLocation: '市行政中心 B栋地下2层 1号政务机房',
    businessOwner: '张伟明 (主任)',
    businessContact: '13800138001',
    vendorOwner: '李强 (浪潮软件项目经理)',
    vendorContact: '13911112222',
    registeredAt: '2026-03-12',
    networkType: '政务外网',
    remark: '支撑企业开办、许可审批核心业务，包含 42 张元数据数据表。多个部门跨界联合审批共用。',
    mountedDatabases: [
      {
        id: 'MDB-001',
        dbType: 'PostgreSQL',
        dbName: 'gov_approval_db',
        hostPort: '10.208.12.44:5432',
        username: 'meta_reader',
        connectionString: 'jdbc:postgresql://10.208.12.44:5432/gov_approval_db',
        deployMode: '主备集群',
        dbVersion: 'PostgreSQL 14.5 Enterprise',
        backupPolicy: '每日 02:00 全量备份，保存 30 天',
        syncInterval: '每日 02:00 增量采集',
        mountedAt: '2026-03-15',
        status: 'connected',
        tablesCount: 42
      }
    ]
  },
  {
    id: 'SYS-002',
    name: '电子税务服务平台',
    systemCategory: '省直',
    department: '市税务局',
    mainDepartment: '市税务局',
    businessDepartments: ['科信司', '财政局', '审计局', '市场监管局'],
    serverLocation: '税务大厦 4楼核心机房 A03机柜',
    businessOwner: '王丽华 (处长)',
    businessContact: '13800138002',
    vendorOwner: '赵刚 (东软集团技术总监)',
    vendorContact: '13933334444',
    registeredAt: '2026-04-05',
    networkType: '税务专网',
    remark: '处理每日纳税申报与发票明细，提供实时 API 数据服务。',
    mountedDatabases: [
      {
        id: 'MDB-002',
        dbType: 'Oracle 19c',
        dbName: 'tax_core_prod',
        hostPort: '10.150.88.20:1521',
        username: 'tax_meta_user',
        connectionString: 'jdbc:oracle:thin:@//10.150.88.20:1521/tax_core_prod',
        deployMode: 'RAC双机热备',
        dbVersion: 'Oracle 19.3.0.0.0 Enterprise',
        backupPolicy: '每日 03:00 全量备份 + 每小时日志归档',
        syncInterval: '每日 03:00 自动解析',
        mountedAt: '2026-04-10',
        status: 'connected',
        tablesCount: 128
      }
    ]
  },
  {
    id: 'SYS-003',
    name: '科技创新管理系统',
    systemCategory: '国直',
    department: '市科技局',
    mainDepartment: '市科技局',
    businessDepartments: ['科信司', '发改委', '工信局'],
    serverLocation: '华北云数据中心 机房区 2号专区',
    businessOwner: '刘建国 (副局长)',
    businessContact: '13800138003',
    vendorOwner: '孙芳 (神州数码架构师)',
    vendorContact: '13955556666',
    registeredAt: '2026-05-18',
    networkType: '政务外网',
    remark: '高新技术企业认定与科技项目申报数据管理。',
    mountedDatabases: []
  },
  {
    id: 'SYS-004',
    name: '智慧交通调度中心平台',
    systemCategory: '自建自用',
    department: '市交通运输局',
    mainDepartment: '市交通运输局',
    businessDepartments: ['科信司', '公安交警支队', '应急管理局', '城管局'],
    serverLocation: '交通指挥中心 3楼主数据机房',
    businessOwner: '陈明 (科长)',
    businessContact: '13800138004',
    vendorOwner: '周亮 (太极计算机售后经理)',
    vendorContact: '13977778888',
    registeredAt: '2026-06-01',
    networkType: '交通感知专网',
    remark: '包含实时公交、地铁刷卡流水及出租车 GPS 数据。',
    mountedDatabases: [
      {
        id: 'MDB-003',
        dbType: 'MySQL 8.0',
        dbName: 'traffic_gps_stream',
        hostPort: '10.190.22.8:3306',
        username: 'traffic_reader',
        connectionString: 'jdbc:mysql://10.190.22.8:3306/traffic_gps_stream',
        deployMode: '读写分离集群',
        dbVersion: 'MySQL 8.0.32 Community',
        backupPolicy: '每日 01:00 物理全备，实时 Binlog 增量',
        syncInterval: '每小时增量采集',
        mountedAt: '2026-06-05',
        status: 'connected',
        tablesCount: 36
      }
    ]
  },
  {
    id: 'SYS-005',
    name: '不动产登记综合平台',
    systemCategory: '县直',
    department: '市自然资源局',
    mainDepartment: '市自然资源局',
    businessDepartments: ['科信司', '住建局', '税务局', '不动产登记中心'],
    serverLocation: '自然资源局大楼 2楼专用机房',
    businessOwner: '杨雪 (主管)',
    businessContact: '13800138005',
    vendorOwner: '吴军 (航天信息项目负责人)',
    vendorContact: '13999990000',
    registeredAt: '2026-07-10',
    networkType: '政务专网',
    remark: '不动产产权登记、房屋权属档案查询。',
    mountedDatabases: []
  }
];

export const SystemRegistrationView: React.FC = () => {
  const [systems, setSystems] = useState<BusinessSystem[]>(INITIAL_BUSINESS_SYSTEMS);
  const [searchQuery, setSearchQuery] = useState('');
  
  // 按系统名称与系统所属分类筛选 (Filter by system name & category)
  const [systemNameFilter, setSystemNameFilter] = useState('all');
  const [systemCategoryFilter, setSystemCategoryFilter] = useState('all');
  
  // Modals state
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [editingSystem, setEditingSystem] = useState<BusinessSystem | null>(null);
  const [mountingSystem, setMountingSystem] = useState<BusinessSystem | null>(null);
  const [viewDetailSystem, setViewDetailSystem] = useState<BusinessSystem | null>(null);

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Preset options for quick selecting common departments
  const PRESET_DEPARTMENTS = [
    '科信司', '市行政审批局', '市市场监督管理局', '市自然资源局', '市税务局', 
    '市交通运输局', '市财政局', '市公安局', '市住建局', '市发改委', '市应急管理局', '综合执法局',
    '市卫生健康委员会', '市生态环境局', '市水务局', '市农业农村局'
  ];

  const [isBizDeptDropdownOpen, setIsBizDeptDropdownOpen] = useState(false);
  const [bizDeptSearch, setBizDeptSearch] = useState('');

  // Form State for System Registration & Editing
  const [formData, setFormData] = useState({
    name: '',
    systemCategory: '自建自用',
    mainDepartment: '市行政审批局',
    businessDepartments: ['科信司', '市行政审批局', '市市场监督管理局'],
    serverLocation: '',
    businessOwner: '',
    businessContact: '',
    vendorOwner: '',
    vendorContact: '',
    networkType: '政务外网',
    remark: ''
  });

  const [customBizDeptInput, setCustomBizDeptInput] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Form State for Mount Database
  const [dbFormData, setDbFormData] = useState({
    dbType: 'MySQL 8.0',
    dbName: '',
    host: '',
    port: '3306',
    username: '',
    password: '',
    connectionString: '',
    deployMode: '主备集群',
    dbVersion: 'MySQL 8.0.32 Enterprise',
    backupPolicy: ''
  });
  const [dbFormErrors, setDbFormErrors] = useState<Record<string, string>>({});

  const showNotification = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Toggle business department selection
  const handleToggleBizDept = (deptName: string) => {
    setFormData(prev => {
      const exists = prev.businessDepartments.includes(deptName);
      if (exists) {
        return {
          ...prev,
          businessDepartments: prev.businessDepartments.filter(d => d !== deptName)
        };
      } else {
        return {
          ...prev,
          businessDepartments: [...prev.businessDepartments, deptName]
        };
      }
    });
  };

  // Add custom business department
  const handleAddCustomBizDept = () => {
    const trimmed = customBizDeptInput.trim();
    if (!trimmed) return;
    if (!formData.businessDepartments.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        businessDepartments: [...prev.businessDepartments, trimmed]
      }));
    }
    setCustomBizDeptInput('');
  };

  // Open modal to Register New System
  const handleOpenRegisterModal = () => {
    setEditingSystem(null);
    setFormData({
      name: '',
      systemCategory: '自建自用',
      mainDepartment: '科信司',
      businessDepartments: [],
      serverLocation: '',
      businessOwner: '',
      businessContact: '',
      vendorOwner: '',
      vendorContact: '',
      networkType: '政务外网',
      remark: ''
    });
    setCustomBizDeptInput('');
    setIsBizDeptDropdownOpen(false);
    setBizDeptSearch('');
    setFormErrors({});
    setIsRegisterModalOpen(true);
  };

  // Open modal to Edit Existing System
  const handleOpenEditModal = (sys: BusinessSystem) => {
    setEditingSystem(sys);
    setFormData({
      name: sys.name,
      systemCategory: sys.systemCategory || '自建自用',
      mainDepartment: sys.mainDepartment || sys.department || '科信司',
      businessDepartments: sys.businessDepartments || [],
      serverLocation: sys.serverLocation,
      businessOwner: sys.businessOwner,
      businessContact: sys.businessContact,
      vendorOwner: sys.vendorOwner,
      vendorContact: sys.vendorContact,
      networkType: sys.networkType || '政务外网',
      remark: sys.remark || ''
    });
    setCustomBizDeptInput('');
    setIsBizDeptDropdownOpen(false);
    setBizDeptSearch('');
    setFormErrors({});
    setIsRegisterModalOpen(true);
  };

  // Validate System Registration / Editing Form
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = '请输入系统名称';
    if (!formData.mainDepartment.trim()) errors.mainDepartment = '请输入或选择系统主责部门';
    // 业务部门 (共用部门) 已设为非必填
    if (!formData.serverLocation.trim()) errors.serverLocation = '请输入机房部署位置';
    if (!formData.businessOwner.trim()) errors.businessOwner = '请输入业务负责人姓名';
    if (!formData.businessContact.trim()) errors.businessContact = '请输入业务负责人联系方式';
    if (!formData.vendorOwner.trim()) errors.vendorOwner = '请输入厂商负责人姓名';
    if (!formData.vendorContact.trim()) errors.vendorContact = '请输入厂商负责人联系方式';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Register or Edit Form
  const handleSubmitRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingSystem) {
      // Edit mode
      setSystems(prev => prev.map(s => {
        if (s.id === editingSystem.id) {
          return {
            ...s,
            name: formData.name,
            systemCategory: formData.systemCategory,
            department: formData.mainDepartment,
            mainDepartment: formData.mainDepartment,
            businessDepartments: formData.businessDepartments,
            serverLocation: formData.serverLocation,
            businessOwner: formData.businessOwner,
            businessContact: formData.businessContact,
            vendorOwner: formData.vendorOwner,
            vendorContact: formData.vendorContact,
            networkType: formData.networkType,
            remark: formData.remark
          };
        }
        return s;
      }));
      setIsRegisterModalOpen(false);
      showNotification(`已成功修改【${formData.name}】的信息！`);
    } else {
      // New registration
      const newSys: BusinessSystem = {
        id: `SYS-00${systems.length + 1}`,
        name: formData.name,
        systemCategory: formData.systemCategory,
        department: formData.mainDepartment,
        mainDepartment: formData.mainDepartment,
        businessDepartments: formData.businessDepartments,
        serverLocation: formData.serverLocation,
        businessOwner: formData.businessOwner,
        businessContact: formData.businessContact,
        vendorOwner: formData.vendorOwner,
        vendorContact: formData.vendorContact,
        registeredAt: new Date().toISOString().split('T')[0],
        networkType: formData.networkType,
        remark: formData.remark,
        mountedDatabases: []
      };

      setSystems([newSys, ...systems]);
      setIsRegisterModalOpen(false);
      showNotification(`已成功完成【${newSys.name}】的业务系统登记！`);
    }
  };

  // Database Version Options Mapping
  const VERSION_OPTIONS_MAP: Record<string, string[]> = {
    'MySQL 8.0': ['MySQL 8.0.32 Enterprise', 'MySQL 8.0.28 Community', 'MySQL 5.7.40 Enterprise', 'MySQL 8.1.0'],
    'PostgreSQL': ['PostgreSQL 16.1', 'PostgreSQL 15.2 Enterprise', 'PostgreSQL 14.5 Enterprise', 'PostgreSQL 13.8'],
    'Oracle 19c': ['Oracle 19c Enterprise (19.3.0)', 'Oracle 19.18 RU', 'Oracle 21c Enterprise', 'Oracle 12c R2', 'Oracle 11g R2'],
    'DM (达梦数据库)': ['DM8 8.1.2.128 (国产化)', 'DM8 8.1.1.190', 'DM7 7.6.0.98'],
    'Kingbase (人大金仓)': ['KingbaseES V8 R6 (国产化)', 'KingbaseES V9 R1', 'KingbaseES V8 R3'],
    'SQL Server': ['Microsoft SQL Server 2022', 'Microsoft SQL Server 2019', 'Microsoft SQL Server 2016']
  };

  // Open Mount Database Modal
  const handleOpenMountDbModal = (sys: BusinessSystem) => {
    setMountingSystem(sys);
    setDbFormData({
      dbType: 'MySQL 8.0',
      dbName: '',
      host: '',
      port: '3306',
      username: '',
      password: '',
      connectionString: '',
      deployMode: '主备集群',
      dbVersion: 'MySQL 8.0.32 Enterprise',
      backupPolicy: ''
    });
    setDbFormErrors({});
  };

  // Submit Mount Database Form
  const handleSubmitMountDb = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mountingSystem) return;

    const errors: Record<string, string> = {};
    if (!dbFormData.dbName.trim()) errors.dbName = '请输入数据库名称/实例名';
    if (!dbFormData.host.trim()) errors.host = '请输入主机IP';
    if (!dbFormData.port.trim()) errors.port = '请输入端口号';
    if (!dbFormData.username.trim()) errors.username = '请输入连接账号';
    if (!dbFormData.connectionString.trim()) errors.connectionString = '请输入数据库连接信息';
    if (!dbFormData.dbVersion.trim()) errors.dbVersion = '请选择数据库版本';
    if (!dbFormData.backupPolicy.trim()) errors.backupPolicy = '请输入备份策略及周期';

    if (Object.keys(errors).length > 0) {
      setDbFormErrors(errors);
      return;
    }

    const hostPortStr = `${dbFormData.host.trim()}:${dbFormData.port.trim()}`;

    const newDb: MountedDatabase = {
      id: `MDB-${Date.now().toString().slice(-4)}`,
      dbType: dbFormData.dbType,
      dbName: dbFormData.dbName,
      hostPort: hostPortStr,
      username: dbFormData.username,
      connectionString: dbFormData.connectionString,
      deployMode: dbFormData.deployMode,
      dbVersion: dbFormData.dbVersion,
      backupPolicy: dbFormData.backupPolicy,
      mountedAt: new Date().toISOString().split('T')[0],
      status: 'connected',
      tablesCount: Math.floor(Math.random() * 50) + 10
    };

    setSystems(prev => prev.map(s => {
      if (s.id === mountingSystem.id) {
        const existingDbs = s.mountedDatabases || [];
        return {
          ...s,
          mountedDatabases: [...existingDbs, newDb]
        };
      }
      return s;
    }));

    setMountingSystem(null);
    showNotification(`已成功为【${mountingSystem.name}】挂载数据库【${newDb.dbName}】！`);
  };

  // Delete/注销系统
  const handleDeleteSystem = (id: string, name: string) => {
    if (confirm(`确定要注销登记系统【${name}】吗？`)) {
      setSystems(systems.filter(s => s.id !== id));
      if (viewDetailSystem?.id === id) setViewDetailSystem(null);
      showNotification(`已注销登记业务系统【${name}】`);
    }
  };

  // Unmount Database
  const handleUnmountDb = (systemId: string, dbId: string, dbName: string) => {
    if (confirm(`确定取消挂载数据库【${dbName}】吗？`)) {
      setSystems(prev => prev.map(s => {
        if (s.id === systemId) {
          return {
            ...s,
            mountedDatabases: (s.mountedDatabases || []).filter(d => d.id !== dbId)
          };
        }
        return s;
      }));
      showNotification(`已解挂数据库【${dbName}】`);
    }
  };

  // Get list of registered system names for dropdown
  const systemNames = Array.from(new Set(systems.map(s => s.name)));

  const filteredSystems = systems.filter(sys => {
    const matchesSystemName = systemNameFilter === 'all' || sys.name === systemNameFilter;
    const matchesCategory = systemCategoryFilter === 'all' || (sys.systemCategory || '无') === systemCategoryFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      sys.name.toLowerCase().includes(q) ||
      (sys.systemCategory || '').toLowerCase().includes(q) ||
      (sys.mainDepartment || sys.department || '').toLowerCase().includes(q) ||
      (sys.businessDepartments || []).some(d => d.toLowerCase().includes(q)) ||
      sys.serverLocation.toLowerCase().includes(q) ||
      sys.businessOwner.toLowerCase().includes(q) ||
      sys.vendorOwner.toLowerCase().includes(q)
    );
    return matchesSystemName && matchesCategory && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col gap-4 p-5 bg-[#f8fafc] overflow-y-auto select-none relative">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-16 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top duration-200 border border-slate-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Module Title Banner Card (操作栏中放置已登记系统总数指标) */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-indigo-50/90 border border-indigo-100 flex items-center justify-center shadow-2xs">
            <FilePlus className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 tracking-tight leading-none">
                业务系统登记管理
              </h2>
              <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 font-mono">
                部门系统接入
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              登录用户可登记业务系统信息，支持明确【主责部门】与【业务部门 (共用部门)】，便于多部门跨机构共用与统筹规划
            </p>
          </div>
        </div>

        {/* Action Bar (包含已登记系统总数指标 + 登记按钮) */}
        <div className="flex items-center gap-3">
          {/* 指标卡片嵌套在操作栏 */}
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200/80">
            <HardDrive className="w-4 h-4 text-indigo-600" />
            <div className="flex items-baseline gap-1 text-xs">
              <span className="text-slate-500 font-medium">已登记系统总数:</span>
              <span className="font-bold text-slate-900 text-sm font-mono">{systems.length}</span>
              <span className="text-slate-400 text-[11px]">套</span>
            </div>
          </div>

          <button 
            onClick={handleOpenRegisterModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all shadow-xs active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>登记新业务系统</span>
          </button>
        </div>
      </div>

      {/* Main List Box */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col flex-1 min-h-[480px]">
        {/* List Toolbar & Filters */}
        <div className="p-4 border-b border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/40">
          <div className="flex flex-wrap items-center gap-3">
            {/* 按系统名称筛选 */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800">按系统名称筛选:</span>
              <select 
                value={systemNameFilter}
                onChange={(e) => setSystemNameFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-indigo-500 shadow-2xs"
              >
                <option value="all">全部系统名称 ({systems.length})</option>
                {systemNames.map((name, idx) => (
                  <option key={idx} value={name}>{name}</option>
                ))}
              </select>
            </div>

            {/* 按系统所属分类筛选 */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800">系统所属分类:</span>
              <select 
                value={systemCategoryFilter}
                onChange={(e) => setSystemCategoryFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-indigo-500 shadow-2xs"
              >
                <option value="all">全部分类字典</option>
                {SYSTEM_CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Input Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input 
              type="text"
              placeholder="关键字全局搜索 (系统/主责部门/业务部门/机房)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white border border-slate-200/90 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-400 shadow-2xs"
            />
          </div>
        </div>

        {/* Table List of Business Systems */}
        <div className="divide-y divide-slate-100 flex-1 overflow-y-auto">
          {filteredSystems.length > 0 ? (
            filteredSystems.map((sys) => {
              const mountedCount = sys.mountedDatabases?.length || 0;
              const mainDept = sys.mainDepartment || sys.department || '未划分';
              const bizDepts = sys.businessDepartments || [];

              return (
                <div 
                  key={sys.id}
                  className="p-4 hover:bg-slate-50/80 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50/80 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs shrink-0 mt-0.5 shadow-2xs">
                      <HardDrive className="w-5 h-5 stroke-[1.8]" />
                    </div>

                    <div className="space-y-1.5 flex-1 min-w-0">
                      {/* System Title, Category & Mounted DB tag */}
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                          {sys.name}
                        </h3>

                        {/* 系统所属分类 Badge */}
                        <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.2 rounded border border-amber-200">
                          {sys.systemCategory || '无'}
                        </span>

                        <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.2 rounded border border-indigo-100">
                          {sys.networkType || '政务外网'}
                        </span>

                        {mountedCount > 0 ? (
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded border border-emerald-200 flex items-center gap-1">
                            <Database className="w-3 h-3 text-emerald-600" />
                            已挂载
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.2 rounded border border-slate-200 flex items-center gap-1">
                            <Database className="w-3 h-3 text-slate-400" />
                            未挂载
                          </span>
                        )}
                      </div>

                      {/* Required System Info Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-y-1 text-xs text-slate-600 pt-1">
                        {/* 系统所属分类 */}
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[11px] font-medium text-slate-400">系统所属分类:</span>
                          <span className="font-semibold text-slate-800 flex items-center gap-1">
                            <Layers className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            {sys.systemCategory || '无'}
                          </span>
                        </div>

                        {/* 部门 (区分主责部门与业务部门) & 机房 */}
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[11px] font-medium text-slate-400">系统权属部门 (主责/业务部门):</span>
                          <div className="flex flex-wrap items-center gap-1">
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-[11px]" title="主责部门">
                              <Building2 className="w-3 h-3 text-indigo-600 shrink-0" />
                              主责: {mainDept}
                            </span>
                            {bizDepts.length > 0 && (
                              <span className="text-[10px] text-slate-600 font-medium bg-slate-100 border border-slate-200 px-1.5 py-0.2 rounded flex items-center gap-1" title={`共用业务部门 (${bizDepts.length}个): ${bizDepts.join('、')}`}>
                                <Users className="w-3 h-3 text-slate-500 shrink-0" />
                                业务: {bizDepts.slice(0, 2).join('、')}{bizDepts.length > 2 ? '…' : ''}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500 flex items-center gap-1 truncate mt-0.5" title={sys.serverLocation}>
                            <Server className="w-3 h-3 text-slate-400 shrink-0" />
                            {sys.serverLocation}
                          </span>
                        </div>

                        {/* 业务负责人 & 联系方式 */}
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[11px] font-medium text-slate-400">业务负责人及联系方式:</span>
                          <span className="font-semibold text-slate-800 flex items-center gap-1">
                            <UserCheck className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                            {sys.businessOwner}
                          </span>
                          <span className="text-[11px] font-mono text-indigo-600 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-indigo-400 shrink-0" />
                            {sys.businessContact}
                          </span>
                        </div>

                        {/* 厂商负责人 & 联系方式 */}
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[11px] font-medium text-slate-400">厂商负责人及联系方式:</span>
                          <span className="font-semibold text-slate-800 flex items-center gap-1">
                            <Wrench className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                            {sys.vendorOwner}
                          </span>
                          <span className="text-[11px] font-mono text-purple-600 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-purple-400 shrink-0" />
                            {sys.vendorContact}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions: 查看详情, 修改, 挂载数据库, 删除 */}
                  <div className="flex items-center gap-2 self-end lg:self-center shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    {/* 查看详情 */}
                    <button 
                      onClick={() => setViewDetailSystem(sys)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                      title="查看系统详情"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-600" />
                      <span>查看详情</span>
                    </button>

                    {/* 修改 */}
                    <button 
                      onClick={() => handleOpenEditModal(sys)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-semibold transition-colors"
                      title="修改此系统登记信息"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                      <span>修改</span>
                    </button>

                    {/* 挂载数据库 */}
                    <button 
                      onClick={() => handleOpenMountDbModal(sys)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold transition-colors"
                      title="为该系统挂载数据库"
                    >
                      <Database className="w-3.5 h-3.5 text-indigo-600" />
                      <span>挂载数据库</span>
                    </button>

                    {/* 删除 */}
                    <button 
                      onClick={() => handleDeleteSystem(sys.id, sys.name)}
                      className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors ml-1"
                      title="注销此系统登记"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center">
              <AlertCircle className="w-8 h-8 mb-2 text-slate-300" />
              <p className="text-xs">未找到符合要求的业务系统登记记录</p>
            </div>
          )}
        </div>

        {/* Footer stats */}
        <div className="p-3 px-4 bg-slate-50/80 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
          <span>当前包含 {filteredSystems.length} 项登记记录</span>
          <span className="font-mono text-[11px]">归口统一部门: 科信司</span>
        </div>
      </div>

      {/* Modal 1: Register or Edit System Dialog */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-2xs">
                  {editingSystem ? <Edit3 className="w-4 h-4" /> : <FilePlus className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {editingSystem ? `修改业务系统信息【${editingSystem.name}】` : '登记本部门业务系统'}
                  </h3>
                  <p className="text-[11px] text-slate-500">请准确填写本业务系统的基本信息、主责部门及共用业务部门</p>
                </div>
              </div>
              <button 
                onClick={() => setIsRegisterModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitRegistration} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Field 1: 系统名称 */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  1. 系统名称 <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text"
                  placeholder="例如：综合政务审批系统 / 电子税务服务平台"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                    formErrors.name ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200 bg-slate-50/50'
                  }`}
                />
                {formErrors.name && <p className="text-[11px] text-rose-500 mt-0.5">{formErrors.name}</p>}
              </div>

              {/* Field 2: 系统所属分类 (数据字典: 无、自建自用、国直、省直、市直、县直) */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  2. 系统所属分类 <span className="text-rose-500">*</span>
                </label>
                <select 
                  value={formData.systemCategory}
                  onChange={(e) => setFormData({ ...formData, systemCategory: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50/50 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {SYSTEM_CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400 mt-1">分类字典选项：无、自建自用、国直、省直、市直、县直</p>
              </div>

              {/* Field 3: 系统所属部门设置 (区分主责部门与业务部门) */}
              <div className="p-3.5 bg-indigo-50/40 rounded-xl border border-indigo-100/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-indigo-600" />
                    <h4 className="text-xs font-bold text-slate-900">3. 系统所属部门设置 (区分主责部门与业务部门)</h4>
                  </div>
                  <span className="text-[10px] text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded font-medium">支持多部门共用</span>
                </div>

                {/* 主责部门 */}
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    主责部门 (建设/运维主管单位) <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text"
                    placeholder="例如：市行政审批局 / 科信司"
                    value={formData.mainDepartment}
                    onChange={(e) => setFormData({ ...formData, mainDepartment: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white ${
                      formErrors.mainDepartment ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200'
                    }`}
                  />
                  {formErrors.mainDepartment && <p className="text-[11px] text-rose-500 mt-0.5">{formErrors.mainDepartment}</p>}
                </div>

                {/* 业务部门 (共用部门 - 下拉多选 - 非必填) */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-800">
                      业务部门 / 共用部门 <span className="text-slate-400 font-normal text-[11px]">(下拉多选，非必填)</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-medium">已选 {formData.businessDepartments.length} 个部门</span>
                  </div>

                  {/* Dropdown Selector Trigger */}
                  <div 
                    onClick={() => setIsBizDeptDropdownOpen(!isBizDeptDropdownOpen)}
                    className="w-full min-h-[42px] px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all cursor-pointer flex items-center justify-between gap-2 shadow-2xs"
                  >
                    <div className="flex flex-wrap gap-1.5 items-center flex-1">
                      {formData.businessDepartments.length > 0 ? (
                        formData.businessDepartments.map((dept, idx) => (
                          <span 
                            key={idx} 
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-medium"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleBizDept(dept);
                            }}
                          >
                            <span>{dept}</span>
                            <X className="w-3 h-3 text-indigo-400 hover:text-rose-600 transition-colors" />
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 text-xs">点击下拉选择业务部门 (非必填，可多选)...</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {formData.businessDepartments.length > 0 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFormData(prev => ({ ...prev, businessDepartments: [] }));
                          }}
                          className="text-[10px] text-slate-400 hover:text-rose-600 underline px-1"
                        >
                          清空
                        </button>
                      )}
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isBizDeptDropdownOpen ? 'rotate-180 text-indigo-600' : ''}`} />
                    </div>
                  </div>

                  {/* Dropdown Menu Panel */}
                  {isBizDeptDropdownOpen && (
                    <div className="absolute z-30 left-0 right-0 mt-1 bg-white rounded-xl border border-slate-200/90 shadow-xl p-3 space-y-2.5">
                      {/* Search Filter Input */}
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                        <input 
                          type="text"
                          placeholder="搜索筛选共用部门..."
                          value={bizDeptSearch}
                          onChange={(e) => setBizDeptSearch(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full pl-8 pr-3 py-1.5 rounded-md border border-slate-200 bg-slate-50/50 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all placeholder:text-slate-400"
                        />
                      </div>

                      {/* Checkboxes List of Preset Departments */}
                      <div className="space-y-0.5 max-h-48 overflow-y-auto pr-1 text-xs">
                        <div className="text-[10px] font-semibold text-slate-400 px-1 py-1">常用共用部门列表 (多选)：</div>
                        {PRESET_DEPARTMENTS
                          .filter(dept => !bizDeptSearch || dept.toLowerCase().includes(bizDeptSearch.toLowerCase()))
                          .map((dept) => {
                            const isSelected = formData.businessDepartments.includes(dept);
                            return (
                              <div
                                key={dept}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleBizDept(dept);
                                }}
                                className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                                  isSelected 
                                    ? 'bg-indigo-50/90 text-indigo-900 font-semibold' 
                                    : 'hover:bg-slate-100/70 text-slate-700'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <input 
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => {}} // Controlled via row click
                                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5 cursor-pointer"
                                  />
                                  <span>{dept}</span>
                                </div>
                                {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                              </div>
                            );
                          })}
                        {PRESET_DEPARTMENTS.filter(dept => !bizDeptSearch || dept.toLowerCase().includes(bizDeptSearch.toLowerCase())).length === 0 && (
                          <div className="text-center py-3 text-xs text-slate-400">未找到相关部门</div>
                        )}
                      </div>

                      {/* Add Custom Department Entry */}
                      <div className="pt-2 border-t border-slate-100 flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <input 
                          type="text"
                          placeholder="或添加其他自定义部门..."
                          value={customBizDeptInput}
                          onChange={(e) => setCustomBizDeptInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddCustomBizDept();
                            }
                          }}
                          className="flex-1 px-2.5 py-1.5 rounded-md border border-slate-200 text-xs bg-white text-slate-800 focus:outline-none focus:border-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={handleAddCustomBizDept}
                          className="px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors shrink-0"
                        >
                          添加
                        </button>
                      </div>

                      {/* Complete / Close Selection */}
                      <div className="flex justify-end pt-1 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setIsBizDeptDropdownOpen(false)}
                          className="px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium transition-colors"
                        >
                          完成选择
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Field 4: 机房部署位置 */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  4. 机房部署位置 <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text"
                  placeholder="例如：市行政中心 B栋地下2层 1号政务机房"
                  value={formData.serverLocation}
                  onChange={(e) => setFormData({ ...formData, serverLocation: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                    formErrors.serverLocation ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200 bg-slate-50/50'
                  }`}
                />
                {formErrors.serverLocation && <p className="text-[11px] text-rose-500 mt-0.5">{formErrors.serverLocation}</p>}
              </div>

              {/* Field 5 & 6: 业务负责人 & 联系方式 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    5. 业务负责人 <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text"
                    placeholder="姓名及职务"
                    value={formData.businessOwner}
                    onChange={(e) => setFormData({ ...formData, businessOwner: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                      formErrors.businessOwner ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200 bg-slate-50/50'
                    }`}
                  />
                  {formErrors.businessOwner && <p className="text-[11px] text-rose-500 mt-0.5">{formErrors.businessOwner}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    6. 业务负责人联系方式 <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text"
                    placeholder="手机号或办公电话"
                    value={formData.businessContact}
                    onChange={(e) => setFormData({ ...formData, businessContact: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                      formErrors.businessContact ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200 bg-slate-50/50'
                    }`}
                  />
                  {formErrors.businessContact && <p className="text-[11px] text-rose-500 mt-0.5">{formErrors.businessContact}</p>}
                </div>
              </div>

              {/* Field 7 & 8: 厂商负责人 & 联系方式 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    7. 厂商负责人 <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text"
                    placeholder="厂商名称及项目经理"
                    value={formData.vendorOwner}
                    onChange={(e) => setFormData({ ...formData, vendorOwner: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                      formErrors.vendorOwner ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200 bg-slate-50/50'
                    }`}
                  />
                  {formErrors.vendorOwner && <p className="text-[11px] text-rose-500 mt-0.5">{formErrors.vendorOwner}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    8. 厂商负责人联系方式 <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text"
                    placeholder="手机号码"
                    value={formData.vendorContact}
                    onChange={(e) => setFormData({ ...formData, vendorContact: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                      formErrors.vendorContact ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200 bg-slate-50/50'
                    }`}
                  />
                  {formErrors.vendorContact && <p className="text-[11px] text-rose-500 mt-0.5">{formErrors.vendorContact}</p>}
                </div>
              </div>

              {/* Network type & remark */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    部署网络隔离环境
                  </label>
                  <select 
                    value={formData.networkType}
                    onChange={(e) => setFormData({ ...formData, networkType: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50/50 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="政务外网">政务外网</option>
                    <option value="政务专网">政务专网</option>
                    <option value="互联网">互联网 (安全托管)</option>
                    <option value="绝密隔离内网">绝密隔离内网</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    备注与简要描述
                  </label>
                  <input 
                    type="text"
                    placeholder="选填系统业务用途"
                    value={formData.remark}
                    onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50/50 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button 
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  取消
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors shadow-2xs"
                >
                  {editingSystem ? '保存修改' : '确认提交登记'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Mount Database Dialog (挂载数据库) */}
      {mountingSystem && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">挂载数据库</h3>
                  <p className="text-[11px] text-slate-500">为【{mountingSystem.name}】挂载或连接底层数据库源</p>
                </div>
              </div>
              <button 
                onClick={() => setMountingSystem(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitMountDb} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="p-3 rounded-lg bg-indigo-50/60 border border-indigo-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-indigo-600 font-bold block">目标挂载系统</span>
                  <span className="text-xs font-bold text-slate-900">{mountingSystem.name}</span>
                </div>
                <span className="text-[10px] font-mono font-semibold bg-white text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
                  {mountingSystem.id}
                </span>
              </div>

              {/* DB Type & Name */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    数据库类型 <span className="text-rose-500">*</span>
                  </label>
                  <select 
                    value={dbFormData.dbType}
                    onChange={(e) => {
                      const newType = e.target.value;
                      const defaultPorts: Record<string, string> = {
                        'MySQL 8.0': '3306',
                        'PostgreSQL': '5432',
                        'Oracle 19c': '1521',
                        'DM (达梦数据库)': '5236',
                        'Kingbase (人大金仓)': '54321',
                        'SQL Server': '1433'
                      };
                      const versions = VERSION_OPTIONS_MAP[newType] || [];
                      setDbFormData({
                        ...dbFormData,
                        dbType: newType,
                        port: defaultPorts[newType] || '3306',
                        dbVersion: versions[0] || ''
                      });
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50/50 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="MySQL 8.0">MySQL 8.0 / 5.7</option>
                    <option value="PostgreSQL">PostgreSQL</option>
                    <option value="Oracle 19c">Oracle 19c / 11g</option>
                    <option value="DM (达梦数据库)">DM 达梦数据库 (国产化)</option>
                    <option value="Kingbase (人大金仓)">Kingbase 人大金仓 (国产化)</option>
                    <option value="SQL Server">Microsoft SQL Server</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    数据库名称/实例名 <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text"
                    placeholder="如：db_approval_prod"
                    value={dbFormData.dbName}
                    onChange={(e) => setDbFormData({ ...dbFormData, dbName: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                      dbFormErrors.dbName ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200 bg-slate-50/50'
                    }`}
                  />
                  {dbFormErrors.dbName && <p className="text-[11px] text-rose-500 mt-0.5">{dbFormErrors.dbName}</p>}
                </div>
              </div>

              {/* Host IP & Port (2 inputs) */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    主机 IP <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text"
                    placeholder="例如：10.208.32.105"
                    value={dbFormData.host}
                    onChange={(e) => setDbFormData({ ...dbFormData, host: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono ${
                      dbFormErrors.host ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200 bg-slate-50/50'
                    }`}
                  />
                  {dbFormErrors.host && <p className="text-[11px] text-rose-500 mt-0.5">{dbFormErrors.host}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    端口号 <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text"
                    placeholder="例如：3306"
                    value={dbFormData.port}
                    onChange={(e) => setDbFormData({ ...dbFormData, port: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono ${
                      dbFormErrors.port ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200 bg-slate-50/50'
                    }`}
                  />
                  {dbFormErrors.port && <p className="text-[11px] text-rose-500 mt-0.5">{dbFormErrors.port}</p>}
                </div>
              </div>

              {/* Username & Password */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    只读访问账号 <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text"
                    placeholder="如：meta_reader"
                    value={dbFormData.username}
                    onChange={(e) => setDbFormData({ ...dbFormData, username: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                      dbFormErrors.username ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200 bg-slate-50/50'
                    }`}
                  />
                  {dbFormErrors.username && <p className="text-[11px] text-rose-500 mt-0.5">{dbFormErrors.username}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    访问口令
                  </label>
                  <input 
                    type="password"
                    placeholder="••••••••"
                    value={dbFormData.password}
                    onChange={(e) => setDbFormData({ ...dbFormData, password: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50/50 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              {/* 数据库部署模式 & 数据库版本 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    数据库部署模式 <span className="text-rose-500">*</span>
                  </label>
                  <select 
                    value={dbFormData.deployMode}
                    onChange={(e) => setDbFormData({ ...dbFormData, deployMode: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50/50 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="主备集群">主备集群 (High Availability)</option>
                    <option value="RAC双机热备">RAC 双机/多机热备</option>
                    <option value="读写分离集群">读写分离集群</option>
                    <option value="单机部署">单机部署 (Single Instance)</option>
                    <option value="分布式集群">分布式云原生集群</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    数据库版本 <span className="text-rose-500">*</span>
                  </label>
                  <select 
                    value={dbFormData.dbVersion}
                    onChange={(e) => setDbFormData({ ...dbFormData, dbVersion: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                      dbFormErrors.dbVersion ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200 bg-slate-50/50'
                    }`}
                  >
                    <option value="">请选择数据库版本</option>
                    {(VERSION_OPTIONS_MAP[dbFormData.dbType] || [
                      'MySQL 8.0.32 Enterprise',
                      'PostgreSQL 14.5 Enterprise',
                      'Oracle 19c Enterprise (19.3.0)',
                      'DM8 8.1.2.128 (国产化)',
                      'KingbaseES V8 R6 (国产化)',
                      'Microsoft SQL Server 2022'
                    ]).map((ver, idx) => (
                      <option key={idx} value={ver}>{ver}</option>
                    ))}
                  </select>
                  {dbFormErrors.dbVersion && <p className="text-[11px] text-rose-500 mt-0.5">{dbFormErrors.dbVersion}</p>}
                </div>
              </div>

              {/* 备份策略及周期 */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  备份策略及周期 <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text"
                  placeholder="例如：每日凌晨 02:00 全量备份，每小时日志增量，保存 30 天"
                  value={dbFormData.backupPolicy}
                  onChange={(e) => setDbFormData({ ...dbFormData, backupPolicy: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                    dbFormErrors.backupPolicy ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200 bg-slate-50/50'
                  }`}
                />
                {dbFormErrors.backupPolicy && <p className="text-[11px] text-rose-500 mt-0.5">{dbFormErrors.backupPolicy}</p>}
              </div>

              {/* 数据库连接信息 */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  数据库连接信息 <span className="text-rose-500">*</span>
                </label>
                <textarea 
                  rows={2}
                  placeholder="例如：jdbc:mysql://10.208.32.105:3306/db_approval_prod?useUnicode=true&characterEncoding=utf-8"
                  value={dbFormData.connectionString}
                  onChange={(e) => setDbFormData({ ...dbFormData, connectionString: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono ${
                    dbFormErrors.connectionString ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200 bg-slate-50/50'
                  }`}
                />
                {dbFormErrors.connectionString && <p className="text-[11px] text-rose-500 mt-0.5">{dbFormErrors.connectionString}</p>}
                <p className="text-[11px] text-slate-400 mt-1">请输入包含驱动协议、服务器地址、端口及数据库实例名称的完整数据库连接信息</p>
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button 
                  type="button"
                  onClick={() => setMountingSystem(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  取消
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors shadow-2xs flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>确认挂载数据库</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: View System Detail Modal Dialog */}
      {viewDetailSystem && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                  <Server className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{viewDetailSystem.name}</h3>
                  <p className="text-[11px] text-slate-500">业务系统登记详细信息</p>
                </div>
              </div>
              <button 
                onClick={() => setViewDetailSystem(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] text-slate-400">系统所属分类</span>
                  <div className="font-bold text-amber-700 text-xs mt-0.5 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-amber-500" />
                    {viewDetailSystem.systemCategory || '无'}
                  </div>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400">部署网络环境</span>
                  <div className="font-bold text-indigo-700 text-xs mt-0.5">
                    {viewDetailSystem.networkType || '政务外网'}
                  </div>
                </div>
              </div>

              {/* 部门权属划分 */}
              <div className="p-3.5 rounded-xl bg-indigo-50/40 border border-indigo-100 space-y-2">
                <div className="flex items-center justify-between border-b border-indigo-100 pb-1.5">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                    系统归口与部门划分
                  </span>
                  <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-100/80 px-2 py-0.5 rounded">
                    支持多部门共用
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 block mb-1">主责部门 (主管单位)</span>
                    <span className="font-bold text-indigo-800 text-xs bg-white px-2 py-1 rounded border border-indigo-200 inline-block shadow-2xs">
                      {viewDetailSystem.mainDepartment || viewDetailSystem.department || '未划分'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                      共用业务部门 ({viewDetailSystem.businessDepartments?.length || 0} 个)
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {viewDetailSystem.businessDepartments && viewDetailSystem.businessDepartments.length > 0 ? (
                        viewDetailSystem.businessDepartments.map((dept, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-800 text-[11px] font-medium shadow-2xs">
                            {dept}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 text-[11px]">暂无登记业务部门</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/40">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1">机房部署位置</span>
                  <span className="font-medium text-slate-800">{viewDetailSystem.serverLocation}</span>
                </div>

                <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/40 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">业务负责人</span>
                    <span className="font-bold text-slate-900">{viewDetailSystem.businessOwner}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">联系方式</span>
                    <span className="font-mono font-semibold text-indigo-600">{viewDetailSystem.businessContact}</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/40 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">厂商负责人</span>
                    <span className="font-bold text-slate-900">{viewDetailSystem.vendorOwner}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">联系方式</span>
                    <span className="font-mono font-semibold text-purple-600">{viewDetailSystem.vendorContact}</span>
                  </div>
                </div>

                {viewDetailSystem.mountedDatabases && viewDetailSystem.mountedDatabases.length > 0 && (
                  <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/40">
                    <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">已挂载数据库信息</span>
                    <div className="space-y-2">
                      {viewDetailSystem.mountedDatabases.map(db => (
                        <div key={db.id} className="text-xs bg-white p-2.5 rounded-lg border border-slate-200 space-y-1.5">
                          <div className="flex justify-between items-center font-mono">
                            <div>
                              <span className="font-bold text-indigo-600 mr-2">{db.dbType}</span>
                              <span className="font-semibold text-slate-800">{db.dbName}</span>
                            </div>
                            <span className="text-[10px] text-slate-400">{db.hostPort}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1 border-t border-slate-100">
                            <div><span className="text-slate-400">部署模式:</span> <span className="font-medium text-slate-800">{db.deployMode || '主备集群'}</span></div>
                            <div><span className="text-slate-400">数据库版本:</span> <span className="font-medium text-slate-800 font-mono">{db.dbVersion || '-'}</span></div>
                          </div>
                          {db.backupPolicy && (
                            <div className="text-[11px] text-slate-600">
                              <span className="text-slate-400">备份策略:</span> <span className="font-medium text-slate-800">{db.backupPolicy}</span>
                            </div>
                          )}
                          {db.connectionString && (
                            <div className="text-[10px] font-mono text-slate-500 bg-slate-50 p-1.5 rounded break-all border border-slate-100">
                              {db.connectionString}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {viewDetailSystem.remark && (
                  <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/40">
                    <span className="text-[11px] font-semibold text-slate-400 block mb-1">备注说明</span>
                    <p className="text-slate-600 leading-relaxed">{viewDetailSystem.remark}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 px-6 border-t border-slate-100 flex items-center justify-end bg-slate-50/60">
              <button 
                onClick={() => setViewDetailSystem(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
