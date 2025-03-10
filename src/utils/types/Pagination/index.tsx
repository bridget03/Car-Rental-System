export interface PaginationProps {
  children: React.ReactNode;
  className?: string;
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
  totalItems: number;
  currentPage: number;
}
export interface ItemPerPageProps {
  value: number;
  onChange: (value: number) => void;
  totalItems: number;
  currentPage: number;
}
