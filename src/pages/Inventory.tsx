import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../lib/mockApi';
import {Pencil, Trash2} from 'lucide-react';

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
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
                <p className="text-gray-600 mt-1">Manage your product inventory</p>
            </div>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    {/* Table Header */}
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Product Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                SKU
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Stock Level
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Price
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody className="bg-white divide-y divide-gray-200">
                        {/* Loading State */}
                        {isLoading && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center">
                                    <div className="flex items-center justify-center gap-2 text-gray-500">
                                        <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                                        Loading products...
                                    </div>
                                </td>
                            </tr>
                        )}

                        {/* Data Rows */}
                        {data?.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {product.name}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">
                                        {product.sku}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${product.stockLevel < 10
                                        ? 'bg-red-100 text-red-800'      // Low stock = red
                                        : product.stockLevel < 50
                                            ? 'bg-yellow-100 text-yellow-800' // Medium stock = yellow
                                            : 'bg-green-100 text-green-800'   // High stock = green
                                        }`}>
                                        {product.stockLevel} units
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        ${product.price.toFixed(2)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <button 
                                        onClick={() => console.log('Edit:', product.id)}
                                        className="mr-4 text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                                        <Pencil className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => console.log('Delete:', product.id)}
                                        className="text-gray-600 hover:text-red-600 font-medium transition-colors">
                                       <Trash2 className="w-5 h-5"/>
                                    </button>
                                    <img src=''>
                                    </img>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
