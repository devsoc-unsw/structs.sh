import { ThemeProvider, Box } from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import { Route, Routes } from 'react-router-dom';
import Feedback from 'pages/Feedback';
import HomePage from 'pages/HomePage';
import Page404 from 'pages/Page404';
import VisualiserPage from 'pages/VisualiserPage';
import { structsTheme } from 'structsThemes';
import './App.scss';
import DevelopmentMode from 'pages/DevelopmentMode';
import LearningMode from 'pages/LearningMode';
import { customizedParagraph, customizedListing, customizedCode, customizedH1, customizedH2 } from 'utils/customized-mdx';
import EduMaterialPage from 'pages/EduMaterialPage';
import Sidebar from 'components/EduSidebar/Sidebar';

const eduPages = import.meta.glob('./edu-pages/*.mdx');

const generateRoutes = async (pages: any) => {
  const routes = [];

  const components = {
    p: customizedParagraph,
    li: customizedListing,
    code: customizedCode,
    h1: customizedH1,
    h2: customizedH2,
  }

  for (const path in pages) {
    const module = await pages[path]();
    const PageComponent = module.default;
    const routePath = '/learning/' + path.slice(12, -4); // remove './edu_pages/' and '.mdx'
    routes.push(
      <Route 
        key={routePath} 
        path={routePath} 
        element={
          <EduMaterialPage 
            sidebar={<Sidebar />} 
            mdxContent={<PageComponent components={components} />} 
          />
        }
      />
    );
  }

  return routes;
}

const eduRoutes = await generateRoutes(eduPages);

const App = () => (
  <Box color={structsTheme.palette.text.primary}>
    <AnimatePresence>
      <ThemeProvider theme={structsTheme}>
        <Routes>
          {/* Homepage */}
          <Route path="/" element={<HomePage />} />

          {/* Visualiser routes */}
          <Route path="/visualiser/:topic" element={<VisualiserPage />} />

          {/* Feedback and feature request page */}
          <Route path="/feedback" element={<Feedback />} />

          {/* Development mode */}
          <Route path="/dev" element={<DevelopmentMode />} />

          {/* Learning mode */}
          <Route path="/learning" element={<LearningMode />} />

          {/* Education MDX pages */}
          {eduRoutes}

          {/* 404 page */}
          <Route path="*" element={<Page404 />} />
        </Routes>
      </ThemeProvider>
    </AnimatePresence>
  </Box>
);

export default App;
