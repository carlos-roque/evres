import { Box, Typography, Paper } from '@mui/material';

const ProjectCard = ({ project, selected, onClick }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        mb: 1,
        cursor: 'pointer',
        bgcolor: 'background.paper',
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'rgba(0, 0, 0, 0.12)',
        '&:hover': {
          bgcolor: 'grey.50',
        },
        width: '100%',
      }}
      onClick={() => onClick(project)}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        height: '28px',
        width: '100%',
      }}>
        {/* Project Title */}
        <Box
          sx={{
            width: '160px',
            borderRight: '1px solid rgba(0, 0, 0, 0.12)',
            px: 1.5,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Typography 
            sx={{ 
              fontSize: '12px',
              fontWeight: 400,
              color: 'text.primary',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {project.id} - {project.name}
          </Typography>
        </Box>

        {/* Status Boxes Container */}
        <Box sx={{ 
          display: 'flex', 
          height: '100%',
          flex: 1,
          justifyContent: 'flex-end',
        }}>
          {/* Minus Sign */}
          <Box sx={{
            width: '28px',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRight: '1px solid rgba(0, 0, 0, 0.12)',
            color: 'text.secondary',
            fontSize: '11px'
          }}>
            -
          </Box>
          
          {/* Green Box */}
          <Box sx={{
            width: '28px',
            height: '100%',
            bgcolor: '#4CAF50',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Typography sx={{ color: 'white', fontSize: '11px', lineHeight: 1 }}>5</Typography>
            <Typography sx={{ color: 'white', fontSize: '8px', lineHeight: 1 }}>05/25</Typography>
          </Box>

          {/* Yellow Box */}
          <Box sx={{
            width: '28px',
            height: '100%',
            bgcolor: '#FFC107',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Typography sx={{ color: 'white', fontSize: '11px', lineHeight: 1 }}>5</Typography>
            <Typography sx={{ color: 'white', fontSize: '8px', lineHeight: 1 }}>12/31</Typography>
          </Box>

          {/* Red Box */}
          <Box sx={{
            width: '28px',
            height: '100%',
            bgcolor: '#F44336',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Typography sx={{ color: 'white', fontSize: '11px', lineHeight: 1 }}>10</Typography>
            <Typography sx={{ color: 'white', fontSize: '8px', lineHeight: 1 }}>12/31</Typography>
          </Box>

          {/* Grey Box - Last box */}
          <Box sx={{
            width: '28px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
            color: 'text.secondary',
          }}>
            <Typography sx={{ fontSize: '11px', lineHeight: 1 }}>-</Typography>
            <Typography sx={{ fontSize: '8px', lineHeight: 1 }}>11/25</Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default ProjectCard;