import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { ProductForm } from './ProductForm';
import { BaseFormData } from '../../schemas/product.schema';

interface AddEditProductModalProps {
    isOpen: boolean,
    onClose: () => void,
    mode: 'add' | 'edit'
}

export default function AddEditProductModal({ isOpen, onClose, mode }: AddEditProductModalProps) {

    const title = mode === 'add' ? "Add New Product" : "Edit Product";
    
    const handleFormSubmit = (data: BaseFormData) => {
        console.log('Form submitted:', data);
        // TODO: Phase 5 will handle actual save
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                <ProductForm
                    onSubmit={handleFormSubmit}
                    onCancel={onClose}
                >
                </ProductForm>
            </DialogContent>
        </Dialog>
    );
}