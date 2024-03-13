import { NextResponse } from "next/server";
import { convertRawStrToArrayIp, isGrantedClient } from "../checkRange";

// This function can be marked `async` if using `await` inside
export function middleware(request) {
  const response = NextResponse.next();
  console.log(
    "Request ip is: ============" + request.headers.get("X-Forwarded-For")
  );
  console.log(
    "type of x-forwarded-for is ",
    typeof request.headers.get("X-Forwarded-For")
  );

  const allow = process.env.NEXT_PUBLIC_WHITE_LIST_IPV4;
  console.log(allow);
  const rawAllowedCIDR = convertRawStrToArrayIp(allow);
  const clientIP =
    request.headers.get("X-Forwarded-For") == "::1"
      ? ["127.0.0.1"]
      : convertRawStrToArrayIp(request.headers.get("X-Forwarded-For"));

  const isGranted =isGrantedClient(clientIP, rawAllowedCIDR)
  console.log('isGranted: ', isGranted)
  if (!isGranted) {
    return NextResponse.redirect(new URL("/error", request.url));
  }
  return response;
}

// See "Matching Paths" below to learn more
export const config = {
  // carefully about rerender loop -> cause localhost redirected you too many times.
  // ignore path which cause error
  matcher: "/((?!api|_next|static|public|assets|favicon.ico|error).*)",
};
