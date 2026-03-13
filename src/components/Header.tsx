import React from 'react';
import { Bell, Search } from 'lucide-react';

export function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="flex flex-1">
        <div className="flex w-full max-w-md items-center rounded-md border border-slate-300 bg-white px-3 py-1.5 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm nhân viên, mã chấm công..."
            className="ml-2 w-full border-0 bg-transparent p-0 text-sm placeholder:text-slate-400 focus:ring-0"
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button className="relative rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-500">
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          <Bell className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
}
