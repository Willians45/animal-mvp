import { useState } from 'react';
import supabase from '../supabaseClient';
import QRCode from 'qrcode';

export default function CreateAnimal() {
  const [form, setForm] = useState({
    orden: '',
    sexo: '',
    peso: '',
    gestaciones: '',
    descripcion: '',
    foto: null,
    pedigree: null
  });
  const [qr, setQr] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = crypto.randomUUID();

    // Subir imagen
    const { data: fotoData } = await supabase.storage
      .from('fotos')
      .upload(`${id}/${form.foto.name}`, form.foto);

    // Subir PDF
    const { data: pdfData } = await supabase.storage
      .from('pedigrees')
      .upload(`${id}/${form.pedigree.name}`, form.pedigree);

    const foto_url = supabase.storage.from('fotos').getPublicUrl(fotoData.path).data.publicUrl;
    const pedigree_url = supabase.storage.from('pedigrees').getPublicUrl(pdfData.path).data.publicUrl;

    const qr_url = `https://tusitio.vercel.app/animal/${id}`;
    const qr_img = await QRCode.toDataURL(qr_url);
    setQr(qr_img);

    await supabase.from('animals').insert({
      id,
      orden: parseInt(form.orden),
      sexo: form.sexo,
      peso: parseFloat(form.peso),
      gestaciones: form.sexo === 'Hembra' ? parseInt(form.gestaciones) : null,
      descripcion: form.descripcion,
      foto_url,
      pedigree_url,
      qr_url
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="orden" placeholder="Orden" onChange={handleChange} />
      <select name="sexo" onChange={handleChange}>
        <option>Macho</option>
        <option>Hembra</option>
      </select>
      <input name="peso" placeholder="Peso" onChange={handleChange} />
      {form.sexo === 'Hembra' && (
        <input name="gestaciones" placeholder="Gestaciones" onChange={handleChange} />
      )}
      <textarea name="descripcion" placeholder="Descripción" onChange={handleChange} />
      <input type="file" name="foto" accept="image/*" onChange={handleChange} />
      <input type="file" name="pedigree" accept="application/pdf" onChange={handleChange} />
      <button type="submit">Crear perfil</button>

      {qr && <img src={qr} alt="QR del perfil" />}
    </form>
  );
}
