import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  ToggleButtonGroup,
  ToggleButton,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material'
import Axios from 'axios'
import { styled } from '@mui/material/styles'
import FondoAnimado from '../Components/FondoAnimado.tsx'
import NavBar from '../Components/NavBar.tsx'
import CustomToolbar from '../Components/CustomToolbar.tsx'

const drawerWidth = 240

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}))

interface Sale {
  id_venta: number
  fecha_venta: string
  empleado: string
  total_venta: number | string
}

interface Product {
  id_producto: number
  nombre_producto: string
  cantidad: number
  precio_unitario: string
  total: string
}

export default function SalesReport() {
  const [open, setOpen] = useState(true)
  const [sales, setSales] = useState<Sale[]>([])
  const [venta, setVenta] = useState<Sale>()
  const [selectedSale, setSelectedSale] = useState<{ productos: Product[]; fecha_venta: string; total_venta: number; empleado: string } | null>(null)
  const [timeFilter, setTimeFilter] = useState<string | null>('day')
  const [openDialog, setOpenDialog] = useState(false)

  useEffect(() => {
    fetch('http://localhost:3002/obtenerVentas')
      .then((response) => response.json())
      .then((data) => setSales(data))
      .catch((error) => console.error('Error al obtener las ventas:', error))
  }, [])

  const toggleDrawer = () => {
    setOpen(!open)
  }

  const handleTimeFilterChange = (event: React.MouseEvent<HTMLElement>, newFilter: string | null) => {
    if (newFilter !== null) {
      setTimeFilter(newFilter)
    }
  }

  const handleRowClick = (sale: Sale) => {
    Axios.get("http://localhost:3002/obtenerDetalleDeVenta", {
      params: { id: sale.id_venta },
    })
      .then((response) => {
        setVenta(sale)
        setSelectedSale(response.data) // Datos de la venta seleccionada
        setOpenDialog(true) // Abre el diálogo
      })
      .catch((error) => {
        alert("Ocurrió un error al obtener los detalles de la venta.")
      })
  }

  const handleCloseDialog = () => {
    setSelectedSale(null)
    setOpenDialog(false)
  }

  const filterSales = (sales: Sale[], filter: string | null): Sale[] => {
    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)

    return sales.filter((sale) => {
      const saleDate = new Date(sale.fecha_venta)
      saleDate.setHours(0, 0, 0, 0)

      switch (filter) {
        case 'day':
          return saleDate.getTime() === currentDate.getTime()
        case 'week':
          const weekAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000)
          return saleDate >= weekAgo && saleDate <= currentDate
        case 'month':
          return saleDate.getMonth() === currentDate.getMonth() && saleDate.getFullYear() === currentDate.getFullYear()
        case 'year':
          return saleDate.getFullYear() === currentDate.getFullYear()
        default:
          return true
      }
    })
  }

  const filteredSales = filterSales(sales, timeFilter)

  // Calcular el total general
  const totalGenerated = filteredSales.reduce((sum, sale) => {
    const totalVenta = typeof sale.total_venta === 'number' ? sale.total_venta : parseFloat(sale.total_venta || '0') || 0
    return sum + totalVenta
  }, 0)

  const totalGeneratedFormatted = Number.isFinite(totalGenerated) ? totalGenerated.toFixed(2) : '0.00'

  const periodName = {
    day: 'Hoy',
    week: 'Semana',
    month: 'Mes',
    year: 'Año',
  }[timeFilter || 'day']

  return (
    <FondoAnimado>
      <NavBar toggleDrawer={toggleDrawer} />
      <CustomToolbar open={open} selectedItem={'/reports'} setSelectedItem={() => {}} />
      <Main open={open}>
        <Toolbar />
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 4, backgroundColor: 'white', minHeight: '68vh', width: '90%' }}>
            <Box sx={{ mb: 3 }}>
              <ToggleButtonGroup value={timeFilter} exclusive onChange={handleTimeFilterChange} aria-label="filtro de tiempo">
                <ToggleButton value="day" aria-label="día">Día</ToggleButton>
                <ToggleButton value="week" aria-label="semana">Semana</ToggleButton>
                <ToggleButton value="month" aria-label="mes">Mes</ToggleButton>
                <ToggleButton value="year" aria-label="año">Año</ToggleButton>
              </ToggleButtonGroup>
            </Box>
            <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>
              Total General ({periodName}): ${totalGeneratedFormatted}
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Empleado</TableCell>
                    <TableCell>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredSales.map((sale) => (
                    <TableRow key={sale.id_venta} hover onClick={() => handleRowClick(sale)} sx={{ cursor: 'pointer' }}>
                      <TableCell>{sale.id_venta}</TableCell>
                      <TableCell>{sale.fecha_venta}</TableCell>
                      <TableCell>{sale.empleado}</TableCell>
                      <TableCell>${(typeof sale.total_venta === 'number' ? sale.total_venta : parseFloat(sale.total_venta || '0') || 0).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </Main>

      {selectedSale && (
        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
          <DialogTitle>Detalles de la Venta</DialogTitle>
          <DialogContent>
            <Typography variant="h6">Empleado: {venta.empleado}</Typography>
            <Typography variant="h6">Fecha: {venta.fecha_venta}</Typography>
            <Typography variant="h6">
              Total: ${parseFloat(venta.total_venta?.toString() || '0').toFixed(2)}
            </Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>Productos:</Typography>
            {selectedSale.productos && Array.isArray(selectedSale.productos) && selectedSale.productos.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Producto</TableCell>
                      <TableCell>Cantidad</TableCell>
                      <TableCell>Precio Unitario</TableCell>
                      <TableCell>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedSale.productos.map((product) => (
                      <TableRow key={product.id_producto}>
                        <TableCell>{product.nombre_producto}</TableCell>
                        <TableCell>{product.cantidad}</TableCell>
                        <TableCell>${parseFloat(product.precio_unitario).toFixed(2)}</TableCell>
                        <TableCell>${parseFloat(product.total).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography>No se han encontrado productos para esta venta.</Typography>
            )}
          </DialogContent>
        </Dialog>
      )}
    </FondoAnimado>
  )
}
