import React, { useState } from 'react';
import { Plus, Search, CheckCircle2, XCircle, Clock, FileText, Filter, ChevronRight } from 'lucide-react';

type RequestType = 'Leave' | 'BusinessTrip';
type RequestStatus = 'Pending_Manager' | 'Pending_HR' | 'Approved' | 'Rejected';

interface Request {
  id: string;
  employeeName: string;
  employeeCode: string;
  department: string;
  type: RequestType;
  startDate: string;
  endDate: string;
  reason: string;
  status: RequestStatus;
  createdAt: string;
}

const mockRequests: Request[] = [
  {
    id: 'REQ001',
    employeeName: 'Nguyễn Văn A',
    employeeCode: 'NV001',
    department: 'Văn phòng',
    type: 'Leave',
    startDate: '2026-03-05',
    endDate: '2026-03-06',
    reason: 'Nghỉ phép năm',
    status: 'Pending_Manager',
    createdAt: '2026-03-01T08:30:00',
  },
  {
    id: 'REQ002',
    employeeName: 'Trần Thị B',
    employeeCode: 'NV002',
    department: 'Kỹ thuật',
    type: 'BusinessTrip',
    startDate: '2026-03-10',
    endDate: '2026-03-12',
    reason: 'Công tác gặp đối tác tại Hà Nội',
    status: 'Pending_HR',
    createdAt: '2026-03-01T09:15:00',
  },
  {
    id: 'REQ003',
    employeeName: 'Lê Văn C',
    employeeCode: 'NV003',
    department: 'Lái xe nâng',
    type: 'Leave',
    startDate: '2026-02-28',
    endDate: '2026-02-28',
    reason: 'Việc gia đình',
    status: 'Approved',
    createdAt: '2026-02-25T14:20:00',
  },
];

const getTypeLabel = (type: RequestType) => {
  switch (type) {
    case 'Leave': return { label: 'Nghỉ phép', color: 'bg-blue-100 text-blue-800' };
    case 'BusinessTrip': return { label: 'Công tác', color: 'bg-purple-100 text-purple-800' };
  }
};

const getStatusLabel = (status: RequestStatus) => {
  switch (status) {
    case 'Pending_Manager': return { label: 'Chờ Quản lý duyệt', color: 'bg-slate-100 text-slate-800', icon: Clock };
    case 'Pending_HR': return { label: 'Chờ HR duyệt', color: 'bg-indigo-100 text-indigo-800', icon: Clock };
    case 'Approved': return { label: 'Đã duyệt', color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle2 };
    case 'Rejected': return { label: 'Từ chối', color: 'bg-red-100 text-red-800', icon: XCircle };
  }
};

