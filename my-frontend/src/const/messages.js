// General messages
export const ERROR_MSG_INTERNET = 'verifique su conexión a internet';
// Passenger registration form
export const ERROR_MSG_EMPTY_DATE = '* Ingrese una fecha';
export const ERROR_MSG_EMPTY_EMAIL = '* Ingrese un correo electrónico';
export const ERROR_MSG_EMPTY_NAME = '* Ingrese un nombre';
export const ERROR_MSG_EMPTY_PASSWORD = '* Ingrese una contraseña';
export const ERROR_MSG_EMPTY_REPEAT_PASSWORD = '* Ingrese la contraseña nuevamente';
export const ERROR_MSG_EMPTY_SURNAME = '* Ingrese un apellido';
export const ERROR_MSG_INVALID_AGE = '* Debe ser mayor de 18 años';
export const ERROR_MSG_INVALID_DATE = '* La fecha ingresada en inválida';
export const ERROR_MSG_INVALID_EMAIL = '* El correo electrónico posee un formato inválido';
export const ERROR_MSG_INVALID_NAME = '* El nombre debe poseer solo caracteres alfabéticos';
export const ERROR_MSG_INVALID_PASSWORD_NO_CAPITAL_LETTERS = '* La contraseña no posee letras mayúsculas';
export const ERROR_MSG_INVALID_PASSWORD_NO_LOWER_CASE = '* La contraseña no posee letras minúsculas';
export const ERROR_MSG_INVALID_PASSWORD_NO_MIN_CHARACTERS = '* La contraseña debe tener al menos 6 caracteres';
export const ERROR_MSG_INVALID_PASSWORD_NO_NUMBERS = '* La contraseña no posee números';
export const ERROR_MSG_INVALID_SURNAME = '* El apellido debe poseer solo caracteres alfabéticos';
export const ERROR_MSG_PASSWORD_NO_MATCH = '* Las contraseñas no coinciden';
// Passenger API messages
export const OK_MSG_API_USER_POST = 'Se creó el usuario con éxito';
export const ERROR_MSG_API_POST_USER = 'Ocurrió un error al insertar el usuario:';
// Login API messages
export const ERROR_MSG_API_LOGIN = 'Ocurrió un error al iniciar sesión:';
// Driver registration form
export const ERROR_MSG_EMPTY_PHONE_NUMBER = "* Ingrese un número de telefono";
export const ERROR_MSG_INVALID_PHONE_NUMBER = "* El ingrese un número de teléfono válido";
// Drivers API messages
export const ERROR_MSG_API_GET_DRIVERS = 'Ocurrió un error al obtener los choferes:';
export const ERROR_MSG_API_GET_DRIVER_BY_ID = 'Ocurrió un error al obtener al chofer indicado:';
export const ERROR_MSG_API_GET_DRIVERS_CUSTOM_AVAILABLE = 'Ocurrió un error al obtener las combis disponibles:';
export const OK_MSG_API_POST_DRIVER = 'Se registró el chofer con éxito';
export const ERROR_MSG_API_POST_DRIVER = 'Ocurrió un error al crear el chofer:';
export const OK_MSG_API_PUT_DRIVER = 'Se actualizaron los datos del chofer con éxito';
export const ERROR_MSG_API_PUT_DRIVER = 'Ocurrió un error al actualizar los datos del chofer:';
export const OK_MSG_API_DELETE_DRIVER = 'Se eliminó el chofer con éxito';
export const ERROR_MSG_API_DELETE_DRIVER = 'Ocurrió un error al eliminar el chofer indicado';
export const MSG_DELETE_DRIVER_TRANSPORT_DEPENDENCE = 'No se puede eliminar, el chofer figura como conductor de combis';
export const ERROR_MSG_API_DELETE_DRIVER_TRANSPORT_DEPENDENCE = 'Ocurrió un error al comprobar las dependencias de el chofer';
// Transport registration form
export const ERROR_MSG_EMPTY_DRIVER = '* Seleccione un chofer';
export const ERROR_MSG_EMPTY_INTERNAL_IDENTIFICATION = '* Ingrese una identificación interna';
export const ERROR_MSG_EMPTY_MODEL = '* Ingrese un modelo';
export const ERROR_MSG_EMPTY_REGISTRATION_NUMBER = '* Ingrese una patente';
export const ERROR_MSG_INVALID_REGISTRATION_NUMBER = '* La patente ingresada es inválida';
export const ERROR_MSG_EMPTY_SEATING = '* Ingrese la cantidad de asientos';
export const ERROR_MSG_INVALID_MAX_SEATING = '* El máximo son 99 asientos';
export const ERROR_MSG_INVALID_MIN_SEATING = '* El mínimo es un asiento';
export const ERROR_MSG_INVALID_VALUE_SEATING = '* Sólo se permite valores numéricos';
export const ERROR_MSG_EMPTY_TYPE_COMFORT = '* Seleccione un tipo confort';
// Transports API messages
export const ERROR_MSG_API_GET_TRANSPORTS = 'Ocurrió un error al obtener las combis:';
export const ERROR_MSG_API_GET_ACTIVE_TRANSPORTS = 'Ocurrió un error al obtener las combis activas:';
export const ERROR_MSG_API_POST_TRANSPORT = 'Ocurrió un error al crear la combi:';
export const ERROR_MSG_API_PUT_TRANSPORT = 'Ocurrió un error al actualizar los datos de la combi:';
export const ERROR_MSG_API_PUT_TRANSPORT_ROUTE_DEPENDENCE = 'No se puede editar, la combi está asignada a rutas';
export const ERROR_MSG_API_PUT_TRANSPORT_VALIDATE_ROUTE_DEPENDENCE = 'Ocurrió un error al comprobar las dependencias de la combi';
export const ERROR_MSG_API_DELETE_TRANSPORT = 'Ocurrió un error al eliminar la combi indicada';
export const ERROR_MSG_API_DELETE_TRANSPORT_ROUTE_DEPENDENCE = 'No se puede eliminar, la combi está asignada a rutas';
// Places form
export const ERROR_MSG_EMPTY_PROVINCE = "* Seleccione una provincia";
// Places API messages
export const ERROR_MSG_API_DELETE_PLACES = 'Ocurrió un error al eliminar el lugar indicado';
export const ERROR_MSG_API_GET_PLACES = 'Ocurrió un error al obtener los lugares:';
export const ERROR_MSG_API_GET_ACTIVE_PLACES = 'Ocurrió un error al obtener los lugares activos:';
export const ERROR_MSG_API_GET_PROVINCES = 'Ocurrió un error al obtener las provincias:';
export const ERROR_MSG_API_POST_PLACES = 'Ocurrió un error al crear el lugar:';
export const ERROR_MSG_API_PUT_PLACES = 'Ocurrió un error al modificar el lugar indicado:';
// Routes API messages
export const ERROR_MSG_API_GET_ROUTES = 'Ocurrió un error al obtener las rutas:';
export const ERROR_MSG_API_POST_ROUTES = 'Ocurrió un error al crear la ruta:';
export const ERROR_MSG_API_PUT_ROUTES = 'Ocurrió un error al actualizar los datos de la ruta:';
export const ERROR_MSG_API_DELETE_ROUTES = 'Ocurrió un error al eliminar la ruta indicada';
export const ERROR_MSG_API_ROUTE_VALIDATE_TRIP_DEPENDENCE = 'Ocurrió un error al comprobar las dependencias de la ruta';
export const ERROR_MSG_API_MODIFY_ROUTE_TRIP_DEPENDENCE = 'No se puede editar, la ruta está asignada a viajes pendientes';
export const ERROR_MSG_API_DELETE_ROUTE_TRIP_DEPENDENCE = 'No se puede eliminar, la ruta está asignada a viajes pendientes';
export const ERROR_MSG_EMPTY_KM = '* Ingrese una distancia medida en km para la ruta';
export const ERROR_MSG_EMPTY_DURATION ='* Ingrese una duración para la ruta';
export const ERROR_MSG_EMPTY_TRANSPORT = '* Ingrese una combi para la ruta';
export const ERROR_MSG_EMPTY_PLACE_DESTINATION = '* Ingrese un lugar de destino';
export const ERROR_MSG_EMPTY_PLACE_DEPARTURE = '* Ingrese un lugar de origen';
export const ERROR_MSG_INVALID_KM = '* Ingrese una distancia válida';
export const ERROR_MSG_INVALID_DURATION = '* Ingrese una duración válida';
export const ERROR_MSG_INVALID_ZERO_DURATION = '* La duración debe ser mayor a cero';
export const ERROR_MSG_INVALID_TRANSPORT = '* Ingrese una combi válida';
export const ERROR_MSG_INVALID_PLACE_DESTINATION = '* Ingrese un lugar de destino valido';
export const ERROR_MSG_INVALID_PLACE_DEPARTURE = '* Ingrese un lugar de origen valido';
export const ERROR_MSG_REPEAT_PLACES = '* Ingrese lugares de origen y destino distintos';
// Products API messages
export const ERROR_MSG_API_GET_PRODUCTS = 'Ocurrió un error al obtener los producto: ';
export const ERROR_MSG_API_GET_PRODUCT_BY_ID = 'Ocurrió un error al obtener el producto indicado:';
export const ERROR_MSG_API_GET_PRODUCTS_CUSTOM_AVAILABLE = 'Ocurrió un error al obtener los productos disponibles:';
export const ERROR_MSG_API_POST_PRODUCT = 'Ocurrió un error al crear el producto:';
export const ERROR_MSG_API_PUT_PRODUCT = 'Ocurrió un error al actualizar los datos del producto:';
export const ERROR_MSG_API_DELETE_PRODUCT = 'Ocurrió un error al eliminar el producto indicado';
export const ERROR_MSG_API_MODIFY_PRODUCT_BUY_DEPENDENCE = 'No se puede editar, el producto ya ha sido comprado por algun cliente';
export const ERROR_MSG_INVALID_NAME_PRODUCT = '* Ingrese un nombre de producto valido';
export const ERROR_MSG_INVALID_PRICE_PRODUCT = '* Ingrese un precio de producto valido';
export const ERROR_MSG_INVALID_TYPE_PRODUCT = '* Ingrese un tipo de producto valido';;
export const ERROR_MSG_EMPTY_NAME_PRODUCT = '* Ingrese un nombre de producto';
export const ERROR_MSG_EMPTY_PRICE_PRODUCT = '* Ingrese un precio de producto';
export const ERROR_MSG_EMPTY_TYPE_PRODUCT = '* Ingrese un tipo de producto';
export const ERROR_MSG_API_PUT_PRODUCT_VALIDATE_CLIENT_DEPENDENCE = 'Ocurrió un error al comprobar las dependencias de el producto';