import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useSearchParams } from "react-router-dom";

const TablePagination = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const activePage = searchParams.get("offset")
    ? parseInt(searchParams.get("offset"))
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
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={() => onClick("prev")} />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            onClick={() => onClick(1)}
            isActive={activePage === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            onClick={() => onClick(2)}
            isActive={activePage === 2}
          >
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            onClick={() => onClick(3)}
            isActive={activePage === 3}
          >
            3
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext onClick={() => onClick("next")} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
export default TablePagination;
