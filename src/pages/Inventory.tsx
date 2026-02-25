import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchProducts, SortField, SortOrder, deleteProduct } from '../lib/mockApi';
import { Product } from '../types/inventory';
import { Pencil, Trash2, ArrowUpDown, ArrowUp, ArrowDown, Package } from 'lucide-react';
import DataTable from '../components/common/DataTable';
import Pagination from '../components/common/Pagination';

export default function Inventory() {
    const queryClient = useQueryClient();
    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Sort state
    const [sortBy, setSortBy] = useState<SortField | undefined>(undefined);
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');


    //Fetch Data (Server-Side Pagination)
    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: ['products', currentPage, pageSize, sortBy, sortOrder], // ← Cache per page+size+sort
        queryFn: () => fetchProducts(currentPage, pageSize, sortBy, sortOrder),
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
        placeholderData: (previousData) => previousData, // Keep old data while loading
    });

    const handleSort = (field: SortField) => {
        console.log(`Handle Sort click!! field: ${field} sortBy: ${sortBy}`);
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
        // Reset to first page when sorting changes
        setCurrentPage(1);
    };

    const getSortIcon = (field: SortField) => {
        if (sortBy !== field) {
            return <ArrowUpDown className="w-4 h-4 opacity-50" />
        }

        return sortOrder === 'asc' ? (
            <ArrowUp className="w-4 h-4 text-indigo-600" />
        ) : (
            <ArrowDown className="w-4 h-4 text-indigo-600" />
        );
    }

    // Handle Page Size Change
    const handlePageSizeChange = (newSize: number) => {
        setPageSize(newSize);
        setCurrentPage(1); // Reset to page 1
    };

    const handleEdit = (product: Product) => {
        console.log('Edit product:', product);
        // TODO: Will be implemented in Week 3 with modal
        alert(`Edit: ${product.name}`);
    };

    const handleDelete = async (product: Product) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${product.name}"?`
        );
        if (!confirmed) return;

        try {
            await deleteProduct(product.id);
            // Invalidate and refetch the products
            queryClient.invalidateQueries({ queryKey: ['products'] });
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Failed to delete product. Please try again.');
        }

    }

    if (error) {
        return (
            <div className="p-4 text-red-500">
                Error loading products: {error.message}
            </div>
        );
    }

    return (
        <div className="p-4">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
                <p className="text-gray-600 mt-1">Manage your product inventory</p>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {/* Loading Indicator (Background Fetches) */}
                {isFetching && (
                    <div className="bg-indigo-50 border-b border-indigo-100 px-4 py-2">
                        <div className="flex items-center gap-2 text-indigo-600 text-sm">
                            <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                            Loading page {currentPage}...
                        </div>
                    </div>
                )}

                <DataTable>
                    <DataTable.Header>
                        <DataTable.Column onClick={() => handleSort('name')} className="cursor-pointer hover:bg-gray-100 transition-colors" >
                            <div className="flex items-center gap-2">
                                Product Name
                                {getSortIcon('name')}
                            </div>
                        </DataTable.Column>
                        <DataTable.Column onClick={() => handleSort('sku')} className="cursor-pointer hover:bg-gray-100 transition-colors" >
                            <div className="flex items-center gap-2">
                                SKU
                                {getSortIcon('sku')}
                            </div>
                        </DataTable.Column>
                        <DataTable.Column onClick={() => handleSort('stockLevel')} className="cursor-pointer hover:bg-gray-100 transition-colors" >
                            <div className="flex items-center gap-2">
                                Stock Level
                                {getSortIcon('stockLevel')}
                            </div>
                        </DataTable.Column>
                        <DataTable.Column onClick={() => handleSort('price')} className="cursor-pointer hover:bg-gray-100 transition-colors">
                            <div className="flex items-center gap-2">
                                Price
                                {getSortIcon('price')}
                            </div>
                        </DataTable.Column>
                        <DataTable.Column>Actions</DataTable.Column>
                    </DataTable.Header>
                    <DataTable.Body>
                        {/* Initial Loading State */}
                        {isLoading && (
                            <DataTable.Row>
                                <DataTable.Cell colSpan={5}>
                                    <div className="flex items-center justify-center gap-2 text-gray-500 py-8">
                                        <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                                        Loading products...
                                    </div>
                                </DataTable.Cell>
                            </DataTable.Row>
                        )}
                        {data?.data.length === 0 && !isLoading && (
                            <DataTable.Cell colSpan={5}>
                                <div className="text-center py-12 text-lg text-gray-500">
                                    <Package className="w-20 h-20 mx-auto mb-4" />
                                    <p>No products found</p>
                                </div>
                            </DataTable.Cell>
                        )}

                        {data?.data.map((product) => (
                            <DataTable.Row key={product.id}>
                                {/* Product Name */}
                                <DataTable.Cell>
                                    <div className="text-sm font-medium text-gray-900">
                                        {product.name}
                                    </div>
                                </DataTable.Cell>
                                {/* SKU */}
                                <DataTable.Cell>
                                    <div className="text-sm text-gray-500">
                                        {product.sku}
                                    </div>
                                </DataTable.Cell>
                                {/* Stock  with Color Badge */}
                                <DataTable.Cell>
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${product.stockLevel < 10
                                        ? 'bg-red-100 text-red-800'      // Low stock = red
                                        : product.stockLevel < 50
                                            ? 'bg-yellow-100 text-yellow-800' // Medium stock = yellow
                                            : 'bg-green-100 text-green-800'   // High stock = green
                                        }`}>
                                        {product.stockLevel} units
                                    </span>
                                </DataTable.Cell>
                                {/* Price */}
                                <DataTable.Cell>
                                    <div className="text-sm text-gray-900">
                                        ${product.price.toFixed(2)}
                                    </div>
                                </DataTable.Cell>
                                {/* Actions */}
                                <DataTable.Cell>
                                    <button
                                        //Edit functionality TBA later along with add form in milestone 3
                                        onClick={() => handleEdit(product)}
                                        className="mr-4 text-gray-600 hover:text-blue-600 font-medium transition-colors">
                                        <Pencil className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product)}
                                        className="text-gray-600 hover:text-red-600 font-medium transition-colors">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </DataTable.Cell>
                            </DataTable.Row>
                        ))}
                    </DataTable.Body>

                </DataTable>

                {/* Pagination Footer */}
                {!isLoading && data && (
                    <Pagination
                        currentPage={currentPage}
                        totalItems={data.pagination.totalItems}
                        pageSize={pageSize}
                        onPageChange={setCurrentPage}
                        onPageSizeChange={handlePageSizeChange}
                    />
                )}
            </div>
        </div>
    );
}
