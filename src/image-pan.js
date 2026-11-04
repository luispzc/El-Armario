export const IMAGE_ZOOM = 2.5;
export function panLimits(width, height, imageWidth, imageHeight, scale = IMAGE_ZOOM) {
 if (!width || !height || !imageWidth || !imageHeight) return {x:0,y:0};
 const fit = Math.min(width/imageWidth, height/imageHeight);
 return {x:Math.max(0,(imageWidth*fit*scale-width)/2), y:Math.max(0,(imageHeight*fit*scale-height)/2)};
}
export function clampPan(point, limits) {
 return {x:Math.max(-limits.x,Math.min(limits.x,point.x)),y:Math.max(-limits.y,Math.min(limits.y,point.y))};
}
