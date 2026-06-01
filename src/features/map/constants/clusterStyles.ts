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
  boxShadow: "0 4px 12px rgba(255, 107, 0, 0.35)",
});

export const CLUSTER_CALCULATOR = [10, 30, 50];

export const CLUSTER_STYLES = [
  createClusterStyle(34, 12, "#FF8A3D"),
  createClusterStyle(40, 13, "#FF6B00"),
  createClusterStyle(46, 14, "#F4511E"),
  createClusterStyle(52, 15, "#E64A19"),
];