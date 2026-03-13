import React, { useState } from 'react';
import { MapPin, Building2, Plus, Search, Edit2, Trash2, X, Calendar, Clock, Navigation } from 'lucide-react';

type WorkLocation = {
  id: string;
  name: string; // Tên vị trí
  customerName: string;
  address: string;
  latitude: number;
  longitude: number;
  radius: number; // Bán kính cho phép chấm công GPS (mét)
  status: 'Active' | 'Inactive';
};

// Mock data
const initialLocations: WorkLocation[] = [
  {
    id: 'LOC001',
    name: 'Cảng Cát Lái',
    customerName: 'Tân Cảng Sài Gòn',
    address: 'Đường Nguyễn Thị Định, Cát Lái, Quận 2, TP.HCM',
    latitude: 10.7634,
    longitude: 106.7725,
    radius: 500,
    status: 'Active'
  },
  {
    id: 'LOC002',
    name: 'Cảng Hải Phòng',
    customerName: 'Cảng Hải Phòng JSC',
    address: 'Số 8A Trần Phú, Máy Tơ, Ngô Quyền, Hải Phòng',
    latitude: 20.8651,
    longitude: 106.6838,
    radius: 1000,
    status: 'Active'
  },
  {
    id: 'LOC003',
    name: 'Kho Lazada Tân Bình',
    customerName: 'Lazada Express',
    address: 'KCN Tân Bình, TP.HCM',
    latitude: 10.8231,
    longitude: 106.6297,
    radius: 300,
    status: 'Active'
  }
];

export function WorkLocations() {
  const [locations, setLocations] = useState<WorkLocation[]>(initialLocations);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WorkLocation | null>(null);
  
  const [formData, setFormData] = useState<Partial<WorkLocation>>({
    name: '',
    customerName: '',
    address: '',
    latitude: 0,
    longitude: 0,
    radius: 500,
    status: 'Active'
  });

  const filteredData = locations.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (item?: WorkLocation) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        customerName: '',
        address: '',
        latitude: 0,
        longitude: 0,
        radius: 500,
        status: 'Active'
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      setLocations(locations.map(item => item.id === editingItem.id ? { ...formData, id: item.id } as WorkLocation : item));
    } else {
      setLocations([...locations, { ...formData, id: `LOC${Date.now()}` } as WorkLocation]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa địa điểm này?')) {
      setLocations(locations.filter(item => item.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Vị trí chấm công</h2>
          <p className="text-sm text-slate-500">Quản lý tọa độ GPS chấm công và công chuẩn theo từng địa điểm.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm địa điểm
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm vị trí chấm công..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.map((loc) => (
          <div 
            key={loc.id} 
            className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleOpenModal(loc)}
          >
            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 line-clamp-1" title={loc.name}>{loc.name}</h3>
                    <p className="text-sm text-slate-500 line-clamp-1" title={loc.customerName}>{loc.customerName}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  loc.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'
                }`}>
                  {loc.status === 'Active' ? 'Hoạt động' : 'Tạm ngưng'}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2 text-sm text-slate-600">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-slate-400" />
                  <span className="line-clamp-2" title={loc.address}>{loc.address}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Navigation className="h-4 w-4 shrink-0 text-slate-400" />
                  <span>GPS: {loc.latitude}, {loc.longitude} (Bán kính: {loc.radius}m)</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0">
              <h3 className="text-lg font-semibold text-slate-900">
                {editingItem ? 'Cập nhật địa điểm' : 'Thêm địa điểm mới'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-500">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="locationForm" onSubmit={handleSave} className="space-y-6">
                
                {/* Thông tin chung */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-indigo-500" /> Thông tin chung
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Tên vị trí *</label>
                      <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm" placeholder="VD: Cảng Cát Lái" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Khách hàng (Tùy chọn)</label>
                      <input type="text" value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm" placeholder="VD: Tân Cảng Sài Gòn" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Địa chỉ</label>
                      <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm" placeholder="Địa chỉ chi tiết" />
                    </div>
                  </div>
                </div>

                {/* Tọa độ GPS */}
                <div className="pt-4 border-t border-slate-200">
                  <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-indigo-500" /> Thiết lập chấm công GPS
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Vĩ độ (Latitude) *</label>
                      <input required type="number" step="any" value={formData.latitude} onChange={e => setFormData({...formData, latitude: Number(e.target.value)})} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm" placeholder="10.7634" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Kinh độ (Longitude) *</label>
                      <input required type="number" step="any" value={formData.longitude} onChange={e => setFormData({...formData, longitude: Number(e.target.value)})} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm" placeholder="106.7725" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Bán kính cho phép (m) *</label>
                      <input required type="number" min="50" step="50" value={formData.radius} onChange={e => setFormData({...formData, radius: Number(e.target.value)})} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm" placeholder="500" />
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Nhân viên phải đứng trong bán kính này so với tọa độ trên để có thể chấm công thành công.</p>
                </div>

                {/* Trạng thái */}
                <div className="pt-4 border-t border-slate-200">
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Trạng thái</label>
                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as 'Active' | 'Inactive'})} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm">
                      <option value="Active">Hoạt động</option>
                      <option value="Inactive">Tạm ngưng</option>
                    </select>
                  </div>
                </div>

              </form>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 shrink-0 flex justify-between items-center bg-slate-50">
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
                <button type="submit" form="locationForm" className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium">{editingItem ? 'Cập nhật' : 'Thêm mới'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
