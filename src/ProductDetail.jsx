import {useEffect,useRef,useState} from 'react';
import {ArrowUpRight,ChevronLeft,ChevronRight,MessageCircle,MapPin,X,ArrowLeft} from 'lucide-react';
import ImageViewer from './ImageViewer';
import Photo from './Photo';
import {config,whatsappLink} from './config';
import {imageSources,imageSrcSet,DETAIL_IMAGE_SIZES} from './catalog';
import './product-detail.css';
const money=value=>'Bs '+new Intl.NumberFormat('es-BO',{maximumFractionDigits:2}).format(value);
export default function ProductDetail({product:p,onClose}) {
 const [index,setIndex]=useState(0),[payment,setPayment]=useState(false),[zoom,setZoom]=useState(false),[closing,setClosing]=useState(false),[loadedPhoto,setLoadedPhoto]=useState(null);
 const dialog=useRef(null),closeTimer=useRef(null),buyButton=useRef(null),paymentTitle=useRef(null),latestClose=useRef(onClose);
 latestClose.current=onClose;
 const photo=p.photos[index];
 const expired=!/^\d{4}-\d{2}-\d{2}$/.test(config.qrExpiration)||new Date()>new Date(config.qrExpiration+'T23:59:59-04:00');
 const message='Hola, quiero consultar por '+p.name+' (código '+p.code+', talla '+p.size+') — '+money(p.price)+'.';
 useEffect(()=>{
  const element=dialog.current,previous=document.activeElement,before=document.body.style.overflow;
  element.showModal();document.body.style.overflow='hidden';
  return ()=>{clearTimeout(closeTimer.current);element.close();document.body.style.overflow=before;previous?.focus({preventScroll:true});};
 },[]);
 useEffect(()=>{
  if(!payment)return;
  const frame=requestAnimationFrame(()=>paymentTitle.current?.focus({preventScroll:true}));
  return ()=>cancelAnimationFrame(frame);
 },[payment]);
 useEffect(()=>{
  const next=p.photos[index+1]?.url,connection=navigator.connection;
  if(payment||loadedPhoto!==photo?.url||!next||connection?.saveData||/(^|-)2g$/.test(connection?.effectiveType||''))return;
  const warm=()=>{const image=new Image();image.referrerPolicy='no-referrer';image.fetchPriority='low';image.sizes=DETAIL_IMAGE_SIZES;image.srcset=imageSrcSet(next)||'';image.src=imageSources(next,960)[0]||'';};
  if(window.requestIdleCallback){const idle=window.requestIdleCallback(warm,{timeout:1500});return ()=>window.cancelIdleCallback(idle);}
  const timer=setTimeout(warm,600);return ()=>clearTimeout(timer);
 },[index,p,photo?.url,loadedPhoto,payment]);
 const close=()=>{
  if(closing)return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){latestClose.current();return;}
  setClosing(true);closeTimer.current=setTimeout(()=>latestClose.current(),180);
 };
 const beginPayment=()=>{setZoom(false);setPayment(true);};
 const back=()=>{setPayment(false);requestAnimationFrame(()=>buyButton.current?.focus({preventScroll:true}));};
 return <dialog ref={dialog} className={'product-dialog'+(payment?' is-payment':'')+(closing?' is-closing':'')} aria-label={p.name} onCancel={event=>{event.preventDefault();close();}} onClick={event=>{if(event.target===dialog.current)close();}}>
  <button className="icon-button close" aria-label="Cerrar" onClick={close}><X/></button>
  <div className="product-scene"><div className="product-flipper">
   <section className="product-face product-front" aria-label="Detalle de la prenda" aria-hidden={payment} inert={payment}>
    <div className="detail-gallery">
     <ImageViewer key={photo?.url||'empty'} zoom={zoom} onZoomChange={setZoom}><Photo key={photo?.url} url={photo?.url} alt={p.name} eager detail zoom={zoom} priority="high" onLoad={()=>setLoadedPhoto(photo?.url)}/></ImageViewer>
     {p.photos.length>1&&<div className="gallery-controls"><button className="icon-button" aria-label="Foto anterior" disabled={index===0} onClick={()=>{setIndex(index-1);setZoom(false);}}><ChevronLeft/></button><span>{index+1} / {p.photos.length}</span><button className="icon-button" aria-label="Foto siguiente" disabled={index===p.photos.length-1} onClick={()=>{setIndex(index+1);setZoom(false);}}><ChevronRight/></button></div>}
    </div>
    <div className="detail-info">
     <div className="detail-copy"><span className="eyebrow">{p.type} · {p.code}</span><h2>{p.name}</h2><p className="detail-price">{money(p.price)}</p><div className="detail-specs"><span>Talla <strong>{p.size||'Consultar'}</strong></span><span>Estado <strong>{p.sold?'Vendido':'Disponible'}</strong></span></div>{p.description&&<p className="description">{p.description}</p>}</div>
     <div className="detail-purchase">{p.sold?<p className="notice">Esta prenda ya encontró un nuevo armario.</p>:<><button ref={buyButton} className="primary full" onClick={beginPayment}>Me la llevo <ArrowUpRight size={18}/></button><a className="secondary full" href={whatsappLink(message)} target="_blank" rel="noreferrer"><MessageCircle size={18}/> Consultar por WhatsApp</a></>}<p className="location"><MapPin size={15}/> La Paz, Bolivia</p></div>
    </div>
   </section>
   <section className="product-face product-back" aria-label="Pago de la prenda" aria-hidden={!payment} inert={!payment}>
    <header className="purchase-summary"><div className="purchase-name"><span className="eyebrow">{p.code}</span><h2 ref={paymentTitle} tabIndex={-1}>{p.name}</h2></div><strong className="purchase-price">{money(p.price)}</strong><div className="purchase-meta"><span>Talla <strong>{p.size||'Consultar'}</strong></span><span className="purchase-status">{p.sold?'Vendido':'Disponible'}</span></div></header>
    <div className={'purchase-body'+(expired?' qr-expired':'')}>
     {!expired&&<div className="purchase-qr"><img src="/qr.png" alt="QR de pago de El Armario" decoding="async"/></div>}
     <div className="purchase-actions"><h3>{expired?'Coordinemos tu compra':'Completa tu compra'}</h3>{expired?<p className="payment-instructions">Escríbenos para confirmar la disponibilidad y coordinar el pago.</p>:<ol className="payment-instructions"><li>Confirma la disponibilidad antes de pagar <strong>{money(p.price)}</strong>.</li><li>Envía tu comprobante por WhatsApp para confirmar la compra.</li></ol>}<a className="primary full" href={whatsappLink(message+(expired?' Quisiera coordinar el pago.':' Te envío mi comprobante para confirmar.'))} target="_blank" rel="noreferrer"><MessageCircle size={18}/>{expired?'Coordinar por WhatsApp':'Enviar comprobante'}</a><button className="payment-back" onClick={back}><ArrowLeft size={15}/> Volver al detalle</button></div>
    </div>
   </section>
  </div></div>
 </dialog>;
}
