import moment from "moment"

const DATE_TIME_FORMAT = "DD/MM/YYYY - hh:mm a"
const SERVER_DATE_FORMAT = "DD-MM-YYYY"

export const convertToServerDateFormat = (date: string | Date) => {
  return moment(date).format(SERVER_DATE_FORMAT)
}

export const convertTimestampToDateTimeFormat = (date: string | Date) => {
  return moment(date).format(DATE_TIME_FORMAT)
}

export const convertArrayTimestampToDateTimeFormat = (timestampArray: number[]): string => {
  if (timestampArray.length !== 7) {
    throw new Error("Invalid timestamp array. Expected an array with 7 elements.")
  }

  const utcDate = moment.utc({
    year: timestampArray[0],
    month: timestampArray[1] - 1,
    day: timestampArray[2],
    hour: timestampArray[3],
    minute: timestampArray[4],
    second: timestampArray[5],
    millisecond: Math.floor(timestampArray[6] / 1000000)
  })

  const localDate = utcDate.local()

  return localDate.format(DATE_TIME_FORMAT)
}
