"use client"

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export const Pagination = ({ currentPage, totalPages, baseUrl }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const renderPageLink = (page: number, label?: string | React.ReactNode) => {
    const isActive = page === currentPage;
    const url = page === 1 ? baseUrl : `${baseUrl}?page=${page}`;

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
    <div className="flex flex-wrap items-center justify-center gap-2 mt-16">
      {currentPage > 1 && renderPageLink(currentPage - 1, <ChevronLeft className="w-4 h-4" />)}
      
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

      {currentPage < totalPages && renderPageLink(currentPage + 1, <ChevronRight className="w-4 h-4" />)}
    </div>
  );
};
