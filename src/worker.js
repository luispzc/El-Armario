// Mantiene el panel y su cookie HttpOnly bajo el mismo dominio del frontend.
export default {
 async fetch(request,env) {
 const url=new URL(request.url);
 if(!url.pathname.startsWith('/api/'))return env.ASSETS.fetch(request);
 const unsafe=!['GET','HEAD','OPTIONS'].includes(request.method);
 const origin=request.headers.get('Origin');
 if(url.pathname.startsWith('/api/admin/')&&unsafe&&origin!==url.origin)return new Response(JSON.stringify({error:'Origen no permitido'}),{status:403,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});
 const upstream=new URL(env.API_ORIGIN||'https://el-armario-api.lezmarucrack.workers.dev');
 if(upstream.protocol!=='https:'&&!['localhost','127.0.0.1'].includes(upstream.hostname))return new Response('API no configurada',{status:503});
 upstream.pathname=url.pathname;upstream.search=url.search;
 const headers=new Headers(request.headers);headers.delete('Host');headers.set('Origin',origin||url.origin);
 try {
 const response=await fetch(upstream,{method:request.method,headers,body:['GET','HEAD'].includes(request.method)?undefined:request.body,redirect:'manual'});
 const outgoing=new Headers(response.headers);
 outgoing.delete('Access-Control-Allow-Origin');outgoing.delete('Access-Control-Allow-Credentials');
 return new Response(response.body,{status:response.status,headers:outgoing});
 }catch{return new Response(JSON.stringify({error:'No se pudo conectar con el servidor. Intenta nuevamente.'}),{status:502,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});}
 }
};
