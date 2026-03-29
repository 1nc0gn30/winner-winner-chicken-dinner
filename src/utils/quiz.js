const DECK_BUCKETS = [0.5, 1, 1.5, 2, 2.5];

export const shuffle = (items) => {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const uniq = (values) => [...new Set(values)];

export const generateCountQuestions = () => {
  const questions = [];
  let id = 1;

  for (let runningCount = -12; runningCount <= 11; runningCount += 1) {
    DECK_BUCKETS.forEach((decksRemaining) => {
      const exact = runningCount / decksRemaining;
      const answer = Math.round(exact);
      const options = shuffle(
        uniq([
          answer,
          answer + 1,
          answer - 1,
          answer + 2,
          answer - 2,
        ]),
      ).slice(0, 4);

      if (!options.includes(answer)) {
        options[Math.floor(Math.random() * options.length)] = answer;
      }

      questions.push({
        id,
        question: `Running count ${runningCount >= 0 ? '+' : ''}${runningCount} with ${decksRemaining} deck${decksRemaining === 1 ? '' : 's'} remaining. Closest true count?`,
        options: shuffle(options).map((value) => `${value >= 0 ? '+' : ''}${value}`),
        answer: `${answer >= 0 ? '+' : ''}${answer}`,
        explanation: `True count = running count / decks remaining = ${runningCount} / ${decksRemaining} = ${exact.toFixed(2)} (rounded to ${answer >= 0 ? '+' : ''}${answer}).`,
      });

      id += 1;
    });
  }

  return questions;
};

export const TOTAL_QUESTION_POOL = generateCountQuestions();

export const createQuizSession = (count = 30) => shuffle(TOTAL_QUESTION_POOL).slice(0, count);
