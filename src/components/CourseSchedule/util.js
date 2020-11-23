export function getDay(timestamp) {
  return "周" + "天一二三四五六".charAt(new Date(timestamp).getDay());
}
export function getMonth(timestamp) {
  return new Date(timestamp).getMonth();
}
