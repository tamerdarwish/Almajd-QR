import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrReader } from 'react-qr-reader';import { Box, Typography, Button, Alert } from '@mui/material';

const Home = ({ events }) => {
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const handleScan = (data) => {
    if (data) {
      const event = events.find((e) => e.barcode === data);
      if (event) {
        setResult(data);
        navigate(`/upload/${event.id}`);
      } else {
        alert('باركود غير صالح!');
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  return (
    <Box textAlign="center" mt={5}>
      <Typography variant="h1" gutterBottom>
        مرحبًا بك في حفل الزفاف!
      </Typography>
      <Typography variant="body1" gutterBottom>
        يرجى مسح الباركود الخاص بالحفل
      </Typography>
      <QrReader
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: '50%', margin: '0 auto' }}
      />
      {result && (
        <Alert severity="success" sx={{ mt: 3 }}>
          تم مسح الباركود بنجاح! الباركود: {result}
        </Alert>
      )}
    </Box>
  );
};

export default Home;