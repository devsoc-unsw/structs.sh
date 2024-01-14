import { ThemeProvider, Box } from "@mui/material";
import { AnimatePresence } from "framer-motion";
import { Route, Routes } from "react-router-dom";
import "./App.scss";
import DevelopmentMode from "./DevelopmentMode";

const App = () => (
  <Box color={structsTheme.palette.text.primary}>
    <AnimatePresence>
      <Routes>
        {/* Homepage */}
        <Route path="/" element={<DevelopmentMode />} />

        {/* 404 page */}
        <Route path="*" element={<Page404 />} />
      </Routes>
    </AnimatePresence>
  </Box>
);

export default App;
