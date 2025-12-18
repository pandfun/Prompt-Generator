import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
} from "@mui/material";

export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("prompt_history") || "[]");
    setHistory(saved);
  }, []);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleClear = () => {
    localStorage.removeItem("prompt_history");
    setHistory([]);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: 4,
        borderRadius: 3,
        boxShadow: 3,
        bgcolor: "background.default",
        color: "text.primary",
        maxWidth: 800,
        mx: "auto",
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant="h5" fontWeight="bold">
          Prompt History
        </Typography>
        {history.length > 0 && (
          <Button
            variant="contained"
            color="error"
            onClick={handleClear}
            sx={{ borderRadius: 2 }}
          >
            Clear All
          </Button>
        )}
      </Stack>

      {history.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No history found.
        </Typography>
      ) : (
        history.map((h, idx) => (
          <Card key={idx} sx={{ borderRadius: 2, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {h}
              </Typography>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => handleCopy(h)}
                sx={{ mt: 1, borderRadius: 2 }}
              >
                Copy
              </Button>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
}
