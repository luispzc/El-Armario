import test from 'node:test';import assert from 'node:assert/strict';import {normalizeProducts,filterProducts,parseCatalog,imageSources,imageSrcSet} from '../src/catalog.js';
test('CSV: comas, saltos de línea y campos entre comillas',()=>{const rows=parseCatalog('codigo,nombre,precio\nA,"Vestido, floral",100');assert.equal(rows[0].nombre,'Vestido, floral');assert.throws(()=>parseCatalog('<html>Login</html>'));});
test('valida precios, duplicados, vendido con tilde y tallas agrupadas',()=>{const rows=normalizeProducts([{codigo:'A',nombre:'Prenda',precio:'50,5',talla:'6P (S/M)',vendido:'Sí',genero:'Varón'},{codigo:'A',nombre:'Duplicado',precio:5},{codigo:'B',nombre:'Sin precio',precio:''},{codigo:'C',nombre:'Inválido',precio:'-1'}]);assert.equal(rows.length,1);assert.equal(rows[0].price,50.5);assert.equal(rows[0].sold,true);assert.equal(rows[0].filterSize,'S/M');assert.equal(rows[0].gender,'varon');});
test('filtros combinados y orden sin mutar catálogo',()=>{const rows=normalizeProducts([{codigo:'A',nombre:'Pantalón',precio:100,talla:'M',genero:'dama'},{codigo:'B',nombre:'Blusa',precio:20,talla:'M',genero:'dama',vendido:'si'}]);assert.equal(filterProducts(rows,{query:'pantalon',size:'M',available:true})[0].code,'A');assert.equal(filterProducts(rows,{sort:'price-asc'})[0].code,'B');assert.equal(rows[0].code,'A');});
test('fotos: Drive, respaldo y rechazo de protocolos inseguros',()=>{assert.equal(imageSources('https://drive.google.com/file/d/abc_123/view').length,2);assert.deepEqual(imageSources('javascript:alert(1)'),[]);assert.deepEqual(imageSources('https://evil.example/d/123'),['https://evil.example/d/123']);});

test('imágenes adaptables: tamaños, respaldo y URLs externas',()=>{
 const url='https://drive.google.com/file/d/abc_123/view';
 assert.match(imageSources(url,480)[0],/=w480$/);
 assert.match(imageSources(url,480)[1],/sz=w480$/);
 const card=imageSrcSet(url);
 assert.match(card,/w240 240w/);assert.match(card,/w960 960w/);assert.ok(!card.includes('1600w'));
 assert.match(imageSrcSet(url,1),/drive.google.com\/thumbnail/);
 assert.match(imageSrcSet(url,0,1600),/w1600 1600w/);
 assert.equal(imageSrcSet('https://example.com/photo.jpg'),undefined);
 assert.equal(imageSrcSet('javascript:alert(1)'),undefined);
 assert.match(imageSources(url,99999)[0],/=w1600$/);
});
