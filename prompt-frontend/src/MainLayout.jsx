import React from "react";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import GeneratePrompt from "./components/GeneratePrompt";
import OptimizePrompt from "./components/OptimizePrompt";
import History from "./components/History";

export default function MainLayout() {
  return (
    <BrowserRouter>
      <AppBar position="static">
        <Toolbar>
          <img 
        src="../logo.svg" 
        alt="PromptGen Logo" 
        style={{ height: 35, marginRight: 12 }} 
      />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>PromptGen</Typography>
          <Button color="inherit" component={Link} to="/">Generate</Button>
          <Button color="inherit" component={Link} to="/optimize">Optimize</Button>
          <Button color="inherit" component={Link} to="/history"><img width="24" height="24" src="https://img.icons8.com/material-outlined/24/FFFFFF/time-machine.png" alt="time-machine"/></Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 2 }}>
        <Routes>
          <Route path="/" element={<GeneratePrompt />} />
          <Route path="/optimize" element={<OptimizePrompt />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </Box>

      {/* Footer */}
      <Box sx={{ textAlign: "center", py: 2, bgcolor: "background.paper" }}>
        <Typography variant="body2">
          EL 7th Sem Project - Prompt Engineering
        </Typography>
      </Box>
    </BrowserRouter>
  );
}
