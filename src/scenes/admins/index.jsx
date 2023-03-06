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
  // MenuItem,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import Axios from 'axios';
// import { data, states } from './makeData.ts';

const Admins = ({ 
  Username,
  setUsername,
  Password,
  setPassword,
  PasswordConfirmation,
  setPasswordConfirmation,}) => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  // const [tableData, setTableData] = useState(() => data);
  const [Admin, setAdmin] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});


  // const accessToken = '1|CdEsiPfDSynDabjezyqkUIMfeC7MQpLXnQUlbsTL';

  const Request = async () => {
    try {
      const response = await Axios.get("http://localhost:8000/api/admin");
      const res = await response.data;
      console.log(res);
      setAdmin(res);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    Request();
  }, []);



  // useEffect(() => {
  //   fetch('/api/admins')
  //     .then((response) => response.json())
  //     .then((data) => setTableData(data))
  //     .catch((error) => console.error(error));
  // }, []);

  const handleCreateNewRow = async () => {
    const data = {
      'username': Username,
      'password': Password,
      'password_confirmation': PasswordConfirmation,
    };

    try {
      const res = await Axios.post(
        `http://localhost:8000/api/admin`,
        data,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );
      const response = await res.data;
      console.log(response);
      Request();
    } catch (err) {
      console.log(err);
    }
  };
  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    if (!Object.keys(validationErrors).length) {
      //send API update request here, then update local table data for re-render
      fetch(`/api/admin/${row.original.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
        .then((response) => response.json())
        .then(() => {
          Admin[row.index] = values;
          setAdmin([...Admin]);
          exitEditingMode(); //required to exit editing mode and close modal
        })
        .catch((error) => console.error(error));
    }
  };

  const handleDeleteRow = useCallback(
    (row) => {
      //send API delete request here, then update local table data for re-render
      fetch(`/api/admins/${row.original.id}`, { method: 'DELETE' })
        .then(() => {
          Admin.splice(row.index, 1);
          setAdmin([...Admin]);
        })
        .catch((error) => console.error(error));
    },
    [Admin],
  );

  //rest of the code remains the same


  // const handleCreateNewRow = (values) => {
  //   tableData.push(values);
  //   setTableData([...tableData]);
  // };

  // const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
  //   if (!Object.keys(validationErrors).length) {
  //     tableData[row.index] = values;
  //     //send/receive api updates here, then refetch or update local table data for re-render
  //     setTableData([...tableData]);
  //     exitEditingMode(); //required to exit editing mode and close modal
  //   }
  // };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  // const handleDeleteRow = useCallback(
  //   (row) => {
  //     // if (
  //     //   !confirm(`Are you sure you want to delete ${row.getValue('firstName')}`)
  //     // ) {
  //     //   return;
  //     // }
  //     //send api delete request here, then refetch or update local table data for re-render
  //     tableData.splice(row.index, 1);
  //     setTableData([...tableData]);
  //   },
  //   [tableData],
  // );

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
 
  
     
    ],
    [getCommonEditTextFieldProps],
  );
  const Pop = useMemo(
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
        }),
      },
      {
        accessorKey: 'password_confirmation',
        header: 'Confirm_Password',
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
  
      {
        accessorKey: 'is_super',
        header: 'Role',
        size: 80,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          
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
        data={Admin}
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
            Create New Admin
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

export const CreateNewAccountModal = ({ open, columns, onClose, onSubmit, Username, Password, PasswordConfirmation, setUsername, setPassword, setPasswordConfirmation }) => {
  const [values, setValues] = useState(() => ({
    [Username]: '',
    [Password]: '',
    [PasswordConfirmation]: '',
    ...columns.reduce((acc, column) => {
        acc[column.accessorKey ?? ''] = '';
        return acc;
    }, {}),
}));

const handleSubmit = () => {
  //put your validation logic here
  onSubmit({
      ...values,
      [Username]: Username,
      [Password]: Password,
      [PasswordConfirmation]: PasswordConfirmation,
  });
  onClose();
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
            <TextField
              key='Username'
              label='Username'
              name='Username'
              value={Username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              key='Password'
              label='Password'
              name='Password'
              type='password'
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              key='PasswordConfirmation'
              label='Password Confirmation'
              name='PasswordConfirmation'
              type='password'
              value={PasswordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />
 

          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: '1.25rem' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="secondary" onClick={handleSubmit} variant="contained">
          Create New Admin
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