import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";

export default function OptimizePrompt() {
  const [userPrompt, setUserPrompt] = useState("");
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleOptimize = async () => {
    setLoading(true);
    setVariants([]);

    const payload = { user_prompt: userPrompt, num_variants: 3 };

    try {
      const res = await fetch("http://127.0.0.1:8000/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      const optimizedPrompts = data.optimized_prompts || [];
      setVariants(optimizedPrompts);

      // Save each optimized prompt to localStorage history
      const history = JSON.parse(localStorage.getItem("prompt_history") || "[]");
      optimizedPrompts.forEach((v) => history.unshift(v.prompt));
      localStorage.setItem("prompt_history", JSON.stringify(history));
    } catch (err) {
      console.error("Error:", err);
    }

    setLoading(false);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        bgcolor: "background.default",
        color: "text.primary",
        p: 4,
        borderRadius: 3,
        boxShadow: 3,
        maxWidth: 800,
        mx: "auto",
      }}
    >
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Optimize Prompt
      </Typography>

      <TextField
        label="Enter your prompt"
        placeholder="Type your raw prompt..."
        value={userPrompt}
        onChange={(e) => setUserPrompt(e.target.value)}
        fullWidth
        multiline
        rows={4}
        variant="outlined"
      />

      <Button
        variant="contained"
        color="success"
        onClick={handleOptimize}
        disabled={loading}
        sx={{
          py: 1.5,
          fontWeight: "bold",
          borderRadius: 2,
          display: "flex",
          gap: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {loading ? (
          <>
            <CircularProgress size={20} color="inherit" />
            Optimizing...
          </>
        ) : (
          "Optimize Prompt"
        )}
      </Button>

      {variants.length > 0 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {variants.map((v, idx) => (
            <Card key={idx} sx={{ borderRadius: 2, boxShadow: 2 }}>
              <CardContent>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {v.prompt}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Score: {v.score}
                </Typography>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleCopy(v.prompt)}
                  sx={{ mt: 1, borderRadius: 2 }}
                >
                  Copy
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}
