import {
  Pagination,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { PaginationProps } from "../types/index";




const PaginationComponent = ({
  totalPages,
  currentPage,
  handleCurrentPageChange,
}: PaginationProps) => {
  return (
    <Pagination>
      <PaginationPrevious
        onClick={() =>
          handleCurrentPageChange(currentPage > 1 ? currentPage - 1 : 1)
        }
      />
      {Array.from({ length: totalPages }, (_, index) => (
        <PaginationItem key={index}>
          <PaginationLink
            isActive={currentPage === index + 1}
            onClick={() => handleCurrentPageChange(index + 1)}
          >
            {index + 1}
          </PaginationLink>
        </PaginationItem>
      ))}
      <PaginationNext
        onClick={() =>
          handleCurrentPageChange(
            currentPage < totalPages ? currentPage + 1 : totalPages
          )
        }
      />
    </Pagination>
  );
};

export default PaginationComponent;
