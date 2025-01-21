import { getDateDifference } from "./getDateDifference";

export const getReadableDate = (date: string): string => {
  let splittedDate = date.split("T")[0].split("-");
  const curYear = new Date().getFullYear().toString();

  /* 
    If the year is same with the current year,
    display the gap between
   */
  if (splittedDate[0] === curYear) {
    return getDateDifference(new Date(date));
  }

  const dateMap = new Map([
    [1, "January"],
    [2, "February"],
    [3, "March"],
    [4, "April"],
    [5, "May"],
    [6, "June"],
    [7, "July"],
    [8, "August"],
    [9, "September"],
    [10, "October"],
    [11, "November"],
    [12, "December"],
  ]);

  splittedDate[1] = dateMap
    .get(parseInt(splittedDate[1]))
    ?.toString() as string;

  /* 
    Display the actual date when the year is different from 
    current year
  */
  return splittedDate.reverse().join(" ");
};
