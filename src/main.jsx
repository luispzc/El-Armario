import React, {lazy, Suspense} from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';
const AdminApp=lazy(()=>import('./admin/AdminApp.jsx'));
const isAdmin=location.pathname==='/admin'||location.pathname.startsWith('/admin/');
createRoot(document.getElementById('root')).render(<React.StrictMode>{isAdmin?<Suspense fallback={<p className="admin-loading">Abriendo administración…</p>}><AdminApp/></Suspense>:<App/>}</React.StrictMode>);
