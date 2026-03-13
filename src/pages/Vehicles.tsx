import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Truck, MapPin, AlertCircle, X, Calendar, Coins, Clock } from 'lucide-react';

// Mock data for locations (Cảng/Khách hàng) to use in the select dropdown
const MOCK_LOCATIONS = [
  { id: '1', name: 'Cảng Cát Lái', customer: 'Tân Cảng Sài Gòn' },
  { id: '2', name: 'Cảng Hải Phòng', customer: 'Cảng Hải Phòng JSC' },
  { id: '3', name: 'Kho Logistics Bình Dương', customer: 'Gemadept' },
];

const MOCK_SHIFTS = [
  { id: 'S1', name: 'Ca Hành chính (08:00 - 17:00)' },
  { id: 'S2', name: 'Ca Sáng (06:00 - 14:00)' },
  { id: 'S3', name: 'Ca Chiều (14:00 - 22:00)' },
  { id: 'S4', name: 'Ca Đêm (22:00 - 06:00)' },
];

const MOCK_ALLOWANCES = [
  { id: '1', code: 'PC_ANTRUA', name: 'Phụ cấp ăn trưa', type: 'Allowance', amount: 730000 },
  { id: '2', code: 'PC_XANGXE', name: 'Phụ cấp xăng xe', type: 'Allowance', amount: 500000 },
  { id: '3', code: 'PC_DIENTHOAI', name: 'Phụ cấp điện thoại', type: 'Allowance', amount: 300000 },
  { id: '4', code: 'PC_TRACHNHIEM', name: 'Phụ cấp trách nhiệm', type: 'Allowance', amount: 2000000 },
  { id: '5', code: 'GT_CONGDOAN', name: 'Phí công đoàn', type: 'Deduction', amount: 50000 },
];

interface VehicleAllowance {
  allowanceId: string;
  additionalAmount: number | string;
}

interface Vehicle {
  id: string;
  plateNumber: string;
  name: string;
  locationId: string;
  shiftId: string;
  salaryMethod: 'production' | 'monthly';
  allowances: VehicleAllowance[];
  standardWorkdaysType: 'Fixed' | 'Administrative';
  fixedWorkdays?: number; // Nếu là cố định (vd: 26 ngày)
  status: 'active' | 'maintenance' | 'inactive';
  description: string;
}

const MOCK_VEHICLES: Vehicle[] = [
  {
    id: '1',
    plateNumber: '51C-123.45',
    name: 'Xe Tải 5 Tấn',
    locationId: '1',
    shiftId: 'S1',
    salaryMethod: 'monthly',
    allowances: [{ allowanceId: '2', additionalAmount: 0 }],
    standardWorkdaysType: 'Fixed',
    fixedWorkdays: 26,
    status: 'active',
    description: 'Chuyên chở hàng nhẹ',
  },
  {
    id: '2',
    plateNumber: '29C-678.90',
    name: 'Xe Đầu Kéo Container',
    locationId: '2',
    shiftId: 'S4',
    salaryMethod: 'production',
    allowances: [{ allowanceId: '4', additionalAmount: 500000 }],
    standardWorkdaysType: 'Administrative',
    status: 'active',
    description: 'Chạy tuyến dài',
  },
  {
    id: '3',
    plateNumber: '61C-345.67',
    name: 'Xe Nâng',
    locationId: '3',
    shiftId: 'S2',
    salaryMethod: 'monthly',
    allowances: [],
    standardWorkdaysType: 'Fixed',
    fixedWorkdays: 24,
    status: 'maintenance',
    description: 'Đang bảo dưỡng định kỳ',
  },
];

