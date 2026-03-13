import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Clock, 
  CalendarDays, 
  Calculator, 
  Settings,
  Briefcase,
  Timer,
  MapPin,
  Building2,
  Award,
  Baby,
  Coins,
  Medal,
  Truck,
  Palmtree,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  UserCircle,
  Database,
  Banknote,
  FileText
} from 'lucide-react';
import { cn } from '../lib/utils';

interface NavItem {
  name: string;
  href: string;
  icon: any;
}

interface NavGroup {
  name: string;
  icon: any;
  children: NavItem[];
}

const navigation: (NavItem | NavGroup)[] = [
  { name: 'Tổng quan', href: '/', icon: LayoutDashboard },
  {
    name: 'Quản lý nhân viên',
    icon: UserCircle,
    children: [
      { name: 'Danh sách nhân viên', href: '/employees', icon: Users },
      { name: 'Hồ sơ nhân viên', href: '/employee-profile', icon: FileText },
      { name: 'Quản lý hợp đồng', href: '/contracts', icon: FileText },
      { name: 'Người phụ thuộc', href: '/dependents', icon: Baby },
      { name: 'Khen thưởng & Kỷ luật', href: '/rewards-disciplines', icon: Medal },
    ]
  },
  {
    name: 'Danh mục',
    icon: Database,
    children: [
      { name: 'Chi nhánh', href: '/branches', icon: Building2 },
      { name: 'Phòng ban', href: '/departments', icon: Briefcase },
      { name: 'Chức vụ', href: '/positions', icon: Award },
    ]
  },
  {
    name: 'Chấm công',
    icon: Clock,
    children: [
      { name: 'Ca làm việc', href: '/shifts', icon: Timer },
      { name: 'Vị trí chấm công', href: '/locations', icon: MapPin },
      { name: 'Mã chấm công', href: '/vehicles', icon: Truck },
      { name: 'Ngày nghỉ lễ', href: '/holidays', icon: Palmtree },
      { name: 'Bảng chấm công', href: '/timekeeping', icon: ClipboardList },
      { name: 'Nghỉ phép & Công tác', href: '/requests', icon: CalendarDays },
    ]
  },
  {
    name: 'Tiền lương',
    icon: Banknote,
    children: [
      { name: 'Phụ cấp & Giảm trừ', href: '/allowances', icon: Coins },
      { name: 'Tính lương', href: '/payroll', icon: Calculator },
    ]
  },
  {
    name: 'Hệ thống',
    icon: Settings,
    children: [
      { name: 'Thông tin công ty', href: '/company', icon: Building2 },
      { name: 'Cài đặt', href: '/settings', icon: Settings },
    ]
  },
];

function NavItemComponent({ item, depth = 0 }: { item: NavItem, depth?: number }) {
  return (
    <NavLink
      to={item.href}
      className={({ isActive }) =>
        cn(
          'group flex items-center rounded-md py-2 text-sm font-medium transition-colors mb-1',
          depth > 0 ? 'pl-10 pr-3' : 'px-3',
          isActive
            ? 'bg-indigo-50 text-indigo-700'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
        )
      }
    >
      {({ isActive }) => (
        <>
          <item.icon
            className={cn(
              'mr-3 h-4 w-4 flex-shrink-0',
              isActive ? 'text-indigo-700' : 'text-slate-400 group-hover:text-slate-500'
            )}
            aria-hidden="true"
          />
          {item.name}
        </>
      )}
    </NavLink>
  );
}

function NavGroupComponent({ group }: { group: NavGroup }) {
  const location = useLocation();
  const isChildActive = group.children.some(child => location.pathname === child.href);
  const [isOpen, setIsOpen] = useState(isChildActive);

  return (
    <div className="mb-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full group flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors',
          isChildActive ? 'text-indigo-700' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
        )}
      >
        <div className="flex items-center">
          <group.icon
            className={cn(
              'mr-3 h-5 w-5 flex-shrink-0',
              isChildActive ? 'text-indigo-700' : 'text-slate-400 group-hover:text-slate-500'
            )}
            aria-hidden="true"
          />
          {group.name}
        </div>
        {isOpen ? (
          <ChevronDown className="h-4 w-4 text-slate-400" />
        ) : (
          <ChevronRight className="h-4 w-4 text-slate-400" />
        )}
      </button>
      {isOpen && (
        <div className="mt-1 space-y-1">
          {group.children.map((child) => (
            <div key={child.name}>
              <NavItemComponent item={child} depth={1} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function Sidebar() {
  return (
    <div className="flex h-full w-64 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-16 items-center px-6 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900">HRMS Pro</h1>
      </div>
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {navigation.map((item) => (
          'children' in item ? (
            <div key={item.name}>
              <NavGroupComponent group={item as NavGroup} />
            </div>
          ) : (
            <div key={item.name}>
              <NavItemComponent item={item as NavItem} />
            </div>
          )
        ))}
      </nav>
      <div className="border-t border-slate-200 p-4">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
            AD
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-slate-700">Admin User</p>
            <p className="text-xs font-medium text-slate-500">Quản trị viên</p>
          </div>
        </div>
      </div>
    </div>
  );
}
