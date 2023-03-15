import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import Axios from 'axios';
import Topbar from '../global/Topbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';


const Admins = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  


  

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8000/api/admin');
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
      const response = await fetch('http://localhost:8000/api/admin', {
        method: 'POST',
        headers: { 
          'Accept': 'application/json', 
          "Authorization": "Bearer " + localStorage.getItem("token"),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        throw new Error('Failed to create new row');
      }
      fetchData(); // fetch the updated data
      setCreateModalOpen(false); // close the create modal
    } catch (error) {
      console.error(error);
    }
  }, [fetchData]);
  






  const handleSaveRowEdits = useCallback(async ({ exitEditingMode, row, values }) => {
    if (!Object.keys(validationErrors).length) {
      try {
        // create a new object with only the desired fields
        const editedValues = {
          username: values.username,
          password: values.password,
          password_confirmation: values.password_confirmation
        };
  
        const response = await fetch(`http://localhost:8000/api/admin/${row.original.id}`, {
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
        toast.success('Admin updated successfully!');

        exitEditingMode(); //required to exit editing mode and close modal
      } catch (error) {
        toast.error('Bad Creds!');

        console.error(error);
      }
    }
  }, [tableData, validationErrors]);
  

  const handleCancelRowEdits = useCallback(() => {
    setValidationErrors({});
  }, []);

  const handleDeleteRow = useCallback(async (row) => {
  const result = await Swal.fire({
    icon: 'warning',
    title: `Are you sure you want to delete ${row.original.username}?`,
    showCancelButton: true,
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
    reverseButtons: true
  });

  // SweetAlert handles the confirmation
  try {
    if (result.isConfirmed) {
      const response = await fetch(`http://localhost:8000/api/admin/${row.original.id}`, {
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
      const newResponse = await fetch('http://localhost:8000/api/admin');
      if (!newResponse.ok) {
        throw new Error('Failed to fetch data');
      }
      const newData = await newResponse.json();
      setTableData(newData);
      toast.success('Admin deleted successfully!');
    }
  } catch (error) {
    toast.error('Failed to delete Admin!');
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
        accessorKey: 'username',
        header: 'Username',
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'is_super',
        header: 'Role',
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: 'string',
        }),
      },
      {
        accessorKey: 'created_by',
        header: 'Created By',
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: 'string',
        }),
      },
      {
        accessorKey: 'updated_by',
        header: 'Updated By',
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: 'string',
        }),
      },
      
 
  
     
    ],
    [getCommonEditTextFieldProps],
  );

  const pop = useMemo(
    () => [
    
      {
        accessorKey: 'username',
        header: 'Username',
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'password',
        header: 'Password',
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: 'password',
        }),
      },
      {
        accessorKey: 'password_confirmation',
        header: 'Password Confirmation',
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: 'password',
        }),
      },    
    ],
    [getCommonEditTextFieldProps],
  );

  return (
    <>
    <ToastContainer  position="bottom-right" />
    <Topbar />
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
            <Tooltip arrow placement="left" title="Edit" 
            >
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
            Create New Admin
          </Button>
        )}
      />
      <CreateNewAccountModal
        columns={pop}
        // data={tableData}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
      />
    </>
  );
};

//example of creating a mui dialog modal for creating new rows
export const CreateNewAccountModal = ({ open, columns, onClose, onSubmit, setTableData }) => {
  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ''] = '';
      return acc;
    }, {}),
  );

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8000/api/admin');
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




  const handleSubmit = async() => {
    //put your validation logic here
    try {
      console.log("token ",localStorage.getItem('token'));
      const data = {
        "username": values.username,
        "password": values.password,
        "password_confirmation": values.password_confirmation
      };

      console.log(JSON.stringify(data));
	  
		  const res = await Axios.post("http://localhost:8000/api/admin", JSON.stringify(data), {
        headers: {
          'Accept': 'application/json', 
          "Authorization": "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        }
		  });
		  // Request();
      fetchData();
      onSubmit(values);
      onClose();
          toast.success('Admin created successfully!');

    
	  }
    catch (err) {
          toast.error('Bad Creds');

    console.log("error ",err);
  }
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Create New Admin</DialogTitle>
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
          Create
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

export default Admins;  
