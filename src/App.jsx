import { ThemeProvider, CssBaseline, Box, Typography } from '@mui/material';
import theme from './styles/theme'; // Updated import path
import ProjectList from './components/project/ProjectList';
import TaskTable from './components/task/TaskTable';
import ResourcePool from './components/resource/ResourcePool';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default' }}>
        {/* Project Selection Pane */}
        <Box 
          sx={{ 
            width: 350,
            borderRight: 1,
            borderColor: 'divider',
            overflow: 'auto',
            bgcolor: 'background.paper',
            p: 2,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
            Projects
          </Typography>
          <ProjectList />
        </Box>

        {/* Main Content Area */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Task Table */}
          <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
            <TaskTable />
          </Box>

          {/* Resource Pool */}
          <Box 
            sx={{ 
              height: 200,
              borderTop: 1,
              borderColor: 'divider',
              overflow: 'auto',
              bgcolor: 'background.paper',
            }}
          >
            <ResourcePool />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;