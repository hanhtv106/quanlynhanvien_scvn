import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, Medal, AlertTriangle, User } from 'lucide-react';

type RecordType = 'Reward' | 'Discipline';

type RewardDiscipline = {
  id: string;
  employeeCode: string;
  employeeName: string;
  type: RecordType;
  reason: string;
  amount: number;
  date: string;
  decisionNumber: string;
  status: 'Approved' | 'Pending' | 'Rejected';
};

const initialData: RewardDiscipline[] = [
  { id: '1', employeeCode: 'NV001', employeeName: 'Nguyễn Văn A', type: 'Reward', reason: 'Hoàn thành xuất sắc dự án Q1', amount: 5000000, date: '2024-03-15', decisionNumber: 'QD01/KT', status: 'Approved' },
  { id: '2', employeeCode: 'NV002', employeeName: 'Trần Thị B', type: 'Discipline', reason: 'Vi phạm nội quy công ty (đi muộn 3 lần/tháng)', amount: 500000, date: '2024-04-05', decisionNumber: 'QD02/KL', status: 'Approved' },
  { id: '3', employeeCode: 'NV003', employeeName: 'Lê Văn C', type: 'Reward', reason: 'Nhân viên xuất sắc tháng 4', amount: 2000000, date: '2024-05-02', decisionNumber: 'QD03/KT', status: 'Pending' },
];

// Mock employee list for the dropdown
const mockEmployees = [
  { code: 'NV001', name: 'Nguyễn Văn A' },
  { code: 'NV002', name: 'Trần Thị B' },
  { code: 'NV003', name: 'Lê Văn C' },
];

const formatVND = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export function RewardsDisciplines() {
  const [records, setRecords] = useState<RewardDiscipline[]>(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'All' | RecordType>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RewardDiscipline | null>(null);
  
  const [formData, setFormData] = useState<Partial<RewardDiscipline>>({
    employeeCode: 'NV001', employeeName: 'Nguyễn Văn A', type: 'Reward', reason: '', amount: 0, date: '', decisionNumber: '', status: 'Pending'
  });

  const filteredData = records.filter(item => {
    const matchesSearch = item.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.decisionNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleOpenModal = (item?: RewardDiscipline) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({ employeeCode: mockEmployees[0].code, employeeName: mockEmployees[0].name, type: 'Reward', reason: '', amount: 0, date: '', decisionNumber: '', status: 'Pending' });
    }
    setIsModalOpen(true);
  };

  const handleEmployeeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedEmp = mockEmployees.find(emp => emp.code === e.target.value);
    if (selectedEmp) {
      setFormData({ ...formData, employeeCode: selectedEmp.code, employeeName: selectedEmp.name });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      setRecords(records.map(item => item.id === editingItem.id ? { ...formData, id: item.id } as RewardDiscipline : item));
    } else {
      setRecords([...records, { ...formData, id: Date.now().toString() } as RewardDiscipline]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bản ghi này?')) {
      setRecords(records.filter(item => item.id !== id));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">Đã duyệt</span>;
      case 'Pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Chờ duyệt</span>;
      case 'Rejected':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Từ chối</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Khen thưởng & Kỷ luật</h2>
          <p className="text-sm text-slate-500">Quản lý các quyết định khen thưởng, kỷ luật của nhân viên.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm quyết định
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên NV, mã NV hoặc số QĐ..."
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
            onClick={() => setFilterType('Reward')}
            className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium border-t border-b border-r border-slate-300 ${filterType === 'Reward' ? 'bg-emerald-50 text-emerald-600 border-emerald-500 z-10' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
          >
            Khen thưởng
          </button>
          <button
            onClick={() => setFilterType('Discipline')}
            className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium border-t border-b border-r border-slate-300 rounded-r-md ${filterType === 'Discipline' ? 'bg-red-50 text-red-600 border-red-500 z-10' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
          >
            Kỷ luật
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Số QĐ / Ngày</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Nhân viên</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Loại</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Lý do</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Số tiền (VNĐ)</th>
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">{item.decisionNumber}</div>
                    <div className="text-xs text-slate-500">{item.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-slate-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-slate-900">{item.employeeName}</div>
                        <div className="text-xs text-slate-500">{item.employeeCode}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.type === 'Reward' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        <Medal className="w-3 h-3 mr-1" /> Khen thưởng
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <AlertTriangle className="w-3 h-3 mr-1" /> Kỷ luật
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate" title={item.reason}>{item.reason}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${item.type === 'Reward' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {item.type === 'Reward' ? '+' : '-'}{formatVND(item.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(item.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">
                {editingItem ? 'Cập nhật Quyết định' : 'Thêm Quyết định mới'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-500">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nhân viên *</label>
                  <select 
                    required 
                    value={formData.employeeCode} 
                    onChange={handleEmployeeChange} 
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                    disabled={!!editingItem}
                  >
                    {mockEmployees.map(emp => (
                      <option key={emp.code} value={emp.code}>{emp.code} - {emp.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Loại quyết định *</label>
                  <select 
                    required 
                    value={formData.type} 
                    onChange={e => setFormData({...formData, type: e.target.value as RecordType})} 
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                  >
                    <option value="Reward">Khen thưởng</option>
                    <option value="Discipline">Kỷ luật</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Số quyết định *</label>
                  <input required type="text" value={formData.decisionNumber} onChange={e => setFormData({...formData, decisionNumber: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm" placeholder="VD: QD01/2024" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Ngày quyết định *</label>
                  <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Số tiền (VNĐ) *</label>
                  <input required type="number" min="0" step="1000" value={formData.amount} onChange={e => setFormData({...formData, amount: Number(e.target.value)})} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm" placeholder="VD: 500000" />
                  <p className="mt-1 text-xs text-slate-500">Số tiền này sẽ được cộng (nếu thưởng) hoặc trừ (nếu phạt) vào lương tháng tương ứng.</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Lý do *</label>
                  <textarea required rows={3} value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm resize-none" placeholder="Nhập lý do khen thưởng/kỷ luật..." />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Trạng thái duyệt</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as 'Approved' | 'Pending' | 'Rejected'})} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm">
                    <option value="Pending">Chờ duyệt</option>
                    <option value="Approved">Đã duyệt</option>
                    <option value="Rejected">Từ chối</option>
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
    </div>
  );
}
