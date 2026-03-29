import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

const Card = ({ value, suit, hidden = false }) => {
  const isRed = suit === '♥' || suit === '♦';
  const color = isRed ? '#b91c1c' : '#0f172a';

  if (hidden) {
    return (
      <Paper
        elevation={8}
        className="card-animation"
        sx={{
          width: { xs: 74, sm: 94 },
          height: { xs: 108, sm: 136 },
          borderRadius: 2,
          border: '1px solid rgba(167, 190, 232, 0.55)',
          background: 'linear-gradient(160deg, #20324f 8%, #2b3f62 52%, #1c2b44 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 8,
            border: '1px solid rgba(191, 210, 243, 0.55)',
            borderRadius: 1.5,
            backgroundImage:
              'repeating-linear-gradient(45deg, rgba(191,210,243,0.15), rgba(191,210,243,0.15) 6px, transparent 6px, transparent 12px)',
          }}
        />
      </Paper>
    );
  }

  return (
    <Paper
      elevation={8}
      className="card-animation"
      sx={{
        width: { xs: 74, sm: 94 },
        height: { xs: 108, sm: 136 },
        backgroundColor: '#fcfcfc',
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        p: 1,
        color,
        border: '1px solid #e2e8f0',
      }}
    >
      <Typography variant="body1" sx={{ fontWeight: 800, lineHeight: 1 }}>
        {value}
        <br />
        {suit}
      </Typography>
      <Typography variant="h4" sx={{ textAlign: 'center', lineHeight: 1 }}>
        {suit}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontWeight: 800,
          lineHeight: 1,
          textAlign: 'right',
          transform: 'rotate(180deg)',
        }}
      >
        {value}
        <br />
        {suit}
      </Typography>
    </Paper>
  );
};

export default Card;
