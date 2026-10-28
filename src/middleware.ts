import { NextResponse } from "next/server";

// middleware 비활성화 - 일단 아무것도 안 함!
export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
