import { create } from 'zustand';

const useStore = create((set) => ({
  // Sorting and filtering state
  sorting: [],
  setSorting: (sorting) => set({ sorting }),
  columnFilters: [],
  setColumnFilters: (columnFilters) => set({ columnFilters }),

  // Projects data
  projects: [
    {
      id: '2204',
      name: 'Spencer',
      status: {
        green: { value: 5, date: '05/25' },
        yellow: { value: 5, date: '12/31' },
        red: { value: 10, date: '12/31' },
      },
      endDate: '11/25'
    },
    {
      id: '2205',
      name: 'Thompson Building',
      status: {
        green: { value: 3, date: '06/15' },
        yellow: { value: 7, date: '11/30' },
        red: { value: 8, date: '12/15' },
      },
      endDate: '12/20'
    },
    {
      id: '2206',
      name: 'Madison Square',
      status: {
        green: { value: 6, date: '07/10' },
        yellow: { value: 4, date: '10/31' },
        red: { value: 12, date: '11/30' },
      },
      endDate: '01/15'
    }
  ],
  selectedProject: null,
  setSelectedProject: (project) => set({ selectedProject: project }),

  // Tasks data (Modified to include resource objects)
  tasks: [
    {
      id: 1,
      resources: [
        { initials: 'CR', name: 'Carlos Rodriguez' },
        { initials: 'IN', name: 'Isabel Newton' },
        { initials: 'JN', name: 'John Newman' },
      ],
      title: 'Electrical Crew #1',
      dueDate: '04/11/2025',
      description: 'Lorem ipsum is simply dummy text of the printing and typeset...',
      workDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    },
    {
      id: 2,
      resources: [
        { initials: 'JD', name: 'James Dean' },
        { initials: 'JS', name: 'Jane Smith' },
      ],
      title: 'Plumbing Team Alpha',
      dueDate: '03/15/2025',
      description: 'Installation of main water supply lines and fixtures...',
      workDays: ['Mon', 'Wed', 'Fri'],
    },
    {
      id: 3,
      resources: [
        { initials: 'TR', name: 'Tom Richards' },
        { initials: 'KL', name: 'Karen Lewis' },
        { initials: 'BM', name: 'Bob Miller' }
      ],
      title: 'HVAC Installation',
      dueDate: '05/20/2025',
      description: 'Central air conditioning system setup and testing...',
      workDays: ['Tue', 'Thu'],
    },
    {
      id: 4,
      resources: [
        { initials: 'PQ', name: 'Peter Quinn' },
        { initials: 'RS', name: 'Ronda Styles' },
      ],
      title: 'Foundation Work',
      dueDate: '02/28/2025',
      description: 'Concrete pouring and foundation reinforcement...',
      workDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    },
    {
      id: 5,
      resources: [
        { initials: 'AX', name: 'Alex Xavier' },
        { initials: 'BY', name: 'Bob Young' },
        { initials: 'CZ', name: 'Carlos Zapata' },
      ],
      title: 'Roofing Team #2',
      dueDate: '06/05/2025',
      description: 'Shingle installation and waterproofing...',
      workDays: ['Wed', 'Thu', 'Fri'],
    },
    {
      id: 6,
      resources: [
        { initials: 'DW', name: 'David Wilson' },
        { initials: 'EV', name: 'Emily Vance' },
      ],
      title: 'Interior Finishing',
      dueDate: '07/15/2025',
      description: 'Wall painting and trim installation...',
      workDays: ['Mon', 'Tue', 'Fri'],
    },
    {
      id: 7,
      resources: [
        { initials: 'FU', name: 'Frank Underwood' },
        { initials: 'BT', name: 'Bob Taylor' },
        { initials: 'HS', name: 'Helen Smith' },
      ],
      title: 'Landscaping Crew',
      dueDate: '08/01/2025',
      description: 'Garden design and plant installation...',
      workDays: ['Tue', 'Wed', 'Thu'],
    },
  ],

  // Resources data (Keep this for the ResourcePool)
  resources: [
    {
      id: 'CR',
      name: 'Carlos Rodriguez',
      role: 'Electrician',
      availability: 'Full-Time',
      skills: ['Electrical', 'Wiring', 'Safety'],
      currentProject: '2204',
    },
    {
      id: 'JN',
      name: 'John Newman',
      role: 'Electrician',
      availability: 'Full-Time',
      skills: ['Electrical', 'Installation'],
      currentProject: '2204',
    },
    {
      id: 'IN',
      name: 'Isabel Newton',
      role: 'Supervisor',
      availability: 'Part-Time',
      skills: ['Management', 'Electrical'],
      currentProject: '2204',
    },
    {
      id: 'JD',
      name: 'James Dean',
      role: 'Plumber',
      availability: 'Full-Time',
      skills: ['Plumbing', 'Installation'],
      currentProject: '2205',
    },
    {
      id: 'JS',
      name: 'Jane Smith',
      role: 'Plumber',
      availability: 'Part-Time',
      skills: ['Plumbing', 'Maintenance'],
      currentProject: '2205',
    },
    {
      id: 'TR',
      name: 'Tom Richards',
      role: 'HVAC Technician',
      availability: 'Full-Time',
      skills: ['HVAC', 'Installation'],
      currentProject: '2206',
    },
    {
      id: 'KL',
      name: 'Karen Lewis',
      role: 'HVAC Technician',
      availability: 'Full-Time',
      skills: ['HVAC', 'Maintenance'],
      currentProject: '2206',
    },
    {
      id: 'BM',
      name: 'Bob Miller',
      role: 'Supervisor',
      availability: 'Full-Time',
      skills: ['Management', 'HVAC'],
      currentProject: '2206',
    }
  ],
    updateTask: (taskId, updatedFields) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, ...updatedFields } : task
      ),
    })),

  // Resource Pool functions (These are fine as they are)
  getAvailableResources: () => {
    const state = useStore.getState();
    return state.resources.filter(resource =>
      !resource.currentProject || resource.currentProject === state.selectedProject?.id
    );
  },

  getAssignedResources: () => {
    const state = useStore.getState();
    return state.resources.filter(resource =>
      resource.currentProject === state.selectedProject?.id
    );
  },

  assignResource: (resourceId, projectId) =>
    set(state => ({
      resources: state.resources.map(resource =>
        resource.id === resourceId
          ? { ...resource, currentProject: projectId }
          : resource
      )
    })),

  unassignResource: (resourceId) =>
    set(state => ({
      resources: state.resources.map(resource =>
        resource.id === resourceId
          ? { ...resource, currentProject: null }
          : resource
      )
    })),
}));

export default useStore;