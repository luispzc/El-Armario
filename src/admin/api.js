export class ApiError extends Error {constructor(message,status){super(message);this.status=status;}}
export async function adminRequest(path,options={}) {
 const {body,...rest}=options;
 const form=body instanceof FormData;
 const response=await fetch('/api/admin'+path,{credentials:'same-origin',...rest,headers:{'X-Admin-Request':'1',...(!form&&body?{'Content-Type':'application/json'}:{}),...rest.headers},body:body?(form?body:JSON.stringify(body)):undefined});
 if(!response.headers.get('Content-Type')?.includes('application/json'))throw new ApiError('No se pudo conectar el panel con la API. Revisa el despliegue y la configuración del Worker del frontend.',response.status);
 let payload;try{payload=await response.json();}catch{throw new ApiError('La API devolvió datos incompletos. Vuelve a intentarlo.',response.status);}
 if(!response.ok)throw new ApiError(payload.error||'No se pudo completar la operación.',response.status);
 return payload;
}
export async function preparePhoto(file) {
 if(!['image/jpeg','image/png','image/webp'].includes(file.type))throw new Error('Elige una foto JPG, PNG o WebP.');
 if(file.size>20*1024*1024)throw new Error('La foto no debe superar 20 MB.');
 let bitmap;try{bitmap=await createImageBitmap(file);}catch{throw new Error('No pudimos abrir esa imagen. Prueba con una foto JPG, PNG o WebP.');}
 try {
 if(bitmap.width*bitmap.height>30000000)throw new Error('La imagen es demasiado grande. Usa una versión de hasta 30 megapíxeles.');
 const form=new FormData();
 for(const width of [240,480,960,1600]){
 const scale=Math.min(1,width/bitmap.width);const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));
 canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height);
 const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/webp',0.84));
 canvas.width=1;canvas.height=1;
 if(!blob||blob.type!=='image/webp')throw new Error('Tu navegador no admite preparar esta imagen. Prueba con una versión reciente de Chrome, Edge o Safari.');
 form.append(String(width),blob,width+'.webp');
 }
 return form;
 }finally{bitmap.close();}
}
