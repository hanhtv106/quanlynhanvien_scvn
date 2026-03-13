import React, { useState, useRef } from 'react';
import { Plus, Search, Edit2, Trash2, X, FileText, Save, Eye, User, Calendar, History, Briefcase, Banknote, Printer } from 'lucide-react';
import { cn } from '../lib/utils';

type ContractTemplate = {
  id: string;
  name: string;
  type: string;
  content: string;
  lastModified: string;
};

type Contract = {
  id: string;
  employeeName: string;
  employeeCode: string;
  templateName: string;
  type: string;
  signDate: string;
  status: 'Active' | 'Expired' | 'Draft';
};

const initialTemplates: ContractTemplate[] = [
  { 
    id: '1', 
    name: 'Hợp đồng lao động chính thức', 
    type: 'Chính thức', 
    content: `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
---
HỢP ĐỒNG LAO ĐỘNG
Số: {{contract_no}}/HĐLĐ

Chúng tôi, một bên là (Người sử dụng lao động):
Tên Công ty: {{company_name}}
Địa chỉ: {{company_address}}
Đại diện bởi Ông/Bà: {{company_rep}}
Chức vụ: {{company_rep_role}}

Và một bên là (Người lao động):
Ông/Bà: {{name}}
Ngày sinh: {{birthDate}}
Số CCCD/CMND: {{identityCard}}
Địa chỉ thường trú: {{address}}

Thỏa thuận ký kết Hợp đồng lao động với các điều khoản sau đây:

ĐIỀU 1: CÔNG VIỆC VÀ ĐỊA ĐIỂM LÀM VIỆC
- Vị trí chuyên môn: {{role}}
- Bộ phận: {{department}}
- Địa điểm làm việc: {{work_location}}

ĐIỀU 2: THỜI HẠN HỢP ĐỒNG
- Loại hợp đồng: Hợp đồng lao động xác định thời hạn
- Thời hạn: {{contract_duration}}
- Từ ngày: {{start_date}} đến ngày: {{end_date}}

ĐIỀU 3: CHẾ ĐỘ LÀM VIỆC
- Thời gian làm việc: 44 giờ/tuần (Thứ 2 đến sáng Thứ 7)
- Sáng: 08:00 - 12:00; Chiều: 13:30 - 17:30

ĐIỀU 4: TIỀN LƯƠNG VÀ QUYỀN LỢI
- Mức lương chính: {{officialSalary}} VNĐ/tháng
- Hình thức trả lương: Chuyển khoản
- Các phụ cấp (nếu có): Theo quy định của công ty

ĐIỀU 5: BẢO HIỂM VÀ CÁC CHẾ ĐỘ KHÁC
- Người lao động được tham gia BHXH, BHYT, BHTN theo quy định của pháp luật.

ĐIỀU 6: NGHĨA VỤ CỦA NGƯỜI LAO ĐỘNG
- Hoàn thành công việc được giao.
- Chấp hành nội quy, quy định của công ty.

Hợp đồng này được lập thành 02 bản có giá trị pháp lý như nhau. Mỗi bên giữ 01 bản.

ĐẠI DIỆN CÔNG TY                      NGƯỜI LAO ĐỘNG
(Ký tên, đóng dấu)                    (Ký tên)`,
    lastModified: '2024-01-10'
  },
  { 
    id: '2', 
    name: 'Hợp đồng thử việc', 
    type: 'Thử việc', 
    content: `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
---
HỢP ĐỒNG THỬ VIỆC
Số: {{contract_no}}/HĐTV

Chúng tôi, một bên là (Người sử dụng lao động):
Tên Công ty: {{company_name}}
Địa chỉ: {{company_address}}
Đại diện bởi Ông/Bà: {{company_rep}}
Chức vụ: {{company_rep_role}}

Và một bên là (Người lao động):
Ông/Bà: {{name}}
Ngày sinh: {{birthDate}}
Số CCCD/CMND: {{identityCard}}

Thỏa thuận ký kết Hợp đồng thử việc với các điều khoản sau đây:

ĐIỀU 1: VỊ TRÍ VÀ THỜI GIAN THỬ VIỆC
- Vị trí thử việc: {{role}}
- Thời gian thử việc: {{probation_duration}}
- Từ ngày: {{start_date}} đến ngày: {{end_date}}

ĐIỀU 2: MỨC LƯƠNG THỬ VIỆC
- Mức lương thử việc: {{probationSalary}} VNĐ/tháng (Bằng 85% lương chính thức)

ĐIỀU 3: QUYỀN LỢI VÀ NGHĨA VỤ
- Người lao động được đào tạo và hướng dẫn công việc.
- Tuân thủ các quy định về an toàn lao động và bảo mật thông tin.

ĐẠI DIỆN CÔNG TY                      NGƯỜI LAO ĐỘNG
(Ký tên, đóng dấu)                    (Ký tên)`,
    lastModified: '2024-02-15'
  },
];

