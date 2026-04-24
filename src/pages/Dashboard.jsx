import React, { useState, useEffect } from 'react';
import { api } from '../api/axios';
import { Link } from 'react-router-dom';
import { Users, Search, ChevronRight, BarChart3, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('/dosen/pa-saya');
      if (response.data?.response) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error("Failed fetching PA data", error);
    } finally {
      setLoading(false);
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
    return <div className="text-center p-8 text-slate-500">Gagal memuat data.</div>;
  }

  const { nama, info_mahasiswa_pa } = data;
  const students = info_mahasiswa_pa?.daftar_mahasiswa || [];
  const summary = info_mahasiswa_pa?.ringkasan || [];

  const filteredStudents = students.filter(s => 
    s.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.nim.includes(searchTerm)
  );

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700"
      >
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Assalamu'alaikum, {nama}
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Selamat datang di dashboard Setoran Hafalan. Anda memiliki total {students.length} mahasiswa PA.
        </p>
      </motion.div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {summary.map((stat, i) => (
          <motion.div
            key={stat.tahun}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-center items-center"
          >
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Angkatan {stat.tahun}</span>
            <span className="text-2xl font-bold text-brand-600 dark:text-brand-400 mt-1">{stat.total}</span>
            <span className="text-xs text-slate-400">Mahasiswa</span>
          </motion.div>
        ))}
      </div>

      {/* Student List */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="text-brand-500" size={24} />
            Daftar Mahasiswa PA
          </h2>
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Cari nama atau NIM..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {filteredStudents.map((student, idx) => {
            const { info_setoran } = student;
            const progress = info_setoran.persentase_progres_setor || 0;
            
            return (
              <motion.div
                key={student.nim}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link to={`/student/${student.nim}`} className="block h-full">
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:border-brand-500/30 dark:hover:border-brand-500/30 transition-all duration-200 h-full flex flex-col group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-1">
                          {student.nama}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{student.nim}</p>
                      </div>
                      <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs px-2.5 py-1 rounded-full font-medium">
                        Semester {student.semester}
                      </span>
                    </div>

                    <div className="mt-auto space-y-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <BarChart3 size={16} />
                        <span>Progres Hafalan</span>
                        <span className="ml-auto font-bold text-slate-900 dark:text-white">
                          {info_setoran.total_sudah_setor} / {info_setoran.total_wajib_setor}
                        </span>
                      </div>
                      
                      <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                        <div 
                          className="bg-brand-500 h-2.5 rounded-full" 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 dark:text-slate-400">
                          {progress}% Selesai
                        </span>
                        <div className="flex items-center text-brand-600 dark:text-brand-400 font-medium group-hover:translate-x-1 transition-transform">
                          Lihat Detail <ChevronRight size={14} className="ml-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
          
          {filteredStudents.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500 dark:text-slate-400">
              Tidak ada mahasiswa yang cocok dengan pencarian "{searchTerm}".
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
