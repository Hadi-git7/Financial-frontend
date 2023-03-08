import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Admins from "./scenes/admins";
import Income from "./scenes/incomes";
import Categories from "./scenes/categories";
import Goal from "./scenes/goal";
import Calendar from "./scenes/calendar";
import Bar from "./scenes/bar";
import Pie from "./scenes/pie";
import Line from "./scenes/line";
// import Axios from 'axios';
import React  from "react";
import Expense from "./scenes/expenses";


function App() {
	const [theme, colorMode] = useMode();
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

							<Route path="/admins" element={<Admins/>} />
							<Route path="/income" element={<Income />} />
							<Route path="/expense" element={<Expense />} />
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
