import type { SVGProps } from "react";

export default function UserIcon(
  props: SVGProps<SVGSVGElement>
) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M12 2C9.243 2 7 4.243 7 7s2.243 5 5 5s5-2.243 5-5S14.757 2 12 2zm0 2c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3zm0 8c-4.411 0-8 2.239-8 5v3h2v-3c0-1.534 2.531-3 6-3s6 1.466 6 3v3h2v-3c0-2.761-3.589-5-8-5z" />
    </svg>
  );
}