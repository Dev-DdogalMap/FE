import type { SVGProps } from "react";

export default function ChatIcon(
  props: SVGProps<SVGSVGElement>
) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M12 3C6.486 3 2 6.925 2 11.75C2 14.03 3.02 16.1 4.73 17.63L4 22L8.34 20.19C9.49 20.6 10.72 20.81 12 20.81C17.514 20.81 22 16.885 22 11.75C22 6.925 17.514 3 12 3ZM12 19C10.83 19 9.7 18.79 8.65 18.38L8.29 18.24L6.39 19.03L6.7 17.18L6.39 16.89C4.85 15.47 4 13.67 4 11.75C4 8.03 7.59 5 12 5C16.41 5 20 8.03 20 11.75C20 15.47 16.41 19 12 19Z" />
    </svg>
  );
}