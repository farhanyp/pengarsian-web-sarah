import { Head, Link, useForm, router } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import {
    Search,
    Plus,
    Filter,
    MoreVertical,
    FileText,
    FileSpreadsheet,
    Image as ImageIcon,
    File,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Bell,
    Settings
} from 'lucide-react';
import { useState } from 'react';
import { DocumentModel, PaginatedData } from '@/types/dokumen';
import { formatBytes } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CreateModal } from './CreateModal';
import { EditModal } from './EditModal';
import { DeleteModal } from './DeleteModal';

interface IndexProps {
    documents: PaginatedData<DocumentModel>;
    filters: { search?: string };
}

export default function Index({ documents, filters }: IndexProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [createModalType, setCreateModalType] = useState<'masuk' | 'keluar' | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<DocumentModel | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/dokumen', { search: searchQuery }, { preserveState: true });
    };

    const getIconForType = (url: string) => {
        if (!url) return <File className="w-5 h-5 text-primary" />;
        const ext = url.split('.').pop()?.toLowerCase();
        if (['pdf'].includes(ext || '')) return <FileText className="w-5 h-5 text-red-500" />;
        if (['xls', 'xlsx', 'csv'].includes(ext || '')) return <FileSpreadsheet className="w-5 h-5 text-green-500" />;
        if (['png', 'jpg', 'jpeg', 'gif'].includes(ext || '')) return <ImageIcon className="w-5 h-5 text-blue-500" />;
        if (['doc', 'docx'].includes(ext || '')) return <FileText className="w-5 h-5 text-blue-600" />;
        return <File className="w-5 h-5 text-primary" />;
    };

    const getTypeName = (url: string) => {
        if (!url) return 'Unknown Document';
        const ext = url.split('.').pop()?.toLowerCase();
        if (['pdf'].includes(ext || '')) return 'PDF Document';
        if (['xls', 'xlsx'].includes(ext || '')) return 'Excel Spreadsheet';
        if (['png', 'jpg', 'jpeg'].includes(ext || '')) return 'Image File';
        if (['doc', 'docx'].includes(ext || '')) return 'Word Document';
        return 'Document';
    };

    return (
        <>
            <Head title="Repositori Dokumen" />

            <div className="flex flex-col min-h-[calc(100vh-theme(spacing.16))]">
                {/* TopNavBar Shell (Desktop specific view integration) */}
                <header className="hidden md:flex w-full px-4 md:px-8 py-4 md:py-6 sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-border flex-col justify-center shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div>
                                <h2 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">Repositori Dokumen</h2>
                                <p className="text-xs md:text-sm text-muted-foreground max-w-2xl mt-1">
                                    Pusat penyimpanan aman untuk seluruh dokumen institusi.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mt-2 md:mt-0">
                            <button className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-muted hidden md:flex">
                                <Bell className="w-5 h-5" />
                            </button>
                            <button className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-muted hidden md:flex">
                                <Settings className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Content Canvas */}
                <section className="p-4 md:p-8 flex flex-col gap-6 md:gap-8 flex-1">

                    {/* Main Table Section */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-2">
                        <form onSubmit={handleSearch} className="relative w-full flex-1 xl:max-w-2xl group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors" />
                            <input
                                className="w-full bg-muted/30 hover:bg-muted/50 border border-border rounded-xl py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground/50"
                                placeholder="Cari dokumen institusi..."
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </form>
                        <div className="flex gap-2 w-full md:w-auto">
                            <Button
                                onClick={() => { setCreateModalType('masuk'); setIsCreateModalOpen(true); }}
                                className="w-full md:w-auto bg-primary text-primary-foreground px-4 py-5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all"
                            >
                                <Plus className="w-5 h-5" />
                                Surat Masuk
                            </Button>
                            <Button
                                onClick={() => { setCreateModalType('keluar'); setIsCreateModalOpen(true); }}
                                className="w-full md:w-auto bg-primary text-primary-foreground px-4 py-5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all"
                            >
                                <Plus className="w-5 h-5" />
                                Surat Keluar
                            </Button>
                        </div>
                    </div>

                    <div className="bg-card/50 backdrop-blur-xl rounded-2xl border border-border overflow-hidden shadow-lg flex flex-col flex-1">
                        <div className="p-4 md:p-6 border-b border-border/50 flex justify-between items-center bg-muted/30">
                            <h3 className="text-lg font-bold text-foreground">Unggahan Terbaru</h3>
                            <div className="flex gap-2">
                                <button className="p-2 text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors border border-border/50">
                                    <Filter className="w-5 h-5" />
                                </button>
                                <button className="p-2 text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors border border-border/50">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto flex-1">
                            <table className="w-full text-left border-collapse min-w-[800px]">
                                <thead className="bg-muted/50 border-b border-border">
                                    <tr>
                                        <th className="px-6 py-4 text-xs text-muted-foreground font-semibold tracking-widest uppercase">No</th>
                                        <th className="px-6 py-4 text-xs text-muted-foreground font-semibold tracking-widest uppercase">Nama Dokumen</th>
                                        <th className="px-6 py-4 text-xs text-muted-foreground font-semibold tracking-widest uppercase">Tipe Surat</th>
                                        <th className="px-6 py-4 text-xs text-muted-foreground font-semibold tracking-widest uppercase">Status</th>
                                        <th className="px-6 py-4 text-xs text-muted-foreground font-semibold tracking-widest uppercase">Tanggal Diunggah</th>
                                        <th className="px-6 py-4 text-xs text-muted-foreground font-semibold tracking-widest uppercase">Ukuran</th>
                                        <th className="px-6 py-4 text-xs text-muted-foreground font-semibold tracking-widest uppercase text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {documents.data.length > 0 ? (
                                        documents.data.map((doc, idx) => (
                                            <tr key={doc.id} className="hover:bg-primary/5 transition-colors group">
                                                <td className="px-6 py-4 text-sm text-muted-foreground font-mono">
                                                    {(documents.current_page - 1) * 10 + idx + 1}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        {getIconForType(doc.current_url)}
                                                        <span className="text-sm font-semibold text-foreground">{doc.title}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                                                        doc.incoming_mail ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : 
                                                        doc.outgoing_mail ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' : 
                                                        'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                                                    }`}>
                                                        {doc.incoming_mail ? 'Surat Masuk' : doc.outgoing_mail ? 'Surat Keluar' : 'Dokumen'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                                                        doc.status === 'ARCHIVED' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : 
                                                        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                    }`}>
                                                        {doc.status || 'ARCHIVED'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-muted-foreground">
                                                    {new Date(doc.created_at).toLocaleDateString('id-ID', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-muted-foreground font-mono">
                                                    {formatBytes(doc.file_size || Math.floor(Math.random() * 5000000))}
                                                </td>
                                                <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedDocument(doc);
                                                            setIsEditModalOpen(true);
                                                        }}
                                                        className="text-muted-foreground hover:text-primary hover:bg-primary/10 p-2 rounded transition-all opacity-0 group-hover:opacity-100" title="Edit"
                                                    >
                                                        <FileText className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedDocument(doc);
                                                            setIsDeleteModalOpen(true);
                                                        }}
                                                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 p-2 rounded transition-all opacity-0 group-hover:opacity-100" title="Delete"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                                                Tidak ada dokumen ditemukan.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Footer */}
                        {documents.data.length > 0 && (
                            <div className="px-4 py-3 bg-muted/30 border-t border-border flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                    Menampilkan <span className="text-foreground font-bold">{documents.data.length}</span> dari <span className="text-foreground font-bold">{documents.total}</span> dokumen
                                </p>
                                <div className="flex gap-1">
                                    {documents.links.map((link, idx) => {
                                        if (link.label.includes('Previous')) {
                                            return (
                                                <Link
                                                    key={idx}
                                                    href={link.url || '#'}
                                                    className={`p-1 text-muted-foreground hover:text-primary hover:bg-muted rounded border border-border/50 transition-colors ${!link.url && 'opacity-50 cursor-not-allowed pointer-events-none'}`}
                                                >
                                                    <ChevronLeft className="w-5 h-5" />
                                                </Link>
                                            );
                                        }
                                        if (link.label.includes('Next')) {
                                            return (
                                                <Link
                                                    key={idx}
                                                    href={link.url || '#'}
                                                    className={`p-1 text-muted-foreground hover:text-primary hover:bg-muted rounded border border-border/50 transition-colors ${!link.url && 'opacity-50 cursor-not-allowed pointer-events-none'}`}
                                                >
                                                    <ChevronRight className="w-5 h-5" />
                                                </Link>
                                            );
                                        }
                                        return (
                                            <Link
                                                key={idx}
                                                href={link.url || '#'}
                                                className={`w-8 h-8 flex items-center justify-center rounded font-bold text-sm transition-colors ${link.active
                                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                                    : 'text-muted-foreground hover:text-primary hover:bg-muted'
                                                    } ${!link.url && 'opacity-50 cursor-not-allowed pointer-events-none'}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            <CreateModal
                isOpen={isCreateModalOpen}
                onClose={() => {
                    setIsCreateModalOpen(false);
                    setCreateModalType(null);
                }}
                type={createModalType}
            />

            <EditModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedDocument(null);
                }}
                doc={selectedDocument}
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedDocument(null);
                }}
                doc={selectedDocument}
            />
        </>
    );
}
