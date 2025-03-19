import { Box } from '@mui/material';
import ProjectCard from './ProjectCard';
import useStore from '../../store/store';

const ProjectList = () => {
  const { projects, selectedProject, setSelectedProject } = useStore();

  return (
    <Box>
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          selected={selectedProject?.id === project.id}
          onClick={setSelectedProject}
        />
      ))}
    </Box>
  );
};

export default ProjectList;