# AutoAndes Web

SPA Angular 22.2, TypeScript estricto, componentes standalone, formularios reactivos y sesión con signals.

## Ejecutar

Requisitos: Node.js compatible con Angular 22 y npm. Backend en http://localhost:8080.

```powershell
npm ci
npx ng serve
```

Abrir http://localhost:4200. También puede usarse `npm start`.
La URL se configura en `src/environments/environment.ts` y `environment.development.ts`; ambos usan el mismo puerto de backend.

## Funciones

- Servicios: buscador, formulario único alta/edición, eliminación y baja/activación confirmadas.
- Vehículos: nombre del cliente, filtro por cliente y lista desplegable obtenida desde el API.
- Órdenes: FormArray con 1 a 10 líneas, cantidades 1 a 5, servicios activos sin repetir, estimado reactivo, 409 sin perder líneas y número devuelto por el backend.
- Consulta: filtros de placa, estado y fechas, detalle y anulación con motivo de 10 a 200 caracteres.
- Reporte de ingresos: datos agregados del backend por intervalo.
- Rutas con carga diferida y permiso en data; authGuard en layout y rutas hijas; invitadoGuard en login; permisoGuard devuelve acceso denegado.
- sessionStorage guarda sesión y expiración; signals actualizan el menú. Expiración automática y cierre manual. Interceptor de token restringido a la URL del API. Un 401 cierra sesión con returnUrl; un 403 conserva la sesión y muestra el mensaje.
- Páginas de acceso denegado y 404. Campos de validación del backend se muestran bajo los controles.
  No hay listas simuladas ni autorización por nombre de rol.

## Verificar

```powershell
npm run build
npm test -- --watch=false
```

Pruebas: arranque sin plantilla de bienvenida, sesión corrupta/vencida, expiración automática y tratamiento distinto de 401 y 403. La integración real se verifica también con el script del repositorio backend.
Para comprobar un token alterado: iniciar sesión, abrir DevTools > Application > Session Storage, modificar token en `autoandes.sesion` y recargar una ruta con datos; la siguiente llamada devuelve 401 y redirige al login con returnUrl.

## Usuarios de prueba

Contraseña de los cuatro usuarios: `Auto2026*`.

- `admin`: ADMIN, todos los permisos.
- `asesor`: ASESOR, consulta y registra vehículos y órdenes; no anula ni ve reportes.
- `jefe`: JEFE_TALLER, mantiene servicios, anula órdenes y consulta reportes; no registra órdenes ni modifica vehículos.
- `inactivo`: ASESOR inactivo, login rechazado con 401.

## Contrato del API

Base: `http://localhost:8080/api/v1`. Solo el login es público; usar `Authorization: Bearer <token>`.

- `POST /auth/login`: username, password; devuelve token, tipo, expiraEnSegundos, nombreCompleto, roles, permisos.
- `GET /auth/me`: usuario autenticado y permisos.
- `GET /clientes`: VEHICULO_LEER.
- `GET /servicios`, `GET /servicios/{id}`: SERVICIO_LEER.
- `POST /servicios`, `PUT /servicios/{id}`, `DELETE /servicios/{id}`, `PATCH /servicios/{id}/estado`: SERVICIO_ESCRIBIR.
- `GET /vehiculos?clienteId`, `GET /vehiculos/{id}`: VEHICULO_LEER.
- `POST /vehiculos`, `PUT /vehiculos/{id}`, `DELETE /vehiculos/{id}`: VEHICULO_ESCRIBIR.
- `POST /ordenes`: ORDEN_REGISTRAR; vehiculoId, kilometraje, detalles [{servicioId,cantidad}]. No acepta precios ni total del cliente.
- `GET /ordenes?placa&estado&desde&hasta`, `GET /ordenes/{id}`: ORDEN_LEER.
- `PATCH /ordenes/{id}/anular`: ORDEN_ANULAR; {motivo}.
- `GET /reportes/ingresos-por-servicio?desde&hasta`: REPORTE_VER.
  Fechas `desde` y `hasta`: `YYYY-MM-DD`, límites inclusivos por día.
  Altas: 201; consultas/ediciones: 200; eliminación: 204. Errores: 400 validación, 401 autenticación, 403 permiso, 404 inexistente, 409 regla de negocio. Formato común: timestamp ISO, status, error, mensaje, ruta; campos solo en validación.

## Entrega y trazabilidad

Trabajo en `examen-a-altamirano`, integrado en `develop` y `main`; etiqueta `v1.0-examen-u2`.
Las capturas documentan ejecución real. La demostración individual y la explicación del código corresponden al estudiante; revisar la guía de defensa antes de presentar.
