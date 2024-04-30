import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useSearchParams } from 'react-router-dom';

const TablePagination = ({ totalPages }: { totalPages: number }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activePage = searchParams.has('offset') ? parseInt(searchParams.get('offset') as string) : 0;

  function onChangePageNumber(pageIndex: number | string) {
    let pageNum = pageIndex === 'prev' ? activePage - 1 : pageIndex === 'next' ? activePage + 1 : (pageIndex as number);
    searchParams.set('offset', pageNum.toString());
    setSearchParams(searchParams);
  }

  return (
    <Pagination className="mt-auto">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious disabled={activePage + 1 === 1} onClick={() => onChangePageNumber('prev')} />
        </PaginationItem>
        {Array.from({ length: totalPages }).map((_, pageNum) => {
          return (
            <PaginationLink
              key={pageNum}
              onClick={() => onChangePageNumber(pageNum)}
              isActive={activePage === pageNum}
              disabled={activePage === pageNum}
              className="disabled:opacity-100 select-none"
            >
              {pageNum + 1}
            </PaginationLink>
          );
        })}

        <PaginationItem>
          <PaginationNext disabled={activePage + 1 === totalPages} onClick={() => onChangePageNumber('next')} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
export default TablePagination;
