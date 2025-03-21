import { useMemo, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Avatar, AvatarGroup, Typography, Box, Menu, MenuItem,
  Checkbox, Divider, Button, IconButton, TextField, Tooltip,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import {
  useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel,
  getFacetedRowModel, getFacetedUniqueValues, flexRender,
} from '@tanstack/react-table';
import useStore from '../../store/store';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';

const WeekDayCircle = ({ day, isActive }) => (
  <Box
    sx={{
      width: 20, height: 20, borderRadius: '50%', bgcolor: isActive ? '#2196F3' : 'grey.200',
      color: isActive ? 'white' : 'text.secondary', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '10px', fontWeight: 500,
    }}
  >
    {day}
  </Box>
);

const HeaderMenu = ({ column, title }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [filterValues, setFilterValues] = useState(new Set());
  
    const uniqueValues = useMemo(() => {
      const values = new Set();
      column.getFacetedUniqueValues().forEach((count, value) => {
        if (typeof value === 'string') {
          values.add(value);
        } else if (typeof value === 'object' && value !== null && value.initials) {
          values.add(value.initials);
        }
      });
      return Array.from(values);
    }, [column.getFacetedUniqueValues()]);
  
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    const handleSort = (direction) => {
      column.toggleSorting(direction === 'asc');
      handleClose();
    };
  
    const handleFilterChange = (value) => {
        const newFilterValues = new Set(filterValues);
      if (newFilterValues.has(value)) {
        newFilterValues.delete(value);
      } else {
        newFilterValues.add(value);
      }
      setFilterValues(newFilterValues);
      column.setFilterValue(
        newFilterValues.size ? Array.from(newFilterValues) : undefined
      );
    };
  
    const handleClearFilter = () => {
      setFilterValues(new Set());
      column.setFilterValue(undefined);
    };
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography>{title}</Typography>
        <IconButton size="small" onClick={handleClick}>
          <ArrowDropDownIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={() => handleSort('asc')}>
            <ArrowUpwardIcon fontSize="small" sx={{ mr: 1 }} />
            Sort A to Z
          </MenuItem>
          <MenuItem onClick={() => handleSort('desc')}>
            <ArrowDownwardIcon fontSize="small" sx={{ mr: 1 }} />
            Sort Z to A
          </MenuItem>
  
          <Divider />
  
          <Box sx={{ p: 2, maxHeight: 300, overflow: 'auto' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Filter by {title}
            </Typography>
            {uniqueValues.map((value) => (
               <MenuItem
                key={value}
                onClick={() => handleFilterChange(value)}
                dense
              >
                <Checkbox
                  checked={filterValues.has(value)}
                  size="small"
                />
                {value}
              </MenuItem>
            ))}
          </Box>
  
          <Divider />
  
          <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between' }}>
            <Button size="small" onClick={handleClearFilter}>
              Clear Filter
            </Button>
            <Button size="small" onClick={handleClose} variant="contained">
              Apply
            </Button>
          </Box>
        </Menu>
      </Box>
    );
  };

// --- DroppableCell Component ---
const DroppableCell = ({ taskId, children }) => {
  const { setNodeRef } = useSortable({
    id: `${taskId}-dropzone`,
    data: { taskId }
  });

  return (
    <Box 
      ref={setNodeRef}
      sx={{ 
        minHeight: '36px',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        // Add a subtle visual indicator for drop target
        '&:empty': {
          minWidth: '100px',
          border: '1px dashed rgba(0, 0, 0, 0.1)',
          borderRadius: '4px',
        }
      }}
    >
      {children || <Box sx={{ width: '100%', height: '100%' }} />}
    </Box>
  );
};

// --- SortableItem Component (for each Avatar) ---
const SortableItem = ({ resource, taskId }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: `${taskId}-${resource.initials}`,
    data: { resource, taskId },
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    zIndex: transform ? 999 : undefined, // Updated zIndex
    cursor: 'grab',
    display: 'inline-block', // Added to improve dragging behavior
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Tooltip title={resource.name} arrow>
        <Avatar
          sx={{
            width: 28,
            height: 28,
            fontSize: '0.75rem',
            bgcolor: 'grey.700',
            border: 'none',
          }}
        >
          {resource.initials}
        </Avatar>
      </Tooltip>
    </div>
  );
};

const TaskTable = () => {
  const { tasks, sorting, setSorting, columnFilters, setColumnFilters, updateTask } = useStore();
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [activeDragId, setActiveDragId] = useState(null); // Track active dragged item

  const handleEditClick = (task) => {
    setEditingTaskId(task.id);
    setEditedTitle(task.title);
  };

  const handleTitleChange = (event) => {
    setEditedTitle(event.target.value);
  };

  const handleSave = (taskId) => {
    if (editedTitle.trim() !== '') {
      updateTask(taskId, { title: editedTitle });
    }
    setEditingTaskId(null);
    setEditedTitle('');
  };

  const handleCancel = () => {
    setEditingTaskId(null);
    setEditedTitle('');
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require a small movement before dragging starts (optional, but good for UX)
      },
    })
  );

  const handleDragStart = (event) => {
      setActiveDragId(event.active.id);
  };

  // Create a flat list of all draggable items
  const allDraggableItems = useMemo(() => {
    return tasks.flatMap(task =>
      task.resources.map(resource => `${task.id}-${resource.initials}`)
    );
  }, [tasks]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveDragId(null);

    if (!over) return;

    const [activeTaskId, activeInitials] = active.id.split('-');
    let overTaskId = over.id.split('-')[0];

    // If we're dropping on a dropzone, extract the task ID
    if (over.id.endsWith('dropzone')) {
      overTaskId = over.id.split('-dropzone')[0];
    }

    // Don't proceed if dropping in the same spot
    if (activeTaskId === overTaskId && !over.id.endsWith('dropzone')) {
      return;
    }

    const activeTask = tasks.find((t) => t.id.toString() === activeTaskId);
    const overTask = tasks.find((t) => t.id.toString() === overTaskId);

    if (!activeTask || !overTask) return;

    const activeResource = activeTask.resources.find(r => r.initials === activeInitials);
    if (!activeResource) return;

    // Remove from source task
    const newSourceResources = activeTask.resources.filter(r => r.initials !== activeInitials);
    
    // Add to destination task
    const newDestinationResources = [...overTask.resources];
    
    // If dropping on a dropzone or empty row, add to the end
    if (over.id.endsWith('dropzone') || newDestinationResources.length === 0) {
      newDestinationResources.push(activeResource);
    } else {
      // If dropping on a specific resource, insert before it
      const [, overInitials] = over.id.split('-');
      const overIndex = newDestinationResources.findIndex(r => r.initials === overInitials);
      newDestinationResources.splice(overIndex, 0, activeResource);
    }

    // Update both tasks
    updateTask(parseInt(activeTaskId), { resources: newSourceResources });
    updateTask(parseInt(overTaskId), { resources: newDestinationResources });
  };

  const activeItem = useMemo(() => {
    if (!activeDragId) {
        return null;
    }

    const [taskId, resourceInitials] = activeDragId.split('-');
    const task = tasks.find(t => t.id.toString() === taskId);
    const resource = task ? task.resources.find(r => r.initials === resourceInitials) : null;

    return resource ? { resource, taskId } : null;
  }, [activeDragId, tasks]);

  const columns = useMemo(
    () => [
      {
        header: ({ column }) => <HeaderMenu column={column} title="Resources" />,
        accessorKey: 'resources',
        filterFn: 'arrIncludesSome',
        cell: (info) => {
          const taskId = info.row.original.id;
          const resources = info.getValue();
          const [showAll, setShowAll] = useState(false);

          return (
            <DroppableCell taskId={taskId}>
              {resources.length > 0 && (
                <SortableContext
                  id={String(taskId)}
                  items={resources.map((resource) => `${taskId}-${resource.initials}`)}
                  strategy={horizontalListSortingStrategy}
                >
                  <Box 
                    sx={{ 
                      position: 'relative',
                      display: 'flex', 
                      alignItems: 'center' 
                    }}
                  >
                    <Box
                      onMouseEnter={() => setShowAll(true)}
                      onMouseLeave={() => setShowAll(false)}
                    >
                      <AvatarGroup
                        max={3}
                        sx={{
                          '& .MuiAvatar-root': {
                            width: 28,
                            height: 28,
                            fontSize: '0.75rem',
                            bgcolor: 'grey.700',
                            border: 'none',
                          },
                        }}
                      >
                        {resources.map((resource) => (
                          <SortableItem key={resource.initials} resource={resource} taskId={taskId} />
                        ))}
                      </AvatarGroup>
                      {showAll && resources.length > 3 && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            zIndex: 1000,
                            bgcolor: 'background.paper',
                            boxShadow: 3,
                            borderRadius: 1,
                            p: 1,
                            mt: 1,
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 1,
                            maxWidth: '300px',
                          }}
                        >
                          {resources.map((resource) => (
                            <Box
                              key={resource.initials}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                p: 0.5,
                              }}
                            >
                              <Avatar
                                sx={{
                                  width: 28,
                                  height: 28,
                                  fontSize: '0.75rem',
                                  bgcolor: 'grey.700',
                                }}
                              >
                                {resource.initials}
                              </Avatar>
                              <Typography variant="body2">
                                {resource.name}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </Box>
                  </Box>
                </SortableContext>
              )}
            </DroppableCell>
          );
        },
        size: 120,
      },
      {
        header: ({ column }) => <HeaderMenu column={column} title="Task Title" />,
        accessorKey: 'title',
        cell: (info) => {
          const task = info.row.original;
          if (editingTaskId === task.id) {
            return (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField
                  size="small"
                  value={editedTitle}
                  onChange={handleTitleChange}
                  autoFocus
                  onBlur={() => handleSave(task.id)} // Save on blur
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSave(task.id);
                    } else if (e.key === 'Escape') {
                      handleCancel();
                    }
                  }}
                />
                 <Button size="small" onClick={() => handleSave(task.id)}>Save</Button>
                <Button size="small" onClick={handleCancel}>Cancel</Button>
              </Box>
            );
          } else {
            return (
              <Typography variant="body2" onClick={() => handleEditClick(task)} sx={{cursor: 'pointer'}}>
                {info.getValue()}
              </Typography>
            );
          }
        },
        size: 200,
      },
      {
        header: ({ column }) => <HeaderMenu column={column} title="Due Date" />,
        accessorKey: 'dueDate',
        cell: (info) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar 
              sx={{ 
                width: 24, 
                height: 24, 
                fontSize: '0.75rem',
                bgcolor: 'grey.700' 
              }}
            >
              CR
            </Avatar>
            <Typography variant="body2">{info.getValue()}</Typography>
          </Box>
        ),
        size: 150,
      },
      {
        header: ({ column }) => <HeaderMenu column={column} title="Description" />,
        accessorKey: 'description',
        cell: (info) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '400px'
              }}
            >
              {info.getValue()}
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              gap: 0.5, 
              ml: 'auto', 
              mr: 2,
              alignItems: 'center' 
            }}>
              <WeekDayCircle day="Mon" isActive={info.row.original.workDays.includes('Mon')} />
              <WeekDayCircle day="Tue" isActive={info.row.original.workDays.includes('Tue')} />
              <WeekDayCircle day="Wed" isActive={info.row.original.workDays.includes('Wed')} />
              <WeekDayCircle day="Thu" isActive={info.row.original.workDays.includes('Thu')} />
              <WeekDayCircle day="Fri" isActive={info.row.original.workDays.includes('Fri')} />
              <Typography sx={{ ml: 1 }}>+10</Typography>
            </Box>
            <KeyboardArrowDownIcon sx={{ color: 'text.secondary' }} />
          </Box>
        ),
        size: 'auto',
      },
    ],
    [editingTaskId, editedTitle, tasks, activeDragId]
  );

  const arrIncludesSome = (rows, id, filterValue) => {
    return rows.filter((row) => {
      const rowValue = row.values[id];
      return filterValue.some((val) =>
        rowValue.some((resource) => resource.initials === val || resource.name === val)
      );
    });
  };

  const table = useReactTable({
    data: tasks,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    filterFns: {
      arrIncludesSome: arrIncludesSome,
    },
  });

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={allDraggableItems}
        strategy={horizontalListSortingStrategy}
      >
        <TableContainer component={Paper} sx={{ height: '100%', boxShadow: 'none', '& .MuiTableCell-root': { borderBottom: '1px solid rgba(224, 224, 224, 0.4)', py: 1, px: 2 }, '& .MuiTableCell-head': { fontWeight: 500, bgcolor: 'grey.100', borderBottom: '1px solid rgba(224, 224, 224, 1)' } }}>
          <Table stickyHeader size="small">
            <TableHead>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <TableCell key={header.id} sx={{ width: header.column.columnDef.size }}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {table.getRowModel().rows.map(row => (
                <TableRow key={row.id} sx={{ '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }, ...(editingTaskId === row.original.id && { bgcolor: 'rgba(0, 123, 255, 0.1)' }) }}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <DragOverlay>
            {activeItem && (
              <Avatar
                sx={{
                  width: 28,
                  height: 28,
                  fontSize: '0.75rem',
                  bgcolor: 'grey.700',
                }}
              >
                {activeItem.resource.initials}
              </Avatar>
            )}
          </DragOverlay>
        </TableContainer>
      </SortableContext>
    </DndContext>
  );
};

export default TaskTable;