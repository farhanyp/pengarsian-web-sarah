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
import { DocumentModel } from '@/types/dokumen';

interface EditModalProps {
    isOpen: boolean;
    onClose: () => void;
    doc: DocumentModel | null;
}

export function EditModal({ isOpen, onClose, doc }: EditModalProps) {
    const { data, setData, put, processing, errors, reset } = useForm({
        title: '',
    });

    useEffect(() => {
        if (doc) {
            setData({
                title: doc.title,
            });
        }
    }, [doc]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!doc) return;
        put(`/dokumen/${doc.id}`, {
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
                    <DialogTitle>Edit Dokumen</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-title">Nama Dokumen</Label>
                        <Input
                            id="edit-title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            required
                        />
                        {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
                        <Button type="submit" disabled={processing}>Simpan Perubahan</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
