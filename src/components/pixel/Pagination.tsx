"use client"

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export const Pagination = ({ currentPage, totalPages, baseUrl }: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [jumpPage, setJumpPage] = useState('');

  if (totalPages <= 1) return null;

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) {
      params.delete('page');
    } else {
      params.set('page', page.toString());
    }
    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  };

  const handlePageClick = (page: number) => {
    router.push(createPageUrl(page), { scroll: false });
  };

  const handleJump = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(jumpPage, 10);
    if (pageNum >= 1 && pageNum <= totalPages) {
      handlePageClick(pageNum);
      setJumpPage('');
    }
  };

  const renderPageLink = (page: number, label?: string | React.ReactNode, isDisabled = false, keyPrefix = "", ariaLabel?: string) => {
    const isActive = page === currentPage;

    return (
      <button
        key={`${keyPrefix}${page}`}
        onClick={() => !isDisabled && !isActive && handlePageClick(page)}
        disabled={isDisabled}
        aria-label={ariaLabel || `Go to page ${page}`}
        className={cn(
          "min-w-[40px] h-10 flex items-center justify-center font-pixel text-[10px] border-2 transition-all active:scale-95",
          isActive 
            ? "bg-neon-purple border-neon-purple text-white shadow-[2px_2px_0_0_#000]" 
            : "bg-[#140A2E] border-[#1B123D] text-muted hover:border-neon-purple hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
        )}
      >
        {label || page}
      </button>
    );
  };

  const pages = [];
  const maxVisible = 5;
  
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);

  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(renderPageLink(i));
  }

  return (
    <nav className="flex flex-col items-center gap-8 mt-16" aria-label="Pagination Navigation">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {renderPageLink(1, <ChevronsLeft className="w-4 h-4" />, currentPage === 1, "first", "First page")}
        {renderPageLink(currentPage - 1, <ChevronLeft className="w-4 h-4" />, currentPage === 1, "prev", "Previous page")}
        
        {startPage > 1 && (
          <>
            {renderPageLink(1)}
            {startPage > 2 && <span className="text-muted font-pixel text-[10px] px-2">...</span>}
          </>
        )}

        {pages}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="text-muted font-pixel text-[10px] px-2">...</span>}
            {renderPageLink(totalPages)}
          </>
        )}

        {renderPageLink(currentPage + 1, <ChevronRight className="w-4 h-4" />, currentPage === totalPages, "next", "Next page")}
        {renderPageLink(totalPages, <ChevronsRight className="w-4 h-4" />, currentPage === totalPages, "last", "Last page")}
      </div>

      <form onSubmit={handleJump} className="flex items-center gap-3">
        <label htmlFor="jump-page-input" className="font-pixel text-[8px] text-muted uppercase tracking-widest">Jump to</label>
        <div className="relative">
          <input 
            id="jump-page-input"
            type="number" 
            min="1" 
            max={totalPages}
            value={jumpPage}
            onChange={(e) => setJumpPage(e.target.value)}
            className="w-20 bg-[#140A2E] border-2 border-[#1B123D] px-2 py-2 text-white font-pixel text-[10px] focus:outline-none focus:border-neon-purple text-center"
            placeholder="PG #"
          />
        </div>
        <button 
          type="submit"
          className="bg-[#1B123D] border-2 border-[#1B123D] hover:border-neon-purple p-2 transition-all active:scale-90"
        >
          <Search className="w-4 h-4 text-neon-purple" />
        </button>
      </form>
    </nav>
  );
};
