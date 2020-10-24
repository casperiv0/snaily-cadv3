const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function generateSerialNumber(): string {
  let result = "";
  const length = chars.length;

  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * length));
  }

  return result;
}

export function generateVinNumber(): string {
  return "FFFFFF";
}
