import React, { useState } from 'react';
import { Calculator, Search, Download, FileSpreadsheet, ChevronDown, ChevronRight, DollarSign, Percent } from 'lucide-react';

// --- Types & Mock Data ---
type PayrollRecord = {
  id: string;
  employeeCode: string;
  employeeName: string;
  department: string;
  baseSalary: number; // Lương cơ bản
  workingDays: number; // Ngày công thực tế
  standardDays: number; // Ngày công chuẩn
  allowances: number; // Phụ cấp
  overtimePay: number; // Tiền tăng ca
  grossSalary: number; // Tổng thu nhập (Gross)
  socialInsurance: number; // BHXH (8%)
  healthInsurance: number; // BHYT (1.5%)
  unemploymentInsurance: number; // BHTN (1%)
  dependents: number; // Số người phụ thuộc
  taxableIncome: number; // Thu nhập tính thuế
  personalIncomeTax: number; // Thuế TNCN
  netSalary: number; // Thực lãnh (Net)
};

const mockPayroll: PayrollRecord[] = [
  {
    id: '1', employeeCode: 'NV001', employeeName: 'Nguyễn Văn A', department: 'Văn phòng',
    baseSalary: 20000000, workingDays: 22, standardDays: 22, allowances: 2000000, overtimePay: 0,
    grossSalary: 22000000, socialInsurance: 1600000, healthInsurance: 300000, unemploymentInsurance: 200000,
    dependents: 1, taxableIncome: 4500000, personalIncomeTax: 225000, netSalary: 19675000
  },
  {
    id: '2', employeeCode: 'NV002', employeeName: 'Trần Thị B', department: 'Kỹ thuật',
    baseSalary: 15000000, workingDays: 20, standardDays: 22, allowances: 1500000, overtimePay: 1000000,
    grossSalary: 16136363, socialInsurance: 1200000, healthInsurance: 225000, unemploymentInsurance: 150000,
    dependents: 0, taxableIncome: 3561363, personalIncomeTax: 178068, netSalary: 14383295
  },
  {
    id: '3', employeeCode: 'NV003', employeeName: 'Lê Văn C', department: 'Lái xe nâng',
    baseSalary: 12000000, workingDays: 24, standardDays: 22, allowances: 1000000, overtimePay: 2500000,
    grossSalary: 16590909, socialInsurance: 960000, healthInsurance: 180000, unemploymentInsurance: 120000,
    dependents: 2, taxableIncome: 0, personalIncomeTax: 0, netSalary: 15330909
  },
];

// --- Tax Calculation Logic (Thuế TNCN Lũy tiến) ---
// Giảm trừ gia cảnh: Bản thân = 11,000,000; Người phụ thuộc = 4,400,000/người
const PERSONAL_DEDUCTION = 11000000;
const DEPENDENT_DEDUCTION = 4400000;

const calculatePIT = (taxableIncome: number): number => {
  if (taxableIncome <= 0) return 0;
  
  let tax = 0;
  if (taxableIncome <= 5000000) {
    tax = taxableIncome * 0.05;
  } else if (taxableIncome <= 10000000) {
    tax = (5000000 * 0.05) + ((taxableIncome - 5000000) * 0.1);
  } else if (taxableIncome <= 18000000) {
    tax = (5000000 * 0.05) + (5000000 * 0.1) + ((taxableIncome - 10000000) * 0.15);
  } else if (taxableIncome <= 32000000) {
    tax = (5000000 * 0.05) + (5000000 * 0.1) + (8000000 * 0.15) + ((taxableIncome - 18000000) * 0.2);
  } else if (taxableIncome <= 52000000) {
    tax = (5000000 * 0.05) + (5000000 * 0.1) + (8000000 * 0.15) + (14000000 * 0.2) + ((taxableIncome - 32000000) * 0.25);
  } else if (taxableIncome <= 80000000) {
    tax = (5000000 * 0.05) + (5000000 * 0.1) + (8000000 * 0.15) + (14000000 * 0.2) + (20000000 * 0.25) + ((taxableIncome - 52000000) * 0.3);
  } else {
    tax = (5000000 * 0.05) + (5000000 * 0.1) + (8000000 * 0.15) + (14000000 * 0.2) + (20000000 * 0.25) + (28000000 * 0.3) + ((taxableIncome - 80000000) * 0.35);
  }
  return Math.round(tax);
};

