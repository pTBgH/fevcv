// file: lib/cv-utils.ts

/**
 * Generates a unique CV name.
 * @param existingNames - An array of existing CV titles to check against for duplicates.
 * @param suggestion - (Optional) A suggested name, like the original filename.
 * @returns A unique CV title string.
 */
export function generateCVName(existingNames: string[], suggestion?: string): string {
  // 1. Dùng tên gợi ý nếu có, nếu không thì dùng tên mặc định
  const baseName = suggestion 
    ? suggestion.replace(/\.[^/.]+$/, "") // Xóa extension nếu có
    : "Untitled CV";

  // 2. Kiểm tra xem tên đã tồn tại chưa
  if (!existingNames.includes(baseName)) {
    return baseName; // Nếu chưa tồn tại, dùng luôn
  }

  // 3. Nếu đã tồn tại, thêm số vào cuối cho đến khi tìm được tên duy nhất
  let counter = 1;
  let newName = `${baseName} (${counter})`;
  while (existingNames.includes(newName)) {
    counter++;
    newName = `${baseName} (${counter})`;
  }
  
  return newName;
}