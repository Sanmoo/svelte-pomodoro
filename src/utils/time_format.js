import differenceInSeconds from 'date-fns/differenceInSeconds'

export function formatRemainingTime(countdownTime) {
  return formatTimeDifference(new Date(), countdownTime)
}

export function formatTimeDifference(t1, t2) {
  const secondsDifference = differenceInSeconds(t2, t1)
  return formatSecondsDifference(secondsDifference)
}

function formatSecondsDifference(secondsDifference) {
  const hours = Math.floor(Math.abs(secondsDifference) / 3600)
  const minutes = Math.floor((Math.abs(secondsDifference) % 3600) / 60)
  const seconds = (Math.abs(secondsDifference) % 3600) % 60
  const formattedHours = formatNumberToTwoDigits(Math.abs(hours))
  const formattedMinutes = formatNumberToTwoDigits(Math.abs(minutes))
  const formattedSeconds = formatNumberToTwoDigits(Math.abs(seconds))
  return `${
    secondsDifference < 0 ? '- ' : ''
  }${formattedHours}:${formattedMinutes}:${formattedSeconds}`
}

export function formatNumberToTwoDigits(number) {
  if (number <= 9) {
    return `0${number}`
  }

  return `${number}`
}
