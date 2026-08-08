// lib/supabase/queries-client.ts
import { createClient } from '@/lib/supabase/client'
import { DeleteArwahResult, DeleteSenderResult } from '@/types/haul'
import type {
  KategoriFormValues, KegiatanFormValues, LombaFormValues, PertandinganFormValues, KegiatanWithKategori, Sponsor, SponsorFormValues
} from '@/types/kegiatan'

export async function getSendersNameDistinct() {
  const supabase = createClient()

  const { data, error } = await supabase
    .rpc('get_senders_name_distinct', {
      result_limit: 3000  // unlimited
    })

  if (error) {
    console.error('Error fetching senders:', error)
    return []
  }

  return (data || []).map((item: { name: string }) => item.name)
}

export async function getArwahsNameDistinct() {
  const supabase = createClient()

  const { data, error } = await supabase
    .rpc('get_arwahs_name_distinct', {
      result_limit: 10000  // unlimited
    })

  if (error) {
    console.error('Error fetching arwahs:', error)
    return []
  }

  return (data || []).map((item: { name: string }) => item.name)
}

export async function getAddressDistinct() {
  const supabase = createClient()

  const { data, error } = await supabase
    .rpc('get_address_distinct', {
      result_limit: 10000  // unlimited
    })

  if (error) {
    console.error('Error fetching arwahs:', error)
    return []
  }

  return (data || []).map((item: { name: string }) => item.name)
}


export async function insertDataHaul(data: {
  name: string;
  address: string;
  arwahs: Array<{
    arwah_name: string;
    arwah_address: string;
  }>;
}) {
  const supabase = createClient();

  const { data: result, error } = await supabase
    .rpc('insert_sender_with_arwahs', {
      p_name: data.name,
      p_address: data.address,
      p_arwahs: data.arwahs
    });

  if (error) {
    console.error('Error inserting data:', error);
    throw error;
  }

  return result;
  return result;
}

export async function insertArwahs(data: Array<{
  sender_id: number;
  arwah_name: string;
  arwah_address: string;
}>) {
  const supabase = createClient();

  const { data: insertedData, error } = await supabase
    .schema('db_kanggotan2')
    .from('arwahs')
    .insert(data.map(item => ({
      sender_id: item.sender_id,
      arwah_name: item.arwah_name,
      arwah_address: item.arwah_address,
      created_at: new Date(),
      updated_at: new Date(),
    })))
    .select('id, arwah_name')

  if (error) {
    console.error('Error inserting arwahs:', error);
    throw error;
  }

  return {
    success: true,
    data: insertedData
  };
}

export async function updateSender(data: {
  id: number;
  name: string;
  address: string;
}) {
  const supabase = createClient();

  const { error } = await supabase
    .schema('db_kanggotan2')
    .from('senders')
    .update({
      name: data.name,
      address: data.address
    })
    .eq('id', data.id)

  if (error) {
    console.error('Error updating data:', error);
    throw error;
  }

  return { success: true }
}

export async function updateArwah(data: {
  id: number;
  name: string;
  address: string;
}) {
  const supabase = createClient();

  const { error } = await supabase
    .schema('db_kanggotan2')
    .from('arwahs')
    .update({
      arwah_name: data.name,
      arwah_address: data.address
    })
    .eq('id', data.id)

  if (error) {
    console.error('Error updating data:', error);
    throw error;
  }

  return { success: true }
}

export async function deleteSender(id: number): Promise<DeleteSenderResult> {
  const supabase = createClient();

  const { error } = await supabase
    .schema('db_kanggotan2')
    .from('senders')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting sender:', error);
    throw error;
  }

  return { success: true }
}

export async function deleteArwah(arwahId: number, senderId: number): Promise<DeleteArwahResult> {
  const supabase = createClient();

  const { data: arwahs, error: countError } = await supabase
    .schema('db_kanggotan2')
    .from('arwahs')
    .select('id', { count: 'exact' })
    .eq('sender_id', senderId);

  if (countError) {
    console.error('Error counting arwahs:', countError);
    throw countError;
  }

  if (arwahs && arwahs.length <= 1) {
    throw new Error('Tidak dapat menghapus arwah terakhir. Setiap pengirim harus memiliki minimal 1 arwah.');
  }

  const { error: deleteError } = await supabase
    .schema('db_kanggotan2')
    .from('arwahs')
    .delete()
    .eq('id', arwahId);

  if (deleteError) {
    console.error('Error deleting arwah:', deleteError);
    throw deleteError;
  }

  const { data: remainingArwahs, error: fetchError } = await supabase
    .schema('db_kanggotan2')
    .from('arwahs')
    .select('id, arwah_name')
    .eq('sender_id', senderId)
    .order('created_at', { ascending: false })
    .limit(1);

  if (fetchError) {
    console.error('Error fetching remaining arwahs:', fetchError);
    throw fetchError;
  }

  return {
    success: true,
    nextArwah: remainingArwahs && remainingArwahs.length > 0 ? remainingArwahs[0] : null
  };
}

