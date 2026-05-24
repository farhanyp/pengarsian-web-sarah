import { useForm } from '@inertiajs/react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DocumentModel } from '@/types/dokumen';

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    doc: DocumentModel | null;
}

export function DeleteModal({ isOpen, onClose, doc }: DeleteModalProps) {
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        if (!doc) return;
        destroy(`/dokumen/${doc.id}`, {
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Hapus Dokumen</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <p className="text-sm text-muted-foreground">
                        Apakah Anda yakin ingin menghapus dokumen <strong>{doc?.title}</strong>? Tindakan ini tidak dapat dibatalkan.
                    </p>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={processing}>Batal</Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={processing}>Hapus</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
