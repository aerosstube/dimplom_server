
export function checkPhone(input: string): string {
  // Удаляем все символы, кроме цифр
  const phoneNumber = input.replace(/\D/g, '');

  // Применяем маску: (XXX) XXX-XXXX
  const areaCode = phoneNumber.slice(0, 3);
  const firstPart = phoneNumber.slice(3, 6);
  const secondPart = phoneNumber.slice(6, 8);
  const lastPart = phoneNumber.slice(8, 10)

  let formattedPhoneNumber = '';
  if (areaCode) {
    formattedPhoneNumber += `(${areaCode})`;
  }
  if (firstPart) {
    formattedPhoneNumber += ` ${firstPart}`;
  }
  if (secondPart) {
    formattedPhoneNumber += `-${secondPart}`;
  }
  if (lastPart) {
    formattedPhoneNumber += `-${lastPart}`
  }

  return formattedPhoneNumber;
}