import React, { useState } from 'react';
import { 
  User, 
  History, 
  Briefcase, 
  Banknote, 
  Award, 
  Calendar, 
  Mail, 
  Phone, 
  MapPin, 
  ChevronRight,
  Search,
  ArrowLeft,
  Clock,
  FileText,
  Plus,
  Upload,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';

interface HistoryItem {
  id: string;
  date: string;
  type: 'Job' | 'Salary' | 'Award' | 'Discipline' | 'Education';
  title: string;
  description: string;
  status?: string;
}

interface SalaryChange {
  id: string;
  date: string;
  oldSalary: string;
  newSalary: string;
  reason: string;
  decisionNo: string;
}

interface Promotion {
  id: string;
  date: string;
  oldRole: string;
  newRole: string;
  oldDept: string;
  newDept: string;
  decisionNo: string;
}

interface EmployeeDetail {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  status: 'Active' | 'Inactive';
  joinDate: string;
  birthDate: string;
  gender: string;
  address: string;
  identityCard: string;
  education: string;
  contractType: 'Probation' | 'Official' | 'Contractor';
  probationSalary: string;
  officialSalary: string;
  history: HistoryItem[];
  salaryHistory: SalaryChange[];
  promotionHistory: Promotion[];
}

const MOCK_EMPLOYEE_DETAILS: EmployeeDetail[] = [
  {
    id: '1',
    code: 'NV001',
    name: 'Nguyễn Văn A',
    email: 'nva@company.com',
    phone: '0901234567',
    department: 'Văn phòng',
    role: 'Kế toán trưởng',
    status: 'Active',
    joinDate: '2020-01-15',
    birthDate: '1990-05-20',
    gender: 'Nam',
    address: '123 Đường Lê Lợi, Quận 1, TP.HCM',
    identityCard: '012345678901',
    education: 'Đại học Kinh tế TP.HCM - Chuyên ngành Kế toán',
    contractType: 'Official',
    probationSalary: '8,500,000',
    officialSalary: '10,000,000',
    history: [
      { id: 'h1', date: '2020-01-15', type: 'Job', title: 'Gia nhập công ty', description: 'Bắt đầu làm việc tại vị trí Nhân viên Kế toán.' },
      { id: 'h2', date: '2021-02-01', type: 'Salary', title: 'Điều chỉnh lương', description: 'Tăng lương định kỳ hàng năm lên 15%.' },
      { id: 'h3', date: '2022-01-01', type: 'Job', title: 'Thăng chức', description: 'Bổ nhiệm vị trí Kế toán tổng hợp.' },
      { id: 'h4', date: '2022-06-15', type: 'Award', title: 'Nhân viên xuất sắc tháng 6', description: 'Hoàn thành tốt báo cáo quyết toán thuế năm.' },
      { id: 'h5', date: '2023-01-01', type: 'Salary', title: 'Điều chỉnh lương', description: 'Tăng lương theo cấp bậc Kế toán tổng hợp.' },
      { id: 'h6', date: '2024-01-01', type: 'Job', title: 'Thăng chức', description: 'Bổ nhiệm vị trí Kế toán trưởng.' },
    ],
    salaryHistory: [
      { id: 's1', date: '2021-02-01', oldSalary: '10,000,000', newSalary: '11,500,000', reason: 'Tăng lương định kỳ', decisionNo: 'QD/2021/005' },
      { id: 's2', date: '2023-01-01', oldSalary: '11,500,000', newSalary: '15,000,000', reason: 'Thăng chức Kế toán tổng hợp', decisionNo: 'QD/2023/001' },
      { id: 's3', date: '2024-01-01', oldSalary: '15,000,000', newSalary: '20,000,000', reason: 'Bổ nhiệm Kế toán trưởng', decisionNo: 'QD/2024/002' },
    ],
    promotionHistory: [
      { id: 'p1', date: '2022-01-01', oldRole: 'Nhân viên Kế toán', newRole: 'Kế toán tổng hợp', oldDept: 'Văn phòng', newDept: 'Văn phòng', decisionNo: 'QD/2022/012' },
      { id: 'p2', date: '2024-01-01', oldRole: 'Kế toán tổng hợp', newRole: 'Kế toán trưởng', oldDept: 'Văn phòng', newDept: 'Văn phòng', decisionNo: 'QD/2024/002' },
    ]
  },
  {
    id: '2',
    code: 'NV002',
    name: 'Trần Thị B',
    email: 'ttb@company.com',
    phone: '0902345678',
    department: 'Kỹ thuật',
    role: 'Kỹ sư phần mềm',
    status: 'Active',
    joinDate: '2021-06-10',
    birthDate: '1995-11-12',
    gender: 'Nữ',
    address: '456 Đường Nguyễn Huệ, Quận 1, TP.HCM',
    identityCard: '098765432109',
    education: 'Đại học Bách Khoa TP.HCM - CNTT',
    contractType: 'Probation',
    probationSalary: '12,000,000',
    officialSalary: '15,000,000',
    history: [
      { id: 'h1', date: '2021-06-10', type: 'Job', title: 'Gia nhập công ty', description: 'Bắt đầu làm việc tại vị trí Kỹ sư phần mềm Junior.' },
      { id: 'h2', date: '2022-07-01', type: 'Job', title: 'Thăng bậc', description: 'Chuyển lên vị trí Kỹ sư phần mềm Middle.' },
      { id: 'h3', date: '2023-01-15', type: 'Award', title: 'Giải thưởng sáng tạo', description: 'Đề xuất giải pháp tối ưu hóa hệ thống chấm công.' },
    ],
    salaryHistory: [
      { id: 's1', date: '2022-07-01', oldSalary: '12,000,000', newSalary: '15,000,000', reason: 'Thăng bậc chuyên môn', decisionNo: 'QD/2022/045' },
    ],
    promotionHistory: [
      { id: 'p1', date: '2022-07-01', oldRole: 'Junior Developer', newRole: 'Middle Developer', oldDept: 'Kỹ thuật', newDept: 'Kỹ thuật', decisionNo: 'QD/2022/045' },
    ]
  }
];

export function EmployeeProfile() {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'info' | 'history' | 'salary' | 'promotion' | 'documents'>('info');
  
  // Modal states
  const [isSalaryModalOpen, setIsSalaryModalOpen] = useState(false);
  const [isPromotionModalOpen, setIsPromotionModalOpen] = useState(false);

  // Form states
  const [salaryFormData, setSalaryFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'Increase' as 'Increase' | 'Decrease',
    newSalary: '',
    reason: '',
    decisionNo: ''
  });

  const [promotionFormData, setPromotionFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    newRole: '',
    newDept: '',
    decisionNo: ''
  });

  const POSITIONS = [
    'Giám đốc',
    'Trưởng phòng',
    'Kế toán trưởng',
    'Kế toán tổng hợp',
    'Nhân viên Kế toán',
    'Kỹ sư phần mềm',
    'Nhân viên',
    'Thực tập sinh'
  ];

  const DEPARTMENTS = ['Văn phòng', 'Kỹ thuật', 'Kinh doanh', 'Sản xuất', 'Nhân sự', 'Tài chính'];

  const selectedEmployee = MOCK_EMPLOYEE_DETAILS.find(emp => emp.id === selectedEmployeeId);

  const filteredEmployees = MOCK_EMPLOYEE_DETAILS.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    emp.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!selectedEmployeeId) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Hồ sơ nhân viên</h2>
            <p className="text-sm text-slate-500">Xem chi tiết thông tin và quá trình công tác của nhân viên.</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm nhân viên để xem hồ sơ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((emp) => (
            <div 
              key={emp.id}
              onClick={() => setSelectedEmployeeId(emp.id)}
              className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xl">
                  {emp.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{emp.name}</h3>
                  <p className="text-sm text-slate-500">{emp.code} - {emp.role}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {emp.department}
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setSelectedEmployeeId(null)}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Chi tiết hồ sơ</h2>
          <p className="text-sm text-slate-500">Nhân viên: {selectedEmployee?.name} ({selectedEmployee?.code})</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Profile Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
            <div className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-3xl mx-auto mb-4">
              {selectedEmployee?.name.charAt(0)}
            </div>
            <h3 className="text-xl font-bold text-slate-900">{selectedEmployee?.name}</h3>
            <p className="text-sm text-slate-500 mb-4">{selectedEmployee?.role}</p>
            <span className={cn(
              "px-3 py-1 rounded-full text-xs font-medium",
              selectedEmployee?.status === 'Active' ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
            )}>
              {selectedEmployee?.status === 'Active' ? 'Đang làm việc' : 'Nghỉ việc'}
            </span>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Liên hệ</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Mail className="h-4 w-4 text-slate-400" />
                <span>{selectedEmployee?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Phone className="h-4 w-4 text-slate-400" />
                <span>{selectedEmployee?.phone}</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-slate-600">
                <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
                <span>{selectedEmployee?.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Tabs */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex border-b border-slate-200">
              <button 
                onClick={() => setActiveTab('info')}
                className={cn(
                  "flex-1 py-4 text-sm font-medium transition-colors border-b-2",
                  activeTab === 'info' ? "border-indigo-600 text-indigo-600 bg-indigo-50/30" : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                )}
              >
                <div className="flex items-center justify-center gap-2">
                  <User className="h-4 w-4" />
                  Thông tin cơ bản
                </div>
              </button>
              <button 
                onClick={() => setActiveTab('history')}
                className={cn(
                  "flex-1 py-4 text-sm font-medium transition-colors border-b-2",
                  activeTab === 'history' ? "border-indigo-600 text-indigo-600 bg-indigo-50/30" : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                )}
              >
                <div className="flex items-center justify-center gap-2">
                  <History className="h-4 w-4" />
                  Lịch sử chung
                </div>
              </button>
              <button 
                onClick={() => setActiveTab('salary')}
                className={cn(
                  "flex-1 py-4 text-sm font-medium transition-colors border-b-2",
                  activeTab === 'salary' ? "border-indigo-600 text-indigo-600 bg-indigo-50/30" : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                )}
              >
                <div className="flex items-center justify-center gap-2">
                  <Banknote className="h-4 w-4" />
                  Diễn biến lương
                </div>
              </button>
              <button 
                onClick={() => setActiveTab('promotion')}
                className={cn(
                  "flex-1 py-4 text-sm font-medium transition-colors border-b-2",
                  activeTab === 'promotion' ? "border-indigo-600 text-indigo-600 bg-indigo-50/30" : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                )}
              >
                <div className="flex items-center justify-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Thăng chức/Điều chuyển
                </div>
              </button>
              <button 
                onClick={() => setActiveTab('documents')}
                className={cn(
                  "flex-1 py-4 text-sm font-medium transition-colors border-b-2",
                  activeTab === 'documents' ? "border-indigo-600 text-indigo-600 bg-indigo-50/30" : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                )}
              >
                <div className="flex items-center justify-center gap-2">
                  <FileText className="h-4 w-4" />
                  Hồ sơ đính kèm
                </div>
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'info' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h4 className="font-bold text-slate-900 border-l-4 border-indigo-500 pl-3">Thông tin cá nhân</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-sm text-slate-500">Ngày sinh</span>
                        <span className="text-sm font-medium text-slate-900">{selectedEmployee?.birthDate}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-sm text-slate-500">Giới tính</span>
                        <span className="text-sm font-medium text-slate-900">{selectedEmployee?.gender}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-sm text-slate-500">Số CMND/CCCD</span>
                        <span className="text-sm font-medium text-slate-900">{selectedEmployee?.identityCard}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-sm text-slate-500">Trình độ học vấn</span>
                        <span className="text-sm font-medium text-slate-900">{selectedEmployee?.education}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <h4 className="font-bold text-slate-900 border-l-4 border-indigo-500 pl-3">Thông tin công việc</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-sm text-slate-500">Mã nhân viên</span>
                        <span className="text-sm font-medium text-slate-900">{selectedEmployee?.code}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-sm text-slate-500">Ngày vào làm</span>
                        <span className="text-sm font-medium text-slate-900">{selectedEmployee?.joinDate}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-sm text-slate-500">Phòng ban</span>
                        <span className="text-sm font-medium text-slate-900">{selectedEmployee?.department}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-sm text-slate-500">Chức vụ hiện tại</span>
                        <span className="text-sm font-medium text-slate-900">{selectedEmployee?.role}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-sm text-slate-500">Loại hợp đồng</span>
                        <span className="text-sm font-medium text-indigo-600">
                          {selectedEmployee?.contractType === 'Probation' ? 'Thử việc' : 
                           selectedEmployee?.contractType === 'Official' ? 'Chính thức' : 'Hợp đồng khoán'}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-sm text-slate-500">Lương thử việc</span>
                        <span className="text-sm font-medium text-slate-900">{selectedEmployee?.probationSalary} VNĐ</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-sm text-slate-500">Lương chính thức</span>
                        <span className="text-sm font-bold text-emerald-600">{selectedEmployee?.officialSalary} VNĐ</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'history' && (
                <div className="relative pl-8 space-y-8 before:content-[''] before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {selectedEmployee?.history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((item) => (
                    <div key={item.id} className="relative">
                      <div className={cn(
                        "absolute -left-8 top-1 h-6 w-6 rounded-full border-4 border-white flex items-center justify-center shadow-sm",
                        item.type === 'Job' ? "bg-blue-500" : 
                        item.type === 'Salary' ? "bg-emerald-500" : 
                        item.type === 'Award' ? "bg-amber-500" : "bg-red-500"
                      )}>
                        {item.type === 'Job' && <Briefcase className="h-3 w-3 text-white" />}
                        {item.type === 'Salary' && <Banknote className="h-3 w-3 text-white" />}
                        {item.type === 'Award' && <Award className="h-3 w-3 text-white" />}
                        {item.type === 'Discipline' && <Clock className="h-3 w-3 text-white" />}
                      </div>
                      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <div className="flex justify-between items-start mb-1">
                          <h5 className="font-bold text-slate-900">{item.title}</h5>
                          <span className="text-xs font-medium text-slate-500 bg-white px-2 py-1 rounded border border-slate-200 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {item.date}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'salary' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Lịch sử lương</h4>
                    <button 
                      onClick={() => setIsSalaryModalOpen(true)}
                      className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white rounded-md text-xs font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1.5" />
                      Ghi nhận tăng lương
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Ngày áp dụng</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Lương cũ</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Lương mới</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Lý do</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Số quyết định</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {selectedEmployee?.salaryHistory.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="px-4 py-4 text-sm text-slate-900">{item.date}</td>
                          <td className="px-4 py-4 text-sm text-slate-500 line-through">{item.oldSalary}</td>
                          <td className="px-4 py-4 text-sm font-bold text-emerald-600">{item.newSalary}</td>
                          <td className="px-4 py-4 text-sm text-slate-600">{item.reason}</td>
                          <td className="px-4 py-4 text-sm text-indigo-600 font-medium">{item.decisionNo}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'promotion' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Quá trình công tác</h4>
                    <button 
                      onClick={() => setIsPromotionModalOpen(true)}
                      className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white rounded-md text-xs font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1.5" />
                      Thăng chức / Điều chuyển
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Ngày bổ nhiệm</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Chức vụ cũ</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Chức vụ mới</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Phòng ban</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Số quyết định</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {selectedEmployee?.promotionHistory.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="px-4 py-4 text-sm text-slate-900">{item.date}</td>
                          <td className="px-4 py-4 text-sm text-slate-500">{item.oldRole}</td>
                          <td className="px-4 py-4 text-sm font-bold text-indigo-600">{item.newRole}</td>
                          <td className="px-4 py-4 text-sm text-slate-600">{item.newDept}</td>
                          <td className="px-4 py-4 text-sm text-indigo-600 font-medium">{item.decisionNo}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Danh sách tài liệu</h4>
                    <button 
                      onClick={() => alert('Tính năng tải lên tài liệu đang được kết nối với hệ thống lưu trữ...')}
                      className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white rounded-md text-xs font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1.5" />
                      Tải lên tài liệu mới
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 border border-slate-200 rounded-lg flex items-center gap-4 hover:bg-slate-50 transition-colors cursor-pointer group">
                      <div className="h-12 w-12 rounded bg-red-50 flex items-center justify-center text-red-500">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900 group-hover:text-indigo-600">Hop_dong_lao_dong.pdf</p>
                        <p className="text-xs text-slate-500">2.4 MB - 15/01/2020</p>
                      </div>
                    </div>
                    <div className="p-4 border border-slate-200 rounded-lg flex items-center gap-4 hover:bg-slate-50 transition-colors cursor-pointer group">
                      <div className="h-12 w-12 rounded bg-blue-50 flex items-center justify-center text-blue-500">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900 group-hover:text-indigo-600">Bang_tot_nghiep.pdf</p>
                        <p className="text-xs text-slate-500">1.1 MB - 15/01/2020</p>
                      </div>
                    </div>
                    <div className="p-4 border border-slate-200 rounded-lg flex items-center gap-4 hover:bg-slate-50 transition-colors cursor-pointer group">
                      <div className="h-12 w-12 rounded bg-emerald-50 flex items-center justify-center text-emerald-500">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900 group-hover:text-indigo-600">CCCD_Mat_truoc_sau.jpg</p>
                        <p className="text-xs text-slate-500">0.8 MB - 15/01/2020</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 flex flex-col items-center justify-center text-center">
                    <Upload className="h-10 w-10 text-slate-300 mb-3" />
                    <p className="text-sm font-medium text-slate-600">Kéo thả tài liệu vào đây để đính kèm</p>
                    <p className="text-xs text-slate-400 mt-1">Hỗ trợ PDF, JPG, PNG, DOCX (Tối đa 10MB)</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Salary Modal */}
      {isSalaryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold text-slate-900">Ghi nhận điều chỉnh lương</h3>
              <button onClick={() => setIsSalaryModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Ngày áp dụng</label>
                  <input 
                    type="date" 
                    value={salaryFormData.date}
                    onChange={e => setSalaryFormData({...salaryFormData, date: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Loại điều chỉnh</label>
                  <select 
                    value={salaryFormData.type}
                    onChange={e => setSalaryFormData({...salaryFormData, type: e.target.value as 'Increase' | 'Decrease'})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="Increase">Tăng lương</option>
                    <option value="Decrease">Giảm lương</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Mức lương mới</label>
                <input 
                  type="text" 
                  placeholder="VD: 25,000,000"
                  value={salaryFormData.newSalary}
                  onChange={e => setSalaryFormData({...salaryFormData, newSalary: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Lý do điều chỉnh</label>
                <textarea 
                  rows={3}
                  placeholder="VD: Tăng lương định kỳ năm 2024"
                  value={salaryFormData.reason}
                  onChange={e => setSalaryFormData({...salaryFormData, reason: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                ></textarea>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Số quyết định</label>
                <input 
                  type="text" 
                  placeholder="VD: QD/2024/015"
                  value={salaryFormData.decisionNo}
                  onChange={e => setSalaryFormData({...salaryFormData, decisionNo: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                />
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={() => setIsSalaryModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800">Hủy</button>
              <button 
                onClick={() => {
                  alert('Đã ghi nhận điều chỉnh lương thành công!');
                  setIsSalaryModalOpen(false);
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                Lưu thông tin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Promotion Modal */}
      {isPromotionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold text-slate-900">Thăng chức / Điều chuyển</h3>
              <button onClick={() => setIsPromotionModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Ngày bổ nhiệm</label>
                <input 
                  type="date" 
                  value={promotionFormData.date}
                  onChange={e => setPromotionFormData({...promotionFormData, date: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Chức vụ mới</label>
                <select 
                  value={promotionFormData.newRole}
                  onChange={e => setPromotionFormData({...promotionFormData, newRole: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">-- Chọn chức vụ --</option>
                  {POSITIONS.map(pos => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phòng ban mới</label>
                <select 
                  value={promotionFormData.newDept}
                  onChange={e => setPromotionFormData({...promotionFormData, newDept: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">-- Chọn phòng ban --</option>
                  {DEPARTMENTS.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Số quyết định</label>
                <input 
                  type="text" 
                  placeholder="VD: QD/2024/020"
                  value={promotionFormData.decisionNo}
                  onChange={e => setPromotionFormData({...promotionFormData, decisionNo: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                />
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={() => setIsPromotionModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800">Hủy</button>
              <button 
                onClick={() => {
                  alert('Đã ghi nhận thăng chức/điều chuyển thành công!');
                  setIsPromotionModalOpen(false);
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                Lưu thông tin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
