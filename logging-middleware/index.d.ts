export function Log(
  stack: string,
  level: "INFO" | "ERROR" | "WARN" | "DEBUG",
  pkg: string,
  message: string
): Promise<void>;