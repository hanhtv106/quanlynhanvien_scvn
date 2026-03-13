import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Đảm bảo thư mục data tồn tại
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'database.sqlite');
const db = new Database(dbPath);

// Khởi tạo các bảng
db.exec(`
  CREATE TABLE IF NOT EXISTS vehicles (
    id TEXT PRIMARY KEY,
    plateNumber TEXT NOT NULL,
    name TEXT NOT NULL,
    locationId TEXT,
    shiftId TEXT,
    salaryMethod TEXT DEFAULT 'monthly',
    standardWorkdaysType TEXT NOT NULL,
    fixedWorkdays REAL,
    status TEXT NOT NULL,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS vehicle_allowances (
    vehicleId TEXT NOT NULL,
    allowanceId TEXT NOT NULL,
    additionalAmount REAL NOT NULL,
    FOREIGN KEY (vehicleId) REFERENCES vehicles(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS holidays (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    date TEXT NOT NULL,
    type TEXT NOT NULL, -- 'public' (lễ tết), 'company' (nghỉ riêng của cty)
    isPaid INTEGER DEFAULT 1, -- 1: có hưởng lương, 0: không hưởng lương
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS company_info (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    taxCode TEXT,
    address TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    representative TEXT,
    logoUrl TEXT,
    updatedAt TEXT
  );
`);

// Migration: Add salaryMethod if it doesn't exist
try {
  db.exec(`ALTER TABLE vehicles ADD COLUMN salaryMethod TEXT DEFAULT 'monthly'`);
} catch (error) {
  // Column might already exist, ignore
}

// Seed sample data if table is empty
const vehicleCount = db.prepare('SELECT COUNT(*) as count FROM vehicles').get() as { count: number };
if (vehicleCount.count === 0) {
  const insertVehicle = db.prepare(`
    INSERT INTO vehicles (id, plateNumber, name, locationId, shiftId, salaryMethod, standardWorkdaysType, fixedWorkdays, status, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertAllowance = db.prepare(`
    INSERT INTO vehicle_allowances (vehicleId, allowanceId, additionalAmount)
    VALUES (?, ?, ?)
  `);

  db.transaction(() => {
    // Sample 1
    insertVehicle.run('1', '51C-123.45', 'Xe Tải 5 Tấn', '1', 'S1', 'monthly', 'Fixed', 26, 'active', 'Chuyên chở hàng nhẹ');
    insertAllowance.run('1', '2', 0);

    // Sample 2
    insertVehicle.run('2', '29C-678.90', 'Xe Đầu Kéo Container', '2', 'S4', 'production', 'Administrative', null, 'active', 'Chạy tuyến dài');
    insertAllowance.run('2', '4', 500000);

    // Sample 3
    insertVehicle.run('3', '61C-345.67', 'Xe Nâng', '3', 'S2', 'monthly', 'Fixed', 24, 'maintenance', 'Đang bảo dưỡng định kỳ');
  })();
}

// Seed sample holidays if table is empty
const holidayCount = db.prepare('SELECT COUNT(*) as count FROM holidays').get() as { count: number };
if (holidayCount.count === 0) {
  const insertHoliday = db.prepare(`
    INSERT INTO holidays (id, name, date, type, isPaid, description)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  db.transaction(() => {
    insertHoliday.run('h1', 'Tết Dương Lịch', '2026-01-01', 'public', 1, 'Nghỉ Tết Dương Lịch hàng năm');
    insertHoliday.run('h2', 'Giải phóng miền Nam', '2026-04-30', 'public', 1, 'Kỷ niệm ngày Giải phóng miền Nam 30/4');
    insertHoliday.run('h3', 'Quốc tế Lao động', '2026-05-01', 'public', 1, 'Ngày Quốc tế Lao động 1/5');
    insertHoliday.run('h4', 'Quốc khánh', '2026-09-02', 'public', 1, 'Ngày Quốc khánh 2/9');
  })();
}

// Seed sample company info if table is empty
const companyCount = db.prepare('SELECT COUNT(*) as count FROM company_info').get() as { count: number };
if (companyCount.count === 0) {
  db.prepare(`
    INSERT INTO company_info (id, name, taxCode, address, phone, email, website, representative, logoUrl, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    '1', 
    'Công ty TNHH Giải pháp Nhân sự HRMS Pro', 
    '0101234567', 
    'Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội', 
    '024 3869 1234', 
    'info@hrmspro.vn', 
    'https://hrmspro.vn', 
    'Nguyễn Văn Quản Trị', 
    'https://picsum.photos/seed/company/200/200',
    new Date().toISOString()
  );
}

export default db;
