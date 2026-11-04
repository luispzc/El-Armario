import {useEffect,useRef,useState} from 'react';
import {ZoomIn,ZoomOut} from 'lucide-react';
import {IMAGE_ZOOM,panLimits,clampPan} from './image-pan';
export default function ImageViewer({zoom,onZoomChange,children}) {
 const stage=useRef(null),drag=useRef(null),position=useRef({x:0,y:0});
 const [pan,setPan]=useState(position.current),[dragging,setDragging]=useState(false);
 const limits=()=>{
  const element=stage.current,image=element?.querySelector('img');
  return panLimits(element?.clientWidth,element?.clientHeight,image?.naturalWidth,image?.naturalHeight);
 };
 const move=point=>{const next=clampPan(point,limits());position.current=next;setPan(next);};
 useEffect(()=>{
  if(!zoom){position.current={x:0,y:0};setPan(position.current);drag.current=null;setDragging(false);}
  const element=stage.current;
  const observer=new ResizeObserver(()=>move(position.current));observer.observe(element);
  return ()=>observer.disconnect();
 },[zoom]);
 const toggle=()=>{move({x:0,y:0});onZoomChange(!zoom);};
 const finish=e=>{
  if(drag.current?.id!==e.pointerId)return;
  if(stage.current.hasPointerCapture(e.pointerId))stage.current.releasePointerCapture(e.pointerId);
  setDragging(false);
 };
 return <div ref={stage} className={'detail-photo'+(zoom?' is-zoomed':'')+(dragging?' is-dragging':'')} role="button" tabIndex={0} aria-label={zoom?'Reducir foto':'Ampliar foto'} aria-pressed={zoom} aria-describedby="image-pan-help"
  onDragStart={e=>e.preventDefault()}
  onPointerDown={e=>{
   if(!e.isPrimary || e.button!==0)return;
   drag.current={id:e.pointerId,x:e.clientX,y:e.clientY,pan:position.current,moved:false};
   if(zoom){stage.current.setPointerCapture(e.pointerId);setDragging(true);}
  }}
  onPointerMove={e=>{
   const current=drag.current;if(!zoom||!current||current.id!==e.pointerId||!stage.current.hasPointerCapture(e.pointerId))return;
   const x=e.clientX-current.x,y=e.clientY-current.y;
   if(Math.hypot(x,y)>5)current.moved=true;
   if(current.moved)move({x:current.pan.x+x,y:current.pan.y+y});
  }}
  onPointerUp={finish} onPointerCancel={e=>{if(drag.current)drag.current.moved=true;finish(e);}}
  onLostPointerCapture={()=>setDragging(false)}
  onClick={()=>{if(drag.current?.moved){drag.current=null;return;}toggle();}}
  onKeyDown={e=>{
   if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();return;}
   if(!zoom)return;
   const steps={ArrowLeft:{x:48,y:0},ArrowRight:{x:-48,y:0},ArrowUp:{x:0,y:48},ArrowDown:{x:0,y:-48}};
   if(e.key==='Home'){e.preventDefault();move({x:0,y:0});}
   else if(steps[e.key]){e.preventDefault();const step=steps[e.key];move({x:position.current.x+step.x,y:position.current.y+step.y});}
  }}>
  <div className="pan-image" style={{transform:'translate('+pan.x+'px, '+pan.y+'px) scale('+(zoom?IMAGE_ZOOM:1)+')'}} onLoadCapture={()=>move(position.current)}>{children}</div>
  <span id="image-pan-help" className="sr-only">{zoom?'Arrastra la foto para moverla. También puedes usar las flechas del teclado. Haz clic para reducir.':'Haz clic para ampliar la foto.'}</span>
  <span className="zoom-hint">{zoom?<ZoomOut size={16}/>:<ZoomIn size={16}/>} {zoom?'Reducir':'Ampliar'}</span>
  {zoom&&<span className="pan-hint" aria-hidden="true">Arrastra para mover</span>}
 </div>;
}
