import { Box, Typography, Chip } from '@mui/material';
import useStore from '../../store/store';

const ResourcePool = () => {
  const { resources } = useStore();

  return (
    <Box sx={{ p: 3 }}>
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 2,
          fontWeight: 400,
          color: 'text.primary',
        }}
      >
        Resource Pool
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {resources.map((resource) => (
          <Chip
            key={resource.id}
            label={`${resource.name} (${resource.type})`}
            variant="outlined"
            sx={{ 
              borderRadius: '16px',
              height: '32px',
              borderColor: 'rgba(0, 0, 0, 0.12)',
              '& .MuiChip-label': {
                px: 2,
                color: 'text.secondary',
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default ResourcePool;