import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../lib/mockApi';
import {Pencil, Trash2} from 'lucide-react';
import DataTable from '../components/common/DataTable';

export default function Inventory() {
    const { data, isLoading, error } = useQuery(
        {
            queryKey: ['products'],
            queryFn: fetchProducts
        });

    if (error) {
        return (
            <div className="p-4 text-red-500">Error loading products: {error.message}</div>
        );
    }

    return (
        <div className="p-4">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
                <p className="text-gray-600 mt-1">Manage your product inventory</p>
            </div>
            <DataTable>
                <DataTable.Header>
                    <DataTable.Column>Product Name</DataTable.Column>
                    <DataTable.Column>SKU</DataTable.Column>
                    <DataTable.Column>Stock Level</DataTable.Column>
                    <DataTable.Column>Price</DataTable.Column>
                    <DataTable.Column>Actions</DataTable.Column>
                </DataTable.Header>
                <DataTable.Body>
                    {/* Loading State */}
                        {isLoading && (
                            <DataTable.Row>
                                <DataTable.Cell colSpan={5}>
                                    <div className="flex items-center justify-center gap-2 text-gray-500">
                                        <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                                        Loading products...
                                    </div>
                                </DataTable.Cell>
                            </DataTable.Row>
                        )}
                    
                    {data?.map((product) => (
                        <DataTable.Row>
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
                                        onClick={() => console.log('Edit:', product.id)}
                                        className="mr-4 text-gray-600 hover:text-blue-600 font-medium transition-colors">
                                        <Pencil className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => console.log('Delete:', product.id)}
                                        className="text-gray-600 hover:text-red-600 font-medium transition-colors">
                                       <Trash2 className="w-5 h-5"/>
                                    </button>
                                    <img src=''>
                                    </img>
                                </DataTable.Cell>
                        </DataTable.Row>
                    ))}
                </DataTable.Body>

            </DataTable>

            </div>
    );
}
