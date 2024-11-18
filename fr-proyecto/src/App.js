import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login.tsx';
import ProcesoVenta from './Pages/proceso-venta.tsx';
import ListaProductos from './Pages/ListaProductos.tsx';
import ListaEmpleados from './Pages/ListaEmpleados.tsx';
import ReporteVentas from './Pages/ReportesVentas.tsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/procesoventa" element={<ProcesoVenta />} />
        <Route path="/productos" element={<ListaProductos />} />
        <Route path="/empleados" element={<ListaEmpleados />} />
        <Route path="/reportes" element={<ReporteVentas />} />
      </Routes>
    </Router>
  );
}

export default App;
