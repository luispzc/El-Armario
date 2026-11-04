import {useEffect,useMemo,useState} from 'react';
import {Shirt} from 'lucide-react';
import {imageSources,imageSrcSet,CARD_IMAGE_SIZES,DETAIL_IMAGE_SIZES,ZOOM_IMAGE_SIZES} from './catalog';
export default function Photo({url, alt, eager=false, detail=false, zoom=false, priority='auto', onLoad}) {
 const sources=useMemo(()=>imageSources(url, detail ? (zoom ? 1600 : 960) : 480),[url,detail,zoom]);
 const [attempt,setAttempt]=useState(0);
 useEffect(()=>setAttempt(0),[url]);
 const sizes=detail ? (zoom ? ZOOM_IMAGE_SIZES : DETAIL_IMAGE_SIZES) : CARD_IMAGE_SIZES;
 return sources[attempt] ? <img src={sources[attempt]} srcSet={imageSrcSet(url,attempt,zoom ? 1600 : 960)} sizes={sizes} alt={alt} draggable={false} loading={eager?'eager':'lazy'} fetchPriority={priority} decoding="async" referrerPolicy="no-referrer" onLoad={onLoad} onError={()=>setAttempt(n=>n+1)}/> : <div className="photo-placeholder"><Shirt size={44}/><span>Foto no disponible</span></div>;
}
