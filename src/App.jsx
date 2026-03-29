import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  FormControlLabel,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import {
  HistoryEdu as HistoryIcon,
  LocalMovies as MoviesIcon,
  MenuBook as GuideIcon,
  MusicNote as MusicIcon,
  Tune as TuneIcon,
  PlayArrow as PlayIcon,
  Quiz as QuizIcon,
  Refresh as RefreshIcon,
  Terminal as TerminalIcon,
  Visibility as EyeIcon,
  VisibilityOff as EyeOffIcon,
} from '@mui/icons-material';
import { createShoe } from './utils/engine';
import {
  buildCoachMoment,
  calculateHandMeta,
  getBasicStrategy,
  getDealerUpcardValue,
} from './utils/strategy';
import { TOTAL_QUESTION_POOL, createQuizSession } from './utils/quiz';
import Card from './components/Card';
import HackerTutorial from './components/HackerTutorial';

const BASE_BET = 10;
const YOUTUBE_EMBED_URL =
  'https://www.youtube.com/embed/PaFHwTjy1yE?autoplay=1&loop=1&playlist=PaFHwTjy1yE&controls=0&modestbranding=1&rel=0';
const TEXT_PRIMARY = '#f3f6ff';
const TEXT_SECONDARY = '#d7e4ff';
const TEXT_MUTED = '#aebfdf';
const TEXT_ACCENT = '#8fc3ff';
const PANEL_BG = 'rgba(18, 30, 52, 0.88)';
const PANEL_BORDER = '1px solid rgba(167, 190, 232, 0.22)';
const WHITE = '#ffffff';

const STUDY_NOTES = [
  {
    title: '1) Count Fast, Not Perfect',
    text: 'Track only three buckets: low cards (+1), neutral cards (0), and high cards (-1). Use cancellation when possible.',
  },
  {
    title: '2) Convert to True Count Every Hand',
    text: 'Running count alone is noisy in shoes. Divide by decks remaining and make betting decisions from the true count.',
  },
  {
    title: '3) Bet Ramp Discipline',
    text: 'Negative/neutral count: minimum bet. Positive count (+2 or better): increase bet in clear steps, not random jumps.',
  },
  {
    title: '4) Decision Discipline',
    text: 'Most training leaks are emotional hits on stiff totals. Freeze moments in this app are focused on fixing exactly that.',
  },
];

const FAMOUS_COUNTERS = [
  {
    name: 'Edward O. Thorp',
    wikiTitle: 'Edward_O._Thorp',
    impact:
      'Published Beat the Dealer (1962) and proved blackjack counting could generate a real player edge.',
    years: '1960s onward',
    links: [
      { label: 'Wikipedia', href: 'https://en.wikipedia.org/wiki/Edward_O._Thorp' },
      { label: 'Beat the Dealer', href: 'https://en.wikipedia.org/wiki/Beat_the_Dealer' },
    ],
  },
  {
    name: 'Ken Uston',
    wikiTitle: 'Ken_Uston',
    impact:
      'Popularized team-play methods and legal challenges that helped players in jurisdictions where skill-play rights were contested.',
    years: '1970s-1980s',
    links: [
      { label: 'Wikipedia', href: 'https://en.wikipedia.org/wiki/Ken_Uston' },
      { label: 'Official Site', href: 'https://uston.com/' },
    ],
  },
  {
    name: 'MIT Blackjack Team',
    wikiTitle: 'MIT_Blackjack_Team',
    impact:
      'A famous organized advantage-play team that scaled bankroll and role specialization in modern blackjack.',
    years: '1980s-2000s',
    links: [
      { label: 'Wikipedia', href: 'https://en.wikipedia.org/wiki/MIT_Blackjack_Team' },
      { label: 'Inside Story (Book)', href: 'https://en.wikipedia.org/wiki/Bringing_Down_the_House' },
    ],
  },
  {
    name: 'Stanford Wong',
    wikiTitle: 'Stanford_Wong',
    impact:
      'Influential author and strategist; helped formalize practical counting systems and table-exit entry tactics.',
    years: '1970s onward',
    links: [
      { label: 'Wikipedia', href: 'https://en.wikipedia.org/wiki/Stanford_Wong' },
      { label: 'Professional Blackjack', href: 'https://en.wikipedia.org/wiki/Professional_Blackjack' },
    ],
  },
  {
    name: 'Tommy Hyland',
    wikiTitle: 'Tommy_Hyland',
    impact:
      'Long-running team manager known for sustained professional advantage play and disciplined training operations.',
    years: '1980s onward',
    links: [
      { label: 'Wikipedia', href: 'https://en.wikipedia.org/wiki/Tommy_Hyland' },
      { label: 'Blackjack Hall of Fame', href: 'https://en.wikipedia.org/wiki/Blackjack_Hall_of_Fame' },
    ],
  },
  {
    name: 'Don Johnson',
    wikiTitle: 'Don_Johnson_(gambler)',
    impact:
      'Negotiated casino rule sets and exploited high-value edge conditions to produce one of the biggest modern blackjack winning runs.',
    years: '2010s',
    links: [
      { label: 'Wikipedia', href: 'https://en.wikipedia.org/wiki/Don_Johnson_(gambler)' },
      { label: 'Profile', href: 'https://en.wikipedia.org/wiki/Don_Johnson_(gambler)#Gambling' },
    ],
  },
];

