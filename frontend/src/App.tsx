import { useState, useEffect } from 'react'
import './App.css'
import type { Student, Library, Admin, QRCode } from './types'
import { Trash2, Edit, Plus, X, Check, Calendar, Clock, User, Shield, QrCode as QrIcon, Library as LibIcon } from 'lucide-react'

const API_BASE = 'http://localhost:5000/api'

function App() {
  const [students, setStudents] = useState<Student[]>([])
  const [libraries, setLibraries] = useState<Library[]>([])
  const [admins, setAdmins] = useState<Admin[]>([])
  const [qrCodes, setQrCodes] = useState<QRCode[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Modal states
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<'student' | 'library' | 'admin' | 'qrcode'>('student')
  const [editingId, setEditingId] = useState<number | null>(null)
  
  // Form states
  const [formData, setFormData] = useState<any>({})

  const fetchData = async () => {
    try {
      setLoading(true)
      const [sRes, lRes, admRes, qrRes] = await Promise.all([
        fetch(`${API_BASE}/students`),
        fetch(`${API_BASE}/libraries`),
        fetch(`${API_BASE}/admins`),
        fetch(`${API_BASE}/qrcodes`)
      ])

      if (!sRes.ok || !lRes.ok || !admRes.ok || !qrRes.ok) {
        throw new Error('One or more requests failed')
      }

      setStudents(await sRes.json())
      setLibraries(await lRes.json())
      setAdmins(await admRes.json())
      setQrCodes(await qrRes.json())
      setError(null)
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Could not connect to the backend. Please ensure the server is running on port 5000.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDelete = async (type: string, id: number) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return
    
    const pluralType = type === 'library' ? 'libraries' : `${type}s`
    try {
      const res = await fetch(`${API_BASE}/${pluralType}/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      fetchData()
    } catch (err) {
      alert('Error deleting item')
    }
  }

  const handleOpenModal = (type: 'student' | 'library' | 'admin' | 'qrcode', item: any = null) => {
    setModalType(type)
    setEditingId(item ? (item.student_id || item.library_id || item.admin_id || item.qr_id) : null)
    setFormData(item || {})
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const method = editingId ? 'PUT' : 'POST'
    const pluralType = modalType === 'library' ? 'libraries' : `${modalType}s`
    const url = editingId 
      ? `${API_BASE}/${pluralType}/${editingId}` 
      : `${API_BASE}/${pluralType}`

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) throw new Error('Operation failed')
      setShowModal(false)
      fetchData()
    } catch (err) {
      alert('Error saving data')
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-900">
      <div className="text-xl font-medium text-blue-600 animate-pulse flex items-center gap-3">
        <LibIcon className="animate-bounce" /> Initializing Library System...
      </div>
    </div>
  )

  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4 text-gray-900">
      <div className="max-w-md w-full bg-white border-2 border-red-200 p-8 rounded-xl shadow-lg text-center">
        <div className="text-red-500 text-5xl mb-4 flex justify-center"><X size={64} /></div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Connection Error</h1>
        <p className="text-gray-600 mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
        >
          Retry Connection
        </button>
      </div>
    </div>
  )

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 text-left min-h-screen bg-gray-50 text-gray-900">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-8">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Eyana Library</h1>
          <p className="text-gray-500 mt-1 font-medium flex items-center gap-2">
            <Calendar size={16} /> Library Management System
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => handleOpenModal('student')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all shadow-sm">
            <Plus size={18} /> Student
          </button>
          <button onClick={() => handleOpenModal('library')} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all shadow-sm">
            <Plus size={18} /> Library
          </button>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Students', value: students.length, icon: <User className="text-blue-600" />, color: 'bg-blue-50' },
          { label: 'Libraries', value: libraries.length, icon: <LibIcon className="text-emerald-600" />, color: 'bg-emerald-50' },
          { label: 'QR Codes', value: qrCodes.length, icon: <QrIcon className="text-purple-600" />, color: 'bg-purple-50' },
        ].map((stat, i) => (
          <div key={i} className={`${stat.color} p-4 rounded-2xl border flex items-center gap-4`}>
            <div className="bg-white p-3 rounded-xl shadow-sm">{stat.icon}</div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-black text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <section className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Students List */}
            <div className="bg-white rounded-2xl border shadow-sm">
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-lg font-black text-gray-800 flex items-center gap-2">
                  <User className="text-blue-500" /> Students
                </h2>
              </div>
              <ul className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
                {students.map(s => (
                  <li key={s.student_id} className="p-4 hover:bg-gray-50 flex justify-between items-center group">
                    <div>
                      <p className="font-bold text-gray-900">{s.student_name}</p>
                      <p className="text-xs text-gray-500 font-medium">{s.course} • Year {s.year_level}</p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenModal('student', s)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete('student', s.student_id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Libraries List */}
            <div className="bg-white rounded-2xl border shadow-sm">
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-lg font-black text-gray-800 flex items-center gap-2">
                  <LibIcon className="text-emerald-500" /> Libraries
                </h2>
              </div>
              <ul className="divide-y divide-gray-100">
                {libraries.map(l => (
                  <li key={l.library_id} className="p-4 hover:bg-gray-50 flex justify-between items-center group">
                    <div>
                      <p className="font-bold text-gray-900">{l.library_name}</p>
                      <p className="text-xs text-gray-500 font-medium">{l.location}</p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenModal('library', l)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete('library', l.library_id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Sidebar: Admins & QR Codes */}
        <aside className="space-y-8">
          <div className="bg-white rounded-2xl border shadow-sm">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-lg font-black text-gray-800 flex items-center gap-2">
                <Shield className="text-purple-500" /> Admins
              </h2>
              <button onClick={() => handleOpenModal('admin')} className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg">
                <Plus size={20} />
              </button>
            </div>
            <ul className="divide-y divide-gray-100">
              {admins.map(adm => (
                <li key={adm.admin_id} className="p-4 flex justify-between items-center group">
                  <div>
                    <p className="font-bold text-gray-900">{adm.admin_name}</p>
                    <p className="text-xs text-gray-500 font-medium">@{adm.username}</p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleOpenModal('admin', adm)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                      <Edit size={14} />
                    </button>
                    <button onClick={() => handleDelete('admin', adm.admin_id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl border shadow-sm">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-lg font-black text-gray-800 flex items-center gap-2">
                <QrIcon className="text-blue-500" /> QR Codes
              </h2>
              <button onClick={() => handleOpenModal('qrcode')} className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg">
                <Plus size={20} />
              </button>
            </div>
            <div className="p-4 grid grid-cols-1 gap-3">
              {qrCodes.map(qr => (
                <div key={qr.qr_id} className="border rounded-xl p-3 flex justify-between items-center group bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-lg border shadow-sm">
                      <QrIcon size={20} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="font-mono text-sm font-bold text-gray-900">{qr.qr_value}</p>
                      <p className={`text-[10px] font-black uppercase tracking-widest ${qr.status === 'active' ? 'text-blue-500' : 'text-gray-400'}`}>
                        {qr.status}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleOpenModal('qrcode', qr)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                      <Edit size={14} />
                    </button>
                    <button onClick={() => handleDelete('qrcode', qr.qr_id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* CRUD Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-black text-gray-800 capitalize">
                {editingId ? 'Edit' : 'Add New'} {modalType}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {modalType === 'student' && (
                <>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Full Name</label>
                    <input type="text" value={formData.student_name || ''} onChange={e => setFormData({...formData, student_name: e.target.value})} className="w-full px-4 py-2 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:outline-none font-medium text-gray-900" required />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Course</label>
                    <input type="text" value={formData.course || ''} onChange={e => setFormData({...formData, course: e.target.value})} className="w-full px-4 py-2 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:outline-none font-medium text-gray-900" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Year Level</label>
                      <input type="number" value={formData.year_level || ''} onChange={e => setFormData({...formData, year_level: parseInt(e.target.value)})} className="w-full px-4 py-2 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:outline-none font-medium text-gray-900" required />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Email</label>
                      <input type="email" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:outline-none font-medium text-gray-900" required />
                    </div>
                  </div>
                </>
              )}
              {modalType === 'library' && (
                <>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Library Name</label>
                    <input type="text" value={formData.library_name || ''} onChange={e => setFormData({...formData, library_name: e.target.value})} className="w-full px-4 py-2 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:outline-none font-medium text-gray-900" required />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Location</label>
                    <input type="text" value={formData.location || ''} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-2 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:outline-none font-medium text-gray-900" required />
                  </div>
                </>
              )}
              {modalType === 'admin' && (
                <>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Admin Name</label>
                    <input type="text" value={formData.admin_name || ''} onChange={e => setFormData({...formData, admin_name: e.target.value})} className="w-full px-4 py-2 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:outline-none font-medium text-gray-900" required />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Username</label>
                    <input type="text" value={formData.username || ''} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full px-4 py-2 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:outline-none font-medium text-gray-900" required />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Password</label>
                    <input type="password" value={formData.password || ''} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-2 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:outline-none font-medium text-gray-900" required={!editingId} />
                  </div>
                </>
              )}
              {modalType === 'qrcode' && (
                <>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">QR Value</label>
                    <input type="text" value={formData.qr_value || ''} onChange={e => setFormData({...formData, qr_value: e.target.value})} className="w-full px-4 py-2 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:outline-none font-medium text-gray-900" required />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Status</label>
                    <select value={formData.status || 'active'} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:outline-none font-medium text-gray-900">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Admin</label>
                    <select value={formData.admin_id || ''} onChange={e => setFormData({...formData, admin_id: parseInt(e.target.value)})} className="w-full px-4 py-2 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:outline-none font-medium text-gray-900" required>
                      <option value="">Select Admin</option>
                      {admins.map(adm => (
                        <option key={adm.admin_id} value={adm.admin_id}>{adm.admin_name}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black transition-all shadow-lg shadow-blue-200">
                  {editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
