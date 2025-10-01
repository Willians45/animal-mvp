import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import supabase from './supabaseClient';

export default function AnimalProfile() {
  const { id } = useParams();
  const [animal, setAnimal] = useState(null);

  useEffect(() => {
    const fetchAnimal = async () => {
      const { data } = await supabase.from('animals').select('*').eq('id', id).single();
      setAnimal(data);
    };
    fetchAnimal();
  }, [id]);

  if (!animal) return <p>Cargando...</p>;

  return (
    <div>
      <h2>Animal #{animal.orden}</h2>
      <img src={animal.foto_url} alt="Foto del animal" width="200" />
      <p>Sexo: {animal.sexo}</p>
      <p>Peso: {animal.peso} kg</p>
      {animal.sexo === 'Hembra' && <p>Gestaciones: {animal.gestaciones}</p>}
      <p>Descripción: {animal.descripcion}</p>
      <a href={animal.pedigree_url} target="_blank">Ver Pedigree (PDF)</a>
    </div>
  );
}
