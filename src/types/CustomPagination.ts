import React from "react";

export interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (selectedPage: number) => void;
  onPageSizeChange: (newSize: number) => void;
  entriesPerPage: number;
  totalRows: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}
