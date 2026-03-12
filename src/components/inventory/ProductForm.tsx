import { ProductFormInput, productFormSchema } from "@/schemas/product.schema";
import { useEffect, useRef } from "react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2 } from "lucide-react";
import { ProductFormData } from "@/types/inventory";

interface ProductFormProps {
    onSubmit: (data: ProductFormData) => void;
    onCancel: () => void;
    initialData?: any;
    isLoading?: boolean;
}

export function ProductForm({ onSubmit, onCancel, initialData, isLoading }: ProductFormProps) {

    const categoryItems = [{name:'Electronics', value:'electronics'}, {name: 'Clothing' ,value:'clothing'}, {name: 'Books' ,value:'books'}];

    const form = useForm<ProductFormInput>({
        resolver: zodResolver(productFormSchema),
        defaultValues: {
            ...initialData,
            // Convert numbers to strings for the form state
            price: initialData?.price?.toString() ?? "",
            stockLevel: initialData?.stockLevel?.toString() ?? "",
            name: initialData?.name ?? "",
            sku: initialData?.sku ?? "",
            category: initialData?.category ?? 'electronics',
            attributes: initialData?.attributes ?? { brand: '', warrantyMonths: 12 }
        } as any, // Cast to any once to allow the string/number transition
    });

    // Watch category to change dynamic fields
    const selectedCategory = form.watch("category");
    const previousCategoryRef = useRef(selectedCategory);

    // Store original category and attributes for edit mode
    const originalDataRef = useRef(initialData ? {
        category: initialData.category,
        attributes: initialData.attributes
    } : null);

    // Reset attributes when category changes to maintain schema integrity
    useEffect(() => {
        // Only reset if category actually changed (not on initial mount/remount)
        if (previousCategoryRef.current === selectedCategory) {
            return;
        }

        // If switching back to original category in edit mode, restore original data
        if (originalDataRef.current && selectedCategory === originalDataRef.current.category && originalDataRef.current.attributes) {
            form.setValue("attributes", originalDataRef.current.attributes);
        } else {
            // Reset to defaults
            if (selectedCategory === "electronics") {
                form.setValue("attributes", { brand: "", warrantyMonths: 12 });
            } else if (selectedCategory === "clothing") {
                form.setValue("attributes", { size: "" as any, material: "" as any });
            } else if (selectedCategory === "books") {
                form.setValue("attributes", { author: "", genre: "" as any });
            }
        }
        previousCategoryRef.current = selectedCategory;
    }, [selectedCategory, form]);

    const handleActualSubmit = (data: ProductFormInput) => {
        // Convert the strings back to numbers before sending to the API/Mutation
        const formattedData: ProductFormData = {
            ...data,
            price: Number(data.price),
            stockLevel: Number(data.stockLevel),
        }as ProductFormData;
        onSubmit(formattedData);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleActualSubmit)} className="space-y-4">
                {/* Category */}
                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel required>
                                Category 
                            </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {categoryItems.map(item => <SelectItem value={item.value}>{item.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* Product Name */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel required>
                                Product Name 
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="Enter product name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* SKU */}
                <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel required>
                                SKU 
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="ELEC-001" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Price */}
                <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel required>
                                Price ($) 
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="0.00"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Stock Level */}
                <FormField
                    control={form.control}
                    name="stockLevel"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel required>
                                Stock Level 
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="text" 
                                    placeholder="0"
                                    {...field}
                                    
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* DYNAMIC FIELDS SECTION */}
                <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-900 space-y-4">
                    <h3 className="font-medium text-sm text-slate-500 uppercase tracking-wider">
                        {selectedCategory} Specifications
                    </h3>

                    {selectedCategory === "electronics" && (
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="attributes.brand"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel required>Brand</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="attributes.warrantyMonths"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel required>Warranty (Months)</FormLabel>
                                        <Select onValueChange={(v) => field.onChange(Number(v))}
                                            value={field.value?.toString() || "12"} >
                                            <FormControl>
                                                <SelectTrigger><SelectValue placeholder="Select warranty" /></SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="12">12 Months</SelectItem>
                                                <SelectItem value="24">24 Months</SelectItem>
                                                <SelectItem value="36">36 Months</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    )}

                    {selectedCategory === "clothing" && (
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="attributes.size"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel required>Size</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger><SelectValue placeholder="Select a size" /></SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="attributes.material"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel required>Material</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger><SelectValue placeholder="Select a material" /></SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {['Cotton', 'Polyester', 'Wool', 'Silk', 'Blend'].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    )}

                    {selectedCategory === "books" && (
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="attributes.author"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel required>Author</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="attributes.genre"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel required>Genre</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger><SelectValue placeholder="Select a genre" /></SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {['Fiction', 'Non-Fiction', 'Science', 'History', 'Children', 'Biography'].map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    )}

                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading || form.formState.isSubmitting}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            'Submit'
                        )}
                    </Button>
                </div>
            </form>
        </Form>

    );
}