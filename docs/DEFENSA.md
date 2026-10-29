# Guía de defensa AutoAndes

1. Recorrido de una orden: OrdenFormComponent → OrdenService HTTP → authInterceptor → JwtAuthenticationFilter → OrdenController (permiso ORDEN_REGISTRAR) → OrdenServicioServiceImpl.registrar (@Transactional) → repositorios → Oracle. La respuesta DTO actualiza el número y total confirmados.
2. Total: el backend recupera cada Servicio y calcula subtotal con BigDecimal; el request no tiene precio ni total. La SPA solo muestra un estimado, porque una petición HTTP se puede manipular.
3. Atomicidad: enviar tres servicios, con SRV-008 inactivo en el tercero. Comparar conteo de cabeceras y detalles antes/después con SQL. ReglaNegocioException es RuntimeException: Spring revierte la transacción. No se guarda ninguna cabecera al rechazar las líneas.
4. Reporte: OrdenServicioRepository.obtenerReporteIngresos usa constructor DTO, SUM, GROUP BY y ORDER BY, con estado distinto de ANULADA y fechas opcionales. Oracle agrega los datos antes de devolverlos.
5. DTO: VehiculoResponseDTO aplana clienteId/clienteNombre. No expone el grafo JPA, ni fuerza serialización de proxies o relaciones recursivas.
6. JWT: sub es el username; iat y exp marcan emisión/expiración. El backend firma con HMAC y valida firma y exp en cada petición. No contiene contraseña. El frontend programa el cierre al vencer; la autoridad definitiva es el backend.
7. Permisos: PermisosPorRol define la matriz, UsuarioDetailsService une las autoridades de todos los roles y los @PreAuthorize verifican hasAuthority. Probar asesor contra reporte o anulación y jefe contra registro: 403.
8. 401 significa sesión ausente/inválida, y errorInterceptor borra la sesión salvo en login. 403 significa sesión válida sin permiso: conserva sesión y muestra el mensaje del API.
9. Authorization se agrega exclusivamente en authInterceptor y solo bajo apiUrl + '/'. Evita duplicación y que el token salga a otros destinos.
10. sessionStorage pertenece a la pestaña y limita la persistencia entre turnos en equipos compartidos. La expiración también se almacena y se valida al recuperar sesión.
11. Ruta manual: entrar como jefe a /ordenes/nueva. authGuard permite la sesión; permisoGuard rechaza ORDEN_REGISTRAR y redirige a acceso-denegado. La API rechaza el POST aun si se evita el guard.
12. Menú: computed de SidebarComponent consulta tienePermiso; la sesión es un signal. Al cambiar de usuario se recalcula sin recargar la página.

Ensayar los pasos con la colección Postman y explicar el código propio. Las capturas y las pruebas automáticas complementan la demostración individual; no sustituyen la defensa.
