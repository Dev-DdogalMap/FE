import { COLORS } from "@/shared/constants/colors";

const createClusterStyle = (
  size: number,
  fontSize: number,
  background: string,
) => ({
  width: `${size}px`,
  height: `${size}px`,
  background,
  border: "3px solid #FFFFFF",
  borderRadius: "9999px",
  color: "#FFFFFF",
  textAlign: "center",
  fontWeight: "800",
  fontSize: `${fontSize}px`,
  lineHeight: `${size - 6}px`,
  boxShadow: "0 4px 12px rgba(230, 81, 0, 0.35)",
});

export const CLUSTER_CALCULATOR = [10, 30, 50];

export const CLUSTER_STYLES = [
  createClusterStyle(34, 12, COLORS.PRIMARY_TEXT),
  createClusterStyle(40, 13, COLORS.PRIMARY),
  createClusterStyle(46, 14, COLORS.PRIMARY_DARK),
  createClusterStyle(52, 15, COLORS.PRIMARY_DARK),
];