const CARD_MOVIES = [
  {
    title: '21',
    year: '2008',
    wikiTitle: '21_(2008_film)',
    why:
      'Based on MIT team stories; useful for seeing team roles, bankroll handling, and casino heat dynamics.',
    links: [
      { label: 'Wikipedia', href: 'https://en.wikipedia.org/wiki/21_(2008_film)' },
      { label: 'Trailer Search', href: 'https://www.youtube.com/results?search_query=21+2008+official+trailer' },
    ],
  },
  {
    title: 'Rounders',
    year: '1998',
    wikiTitle: 'Rounders_(film)',
    why: 'Poker-focused, but still one of the best films on discipline, bankroll pressure, and table psychology.',
    links: [
      { label: 'Wikipedia', href: 'https://en.wikipedia.org/wiki/Rounders_(film)' },
      { label: 'Trailer Search', href: 'https://www.youtube.com/results?search_query=Rounders+1998+official+trailer' },
    ],
  },
  {
    title: 'The Last Casino',
    year: '2004',
    wikiTitle: 'The_Last_Casino',
    why: 'A blackjack-centric story about building a counting team and operational tradeoffs.',
    links: [
      { label: 'Wikipedia', href: 'https://en.wikipedia.org/wiki/The_Last_Casino' },
      { label: 'Trailer Search', href: 'https://www.youtube.com/results?search_query=The+Last+Casino+trailer' },
    ],
  },
  {
    title: "The Cincinnati Kid",
    year: '1965',
    wikiTitle: 'The_Cincinnati_Kid',
    why: 'Classic card-table tension and risk-management themes that still translate to modern advantage play.',
    links: [
      { label: 'Wikipedia', href: 'https://en.wikipedia.org/wiki/The_Cincinnati_Kid' },
      { label: 'Trailer Search', href: 'https://www.youtube.com/results?search_query=The+Cincinnati+Kid+trailer' },
    ],
  },
  {
    title: "Molly's Game",
    year: '2017',
    wikiTitle: "Molly's_Game",
    why: 'High-stakes game operations, player behavior, and the business side around elite card action.',
    links: [
      { label: 'Wikipedia', href: 'https://en.wikipedia.org/wiki/Molly%27s_Game' },
      { label: 'Trailer Search', href: 'https://www.youtube.com/results?search_query=Molly%27s+Game+official+trailer' },
    ],
  },
  {
    title: 'The Card Counter',
    year: '2021',
    wikiTitle: 'The_Card_Counter',
    why: 'More character-driven than tactical, but still useful for mindset, discipline, and grind culture themes.',
    links: [
      { label: 'Wikipedia', href: 'https://en.wikipedia.org/wiki/The_Card_Counter' },
      { label: 'Trailer Search', href: 'https://www.youtube.com/results?search_query=The+Card+Counter+official+trailer' },
    ],
  },
];

const TOP_UP_JOKES_LOSING = [
  'Looks like someone might be divorced soon.',
  'Emergency refill approved by the Department of Bad Beats.',
  'This kitty has seen more comebacks than a 90s sequel.',
  'Variance is cooking you, but your optimism is elite.',
  'At this point the bankroll is mostly a motivational speaker.',
];

const TOP_UP_JOKES_WINNING = [
  'You are winning and still topping up. That is confidence or chaos.',
  'Stacking chips while ahead. Respectfully unhinged behavior.',
  'You are up and still adding fuel. Final boss bankroll mode.',
  'The kitty did not ask for backup, but it appreciates the support.',
  'This is less bankroll management, more financial overkill.',
];

const TOP_UP_JOKES_NEUTRAL = [
  'Kitty topped up. Back to business.',
  'Fresh ammo loaded. Stay disciplined.',
  'Bankroll upgraded. Keep the tilt unplugged.',
  'Funds added. Now play like a spreadsheet with a pulse.',
  'New chips, same strategy.',
];

const pickRandom = (items) => items[Math.floor(Math.random() * items.length)];

