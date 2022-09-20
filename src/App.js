import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {Home, TollList} from './pages'
import './App.css'

const App = () => {




  return (
    <div className='App'>
      <h2>Toll Management Application</h2>
      <hr />
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route exact path='/tollList' element={<TollList />} />
      </Routes>
    </BrowserRouter>
    </div>
  )
}


export default App