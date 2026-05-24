import { useForm } from '@inertiajs/react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect } from 'react';

interface CreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'masuk' | 'keluar' | null;
}

export function CreateModal({ isOpen, onClose, type }: CreateModalProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        file: null as File | null,
        type: type || 'masuk',
    });

    useEffect(() => {
        if (type) {
            setData('type', type);
        }
    }, [type]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/dokumen', {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Tambah Surat {type === 'masuk' ? 'Masuk' : 'Keluar'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Judul Surat</Label>
                        <Input
                            id="title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder="Contoh: Laporan Keuangan"
                            required
                        />
                        {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="file">File Dokumen</Label>
                        <Input
                            id="file"
                            type="file"
                            onChange={(e) => setData('file', e.target.files?.[0] || null)}
                            required
                        />
                        {errors.file && <p className="text-sm text-destructive">{errors.file}</p>}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
                        <Button type="submit" disabled={processing}>Simpan</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
