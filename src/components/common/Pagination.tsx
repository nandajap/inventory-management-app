import * as Select from '@radix-ui/react-select';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';


interface PaginationProps {
    currentPage: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
}

export default function Pagination({
    currentPage,
    totalItems,
    pageSize,
    onPageChange,
    onPageSizeChange,
}: PaginationProps) {

    const totalPages = Math.ceil(totalItems / pageSize);
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages;

    return (
        <div className="flex items-center justify-between shrink-0 px-6 py-4 bg-white border-t border-gray-200">
            {/* Left: Page Size Selector */}
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Show</span>

                <Select.Root
                    value={pageSize.toString()}
                    onValueChange={(value) => onPageSizeChange(Number(value))}
                >
                    <Select.Trigger className="inline-flex items-center justify-between gap-2 px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <Select.Value />
                        <Select.Icon>
                            <ChevronDown className="w-4 h-4" />
                        </Select.Icon>
                    </Select.Trigger>

                    <Select.Portal>
                        <Select.Content className="bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden">
                            <Select.Viewport>
                                {[10, 25, 50, 100].map((size) => (
                                    <Select.Item
                                        key={size}
                                        value={size.toString()}
                                        className="px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-indigo-50 focus:bg-indigo-50 focus:outline-none"
                                    >
                                        <Select.ItemText>{size}</Select.ItemText>
                                    </Select.Item>
                                ))}
                            </Select.Viewport>
                        </Select.Content>
                    </Select.Portal>
                </Select.Root>

                <span className="text-sm text-gray-700">entries</span>
            </div>

            {/* Center: Page Info */}
            <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{startItem}</span> to{' '}
                <span className="font-medium">{endItem}</span> of{' '}
                <span className="font-medium">{totalItems}</span> entries
            </div>

            {/* Right: Navigation Buttons */}
            <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={isFirstPage}
                    className="p-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
                    aria-label="Previous page"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Page Number */}
                <span className="px-4 py-2 text-sm text-gray-700">
                    Page <span className="font-medium">{currentPage}</span> of{' '}
                    <span className="font-medium">{totalPages}</span>
                </span>

                {/* Next Button */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={isLastPage}
                    className="p-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
                    aria-label="Next page"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );

}