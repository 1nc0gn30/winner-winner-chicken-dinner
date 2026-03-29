
import React, { useState } from 'react';
import { Box, Typography, Paper, IconButton, Button, Stack, Divider } from '@mui/material';
import { Terminal, Close, ChevronRight, Psychology } from '@mui/icons-material';

const steps = [
  {
    title: 'Module 1: Card Values',
    content: "Forget the faces. Every card is just data. We assign values to simplify the stream.",
    math: [
      { cards: "2, 3, 4, 5, 6", val: "+1", desc: "Low cards (The 'Trash'). When these leave, the deck gets hotter." },
      { cards: "7, 8, 9", val: "0", desc: "Neutral cards. Noise in the system. Ignore them." },
      { cards: "10, J, Q, K, A", val: "-1", desc: "High cards (The 'Killers'). When these leave, your edge drops." }
    ]
  },
  {
    title: 'Module 2: Running Count',
    content: "Keep a mental 'Running Count'. Start at 0. As cards hit the felt, update your variable in real-time.",
    tip: "Pro Tip: Cancel out pairs. If you see a 5 (+1) and a King (-1) dealt together, the net change is 0. Don't count them individually."
  },
  {
    title: 'Module 3: True Count Conversion',
    content: "The casino uses a 6-deck shoe to dilute your edge. A +6 count in a full shoe is weak. A +6 count with 1 deck left is a goldmine.",
    formula: "True Count = Running Count / Decks Remaining",
    tip: "This is where 90% of 'counters' fail. You must estimate the deck thickness in the discard tray."
  },
  {
    title: 'Module 4: Execution and Betting',
    content: "The math is done. Now you act. The 'Pivot' is usually a True Count of +2.",
    actions: [
      { count: "TC < 2", act: "PATROL MODE", desc: "Bet minimum. Blend in. Wait for the cards to rid the low-value trash." },
      { count: "TC >= 2", act: "STRIKE MODE", desc: "This is your edge. Increase bets exponentially. The dealer is statistically primed to bust." }
    ]
  }
];

const HackerTutorial = ({ onClose }) => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <Box sx={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      bgcolor: 'rgba(10, 17, 30, 0.84)', zIndex: 9999, display: 'flex',
      alignItems: 'center', justifyContent: 'center', p: 2, backdropFilter: 'blur(8px)'
    }}>
      <Paper sx={{
        maxWidth: 700, width: '100%', bgcolor: '#1a2943', color: '#f3f6ff',
        border: '1px solid rgba(167, 190, 232, 0.45)', p: 4, position: 'relative',
        fontFamily: "'Segoe UI', 'IBM Plex Sans', sans-serif", boxShadow: '0 20px 60px rgba(5, 10, 18, 0.5)'
      }}>
        <IconButton onClick={onClose} sx={{ position: 'absolute', top: 10, right: 10, color: '#d7e4ff' }}>
          <Close />
        </IconButton>

        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
          <Terminal fontSize="small" />
          <Typography variant="h6" sx={{ fontWeight: 'bold', letterSpacing: 2 }}>
            Quick Strategy Guide
          </Typography>
        </Stack>

        <Divider sx={{ bgcolor: 'rgba(167, 190, 232, 0.22)', mb: 3 }} />

        <Box sx={{ minHeight: 300 }}>
          <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold' }}>
            {steps[activeStep].title}
          </Typography>
          <Typography sx={{ color: '#d7e4ff', mb: 3 }}>
            {steps[activeStep].content}
          </Typography>

          {steps[activeStep].math && (
            <Stack spacing={1}>
              {steps[activeStep].math.map((m, i) => (
                <Box key={i} sx={{ display: 'flex', gap: 2, bgcolor: 'rgba(7, 15, 29, 0.48)', p: 1.5, borderRadius: 1 }}>
                  <Typography sx={{ fontWeight: 'bold', minWidth: 80 }}>{m.cards}</Typography>
                  <Typography sx={{ color: '#f3f6ff', fontWeight: 'bold' }}>{m.val}</Typography>
                  <Typography variant="body2" sx={{ color: '#d7e4ff' }}>{m.desc}</Typography>
                </Box>
              ))}
            </Stack>
          )}

          {steps[activeStep].formula && (
            <Box sx={{ textAlign: 'center', p: 3, my: 2, border: '1px dashed rgba(167, 190, 232, 0.5)', bgcolor: 'rgba(7, 15, 29, 0.48)' }}>
              <Typography variant="h5" sx={{ color: '#f3f6ff' }}>{steps[activeStep].formula}</Typography>
            </Box>
          )}

          {steps[activeStep].actions && (
            <Stack spacing={2}>
              {steps[activeStep].actions.map((a, i) => (
                <Box key={i} sx={{ borderLeft: '4px solid #8fc3ff', pl: 2 }}>
                  <Typography sx={{ fontWeight: 'bold' }}>{a.count} → {a.act}</Typography>
                  <Typography variant="body2" sx={{ color: '#d7e4ff' }}>{a.desc}</Typography>
                </Box>
              ))}
            </Stack>
          )}

          {steps[activeStep].tip && (
            <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(143, 195, 255, 0.14)', color: '#d7e4ff', borderRadius: 1, display: 'flex', gap: 2 }}>
              <Psychology />
              <Typography variant="body2">{steps[activeStep].tip}</Typography>
            </Box>
          )}
        </Box>

        <Stack direction="row" justifyContent="space-between" sx={{ mt: 4 }}>
          <Button 
            disabled={activeStep === 0} 
            onClick={() => setActiveStep(prev => prev - 1)}
            sx={{ color: '#d7e4ff' }}
          >
            Previous
          </Button>
          <Typography sx={{ alignSelf: 'center', fontSize: '0.8rem' }}>
            {activeStep + 1} / {steps.length}
          </Typography>
          {activeStep < steps.length - 1 ? (
            <Button 
              variant="outlined" 
              endIcon={<ChevronRight />} 
              onClick={() => setActiveStep(prev => prev + 1)}
              sx={{ borderColor: 'rgba(167, 190, 232, 0.65)', color: '#d7e4ff', '&:hover': { bgcolor: 'rgba(143, 195, 255, 0.12)' } }}
            >
              Next Module
            </Button>
          ) : (
            <Button 
              variant="contained" 
              onClick={onClose}
              sx={{ bgcolor: '#4f8fe7', color: '#f8fbff', '&:hover': { bgcolor: '#3b79cb' } }}
            >
              Close Guide
            </Button>
          )}
        </Stack>
      </Paper>
    </Box>
  );
};

export default HackerTutorial;
