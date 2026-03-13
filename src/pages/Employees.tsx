import React, { useState, useRef } from 'react';
import { Plus, Upload, Download, Search, Edit2, Trash2, X, FileSpreadsheet, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';

type Employee = {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  status: 'Active' | 'Inactive';
  contractType: 'Probation' | 'Official' | 'Contractor';
  probationSalary: string;
  officialSalary: string;
};

const initialEmployees: Employee[] = [
  { id: '1', code: 'NV001', name: 'Nguyễn Văn A', email: 'nva@company.com', phone: '0901234567', department: 'Văn phòng', role: 'Kế toán', status: 'Active', contractType: 'Official', probationSalary: '8,500,000', officialSalary: '10,000,000' },
  { id: '2', code: 'NV002', name: 'Trần Thị B', email: 'ttb@company.com', phone: '0902345678', department: 'Kỹ thuật', role: 'Kỹ sư', status: 'Active', contractType: 'Probation', probationSalary: '12,000,000', officialSalary: '15,000,000' },
  { id: '3', code: 'NV003', name: 'Lê Văn C', email: 'lvc@company.com', phone: '0903456789', department: 'Lái xe nâng', role: 'Tài xế', status: 'Active', contractType: 'Official', probationSalary: '7,000,000', officialSalary: '8,500,000' },
];

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

export function Employees() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Employee>>({
    code: '', name: '', email: '', phone: '', department: 'Văn phòng', role: '', status: 'Active',
    contractType: 'Probation', probationSalary: '', officialSalary: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtered Data
  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handlers
  const handleOpenModal = (emp?: Employee) => {
    if (emp) {
      setEditingEmployee(emp);
      setFormData(emp);
    } else {
      setEditingEmployee(null);
      setFormData({ code: '', name: '', email: '', phone: '', department: 'Văn phòng', role: '', status: 'Active', contractType: 'Probation', probationSalary: '', officialSalary: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEmployee) {
      setEmployees(employees.map(emp => emp.id === editingEmployee.id ? { ...formData, id: emp.id } as Employee : emp));
    } else {
      const newEmp = { ...formData, id: Date.now().toString() } as Employee;
      setEmployees([...employees, newEmp]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
      setEmployees(employees.filter(emp => emp.id !== id));
    }
  };

  // Excel Import Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws) as any[];

      // Map Excel data to Employee type
      const importedEmployees: Employee[] = data.map((row, index) => ({
        id: `imported-${Date.now()}-${index}`,
        code: row['Mã NV'] || `NV${Math.floor(Math.random() * 1000)}`,
        name: row['Họ Tên'] || '',
        email: row['Email'] || '',
        phone: row['Số điện thoại'] || '',
        department: row['Phòng ban'] || 'Văn phòng',
        role: row['Chức vụ'] || 'Nhân viên',
        status: row['Trạng thái'] === 'Nghỉ việc' ? 'Inactive' : 'Active',
        contractType: row['Loại hợp đồng'] === 'Chính thức' ? 'Official' : row['Loại hợp đồng'] === 'Hợp đồng khoán' ? 'Contractor' : 'Probation',
        probationSalary: row['Lương thử việc'] || '',
        officialSalary: row['Lương chính thức'] || '',
      }));

      setEmployees([...employees, ...importedEmployees]);
      setIsImportModalOpen(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      alert(`Đã import thành công ${importedEmployees.length} nhân viên!`);
    };
    reader.readAsBinaryString(file);
  };

  const handleExport = () => {
    const exportData = employees.map(emp => ({
      'Mã NV': emp.code,
      'Họ Tên': emp.name,
      'Email': emp.email,
      'Số điện thoại': emp.phone,
      'Phòng ban': emp.department,
      'Chức vụ': emp.role,
      'Trạng thái': emp.status === 'Active' ? 'Đang làm việc' : 'Nghỉ việc',
      'Loại hợp đồng': emp.contractType === 'Official' ? 'Chính thức' : emp.contractType === 'Contractor' ? 'Hợp đồng khoán' : 'Thử việc',
      'Lương thử việc': emp.probationSalary,
      'Lương chính thức': emp.officialSalary
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "NhanVien");
    XLSX.writeFile(wb, "DanhSachNhanVien.xlsx");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Danh sách nhân viên</h2>
          <p className="text-sm text-slate-500">Quản lý danh sách, thông tin chi tiết và hồ sơ nhân viên.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => setIsImportModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import Excel
          </button>
          <button 
            onClick={handleExport}
            className="inline-flex items-center px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button 
            onClick={() => handleOpenModal()}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm nhân viên
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, mã NV, phòng ban..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-sm text-slate-500 font-medium whitespace-nowrap">Tổng số:</span>
          <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">{filteredEmployees.length}</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Mã NV</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Họ Tên</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Liên hệ</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Phòng ban / Chức vụ</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => (
                  <tr 
                    key={emp.id} 
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => handleOpenModal(emp)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{emp.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs mr-3">
                          {emp.name.charAt(0)}
                        </div>
                        <div className="text-sm font-medium text-slate-900">{emp.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">{emp.email}</div>
                      <div className="text-xs text-slate-500">{emp.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">{emp.department}</div>
                      <div className="text-xs text-slate-500">{emp.role}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        emp.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {emp.status === 'Active' ? 'Đang làm việc' : 'Nghỉ việc'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-slate-500">
                    Không tìm thấy nhân viên nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">
                {editingEmployee ? 'Cập nhật thông tin nhân viên' : 'Thêm nhân viên mới'}
              </h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-500">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <form id="employee-form" onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Mã nhân viên *</label>
                    <input required type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="VD: NV001" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Họ và tên *</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="Nguyễn Văn A" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                    <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="email@company.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Số điện thoại</label>
                    <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="0901234567" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phòng ban *</label>
                    <select value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500">
                      <option value="Văn phòng">Văn phòng</option>
                      <option value="Kỹ thuật">Kỹ thuật</option>
                      <option value="Lái xe nâng">Lái xe nâng</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Chức vụ</label>
                    <select 
                      value={formData.role} 
                      onChange={e => setFormData({...formData, role: e.target.value})} 
                      className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">-- Chọn chức vụ --</option>
                      {POSITIONS.map(pos => (
                        <option key={pos} value={pos}>{pos}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Trạng thái</label>
                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as 'Active' | 'Inactive'})} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500">
                      <option value="Active">Đang làm việc</option>
                      <option value="Inactive">Nghỉ việc</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Loại hợp đồng</label>
                    <select value={formData.contractType} onChange={e => setFormData({...formData, contractType: e.target.value as any})} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500">
                      <option value="Probation">Thử việc</option>
                      <option value="Official">Chính thức</option>
                      <option value="Contractor">Hợp đồng khoán</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Lương thử việc</label>
                    <input type="text" value={formData.probationSalary} onChange={e => setFormData({...formData, probationSalary: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="VD: 8,000,000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Lương chính thức</label>
                    <input type="text" value={formData.officialSalary} onChange={e => setFormData({...formData, officialSalary: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="VD: 10,000,000" />
                  </div>
                </div>
              </form>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
              {editingEmployee ? (
                <button 
                  type="button" 
                  onClick={() => { handleDelete(editingEmployee.id); handleCloseModal(); }} 
                  className="px-4 py-2 bg-white border border-red-300 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  Xóa
                </button>
              ) : <div></div>}
              <div className="flex gap-3">
                <button onClick={handleCloseModal} className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                  Hủy bỏ
                </button>
                <button type="submit" form="employee-form" className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700 transition-colors">
                  {editingEmployee ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Import dữ liệu nhân viên</h3>
              <button onClick={() => setIsImportModalOpen(false)} className="text-slate-400 hover:text-slate-500">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg p-8 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <FileSpreadsheet className="h-10 w-10 text-indigo-500 mb-3" />
                <p className="text-sm font-medium text-slate-900">Nhấn để chọn file Excel (.xlsx, .xls)</p>
                <p className="text-xs text-slate-500 mt-1">Hoặc kéo thả file vào đây</p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  accept=".xlsx, .xls, .csv" 
                  className="hidden" 
                />
              </div>
              
              <div className="mt-4 bg-blue-50 border border-blue-100 rounded-md p-3 flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-blue-800">
                  <p className="font-medium mb-1">Lưu ý định dạng cột:</p>
                  <p>Mã NV, Họ Tên, Email, Số điện thoại, Phòng ban, Chức vụ, Trạng thái (Đang làm việc/Nghỉ việc), Loại hợp đồng (Thử việc/Chính thức/Hợp đồng khoán), Lương thử việc, Lương chính thức.</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button onClick={() => setIsImportModalOpen(false)} className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
