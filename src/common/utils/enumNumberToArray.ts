const StringIsNumber = value => isNaN(Number(value)) === true;

// Turn enum into array
export function EnumToArray(enumme) {
  return Object.keys(enumme)
    .filter(StringIsNumber)
    .map(key => enumme[key]);
}
