import { useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  AvatarGroup,
  Typography,
  Box,
  Menu,
  MenuItem,
  Checkbox,
  Divider,
  Button,
  IconButton,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  flexRender,
} from '@tanstack/react-table';
import useStore from '../../store/store';

const WeekDayCircle = ({ day, isActive }) => (
  <Box
    sx={{
      width: 20,
      height: 20,
      borderRadius: '50%',
      bgcolor: isActive ? '#2196F3' : 'grey.200',
      color: isActive ? 'white' : 'text.secondary',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '10px',
      fontWeight: 500,
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
      values.add(value);
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

const TaskTable = () => {
  const { tasks, sorting, setSorting, columnFilters, setColumnFilters } = useStore();

  const columns = useMemo(
    () => [
      {
        header: ({ column }) => <HeaderMenu column={column} title="Resources" />,
        accessorKey: 'resources',
        filterFn: 'arrIncludesSome',
        cell: (info) => (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AvatarGroup 
              max={3} 
              sx={{ 
                '& .MuiAvatar-root': { 
                  width: 28,
                  height: 28,
                  fontSize: '0.75rem',
                  bgcolor: 'grey.700',
                  border: 'none',
                } 
              }}
            >
              {info.getValue().map((resource) => (
                <Avatar key={resource}>{resource}</Avatar>
              ))}
            </AvatarGroup>
          </Box>
        ),
        size: 120,
      },
      {
        header: ({ column }) => <HeaderMenu column={column} title="Task Title" />,
        accessorKey: 'title',
        cell: (info) => (
          <Typography variant="body2">
            {info.getValue()}
          </Typography>
        ),
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
    []
  );

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
  });

  return (
    <TableContainer 
      component={Paper} 
      sx={{ 
        height: '100%',
        boxShadow: 'none',
        '& .MuiTableCell-root': {
          borderBottom: '1px solid rgba(224, 224, 224, 0.4)',
          py: 1,
          px: 2,
        },
        '& .MuiTableCell-head': {
          fontWeight: 500,
          bgcolor: 'grey.100',
          borderBottom: '1px solid rgba(224, 224, 224, 1)',
        }
      }}
    >
      <Table stickyHeader size="small">
        <TableHead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableCell 
                  key={header.id}
                  sx={{
                    width: header.column.columnDef.size,
                  }}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow 
              key={row.id}
              sx={{
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TaskTable;