// lib/supabase/queries-server.ts
import { createClient } from '@/lib/supabase/server'
import type { KegiatanKategori, Kegiatan, KegiatanWithKategori, Lomba, Pertandingan } from '@/types/kegiatan'
export type SenderWithArwahs = {
  id: number
  sender: string
  address: string
  arwahs: Array<{
    id: number
    name: string
    address: string
  }>
}

export type PaginatedResponse = {
  data: SenderWithArwahs[]
  total: number
  page_size: number
  current_offset: number
}

export async function getSendersWithArwahs(
  YEAR: number,
  PAGE: number = 1,
  PAGESIZE: number = 10,
  SEARCH: string = ""
): Promise<PaginatedResponse> {
  
  const supabase = await createClient()
  const OFFSET = (PAGE - 1) * PAGESIZE
  
  const { data, error } = await supabase
    .rpc('get_senders_with_arwahs', {
      target_year: YEAR,
      page_limit: PAGESIZE,
      page_offset: OFFSET,
      search_term: SEARCH
    })

  if (error) {
    console.error('Error fetching paginated senders:', error)
    return {
      data: [],
      total: 0,
      page_size: PAGESIZE,
      current_offset: OFFSET
    }
  }

  return data
}

// ── KEGIATAN QUERIES ──

export async function getKategoriAll(): Promise<KegiatanKategori[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .schema('db_kanggotan2').from('kegiatan_kategori')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching kategori:', error)
    return []
  }

  return data || []
}

export async function getKegiatanByYear(
  year: number,
  kategoriId?: number
): Promise<KegiatanWithKategori[]> {
  const supabase = await createClient()

  let query = supabase
    .schema('db_kanggotan2').from('kegiatan')
    .select(`
      *,
      kegiatan_kategori!inner(name, icon)
    `)
    .eq('year', year)
    .eq('is_published', true)
    .order('date', { ascending: true })

  if (kategoriId) {
    query = query.eq('kategori_id', kategoriId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching kegiatan:', error)
    return []
  }

  return (data || []).map((item) => ({
    ...item,
    kategori_name: (item as unknown as { kegiatan_kategori: { name: string; icon: string } }).kegiatan_kategori.name,
    kategori_icon: (item as unknown as { kegiatan_kategori: { name: string; icon: string } }).kegiatan_kategori.icon,
  }))
}

export async function getKegiatanTerbaru(limit: number = 3): Promise<KegiatanWithKategori[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .schema('db_kanggotan2').from('kegiatan')
    .select(`
      *,
      kegiatan_kategori!inner(name, icon)
    `)
    .eq('is_published', true)
    .gte('date', new Date().toISOString().split('T')[0])
    .order('date', { ascending: true })
    .limit(limit)

  if (error) {
    console.error('Error fetching kegiatan terbaru:', error)
    return []
  }

  return (data || []).map((item) => ({
    ...item,
    kategori_name: (item as unknown as { kegiatan_kategori: { name: string; icon: string } }).kegiatan_kategori.name,
    kategori_icon: (item as unknown as { kegiatan_kategori: { name: string; icon: string } }).kegiatan_kategori.icon,
  }))
}

export async function getLombaByKegiatanId(kegiatanId: number): Promise<Lomba[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .schema('db_kanggotan2').from('lomba')
    .select('*')
    .eq('kegiatan_id', kegiatanId)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching lomba:', error)
    return []
  }

  return data || []
}

export async function getPertandinganByLombaId(lombaId: number): Promise<Pertandingan[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .schema('db_kanggotan2').from('pertandingan')
    .select('*')
    .eq('lomba_id', lombaId)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching pertandingan:', error)
    return []
  }

  return data || []
}

export async function getKegiatanWithLombaByYear(year: number) {
  const kegiatanList = await getKegiatanByYear(year)
  const kegiatanWithLomba = await Promise.all(
    kegiatanList.map(async (kegiatan) => {
      const lomba = await getLombaByKegiatanId(kegiatan.id)
      const lombaWithPertandingan = await Promise.all(
        lomba.map(async (l) => {
          const pertandingan = l.has_pertandingan
            ? await getPertandinganByLombaId(l.id)
            : []
          return { ...l, pertandingan }
        })
      )
      return { ...kegiatan, lomba: lombaWithPertandingan }
    })
  )
  return kegiatanWithLomba
}

// ── DASHBOARD QUERIES ──

export async function getAllKegiatanPaginated(
  page: number = 1,
  pageSize: number = 20,
  year?: number,
  kategoriId?: number
) {
  const supabase = await createClient()
  const offset = (page - 1) * pageSize

  let query = supabase
    .schema('db_kanggotan2').from('kegiatan')
    .select(`
      *,
      kegiatan_kategori(name, icon)
    `, { count: 'exact' })
    .order('date', { ascending: false })

  if (year) query = query.eq('year', year)
  if (kategoriId) query = query.eq('kategori_id', kategoriId)

  const { data, error, count } = await query.range(offset, offset + pageSize - 1)

  if (error) {
    console.error('Error fetching all kegiatan:', error)
    return { data: [], total: 0 }
  }

  return {
    data: (data || []).map((item) => ({
      ...item,
      kategori_name: (item as unknown as { kegiatan_kategori: { name: string } }).kegiatan_kategori.name,
    })),
    total: count || 0,
  }
}

export async function getAllLombaPaginated(
  page: number = 1,
  pageSize: number = 20,
  kegiatanId?: number
) {
  const supabase = await createClient()
  const offset = (page - 1) * pageSize

  let query = supabase
    .schema('db_kanggotan2').from('lomba')
    .select('*, kegiatan(title)', { count: 'exact' })
    .order('sort_order', { ascending: true })

  if (kegiatanId) query = query.eq('kegiatan_id', kegiatanId)

  const { data, error, count } = await query.range(offset, offset + pageSize - 1)

  if (error) {
    console.error('Error fetching all lomba:', error)
    return { data: [], total: 0 }
  }

  return { data: data || [], total: count || 0 }
}

export async function getAllPertandinganPaginated(
  page: number = 1,
  pageSize: number = 20,
  lombaId?: number
) {
  const supabase = await createClient()
  const offset = (page - 1) * pageSize

  let query = supabase
    .schema('db_kanggotan2').from('pertandingan')
    .select('*, lomba(nama)', { count: 'exact' })
    .order('sort_order', { ascending: true })

  if (lombaId) query = query.eq('lomba_id', lombaId)

  const { data, error, count } = await query.range(offset, offset + pageSize - 1)

  if (error) {
    console.error('Error fetching all pertandingan:', error)
    return { data: [], total: 0 }
  }

  return { data: data || [], total: count || 0 }
}

