// if string is longer than length, ellipse the string, if middle is true, ellipse the string in the middle, otherwise ellipse the string at the end
export const ellipseString = (
  string: string,
  length: number,
  middle: boolean = false
) => {
  if (middle) {
    return string.length > length
      ? string.slice(0, length / 2) +
          "..." +
          string.slice(string.length - length / 2, string.length)
      : string;
  }
  return string.length > length ? string.slice(0, length) + "..." : string;
};
