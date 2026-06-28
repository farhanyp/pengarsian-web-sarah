import { useState, useEffect } from 'react';
import { X, Download, FileSpreadsheet, CheckSquare, Square, Search } from 'lucide-react';
import { useForm } from '@inertiajs/react';
import { Student, Subject } from '@/types/nilai-siswa';

interface SchoolClass {
    id: number;
    name: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    students: Student[];
    subjects: Subject[];
    classes: SchoolClass[];
    availableAcademicYears: { id: string; name: string }[];
}

export default function DownloadNilaiModal({ isOpen, onClose, students, subjects, classes, availableAcademicYears }: Props) {
    const { data, setData, reset } = useForm({
        academic_year: availableAcademicYears[0]?.id || '',
        semester_ids: [] as string[],
        class_ids: [] as number[],
        mapel_ids: [] as string[],
        siswa_ids: [] as string[],
    });

    const [isProcessing, setIsProcessing] = useState(false);
    const [studentSearch, setStudentSearch] = useState('');

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            reset();
            setStudentSearch('');
            setIsProcessing(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // Filter students based on search and selected classes
    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name?.toLowerCase().includes(studentSearch.toLowerCase()) || 
                              student.nis?.includes(studentSearch);
        
        // If classes are selected, only show students from those classes
        // (Note: in a real complex app, we'd check student.classes, but for simplicity we rely on the backend for exact filtering.
        // Here we just show all students matching search if no class selected, otherwise we'd need classes relation on student prop).
        // For now, we just filter by search.
        return matchesSearch;
    });

    const toggleArrayItem = (key: 'semester_ids' | 'class_ids' | 'mapel_ids' | 'siswa_ids', value: any) => {
        const current = data[key] as any[];
        const isSelected = current.includes(value);
        if (isSelected) {
            setData(key, current.filter(item => item !== value));
        } else {
            setData(key, [...current, value]);
        }
    };

    const toggleAll = (key: 'class_ids' | 'mapel_ids' | 'siswa_ids', items: any[], itemKey: string) => {
        const allIds = items.map(item => item[itemKey]);
        const current = data[key] as any[];
        if (current.length === allIds.length) {
            setData(key, []);
        } else {
            setData(key, allIds);
        }
    };

    const handleDownload = () => {
        setIsProcessing(true);

        // Serialize data into query params
        const params = new URLSearchParams();
        if (data.academic_year) params.append('academic_year', data.academic_year);
        
        data.semester_ids.forEach(id => params.append('semester_ids[]', id));
        data.class_ids.forEach(id => params.append('class_ids[]', id.toString()));
        data.mapel_ids.forEach(id => params.append('mapel_ids[]', id.toString()));
        data.siswa_ids.forEach(id => params.append('siswa_ids[]', id));

        const url = `/data-nilai-siswa/download-report?${params.toString()}`;

        // Trigger download
        window.location.href = url;

        // Reset processing state after a short delay since we can't reliably detect when download starts
        setTimeout(() => {
            setIsProcessing(false);
            onClose();
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                onClick={() => !isProcessing && onClose()}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-background dark:bg-slate-900 w-full max-w-4xl mx-4 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-border/50 animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-border/50 flex items-center justify-between bg-muted/20">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                            <FileSpreadsheet className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-foreground">Unduh Laporan Nilai</h2>
                            <p className="text-sm text-muted-foreground mt-0.5">Filter data nilai yang ingin diekspor ke Excel</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        disabled={isProcessing}
                        className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors disabled:opacity-50"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    
                    {/* Makro Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-foreground">Tahun Ajaran</label>
                            <select 
                                className="w-full px-4 py-2.5 bg-background border border-border/50 rounded-xl text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                                value={data.academic_year}
                                onChange={e => setData('academic_year', e.target.value)}
                            >
                                <option value="">Semua Tahun Ajaran</option>
                                {availableAcademicYears.map(year => (
                                    <option key={year.id} value={year.id}>{year.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-foreground">Semester</label>
                            <div className="flex gap-4 pt-2">
                                {['Ganjil', 'Genap'].map(sem => (
                                    <label key={sem} className="flex items-center gap-2 cursor-pointer group">
                                        <div className="text-muted-foreground group-hover:text-emerald-600 transition-colors">
                                            {data.semester_ids.includes(sem) ? 
                                                <CheckSquare className="w-5 h-5 text-emerald-600" /> : 
                                                <Square className="w-5 h-5" />
                                            }
                                        </div>
                                        <input 
                                            type="checkbox" 
                                            className="hidden"
                                            checked={data.semester_ids.includes(sem)}
                                            onChange={() => toggleArrayItem('semester_ids', sem)}
                                        />
                                        <span className="text-sm font-medium">{sem}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-border/50"></div>

                    {/* Kelas Filter */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-bold text-foreground">Kelas</label>
                            <button 
                                onClick={() => toggleAll('class_ids', classes, 'id')}
                                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                            >
                                {data.class_ids.length === classes.length && classes.length > 0 ? 'Deselect All' : 'Pilih Semua Kelas'}
                            </button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                            {classes.map(cls => (
                                <label 
                                    key={cls.id} 
                                    className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${data.class_ids.includes(cls.id) ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-700 dark:text-emerald-400' : 'bg-background border-border/50 hover:border-emerald-500/30'}`}
                                >
                                    <input 
                                        type="checkbox" 
                                        className="hidden"
                                        checked={data.class_ids.includes(cls.id)}
                                        onChange={() => toggleArrayItem('class_ids', cls.id)}
                                    />
                                    <span className="text-sm font-semibold truncate">{cls.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Mata Pelajaran Filter */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-bold text-foreground">Mata Pelajaran</label>
                            <button 
                                onClick={() => toggleAll('mapel_ids', subjects, 'id')}
                                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                            >
                                {data.mapel_ids.length === subjects.length && subjects.length > 0 ? 'Deselect All' : 'Pilih Semua Mapel'}
                            </button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {subjects.map(subject => (
                                <label 
                                    key={subject.id} 
                                    className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${data.mapel_ids.includes(subject.id) ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-700 dark:text-emerald-400' : 'bg-background border-border/50 hover:border-emerald-500/30'}`}
                                >
                                    <input 
                                        type="checkbox" 
                                        className="hidden"
                                        checked={data.mapel_ids.includes(subject.id)}
                                        onChange={() => toggleArrayItem('mapel_ids', subject.id)}
                                    />
                                    <span className="text-sm font-semibold truncate">{subject.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Siswa Filter */}
                    <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <label className="text-sm font-bold text-foreground">Siswa Spesifik <span className="text-xs font-normal text-muted-foreground">(Opsional)</span></label>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <input 
                                        type="text" 
                                        placeholder="Cari siswa..." 
                                        className="pl-9 pr-3 py-1.5 text-sm bg-background border border-border/50 rounded-lg focus:border-emerald-500 outline-none w-full sm:w-48"
                                        value={studentSearch}
                                        onChange={e => setStudentSearch(e.target.value)}
                                    />
                                </div>
                                <button 
                                    onClick={() => toggleAll('siswa_ids', filteredStudents, 'id')}
                                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors whitespace-nowrap"
                                >
                                    {data.siswa_ids.length === filteredStudents.length && filteredStudents.length > 0 ? 'Deselect All' : 'Pilih Semua'}
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                            {filteredStudents.map(student => (
                                <label 
                                    key={student.id} 
                                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${data.siswa_ids.includes(student.id) ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-700 dark:text-emerald-400' : 'bg-background border-border/50 hover:border-emerald-500/30'}`}
                                >
                                    <div className="mt-0.5 text-muted-foreground">
                                        {data.siswa_ids.includes(student.id) ? 
                                            <CheckSquare className="w-4 h-4 text-emerald-600" /> : 
                                            <Square className="w-4 h-4" />
                                        }
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        className="hidden"
                                        checked={data.siswa_ids.includes(student.id)}
                                        onChange={() => toggleArrayItem('siswa_ids', student.id)}
                                    />
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-semibold truncate">{student.name}</p>
                                        <p className="text-xs text-muted-foreground font-mono mt-0.5">{student.nis}</p>
                                    </div>
                                </label>
                            ))}
                            {filteredStudents.length === 0 && (
                                <div className="col-span-full py-8 text-center text-sm text-muted-foreground">
                                    Tidak ada siswa yang sesuai pencarian.
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-border/50 bg-muted/20 flex justify-end gap-3">
                    <button 
                        onClick={onClose}
                        disabled={isProcessing}
                        className="px-5 py-2.5 text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all disabled:opacity-50"
                    >
                        Batal
                    </button>
                    <button 
                        onClick={handleDownload}
                        disabled={isProcessing}
                        className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isProcessing ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Memproses...</span>
                            </>
                        ) : (
                            <>
                                <Download className="w-4 h-4" />
                                <span>Generate Excel</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
