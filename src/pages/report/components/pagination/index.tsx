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
  const activePage = searchParams.has('offset') ? parseInt(searchParams.get('offset') as string) : 1;

  function onChangePageNumber(pageIndex: number | string) {
    let pageNum = pageIndex === 'prev' ? activePage - 1 : pageIndex === 'next' ? activePage + 1 : (pageIndex as number);
    // pageNum > 1 ? searchParams.set('offset', pageNum.toString()) : searchParams.delete('offset');
    searchParams.set('offset', pageNum.toString());
    setSearchParams(searchParams);
  }

  return (
    <Pagination className="mt-10">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious disabled={activePage === 1} onClick={() => onChangePageNumber('prev')} />
        </PaginationItem>
        {Array.from({ length: totalPages }).map((_, pageNum) => {
          const pageNumber = pageNum + 1;
          return (
            <PaginationLink
              key={pageNumber}
              onClick={() => onChangePageNumber(pageNumber)}
              isActive={activePage === pageNumber}
              disabled={activePage === pageNumber}
              className="disabled:opacity-100 select-none"
            >
              {pageNumber}
            </PaginationLink>
          );
        })}

        <PaginationItem>
          <PaginationNext disabled={activePage === totalPages} onClick={() => onChangePageNumber('next')} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
export default TablePagination;