// Format currency
const formatVND = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export function Payroll() {
  const [records, setRecords] = useState<PayrollRecord[]>(mockPayroll);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('2026-03');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const filteredRecords = records.filter(record => 
    record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.employeeCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Tính lương & Thuế TNCN</h2>
          <p className="text-sm text-slate-500">Quản lý bảng lương, tính toán bảo hiểm và thuế lũy tiến.</p>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="month" 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
            <Calculator className="h-4 w-4 mr-2" />
            Chốt lương
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
            <Download className="h-4 w-4 mr-2" />
            Xuất Excel
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-slate-500">Tổng quỹ lương (Gross)</p>
            <div className="p-2 bg-indigo-50 rounded-md"><DollarSign className="h-4 w-4 text-indigo-600" /></div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{formatVND(records.reduce((acc, curr) => acc + curr.grossSalary, 0))}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-slate-500">Tổng BHXH, BHYT, BHTN</p>
            <div className="p-2 bg-amber-50 rounded-md"><Percent className="h-4 w-4 text-amber-600" /></div>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {formatVND(records.reduce((acc, curr) => acc + curr.socialInsurance + curr.healthInsurance + curr.unemploymentInsurance, 0))}
          </p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-slate-500">Tổng Thuế TNCN</p>
            <div className="p-2 bg-red-50 rounded-md"><FileSpreadsheet className="h-4 w-4 text-red-600" /></div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{formatVND(records.reduce((acc, curr) => acc + curr.personalIncomeTax, 0))}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-slate-500">Thực chi (Net)</p>
            <div className="p-2 bg-emerald-50 rounded-md"><DollarSign className="h-4 w-4 text-emerald-600" /></div>
          </div>
          <p className="text-2xl font-bold text-emerald-600">{formatVND(records.reduce((acc, curr) => acc + curr.netSalary, 0))}</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm nhân viên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
        </div>
      </div>

      {/* Payroll Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Nhân viên</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Công thực tế</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Tổng thu nhập (Gross)</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Khấu trừ (BH + Thuế)</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Thực lãnh (Net)</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredRecords.map((record) => (
                <React.Fragment key={record.id}>
                  <tr className={`hover:bg-slate-50 transition-colors ${expandedRow === record.id ? 'bg-indigo-50/30' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs mr-3">
                          {record.employeeName.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-900">{record.employeeName}</div>
                          <div className="text-xs text-slate-500">{record.employeeCode} - {record.department}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-slate-600">
                      {record.workingDays} / {record.standardDays} ngày
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-slate-900">
                      {formatVND(record.grossSalary)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-red-600">
                      -{formatVND(record.socialInsurance + record.healthInsurance + record.unemploymentInsurance + record.personalIncomeTax)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-emerald-600">
                      {formatVND(record.netSalary)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button 
                        onClick={() => toggleRow(record.id)}
                        className="text-slate-400 hover:text-indigo-600 transition-colors p-1 rounded-full hover:bg-slate-100"
                      >
                        {expandedRow === record.id ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                      </button>
                    </td>
                  </tr>
                  
                  {/* Expanded Details Row */}
                  {expandedRow === record.id && (
                    <tr>
                      <td colSpan={6} className="px-0 py-0 border-b border-slate-200">
                        <div className="bg-slate-50 p-6 grid grid-cols-1 md:grid-cols-3 gap-8 shadow-inner">
                          
                          {/* Cấu trúc thu nhập */}
                          <div className="space-y-3">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 pb-2">1. Cấu trúc thu nhập</h4>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">Lương cơ bản:</span>
                              <span className="font-medium">{formatVND(record.baseSalary)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">Lương thời gian ({record.workingDays}/{record.standardDays}):</span>
                              <span className="font-medium">{formatVND((record.baseSalary / record.standardDays) * record.workingDays)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">Phụ cấp:</span>
                              <span className="font-medium">{formatVND(record.allowances)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">Tiền tăng ca:</span>
                              <span className="font-medium">{formatVND(record.overtimePay)}</span>
                            </div>
                            <div className="flex justify-between text-sm font-bold pt-2 border-t border-slate-200">
                              <span className="text-slate-900">Tổng thu nhập (Gross):</span>
                              <span className="text-indigo-600">{formatVND(record.grossSalary)}</span>
                            </div>
                          </div>

                          {/* Khấu trừ Bảo hiểm */}
                          <div className="space-y-3">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 pb-2">2. Khấu trừ Bảo hiểm (10.5%)</h4>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">BHXH (8%):</span>
                              <span className="font-medium text-red-600">-{formatVND(record.socialInsurance)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">BHYT (1.5%):</span>
                              <span className="font-medium text-red-600">-{formatVND(record.healthInsurance)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">BHTN (1%):</span>
                              <span className="font-medium text-red-600">-{formatVND(record.unemploymentInsurance)}</span>
                            </div>
                            <div className="flex justify-between text-sm font-bold pt-2 border-t border-slate-200">
                              <span className="text-slate-900">Tổng khấu trừ BH:</span>
                              <span className="text-red-600">-{formatVND(record.socialInsurance + record.healthInsurance + record.unemploymentInsurance)}</span>
                            </div>
                          </div>

                          {/* Thuế TNCN */}
                          <div className="space-y-3">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 pb-2">3. Thuế TNCN (Lũy tiến)</h4>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">Giảm trừ bản thân:</span>
                              <span className="font-medium">{formatVND(PERSONAL_DEDUCTION)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">Giảm trừ NPT ({record.dependents} người):</span>
                              <span className="font-medium">{formatVND(record.dependents * DEPENDENT_DEDUCTION)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">Thu nhập tính thuế:</span>
                              <span className="font-medium">{formatVND(record.taxableIncome)}</span>
                            </div>
                            <div className="flex justify-between text-sm font-bold pt-2 border-t border-slate-200">
                              <span className="text-slate-900">Thuế TNCN phải nộp:</span>
                              <span className="text-red-600">-{formatVND(record.personalIncomeTax)}</span>
                            </div>
                          </div>

                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
