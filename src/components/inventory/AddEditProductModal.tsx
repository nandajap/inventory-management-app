import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { ProductForm } from './ProductForm';
import { productService } from '@/services/productService';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Product } from '@/types/inventory';
import { useToast } from '@/hooks/use-toast';
import { ProductFormData } from '@/types/inventory';

interface AddEditProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: 'add' | 'edit';
    initialData?: Product
}

export default function AddEditProductModal({ isOpen, onClose, mode, initialData }: AddEditProductModalProps) {

    const { toast } = useToast();
    const queryClient = useQueryClient();
    // PHASE 6: The Mutation
    const { mutateAsync, isPending } = useMutation({
        mutationFn: (data: ProductFormData) => {
            if (mode === 'edit' && initialData?.id) {
                // Call PATCH /products/:id
                return productService.updateProduct(initialData.id, data);
            }
            // Call POST /products
            return productService.createProduct(data);
        },
        onSuccess: () => {
            //refresh table data
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast({
                title: mode === 'add' ? "Product Created" : "Product Updated",
                description: `Successfully ${mode === 'add' ? 'added' : 'updated'} the product in your inventory.`,
                variant: "default", 
            })
            onClose();
        },
        onError: (error) => {
            console.error("Submission failed:", error);
            alert("Error creating product. Check console.");
        }
    });

    const handleFormSubmit = async (data: ProductFormData) => {
        console.log('Form submitted:', data);
        mutateAsync(data);
    };

    const title = mode === 'add' ? "Add New Product" : "Edit Product";


    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                <ProductForm
                    onSubmit={handleFormSubmit}
                    onCancel={onClose}
                    initialData={initialData}
                    isLoading={isPending}
                >
                </ProductForm>
            </DialogContent>
        </Dialog>
    );
}