export async function signOut() {
  const supabase = createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Error signing out:', error)
    throw error
  }

  return { success: true }
}
export async function getSendersCount(year: number) {
  const supabase = createClient()

  const { count, error } = await supabase
    .schema('db_kanggotan2')
    .from('senders')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', `${year}-01-01`)
    .lt('created_at', `${year + 1}-01-01`)

  if (error) {
    console.error('Error counting senders:', error)
    throw error
  }

  return count
}

// ── KEGIATAN KATEGORI CRUD ──

export async function insertKategori(data: KategoriFormValues) {
  const supabase = createClient()
  const { error } = await supabase
    .schema('db_kanggotan2')
    .from('kegiatan_kategori')
    .insert({
      name: data.name,
      description: data.description || null,
      icon: data.icon || 'CalendarDays',
      sort_order: data.sort_order,
      is_active: data.is_active,
    })
  if (error) { console.error('Error insert kategori:', error); throw error }
  return { success: true }
}

export async function updateKategori(id: number, data: KategoriFormValues) {
  const supabase = createClient()
  const { error } = await supabase
    .schema('db_kanggotan2')
    .from('kegiatan_kategori')
    .update({
      name: data.name,
      description: data.description || null,
      icon: data.icon || 'CalendarDays',
      sort_order: data.sort_order,
      is_active: data.is_active,
    })
    .eq('id', id)
  if (error) { console.error('Error update kategori:', error); throw error }
  return { success: true }
}

export async function deleteKategori(id: number) {
  const supabase = createClient()
  const { error } = await supabase
    .schema('db_kanggotan2')
    .from('kegiatan_kategori')
    .delete()
    .eq('id', id)
  if (error) { console.error('Error delete kategori:', error); throw error }
  return { success: true }
}

// ── KEGIATAN CRUD ──

export async function insertKegiatan(data: KegiatanFormValues) {
  const supabase = createClient()
  const { error } = await supabase
    .schema('db_kanggotan2')
    .from('kegiatan')
    .insert({
      kategori_id: data.kategori_id,
      title: data.title,
      description: data.description || null,
      date: data.date,
      year: data.year,
      is_published: data.is_published,
    })
  if (error) { console.error('Error insert kegiatan:', error); throw error }
  return { success: true }
}

export async function updateKegiatan(id: number, data: KegiatanFormValues) {
  const supabase = createClient()
  const { error } = await supabase
    .schema('db_kanggotan2')
    .from('kegiatan')
    .update({
      kategori_id: data.kategori_id,
      title: data.title,
      description: data.description || null,
      date: data.date,
      year: data.year,
      is_published: data.is_published,
    })
    .eq('id', id)
  if (error) { console.error('Error update kegiatan:', error); throw error }
  return { success: true }
}

export async function deleteKegiatan(id: number) {
  const supabase = createClient()
  const { error } = await supabase
    .schema('db_kanggotan2')
    .from('kegiatan')
    .delete()
    .eq('id', id)
  if (error) { console.error('Error delete kegiatan:', error); throw error }
  return { success: true }
}

// ── LOMBA CRUD ──

export async function insertLomba(data: LombaFormValues) {
  const supabase = createClient()
  const { error } = await supabase
    .schema('db_kanggotan2')
    .from('lomba')
    .insert({
      kegiatan_id: data.kegiatan_id,
      nama: data.nama,
      deskripsi: data.deskripsi || null,
      tanggal: data.tanggal || null,
      jam: data.jam || null,
      pic_nama: data.pic_nama,
      pic_kontak: data.pic_kontak || null,
      sort_order: data.sort_order,
      has_pertandingan: data.has_pertandingan,
    })
  if (error) { console.error('Error insert lomba:', error); throw error }
  return { success: true }
}

