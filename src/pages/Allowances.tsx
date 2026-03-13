import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, Coins, Check, Minus, ArrowDownCircle, ArrowUpCircle, Users, Calendar } from 'lucide-react';

type RecordType = 'Allowance' | 'Deduction';

// 1. Kiểu dữ liệu cho Danh mục (Catalog)
type AllowanceDeduction = {
  id: string;
  code: string;
  name: string;
  type: RecordType;
  amount: number; // Mức mặc định
  isTaxable: boolean;
  description: string;
  status: 'Active' | 'Inactive';
};

// 2. Kiểu dữ liệu cho việc Gán cho nhân viên (Mapping)
type EmployeeAllowance = {
  id: string;
  employeeId: string;
  employeeName: string;
  recordId: string;
  additionalAmount: number; // Phần thêm/bớt so với mặc định
  effectiveDate: string;
};

const initialData: AllowanceDeduction[] = [
  { id: '1', code: 'PC_ANTRUA', name: 'Phụ cấp ăn trưa', type: 'Allowance', amount: 730000, isTaxable: false, description: 'Phụ cấp ăn trưa hàng tháng', status: 'Active' },
  { id: '2', code: 'PC_XANGXE', name: 'Phụ cấp xăng xe', type: 'Allowance', amount: 500000, isTaxable: true, description: 'Hỗ trợ chi phí đi lại', status: 'Active' },
  { id: '3', code: 'PC_DIENTHOAI', name: 'Phụ cấp điện thoại', type: 'Allowance', amount: 300000, isTaxable: false, description: 'Hỗ trợ cước viễn thông', status: 'Active' },
  { id: '4', code: 'PC_TRACHNHIEM', name: 'Phụ cấp trách nhiệm', type: 'Allowance', amount: 2000000, isTaxable: true, description: 'Dành cho quản lý', status: 'Active' },
  { id: '5', code: 'GT_CONGDOAN', name: 'Phí công đoàn', type: 'Deduction', amount: 50000, isTaxable: false, description: 'Đóng phí công đoàn', status: 'Active' },
];

const mockEmployees = [
  { id: 'EMP001', name: 'Nguyễn Văn A' },
  { id: 'EMP002', name: 'Trần Thị B' },
  { id: 'EMP003', name: 'Lê Văn C' },
  { id: 'EMP004', name: 'Phạm Thị D' },
];

const initialMappings: EmployeeAllowance[] = [
  { id: 'm1', employeeId: 'EMP001', employeeName: 'Nguyễn Văn A', recordId: '1', additionalAmount: 0, effectiveDate: '2024-01-01' },
  { id: 'm2', employeeId: 'EMP001', employeeName: 'Nguyễn Văn A', recordId: '2', additionalAmount: 300000, effectiveDate: '2024-01-01' }, // 500k + 300k = 800k
  { id: 'm3', employeeId: 'EMP002', employeeName: 'Trần Thị B', recordId: '1', additionalAmount: 0, effectiveDate: '2024-01-01' },
  { id: 'm4', employeeId: 'EMP002', employeeName: 'Trần Thị B', recordId: '4', additionalAmount: -500000, effectiveDate: '2024-01-01' }, // 2000k - 500k = 1500k
];

