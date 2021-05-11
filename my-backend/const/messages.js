module.exports = {
    // Passengers API messages
    OK_MSG_API_USER_POST: 'Se creó el usuario con éxito',
    ERROR_MSG_API_POST_USER: 'Ocurrió un error al insertar el usuario:',
    ERROR_MSG_EMPTY_DATE: '* Ingrese una fecha',
    ERROR_MSG_EMPTY_EMAIL: '* Ingrese un correo electrónico',
    ERROR_MSG_EMPTY_NAME: '* Ingrese un nombre',
    ERROR_MSG_EMPTY_PASSWORD: '* Ingrese una contraseña',
    ERROR_MSG_EMPTY_REPEAT_PASSWORD: '* Ingrese la contraseña nuevamente',
    ERROR_MSG_EMPTY_SURNAME: '* Ingrese un apellido',
    ERROR_MSG_EMPTY_PHONE_NUMBER: "* Ingrese un numero de telefono",
    ERROR_MSG_EXISTING_EMAIL: '* El email ingresado ya se encuentra registrado',
    ERROR_MSG_INVALID_AGE: '* Debe ser mayor de 18 años',
    ERROR_MSG_INVALID_DATE: '* La fecha ingresada en inválida',
    ERROR_MSG_INVALID_EMAIL: '* El correo electrónico posee un formato inválido',
    ERROR_MSG_INVALID_LOGIN: '* El correo y/o contraseña son incorrectos',
    ERROR_MSG_INVALID_NAME: '* El nombre debe poseer solo caracteres alfabéticos',
    ERROR_MSG_INVALID_PHONE_NUMBER: "* El ingrese un numero de telefono valido",
    ERROR_MSG_INVALID_PASSWORD_NO_CAPITAL_LETTERS: '* La contraseña no posee letras mayúsculas',
    ERROR_MSG_INVALID_PASSWORD_NO_LOWER_CASE: '* La contraseña no posee letras minúsculas',
    ERROR_MSG_INVALID_PASSWORD_NO_MIN_CHARACTERS: '* La contraseña debe tener mas de 6 caracteres',
    ERROR_MSG_INVALID_PASSWORD_NO_NUMBERS: '* La contraseña no posee números',
    ERROR_MSG_INVALID_SURNAME: '* El apellido debe poseer solo caracteres alfabéticos',
    ERROR_MSG_PASSWORD_NO_MATCH: '* Las contraseñas no coinciden',
    // Drivers API messages
    ERROR_MSG_API_GET_DRIVERS: 'Ocurrió un error al obtener los choferes:',
    ERROR_MSG_API_GET_DRIVER_BY_ID: 'Ocurrió un error al obtener al chofer indicado:',
    ERROR_MSG_API_GET_DRIVERS_CUSTOM_AVAILABLE: 'Ocurrió un error al obtener las combis disponibles:',
    OK_MSG_API_POST_DRIVER: 'Se registró el chofer con éxito',
    ERROR_MSG_API_POST_DRIVER: 'Ocurrió un error al crear el chofer:',
    OK_MSG_API_PUT_DRIVER: 'Se actualizaron los datos del chofer con éxito',
    ERROR_MSG_API_PUT_DRIVER: 'Ocurrió un error al actualizar los datos del chofer:',
    OK_MSG_API_DELETE_DRIVER: 'Se eliminó el chofer con éxito',
    ERROR_MSG_API_DELETE_DRIVER: 'Ocurrió un error al eliminar el chofer indicado',
    ERROR_MSG_API_DELETE_DRIVER_TRANSPORT_DEPENDENCE: 'No se puede eliminar, el chofer figura como conductor de combis',
    // Places API messages
    OK_MSG_API_LOCATION_POST: 'Se creó el lugar con éxito',
    OK_MSG_API_LOCATION_PUT: 'Se actualizaron los datos del lugar con éxito',
    ERROR_MSG_EMPTY_PROVINCE: '* Ingrese un nombre de provincia',
    ERROR_MSG_EMPTY_CITY: '* Ingrese un nombre de localidad',
    ERROR_MSG_INVALID_CITY: '* El nombre de localidad debe poseer solo caracteres alfabéticos',
    ERROR_MSG_INVALID_PROVINCE: '* El nombre de provincia debe poseer solo caracteres alfabéticos',
    ERROR_MSG_INEXISTENT_PLACE: '* El lugar no se encontró en la región',
    // Transports API messages
    ERROR_MSG_API_GET_TRANSPORTS: 'Ocurrió un error al obtener las combis:',
    ERROR_MSG_API_GET_ACTIVE_TRANSPORTS: 'Ocurrió un error al obtener las activas combis:',
    ERROR_MSG_API_GET_TRANSPORT_BY_ID: 'Ocurrió un error al obtener la combi indicada:',
    OK_MSG_API_TRANSPORT_POST: 'Se creó la combi con éxito',
    ERROR_MSG_API_POST_TRANSPORT: 'Ocurrió un error al crear la combi:',
    ERROR_MSG_API_TRANSPORT_EXISTING_INTERNAL_IDENTIFICATION: '* La identificación interna ingresada ya se encuentra registrada',
    ERROR_MSG_API_TRANSPORT_EXISTING_REGISTRATION_NUMBER: '* La patente ingresada ya se encuentra registrada',
    ERROR_MSG_API_TRANSPORT_VALIDATE_EXISTING_INTERNAL_IDENTIFICATION: 'Ocurrió un error al verificar si la identificación interna es única:',
    ERROR_MSG_API_TRANSPORT_VALIDATE_EXISTING_REGISTRATION_NUMBER: 'Ocurrió un error al verificar si la patente es única:',
    OK_MSG_API_PUT_TRANSPORT: 'Se actualizaron los datos de la combi con éxito',
    ERROR_MSG_API_PUT_TRANSPORT: 'Ocurrió un error al actualizar los datos de la combi:',
    OK_MSG_API_DELETE_TRANSPORT: 'Se eliminó la combi con éxito',
    ERROR_MSG_API_DELETE_TRANSPORT: 'Ocurrió un error al eliminar la combi indicada',
    ERROR_MSG_API_DELETE_TRANSPORT_ROUTE_DEPENDENCE: 'No se puede eliminar, la combi está asignada a rutas',
    // Routes API messages
    ERROR_MSG_EMPTY_KM: '* Ingrese una distancia medida en km para la ruta',
    ERROR_MSG_EMPTY_DURATION: '* Ingrese una duracion para la ruta',
    ERROR_MSG_EMPTY_TRANSPORT: '* Ingrese una combi para la ruta',
    ERROR_MSG_EMPTY_PLACE_DESTINATION: '* Ingrese un lugar de destino',
    ERROR_MSG_EMPTY_PLACE_DEPARTURE: '* Ingrese un lugar de origen',
    ERROR_MSG_INVALID_KM: '* Ingrese una distancia valida',
    ERROR_MSG_INVALID_DURATION: '* Ingrese una duracion valida',
    ERROR_MSG_INVALID_TRANSPORT: '* Ingrese una combi valida',
    ERROR_MSG_INVALID_PLACE_DESTINATION: '* Ingrese un lugar de destino valido',
    ERROR_MSG_INVALID_PLACE_DEPARTURE: '* Ingrese un lugar de origen valido',
    ERROR_MSG_REPEAT_PLACES: '* Ingrese lugares de origen y destino distintos',
    ERROR_MSG_EXISTING_PLACES: '* Ya existe una ruta con los mismos lugares de origen y destino',
    ERROR_MSG_API_DELETE_ROUTE: 'Ocurrió un error al eliminar la ruta indicada',
    ERROR_MSG_API_DELETE_ROUTE_TRIP_DEPENDENCE: 'No se puede eliminar, la ruta está asignada a viajes pendientes',
    OK_MSG_API_DELETE_ROUTE: 'Se eliminó la ruta con éxito'
};
