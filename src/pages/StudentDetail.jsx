import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/axios';
import { ArrowLeft, Check, X, CheckCircle2, History, Trash2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StudentDetail() {
  const { nim } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // State for selections
  const [selectedSurahs, setSelectedSurahs] = useState([]);
  const [selectedToDelete, setSelectedToDelete] = useState([]);
  
  // Action state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    fetchStudentData();
  }, [nim]);

  const fetchStudentData = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/mahasiswa/setoran/${nim}`);
      if (response.data?.response) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error("Failed fetching student data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSurah = (surah) => {
    if (selectedSurahs.some(s => s.id_komponen_setoran === surah.id)) {
      setSelectedSurahs(selectedSurahs.filter(s => s.id_komponen_setoran !== surah.id));
    } else {
      setSelectedSurahs([...selectedSurahs, {
        id_komponen_setoran: surah.id,
        nama_komponen_setoran: surah.nama
      }]);
    }
  };

  const handleToggleDelete = (surah) => {
    if (selectedToDelete.some(s => s.id_komponen_setoran === surah.id)) {
      setSelectedToDelete(selectedToDelete.filter(s => s.id_komponen_setoran !== surah.id));
    } else {
      setSelectedToDelete([...selectedToDelete, {
        id: surah.info_setoran.id,
        id_komponen_setoran: surah.id,
        nama_komponen_setoran: surah.nama
      }]);
    }
  };

  const handleSimpanSetoran = async () => {
    if (selectedSurahs.length === 0) return;
    setIsSubmitting(true);
    setMessage('');
    try {
      const response = await api.post(`/mahasiswa/setoran/${nim}`, {
        data_setoran: selectedSurahs
      });
      setMessage({ type: 'success', text: response.data.message });
      setSelectedSurahs([]);
      fetchStudentData();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Gagal menyimpan setoran' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBatalkanSetoran = async () => {
    if (selectedToDelete.length === 0) return;
    setIsDeleting(true);
    setMessage('');
    try {
      const response = await api.delete(`/mahasiswa/setoran/${nim}`, {
        data: { data_setoran: selectedToDelete }
      });
      setMessage({ type: 'success', text: response.data.message });
      setSelectedToDelete([]);
      fetchStudentData();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Gagal membatalkan setoran' });
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-brand-500" />
      </div>
    );
  }

  if (!data) {
    return <div className="text-center p-8">Gagal memuat data mahasiswa.</div>;
  }

  const { info, setoran } = data;
  const { detail, log, info_dasar } = setoran;

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="text-slate-600 dark:text-slate-300" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Rincian Mahasiswa armadhan fithra</h1>
      </div>

      {message && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl border ${message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-300' : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300'}`}
        >
          {message.text}
        </motion.div>
      )}

      {/* Info Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{info.nama}</h2>
            <p className="text-slate-500 dark:text-slate-400">{info.nim}</p>
            <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <p><span className="font-medium">Angkatan:</span> {info.angkatan}</p>
              <p><span className="font-medium">Semester:</span> {info.semester}</p>
              <p><span className="font-medium">Email:</span> {info.email}</p>
            </div>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50">
            <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-2">Progres Keseluruhan</h3>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-3xl font-extrabold text-brand-600 dark:text-brand-400">
                {info_dasar.persentase_progres_setor}%
              </span>
              <span className="text-sm text-slate-500 pb-1">selesai</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-4">
              <div 
                className="bg-brand-500 h-2 rounded-full transition-all duration-1000" 
                style={{ width: `${info_dasar.persentase_progres_setor}%` }}
              ></div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <span className="font-medium text-slate-900 dark:text-white">{info_dasar.total_sudah_setor}</span> dari <span className="font-medium text-slate-900 dark:text-white">{info_dasar.total_wajib_setor}</span> surah telah disetorkan.
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Detail Setoran */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Daftar Surah Wajib Setor</h3>
              <div className="flex gap-2 text-sm">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-brand-500"></span> Selesai</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-600"></span> Belum</span>
              </div>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-2">
              {detail.map((surah) => {
                const isCompleted = surah.sudah_setor;
                const isSelectedToSave = selectedSurahs.some(s => s.id_komponen_setoran === surah.id);
                const isSelectedToDelete = selectedToDelete.some(s => s.id_komponen_setoran === surah.id);
                
                return (
                  <div 
                    key={surah.id}
                    onClick={() => {
                      if (isCompleted) {
                        handleToggleDelete(surah);
                      } else {
                        handleToggleSurah(surah);
                      }
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isCompleted 
                        ? isSelectedToDelete
                          ? 'bg-red-50 border-red-300 dark:bg-red-900/20 dark:border-red-700'
                          : 'bg-emerald-50/50 border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-800'
                        : isSelectedToSave
                          ? 'bg-brand-50 border-brand-300 dark:bg-brand-900/20 dark:border-brand-700'
                          : 'bg-white border-slate-200 hover:border-brand-300 dark:bg-slate-800 dark:border-slate-700 dark:hover:border-brand-600'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 dark:text-slate-100">{surah.nama}</span>
                          <span className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full">{surah.label}</span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-arabic mt-1" dir="rtl">{surah.nama_arab}</p>
                      </div>
                      
                      <div className="flex items-center justify-center w-6 h-6 rounded-full border border-slate-300 dark:border-slate-600">
                        {isCompleted && !isSelectedToDelete && <CheckCircle2 className="text-brand-500" size={20} />}
                        {isSelectedToSave && <Check className="text-brand-600 dark:text-brand-400" size={16} />}
                        {isSelectedToDelete && <Trash2 className="text-red-500" size={16} />}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Actions & Logs */}
        <div className="space-y-6">
          {/* Actions */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 sticky top-24">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Aksi</h3>
            
            <div className="space-y-4">
              <button
                onClick={handleSimpanSetoran}
                disabled={selectedSurahs.length === 0 || isSubmitting}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : <Check size={18} />}
                Validasi ({selectedSurahs.length}) Surah
              </button>

              <button
                onClick={handleBatalkanSetoran}
                disabled={selectedToDelete.length === 0 || isDeleting}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-red-200 dark:border-red-800 rounded-xl shadow-sm text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isDeleting ? <Loader2 className="animate-spin h-4 w-4" /> : <Trash2 size={18} />}
                Batalkan ({selectedToDelete.length}) Surah
              </button>
            </div>
            
            {(selectedSurahs.length > 0 || selectedToDelete.length > 0) && (
              <p className="text-xs text-slate-500 mt-4 text-center">
                Pilih surah dari daftar di samping untuk melakukan aksi.
              </p>
            )}
          </div>

          {/* History */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <History size={20} className="text-slate-400" />
                Riwayat
              </h3>
            </div>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {log?.length > 0 ? (
                log.map((entry) => (
                  <div key={entry.id} className="relative pl-4 border-l-2 border-slate-200 dark:border-slate-700 pb-4 last:pb-0">
                    <div className={`absolute -left-[5px] top-1 w-2 h-2 rounded-full ${entry.aksi === 'VALIDASI' ? 'bg-brand-500' : 'bg-red-500'}`}></div>
                    <p className="text-xs text-slate-400 mb-1">
                      {new Date(entry.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' })}
                    </p>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      {entry.aksi === 'VALIDASI' ? 'Validasi' : 'Pembatalan'} Setoran
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {entry.keterangan}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 text-center py-4">Belum ada riwayat</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
