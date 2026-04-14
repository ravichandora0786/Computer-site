import React, { useMemo, useRef } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import SelectDropDown from "./selectDropDown";
import { PAGINATION_LIMIT_OPTIONS } from "../../constants/dropdown";
import {
  MdChevronLeft,
  MdChevronRight,
  MdFirstPage,
  MdLastPage,
  MdSwapVert,
  MdDragIndicator,
} from "react-icons/md";
import { Reorder, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { httpRequest } from "@/request";
import clsx from "clsx";
import { toast } from "react-toastify";

const DataTable = ({
  columns,
  data,
  isLoading = false,
  pageSize: initialPageSize = 10,
  className = "",
  isReorderable = false,
  reorderApiUrl = null,
  onReorder = null,
  onReorderSuccess = null,
  // Server-side pagination props
  isServerSide = false,
  totalItems: externalTotalItems = 0,
  totalPages: externalTotalPages = 0,
  currentPage: externalCurrentPage = 1,
  onPageChange = null,
  onPageSizeChange = null,
}) => {
  const dispatch = useDispatch();
  const [localData, setLocalData] = React.useState([]);
  const latestDataRef = useRef([]);

  React.useEffect(() => {
    if (data) {
      setLocalData(data);
      latestDataRef.current = data;
    }
  }, [data]);

  const handleReorder = (newOrder) => {
    setLocalData(newOrder);
    latestDataRef.current = newOrder;
    if (onReorder) onReorder(newOrder);
  };

  const syncOrderWithBackend = async () => {
    if (reorderApiUrl) {
      try {
        const ids = latestDataRef.current.map((item) => item.id || item._id);
        await httpRequest.patch(reorderApiUrl, { ids });
        if (onReorderSuccess) onReorderSuccess();
      } catch (error) {
        toast.error("Failed to sync new order");
      }
    }
  };

  // Inject Drag Handle column if reorderable
  const finalColumns = useMemo(() => {
    if (!isReorderable) return columns;
    return [
      {
        id: "drag-handle",
        header: "",
        cell: () => (
          <div className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-primary transition-colors flex justify-center w-8">
            <MdDragIndicator size={24} />
          </div>
        ),
        enableSorting: false,
      },
      ...columns,
    ];
  }, [columns, isReorderable]);

  const table = useReactTable({
    data: localData,
    columns: finalColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: isServerSide,
    pageCount: isServerSide ? externalTotalPages : undefined,
    initialState: {
      pagination: {
        pageSize: initialPageSize,
      },
    },
  });

  const { 
    getHeaderGroups, 
    getRowModel, 
    getPageCount, 
    setPageIndex, 
    setPageSize,
    previousPage, 
    nextPage, 
    getCanPreviousPage, 
    getCanNextPage, 
    getState 
  } = table;
  
  const { pagination } = getState();

  // Determine current stats based on mode
  const displayTotalItems = isServerSide ? externalTotalItems : data.length;
  const displayCurrentPage = isServerSide ? externalCurrentPage : pagination.pageIndex + 1;
  const displayPageSize = isServerSide ? initialPageSize : pagination.pageSize;
  const displayTotalPages = isServerSide ? externalTotalPages : getPageCount();

  const startIdx = isServerSide ? (externalCurrentPage - 1) * initialPageSize + 1 : pagination.pageIndex * pagination.pageSize + 1;
  const endIdx = isServerSide ? Math.min(externalCurrentPage * initialPageSize, externalTotalItems) : Math.min((pagination.pageIndex + 1) * pagination.pageSize, data.length);

  return (
    <div className={clsx("flex flex-col gap-4", className)}>
      <div className="overflow-x-auto rounded-[10px] border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <table className="w-full text-left border-collapse">
          <thead>
            {getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-gray-50/50 dark:bg-gray-800/50">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800"
                  >
                    <div
                      className={clsx(
                        "flex items-center gap-2",
                        header.column.getCanSort() && "cursor-pointer select-none"
                      )}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getCanSort() && (
                        <MdSwapVert className="text-gray-400 group-hover:text-gray-600" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          {isReorderable && !isLoading && getRowModel().rows.length > 0 ? (
            <Reorder.Group
              as="tbody"
              axis="y"
              values={localData}
              onReorder={handleReorder}
              className="divide-y divide-gray-100 dark:divide-gray-800"
            >
              {getRowModel().rows.map((row) => (
                <Reorder.Item
                  key={row.original.id || row.original._id}
                  value={row.original}
                  as="tr"
                  onDragEnd={syncOrderWithBackend}
                  className="group hover:bg-gray-50 transition-colors dark:hover:bg-gray-800/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </Reorder.Item>
              ))}
            </Reorder.Group>
          ) : (
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length + (isReorderable ? 1 : 0)} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
                      <p className="text-sm font-medium text-gray-500">Loading data...</p>
                    </div>
                  </td>
                </tr>
              ) : getRowModel().rows.length > 0 ? (
                getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="group hover:bg-gray-50 transition-colors dark:hover:bg-gray-800/50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length + (isReorderable ? 1 : 0)} className="px-6 py-10 text-center text-gray-500">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          )}
        </table>
      </div>

      {/* Pagination Container */}
      <div className="flex flex-col items-center justify-between gap-4 px-2 py-1 sm:flex-row">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-semibold text-gray-900 dark:text-white">
              {startIdx}
            </span> to <span className="font-semibold text-gray-900 dark:text-white">
              {endIdx}
            </span> of <span className="font-semibold text-gray-900 dark:text-white">{displayTotalItems}</span> entries
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-muted uppercase tracking-tight">Show</span>
            <div className="w-20">
              <SelectDropDown
                value={displayPageSize}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (isServerSide && onPageSizeChange) {
                      onPageSizeChange(val);
                  } else {
                      setPageSize(val);
                  }
                }}
                options={PAGINATION_LIMIT_OPTIONS}
              />
            </div>
            <span className="text-xs font-bold text-muted uppercase tracking-tight">entries</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <button
              className="rounded-[8px] border border-gray-200 p-2 hover:bg-gray-50 disabled:opacity-30 dark:border-gray-700 dark:hover:bg-gray-800"
              onClick={() => isServerSide ? onPageChange?.(1) : setPageIndex(0)}
              disabled={isServerSide ? displayCurrentPage === 1 : !getCanPreviousPage()}
            >
              <MdFirstPage size={20} />
            </button>
            <button
              className="rounded-[8px] border border-gray-200 p-2 hover:bg-gray-50 disabled:opacity-30 dark:border-gray-700 dark:hover:bg-gray-800"
              onClick={() => isServerSide ? onPageChange?.(displayCurrentPage - 1) : previousPage()}
              disabled={isServerSide ? displayCurrentPage === 1 : !getCanPreviousPage()}
            >
              <MdChevronLeft size={20} />
            </button>

            <div className="flex items-center gap-1 px-2 mx-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Page
              </span>
              <span className="text-sm font-bold text-primary">
                {displayCurrentPage}
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                of {displayTotalPages}
              </span>
            </div>

            <button
              className="rounded-[8px] border border-gray-200 p-2 hover:bg-gray-50 disabled:opacity-30 dark:border-gray-700 dark:hover:bg-gray-800"
              onClick={() => isServerSide ? onPageChange?.(displayCurrentPage + 1) : nextPage()}
              disabled={isServerSide ? displayCurrentPage === displayTotalPages : !getCanNextPage()}
            >
              <MdChevronRight size={20} />
            </button>
            <button
              className="rounded-[8px] border border-gray-200 p-2 hover:bg-gray-50 disabled:opacity-30 dark:border-gray-700 dark:hover:bg-gray-800"
              onClick={() => isServerSide ? onPageChange?.(displayTotalPages) : setPageIndex(displayTotalPages - 1)}
              disabled={isServerSide ? displayCurrentPage === displayTotalPages : !getCanNextPage()}
            >
              <MdLastPage size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