export function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState<Partial<Vehicle>>({
    plateNumber: '',
    name: '',
    locationId: '',
    shiftId: '',
    salaryMethod: 'monthly',
    allowances: [],
    standardWorkdaysType: 'Fixed',
    fixedWorkdays: 26,
    status: 'active',
    description: '',
  });

  const fetchVehicles = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/vehicles');
      if (response.ok) {
        const data = await response.json();
        setVehicles(data);
      }
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleOpenModal = (vehicle?: Vehicle) => {
    if (vehicle) {
      setEditingVehicle(vehicle);
      setFormData(vehicle);
    } else {
      setEditingVehicle(null);
      setFormData({
        plateNumber: '',
        name: '',
        locationId: '',
        shiftId: '',
        salaryMethod: 'monthly',
        allowances: [],
        standardWorkdaysType: 'Fixed',
        fixedWorkdays: 26,
        status: 'active',
        description: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingVehicle(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingVehicle) {
        const response = await fetch(`/api/vehicles/${editingVehicle.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, id: editingVehicle.id }),
        });
        if (response.ok) {
          await fetchVehicles();
          handleCloseModal();
        }
      } else {
        const newId = Math.random().toString(36).substr(2, 9);
        const response = await fetch('/api/vehicles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, id: newId }),
        });
        if (response.ok) {
          await fetchVehicles();
          handleCloseModal();
        }
      }
    } catch (error) {
      console.error('Failed to save vehicle:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa mã chấm công này?')) {
      try {
        const response = await fetch(`/api/vehicles/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          await fetchVehicles();
        }
      } catch (error) {
        console.error('Failed to delete vehicle:', error);
      }
    }
  };

  const filteredVehicles = vehicles.filter(
    (v) =>
      v.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLocationName = (locationId: string) => {
    const loc = MOCK_LOCATIONS.find((l) => l.id === locationId);
    return loc ? `${loc.name} (${loc.customer})` : 'Chưa phân bổ';
  };

  const getShiftName = (shiftId: string) => {
    const shift = MOCK_SHIFTS.find((s) => s.id === shiftId);
    return shift ? shift.name : 'Chưa phân bổ';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Mã chấm công</h2>
          <p className="text-sm text-slate-500 mt-1">
            Quản lý danh sách mã chấm công, phân bổ theo vị trí và thiết lập phụ cấp đặc thù.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Thêm mã chấm công
        </button>
      </div>

      <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <div className="relative flex-1 max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-md border-slate-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 border"
            placeholder="Tìm kiếm theo mã chấm công..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-slate-200 sm:rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Mã chấm công
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Vị trí chấm công
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Ca làm việc
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Hình thức lương
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Công chuẩn
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                Trạng thái
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : filteredVehicles.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-500">
                  Không tìm thấy mã chấm công nào.
                </td>
              </tr>
            ) : (
              filteredVehicles.map((vehicle) => (
                <tr 
                  key={vehicle.id} 
                  className="hover:bg-slate-50 cursor-pointer"
                  onClick={() => handleOpenModal(vehicle)}
                >
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center">
                        <Truck className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-slate-900">{vehicle.plateNumber}</div>
                        <div className="text-sm text-slate-500">{vehicle.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center text-sm text-slate-900">
                      <MapPin className="mr-1.5 h-4 w-4 text-slate-400" />
                      {getLocationName(vehicle.locationId)}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center text-sm text-slate-900">
                      <Clock className="mr-1.5 h-4 w-4 text-slate-400" />
                      {getShiftName(vehicle.shiftId)}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center text-sm text-slate-900">
                      <Coins className="mr-1.5 h-4 w-4 text-slate-400" />
                      {vehicle.salaryMethod === 'production' ? 'Sản lượng' : 'Lương tháng'}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center text-sm text-slate-900">
                      <Calendar className="mr-1.5 h-4 w-4 text-slate-400" />
                      {vehicle.standardWorkdaysType === 'Fixed' ? `${vehicle.fixedWorkdays} ngày` : 'Theo hành chính'}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        vehicle.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : vehicle.status === 'maintenance'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {vehicle.status === 'active'
                        ? 'Đang hoạt động'
                        : vehicle.status === 'maintenance'
                        ? 'Bảo dưỡng'
                        : 'Ngừng hoạt động'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Thêm/Sửa */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">
                {editingVehicle ? 'Cập nhật mã chấm công' : 'Thêm mã chấm công mới'}
              </h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-500">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[calc(100vh-10rem)] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mã chấm công *</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.plateNumber}
                  onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                  placeholder="VD: MC001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tên / Loại mã *</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="VD: Xe Tải 5 Tấn"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Vị trí chấm công phân bổ</label>
                  <select
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.locationId}
                    onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
                  >
                    <option value="">-- Chọn vị trí chấm công --</option>
                    {MOCK_LOCATIONS.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name} ({loc.customer})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Ca làm việc</label>
                  <select
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.shiftId}
                    onChange={(e) => setFormData({ ...formData, shiftId: e.target.value })}
                  >
                    <option value="">-- Chọn ca làm việc --</option>
                    {MOCK_SHIFTS.map((shift) => (
                      <option key={shift.id} value={shift.id}>
                        {shift.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Hình thức tính lương *</label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.salaryMethod || 'monthly'}
                    onChange={(e) => setFormData({ ...formData, salaryMethod: e.target.value as 'production' | 'monthly' })}
                  >
                    <option value="monthly">Lương tháng</option>
                    <option value="production">Sản lượng</option>
                  </select>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-200">
                <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-indigo-500" /> Thiết lập Công chuẩn
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Loại công chuẩn *</label>
                    <select 
                      required 
                      value={formData.standardWorkdaysType} 
                      onChange={e => setFormData({...formData, standardWorkdaysType: e.target.value as 'Fixed' | 'Administrative'})} 
                      className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Fixed">Cố định</option>
                      <option value="Administrative">Theo hành chính (Trừ Chủ nhật)</option>
                    </select>
                  </div>
                  
                  {formData.standardWorkdaysType === 'Fixed' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Số ngày công chuẩn *</label>
                      <input 
                        required 
                        type="number" 
                        min="1" 
                        max="31"
                        step="0.5"
                        value={formData.fixedWorkdays} 
                        onChange={e => setFormData({...formData, fixedWorkdays: Number(e.target.value)})} 
                        className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <Coins className="h-4 w-4 text-indigo-500" /> Phụ cấp & Giảm trừ
                  </h4>
                  <button
                    type="button"
                    onClick={() => setFormData({
                      ...formData,
                      allowances: [...(formData.allowances || []), { allowanceId: '', additionalAmount: 0 }]
                    })}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center"
                  >
                    <Plus className="h-3 w-3 mr-1" /> Thêm khoản
                  </button>
                </div>
                
                <div className="space-y-2">
                  <p className="text-[11px] text-slate-500 mb-2">
                    Nhập số dương để cộng thêm, số âm để giảm đi so với mức mặc định.
                  </p>
                  {(formData.allowances || []).map((allowance, index) => (
                    <div key={index} className="flex items-center gap-2 bg-slate-50 p-2 rounded-md border border-slate-200">
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        <select
                          className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          value={allowance.allowanceId}
                          onChange={(e) => {
                            const newAllowances = [...(formData.allowances || [])];
                            newAllowances[index].allowanceId = e.target.value;
                            setFormData({ ...formData, allowances: newAllowances });
                          }}
                        >
                          <option value="">-- Chọn khoản mục --</option>
                          {MOCK_ALLOWANCES.map(a => (
                            <option key={a.id} value={a.id}>
                              {a.name} ({a.type === 'Allowance' ? '+' : '-'}{formatCurrency(a.amount)})
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          value={
                            allowance.additionalAmount === 0 || allowance.additionalAmount === ''
                              ? ''
                              : allowance.additionalAmount === '-'
                              ? '-'
                              : new Intl.NumberFormat('vi-VN').format(Number(allowance.additionalAmount))
                          }
                          onChange={(e) => {
                            const rawValue = e.target.value.replace(/\./g, '');
                            const newAllowances = [...(formData.allowances || [])];
                            if (rawValue === '' || rawValue === '-') {
                              newAllowances[index].additionalAmount = rawValue;
                            } else {
                              const parsed = parseInt(rawValue, 10);
                              newAllowances[index].additionalAmount = isNaN(parsed) ? 0 : parsed;
                            }
                            setFormData({ ...formData, allowances: newAllowances });
                          }}
                          placeholder="Điều chỉnh (VNĐ)..."
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newAllowances = [...(formData.allowances || [])];
                          newAllowances.splice(index, 1);
                          setFormData({ ...formData, allowances: newAllowances });
                        }}
                        className="text-slate-400 hover:text-red-500 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {(!formData.allowances || formData.allowances.length === 0) && (
                    <p className="text-sm text-slate-500 italic text-center py-2">Chưa có khoản phụ cấp/giảm trừ nào.</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Trạng thái</label>
                <select
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                >
                  <option value="active">Đang hoạt động</option>
                  <option value="maintenance">Đang bảo dưỡng</option>
                  <option value="inactive">Ngừng hoạt động</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ghi chú</label>
                <textarea
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                {editingVehicle ? (
                  <button
                    type="button"
                    onClick={() => {
                      handleDelete(editingVehicle.id);
                      handleCloseModal();
                    }}
                    className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Xóa
                  </button>
                ) : (
                  <div></div>
                )}
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {editingVehicle ? 'Cập nhật' : 'Thêm mới'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
