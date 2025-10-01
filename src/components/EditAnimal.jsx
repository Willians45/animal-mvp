import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import supabase from '../supabaseClient';

export default function EditAnimal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);

  useEffect(() => {
    const fetchAnimal = async () => {
      const { data } = await supabase.from('animals').select('*').eq('id', id).single();
      setForm(data);
    };
    fetchAnimal();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await supabase.from('animals').update({
      orden: parseInt(form.orden),
      sexo: form.sexo,
      peso: parseFloat(form.peso),
      gestaciones: form.sexo === 'Hembra' ? parseInt(form.gestaciones) : null,
      descripcion: form.descripcion
    }).eq('id', id);
    navigate('/');
  };

  if (!form) return <p>Cargando...</p>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>Editando Animal #{form.orden}</h2>
      <input name="orden" value={form.orden} onChange={handleChange} placeholder="Orden" />
      <select name="sexo" value={form.sexo} onChange={handleChange}>
        <option>Macho</option>
        <option>Hembra</option>
      </select>
      <input name="peso" value={form.peso} onChange={handleChange} placeholder="Peso" />
      {form.sexo === 'Hembra' && (
        <input name="gestaciones" value={form.gestaciones || ''} onChange={handleChange} placeholder="Gestaciones" />
      )}
      <textarea name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción" />
      <button type="submit">Guardar cambios</button>
    </form>
  );
}
