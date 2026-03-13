import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, Baby, User } from 'lucide-react';

type Dependent = {
  id: string;
  employeeCode: string;
  employeeName: string;
  fullName: string;
  relationship: string;
  dob: string;
  taxCode: string;
  status: 'Approved' | 'Pending' | 'Rejected';
};

const initialData: Dependent[] = [
  { id: '1', employeeCode: 'NV001', employeeName: 'Nguyễn Văn A', fullName: 'Nguyễn Văn A1', relationship: 'Con ruột', dob: '2015-05-10', taxCode: '1234567890', status: 'Approved' },
  { id: '2', employeeCode: 'NV003', employeeName: 'Lê Văn C', fullName: 'Lê Thị C1', relationship: 'Vợ', dob: '1990-02-20', taxCode: '0987654321', status: 'Approved' },
  { id: '3', employeeCode: 'NV003', employeeName: 'Lê Văn C', fullName: 'Lê Văn C2', relationship: 'Con ruột', dob: '2020-11-15', taxCode: '', status: 'Pending' },
];

// Mock employee list for the dropdown
const mockEmployees = [
  { code: 'NV001', name: 'Nguyễn Văn A' },
  { code: 'NV002', name: 'Trần Thị B' },
  { code: 'NV003', name: 'Lê Văn C' },
];

export function Dependents() {
  const [dependents, setDependents] = useState<Dependent[]>(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Dependent | null>(null);
  
  const [formData, setFormData] = useState<Partial<Dependent>>({
    employeeCode: 'NV001', employeeName: 'Nguyễn Văn A', fullName: '', relationship: 'Con ruột', dob: '', taxCode: '', status: 'Pending'
  });

  const filteredData = dependents.filter(item => 
    item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.employeeCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (item?: Dependent) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({ employeeCode: mockEmployees[0].code, employeeName: mockEmployees[0].name, fullName: '', relationship: 'Con ruột', dob: '', taxCode: '', status: 'Pending' });
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
      setDependents(dependents.map(item => item.id === editingItem.id ? { ...formData, id: item.id } as Dependent : item));
    } else {
      setDependents([...dependents, { ...formData, id: Date.now().toString() } as Dependent]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người phụ thuộc này?')) {
      setDependents(dependents.filter(item => item.id !== id));
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
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Người phụ thuộc</h2>
          <p className="text-sm text-slate-500">Quản lý danh sách người phụ thuộc của nhân viên để tính giảm trừ gia cảnh.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm người phụ thuộc
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên NV hoặc tên người phụ thuộc..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Người phụ thuộc</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Quan hệ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Ngày sinh</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Mã số thuế</th>
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
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-slate-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-slate-900">{item.employeeName}</div>
                        <div className="text-xs text-slate-500">{item.employeeCode}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    <div className="flex items-center">
                      <Baby className="h-4 w-4 text-indigo-500 mr-2" />
                      {item.fullName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{item.relationship}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{item.dob}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{item.taxCode || '---'}</td>
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
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">
                {editingItem ? 'Cập nhật người phụ thuộc' : 'Thêm người phụ thuộc'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-500">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nhân viên *</label>
                <select 
                  required 
                  value={formData.employeeCode} 
                  onChange={handleEmployeeChange} 
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                  disabled={!!editingItem} // Không cho đổi nhân viên khi đang edit
                >
                  {mockEmployees.map(emp => (
                    <option key={emp.code} value={emp.code}>{emp.code} - {emp.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tên người phụ thuộc *</label>
                <input required type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm" placeholder="Nhập họ tên..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Quan hệ *</label>
                  <select required value={formData.relationship} onChange={e => setFormData({...formData, relationship: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm">
                    <option value="Con ruột">Con ruột</option>
                    <option value="Con nuôi">Con nuôi</option>
                    <option value="Vợ">Vợ</option>
                    <option value="Chồng">Chồng</option>
                    <option value="Cha/Mẹ">Cha/Mẹ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Ngày sinh *</label>
                  <input required type="date" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mã số thuế (nếu có)</label>
                <input type="text" value={formData.taxCode} onChange={e => setFormData({...formData, taxCode: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm" placeholder="Nhập MST..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Trạng thái duyệt</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as 'Approved' | 'Pending' | 'Rejected'})} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm">
                  <option value="Pending">Chờ duyệt</option>
                  <option value="Approved">Đã duyệt</option>
                  <option value="Rejected">Từ chối</option>
                </select>
                <p className="mt-1 text-xs text-slate-500">Chỉ những người phụ thuộc "Đã duyệt" mới được tính giảm trừ gia cảnh.</p>
              </div>
              <div className="pt-4 flex justify-between items-center">
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
