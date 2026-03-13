import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, Briefcase } from 'lucide-react';

type Department = {
  id: string;
  code: string;
  name: string;
  manager: string;
  description: string;
};

const initialData: Department[] = [
  { id: '1', code: 'PB001', name: 'Ban Giám Đốc', manager: 'Nguyễn Văn Sếp', description: 'Điều hành chung' },
  { id: '2', code: 'PB002', name: 'Văn phòng', manager: 'Trần Thị Hành Chính', description: 'Hành chính nhân sự, Kế toán' },
  { id: '3', code: 'PB003', name: 'Kỹ thuật', manager: 'Lê Văn Kỹ', description: 'Bảo trì, IT, Vận hành' },
  { id: '4', code: 'PB004', name: 'Lái xe nâng', manager: 'Phạm Văn Lái', description: 'Đội xe nâng tại Cảng' },
];

export function Departments() {
  const [departments, setDepartments] = useState<Department[]>(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Department | null>(null);
  
  const [formData, setFormData] = useState<Partial<Department>>({
    code: '', name: '', manager: '', description: ''
  });

  const filteredData = departments.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (item?: Department) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({ code: '', name: '', manager: '', description: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      setDepartments(departments.map(item => item.id === editingItem.id ? { ...formData, id: item.id } as Department : item));
    } else {
      setDepartments([...departments, { ...formData, id: Date.now().toString() } as Department]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phòng ban này?')) {
      setDepartments(departments.filter(item => item.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Quản lý Phòng ban</h2>
          <p className="text-sm text-slate-500">Thiết lập danh sách phòng ban và người quản lý.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm phòng ban
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm phòng ban..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Mã PB</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Tên phòng ban</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Trưởng bộ phận</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Mô tả</th>
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
                    <Briefcase className="h-4 w-4 text-indigo-500 mr-2" />
                    {item.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{item.manager}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{item.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">
                {editingItem ? 'Cập nhật phòng ban' : 'Thêm phòng ban'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-500">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mã phòng ban *</label>
                <input required type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tên phòng ban *</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Trưởng bộ phận</label>
                <input type="text" value={formData.manager} onChange={e => setFormData({...formData, manager: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mô tả</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm" rows={3}></textarea>
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
