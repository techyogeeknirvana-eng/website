import { NextResponse } from 'next/server';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export function apiSuccess<T>(data: T, status = 200, headers?: HeadersInit) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    {
      status,
      headers,
    }
  );
}

export function apiError(
  message: string,
  status = 400,
  details?: any,
  headers?: HeadersInit
) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      details: details || null,
    },
    {
      status,
      headers,
    }
  );
}

export function apiPaginated<T>(
  items: T[],
  meta: PaginationMeta,
  status = 200
) {
  return NextResponse.json(
    {
      success: true,
      data: items,
      pagination: meta,
    },
    {
      status,
    }
  );
}
