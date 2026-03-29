export const VALUES = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
export const SUITS = ['♠', '♣', '♥', '♦'];

const countValueFor = (value) => {
  if (['10', 'J', 'Q', 'K', 'A'].includes(value)) return -1;
  if (['2', '3', '4', '5', '6'].includes(value)) return 1;
  return 0;
};

const shuffle = (items) => {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export const createShoe = (deckCount = 6) => {
  const shoe = [];
  let uid = 1;

  for (let i = 0; i < deckCount; i += 1) {
    SUITS.forEach((suit) => {
      VALUES.forEach((value) => {
        shoe.push({
          value,
          suit,
          countValue: countValueFor(value),
          id: `c-${i + 1}-${uid}`,
        });
        uid += 1;
      });
    });
  }

  return shuffle(shoe);
};
