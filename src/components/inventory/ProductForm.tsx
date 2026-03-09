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

interface ProductFormProps {
    onSubmit: (data: ProductFormInput) => void;
    onCancel: () => void;
    initialData?: Partial<ProductFormInput>;
    isLoading?: boolean;
}

export function ProductForm({ onSubmit, onCancel, initialData, isLoading }: ProductFormProps) {

    const form = useForm<ProductFormInput>({
        resolver: zodResolver(productFormSchema),
        defaultValues: initialData || {
            name: "",
            sku: "",
            price: undefined,
            stockLevel: undefined,
            category: 'electronics',
            attributes: {
                brand: '',
                warrantyMonths: 12,
            },
        },
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

    //     useEffect(() => {
    //     if (initialData) {
    //         form.reset(initialData);
    //     } else {
    //         form.reset();
    //     }
    // }, [initialData, form]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Category */}
                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Category <span className="text-red-500">*</span>
                            </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="electronics">Electronics</SelectItem>
                                    <SelectItem value="clothing">Clothing</SelectItem>
                                    <SelectItem value="books">Books</SelectItem>
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
                            <FormLabel>
                                Product Name <span className="text-red-500">*</span>
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
                            <FormLabel>
                                SKU <span className="text-red-500">*</span>
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
                            <FormLabel>
                                Price ($) <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={field.value ?? ''}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value === '') {
                                            field.onChange(undefined); // Let Zod validate
                                        } else {
                                            const numValue = Number(value);
                                            field.onChange(isNaN(numValue) ? undefined : numValue);
                                        }
                                    }}
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
                            <FormLabel>
                                Stock Level <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="0"
                                    value={field.value ?? ''}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value === '') {
                                            field.onChange(undefined); // Let Zod validate
                                        } else {
                                            const numValue = Number(value);
                                            field.onChange(isNaN(numValue) ? undefined : numValue);
                                        }
                                    }}
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
                                        <FormLabel>Brand</FormLabel>
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
                                        <FormLabel>Warranty (Months)</FormLabel>
                                        <Select onValueChange={(v) => field.onChange(Number(v))} 
                                        value={field.value?.toString()|| "12"} >
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
                                        <FormLabel>Size</FormLabel>
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
                                        <FormLabel>Material</FormLabel>
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
                                        <FormLabel>Author</FormLabel>
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
                                        <FormLabel>Genre</FormLabel>
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