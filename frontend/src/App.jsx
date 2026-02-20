import React from "react";
import { Routes, Route } from "react-router";
import Register from "./pages/Register";
import Login from "./pages/Login";


const App = () => {
	return (
		<>
		<div>
			<Routes>
				<Route path="/register" element={<Register/>}/>
				<Route path="/login" element={<Login/>}/>
			</Routes>

		</div>
		</>
	)
}

export default App;