export async function updateLomba(id: number, data: LombaFormValues) {
  const supabase = createClient()
  const { error } = await supabase
    .schema('db_kanggotan2')
    .from('lomba')
    .update({
      kegiatan_id: data.kegiatan_id,
      nama: data.nama,
      deskripsi: data.deskripsi || null,
      tanggal: data.tanggal || null,
      jam: data.jam || null,
      pic_nama: data.pic_nama,
      pic_kontak: data.pic_kontak || null,
      sort_order: data.sort_order,
      has_pertandingan: data.has_pertandingan,
    })
    .eq('id', id)
  if (error) { console.error('Error update lomba:', error); throw error }
  return { success: true }
}

export async function deleteLomba(id: number) {
  const supabase = createClient()
  const { error } = await supabase
    .schema('db_kanggotan2')
    .from('lomba')
    .delete()
    .eq('id', id)
  if (error) { console.error('Error delete lomba:', error); throw error }
  return { success: true }
}

// ── PERTANDINGAN CRUD ──

export async function insertPertandingan(data: PertandinganFormValues) {
  const supabase = createClient()
  const { error } = await supabase
    .schema('db_kanggotan2')
    .from('pertandingan')
    .insert({
      lomba_id: data.lomba_id,
      tim_a: data.tim_a,
      tim_b: data.tim_b,
      babak: data.babak,
      tanggal: data.tanggal || null,
      jam: data.jam || null,
      lokasi: data.lokasi || null,
      skor_a: data.skor_a ?? null,
      skor_b: data.skor_b ?? null,
      status: data.status,
      sort_order: data.sort_order,
    })
  if (error) { console.error('Error insert pertandingan:', error); throw error }
  return { success: true }
}

export async function updatePertandingan(id: number, data: PertandinganFormValues) {
  const supabase = createClient()
  const { data: updated, error } = await supabase
    .schema('db_kanggotan2')
    .from('pertandingan')
    .update({
      lomba_id: data.lomba_id,
      tim_a: data.tim_a,
      tim_b: data.tim_b,
      babak: data.babak,
      tanggal: data.tanggal || null,
      jam: data.jam || null,
      lokasi: data.lokasi || null,
      skor_a: data.skor_a ?? null,
      skor_b: data.skor_b ?? null,
      status: data.status,
      sort_order: data.sort_order,
    })
    .eq('id', id)
    .select()
  if (error) { console.error('Error update pertandingan:', error); throw error }
  if (!updated || updated.length === 0) {
    throw new Error('Tidak ada pertandingan yang berubah. Cek izin database (RLS) atau ID salah.')
  }
  return { success: true }
}

export async function deletePertandingan(id: number) {
  const supabase = createClient()
  const { error } = await supabase
    .schema('db_kanggotan2')
    .from('pertandingan')
    .delete()
    .eq('id', id)
  if (error) { console.error('Error delete pertandingan:', error); throw error }
  return { success: true }
}

// ── CLIENT-SIDE FETCH HELPERS ──

export async function getKategoriAllClient() {
  const supabase = createClient()
  const { data, error } = await supabase
    .schema('db_kanggotan2')
    .from('kegiatan_kategori')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
  if (error) { console.error('Error:', error); return [] }
  return data || []
}

export async function getKegiatanByYearClient(year: number, kategoriId?: number) {
  const supabase = createClient()
  let query = supabase
    .schema('db_kanggotan2')
    .from('kegiatan')
    .select('*, kegiatan_kategori!inner(name, icon)')
    .eq('year', year)
    .eq('is_published', true)
    .order('date', { ascending: true })
  if (kategoriId) query = query.eq('kategori_id', kategoriId)
  const { data, error } = await query
  if (error) { console.error('Error:', error); return [] }
  return (data || []).map((item) => {
    const row = item as KegiatanWithKategori & { kegiatan_kategori: { name: string; icon: string } }
    return { ...row, kategori_name: row.kegiatan_kategori.name, kategori_icon: row.kegiatan_kategori.icon }
  })
}

export async function getAllLombaPaginatedClient(page = 1, pageSize = 100, kegiatanId?: number) {
  const supabase = createClient()
  const offset = (page - 1) * pageSize
  let query = supabase
    .schema('db_kanggotan2')
    .from('lomba')
    .select('*, kegiatan(title)', { count: 'exact' })
    .order('sort_order', { ascending: true })
  if (kegiatanId) query = query.eq('kegiatan_id', kegiatanId)
  const { data, error, count } = await query.range(offset, offset + pageSize - 1)
  if (error) { console.error('Error:', error); return { data: [], total: 0 } }
  return { data: data || [], total: count || 0 }
}

