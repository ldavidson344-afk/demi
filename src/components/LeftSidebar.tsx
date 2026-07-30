import React, { useState } from 'react';
import { 
  Code, 
  FolderArchive, 
  FileText, 
  LayoutGrid, 
  ChevronRight, 
  ChevronDown, 
  Search, 
  Folder, 
  FolderOpen, 
  Layers, 
  CheckCircle2,
  ListTree
} from 'lucide-react';
import { CategoryTreeNode } from '../types';
import { CATEGORY_TREES } from '../data/mockCatalogData';

const LEFT_SECONDARY_MENUS: { id: string; label: string; iconName: string; hasSub: boolean }[] = [];

interface LeftSidebarProps {
  activeSecondaryMenu: string;
  onSelectSecondaryMenu: (id: string) => void;
  selectedCategoryType: string;
  onChangeCategoryType: (type: string) => void;
  selectedNodeId: string | null;
  onSelectTreeNode: (nodeId: string | null, nodeName: string) => void;
  treeSearchKeyword: string;
  onSearchTree: (val: string) => void;
}

const MENU_ICON_MAP: Record<string, React.ReactNode> = {
  Code: <Code className="w-4 h-4 text-slate-500" />,
  FolderArchive: <FolderArchive className="w-4 h-4 text-slate-500" />,
  FileText: <FileText className="w-4 h-4 text-slate-500" />,
  LayoutGrid: <LayoutGrid className="w-4 h-4 text-blue-600" />,
};

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  activeSecondaryMenu,
  onSelectSecondaryMenu,
  selectedCategoryType,
  onChangeCategoryType,
  selectedNodeId,
  onSelectTreeNode,
  treeSearchKeyword,
  onSearchTree
}) => {
  // State for expanded tree node IDs
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'ind_all': true,
    'ind_gov': true,
    'ind_health': true,
    'sub_all': true,
    'dept_all': true
  });

  const toggleNodeExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const categoryTreeData = CATEGORY_TREES[selectedCategoryType] || [];

  // Recursive Tree Node Renderer
  const renderTreeNode = (node: CategoryTreeNode, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes[node.id];
    const isSelected = selectedNodeId === node.id;

    // Search filter for tree
    if (treeSearchKeyword.trim() !== '') {
      const matchSelf = node.label.toLowerCase().includes(treeSearchKeyword.toLowerCase()) || 
                        (node.code && node.code.toLowerCase().includes(treeSearchKeyword.toLowerCase()));
      const matchChild = hasChildren && node.children?.some(child => 
        child.label.toLowerCase().includes(treeSearchKeyword.toLowerCase())
      );

      if (!matchSelf && !matchChild) return null;
    }

    return (
      <div key={node.id} className="select-none">
        <div
          onClick={() => onSelectTreeNode(node.id, node.label)}
          style={{ paddingLeft: `${level * 14 + 10}px` }}
          className={`flex items-center justify-between py-1.5 pr-2 rounded-md text-xs font-medium cursor-pointer transition-colors group ${
            isSelected
              ? 'bg-blue-50 text-blue-700 font-semibold border-r-2 border-blue-600'
              : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center gap-1.5 overflow-hidden">
            {hasChildren ? (
              <button
                onClick={(e) => toggleNodeExpand(node.id, e)}
                className="p-0.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200/50"
              >
                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
              </button>
            ) : (
              <span className="w-3.5 h-3.5 inline-block"></span>
            )}

            {hasChildren ? (
              isExpanded ? (
                <FolderOpen className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-600' : 'text-amber-500'}`} />
              ) : (
                <Folder className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-600' : 'text-amber-500'}`} />
              )
            ) : (
              <Layers className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
            )}

            <span className="truncate">{node.label}</span>
          </div>

          {node.count !== undefined && (
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                isSelected ? 'bg-blue-200/70 text-blue-800' : 'bg-slate-100 text-slate-400 group-hover:text-slate-600'
              }`}
            >
              {node.count}
            </span>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-0.5 space-y-0.5">
            {node.children!.map((child) => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="w-64 min-w-[16rem] bg-white border-r border-slate-200 flex flex-col h-[calc(100vh-5.75rem)] select-none">
      {/* Upper Section: Secondary Menu Navigation List (二级菜单) */}
      <div className="p-3 border-b border-slate-100 space-y-1">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center gap-1">
          <ListTree className="w-3 h-3 text-slate-400" />
          功能菜单
        </div>

        {LEFT_SECONDARY_MENUS.map((menu) => {
          const isActive = activeSecondaryMenu === menu.id;
          return (
            <div
              key={menu.id}
              onClick={() => onSelectSecondaryMenu(menu.id)}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                isActive
                  ? 'bg-blue-50/90 text-blue-700 font-semibold shadow-2xs border border-blue-100'
                  : 'text-slate-700 hover:bg-slate-100/70 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {MENU_ICON_MAP[menu.iconName]}
                <span>{menu.label}</span>
              </div>
              {menu.hasSub ? (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              ) : isActive ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Lower Section: Category Tree Selector (数据分类及分类树结构) */}
      <div className="flex-1 flex flex-col overflow-hidden p-3 bg-slate-50/40">
        {/* Classification Header & Select Dropdown */}
        <div className="space-y-2 mb-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              数据分类
            </span>
            {selectedNodeId && (
              <button
                onClick={() => onSelectTreeNode(null, '')}
                className="text-[11px] text-blue-600 hover:underline"
              >
                清除节点筛选
              </button>
            )}
          </div>

          <select
            value={selectedCategoryType}
            onChange={(e) => onChangeCategoryType(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs"
          >
            <option value="行业分类">行业分类</option>
            <option value="主题分类">主题分类</option>
            <option value="部门分类">部门分类</option>
          </select>

          {/* Search tree input */}
          <div className="relative">
            <input
              type="text"
              placeholder="请输入关键词搜索树..."
              value={treeSearchKeyword}
              onChange={(e) => onSearchTree(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-md pl-8 pr-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
          </div>
        </div>

        {/* Tree Container */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-0.5 border border-slate-200/80 rounded-lg bg-white p-2 shadow-2xs">
          {categoryTreeData.length > 0 ? (
            categoryTreeData.map((node) => renderTreeNode(node, 0))
          ) : (
            <div className="py-6 text-center text-xs text-slate-400">
              未匹配到分类节点
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
