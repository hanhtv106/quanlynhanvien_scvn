import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import db from './src/db/index.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // --- Vehicles API ---
  app.get('/api/vehicles', (req, res) => {
    try {
      const vehicles = db.prepare('SELECT * FROM vehicles').all();
      const allowancesStmt = db.prepare('SELECT allowanceId, additionalAmount FROM vehicle_allowances WHERE vehicleId = ?');
      
      const result = vehicles.map((v: any) => {
        const allowances = allowancesStmt.all(v.id);
        return { ...v, allowances };
      });
      
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/api/vehicles', (req, res) => {
    const { id, plateNumber, name, locationId, shiftId, salaryMethod, allowances, standardWorkdaysType, fixedWorkdays, status, description } = req.body;
    
    try {
      const insertVehicle = db.prepare(`
        INSERT INTO vehicles (id, plateNumber, name, locationId, shiftId, salaryMethod, standardWorkdaysType, fixedWorkdays, status, description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      const insertAllowance = db.prepare(`
        INSERT INTO vehicle_allowances (vehicleId, allowanceId, additionalAmount)
        VALUES (?, ?, ?)
      `);
      
      db.transaction(() => {
        insertVehicle.run(id, plateNumber, name, locationId, shiftId, salaryMethod || 'monthly', standardWorkdaysType, fixedWorkdays, status, description);
        if (allowances && Array.isArray(allowances)) {
          for (const allowance of allowances) {
            insertAllowance.run(id, allowance.allowanceId, allowance.additionalAmount);
          }
        }
      })();
      
      res.status(201).json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.put('/api/vehicles/:id', (req, res) => {
    const { id } = req.params;
    const { plateNumber, name, locationId, shiftId, salaryMethod, allowances, standardWorkdaysType, fixedWorkdays, status, description } = req.body;
    
    try {
      const updateVehicle = db.prepare(`
        UPDATE vehicles 
        SET plateNumber = ?, name = ?, locationId = ?, shiftId = ?, salaryMethod = ?, standardWorkdaysType = ?, fixedWorkdays = ?, status = ?, description = ?
        WHERE id = ?
      `);
      
      const deleteAllowances = db.prepare('DELETE FROM vehicle_allowances WHERE vehicleId = ?');
      const insertAllowance = db.prepare(`
        INSERT INTO vehicle_allowances (vehicleId, allowanceId, additionalAmount)
        VALUES (?, ?, ?)
      `);
      
      db.transaction(() => {
        updateVehicle.run(plateNumber, name, locationId, shiftId, salaryMethod || 'monthly', standardWorkdaysType, fixedWorkdays, status, description, id);
        deleteAllowances.run(id);
        if (allowances && Array.isArray(allowances)) {
          for (const allowance of allowances) {
            insertAllowance.run(id, allowance.allowanceId, allowance.additionalAmount);
          }
        }
      })();
      
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.delete('/api/vehicles/:id', (req, res) => {
    const { id } = req.params;
    try {
      db.prepare('DELETE FROM vehicles WHERE id = ?').run(id);
      // vehicle_allowances will be deleted automatically due to ON DELETE CASCADE
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // --- Holidays API ---
  app.get('/api/holidays', (req, res) => {
    try {
      const holidays = db.prepare('SELECT * FROM holidays ORDER BY date ASC').all();
      res.json(holidays);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/api/holidays', (req, res) => {
    const { id, name, date, type, isPaid, description } = req.body;
    try {
      db.prepare(`
        INSERT INTO holidays (id, name, date, type, isPaid, description)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(id, name, date, type, isPaid ? 1 : 0, description);
      res.status(201).json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.put('/api/holidays/:id', (req, res) => {
    const { id } = req.params;
    const { name, date, type, isPaid, description } = req.body;
    try {
      db.prepare(`
        UPDATE holidays 
        SET name = ?, date = ?, type = ?, isPaid = ?, description = ?
        WHERE id = ?
      `).run(name, date, type, isPaid ? 1 : 0, description, id);
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.delete('/api/holidays/:id', (req, res) => {
    const { id } = req.params;
    try {
      db.prepare('DELETE FROM holidays WHERE id = ?').run(id);
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // --- Company Info API ---
  app.get('/api/company', (req, res) => {
    try {
      const company = db.prepare('SELECT * FROM company_info LIMIT 1').get();
      res.json(company || {});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/api/company', (req, res) => {
    const { name, taxCode, address, phone, email, website, representative, logoUrl } = req.body;
    const updatedAt = new Date().toISOString();
    try {
      const existing = db.prepare('SELECT id FROM company_info LIMIT 1').get() as { id: string } | undefined;
      if (existing) {
        db.prepare(`
          UPDATE company_info 
          SET name = ?, taxCode = ?, address = ?, phone = ?, email = ?, website = ?, representative = ?, logoUrl = ?, updatedAt = ?
          WHERE id = ?
        `).run(name, taxCode, address, phone, email, website, representative, logoUrl, updatedAt, existing.id);
      } else {
        db.prepare(`
          INSERT INTO company_info (id, name, taxCode, address, phone, email, website, representative, logoUrl, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run('1', name, taxCode, address, phone, email, website, representative, logoUrl, updatedAt);
      }
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
