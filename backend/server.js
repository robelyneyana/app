const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- ADMIN ROUTES ---
app.get('/api/admins', (req, res) => {
  db.query('SELECT * FROM ADMIN', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/admins', (req, res) => {
  const { admin_name, username, password } = req.body;
  db.query('INSERT INTO ADMIN (admin_name, username, password) VALUES (?, ?, ?)', [admin_name, username, password], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: results.insertId });
  });
});

app.put('/api/admins/:id', (req, res) => {
  const { id } = req.params;
  const { admin_name, username, password } = req.body;
  db.query('UPDATE ADMIN SET admin_name = ?, username = ?, password = ? WHERE admin_id = ?', [admin_name, username, password, id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ updated: results.affectedRows });
  });
});

app.delete('/api/admins/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM ADMIN WHERE admin_id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: results.affectedRows });
  });
});

// --- STUDENT ROUTES ---
app.get('/api/students', (req, res) => {
  db.query('SELECT * FROM STUDENT', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/students', (req, res) => {
  const { student_name, course, year_level, email } = req.body;
  db.query('INSERT INTO STUDENT (student_name, course, year_level, email) VALUES (?, ?, ?, ?)', [student_name, course, year_level, email], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: results.insertId });
  });
});

app.put('/api/students/:id', (req, res) => {
  const { id } = req.params;
  const { student_name, course, year_level, email } = req.body;
  db.query('UPDATE STUDENT SET student_name = ?, course = ?, year_level = ?, email = ? WHERE student_id = ?', [student_name, course, year_level, email, id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ updated: results.affectedRows });
  });
});

app.delete('/api/students/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM STUDENT WHERE student_id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: results.affectedRows });
  });
});

// --- LIBRARY ROUTES ---
app.get('/api/libraries', (req, res) => {
  db.query('SELECT * FROM LIBRARY', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/libraries', (req, res) => {
  const { library_name, location } = req.body;
  db.query('INSERT INTO LIBRARY (library_name, location) VALUES (?, ?)', [library_name, location], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: results.insertId });
  });
});

app.put('/api/libraries/:id', (req, res) => {
  const { id } = req.params;
  const { library_name, location } = req.body;
  db.query('UPDATE LIBRARY SET library_name = ?, location = ? WHERE library_id = ?', [library_name, location, id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ updated: results.affectedRows });
  });
});

app.delete('/api/libraries/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM LIBRARY WHERE library_id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: results.affectedRows });
  });
});

// --- QR CODE ROUTES ---
app.get('/api/qrcodes', (req, res) => {
  db.query('SELECT * FROM QR_CODE', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/qrcodes', (req, res) => {
  const { qr_value, admin_id } = req.body;
  db.query('INSERT INTO QR_CODE (qr_value, admin_id) VALUES (?, ?)', [qr_value, admin_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: results.insertId });
  });
});

app.put('/api/qrcodes/:id', (req, res) => {
  const { id } = req.params;
  const { qr_value, status, admin_id } = req.body;
  db.query('UPDATE QR_CODE SET qr_value = ?, status = ?, admin_id = ? WHERE qr_id = ?', [qr_value, status, admin_id, id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ updated: results.affectedRows });
  });
});

app.delete('/api/qrcodes/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM QR_CODE WHERE qr_id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: results.affectedRows });
  });
});

// --- ATTENDANCE ROUTES ---
app.get('/api/attendance', (req, res) => {
  db.query('SELECT * FROM ATTENDANCE', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/attendance', (req, res) => {
  const { student_id, qr_id, library_id } = req.body;
  db.query('INSERT INTO ATTENDANCE (student_id, qr_id, library_id) VALUES (?, ?, ?)', [student_id, qr_id, library_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: results.insertId });
  });
});

app.delete('/api/attendance/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM ATTENDANCE WHERE attendance_id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: results.affectedRows });
  });
});

app.patch('/api/attendance/:id/timeout', (req, res) => {
  const { id } = req.params;
  db.query('UPDATE ATTENDANCE SET time_out = (CURRENT_TIME) WHERE attendance_id = ? AND time_out IS NULL', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ updated: results.affectedRows });
  });
});

app.get('/', (req, res) => {
  res.send('Library Attendance System API');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
