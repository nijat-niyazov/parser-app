import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useSearchParams } from "react-router-dom";

const TablePagination = ({ totalPages }: { totalPages: number }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const activePage = searchParams.has("offset")
    ? parseInt(searchParams.get("offset") as string)
    : 1;

  function onClick(pageIndex: number | string) {
    let pageNum =
      pageIndex === "prev"
        ? activePage - 1
        : pageIndex === "next"
        ? activePage + 1
        : pageIndex;

    searchParams.set("offset", pageNum.toString());
    setSearchParams(searchParams);
  }

  return (
    <Pagination className="mt-10">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={() => onClick("prev")} />
        </PaginationItem>
        {Array.from({ length: totalPages }).map((_, pageNum) => (
          <PaginationLink
            key={pageNum + 1}
            onClick={() => onClick(pageNum + 1)}
            isActive={activePage === pageNum + 1}
          >
            {pageNum + 1}
          </PaginationLink>
        ))}

        {/* <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem> */}
        <PaginationItem>
          <PaginationNext onClick={() => onClick("next")} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
export default TablePagination;
