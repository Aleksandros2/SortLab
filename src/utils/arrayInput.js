export const ARRAY_INPUT_MIN_LENGTH = 1;
export const ARRAY_INPUT_MAX_LENGTH = 64;
export const ARRAY_INPUT_MIN_VALUE = -99;
export const ARRAY_INPUT_MAX_VALUE = 99;

export const formatArrayInput = (array) => array.join(', ');

export const parseArrayInput = (input) => {
  const trimmed = input.trim();

  if (!trimmed) {
    return {
      values: [],
      error: 'Gib mindestens eine Zahl ein.'
    };
  }

  const parts = trimmed.split(/[,\s;]+/).filter(Boolean);

  if (parts.length < ARRAY_INPUT_MIN_LENGTH) {
    return {
      values: [],
      error: 'Gib mindestens eine Zahl ein.'
    };
  }

  if (parts.length > ARRAY_INPUT_MAX_LENGTH) {
    return {
      values: [],
      error: `Maximal ${ARRAY_INPUT_MAX_LENGTH} Werte sind erlaubt.`
    };
  }

  const values = parts.map((part) => Number(part));
  const invalidPart = parts.find((part, index) => !Number.isInteger(values[index]));

  if (invalidPart) {
    return {
      values: [],
      error: `"${invalidPart}" ist keine ganze Zahl.`
    };
  }

  const outOfRange = values.find(
    (value) => value < ARRAY_INPUT_MIN_VALUE || value > ARRAY_INPUT_MAX_VALUE
  );

  if (outOfRange !== undefined) {
    return {
      values: [],
      error: `Werte müssen zwischen ${ARRAY_INPUT_MIN_VALUE} und ${ARRAY_INPUT_MAX_VALUE} liegen.`
    };
  }

  return {
    values,
    error: ''
  };
};
