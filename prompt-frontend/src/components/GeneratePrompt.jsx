import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  CircularProgress,
} from "@mui/material";

export default function GeneratePrompt() {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("Normal");
  const [useFor, setUseFor] = useState("Normal");
  const [platform, setPlatform] = useState("ChatGPT");
  const [length, setLength] = useState("Medium");
  const [format, setFormat] = useState("Plain Text");
  const [strictness, setStrictness] = useState("Strict");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setResult("");

    const payload = {
      topic,
      mode: "text",
      tone,
      use_for: useFor,
      platform,
      length,
      format,
      strictness,
    };

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setResult(`❌ Backend error: ${data.detail || data.error || "Unknown error"}`);
        return;
      }

setResult(data.generated_prompt);

      // Save to history
      const history = JSON.parse(localStorage.getItem("prompt_history") || "[]");
      history.unshift(data.generated_prompt);
      localStorage.setItem("prompt_history", JSON.stringify(history));
    } catch (err) {
      setResult("⚠️ Error: Unable to generate prompt");
    }

    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
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
        Generate AI Prompt
      </Typography>

      <TextField
        label="Topic"
        placeholder="Enter your topic..."
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        fullWidth
        variant="outlined"
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
          gap: 2,
        }}
      >
        <FormControl fullWidth>
          <InputLabel>Use For</InputLabel>
          <Select value={useFor} onChange={(e) => setUseFor(e.target.value)}>
            <MenuItem value="Normal">Normal</MenuItem>
            <MenuItem value="Blog/Article">Blog/Article</MenuItem>
            <MenuItem value="Social Media Post">Social Media Post</MenuItem>
            <MenuItem value="Code">Code</MenuItem>
            <MenuItem value="Marketing">Marketing</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Tone</InputLabel>
          <Select value={tone} onChange={(e) => setTone(e.target.value)}>
            <MenuItem value="Normal">Normal</MenuItem>
            <MenuItem value="Professional">Professional</MenuItem>
            <MenuItem value="Casual">Casual</MenuItem>
            <MenuItem value="Funny">Funny</MenuItem>
            <MenuItem value="Inspirational">Inspirational</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Platform</InputLabel>
          <Select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
          >
            <MenuItem value="ChatGPT">ChatGPT</MenuItem>
            <MenuItem value="Gemini">Gemini</MenuItem>
            <MenuItem value="Claude">Claude</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Length</InputLabel>
          <Select value={length} onChange={(e) => setLength(e.target.value)}>
            <MenuItem value="Short">Short</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Long">Long</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Format</InputLabel>
          <Select value={format} onChange={(e) => setFormat(e.target.value)}>
            <MenuItem value="Plain Text">Plain Text</MenuItem>
            <MenuItem value="JSON" disabled>JSON (Coming Soon)</MenuItem>
            <MenuItem value="Markdown" disabled>Markdown (Coming Soon)</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel >Strictness</InputLabel>
          <Select
            value={strictness}
            onChange={(e) => setStrictness(e.target.value)}
          >
            <MenuItem value="Loose">Loose</MenuItem>
            <MenuItem value="Normal">Normal</MenuItem>
            <MenuItem value="Strict">Strict</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Button
        variant="contained"
        onClick={handleGenerate}
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
            Generating...
          </>
        ) : (
          "Generate Prompt"
        )}
      </Button>

      {result && (
        <Box sx={{ mt: 2 }}>
          <TextField
            value={result}
            multiline
            rows={5}
            fullWidth
            variant="outlined"
            InputProps={{ readOnly: true }}
          />
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleCopy}
            sx={{ mt: 2, borderRadius: 2 }}
          >
            Copy Prompt
          </Button>
        </Box>
      )}
    </Box>
  );
}
