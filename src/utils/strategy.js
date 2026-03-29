export const cardPoints = (value) => {
  if (value === 'A') return 11;
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? 10 : parsed;
};

export const calculateHandMeta = (hand) => {
  let total = 0;
  let aces = 0;

  hand.forEach((card) => {
    total += cardPoints(card.value);
    if (card.value === 'A') aces += 1;
  });

  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }

  return {
    total,
    isSoft: aces > 0,
  };
};

export const getDealerUpcardValue = (card) => {
  if (!card) return 0;
  if (card.value === 'A') return 11;
  const parsed = Number.parseInt(card.value, 10);
  return Number.isNaN(parsed) ? 10 : parsed;
};

export const getBasicStrategy = ({ playerTotal, isSoft, dealerUpcardValue }) => {
  if (playerTotal >= 21) return 'STAND';

  if (isSoft) {
    if (playerTotal <= 17) return 'HIT';
    if (playerTotal === 18) {
      if ([3, 4, 5, 6].includes(dealerUpcardValue)) return 'DOUBLE/HIT';
      if ([9, 10, 11].includes(dealerUpcardValue)) return 'HIT';
      return 'STAND';
    }
    return 'STAND';
  }

  if (playerTotal <= 8) return 'HIT';
  if (playerTotal === 9) return dealerUpcardValue >= 3 && dealerUpcardValue <= 6 ? 'DOUBLE/HIT' : 'HIT';
  if (playerTotal === 10) return dealerUpcardValue <= 9 ? 'DOUBLE/HIT' : 'HIT';
  if (playerTotal === 11) return 'DOUBLE/HIT';
  if (playerTotal === 12) return dealerUpcardValue >= 4 && dealerUpcardValue <= 6 ? 'STAND' : 'HIT';
  if (playerTotal >= 13 && playerTotal <= 16) return dealerUpcardValue <= 6 ? 'STAND' : 'HIT';
  return 'STAND';
};

export const buildCoachMoment = ({
  playerTotal,
  handLength,
  dealerUpcardValue,
  trueCount,
  advice,
  gameState,
}) => {
  if (gameState !== 'PLAYING') return null;

  if (handLength === 2 && playerTotal === 16 && dealerUpcardValue >= 9) {
    return {
      id: 'hard-16-danger',
      title: 'Freeze Moment: Hard 16 vs Strong Dealer',
      detail: 'This is one of the biggest leak spots. Default basic strategy usually says HIT against a dealer 9, 10, or Ace.',
      action: advice,
    };
  }

  if (handLength === 2 && playerTotal === 12 && [2, 3].includes(dealerUpcardValue)) {
    return {
      id: 'hard-12-trap',
      title: 'Freeze Moment: 12 vs 2/3 Trap',
      detail: 'Many players stand too often here. Basic strategy usually hits because dealer bust chance is not high enough yet.',
      action: advice,
    };
  }

  if (handLength === 2 && playerTotal === 11) {
    return {
      id: 'eleven-power',
      title: 'Freeze Moment: Best Double Spot',
      detail: 'Hard 11 is a high-EV hand. In real play this is usually an aggressive double opportunity.',
      action: advice,
    };
  }

  if (trueCount >= 2) {
    return {
      id: 'tc-positive',
      title: 'Freeze Moment: Advantage Count',
      detail: 'True count is +2 or higher. High cards are rich, so betting/aggression typically goes up.',
      action: advice,
    };
  }

  if (trueCount <= -2) {
    return {
      id: 'tc-negative',
      title: 'Freeze Moment: Defensive Count',
      detail: 'True count is strongly negative. This is usually a low-edge zone, so keep risk low and play disciplined.',
      action: advice,
    };
  }

  if (playerTotal >= 17) {
    return {
      id: 'patience-stand',
      title: 'Freeze Moment: High Total Discipline',
      detail: 'Most losses at this stage come from over-hitting. Protect your made hand.',
      action: advice,
    };
  }

  return null;
};
