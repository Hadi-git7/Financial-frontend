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
  MenuItem,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';import { Delete, Edit } from '@mui/icons-material';
import Axios from 'axios';


const Categories = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});

const fetchData = useCallback(async () => {
  try {
    const response = await fetch('http://localhost:8000/api/category');
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

// const handleCreateNewRow = useCallback((values) => {
//   setTableData([...tableData, values]);
// }, [tableData]);

const handleCreateNewRow = useCallback(async (values) => {
  try {
    const response = await fetch('http://localhost:8000/api/category');
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    setTableData(data);
  } catch (error) {
    console.error(error);
  }
}, []);


const handleSaveRowEdits = useCallback(async ({ exitEditingMode, row, values }) => {
  if (!Object.keys(validationErrors).length) {
    try {
      // create a new object with only the desired fields
      const editedValues = {
        title: values.title,
      };

      const response = await fetch(`http://localhost:8000/api/category/${row.original.id}`, {
        method: 'PUT',
        headers: { 
          'Accept': 'application/json', 
          "Authorization": "Bearer " + localStorage.getItem("token"),
          'Content-Type': 'application/json'
                },
        body: JSON.stringify(editedValues),
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

const handleCancelRowEdits = useCallback(() => {
  setValidationErrors({});
}, []);

const handleDeleteRow = useCallback(async (row) => {
  if (!window.confirm(`Are you sure you want to delete ${row.original.id}`)) {
    return;
  }
  try {
    const response = await fetch(`http://localhost:8000/api/category/${row.original.id}`, {
      method: 'DELETE',
      headers: { 
        'Accept': 'application/json', 
        "Authorization": "Bearer " + localStorage.getItem("token"),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
    });
    if (!response.ok) {
      throw new Error('Failed to delete row');
    }
    const newResponse = await fetch('http://localhost:8000/api/category');
    if (!newResponse.ok) {
      throw new Error('Failed to fetch data');
    }
    const newData = await newResponse.json();
    setTableData(newData);
  } catch (error) {
    console.error(error);
  }
}, []);


const getCommonEditTextFieldProps = useCallback((cell) => {
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
      }),
    },
    {
      accessorKey: 'admin_id',
      header: 'Admin_id',
      size: 140,
      muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
        ...getCommonEditTextFieldProps(cell),
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
      accessorKey: 'created_at',
      header: 'Created_at',
      size: 80,
      muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
        ...getCommonEditTextFieldProps(cell),
        type: 'string',
      }),
    },
    {
      accessorKey: 'updated_at',
      header: 'Updated_at',
      size: 80,
      muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
        ...getCommonEditTextFieldProps(cell),
        type: 'string',
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
        type:"string",
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
          <Tooltip arrow placement="left" title="Editz">
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
          Create New Category
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
export const CreateNewAccountModal = ({ open, columns, onClose, onSubmit}) => {
  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ''] = '';
      return acc;
    }, {}),
  );  

  const handleSubmit = async() => {
    //put your validation logic here
    try {
      console.log("token ",localStorage.getItem('token'));
      
      const data = {
        "title": values.title,
   
      };

      console.log(JSON.stringify(data));
	  
		  const res = await Axios.post("http://localhost:8000/api/category", JSON.stringify(data), {
        headers: {
          'Accept': 'application/json', 
          "Authorization": "Bearer " + localStorage.getItem("token"),
          'Content-Type': 'application/json'  ,
              }
        // headers: { 
        //   'Accept': 'application/json', 
        //   'Authorization': 'Bearer 1|ezWKYPKQFbEemJevE4D5OHMOvaVe5VNSx6pil18k', 
        //   'Content-Type': 'application/x-www-form-urlencoded'
        // },
		  });
		  // Request();
      onSubmit(values);
      onClose();
	  }
    catch (err) {
    console.log("error ",err);
  }
  };

return (
  <Dialog open={open}>
    <DialogTitle textAlign="center">Create New Category</DialogTitle>
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
        Create New Category
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

export default Categories;  