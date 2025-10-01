import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import supabase from '../supabaseClient';

export default function Dashboard() {
  const [animals, setAnimals] = useState([]);

  const fetchAnimals = async () => {
    const { data } = await supabase
      .from('animals')
      .select('*')
      .order('created_at', { ascending: false });
    setAnimals(data);
  };

  const deleteAnimal = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este perfil?')) return;
    await supabase.from('animals').delete().eq('id', id);
    fetchAnimals(); // recargar lista
  };

  useEffect(() => {
    fetchAnimals();
  }, []);

  return (
    <div>
      <h1>Dashboard de Animales</h1>
      <Link to="/crear">➕ Crear nuevo perfil</Link>
      <ul>
        {animals.map((animal) => (
          <li key={animal.id} style={{ marginBottom: '1rem' }}>
            <strong>#{animal.orden}</strong> - {animal.sexo} - {animal.peso}kg
            <br />
            <Link to={`/animal/${animal.id}`}>👁️ Ver público</Link> |{' '}
            <Link to={`/editar/${animal.id}`}>✏️ Editar</Link> |{' '}
            <button onClick={() => deleteAnimal(animal.id)}>🗑️ Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