const formatVND = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export function Allowances() {
  const [activeTab, setActiveTab] = useState<'catalog' | 'mapping'>('mapping');

  // --- STATE CHO DANH MỤC (CATALOG) ---
  const [records, setRecords] = useState<AllowanceDeduction[]>(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'All' | RecordType>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AllowanceDeduction | null>(null);
  const [formData, setFormData] = useState<Partial<AllowanceDeduction>>({
    code: '', name: '', type: 'Allowance', amount: 0, isTaxable: false, description: '', status: 'Active'
  });

  // --- STATE CHO GÁN NHÂN VIÊN (MAPPING) ---
  const [mappings, setMappings] = useState<EmployeeAllowance[]>(initialMappings);
  const [mappingSearchTerm, setMappingSearchTerm] = useState('');
  const [isMappingModalOpen, setIsMappingModalOpen] = useState(false);
  const [editingMappingItem, setEditingMappingItem] = useState<EmployeeAllowance | null>(null);
  const [mappingFormData, setMappingFormData] = useState<Partial<EmployeeAllowance>>({
    employeeId: '', employeeName: '', recordId: '', additionalAmount: 0, effectiveDate: new Date().toISOString().split('T')[0]
  });

  // --- HANDLERS CHO DANH MỤC ---
  const filteredData = records.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleOpenModal = (item?: AllowanceDeduction) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({ code: '', name: '', type: 'Allowance', amount: 0, isTaxable: false, description: '', status: 'Active' });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      setRecords(records.map(item => item.id === editingItem.id ? { ...formData, id: item.id } as AllowanceDeduction : item));
    } else {
      setRecords([...records, { ...formData, id: Date.now().toString() } as AllowanceDeduction]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bản ghi này?')) {
      setRecords(records.filter(item => item.id !== id));
      // Xóa luôn các mapping liên quan
      setMappings(mappings.filter(m => m.recordId !== id));
    }
  };

  // --- HANDLERS CHO MAPPING ---
  const filteredMappings = mappings.filter(item => {
    const record = records.find(r => r.id === item.recordId);
    const recordName = record ? record.name : '';
    return item.employeeName.toLowerCase().includes(mappingSearchTerm.toLowerCase()) ||
           recordName.toLowerCase().includes(mappingSearchTerm.toLowerCase());
  });

  const handleOpenMappingModal = (item?: EmployeeAllowance) => {
    if (item) {
      setEditingMappingItem(item);
      setMappingFormData(item);
    } else {
      setEditingMappingItem(null);
      setMappingFormData({ 
        employeeId: '', employeeName: '', recordId: '', additionalAmount: 0, effectiveDate: new Date().toISOString().split('T')[0] 
      });
    }
    setIsMappingModalOpen(true);
  };

  const handleRecordChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const recordId = e.target.value;
    setMappingFormData({
      ...mappingFormData,
      recordId: recordId,
      additionalAmount: 0 // Reset phần thêm về 0 khi chọn khoản mục mới
    });
  };

  const handleEmployeeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const empId = e.target.value;
    const emp = mockEmployees.find(r => r.id === empId);
    if (emp) {
      setMappingFormData({
        ...mappingFormData,
        employeeId: emp.id,
        employeeName: emp.name
      });
    }
  };

  const handleSaveMapping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mappingFormData.employeeId || !mappingFormData.recordId) {
      alert('Vui lòng chọn nhân viên và khoản mục!');
      return;
    }

    if (editingMappingItem) {
      setMappings(mappings.map(item => item.id === editingMappingItem.id ? { ...mappingFormData, id: item.id } as EmployeeAllowance : item));
    } else {
      setMappings([...mappings, { ...mappingFormData, id: Date.now().toString() } as EmployeeAllowance]);
    }
    setIsMappingModalOpen(false);
  };

  const handleDeleteMapping = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn gỡ khoản mục này khỏi nhân viên?')) {
      setMappings(mappings.filter(item => item.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Phụ cấp & Giảm trừ</h2>
          <p className="text-sm text-slate-500">Quản lý danh mục và gán mức phụ cấp/giảm trừ tùy chỉnh cho từng nhân viên.</p>
        </div>
        {activeTab === 'catalog' ? (
          <button 
            onClick={() => handleOpenModal()}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm khoản mục
          </button>
        ) : (
          <button 
            onClick={() => handleOpenMappingModal()}
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Gán cho nhân viên
          </button>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('mapping')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'mapping'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <Users className="w-4 h-4 inline-block mr-2 mb-0.5" />
            Chi tiết theo nhân viên
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'catalog'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <Coins className="w-4 h-4 inline-block mr-2 mb-0.5" />
            Danh mục khoản mục
          </button>
        </nav>
      </div>

      {/* TAB: CHI TIẾT THEO NHÂN VIÊN */}
      {activeTab === 'mapping' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên nhân viên hoặc khoản mục..."
                value={mappingSearchTerm}
                onChange={(e) => setMappingSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Nhân viên</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Khoản mục</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Loại</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Mức mặc định</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Phần thêm/bớt</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Tổng cộng</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Ngày áp dụng</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredMappings.map((item) => {
                    const record = records.find(r => r.id === item.recordId);
                    if (!record) return null;
                    
                    const defaultAmount = record.amount;
                    const additionalAmount = item.additionalAmount;
                    const totalAmount = defaultAmount + additionalAmount;

                    return (
                      <tr 
                        key={item.id} 
                        className="hover:bg-slate-50 cursor-pointer"
                        onClick={() => handleOpenMappingModal(item)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs mr-3">
                              {item.employeeName.charAt(0)}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-slate-900">{item.employeeName}</div>
                              <div className="text-xs text-slate-500">{item.employeeId}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-medium">
                          {record.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {record.type === 'Allowance' ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                              <ArrowUpCircle className="w-3 h-3 mr-1" /> Phụ cấp
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                              <ArrowDownCircle className="w-3 h-3 mr-1" /> Giảm trừ
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 text-right">
                          {formatVND(defaultAmount)}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${additionalAmount > 0 ? 'text-emerald-600' : additionalAmount < 0 ? 'text-red-600' : 'text-slate-400'}`}>
                          {additionalAmount > 0 ? '+' : ''}{formatVND(additionalAmount)}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold text-right ${record.type === 'Allowance' ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {record.type === 'Allowance' ? '+' : '-'}{formatVND(totalAmount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          {new Date(item.effectiveDate).toLocaleDateString('vi-VN')}
                        </td>
                      </tr>
                    );
                  })}
                  {filteredMappings.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-slate-500 text-sm">
                        Không tìm thấy dữ liệu gán khoản mục nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: DANH MỤC KHOẢN MỤC */}
      {activeTab === 'catalog' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm mã, tên khoản mục..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
            <div className="w-full sm:w-auto flex rounded-md shadow-sm">
              <button
                onClick={() => setFilterType('All')}
                className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium border border-slate-300 rounded-l-md ${filterType === 'All' ? 'bg-indigo-50 text-indigo-600 border-indigo-500 z-10' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setFilterType('Allowance')}
                className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium border-t border-b border-r border-slate-300 ${filterType === 'Allowance' ? 'bg-emerald-50 text-emerald-600 border-emerald-500 z-10' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
              >
                Phụ cấp
              </button>
              <button
                onClick={() => setFilterType('Deduction')}
                className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium border-t border-b border-r border-slate-300 rounded-r-md ${filterType === 'Deduction' ? 'bg-amber-50 text-amber-600 border-amber-500 z-10' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
              >
                Giảm trừ
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Mã</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Tên khoản mục</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Loại</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Mức tiền (Mặc định)</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase">Tính thuế TNCN</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredData.map((item) => (
                    <tr 
                      key={item.id} 
                      className="hover:bg-slate-50 cursor-pointer"
                      onClick={() => handleOpenModal(item)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{item.code}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        <div className="flex items-center">
                          <Coins className={`h-4 w-4 mr-2 ${item.type === 'Allowance' ? 'text-emerald-500' : 'text-amber-500'}`} />
                          {item.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.type === 'Allowance' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            <ArrowUpCircle className="w-3 h-3 mr-1" /> Phụ cấp
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            <ArrowDownCircle className="w-3 h-3 mr-1" /> Giảm trừ
                          </span>
                        )}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${item.type === 'Allowance' ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {item.type === 'Allowance' ? '+' : '-'}{formatVND(item.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {item.isTaxable ? (
                          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-red-100 text-red-600" title="Có tính vào thuế TNCN">
                            <Check className="h-4 w-4" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-slate-100 text-slate-400" title="Không tính vào thuế TNCN">
                            <Minus className="h-4 w-4" />
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.status === 'Active' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-800'
                        }`}>
                          {item.status === 'Active' ? 'Hoạt động' : 'Ngừng sử dụng'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: THÊM/SỬA DANH MỤC */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">
                {editingItem ? 'Cập nhật danh mục' : 'Thêm danh mục mới'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-500">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Loại khoản mục *</label>
                  <select 
                    required 
                    value={formData.type} 
                    onChange={e => setFormData({...formData, type: e.target.value as RecordType})} 
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                  >
                    <option value="Allowance">Phụ cấp (+)</option>
                    <option value="Deduction">Giảm trừ (-)</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mã khoản mục *</label>
                  <input required type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm" placeholder="VD: PC_ANTRUA" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tên khoản mục *</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm" placeholder="VD: Phụ cấp ăn trưa" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mức tiền mặc định (VNĐ) *</label>
                  <input required type="number" min="0" step="1000" value={formData.amount} onChange={e => setFormData({...formData, amount: Number(e.target.value)})} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm" />
                </div>
                <div className="col-span-2 flex items-center mt-2">
                  <input 
                    id="isTaxable" 
                    type="checkbox" 
                    checked={formData.isTaxable} 
                    onChange={e => setFormData({...formData, isTaxable: e.target.checked})} 
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
                  />
                  <label htmlFor="isTaxable" className="ml-2 block text-sm text-slate-700">
                    {formData.type === 'Allowance' ? 'Phụ cấp này chịu thuế TNCN' : 'Khoản giảm trừ này được trừ trước khi tính thuế TNCN'}
                  </label>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Trạng thái</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as 'Active' | 'Inactive'})} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm">
                    <option value="Active">Hoạt động</option>
                    <option value="Inactive">Ngừng sử dụng</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex justify-between items-center border-t border-slate-200 mt-6">
                {editingItem ? (
                  <button 
                    type="button" 
                    onClick={() => { handleDelete(editingItem.id); setIsModalOpen(false); }} 
                    className="px-4 py-2 bg-white border border-red-300 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Xóa
                  </button>
                ) : <div></div>}
                <div className="flex gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700">Hủy</button>
                  <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium">{editingItem ? 'Cập nhật' : 'Thêm mới'}</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: GÁN CHO NHÂN VIÊN */}
      {isMappingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">
                {editingMappingItem ? 'Cập nhật mức áp dụng' : 'Gán khoản mục cho nhân viên'}
              </h3>
              <button onClick={() => setIsMappingModalOpen(false)} className="text-slate-400 hover:text-slate-500">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSaveMapping} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nhân viên *</label>
                  <select 
                    required 
                    value={mappingFormData.employeeId} 
                    onChange={handleEmployeeChange} 
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                    disabled={!!editingMappingItem} // Không cho đổi nhân viên khi đang edit
                  >
                    <option value="">-- Chọn nhân viên --</option>
                    {mockEmployees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name} ({emp.id})</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Khoản mục *</label>
                  <select 
                    required 
                    value={mappingFormData.recordId} 
                    onChange={handleRecordChange} 
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                    disabled={!!editingMappingItem} // Không cho đổi khoản mục khi đang edit
                  >
                    <option value="">-- Chọn khoản mục --</option>
                    {records.filter(r => r.status === 'Active').map(r => (
                      <option key={r.id} value={r.id}>
                        {r.name} (Mặc định: {formatVND(r.amount)})
                      </option>
                    ))}
                  </select>
                </div>
                
                {mappingFormData.recordId && (
                  <div className="col-span-2 bg-slate-50 p-3 rounded-md border border-slate-200">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-500">Mức mặc định:</span>
                      <span className="font-medium text-slate-900">
                        {formatVND(records.find(r => r.id === mappingFormData.recordId)?.amount || 0)}
                      </span>
                    </div>
                  </div>
                )}

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Phần thêm / bớt (VNĐ) * 
                    <span className="text-xs text-slate-500 font-normal ml-2">(Nhập số âm để giảm)</span>
                  </label>
                  <input 
                    required 
                    type="number" 
                    step="1000" 
                    value={mappingFormData.additionalAmount} 
                    onChange={e => setMappingFormData({...mappingFormData, additionalAmount: Number(e.target.value)})} 
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm font-bold text-indigo-600" 
                  />
                </div>
                
                {mappingFormData.recordId && (
                  <div className="col-span-2 bg-indigo-50 p-3 rounded-md border border-indigo-100">
                    <div className="flex justify-between text-sm">
                      <span className="text-indigo-700 font-medium">Tổng cộng áp dụng:</span>
                      <span className="font-bold text-indigo-700">
                        {formatVND((records.find(r => r.id === mappingFormData.recordId)?.amount || 0) + (mappingFormData.additionalAmount || 0))}
                      </span>
                    </div>
                  </div>
                )}

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Ngày bắt đầu áp dụng *</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                      required 
                      type="date" 
                      value={mappingFormData.effectiveDate} 
                      onChange={e => setMappingFormData({...mappingFormData, effectiveDate: e.target.value})} 
                      className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md text-sm" 
                    />
                  </div>
                </div>
              </div>
              <div className="pt-4 flex justify-between items-center border-t border-slate-200 mt-6">
                {editingMappingItem ? (
                  <button 
                    type="button" 
                    onClick={() => { handleDeleteMapping(editingMappingItem.id); setIsMappingModalOpen(false); }} 
                    className="px-4 py-2 bg-white border border-red-300 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Xóa
                  </button>
                ) : <div></div>}
                <div className="flex gap-3">
                  <button type="button" onClick={() => setIsMappingModalOpen(false)} className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700">Hủy</button>
                  <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm font-medium">{editingMappingItem ? 'Cập nhật' : 'Lưu thiết lập'}</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
