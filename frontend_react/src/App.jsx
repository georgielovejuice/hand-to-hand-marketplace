import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Signup'
import Test from './pages/testing.jsx'
import BrowsePage from './pages/BrowsePage.jsx'
import CreateItem from './pages/CreateItem.jsx'

const App = () => {
  return (
    <>
    <div data-theme="caramel">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<BrowsePage />} />
        <Route path='/create' element={<CreateItem/>}></Route>

        <Route path="/test" element={<Test />} />
      </Routes>

    </div>
    </>

  )
}

export default App;
