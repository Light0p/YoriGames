"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export const Pagination = ({ currentPage, totalPages, baseUrl }: PaginationProps) => {
  const router = useRouter();
  const [jumpPage, setJumpPage] = useState('');

  if (totalPages <= 1) return null;

  const handleJump = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(jumpPage, 10);
    if (pageNum >= 1 && pageNum <= totalPages) {
      const url = pageNum === 1 ? baseUrl : `${baseUrl}?page=${pageNum}`;
      router.push(url);
      setJumpPage('');
    }
  };

  const renderPageLink = (page: number, label?: string | React.ReactNode, isDisabled = false) => {
    const isActive = page === currentPage;
    const url = page === 1 ? baseUrl : `${baseUrl}?page=${page}`;

    if (isDisabled) {
      return (
        <div
          key={`disabled-${Math.random()}`}
          className="min-w-[40px] h-10 flex items-center justify-center font-pixel text-[10px] border-2 bg-[#1B123D] border-[#1B123D] text-muted-foreground/30 opacity-50 cursor-not-allowed"
        >
          {label || page}
        </div>
      );
    }

    return (
      <Link
        key={page}
        href={url}
        className={cn(
          "min-w-[40px] h-10 flex items-center justify-center font-pixel text-[10px] border-2 transition-all active:scale-95",
          isActive 
            ? "bg-neon-purple border-neon-purple text-white shadow-[2px_2px_0_0_#000]" 
            : "bg-[#140A2E] border-[#1B123D] text-muted hover:border-neon-purple hover:text-white"
        )}
      >
        {label || page}
      </Link>
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
    <div className="flex flex-col items-center gap-8 mt-16">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {/* First & Prev */}
        {renderPageLink(1, <ChevronsLeft className="w-4 h-4" />, currentPage === 1)}
        {renderPageLink(currentPage - 1, <ChevronLeft className="w-4 h-4" />, currentPage === 1)}
        
        {/* Numbered Range */}
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

        {/* Next & Last */}
        {renderPageLink(currentPage + 1, <ChevronRight className="w-4 h-4" />, currentPage === totalPages)}
        {renderPageLink(totalPages, <ChevronsRight className="w-4 h-4" />, currentPage === totalPages)}
      </div>

      {/* Jump to Page */}
      <form onSubmit={handleJump} className="flex items-center gap-3">
        <label className="font-pixel text-[8px] text-muted uppercase tracking-widest">Jump to</label>
        <div className="relative">
          <input 
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
    </div>
  );
};