export function Requests() {
  const [activeTab, setActiveTab] = useState<'my_requests' | 'to_approve'>('my_requests');
  const [requests, setRequests] = useState<Request[]>(mockRequests);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    type: 'Leave' as RequestType,
    startDate: '',
    endDate: '',
    reason: '',
  });

  // Current User Mock (Admin/Manager role for demo)
  const currentUser = {
    name: 'Admin User',
    code: 'AD001',
    department: 'Ban Giám Đốc',
    role: 'Manager'
  };

  const filteredRequests = requests.filter(req => {
    const matchesSearch = req.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          req.reason.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'my_requests') {
      // In a real app, filter by req.employeeCode === currentUser.code
      // For demo, we show all as "My Requests" if they match search
      return matchesSearch;
    } else {
      // To Approve: show pending requests
      return matchesSearch && (req.status === 'Pending_Manager' || req.status === 'Pending_HR');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRequest: Request = {
      id: `REQ${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      employeeName: currentUser.name,
      employeeCode: currentUser.code,
      department: currentUser.department,
      type: formData.type,
      startDate: formData.startDate,
      endDate: formData.endDate,
      reason: formData.reason,
      status: 'Pending_Manager',
      createdAt: new Date().toISOString(),
    };
    setRequests([newRequest, ...requests]);
    setIsModalOpen(false);
    setFormData({ type: 'Leave', startDate: '', endDate: '', reason: '' });
  };

  const handleApprove = (id: string) => {
    setRequests(requests.map(req => {
      if (req.id === id) {
        if (req.status === 'Pending_Manager') return { ...req, status: 'Pending_HR' };
        if (req.status === 'Pending_HR') return { ...req, status: 'Approved' };
      }
      return req;
    }));
  };

  const handleReject = (id: string) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: 'Rejected' } : req
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Nghỉ phép & Công tác</h2>
          <p className="text-sm text-slate-500">Quản lý đơn từ và quy trình duyệt đa cấp (Workflow).</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Tạo đơn mới
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('my_requests')}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'my_requests'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            Đơn của tôi
          </button>
          <button
            onClick={() => setActiveTab('to_approve')}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'to_approve'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            Cần duyệt
            {requests.filter(r => r.status === 'Pending_Manager' || r.status === 'Pending_HR').length > 0 && (
              <span className="ml-2 bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs">
                {requests.filter(r => r.status === 'Pending_Manager' || r.status === 'Pending_HR').length}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên nhân viên, lý do..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          />
        </div>
        <button className="inline-flex items-center px-3 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 w-full sm:w-auto justify-center">
          <Filter className="h-4 w-4 mr-2 text-slate-400" />
          Lọc nâng cao
        </button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((req) => {
            const typeInfo = getTypeLabel(req.type);
            const statusInfo = getStatusLabel(req.status);
            const StatusIcon = statusInfo.icon;

            return (
              <div key={req.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-5 w-5 text-slate-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-base font-semibold text-slate-900">{req.employeeName}</h4>
                        <span className="text-xs text-slate-500">({req.employeeCode})</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${typeInfo.color}`}>
                          {typeInfo.label}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{req.reason}</p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          {req.startDate} {req.endDate ? ` - ${req.endDate}` : ''}
                        </span>
                        <span>Phòng ban: {req.department}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end gap-3 border-t sm:border-t-0 border-slate-100 pt-4 sm:pt-0">
                    <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                      <StatusIcon className="h-3.5 w-3.5 mr-1.5" />
                      {statusInfo.label}
                    </div>
                    
                    {activeTab === 'to_approve' && (req.status === 'Pending_Manager' || req.status === 'Pending_HR') && (
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleReject(req.id)}
                          className="px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-md text-xs font-medium transition-colors"
                        >
                          Từ chối
                        </button>
                        <button 
                          onClick={() => handleApprove(req.id)}
                          className="px-3 py-1.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-md text-xs font-medium transition-colors"
                        >
                          Duyệt đơn
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Workflow Progress Bar */}
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between max-w-md">
                    <div className="flex flex-col items-center">
                      <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <span className="text-[10px] font-medium text-slate-500">Tạo đơn</span>
                    </div>
                    <div className={`flex-1 h-0.5 mx-2 ${req.status !== 'Pending_Manager' ? 'bg-emerald-200' : 'bg-slate-200'}`}></div>
                    <div className="flex flex-col items-center">
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center mb-1 ${
                        req.status === 'Pending_Manager' ? 'bg-indigo-100 text-indigo-600 ring-2 ring-indigo-100' : 
                        req.status === 'Rejected' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
                      }`}>
                        {req.status === 'Pending_Manager' ? <Clock className="h-4 w-4" /> : 
                         req.status === 'Rejected' ? <XCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                      </div>
                      <span className="text-[10px] font-medium text-slate-500">Quản lý</span>
                    </div>
                    <div className={`flex-1 h-0.5 mx-2 ${req.status === 'Approved' ? 'bg-emerald-200' : 'bg-slate-200'}`}></div>
                    <div className="flex flex-col items-center">
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center mb-1 ${
                        req.status === 'Approved' ? 'bg-emerald-100 text-emerald-600' : 
                        req.status === 'Pending_HR' ? 'bg-indigo-100 text-indigo-600 ring-2 ring-indigo-100' : 'bg-slate-100 text-slate-400'
                      }`}>
                        {req.status === 'Approved' ? <CheckCircle2 className="h-4 w-4" /> : 
                         req.status === 'Pending_HR' ? <Clock className="h-4 w-4" /> : <div className="h-2 w-2 rounded-full bg-slate-300" />}
                      </div>
                      <span className="text-[10px] font-medium text-slate-500">HR</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-white border border-slate-200 rounded-xl">
            <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-slate-900">Không có đơn từ nào</h3>
            <p className="text-sm text-slate-500 mt-1">Bạn chưa có đơn từ nào trong danh sách này.</p>
          </div>
        )}
      </div>

      {/* Create Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Tạo đơn mới</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-500">
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <form id="request-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Loại đơn *</label>
                  <select 
                    value={formData.type} 
                    onChange={e => setFormData({...formData, type: e.target.value as RequestType})} 
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="Leave">Nghỉ phép</option>
                    <option value="BusinessTrip">Công tác</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Từ ngày/giờ *</label>
                    <input 
                      required 
                      type="date" 
                      value={formData.startDate} 
                      onChange={e => setFormData({...formData, startDate: e.target.value})} 
                      className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Đến ngày/giờ *</label>
                    <input 
                      required 
                      type="date" 
                      value={formData.endDate} 
                      onChange={e => setFormData({...formData, endDate: e.target.value})} 
                      className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Lý do chi tiết *</label>
                  <textarea 
                    required 
                    rows={3}
                    value={formData.reason} 
                    onChange={e => setFormData({...formData, reason: e.target.value})} 
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500 resize-none" 
                    placeholder="Nhập lý do chi tiết..."
                  ></textarea>
                </div>
              </form>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                Hủy bỏ
              </button>
              <button type="submit" form="request-form" className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700 transition-colors">
                Gửi đơn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
