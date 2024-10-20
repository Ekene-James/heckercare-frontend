export const hyphenate = (text, wordsToRemove = []) => {
  const splittedArr = text.split(" ");

  wordsToRemove.forEach((word) => {
    const idx = splittedArr.indexOf(word);

    if (idx > -1) {
      return splittedArr.splice(idx, 1);
    }
  });

  const joined = splittedArr.join("-");

  return joined;
};
