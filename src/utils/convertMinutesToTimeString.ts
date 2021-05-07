export function convertMinutesToTimeString(duration: number): string {

  const num = duration;
  const hours = (num / 60);
  const rhours = Math.floor(hours);
  const minutes = (hours - rhours) * 60;
  const rminutes = Math.round(minutes);
  return rhours + "h " + rminutes + "m";

}