import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  type ColumnDef,
  type ColumnFiltersState,
  type FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable
} from '@tanstack/react-table';
import { Link, useNavigate } from 'react-router-dom';
import type { PrototypeRo } from '../../../shared/prototype';

export type RepairOrderRow = PrototypeRo & {
  departmentSummary: string;
  createdAtLabel: string;
};

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric'
});

const roQuickSearch: FilterFn<RepairOrderRow> = (row, _columnId, filterValue) => {
  const query = String(filterValue ?? '').trim().toLowerCase();
  if (!query) return true;
  return [row.original.roNumber, row.original.customerName].join(' ').toLowerCase().includes(query);
};

function money(amount: number) {
  return `$${amount.toFixed(2)}`;
}

function buildDepartmentSummary(ro: PrototypeRo) {
  const departments = Array.from(new Set(ro.lineItems.map((item) => item.departmentName)));
  return departments.length ? departments.join(' / ') : 'Unassigned';
}

function buildPaymentPath(roNumber: string) {
  return `/payments/new?ro=${encodeURIComponent(roNumber)}`;
}

export function RepairOrderTable({ ros }: { ros: PrototypeRo[] }) {
  const navigate = useNavigate();
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'closed'>('all');
  const [customerFilter, setCustomerFilter] = useState('');
  const [roFilter, setRoFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([{ id: 'createdAt', desc: true }]);

  const rows = useMemo<RepairOrderRow[]>(
    () =>
      ros.map((ro) => ({
        ...ro,
        departmentSummary: buildDepartmentSummary(ro),
        createdAtLabel: dateFormatter.format(new Date(ro.createdAt))
      })),
    [ros]
  );

  const columns = useMemo<ColumnDef<RepairOrderRow>[]>(
    () => [
      {
        accessorKey: 'roNumber',
        header: 'RO Number',
        cell: ({ row, getValue }) => (
          <Stack spacing={0.5}>
            <Typography fontWeight={800}>{String(getValue())}</Typography>
            <Typography variant="body2" color="text.secondary">
              {row.original.vin}
            </Typography>
          </Stack>
        )
      },
      {
        accessorKey: 'customerName',
        header: 'Customer',
        cell: ({ getValue }) => <Typography fontWeight={650}>{String(getValue())}</Typography>
      },
      {
        accessorKey: 'status',
        header: 'Status',
        filterFn: 'equalsString',
        cell: ({ getValue }) => {
          const status = String(getValue());
          return (
            <Chip
              label={status.toUpperCase()}
              size="small"
              sx={{
                fontWeight: 700,
                bgcolor: status === 'open' ? alpha('#f59e0b', 0.16) : alpha('#16a34a', 0.16),
                color: status === 'open' ? '#9a5b00' : '#166534'
              }}
            />
          );
        }
      },
      {
        accessorKey: 'departmentSummary',
        header: 'Department',
        filterFn: 'includesString',
        cell: ({ getValue }) => <Typography>{String(getValue())}</Typography>
      },
      {
        accessorKey: 'remainingBalance',
        header: 'Balance Due',
        cell: ({ getValue }) => <Typography fontWeight={700}>{money(Number(getValue()))}</Typography>
      },
      {
        accessorKey: 'createdAtLabel',
        id: 'createdAt',
        header: 'Date',
        filterFn: 'includesString',
        sortingFn: (a, b) => Date.parse(a.original.createdAt) - Date.parse(b.original.createdAt),
        cell: ({ getValue }) => <Typography color="text.secondary">{String(getValue())}</Typography>
      },
      {
        id: 'action',
        header: '',
        enableSorting: false,
        cell: ({ row }) =>
          row.original.status === 'open' ? (
            <Button
              component={Link}
              to={buildPaymentPath(row.original.roNumber)}
              variant="contained"
              size="small"
              onClick={(event) => event.stopPropagation()}
            >
              Process payment
            </Button>
          ) : (
            <Chip label="Closed" size="small" variant="outlined" />
          )
      }
    ],
    []
  );

  const columnFilters = useMemo<ColumnFiltersState>(() => {
    const filters: ColumnFiltersState = [];
    if (statusFilter !== 'all') filters.push({ id: 'status', value: statusFilter });
    if (customerFilter.trim()) filters.push({ id: 'customerName', value: customerFilter.trim() });
    if (roFilter.trim()) filters.push({ id: 'roNumber', value: roFilter.trim() });
    if (departmentFilter.trim()) filters.push({ id: 'departmentSummary', value: departmentFilter.trim() });
    if (dateFilter.trim()) filters.push({ id: 'createdAt', value: dateFilter.trim() });
    return filters;
  }, [customerFilter, dateFilter, departmentFilter, roFilter, statusFilter]);

  const table = useReactTable({
    data: rows,
    columns,
    state: {
      sorting,
      globalFilter,
      columnFilters
    },
    globalFilterFn: roQuickSearch,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel()
  });

  const clearFilters = () => {
    setGlobalFilter('');
    setStatusFilter('all');
    setCustomerFilter('');
    setRoFilter('');
    setDepartmentFilter('');
    setDateFilter('');
  };

  return (
    <Stack spacing={2.5}>
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Box>
              <Typography variant="h6">Repair Order list</Typography>
              <Typography color="text.secondary">
                Quick search finds customer name or RO number. Use the filters to narrow by status, customer, RO, department, or date.
              </Typography>
            </Box>

            <Stack spacing={2}>
              <TextField
                label="Quick search"
                placeholder="Customer name or RO number"
                value={globalFilter}
                onChange={(event) => setGlobalFilter(event.target.value)}
                fullWidth
              />

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField select label="Status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as 'all' | 'open' | 'closed')} fullWidth>
                  <MenuItem value="all">All statuses</MenuItem>
                  <MenuItem value="open">Open</MenuItem>
                  <MenuItem value="closed">Closed</MenuItem>
                </TextField>
                <TextField label="Customer" value={customerFilter} onChange={(event) => setCustomerFilter(event.target.value)} fullWidth />
                <TextField label="RO Number" value={roFilter} onChange={(event) => setRoFilter(event.target.value)} fullWidth />
              </Stack>

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField label="Department" placeholder="Parts, Service, Sales" value={departmentFilter} onChange={(event) => setDepartmentFilter(event.target.value)} fullWidth />
                <TextField label="Date" placeholder="2026-04 or Apr" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} fullWidth />
                <Box sx={{ display: 'flex', alignItems: 'end' }}>
                  <Button variant="text" onClick={clearFilters} sx={{ whiteSpace: 'nowrap' }}>
                    Clear filters
                  </Button>
                </Box>
              </Stack>
            </Stack>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip label={`${table.getRowModel().rows.filter((row) => row.original.status === 'open').length} open`} color="warning" variant="outlined" />
              <Chip label={`${table.getRowModel().rows.filter((row) => row.original.status === 'closed').length} closed`} color="success" variant="outlined" />
              <Chip label={`${table.getRowModel().rows.length} total`} variant="outlined" />
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <TableContainer component={Paper} variant="outlined" sx={{ border: 'none', overflowX: 'auto' }}>
          <Table size="small" sx={{ minWidth: 980 }}>
            <TableHead>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableCell
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      sx={{
                        cursor: header.column.getCanSort() ? 'pointer' : 'default',
                        fontWeight: 800,
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Box>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</Box>
                        <Box sx={{ minWidth: 16 }}>{header.column.getIsSorted() === 'asc' ? '^' : header.column.getIsSorted() === 'desc' ? 'v' : null}</Box>
                      </Stack>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {table.getRowModel().rows.map((row) => {
                const isOpen = row.original.status === 'open';
                return (
                  <TableRow
                    key={row.id}
                    hover={isOpen}
                    onClick={() => {
                      if (isOpen) {
                        navigate(buildPaymentPath(row.original.roNumber));
                      }
                    }}
                    sx={{
                      cursor: isOpen ? 'pointer' : 'default',
                      backgroundColor: isOpen ? alpha('#f59e0b', 0.12) : alpha('#16a34a', 0.1),
                      '&:hover': {
                        backgroundColor: isOpen ? alpha('#f59e0b', 0.18) : alpha('#16a34a', 0.14)
                      }
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} sx={{ whiteSpace: 'nowrap' }}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
              {!table.getRowModel().rows.length ? (
                <TableRow>
                  <TableCell colSpan={columns.length}>
                    <Typography color="text.secondary" sx={{ py: 2 }}>
                      No repair orders match the current filters.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Stack>
  );
}
