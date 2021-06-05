module.exports = {
       // Passengers API messages
    OK_MSG_API_USER_POST: 'Se creó el usuario con éxito',
    OK_MSG_API_USER_PUT: 'Se editó los datos del usuario con éxito',
    ERROR_MSG_API_POST_USER: 'Ocurrió un error al insertar el usuario:',
    ERROR_MSG_API_PUT_USER: 'Ocurrió un error al editar los datos del usuario:',
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
    ERROR_MSG_INVALID_PHONE_NUMBER: "* El ingrese un numero de telefono válido",
    ERROR_MSG_INVALID_PASSWORD_NO_CAPITAL_LETTERS: '* La contraseña no posee letras mayúsculas',
    ERROR_MSG_INVALID_PASSWORD_NO_LOWER_CASE: '* La contraseña no posee letras minúsculas',
    ERROR_MSG_INVALID_PASSWORD_NO_MIN_CHARACTERS: '* La contraseña debe tener 6 o mas caracteres',
    ERROR_MSG_INVALID_PASSWORD_NO_NUMBERS: '* La contraseña no posee números',
    ERROR_MSG_INVALID_SURNAME: '* El apellido debe poseer solo caracteres alfabéticos',
    ERROR_MSG_PASSWORD_NO_MATCH: '* Las contraseñas no coinciden',
    ERROR_MSG_SAME_NEW_PASSWORD: '* La nueva contraseña debe ser diferente a la anterior',
    ERROR_MSG_INCORRECT_ACTUAL_PASSWORD: '* La contraseña actual es incorrecta',
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
    ERROR_MSG_API_DRIVER_VALIDATE_TRANSPORT_DEPENDENCE: 'Ocurrió un error al comprobar las dependencias de el chofer',
    // Places API messages
    ERROR_MSG_API_GET_PLACES: 'Ocurrió un error al obtener los lugares:',
    ERROR_MSG_API_GET_ACTIVE_PLACES: 'Ocurrió un error al obtener los activos lugares:',
    ERROR_MSG_API_GET_PLACE_BY_ID: 'Ocurrió un error al obtener al lugar indicado:',
    OK_MSG_API_PLACE_POST: 'Se creó el lugar con éxito',
    ERROR_MSG_API_POST_PLACE: 'Ocurrió un error al crear el lugar:',
    ERROR_MSG_API_PLACE_EXISTING_PLACE: '* La ciudad ya existe para esta provincia',
    OK_MSG_API_PLACE_PUT: 'Se actualizaron los datos del lugar con éxito',
    ERROR_MSG_API_PUT_PLACE: 'Ocurrió un error al modificar el lugar indicado:',
    OK_MSG_API_DELETE_PLACE: 'Se eliminó el lugar con éxito',
    ERROR_MSG_API_DELETE_PLACE: 'Ocurrió un error al eliminar el lugar indicado:',
    ERROR_MSG_API_DELETE_PLACE_ROUTE_DEPENDENCE: 'No se puede eliminar, el lugar figura entre rutas existentes.',
    ERROR_MSG_API_MODIFY_PLACE_ROUTE_DEPENDENCE: 'No se puede modificar, el lugar figura entre rutas existentes.',
    ERROR_MSG_EMPTY_PROVINCE: '* Ingrese un nombre de provincia',
    ERROR_MSG_EMPTY_PLACE: '* Ingrese un nombre de localidad',
    ERROR_MSG_INVALID_PLACE: '* El nombre de localidad debe poseer solo caracteres alfabéticos',
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
    //ERROR_MSG_API_PUT_TRANSPORT_ROUTE_DEPENDENCE: 'No se puede editar, la combi está asignada a rutas',
    OK_MSG_API_DELETE_TRANSPORT: 'Se eliminó la combi con éxito',
    ERROR_MSG_API_DELETE_TRANSPORT: 'Ocurrió un error al eliminar la combi indicada',
    //ERROR_MSG_API_DELETE_TRANSPORT_ROUTE_DEPENDENCE: 'No se puede eliminar, la combi está asignada a rutas',
    ERROR_MSG_API_TRANSPORT_VALIDATE_ROUTE_DEPENDENCE: 'Ocurrió un error al comprobar las dependencias de la combi',
    // Routes API messages
    ERROR_MSG_EMPTY_KM: '* Ingrese una distancia medida en km para la ruta',
    ERROR_MSG_EMPTY_DURATION: '* Ingrese una duración para la ruta',
    ERROR_MSG_EMPTY_TRANSPORT: '* Ingrese una combi para la ruta',
    ERROR_MSG_EMPTY_PLACE_DESTINATION: '* Ingrese un lugar de destino',
    ERROR_MSG_EMPTY_PLACE_DEPARTURE: '* Ingrese un lugar de origen',
    ERROR_MSG_INVALID_KM: '* Ingrese una distancia válida',
    ERROR_MSG_INVALID_DURATION: '* Ingrese una duración válida',
    ERROR_MSG_INVALID_TRANSPORT: '* Ingrese una combi válida',
    ERROR_MSG_INVALID_PLACE_DESTINATION: '* Ingrese un lugar de destino válido',
    ERROR_MSG_INVALID_PLACE_DEPARTURE: '* Ingrese un lugar de origen válido',
    ERROR_MSG_REPEAT_PLACES: '* Ingrese lugares de origen y destino distintos',
    ERROR_MSG_EXISTING_PLACES: '* Ya existe una ruta con los mismos lugares de origen y destino',
    ERROR_MSG_API_GET_ROUTE: 'Ocurrió un error al obtener las rutas',
    ERROR_MSG_API_GET_ROUTES_CUSTOM_AVAILABLE: 'Ocurrió un error al obtener las rutas disponibles:',
    ERROR_MSG_API_POST_ROUTE: 'Ocurrió un error al crear la ruta indicada',
    ERROR_MSG_API_PUT_ROUTE: 'Ocurrió un error al modificar la ruta indicada',
    ERROR_MSG_API_DELETE_ROUTE: 'Ocurrió un error al eliminar la ruta indicada',
    ERROR_MSG_API_DELETE_ROUTE_TRIP_DEPENDENCE: 'No se puede eliminar, la ruta está asignada a viajes pendientes',
    ERROR_MSG_API_ROUTE_VALIDATE_TRIP_DEPENDENCE: 'Ocurrió un error al comprobar las dependencias de la ruta',
    OK_MSG_API_DELETE_ROUTE: 'Se eliminó la ruta con éxito',
    // Products API messages
    ERROR_MSG_API_GET_PRODUCTS: 'Ocurrió un error al obtener los producto: ',
    ERROR_MSG_API_GET_PRODUCT_BY_ID: 'Ocurrió un error al obtener el producto indicado:',
    ERROR_MSG_API_GET_PRODUCTS_CUSTOM_AVAILABLE: 'Ocurrió un error al obtener los productos disponibles:',
    OK_MSG_API_POST_PRODUCT: 'Se registró el producto con éxito',
    ERROR_MSG_API_POST_PRODUCT: 'Ocurrió un error al crear el producto:',
    OK_MSG_API_PUT_PRODUCT: 'Se actualizaron los datos del producto con éxito',
    ERROR_MSG_API_PUT_PRODUCT: 'Ocurrió un error al actualizar los datos del producto:',
    OK_MSG_API_DELETE_PRODUCT: 'Se eliminó el producto con éxito',
    ERROR_MSG_API_DELETE_PRODUCT: 'Ocurrió un error al eliminar el producto indicado',
    ERROR_MSG_INVALID_NAME_PRODUCT: '* Ingrese un nombre de producto válido',
    ERROR_MSG_INVALID_PRICE_PRODUCT: '* Ingrese un precio de producto válido',
    ERROR_MSG_INVALID_TYPE_PRODUCT: '* Ingrese un tipo de producto válido',
    ERROR_MSG_EXISTING_NAME_PRODUCT: '* Ya existe un producto con ese nombre',
    ERROR_MSG_EMPTY_NAME_PRODUCT: '* Ingrese un nombre de producto',
    ERROR_MSG_EMPTY_PRICE_PRODUCT: '* Ingrese un precio de producto',
    ERROR_MSG_EMPTY_TYPE_PRODUCT: '* Ingrese un tipo de producto',
    ERROR_MSG_API_PUT_PRODUCT_VALIDATE_CLIENT_DEPENDENCE: 'Ocurrió un error al comprobar las dependencias de el producto',
    // Trips API messages
    ERROR_MSG_API_GET_TRIPS: 'Ocurrió un error al obtener los viajes:',
    OK_MSG_API_TRIP_POST: 'Se creó el viaje con éxito',
    ERROR_MSG_API_POST_TRIP: 'Ocurrió un error al crear el viaje:',
    ERROR_MSG_API_TRIP_DATE_OVERLAP: '* La combi ya se encuentra en uso para la fecha y hora indicada',
    ERROR_MSG_API_TRIP_VALIDATE_DATE_OVERLAP: 'Ocurrió un error al verificar si la combi está en uso:',
    OK_MSG_API_PUT_TRIP: 'Se actualizaron los datos del viaje con éxito',
    ERROR_MSG_API_PUT_TRIP: 'Ocurrió un error al actualizar los datos del viaje:',
    //ERROR_MSG_API_PUT_TRIP_ROUTE_DEPENDENCE: 'No se puede editar, el viaje está en curso',
    OK_MSG_API_DELETE_TRIP: 'Se eliminó el viaje con éxito',
    ERROR_MSG_API_DELETE_TRIP: 'Ocurrió un error al eliminar el viaje indicado',
    //ERROR_MSG_API_DELETE_TRIP_ROUTE_DEPENDENCE: 'No se puede eliminar, el viaje está en curso',
    ERROR_MSG_API_TRIP_VALIDATE_TICKET_DEPENDENCE: 'Ocurrió un error al comprobar las dependencias del viaje',
    // Comments API messages
    ERROR_MSG_API_GET_COMMENT: 'Ocurrió un error al obtener los comentario: ',
    ERROR_MSG_API_GET_COMMENT_BY_ID: 'Ocurrió un error al obtener el comentario indicado: ',
    ERROR_MSG_API_POST_COMMENT: 'Ocurrió un error al crear el comentario: ',
    OK_MSG_API_POST_COMMENT: 'Se registró el comentario con éxito',
    ERROR_MSG_API_PUT_COMMENT: 'Ocurrió un error al actualizar los datos del comentario: ',
    OK_MSG_API_PUT_COMMENT: 'Se actualizaron los datos del comentario con éxito',
    ERROR_MSG_API_DELETE_COMMENT: 'Ocurrió un error al eliminar el comentario indicado',
    OK_MSG_API_DELETE_COMMENT: 'Se eliminó el comentario con éxito',
    ERROR_MSG_API_COMMENT_VALIDATE_DEPENDENCE: 'Ocurrió un error al comprobar las dependencias del comentario',
    ERROR_MSG_EMPTY_TEXT_COMMENT: '* Ingrese un texto',
    ERROR_MSG_API_COMMENT_USER_NOT_CONSUMER: 'Solo los usuarios con viajes realizados pueden hacer comentrios en el sitio.'
};
