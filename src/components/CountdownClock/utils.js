import differenceInMinutes from 'date-fns/differenceInMinutes';
import differenceInSeconds from 'date-fns/differenceInSeconds';

export function formatRemainingTime(countdownTime) {
  const now = new Date();
  const minutesDifference = differenceInMinutes(countdownTime, now);
  const secondsDifference = differenceInSeconds(countdownTime, now);
  return `${secondsDifference < 0 ? '- ' : ''}${formatNumberToTwoDigits(Math.abs(minutesDifference))}:${formatNumberToTwoDigits(Math.abs(secondsDifference % 60))}`;
}

export function formatNumberToTwoDigits(number) {
  if (number < 9) {
    return `0${number}`;
  }

  return `${number}`;
}