const createLegendAvatar = (name, index) => {
  const tones = [
    { bg: '#223a5f', card: '#8fc3ff', chip: '#ffd166' },
    { bg: '#2c3e5f', card: '#7ad3a8', chip: '#ff9f80' },
    { bg: '#1f4d58', card: '#b6c5ff', chip: '#ffc66e' },
    { bg: '#3a3358', card: '#90d0ff', chip: '#ffb4c6' },
  ];
  const tone = tones[index % tones.length];
  const initial = name.slice(0, 1).toUpperCase();
  const funny = ['Card Shark', 'Count Wizard', 'Edge Hunter', 'Bankroll Ninja'][index % 4];
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="300" height="220">
    <rect width="100%" height="100%" rx="18" fill="${tone.bg}" />
    <rect x="18" y="18" width="86" height="122" rx="10" fill="${tone.card}" />
    <circle cx="246" cy="62" r="28" fill="${tone.chip}" />
    <circle cx="246" cy="62" r="16" fill="none" stroke="#ffffff" stroke-width="3" />
    <circle cx="246" cy="62" r="7" fill="#ffffff" />
    <text x="61" y="95" text-anchor="middle" font-size="56" font-weight="700" fill="#0f223d">${initial}</text>
    <text x="150" y="165" text-anchor="middle" font-size="26" font-weight="700" fill="#ffffff">${funny}</text>
    <text x="150" y="196" text-anchor="middle" font-size="16" fill="#ffffff">${name}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const getBetSize = (trueCount) => {
  if (trueCount >= 4) return BASE_BET * 6;
  if (trueCount >= 2) return BASE_BET * 4;
  if (trueCount >= 1) return BASE_BET * 2;
  return BASE_BET;
};

const compareHands = ({ playerMeta, dealerMeta, playerBlackjack, dealerBlackjack, bet }) => {
  const blackjackPayout = Math.round(bet * 1.5);

  if (playerBlackjack && dealerBlackjack) {
    return { type: 'PUSH', text: 'Both blackjack. Push.', bankrollDelta: 0, blackjack: false };
  }
  if (playerBlackjack) {
    return { type: 'WIN', text: `Blackjack payout! +$${blackjackPayout}`, bankrollDelta: blackjackPayout, blackjack: true };
  }
  if (dealerBlackjack) {
    return { type: 'LOSS', text: `Dealer blackjack. -$${bet}`, bankrollDelta: -bet, blackjack: false };
  }
  if (playerMeta.total > 21) {
    return { type: 'LOSS', text: `Player busts. -$${bet}`, bankrollDelta: -bet, blackjack: false };
  }
  if (dealerMeta.total > 21) {
    return { type: 'WIN', text: `Dealer busts. +$${bet}`, bankrollDelta: bet, blackjack: false };
  }
  if (playerMeta.total > dealerMeta.total) {
    return { type: 'WIN', text: `Player wins. +$${bet}`, bankrollDelta: bet, blackjack: false };
  }
  if (playerMeta.total < dealerMeta.total) {
    return { type: 'LOSS', text: `Dealer wins. -$${bet}`, bankrollDelta: -bet, blackjack: false };
  }
  return { type: 'PUSH', text: `Push. $${bet} returned.`, bankrollDelta: 0, blackjack: false };
};

function App() {
  const isMobile = useMediaQuery('(max-width:900px)');
  const [tab, setTab] = useState('trainer');
  const [shoe, setShoe] = useState(createShoe(6));
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [gameState, setGameState] = useState('IDLE');
  const [runningCount, setRunningCount] = useState(0);
  const [holeCardRevealed, setHoleCardRevealed] = useState(false);
  const [showCount, setShowCount] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [controlDrawerOpen, setControlDrawerOpen] = useState(false);
  const [message, setMessage] = useState('Press DEAL NEW HAND to start training.');
  const [handResult, setHandResult] = useState('');
  const [coachEnabled, setCoachEnabled] = useState(true);
  const [coachMoment, setCoachMoment] = useState(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [youtubeMusicOn, setYoutubeMusicOn] = useState(false);
  const [currentBet, setCurrentBet] = useState(BASE_BET);
  const [addFundsAmount, setAddFundsAmount] = useState(100);
  const [stats, setStats] = useState({
    hands: 0,
    wins: 0,
    losses: 0,
    pushes: 0,
    blackjacks: 0,
    currentStreak: 0,
    bestStreak: 0,
    currentLossStreak: 0,
    bankroll: 1000,
  });

  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizSelected, setQuizSelected] = useState('');
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [wikiImages, setWikiImages] = useState({});

  const audioCtxRef = useRef(null);
  const ambienceTimerRef = useRef(null);
  const coachSeenRef = useRef(new Set());

  const playerMeta = useMemo(() => calculateHandMeta(playerHand), [playerHand]);
  const dealerMeta = useMemo(() => calculateHandMeta(dealerHand), [dealerHand]);

  const dealerUpcardValue = getDealerUpcardValue(dealerHand[0]);
  const decksRemaining = Math.max(0.5, shoe.length / 52);
  const trueCountRaw = runningCount / decksRemaining;
  const trueCount = Number(trueCountRaw.toFixed(1));
  const suggestedBet = getBetSize(trueCountRaw);
  const isFrozen = Boolean(coachMoment);

  const advice =
    gameState === 'PLAYING'
      ? getBasicStrategy({
          playerTotal: playerMeta.total,
          isSoft: playerMeta.isSoft,
          dealerUpcardValue,
        })
      : 'READY';

  const tensInShoe = shoe.filter((card) => ['10', 'J', 'Q', 'K', 'A'].includes(card.value)).length;
  const tenProb = shoe.length > 0 ? ((tensInShoe / shoe.length) * 100).toFixed(1) : '0.0';

  const getAudioContext = useCallback(() => {
    if (!audioEnabled) return null;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;

    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      audioCtxRef.current = new AudioContextClass();
    }

    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, [audioEnabled]);

  const playTone = useCallback((frequency, duration = 0.1, type = 'triangle', volume = 0.03) => {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }, [getAudioContext]);

  const playSuccess = () => {
    playTone(523.25, 0.09, 'sine', 0.035);
    setTimeout(() => playTone(659.25, 0.1, 'sine', 0.035), 50);
  };

  const playError = () => {
    playTone(207.65, 0.12, 'sawtooth', 0.03);
    setTimeout(() => playTone(174.61, 0.12, 'sawtooth', 0.028), 60);
  };

  const stopAmbience = useCallback(() => {
    if (ambienceTimerRef.current) {
      clearInterval(ambienceTimerRef.current);
      ambienceTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!audioEnabled) {
      stopAmbience();
      return undefined;
    }

    const pulse = () => {
      playTone(130.81, 0.5, 'triangle', 0.012);
      setTimeout(() => playTone(164.81, 0.45, 'triangle', 0.01), 120);
      setTimeout(() => playTone(196, 0.4, 'triangle', 0.01), 220);
    };

    pulse();
    ambienceTimerRef.current = setInterval(pulse, 2600);

    return () => {
      stopAmbience();
    };
  }, [audioEnabled, playTone, stopAmbience]);

  useEffect(() => {
    return () => {
      stopAmbience();
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
      }
    };
  }, [stopAmbience]);

  useEffect(() => {
    let cancelled = false;
    const titles = [...new Set(CARD_MOVIES.map((entry) => entry.wikiTitle))];

    const fetchSummaryImage = async (title) => {
      try {
        const response = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
        );
        if (!response.ok) return [title, ''];
        const data = await response.json();
        return [title, data?.thumbnail?.source || data?.originalimage?.source || ''];
      } catch {
        return [title, ''];
      }
    };

    Promise.all(titles.map((title) => fetchSummaryImage(title))).then((entries) => {
      if (cancelled) return;
      setWikiImages(Object.fromEntries(entries));
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const maybeOpenCoachMoment = ({ hand, dealer, count, shoeState }) => {
    if (!coachEnabled || isFrozen) return;

    const handMeta = calculateHandMeta(hand);
    const upcardValue = getDealerUpcardValue(dealer[0]);
    const decks = Math.max(0.5, shoeState.length / 52);
    const tc = Number((count / decks).toFixed(1));
    const action = getBasicStrategy({
      playerTotal: handMeta.total,
      isSoft: handMeta.isSoft,
      dealerUpcardValue: upcardValue,
    });

    const moment = buildCoachMoment({
      playerTotal: handMeta.total,
      isSoft: handMeta.isSoft,
      handLength: hand.length,
      dealerUpcardValue: upcardValue,
      trueCount: tc,
      advice: action,
      gameState: 'PLAYING',
    });

    if (!moment) return;
    if (coachSeenRef.current.has(moment.id)) return;

    coachSeenRef.current.add(moment.id);
    setCoachMoment(moment);
    playTone(392, 0.12, 'square', 0.03);
  };

  const applyHandResult = (outcome) => {
    setGameState('FINISHED');
    setHandResult(outcome.text);
    setMessage(outcome.text);

    setStats((prev) => {
      let nextStreak = prev.currentStreak;
      let nextLossStreak = prev.currentLossStreak;
      if (outcome.type === 'WIN') nextStreak += 1;
      if (outcome.type === 'LOSS') {
        nextStreak = 0;
        nextLossStreak += 1;
      }
      if (outcome.type === 'WIN' || outcome.type === 'PUSH') {
        nextLossStreak = 0;
      }

      return {
        ...prev,
        hands: prev.hands + 1,
        wins: prev.wins + (outcome.type === 'WIN' ? 1 : 0),
        losses: prev.losses + (outcome.type === 'LOSS' ? 1 : 0),
        pushes: prev.pushes + (outcome.type === 'PUSH' ? 1 : 0),
        blackjacks: prev.blackjacks + (outcome.blackjack ? 1 : 0),
        bankroll: prev.bankroll + outcome.bankrollDelta,
        currentStreak: nextStreak,
        bestStreak: Math.max(prev.bestStreak, nextStreak),
        currentLossStreak: nextLossStreak,
      };
    });

    if (outcome.type === 'WIN') playSuccess();
    else if (outcome.type === 'LOSS') playError();
    else playTone(349.23, 0.1, 'triangle', 0.025);
  };

  const startNewHand = () => {
    if (gameState === 'PLAYING') return;
    if (stats.bankroll <= 0) {
      setMessage('Kitty is empty. Add funds before dealing a new hand.');
      return;
    }
    if (currentBet <= 0 || currentBet > stats.bankroll) {
      setMessage('Bet is invalid for current kitty. Adjust bet or add funds.');
      return;
    }

    let currentShoe = [...shoe];
    let nextRunningCount = runningCount;

    if (currentShoe.length < 52) {
      currentShoe = createShoe(6);
      nextRunningCount = 0;
      setMessage('Shoe was low and has been reshuffled. Running count reset.');
    }

    const p1 = currentShoe.pop();
    const d1 = currentShoe.pop();
    const p2 = currentShoe.pop();
    const d2 = currentShoe.pop();

    if (!p1 || !d1 || !p2 || !d2) {
      setMessage('Not enough cards. Resetting shoe.');
      setShoe(createShoe(6));
      setRunningCount(0);
      return;
    }

    nextRunningCount += p1.countValue + d1.countValue + p2.countValue;

    const nextPlayer = [p1, p2];
    const nextDealer = [d1, d2];
    const nextPlayerMeta = calculateHandMeta(nextPlayer);
    const nextDealerMeta = calculateHandMeta(nextDealer);

    setPlayerHand(nextPlayer);
    setDealerHand(nextDealer);
    setShoe(currentShoe);
    setRunningCount(nextRunningCount);
    setHoleCardRevealed(false);
    setGameState('PLAYING');
    setHandResult('');
    setCoachMoment(null);
    coachSeenRef.current = new Set();

    playTone(293.66, 0.07, 'triangle', 0.03);

    const playerBlackjack = nextPlayer.length === 2 && nextPlayerMeta.total === 21;
    const dealerBlackjack = nextDealer.length === 2 && nextDealerMeta.total === 21;

    if (playerBlackjack || dealerBlackjack) {
      const finalRunning = nextRunningCount + d2.countValue;
      setRunningCount(finalRunning);
      setHoleCardRevealed(true);
      applyHandResult(
        compareHands({
          playerMeta: nextPlayerMeta,
          dealerMeta: nextDealerMeta,
          playerBlackjack,
          dealerBlackjack,
          bet: currentBet,
        }),
      );
    } else {
      maybeOpenCoachMoment({
        hand: nextPlayer,
        dealer: nextDealer,
        count: nextRunningCount,
        shoeState: currentShoe,
      });
    }
  };

  const hit = () => {
    if (gameState !== 'PLAYING' || isFrozen) return;

    const currentShoe = [...shoe];
    const nextCard = currentShoe.pop();
    if (!nextCard) return;

    let nextRunningCount = runningCount + nextCard.countValue;
    const nextPlayer = [...playerHand, nextCard];
    const nextPlayerMeta = calculateHandMeta(nextPlayer);

    setPlayerHand(nextPlayer);
    setShoe(currentShoe);
    setRunningCount(nextRunningCount);
    playTone(440, 0.06, 'triangle', 0.028);

    if (nextPlayerMeta.total > 21) {
      if (!holeCardRevealed && dealerHand[1]) {
        nextRunningCount += dealerHand[1].countValue;
        setRunningCount(nextRunningCount);
        setHoleCardRevealed(true);
      }
      applyHandResult(
        compareHands({
          playerMeta: nextPlayerMeta,
          dealerMeta,
          playerBlackjack: false,
          dealerBlackjack: false,
          bet: currentBet,
        }),
      );
    } else {
      maybeOpenCoachMoment({
        hand: nextPlayer,
        dealer: dealerHand,
        count: nextRunningCount,
        shoeState: currentShoe,
      });
    }
  };

  const stand = () => {
    if (gameState !== 'PLAYING' || isFrozen) return;

    const currentShoe = [...shoe];
    const nextDealer = [...dealerHand];
    let nextRunningCount = runningCount;

    if (!holeCardRevealed && nextDealer[1]) {
      nextRunningCount += nextDealer[1].countValue;
      setHoleCardRevealed(true);
    }

    while (calculateHandMeta(nextDealer).total < 17) {
      const card = currentShoe.pop();
      if (!card) break;
      nextDealer.push(card);
      nextRunningCount += card.countValue;
      playTone(329.63, 0.05, 'triangle', 0.02);
    }

    const nextDealerMeta = calculateHandMeta(nextDealer);

    setDealerHand(nextDealer);
    setShoe(currentShoe);
    setRunningCount(nextRunningCount);
    applyHandResult(
      compareHands({
        playerMeta,
        dealerMeta: nextDealerMeta,
        playerBlackjack: false,
        dealerBlackjack: false,
        bet: currentBet,
      }),
    );
  };

  const resetSession = () => {
    setShoe(createShoe(6));
    setPlayerHand([]);
    setDealerHand([]);
    setGameState('IDLE');
    setRunningCount(0);
    setHoleCardRevealed(false);
    setMessage('Trainer reset complete.');
    setHandResult('');
    setCoachMoment(null);
    coachSeenRef.current = new Set();
    setStats({
      hands: 0,
      wins: 0,
      losses: 0,
      pushes: 0,
      blackjacks: 0,
      currentStreak: 0,
      bestStreak: 0,
      currentLossStreak: 0,
      bankroll: 1000,
    });
    setCurrentBet(BASE_BET);
  };

  const dismissCoachMoment = () => {
    setCoachMoment(null);
    playTone(261.63, 0.07, 'sine', 0.03);
  };

  const startQuiz = () => {
    setQuizQuestions(createQuizSession(30));
    setQuizIndex(0);
    setQuizScore(0);
    setQuizSelected('');
    setQuizAnswered(false);
    setQuizComplete(false);
    playTone(493.88, 0.09, 'sine', 0.03);
  };

  const currentQuizQuestion = quizQuestions[quizIndex];

  const answerQuiz = (option) => {
    if (!currentQuizQuestion || quizAnswered || quizComplete) return;
    setQuizSelected(option);
    setQuizAnswered(true);
    if (option === currentQuizQuestion.answer) {
      setQuizScore((prev) => prev + 1);
      playSuccess();
    } else {
      playError();
    }
  };

  const nextQuizQuestion = () => {
    if (!quizQuestions.length) return;
    if (quizIndex >= quizQuestions.length - 1) {
      setQuizComplete(true);
      return;
    }
    setQuizIndex((prev) => prev + 1);
    setQuizSelected('');
    setQuizAnswered(false);
  };

  const normalizeBet = useCallback(
    (raw) => {
      const maxAffordable = Math.floor(stats.bankroll);
      if (maxAffordable <= 0) return 0;
      const numeric = Number(raw);
      if (!Number.isFinite(numeric)) return Math.min(BASE_BET, maxAffordable);
      return Math.min(Math.max(5, Math.floor(numeric)), maxAffordable);
    },
    [stats.bankroll],
  );

  const setBetQuick = (value) => {
    setCurrentBet(normalizeBet(value));
  };

  const adjustBet = (delta) => {
    setCurrentBet((prev) => normalizeBet(prev + delta));
  };

  const addFundsToKitty = () => {
    const amount = Math.max(10, Math.floor(Number(addFundsAmount) || 0));
    if (!amount) return;

    setStats((prev) => ({ ...prev, bankroll: prev.bankroll + amount }));
    setCurrentBet((prev) => normalizeBet(prev));

    const isLosing = stats.losses > stats.wins || stats.currentLossStreak >= 2;
    const isWinning = stats.wins > stats.losses + 1;
    const joke = isLosing
      ? pickRandom(TOP_UP_JOKES_LOSING)
      : isWinning
        ? pickRandom(TOP_UP_JOKES_WINNING)
        : pickRandom(TOP_UP_JOKES_NEUTRAL);

    setMessage(`Kitty topped up by $${amount}. ${joke}`);
  };

  const statTiles = [
    { label: 'Hands', value: stats.hands },
    { label: 'W', value: stats.wins },
    { label: 'L', value: stats.losses },
    { label: 'P', value: stats.pushes },
    { label: 'Blackjacks', value: stats.blackjacks },
    { label: 'Best Streak', value: stats.bestStreak },
    { label: 'Bankroll', value: `$${stats.bankroll}` },
    { label: 'Current Bet', value: `$${currentBet}` },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at 14% 12%, rgba(56, 104, 184, 0.22) 0%, rgba(12, 20, 36, 0.95) 48%), linear-gradient(165deg, #0b1220 0%, #141f33 62%, #1a2840 100%)',
        color: TEXT_SECONDARY,
        pb: { xs: 14, md: 6 },
      }}
    >
      {showTutorial && <HackerTutorial onClose={() => setShowTutorial(false)} />}

      <Container maxWidth="lg" sx={{ pt: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 3,
            backgroundColor: PANEL_BG,
            border: PANEL_BORDER,
            color: TEXT_PRIMARY,
            backdropFilter: 'blur(8px)',
          }}
        >
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
            <Box>
              <Typography variant="overline" sx={{ letterSpacing: 2, color: TEXT_ACCENT }}>
                BLACKJACK TRAINER // SKILL MODE
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 900, color: TEXT_PRIMARY }}>
                Tactical Practice Console
              </Typography>
            </Box>

            <Stack direction="row" spacing={1}>
              <IconButton
                onClick={() => setShowCount((prev) => !prev)}
                sx={{ color: TEXT_PRIMARY, border: '1px solid rgba(167, 190, 232, 0.4)' }}
              >
                {showCount ? <EyeOffIcon /> : <EyeIcon />}
              </IconButton>
              <IconButton
                onClick={() => {
                  setAudioEnabled((prev) => !prev);
                  setYoutubeMusicOn((prev) => !prev);
                }}
                sx={{
                  color: youtubeMusicOn ? '#facc15' : TEXT_PRIMARY,
                  border: '1px solid rgba(167, 190, 232, 0.4)',
                }}
              >
                <MusicIcon />
              </IconButton>
              <IconButton onClick={resetSession} sx={{ color: '#fca5a5', border: '1px solid rgba(252, 165, 165, 0.5)' }}>
                <RefreshIcon />
              </IconButton>
            </Stack>
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mt: 2 }} alignItems={{ xs: 'stretch', sm: 'center' }}>
            <Button
              variant="outlined"
              startIcon={<TuneIcon />}
              onClick={() => setControlDrawerOpen(true)}
              sx={{ color: WHITE, borderColor: 'rgba(167, 190, 232, 0.45)' }}
            >
              Open Control Drawer
            </Button>
            <Typography variant="body2" sx={{ color: TEXT_SECONDARY }}>
              Focus mode enabled. Advanced chips and controls are tucked into the drawer.
            </Typography>
          </Stack>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            mb: 3,
            borderRadius: 3,
            backgroundColor: PANEL_BG,
            border: PANEL_BORDER,
            color: TEXT_PRIMARY,
          }}
        >
          <Tabs
            value={tab}
            onChange={(_, value) => setTab(value)}
            textColor="inherit"
            indicatorColor="secondary"
            variant={isMobile ? 'scrollable' : 'fullWidth'}
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: '#7fb7ff',
                height: 3,
              },
              '& .MuiTab-root': {
                color: TEXT_MUTED,
                fontWeight: 700,
                minHeight: 56,
                textTransform: 'none',
              },
              '& .MuiTab-root.Mui-selected': {
                color: TEXT_PRIMARY,
                backgroundColor: 'rgba(9, 18, 34, 0.55)',
              },
            }}
          >
            <Tab value="trainer" label="Trainer" icon={<PlayIcon />} iconPosition="start" />
            <Tab value="quiz" label="Quiz (30 / 120)" icon={<QuizIcon />} iconPosition="start" />
            <Tab value="guide" label="Study Guide" icon={<GuideIcon />} iconPosition="start" />
            <Tab value="history" label="Legends" icon={<HistoryIcon />} iconPosition="start" />
            <Tab value="movies" label="Movies" icon={<MoviesIcon />} iconPosition="start" />
          </Tabs>
        </Paper>

        {tab === 'trainer' && (
          <Stack spacing={2}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 3,
                backgroundColor: PANEL_BG,
                border: PANEL_BORDER,
                color: TEXT_PRIMARY,
              }}
            >
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'stretch', sm: 'center' }} justifyContent="space-between">
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip label={`Bankroll: $${stats.bankroll}`} sx={{ color: WHITE }} />
                  <Chip label={`Current Bet: $${currentBet}`} sx={{ color: WHITE }} />
                  <Chip label={`Hands: ${stats.hands}`} sx={{ color: WHITE }} />
                </Stack>
                <Button
                  variant="outlined"
                  startIcon={<TuneIcon />}
                  onClick={() => setControlDrawerOpen(true)}
                  sx={{ color: WHITE, borderColor: 'rgba(167, 190, 232, 0.45)' }}
                >
                  Manage Stats, Bets, Tips
                </Button>
              </Stack>
            </Paper>

            {message && <Alert severity="info">{message}</Alert>}

            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: 4,
                border: '1px solid rgba(167, 190, 232, 0.3)',
                background:
                  'linear-gradient(160deg, rgba(21, 37, 63, 0.96) 0%, rgba(27, 45, 76, 0.95) 58%, rgba(33, 55, 90, 0.96) 100%)',
                boxShadow: 'inset 0 0 80px rgba(0,0,0,0.22)',
                color: TEXT_PRIMARY,
              }}
            >
              <Stack spacing={2} alignItems="center">
                <Box>
                  <Typography variant="overline" sx={{ color: TEXT_SECONDARY }}>
                    Dealer
                  </Typography>
                  <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 1 }}>
                    {dealerHand.map((card, index) => (
                      <Card
                        key={card.id}
                        value={card.value}
                        suit={card.suit}
                        hidden={gameState === 'PLAYING' && index === 1}
                      />
                    ))}
                  </Stack>
                  <Typography variant="body2" sx={{ textAlign: 'center', mt: 1, color: TEXT_PRIMARY }}>
                    {gameState === 'PLAYING' ? `Upcard: ${dealerHand[0]?.value ?? '-'}` : `Dealer: ${dealerMeta.total || '-'}`}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="overline" sx={{ color: TEXT_SECONDARY }}>
                    Player
                  </Typography>
                  <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 1 }}>
                    {playerHand.map((card) => (
                      <Card key={card.id} value={card.value} suit={card.suit} />
                    ))}
                  </Stack>
                  <Typography variant="h4" sx={{ textAlign: 'center', mt: 1, fontWeight: 900 }}>
                    {playerMeta.total || '-'}
                  </Typography>
                </Box>

                <Paper
                  elevation={0}
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    bgcolor: 'rgba(7, 15, 29, 0.48)',
                  }}
                >
                  <Typography variant="body2" sx={{ textAlign: 'center', color: '#ffffff' }}>
                    Recommended Action: <strong>{advice}</strong>
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: TEXT_MUTED }}>
                    Freeze mode will pause on high-value learning spots.
                  </Typography>
                </Paper>

                <Stack direction="row" spacing={2} sx={{ display: { xs: 'none', md: 'flex' } }}>
                  {gameState === 'PLAYING' ? (
                    <>
                      <Button variant="contained" onClick={hit} disabled={isFrozen}>
                        HIT
                      </Button>
                      <Button variant="contained" color="secondary" onClick={stand} disabled={isFrozen}>
                        STAND
                      </Button>
                    </>
                  ) : (
                    <Button variant="contained" color="success" onClick={startNewHand}>
                      DEAL HAND (${currentBet})
                    </Button>
                  )}
                </Stack>

                {handResult && (
                  <Typography variant="h6" sx={{ fontWeight: 800, color: TEXT_PRIMARY }}>
                    {handResult}
                  </Typography>
                )}
              </Stack>
            </Paper>

            {isMobile && (
              <Paper
                elevation={3}
                sx={{
                  position: 'sticky',
                  bottom: 8,
                  zIndex: 30,
                  p: 1.5,
                  borderRadius: 3,
                  backgroundColor: 'rgba(12, 21, 38, 0.96)',
                  border: PANEL_BORDER,
                  backdropFilter: 'blur(8px)',
                }}
              >
                <Typography variant="body2" sx={{ color: TEXT_PRIMARY, fontWeight: 700 }}>
                  Recommended Action: {advice}
                </Typography>
                <Stack direction="row" spacing={1}>
                  {gameState === 'PLAYING' ? (
                    <>
                      <Button fullWidth variant="contained" onClick={hit} disabled={isFrozen}>
                        HIT
                      </Button>
                      <Button fullWidth variant="contained" color="secondary" onClick={stand} disabled={isFrozen}>
                        STAND
                      </Button>
                    </>
                  ) : (
                    <Button fullWidth variant="contained" color="success" onClick={startNewHand}>
                      DEAL (${currentBet})
                    </Button>
                  )}
                  <Button variant="outlined" onClick={() => setControlDrawerOpen(true)} sx={{ minWidth: 96, color: TEXT_PRIMARY, borderColor: 'rgba(167, 190, 232, 0.45)' }}>
                    Controls
                  </Button>
                </Stack>
              </Paper>
            )}
          </Stack>
        )}

        {tab === 'quiz' && (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: PANEL_BG,
              border: PANEL_BORDER,
              color: TEXT_PRIMARY,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>
              Card Counting Quiz Engine
            </Typography>
            <Typography sx={{ mb: 2, color: TEXT_SECONDARY }}>
              Every run pulls 30 shuffled questions from a 120-question pool focused on true count conversion speed.
            </Typography>

            {!quizQuestions.length && (
              <Button variant="contained" onClick={startQuiz}>
                Start 30-Question Quiz
              </Button>
            )}

            {quizQuestions.length > 0 && (
              <Stack spacing={2}>
                <LinearProgress
                  variant="determinate"
                  value={((quizIndex + (quizComplete ? 1 : 0)) / quizQuestions.length) * 100}
                  sx={{ height: 10, borderRadius: 999 }}
                />

                {!quizComplete && currentQuizQuestion && (
                  <>
                    <Typography variant="body2" sx={{ color: TEXT_SECONDARY }}>
                      Question {quizIndex + 1} of {quizQuestions.length}
                    </Typography>
                    <Typography variant="h6">{currentQuizQuestion.question}</Typography>

                    <Stack spacing={1}>
                      {currentQuizQuestion.options.map((option) => {
                        const isCorrect = option === currentQuizQuestion.answer;
                        const isSelected = option === quizSelected;
                        const color =
                          quizAnswered && isCorrect
                            ? 'success'
                            : quizAnswered && isSelected && !isCorrect
                              ? 'error'
                              : 'inherit';

                        return (
                          <Button
                            key={option}
                            variant={isSelected ? 'contained' : 'outlined'}
                            color={color === 'inherit' ? 'primary' : color}
                            onClick={() => answerQuiz(option)}
                            disabled={quizAnswered}
                            sx={{ justifyContent: 'flex-start' }}
                          >
                            {option}
                          </Button>
                        );
                      })}
                    </Stack>

                    {quizAnswered && (
                      <Alert severity={quizSelected === currentQuizQuestion.answer ? 'success' : 'error'}>
                        {currentQuizQuestion.explanation}
                      </Alert>
                    )}

                    <Stack direction="row" spacing={1}>
                      <Button variant="contained" onClick={nextQuizQuestion} disabled={!quizAnswered}>
                        {quizIndex === quizQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                      </Button>
                      <Button variant="text" onClick={startQuiz}>
                        Restart
                      </Button>
                    </Stack>
                  </>
                )}

                {quizComplete && (
                  <Paper sx={{ p: 2, bgcolor: 'rgba(7, 15, 29, 0.48)', border: '1px solid rgba(167, 190, 232, 0.25)' }}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                      Quiz complete: {quizScore} / {quizQuestions.length}
                    </Typography>
                    <Typography sx={{ color: TEXT_SECONDARY, mb: 1 }}>
                      Accuracy: {((quizScore / quizQuestions.length) * 100).toFixed(1)}%
                    </Typography>
                    <Button variant="contained" onClick={startQuiz}>
                      New 30-Question Set
                    </Button>
                  </Paper>
                )}
              </Stack>
            )}

            <Typography variant="caption" sx={{ display: 'block', mt: 2, color: TEXT_MUTED }}>
              Pool size: {TOTAL_QUESTION_POOL.length} questions.
            </Typography>
          </Paper>
        )}

        {tab === 'guide' && (
          <Stack spacing={2}>
            <Paper
              elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: PANEL_BG,
              border: PANEL_BORDER,
              color: TEXT_PRIMARY,
            }}
          >
              <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>
                Fast Card Counting Framework
              </Typography>
              <Typography sx={{ mb: 2, color: TEXT_SECONDARY }}>
                Use this in-game flow: observe cards, update running count, convert to true count, then execute strategy and bet ramp.
              </Typography>

              <Stack spacing={2}>
                {STUDY_NOTES.map((item) => (
                  <Paper
                    key={item.title}
                    elevation={0}
                    sx={{ p: 2, bgcolor: 'rgba(7, 15, 29, 0.48)', border: '1px solid rgba(167, 190, 232, 0.2)' }}
                  >
                    <Typography sx={{ fontWeight: 800 }}>{item.title}</Typography>
                    <Typography sx={{ color: TEXT_SECONDARY }}>{item.text}</Typography>
                  </Paper>
                ))}
              </Stack>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: PANEL_BG,
                border: PANEL_BORDER,
                color: TEXT_PRIMARY,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>
                Reference: Hi-Lo Values
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                <Chip label="2-6 = +1" color="success" />
                <Chip label="7-9 = 0" color="default" />
                <Chip label="10-A = -1" color="error" />
              </Stack>
              <Typography sx={{ mt: 2, color: TEXT_SECONDARY }}>
                Training target: finish each session with fewer freeze prompts and at least 80% quiz accuracy.
              </Typography>
            </Paper>
          </Stack>
        )}

        {tab === 'history' && (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: PANEL_BG,
              border: PANEL_BORDER,
              color: WHITE,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 900, mb: 1, color: WHITE }}>
              Counter Legends and Impact
            </Typography>
            <Typography sx={{ mb: 2, color: WHITE }}>
              People and teams that changed advantage play, strategy publishing, team operations, and casino countermeasures.
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
              }}
            >
              {FAMOUS_COUNTERS.map((counter, index) => (
                <Paper
                  key={counter.name}
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: 'rgba(7, 15, 29, 0.48)',
                    border: '1px solid rgba(167, 190, 232, 0.2)',
                    borderRadius: 2,
                  }}
                >
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <Box
                      component="img"
                      src={createLegendAvatar(counter.name, index)}
                      alt={counter.name}
                      sx={{
                        width: { xs: '100%', sm: 150 },
                        height: { xs: 170, sm: 150 },
                        objectFit: 'cover',
                        borderRadius: 2,
                        border: '1px solid rgba(167, 190, 232, 0.3)',
                        flexShrink: 0,
                      }}
                    />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: WHITE }}>
                        {counter.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: WHITE, mb: 0.7 }}>
                        {counter.years}
                      </Typography>
                      <Typography variant="body2" sx={{ color: WHITE, mb: 1.2 }}>
                        {counter.impact}
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {counter.links.map((link) => (
                          <Button
                            key={link.href}
                            size="small"
                            variant="outlined"
                            href={link.href}
                            target="_blank"
                            rel="noreferrer"
                            sx={{ color: WHITE, borderColor: 'rgba(167, 190, 232, 0.55)' }}
                          >
                            {link.label}
                          </Button>
                        ))}
                      </Stack>
                    </Box>
                  </Stack>
                </Paper>
              ))}
            </Box>
          </Paper>
        )}

        {tab === 'movies' && (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: PANEL_BG,
              border: PANEL_BORDER,
              color: WHITE,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 900, mb: 1, color: WHITE }}>
              Card and Casino Movie Picks
            </Typography>
            <Typography sx={{ mb: 2, color: WHITE }}>
              Curated films for card culture, bankroll pressure, team dynamics, and decision-making under heat.
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
              }}
            >
              {CARD_MOVIES.map((movie) => (
                <Paper
                  key={movie.title}
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: 'rgba(7, 15, 29, 0.48)',
                    border: '1px solid rgba(167, 190, 232, 0.2)',
                    borderRadius: 2,
                  }}
                >
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    {wikiImages[movie.wikiTitle] ? (
                      <Box
                        component="img"
                        src={wikiImages[movie.wikiTitle]}
                        alt={movie.title}
                        sx={{
                          width: { xs: '100%', sm: 150 },
                          height: { xs: 170, sm: 150 },
                          objectFit: 'cover',
                          borderRadius: 2,
                          border: '1px solid rgba(167, 190, 232, 0.3)',
                          flexShrink: 0,
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: { xs: '100%', sm: 150 },
                          height: { xs: 170, sm: 150 },
                          borderRadius: 2,
                          border: '1px solid rgba(167, 190, 232, 0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: 'rgba(24, 44, 74, 0.8)',
                          color: WHITE,
                          flexShrink: 0,
                        }}
                      >
                        Loading image...
                      </Box>
                    )}
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: WHITE }}>
                        {movie.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: WHITE, mb: 0.7 }}>
                        {movie.year}
                      </Typography>
                      <Typography variant="body2" sx={{ color: WHITE, mb: 1.2 }}>
                        {movie.why}
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {movie.links.map((link) => (
                          <Button
                            key={link.href}
                            size="small"
                            variant="outlined"
                            href={link.href}
                            target="_blank"
                            rel="noreferrer"
                            sx={{ color: WHITE, borderColor: 'rgba(167, 190, 232, 0.55)' }}
                          >
                            {link.label}
                          </Button>
                        ))}
                      </Stack>
                    </Box>
                  </Stack>
                </Paper>
              ))}
            </Box>
          </Paper>
        )}
      </Container>

      <Drawer
        anchor="right"
        open={controlDrawerOpen}
        onClose={() => setControlDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 430 },
            p: 2,
            background: 'linear-gradient(180deg, #162744 0%, #111b2f 100%)',
            color: WHITE,
            borderLeft: PANEL_BORDER,
          },
        }}
      >
        <Stack spacing={2}>
          <Typography variant="h6" sx={{ fontWeight: 900, color: WHITE }}>
            Control Drawer
          </Typography>
          <Typography variant="body2" sx={{ color: WHITE }}>
            Grouped controls by area so the main table stays clean.
          </Typography>

          <Paper elevation={0} sx={{ p: 1.5, bgcolor: 'rgba(7, 15, 29, 0.5)', border: PANEL_BORDER }}>
            <Typography variant="subtitle2" sx={{ color: WHITE, mb: 1 }}>
              Count Intel
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip
                label={`True Count: ${showCount ? `${trueCount >= 0 ? '+' : ''}${trueCount}` : 'Hidden'}`}
                sx={{ color: WHITE, bgcolor: 'rgba(9, 18, 34, 0.95)' }}
              />
              <Chip label={`Decks: ${decksRemaining.toFixed(1)}`} sx={{ color: WHITE, bgcolor: 'rgba(9, 18, 34, 0.95)' }} />
              <Chip label={`Ten Prob: ${tenProb}%`} sx={{ color: WHITE, bgcolor: 'rgba(9, 18, 34, 0.95)' }} />
              <Chip label={`Suggested Bet: $${suggestedBet}`} sx={{ color: WHITE, bgcolor: 'rgba(9, 18, 34, 0.95)' }} />
            </Stack>
          </Paper>

          <Paper elevation={0} sx={{ p: 1.5, bgcolor: 'rgba(7, 15, 29, 0.5)', border: PANEL_BORDER }}>
            <Typography variant="subtitle2" sx={{ color: WHITE, mb: 1 }}>
              Session Stats
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 1 }}>
              {statTiles.map((tile) => (
                <Paper key={tile.label} elevation={0} sx={{ p: 1, bgcolor: 'rgba(9, 18, 34, 0.75)', border: '1px solid rgba(167, 190, 232, 0.2)' }}>
                  <Typography variant="caption" sx={{ color: '#cfe0ff' }}>
                    {tile.label}
                  </Typography>
                  <Typography variant="body2" sx={{ color: WHITE, fontWeight: 700 }}>
                    {tile.value}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Paper>

          <Paper elevation={0} sx={{ p: 1.5, bgcolor: 'rgba(7, 15, 29, 0.5)', border: PANEL_BORDER }}>
            <Typography variant="subtitle2" sx={{ color: WHITE, mb: 1 }}>
              Bankroll and Bets
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <Button size="small" variant="outlined" onClick={() => adjustBet(-5)} disabled={gameState === 'PLAYING' || currentBet <= 5} sx={{ color: WHITE, borderColor: 'rgba(167, 190, 232, 0.4)' }}>
                -5
              </Button>
              <TextField
                size="small"
                type="number"
                value={currentBet}
                onChange={(e) => setBetQuick(e.target.value)}
                disabled={gameState === 'PLAYING'}
                inputProps={{ min: 5, max: Math.max(5, Math.floor(stats.bankroll)), step: 5 }}
                sx={{
                  width: 120,
                  '& .MuiInputBase-root': { color: WHITE, bgcolor: 'rgba(9, 18, 34, 0.75)' },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(167, 190, 232, 0.35)' },
                }}
              />
              <Button size="small" variant="outlined" onClick={() => adjustBet(5)} disabled={gameState === 'PLAYING'} sx={{ color: WHITE, borderColor: 'rgba(167, 190, 232, 0.4)' }}>
                +5
              </Button>
              {[10, 25, 50, 100].map((b) => (
                <Button key={b} size="small" variant="text" onClick={() => setBetQuick(b)} disabled={gameState === 'PLAYING'} sx={{ color: WHITE, minWidth: 36 }}>
                  {b}
                </Button>
              ))}
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField
                size="small"
                type="number"
                value={addFundsAmount}
                onChange={(e) => setAddFundsAmount(e.target.value)}
                inputProps={{ min: 10, step: 10 }}
                sx={{
                  width: 140,
                  '& .MuiInputBase-root': { color: WHITE, bgcolor: 'rgba(9, 18, 34, 0.75)' },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(167, 190, 232, 0.35)' },
                }}
              />
              <Button variant="contained" onClick={addFundsToKitty}>
                Add Money
              </Button>
            </Stack>
          </Paper>

          <Paper elevation={0} sx={{ p: 1.5, bgcolor: 'rgba(7, 15, 29, 0.5)', border: PANEL_BORDER }}>
            <Typography variant="subtitle2" sx={{ color: WHITE, mb: 1 }}>
              Trainer Options
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'stretch', sm: 'center' }} justifyContent="space-between">
              <FormControlLabel
                control={<Switch checked={coachEnabled} onChange={(e) => setCoachEnabled(e.target.checked)} />}
                label="Freeze Coach"
                sx={{ color: WHITE }}
              />
              <Button variant="outlined" startIcon={<TerminalIcon />} onClick={() => setShowTutorial(true)} sx={{ color: WHITE, borderColor: 'rgba(167, 190, 232, 0.42)' }}>
                Quick Guide
              </Button>
            </Stack>
          </Paper>

          <Button variant="outlined" onClick={() => setControlDrawerOpen(false)} sx={{ color: WHITE, borderColor: 'rgba(167, 190, 232, 0.45)' }}>
            Close Drawer
          </Button>
        </Stack>
      </Drawer>

      {youtubeMusicOn && (
        <Box
          component="iframe"
          title="Background Practice Music"
          src={YOUTUBE_EMBED_URL}
          allow="autoplay; encrypted-media; picture-in-picture"
          sx={{
            position: 'fixed',
            width: 1,
            height: 1,
            border: 0,
            opacity: 0,
            pointerEvents: 'none',
            bottom: 0,
            right: 0,
          }}
        />
      )}

      <Dialog open={Boolean(coachMoment)} onClose={dismissCoachMoment} maxWidth="sm" fullWidth>
        <DialogTitle>{coachMoment?.title}</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 1 }}>{coachMoment?.detail}</Typography>
          <Alert severity="warning" sx={{ mb: 1 }}>
            Recommended move now: <strong>{coachMoment?.action}</strong>
          </Alert>
          <Typography variant="body2" sx={{ color: TEXT_SECONDARY }}>
            Action buttons are paused while this popup is open so you can process the decision.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={dismissCoachMoment} variant="contained">
            Resume Hand
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default App;