export async function getAllKegiatanPaginatedClient(
  page = 1, pageSize = 100, year?: number, kategoriId?: number
) {
  const supabase = createClient()
  const offset = (page - 1) * pageSize
  let query = supabase
    .schema('db_kanggotan2')
    .from('kegiatan')
    .select('*, kegiatan_kategori(name, icon)', { count: 'exact' })
    .order('date', { ascending: false })
  if (year) query = query.eq('year', year)
  if (kategoriId) query = query.eq('kategori_id', kategoriId)
  const { data, error, count } = await query.range(offset, offset + pageSize - 1)
  if (error) { console.error('Error:', error); return { data: [], total: 0 } }
  return {
    data: (data || []).map((item) => {
      const row = item as KegiatanWithKategori & { kegiatan_kategori: { name: string } }
      return { ...row, kategori_name: row.kegiatan_kategori.name }
    }),
    total: count || 0,
  }
}

export async function getAllPertandinganPaginatedClient(page = 1, pageSize = 100, lombaId?: number) {
  const supabase = createClient()
  const offset = (page - 1) * pageSize
  let query = supabase
    .schema('db_kanggotan2')
    .from('pertandingan')
    .select('*, lomba(nama)', { count: 'exact' })
    .order('sort_order', { ascending: true })
  if (lombaId) query = query.eq('lomba_id', lombaId)
  const { data, error, count } = await query.range(offset, offset + pageSize - 1)
  if (error) { console.error('Error:', error); return { data: [], total: 0 } }
  return { data: data || [], total: count || 0 }
}

export async function getArwahsCount(year: number) {
  const supabase = createClient()

  const { count, error } = await supabase
    .schema('db_kanggotan2')
    .from('arwahs')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', `${year}-01-01`)
    .lt('created_at', `${year + 1}-01-01`)

  if (error) {
    console.error('Error counting arwahs:', error)
    throw error
  }

  return count
}

// ── SPONSOR CRUD ──

export async function getSponsorsByYearKategoriClient(year: number, kategoriId: number): Promise<Sponsor[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .schema('db_kanggotan2')
    .from('sponsor')
    .select('*')
    .eq('year', year)
    .eq('kategori_id', kategoriId)
    .order('id', { ascending: true })

  if (error) {
    console.error('Error fetching sponsors client:', error)
    throw error
  }
  return data || []
}

export async function insertSponsor(data: SponsorFormValues) {
  const supabase = createClient()
  const { error } = await supabase
    .schema('db_kanggotan2')
    .from('sponsor')
    .insert({
      year: data.year,
      kategori_id: data.kategori_id,
      nama: data.nama,
      logo_url: data.logo_url || null,
      phone: data.phone || null,
      links: data.links || [],
      photos: data.photos || [],
      deskripsi: data.deskripsi || null,
    })
  if (error) { console.error('Error insert sponsor:', error); throw error }
  return { success: true }
}

export async function updateSponsor(id: number, data: Partial<SponsorFormValues>) {
  const supabase = createClient()
  const { error } = await supabase
    .schema('db_kanggotan2')
    .from('sponsor')
    .update({
      nama: data.nama,
      logo_url: data.logo_url,
      phone: data.phone,
      links: data.links,
      photos: data.photos,
      deskripsi: data.deskripsi,
    })
    .eq('id', id)
  if (error) { console.error('Error update sponsor:', error); throw error }
  return { success: true }
}

export async function deleteSponsor(sponsor: Sponsor) {
  const supabase = createClient()
  await deleteSponsorStorageFiles([sponsor.logo_url, ...sponsor.photos])
  const { error } = await supabase
    .schema('db_kanggotan2')
    .from('sponsor')
    .delete()
    .eq('id', sponsor.id)
  if (error) { console.error('Error delete sponsor:', error); throw error }
  return { success: true }
}

export async function deleteSponsorStorageFiles(urls: (string | null)[]) {
  const supabase = createClient()
  const names = urls
    .filter((url): url is string => !!url)
    .map((url) => url.split("/object/public/sponsors/")[1]?.split("/")[0])
    .filter((name): name is string => !!name)

  if (names.length === 0) return
  const { error } = await supabase.storage.from("sponsors").remove(names)
  if (error) console.error('Error deleting sponsor files:', error)
}

export async function uploadSponsorFile(file: File) {
  const supabase = createClient()
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
  const filePath = `${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('sponsors')
    .upload(filePath, file)

  if (uploadError) {
    console.error('Error uploading logo:', uploadError)
    throw uploadError
  }

  const { data } = supabase.storage.from('sponsors').getPublicUrl(filePath)
  return data.publicUrl
}
