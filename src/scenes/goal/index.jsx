import React, { useCallback, useEffect, useMemo, useState } from "react";
import MaterialReactTable from "material-react-table";
import Axios from "axios";
import "../goal/goal.css";
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
} from "@mui/material";

import { Delete, Edit } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 15,
  borderRadius: 2,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 2,
    backgroundColor: theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
  },
}));

const Goal = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    let isMounted = true; // set a flag to check if the component is mounted

    fetchData();
    incomedata();
    expdata();

    return () => {
      isMounted = false; // set the flag to false when the component unmounts
    };
  }, []);

  const handleCreateNewRow = useCallback(
    (values) => {
      setTableData([...tableData, values]);
    },
    [tableData]
  );
  let profitdate = null;

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/goal");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const jsonData = await response.json();
      profitdate = jsonData.map((item) => item.year);
      console.log(profitdate);
      setTableData(jsonData);
    } catch (error) {
      console.error(error);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second and retry the function
      await fetchData();
    }
  };

  fetchData().then(() => {
    console.log(profitdate);
  });
  

  const incomedata = async () => {
    try {
      const income = await fetch("http://localhost:8000/api/income");
      if (!income.ok) {
        throw new Error("Network response was not ok");
      }
      const jsonincome = await income.json();
      const filteredincome = jsonincome.map((item) => item.amount);
      console.log(filteredincome);
    } catch (error) {
      console.error(error);
    }
  };

  const expdata = async () => {
    try {
      const expense = await fetch("http://localhost:8000/api/expense");
      if (!expense.ok) {
        throw new Error("Network response was not ok");
      }
      const jsonexpense = await expense.json();
      const filteredexpanse = jsonexpense.map((item) => item.amount);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveRowEdits = useCallback(
    async ({ exitEditingMode, row, values }) => {
      if (!Object.keys(validationErrors).length) {
        try {
          // create a new object with only the desired fields
          const editedValues = {
            profit: values.profit,
            year: values.year,
          };

          const response = await fetch(
            `http://localhost:8000/api/goal/${row.original.id}`,
            {
              method: "PUT",
              headers: {
                Accept: "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
                "Content-Type": "application/json",
              },
              body: JSON.stringify(editedValues),
            }
          );
          if (!response.ok) {
            throw new Error("Failed to update row");
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
    },
    [tableData, validationErrors]
  );

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  const handleDeleteRow = useCallback(
    async (row) => {
      if (
        !window.confirm(`Are you sure you want to delete ${row.original.id}`)
      ) {
        return;
      }
      try {
        const response = await fetch(
          `http://localhost:8000/api/goal/${row.original.id}`,
          {
            method: "DELETE",
            headers: {
              Accept: "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to delete row");
        }
        // update local table data
        const newData = [...tableData];
        newData.splice(row.index, 1);
        setTableData(newData);
      } catch (error) {
        console.error(error);
      }
    },
    [tableData]
  );

  const getCommonEditTextFieldProps = useCallback(
    (cell) => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
        onBlur: (event) => {
          const isValid =
            cell.column.id === "email"
              ? validateEmail(event.target.value)
              : cell.column.id === "age"
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
    [validationErrors]
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: false,
        size: 80,
      },
      {
        accessorKey: "totalIncome",
        header: "Total Income",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: "number",
        }),
      },
      {
        accessorKey: "totalExpense",
        header: "Total Expense",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: "number",
        }),
      },
      {
        accessorKey: "profit",
        header: "Profit",
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: "number",
        }),
      },
      {
        accessorKey: "year",
        header: "Year",
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: "number",
        }),
      },
      {
        accessorKey: "profit_calculated",
        header: "Profit Calculated",
        size: 80,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: "number",
        }),
      },
      {
        accessorKey: "admin_id",
        header: "Admin ID",
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: false,
        size: 80,
      },
      {
        accessorKey: "created_by",
        header: "Created By",
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: "string",
        }),
      },
      {
        accessorKey: "updated_by",
        header: "Updated By",
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: "string",
        }),
      },
      {
        accessorKey: "deleted_by",
        header: "Deleted By",
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: "string",
        }),
      },
    ],
    [getCommonEditTextFieldProps]
  );

  const pop = useMemo(
    () => [
      {
        accessorKey: "profit",
        header: "Profit",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: "number",
        }),
      },
      {
        accessorKey: "year",
        header: "Year",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: "number",
        }),
      },
    ],
    [getCommonEditTextFieldProps]
  );

  return (
    <>
      <Box className="bar">
        <BorderLinearProgress variant="determinate" value={50} />
        <p className="percentage">50%</p>
      </Box>
      <MaterialReactTable
        displayColumnDefOptions={{
          "mrt-row-actions": {
            muiTableHeadCellProps: {
              align: "center",
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
          <Box sx={{ display: "flex", gap: "1rem" }}>
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
            Create New Profit
          </Button>
        )}
      />
      <CreateNewAccountModal
        columns={pop}
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
      acc[column.accessorKey ?? ""] = "";
      return acc;
    }, {})
  );

  const handleSubmit = async () => {
    //put your validation logic here
    try {
      console.log("token ", localStorage.getItem("token"));
      const data = {
        profit: values.profit,
        year: values.year,
      };

      console.log(JSON.stringify(data));

      const res = await Axios.post(
        "http://localhost:8000/api/goal",
        JSON.stringify(data),
        {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),

            "Content-Type": "application/json",
          },
        }
      );
      window.location.reload();
      onSubmit(values);
      onClose();
    } catch (err) {
      console.log("error ", err);
    }
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Create New Profit</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: "100%",
              minWidth: { xs: "300px", sm: "360px", md: "400px" },
              gap: "1.5rem",
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
      <DialogActions sx={{ p: "1.25rem" }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="secondary" onClick={handleSubmit} variant="contained">
          Create New Profit
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
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
const validateAge = (age) => age >= 18 && age <= 50;

export default Goal;
