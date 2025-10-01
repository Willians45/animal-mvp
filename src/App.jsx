import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CreateAnimal from './components/CreateAnimal';
import AnimalProfile from './components/AnimalProfile';
import Dashboard from './components/Dashboard';
import EditAnimal from './components/EditAnimal';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/crear" element={<CreateAnimal />} />
        <Route path="/animal/:id" element={<AnimalProfile />} />
        <Route path="/editar/:id" element={<EditAnimal />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
