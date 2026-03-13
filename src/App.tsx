import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Timekeeping } from './pages/Timekeeping';
import { Employees } from './pages/Employees';
import { Dependents } from './pages/Dependents';
import { Requests } from './pages/Requests';
import { Departments } from './pages/Departments';
import { Shifts } from './pages/Shifts';
import { WorkLocations } from './pages/WorkLocations';
import { Branches } from './pages/Branches';
import { Positions } from './pages/Positions';
import { Allowances } from './pages/Allowances';
import { RewardsDisciplines } from './pages/RewardsDisciplines';
import { Payroll } from './pages/Payroll';
import { Vehicles } from './pages/Vehicles';
import { Holidays } from './pages/Holidays';
import { CompanySettings } from './pages/CompanySettings';
import { EmployeeProfile } from './pages/EmployeeProfile';
import { Contracts } from './pages/Contracts';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="timekeeping" element={<Timekeeping />} />
          <Route path="employees" element={<Employees />} />
          <Route path="employee-profile" element={<EmployeeProfile />} />
          <Route path="dependents" element={<Dependents />} />
          <Route path="branches" element={<Branches />} />
          <Route path="departments" element={<Departments />} />
          <Route path="positions" element={<Positions />} />
          <Route path="allowances" element={<Allowances />} />
          <Route path="rewards-disciplines" element={<RewardsDisciplines />} />
          <Route path="shifts" element={<Shifts />} />
          <Route path="locations" element={<WorkLocations />} />
          <Route path="vehicles" element={<Vehicles />} />
          <Route path="holidays" element={<Holidays />} />
          <Route path="company" element={<CompanySettings />} />
          <Route path="requests" element={<Requests />} />
          <Route path="payroll" element={<Payroll />} />
          <Route path="contracts" element={<Contracts />} />
          <Route path="settings" element={<div className="p-6">Trang Cài đặt (Đang phát triển)</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
