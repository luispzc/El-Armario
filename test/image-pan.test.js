import test from 'node:test';
import assert from 'node:assert/strict';
import {panLimits,clampPan} from '../src/image-pan.js';
test('foto vertical: límites según imagen contenida y zoom',()=>{const limits=panLimits(400,500,800,1200);assert.ok(Math.abs(limits.x-216.66666666666666)<0.000001);assert.equal(limits.y,375);});
test('foto muy ancha: no permite desplazar el eje que cabe completo',()=>{assert.deepEqual(panLimits(400,500,1600,200),{x:300,y:0});});
test('evita arrastrar fuera de los bordes en cualquier dirección',()=>{assert.deepEqual(clampPan({x:900,y:-900},{x:150,y:200}),{x:150,y:-200});assert.deepEqual(clampPan({x:20,y:40},{x:150,y:200}),{x:20,y:40});});
test('foto sin cargar y visor vacío: posición centrada',()=>{assert.deepEqual(panLimits(400,500,0,0),{x:0,y:0});});
