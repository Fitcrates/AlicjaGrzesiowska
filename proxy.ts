import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale } from "@/lib/i18n";

const PUBLIC_FILE = /\.(.*)$/;
const SANITY_PREVIEW_HEADER = "x-sanity-presentation-preview";
const SANITY_PREVIEW_PERSPECTIVE_HEADER = "x-sanity-preview-perspective";
const SANITY_PREVIEW_PERSPECTIVE_PARAM = "sanity-preview-perspective";
const SANITY_PREVIEW_SECRET_PARAM = "sanity-preview-secret";

function getRefererUrl(request: NextRequest) {
  const referer = request.headers.get("referer");

  if (!referer) return null;

  try {
    return new URL(referer);
  } catch {
    return null;
  }
}

function isSanityReferer(request: NextRequest) {
  const refererUrl = getRefererUrl(request);
  const hostname = refererUrl?.hostname;

  return (
    hostname === "sanity.io" ||
    Boolean(hostname?.endsWith(".sanity.io")) ||
    Boolean(hostname?.endsWith(".sanity.studio"))
  );
}

function getSanityPreviewPerspective(request: NextRequest) {
  const refererUrl = getRefererUrl(request);

  return (
    request.nextUrl.searchParams.get(SANITY_PREVIEW_PERSPECTIVE_PARAM) ||
    request.cookies.get(SANITY_PREVIEW_PERSPECTIVE_PARAM)?.value ||
    refererUrl?.searchParams.get(SANITY_PREVIEW_PERSPECTIVE_PARAM) ||
    null
  );
}

function isSanityPreviewRequest(request: NextRequest) {
  return (
    Boolean(getSanityPreviewPerspective(request)) ||
    request.nextUrl.searchParams.has(SANITY_PREVIEW_SECRET_PARAM) ||
    isSanityReferer(request)
  );
}

function withSanityPreviewHeaders(request: NextRequest) {
  if (!isSanityPreviewRequest(request)) {
    return NextResponse.next();
  }

  const requestHeaders = new Headers(request.headers);
  const perspective = getSanityPreviewPerspective(request) || "drafts";

  requestHeaders.set(SANITY_PREVIEW_HEADER, "1");
  requestHeaders.set(SANITY_PREVIEW_PERSPECTIVE_HEADER, perspective);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
    return withSanityPreviewHeaders(request);
  }

  // Redirect to default locale
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!studio|api|_next|.*\\..*).*)"],
};
