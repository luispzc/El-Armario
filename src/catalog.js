import Papa from 'papaparse';
export const normalize = (s = '') => String(s).trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
export function normalizeProducts(rows) {
 const seen = new Set();
 return rows.flatMap(row => {
 const code = String(row.codigo || '').trim(), name = String(row.nombre || '').trim();
 const rawPrice = String(row.precio ?? '').trim().replace(',', '.');
 const price = Number(rawPrice);
 if (!code || !name || !rawPrice || !Number.isFinite(price) || price < 0 || seen.has(code)) return [];
 seen.add(code);
 const size = String(row.talla || '').trim();
 const photos = [row.foto1, row.foto2, row.foto3].filter(v => typeof v === 'string' && v.trim()).map(v => v.trim());
 const ai = String(row.foto_ia || '').trim();
 return [{ code, name, price, size, filterSize: size.match(/\(([^)]+)\)/)?.[1].trim() || size, type: String(row.tipo || '').trim(), gender: normalize(row.genero), description: String(row.descripcion || '').trim(), sold: ['si','true','1'].includes(normalize(row.vendido)), photos: [...(ai ? [{url:ai, ai:true}] : []), ...photos.map(url => ({url, ai:false}))] }];
 });
}
export function parseCatalog(csv) {
 const result = Papa.parse(csv, {header:true, skipEmptyLines:'greedy', transformHeader:h=>h.trim().replace(/^\uFEFF/,'')});
 if (!['codigo','nombre','precio'].every(h=>result.meta.fields?.includes(h))) throw new Error('Formato de catálogo no válido.');
 if (result.errors.length) throw new Error('El archivo del catálogo contiene filas incompletas.');
 return result.data;
}
export function imageSources(url) {
 if (!url) return [];
 try { const parsed = new URL(url); if (parsed.protocol !== 'https:') return [];
 if (['drive.google.com','docs.google.com'].includes(parsed.hostname)) { const id = parsed.pathname.match(/\/d\/([\w-]+)/)?.[1] || parsed.searchParams.get('id'); return id && /^[\w-]+$/.test(id) ? ['https://lh3.googleusercontent.com/d/'+id+'=w1000', 'https://drive.google.com/thumbnail?id='+id+'&sz=w1000'] : []; }
 return [parsed.href]; } catch { return []; }
}
export function filterProducts(products, {query='',gender='',type='',size='',available=false,sort='default'}) {
 const q=normalize(query);
 const result=products.filter(p=>(!q || normalize(p.name+' '+p.code+' '+p.type).includes(q)) && (!gender || p.gender===gender) && (!type || p.type===type) && (!size || p.filterSize===size) && (!available || !p.sold));
 if(sort==='price-asc')result.sort((a,b)=>a.price-b.price); if(sort==='price-desc')result.sort((a,b)=>b.price-a.price); if(sort==='name')result.sort((a,b)=>a.name.localeCompare(b.name,'es'));
 return result;
}
