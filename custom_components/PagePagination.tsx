"use client";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePathname, useSearchParams } from "next/navigation";

interface PagePaginationProps {
  pageNumber: number;
  nextPageAvailable: boolean;
}

export function PagePagination({ pageNumber, nextPageAvailable }: PagePaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const previousPageAvailable = pageNumber > 1;

  // Build prev link with its own params
  let prevParams = new URLSearchParams(searchParams);
  prevParams.set("pageNumber", String(pageNumber - 1));
  const previousPageLink = `${pathname}?${prevParams.toString()}`;

  // Build next link with its own params
  let nextParams = new URLSearchParams(searchParams);
  nextParams.set("pageNumber", String(pageNumber + 1));
  const nextPageLink = `${pathname}?${nextParams.toString()}`;

  return (
    <Pagination className="absolute bottom-2 left-1/2 -translate-x-1/2">
      <PaginationContent className="grid grid-cols-3 items-center gap-2">

        <PaginationItem className={previousPageAvailable ? "" : "invisible"}>
          <PaginationPrevious href={previousPageLink} />
        </PaginationItem>

        <PaginationItem className="justify-self-center">
          <PaginationLink isActive aria-current="page">
            {pageNumber}
          </PaginationLink>
        </PaginationItem>

        <PaginationItem className={nextPageAvailable ? "" : "invisible"}>
          <PaginationNext href={nextPageLink} />
        </PaginationItem>

      </PaginationContent>
    </Pagination>
  );
}
