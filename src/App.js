import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Admins from "./scenes/admins";
import Payment from "./scenes/payments";
import Categories from "./scenes/categories";
import Goal from "./scenes/goal";
import Calendar from "./scenes/calendar";
import Bar from "./scenes/bar";
import Pie from "./scenes/pie";
import Line from "./scenes/line";
import Axios from 'axios';
import React , {useState, useEffect} from "react";


function App() {
	const [theme, colorMode] = useMode();
	const [Username,setUsername]=useState('');
	const [Password,setPassword]=useState('');
	const [PasswordConfirmation,setPasswordConfirmation]=useState('');
	const [Admin, setAdmin] = useState([]);


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

	//   const handleCreateNewRow = async () => {
	// 	const data = {
	// 	  "username": Username,
	// 	  "password": Password,
	// 	  "Password_confirmation": PasswordConfirmation
	// 	};
	  
	// 	try {
	// 	  const res = await Axios.post("http://localhost:5000/api/admin", data, {
	// 		headers: {
	// 		  "Authorization": "Bearer " + localStorage.getItem("token"),
	// 		  "Content-Type": "application/json"
	// 		}
	// 	  });
	// 	  const response = await res.data;
	// 	  console.log(response);
	// 	  Request();
	// 	} catch (err) {
	// 	  console.log(err);
	// 	}
	//   };
	  

	

	return (
		<ColorModeContext.Provider value={colorMode}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<div className="app">
					<Sidebar />
					<main className="content">
						<Topbar />
						<Routes>
							<Route exact path="/" element={<Dashboard />} />

							<Route path="/admins" element={<Admins 
							 Admin ={Admin}
							 setAdmin ={setAdmin}
							 Username={Username}
							 setUsername={setUsername}
							 Password={Password}
							 setPassword={setPassword}
							 PasswordConfirmation={PasswordConfirmation}
							 setPasswordConfirmation={setPasswordConfirmation}/>} />

							<Route path="/payments" element={<Payment />} />
							<Route path="/categories" element={<Categories />} />
							<Route path="/goal" element={<Goal />} />
							<Route path="/calendar" element={<Calendar />} />
							<Route path="/bar" element={<Bar />} />
							<Route path="/pie" element={<Pie />} />
							<Route path="/line" element={<Line />} />
						</Routes>
					</main>
				</div>
			</ThemeProvider>
		</ColorModeContext.Provider>
	);
}

export default App;
