import React, { useCallback, useMemo, useState, useEffect } from 'react';
import MaterialReactTable from 'material-react-table';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
//   MenuItem,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import Axios from 'axios';

const Income = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  




  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8000/api/income');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setTableData(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateNewRow = useCallback((values) => {
    setTableData([...tableData, values]);
  }, [tableData]);

  const handleSaveRowEdits = useCallback(async ({ exitEditingMode, row, values }) => {
    if (!Object.keys(validationErrors).length) {
      try {
        const body = {
          title: values.title,
          description: values.description,
          type: values.type,
          amount: values.amount,
          currency: values.currency,
          category_title: values.category_title,

        };
        const response = await fetch(`http://localhost:8000/api/income/${row.original.id}`, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json', 
            "Authorization": "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
        if (!response.ok) {
          throw new Error('Failed to update row');
        }
        const data = await response.json();
        // update local table data
        const newData = [...tableData];
        newData[row.index] = data;
        setTableData(newData);
        exitEditingMode(); //required to exit editing mode and close modal
      } catch (error) {
        console.error(error);
      }
    }
  }, [tableData, validationErrors]);

  const handleDeleteRow = useCallback(async (row) => {
    if (!window.confirm(`Are you sure you want to delete ${row.original.id}`)) {
      return;
    }
    try {
      const response = await fetch(`http://localhost:8000/api/income/${row.original.id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json', 
          "Authorization": "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        }
      
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete row');
      }
      // update local table data
      const newData = [...tableData];
      newData.splice(row.index, 1);
      setTableData(newData);
    } catch (error) {
      console.error(error);
    }
  }, [tableData]);


  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };


  const getCommonEditTextFieldProps = useCallback(
    (cell) => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
        onBlur: (event) => {
          const isValid =
            cell.column.id === 'email'
              ? validateEmail(event.target.value)
              : cell.column.id === 'age'
              ? validateAge(+event.target.value)
              : validateRequired(event.target.value);
          if (!isValid) {
            //set validation error for cell if invalid
            setValidationErrors({
              ...validationErrors,
              [cell.id]: `${cell.column.columnDef.header} is required`,
            });
          } else {
            //remove validation error for cell if valid
            delete validationErrors[cell.id];
            setValidationErrors({
              ...validationErrors,
            });
          }
        },
      };
    },
    [validationErrors],
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: false,
        size: 80,
      },
      {
        accessorKey: 'title',
        header: 'Title',
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: 'string',
        }),
      },
      {
        accessorKey: 'type',
        header: 'Type',
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: 'string',
        }),
      },
      {
        accessorKey: 'description',
        header: 'Description',
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: 'string',
        }),
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: 'number',

        }),
      },
      {
        accessorKey: 'currency',
        header: 'Currency',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: 'string',
        }),
      },
      {
        accessorKey: 'category_id',
        header: 'Category ID',
        size: 80,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: 'number',
        }),
      },
     
      {
        accessorKey: 'category_title',
        header: 'Category Title',
        size: 80,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: 'string',
        }),
      },
      {
        accessorKey: 'created_by',
        header: 'Created By',
        size: 80,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: 'string',
        }),
      },
      {
        accessorKey: 'updated_by',
        header: 'Updated By',
        size: 80,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: 'string',
        }),
      },
      {
        accessorKey: 'start_date',
        header: 'Start Date',
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: 'number',

        }),
      },   {
        accessorKey: 'end_date',
        header: 'End Date',
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: 'number',

        }),
      },
    ],
    [getCommonEditTextFieldProps],
  );
  const Pop = useMemo(
    () => [
    
      {
        accessorKey: 'title',
        header: 'Title',
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: 'string',
        }),
      },
      {
        accessorKey: 'description',
        header: 'Description',
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: 'string',
        }),
      },
      {
        accessorKey: 'type',
        header: 'Type',
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: 'string',
        }),
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: 'number',
        }),
      },
      {
        accessorKey: 'currency',
        header: 'Currency',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: 'string',
        }),
      },
      {
        accessorKey: 'category_title',
        header: 'Category title',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: 'string',
        }),
      },
      {
        accessorKey: 'start_date',
        header: 'Start Date',
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: 'number',

        }),
      },   {
        accessorKey: 'end_date',
        header: 'End Date',
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: 'number',

        }),
      },
     
    ],
    [getCommonEditTextFieldProps],
  );

  return (
    <>
      <MaterialReactTable
        displayColumnDefOptions={{
          'mrt-row-actions': {
            muiTableHeadCellProps: {
              align: 'center',
            },
            size: 120,
          },
        }}
        columns={columns}
        data={tableData}
        editingMode="modal" //default
        enableColumnOrdering
        enableEditing
        onEditingRowSave={handleSaveRowEdits}
        onEditingRowCancel={handleCancelRowEdits}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Tooltip arrow placement="left" title="Edit">
              <IconButton onClick={() => table.setEditingRow(row)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Delete">
              <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        renderTopToolbarCustomActions={() => (
          <Button
            color="secondary"
            onClick={() => setCreateModalOpen(true)}
            variant="contained"
          >
            Create New Payment
          </Button>
        )}
      />
      <CreateNewAccountModal
        columns={Pop}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
      />
    </>
  );
};

//example of creating a mui dialog modal for creating new rows
export const CreateNewAccountModal = ({ open, columns, onClose, onSubmit }) => {
  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ''] = '';
      return acc;
    }, {}),
  );
  const handleSubmit = async () => {
    try {
      // Check if the category already exists
      let category = await Axios.get(`http://localhost:8000/api/category?title=${values.category_title}`, {
        headers: {
          'Accept': 'application/json',
          "Authorization": "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        }
      });
  
      if (category.data.length === 0) {
        // If the category does not exist, create a new category and add it to the database
        const res = await Axios.post("http://localhost:8000/api/category", {
          "title": values.category_title,

        }, {
          headers: {
            'Accept': 'application/json',
            "Authorization": "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
          }
        });
        category = res.data;
      } else {
        category = category.data[0];
      }
  
      // Create a new payment and associate it with the current admin and category
      const data = {
        "type": values.type,
        "title": values.title,
        "description": values.description,
        "amount": values.amount,
        "currency": values.currency,
        "category_id": category.id,
        "category_title": category.title,
        "start_date": values.start_date,
        "end_date": values.end_date,

      };
      
      const res2 = await Axios.post("http://localhost:8000/api/expense", data, {
        headers: {
          'Accept': 'application/json',
          "Authorization": "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        }
      });
  
      window.location.reload();
      onSubmit(values);
      onClose();
    } catch (err) {
      console.log("error ", err);
    }
  };
  

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Create New Payment</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: '100%',
              minWidth: { xs: '300px', sm: '360px', md: '400px' },
              gap: '1.5rem',
            }}
          >
            {columns.map((column) => (
              <TextField
                key={column.accessorKey}
                label={column.header}
                name={column.accessorKey}
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
              />
            ))}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: '1.25rem' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="secondary" onClick={handleSubmit} variant="contained">
          Create New Payment
        </Button>
      </DialogActions>
    </Dialog>
  );
};


const validateRequired = (value) => !!value.length;
const validateEmail = (email) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
const validateAge = (age) => age >= 18 && age <= 50;

export default Income;