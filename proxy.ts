import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale } from "@/lib/i18n";

const PUBLIC_FILE = /\.(.*)$/;
const SANITY_PREVIEW_HEADER = "x-sanity-presentation-preview";

function isSanityPresentationPreview(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const referer = request.headers.get("referer");
  let refererUrl: URL | null = null;

  if (referer) {
    try {
      refererUrl = new URL(referer);
    } catch {
      refererUrl = null;
    }
  }

  const isSanityReferer =
    refererUrl?.hostname === "sanity.io" || refererUrl?.hostname.endsWith(".sanity.io");

  return (
    searchParams.has("sanity-preview-perspective") ||
    searchParams.has("sanity-preview-secret") ||
    Boolean(
      refererUrl?.searchParams.has("sanity-preview-perspective") ||
        refererUrl?.searchParams.has("sanity-preview-secret")
    ) ||
    Boolean(isSanityReferer) ||
    request.cookies.has("sanity-preview-perspective")
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPreview = isSanityPresentationPreview(request);

  if (isPreview) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(SANITY_PREVIEW_HEADER, "1");

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Skip public files, api routes, and studio
  if (
    PUBLIC_FILE.test(pathname) ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/studio")
  ) {
    return NextResponse.next();
  }

  // Check if pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Redirect to default locale
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!studio|api|_next|.*\\..*).*)"],
};
