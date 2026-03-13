import React from 'react';
import { Users, Clock, CalendarDays, Calculator } from 'lucide-react';

const stats = [
  { name: 'Tổng nhân sự', value: '500', icon: Users, change: '+4.75%', changeType: 'positive' },
  { name: 'Đã chấm công hôm nay', value: '482', icon: Clock, change: '96.4%', changeType: 'neutral' },
  { name: 'Nghỉ phép / Vắng mặt', value: '18', icon: CalendarDays, change: '-1.5%', changeType: 'positive' },
  { name: 'Quỹ lương dự kiến', value: '4.2 Tỷ', icon: Calculator, change: '+2.1%', changeType: 'negative' },
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Tổng quan</h2>
        <p className="text-sm text-slate-500">Thông tin tóm tắt về nhân sự và chấm công trong ngày.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.name}
            className="overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center">
              <div className="rounded-md bg-indigo-50 p-3">
                <item.icon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
              </div>
              <div className="ml-4 truncate">
                <p className="truncate text-sm font-medium text-slate-500">{item.name}</p>
                <p className="text-2xl font-semibold text-slate-900">{item.value}</p>
              </div>
            </div>
            <div className="mt-4">
              <span
                className={`text-sm font-medium ${
                  item.changeType === 'positive'
                    ? 'text-emerald-600'
                    : item.changeType === 'negative'
                    ? 'text-red-600'
                    : 'text-slate-600'
                }`}
              >
                {item.change}
              </span>
              <span className="text-sm text-slate-500"> so với tháng trước</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Placeholder for charts */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm min-h-[300px] flex flex-col">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Tỉ lệ đi làm theo bộ phận</h3>
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
            <p className="text-sm text-slate-500">Biểu đồ sẽ hiển thị ở đây</p>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm min-h-[300px] flex flex-col">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Yêu cầu cần duyệt</h3>
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
            <p className="text-sm text-slate-500">Danh sách yêu cầu sẽ hiển thị ở đây</p>
          </div>
        </div>
      </div>
    </div>
  );
}
