import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, Award } from 'lucide-react';

type Position = {
  id: string;
  code: string;
  name: string;
  level: string;
  description: string;
  status: 'Active' | 'Inactive';
};

const initialData: Position[] = [
  { id: '1', code: 'POS_DIR', name: 'Giám đốc', level: 'Quản lý cấp cao', description: 'Điều hành toàn bộ hoạt động công ty', status: 'Active' },
  { id: '2', code: 'POS_MGR', name: 'Trưởng phòng', level: 'Quản lý cấp trung', description: 'Quản lý phòng ban chuyên môn', status: 'Active' },
  { id: '3', code: 'POS_STF', name: 'Nhân viên', level: 'Nhân viên', description: 'Thực hiện công việc chuyên môn', status: 'Active' },
  { id: '4', code: 'POS_INT', name: 'Thực tập sinh', level: 'Thực tập sinh', description: 'Hỗ trợ công việc và học việc', status: 'Active' },
];

export function Positions() {
  const [positions, setPositions] = useState<Position[]>(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Position | null>(null);
  
  const [formData, setFormData] = useState<Partial<Position>>({
    code: '', name: '', level: 'Nhân viên', description: '', status: 'Active'
  });

  const filteredData = positions.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (item?: Position) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({ code: '', name: '', level: 'Nhân viên', description: '', status: 'Active' });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      setPositions(positions.map(item => item.id === editingItem.id ? { ...formData, id: item.id } as Position : item));
    } else {
      setPositions([...positions, { ...formData, id: Date.now().toString() } as Position]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa chức vụ này?')) {
      setPositions(positions.filter(item => item.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Quản lý Chức vụ</h2>
          <p className="text-sm text-slate-500">Thiết lập danh mục chức danh và cấp bậc trong công ty.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm chức vụ
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm chức vụ..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Mã CV</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Tên chức vụ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Cấp bậc</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Mô tả</th>
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
                      <Award className="h-4 w-4 text-indigo-500 mr-2" />
                      {item.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{item.level}</td>
                  <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate" title={item.description}>{item.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">
                {editingItem ? 'Cập nhật chức vụ' : 'Thêm chức vụ'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-500">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mã chức vụ *</label>
                <input required type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm" placeholder="VD: POS_MGR" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tên chức vụ *</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm" placeholder="VD: Trưởng phòng" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Cấp bậc</label>
                <select value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm">
                  <option value="Quản lý cấp cao">Quản lý cấp cao</option>
                  <option value="Quản lý cấp trung">Quản lý cấp trung</option>
                  <option value="Nhân viên">Nhân viên</option>
                  <option value="Thực tập sinh">Thực tập sinh</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mô tả</label>
                <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm resize-none" placeholder="Mô tả công việc chung..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Trạng thái</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as 'Active' | 'Inactive'})} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm">
                  <option value="Active">Hoạt động</option>
                  <option value="Inactive">Ngừng sử dụng</option>
                </select>
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