const initialContracts: Contract[] = [
  { id: 'c1', employeeName: 'Nguyễn Văn A', employeeCode: 'NV001', templateName: 'Hợp đồng lao động chính thức', type: 'Chính thức', signDate: '2020-03-15', status: 'Active' },
  { id: 'c2', employeeName: 'Trần Thị B', employeeCode: 'NV002', templateName: 'Hợp đồng thử việc', type: 'Thử việc', signDate: '2024-03-01', status: 'Active' },
  { id: 'c3', employeeName: 'Lê Văn C', employeeCode: 'NV003', templateName: 'Hợp đồng lao động chính thức', type: 'Chính thức', signDate: '2020-01-15', status: 'Active' },
];

export function Contracts() {
  const [activeTab, setActiveTab] = useState<'list' | 'templates'>('list');
  const [templates, setTemplates] = useState<ContractTemplate[]>(initialTemplates);
  const [contracts, setContracts] = useState<Contract[]>(initialContracts);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Template Modal States
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ContractTemplate | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>In hợp đồng</title>
          <style>
            @media print {
              @page {
                size: A4;
                margin: 20mm;
              }
              body {
                font-family: "Times New Roman", Times, serif;
                line-height: 1.6;
                color: #000;
                background: #fff;
              }
              .contract-content {
                white-space: pre-wrap;
                font-size: 14px;
              }
              .no-print {
                display: none;
              }
            }
            body {
              font-family: "Times New Roman", Times, serif;
              padding: 40px;
              max-width: 800px;
              margin: 0 auto;
            }
            .contract-content {
              white-space: pre-wrap;
              font-size: 14px;
              line-height: 1.6;
            }
          </style>
        </head>
        <body>
          <div class="contract-content">${printContent.innerText}</div>
          <script>
            window.onload = () => {
              window.print();
              window.close();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const [templateFormData, setTemplateFormData] = useState<Partial<ContractTemplate>>({
    name: '', type: 'Chính thức', content: ''
  });

  // Contract Generation Modal States
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);

  const filteredTemplates = templates.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredContracts = contracts.filter(c => 
    c.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.templateName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenTemplateModal = (t?: ContractTemplate) => {
    if (t) {
      setEditingTemplate(t);
      setTemplateFormData(t);
    } else {
      setEditingTemplate(null);
      setTemplateFormData({ name: '', type: 'Chính thức', content: '' });
    }
    setIsTemplateModalOpen(true);
  };

  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTemplate) {
      setTemplates(templates.map(t => t.id === editingTemplate.id ? { ...templateFormData, id: t.id, lastModified: new Date().toISOString().split('T')[0] } as ContractTemplate : t));
    } else {
      setTemplates([...templates, { ...templateFormData, id: Date.now().toString(), lastModified: new Date().toISOString().split('T')[0] } as ContractTemplate]);
    }
    setIsTemplateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Quản lý hợp đồng</h2>
          <p className="text-sm text-slate-500">Quản lý danh sách hợp đồng nhân viên và các mẫu hợp đồng lao động.</p>
        </div>
        <div className="flex gap-3">
          {activeTab === 'list' ? (
            <button 
              onClick={() => setIsGenerateModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tạo hợp đồng mới
            </button>
          ) : (
            <button 
              onClick={() => handleOpenTemplateModal()}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm mẫu mới
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-200">
          <button 
            onClick={() => setActiveTab('list')}
            className={cn(
              "flex-1 py-4 text-sm font-medium transition-colors border-b-2",
              activeTab === 'list' ? "border-indigo-600 text-indigo-600 bg-indigo-50/30" : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            )}
          >
            <div className="flex items-center justify-center gap-2">
              <FileText className="h-4 w-4" />
              Danh sách hợp đồng
            </div>
          </button>
          <button 
            onClick={() => setActiveTab('templates')}
            className={cn(
              "flex-1 py-4 text-sm font-medium transition-colors border-b-2",
              activeTab === 'templates' ? "border-indigo-600 text-indigo-600 bg-indigo-50/30" : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            )}
          >
            <div className="flex items-center justify-center gap-2">
              <History className="h-4 w-4" />
              Mẫu hợp đồng
            </div>
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder={activeTab === 'list' ? "Tìm kiếm hợp đồng, nhân viên..." : "Tìm kiếm mẫu hợp đồng..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          {activeTab === 'list' ? (
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Nhân viên</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Loại hợp đồng</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Ngày ký</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Trạng thái</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {filteredContracts.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900">{c.employeeName}</div>
                        <div className="text-xs text-slate-500">{c.employeeCode}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900">{c.templateName}</div>
                        <div className="text-xs text-slate-500">{c.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {c.signDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                          c.status === 'Active' ? "bg-emerald-100 text-emerald-700" : 
                          c.status === 'Expired' ? "bg-slate-100 text-slate-600" : "bg-amber-100 text-amber-700"
                        )}>
                          {c.status === 'Active' ? 'Đang hiệu lực' : c.status === 'Expired' ? 'Hết hạn' : 'Bản nháp'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => {
                            const template = templates.find(t => t.name === c.templateName) || templates[0];
                            setEditingTemplate(template);
                            setIsPreviewOpen(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          Xem
                        </button>
                        <button className="text-slate-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((t) => (
                <div key={t.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-12 w-12 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <FileText className="h-6 w-6" />
                    </div>
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase tracking-wider">
                      {t.type}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1">{t.name}</h3>
                  <p className="text-xs text-slate-500 mb-4">Cập nhật: {t.lastModified}</p>
                  <div className="mt-auto flex gap-2">
                    <button 
                      onClick={() => handleOpenTemplateModal(t)}
                      className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-slate-200 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Edit2 className="h-3.5 w-3.5 mr-1.5" />
                      Chỉnh sửa
                    </button>
                    <button 
                      onClick={() => {
                        setEditingTemplate(t);
                        setIsPreviewOpen(true);
                      }}
                      className="inline-flex justify-center items-center px-3 py-2 border border-slate-200 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Template Modal */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">
                {editingTemplate ? 'Cập nhật mẫu hợp đồng' : 'Thêm mẫu hợp đồng mới'}
              </h3>
              <button onClick={() => setIsTemplateModalOpen(false)} className="text-slate-400 hover:text-slate-500">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tên mẫu hợp đồng *</label>
                  <input 
                    required 
                    type="text" 
                    value={templateFormData.name} 
                    onChange={e => setTemplateFormData({...templateFormData, name: e.target.value})} 
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-indigo-500 outline-none" 
                    placeholder="VD: Hợp đồng lao động chính thức" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Loại hợp đồng</label>
                  <select 
                    value={templateFormData.type} 
                    onChange={e => setTemplateFormData({...templateFormData, type: e.target.value})} 
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-indigo-500 outline-none"
                  >
                    <option value="Thử việc">Thử việc</option>
                    <option value="Chính thức">Chính thức</option>
                    <option value="Hợp đồng khoán">Hợp đồng khoán</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nội dung mẫu (Sử dụng {"{{placeholder}}"})</label>
                  <textarea 
                    rows={15} 
                    value={templateFormData.content} 
                    onChange={e => setTemplateFormData({...templateFormData, content: e.target.value})} 
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm font-mono focus:ring-indigo-500 outline-none resize-none" 
                    placeholder="Nhập nội dung hợp đồng tại đây..." 
                  />
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-4">
                <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider">Các biến hỗ trợ</h4>
                <div className="space-y-2">
                  {[
                    { key: '{{name}}', label: 'Họ và tên nhân viên' },
                    { key: '{{code}}', label: 'Mã nhân viên' },
                    { key: '{{birthDate}}', label: 'Ngày sinh' },
                    { key: '{{identityCard}}', label: 'Số CMND/CCCD' },
                    { key: '{{role}}', label: 'Chức vụ' },
                    { key: '{{department}}', label: 'Phòng ban' },
                    { key: '{{probationSalary}}', label: 'Lương thử việc' },
                    { key: '{{officialSalary}}', label: 'Lương chính thức' },
                    { key: '{{company_name}}', label: 'Tên công ty' },
                  ].map(item => (
                    <div key={item.key} className="p-2 bg-white rounded border border-slate-200 flex flex-col">
                      <code className="text-[10px] font-bold text-indigo-600">{item.key}</code>
                      <span className="text-[10px] text-slate-500">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setIsTemplateModalOpen(false)} className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700">Hủy</button>
              <button onClick={handleSaveTemplate} className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors">
                <Save className="h-4 w-4 mr-2" />
                Lưu mẫu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {isPreviewOpen && editingTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Xem trước mẫu: {editingTemplate.name}</h3>
              <button onClick={() => setIsPreviewOpen(false)} className="text-slate-400 hover:text-slate-500">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-8 overflow-y-auto flex-1 bg-slate-50">
              <div 
                ref={printRef}
                className="bg-white p-12 shadow-sm border border-slate-200 mx-auto max-w-2xl min-h-[800px] whitespace-pre-wrap font-serif text-sm leading-relaxed text-slate-800"
                style={{ fontFamily: '"Times New Roman", Times, serif' }}
              >
                {editingTemplate.content}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 bg-white flex justify-end gap-3">
              <button 
                onClick={handlePrint}
                className="inline-flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                <Printer className="h-4 w-4 mr-2" />
                In hợp đồng
              </button>
              <button onClick={() => setIsPreviewOpen(false)} className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors">Đóng</button>
            </div>
          </div>
        </div>
      )}

      {/* Generate Contract Modal */}
      {isGenerateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold text-slate-900">Tạo hợp đồng lao động mới</h3>
              <button onClick={() => setIsGenerateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Chọn nhân viên</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option value="1">Nguyễn Văn A (NV001)</option>
                  <option value="2">Trần Thị B (NV002)</option>
                  <option value="3">Lê Văn C (NV003)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Chọn mẫu hợp đồng</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                  {templates.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                <p className="text-xs text-indigo-800 leading-relaxed">
                  Hệ thống sẽ tự động trích xuất dữ liệu từ hồ sơ nhân viên để điền vào các biến trong mẫu hợp đồng.
                </p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setIsGenerateModalOpen(false)} className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700">Hủy</button>
              <button 
                onClick={() => {
                  alert('Hợp đồng đang được tạo...');
                  setIsGenerateModalOpen(false);
                }} 
                className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                Tạo hợp đồng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
