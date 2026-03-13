import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, Timer } from 'lucide-react';

type Shift = {
  id: string;
  code: string;
  name: string;
  startTime: string;
  endTime: string;
  department: string;
};

const initialData: Shift[] = [
  { id: '1', code: 'CA_HC', name: 'Ca Hành Chính', startTime: '08:00', endTime: '17:00', department: 'Văn phòng, Kỹ thuật' },
  { id: '2', code: 'CA_SANG', name: 'Ca Sáng', startTime: '06:00', endTime: '14:00', department: 'Lái xe nâng' },
  { id: '3', code: 'CA_CHIEU', name: 'Ca Chiều', startTime: '14:00', endTime: '22:00', department: 'Lái xe nâng' },
  { id: '4', code: 'CA_DEM', name: 'Ca Đêm', startTime: '22:00', endTime: '06:00', department: 'Lái xe nâng' },
];

export function Shifts() {
  const [shifts, setShifts] = useState<Shift[]>(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Shift | null>(null);
  
  const [formData, setFormData] = useState<Partial<Shift>>({
    code: '', name: '', startTime: '', endTime: '', department: ''
  });

  const filteredData = shifts.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (item?: Shift) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({ code: '', name: '', startTime: '', endTime: '', department: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      setShifts(shifts.map(item => item.id === editingItem.id ? { ...formData, id: item.id } as Shift : item));
    } else {
      setShifts([...shifts, { ...formData, id: Date.now().toString() } as Shift]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa ca làm việc này?')) {
      setShifts(shifts.filter(item => item.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Quản lý Ca làm việc</h2>
          <p className="text-sm text-slate-500">Thiết lập giờ làm việc chuẩn cho các bộ phận.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm ca làm việc
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm ca làm việc..."
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
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Mã Ca</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Tên Ca</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Giờ bắt đầu</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Giờ kết thúc</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Áp dụng cho</th>
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
                    <Timer className="h-4 w-4 text-indigo-500 mr-2" />
                    {item.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-mono">{item.startTime}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-mono">{item.endTime}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{item.department}</td>
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
                {editingItem ? 'Cập nhật ca làm việc' : 'Thêm ca làm việc'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-500">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mã ca *</label>
                <input required type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tên ca *</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Giờ bắt đầu *</label>
                  <input required type="time" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Giờ kết thúc *</label>
                  <input required type="time" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Áp dụng cho bộ phận</label>
                <input type="text" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} placeholder="VD: Văn phòng, Kỹ thuật..." className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm" />
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
