// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

var app = new Framework7({
    // App root element
    root: '#app',
    // App Name
    name: 'My App',
    // App id
    id: 'com.myapp.test',
    // Enable swipe panel
    panel: {
      swipe: 'left',
    },
    // Add default routes
    routes: [
      { path: '/index/',                 url: 'index.html',   },
      { path: '/registro/',              url: 'registro.html',   },
      { path: '/confirmacion/',          url: 'confirmacion.html',   },
      { path: '/info/',                  url: 'info.html',   },
      { path: '/login/',                 url: 'login.html',   },
      { path: '/mensajes/',              url: 'mensajes.html',   },
      { path: '/about/',                 url: 'about.html',   },
      { path: '/vincularcon/',           url: 'vincularcon.html',   },
      { path: '/reglas/',                url: 'reglas.html',   },
      { path: '/historialderespuestas/', url: 'historialderespuestas.html',   },
      { path: '/ajustes/',               url: 'ajustes.html',   },
      { path: '/acercadelaaplicacion/',  url: 'acercadelaaplicación.html',   },
      { path: '/chatbot/',               url: 'chatbot.html',   },
      { path: '/funcioneschatbot/',      url: 'funcioneschatbot.html',   },
      { path: '/producto/',              url: 'producto.html',   },
      { path: '/notificaciones/',        url: 'notificaciones.html',   },
      
    ]
    // ... other parameters
  });

var mainView = app.views.create('.view-main');

var db = firebase.firestore();
var colPedidos = db.collection("PEDIDOS");
var colPersonas = db.collection("PERSONAS");
var colMensajesEnviados = db.collection("MENSAJES");
var colMensajesRecibidos = db.collection("MENSAJES");
var colReglas = db.collection("REGLAS");
var colClientes = db.collection("CLIENTES");
var colPreguntas = db.collection("PREGUNTAS");
var colProductos = db.collection("PRODUCTOS");
var colRespuestas = db.collection("RESPUESTAS");
var colusuarios = db.collection("USUARIOS");


// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
});

// Option 1. Using one 'page:init' handler for all pages
$$(document).on('page:init', '.page[data-name="index"]', function (e) {
    // Código que se ejecutará cuando la página index se inicialice
    console.log("La página index se ha inicializado")
});

// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="index"]', function (e) {
    $$("#btnRegistro").on("click", fnRegistro);
   //sembrarDatos();
     
    })
   
$$(document).on('page:init', '.page[data-name="registro"]', function (e) {
    $$("#btnFinReg").on("click", fnFinRegistro);
    
})

$$(document).on('page:init', '.page[data-name="login"]', function (e) {
    $$("#btnInicioSesion").on("click", fnIniciarSesion);
       
});



$$(document).on('page:init', '.page[data-name="confirmacion"]', function (e) {
    $$("#confNombre").text(nombre)
    $$("#confEmail").text(email)
    

})

$$(document).on('page:init', '.page[data-name="info"]', function (e) {
    cargarDatosUsuarioLogueado();
     
})

/* SEMBRADO */  
function sembrarDatos() {

    var dato = { reglas: "Amabilidad", color: "Celeste" }
    var miId = "Usuario";
    colReglas.doc(miId).set(dato)
    .then( function(docRef) {
        console.log("Doc creado con el id: " + docRef.id);
    })
    .catch(function(error) {
        console.log("Error: " + error);
    })
}

/* MIS FUNCIONES */

function fnIniciarSesion() {
    email = $$("#loginEmail").val();
    clave = $$("#loginClave").val();

    if (email!="" && clave!="") {

        firebase.auth().signInWithEmailAndPassword(email, clave)
          .then((userCredential) => {
            // Signed in
            var user = userCredential.user;

            console.log("Bienvenid@!!! " + email);

            mainView.router.navigate('/info/');
            // ...
          })
          .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;

            console.error(errorCode);
                console.error(errorMessage);
          });
    }
}


function fnRegistro() {
    email = $$("#indexEmail").val();
    clave = $$("#indexClave").val();

    if (email!="" && clave!="") {
        firebase.auth().createUserWithEmailAndPassword(email, clave)
              .then((userCredential) => {
                // Signed in
                var user = userCredential.user;
                console.log("Bienvenid@!!! " + email);
                // ...
                mainView.router.navigate('/registro/');
              })
              .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.error(errorCode);
                console.error(errorMessage);
                if (errorCode == "auth/email-already-in-use") {
                    console.error("el mail ya esta usado");
                }
                // ..
              });





        //mainView.router.navigate("/registro/")
    }
}

function fnFinRegistro() {
    nombre = $$("#regNombre").val();
    apellido = $$("#regApellido").val();

    if (nombre!="" && apellido!="") {

        datos = { nombre: nombre, apellido: apellido, rol: "DEV" }
        elID = email;

        colPersonas.doc(elID).set(datos)
        .then( function(docRef) {
           mainView.router.navigate("/confirmacion/") 
        })
        .catch(function(error) {
            console.log("Error: " + error);
        })

        
    }
}

function cargarUsuariosEjemplo() {
    colPersonas.get()
    .then( function(qs) {
        qs.forEach( function(elDoc) {
            nombre = elDoc.data().nombre;
            apellido = elDoc.data().apellido;
            rol = elDoc.data().rol;
            email = elDoc.id;
            $$("#listaUsuarios").append("<hr>" + nombre + " / " + apellido + " / " + rol + " / " + email);
        } )
    })
    .catch(function(error) {
        console.log("Error: " + error);
    })

}

function cargarDatosUsuarioLogueado() {
    colPersonas.doc(email).get()
    .then( function(unDoc) {
        if (unDoc.exists) { // Verifica si el documento existe
            var data = unDoc.data(); // Obtiene los datos del documento
            if (data) { // Verifica si los datos no son undefined
                nombre = data.nombre;
                apellido = data.apellido;
                rol = data.rol;
                email = unDoc.id;
                $$("#infoDatos").html("<hr>" + nombre + " / " + apellido + " / " + rol + " / " + email);
            }
        } else {
            console.log("No se encontraron datos del usuario");
            // Manejar el caso en que no se encuentran datos
        }
    })
}
// Usando Framework7 para seleccionar elementos y manejar eventos
$$('.icon-link').on('click', function() {
  // Eliminar la clase 'active-icon' de todos los enlaces
  $$('.icon-link').removeClass('active-icon');

  // Agregar la clase 'active-icon' a este enlace
  $$(this).addClass('active-icon');

  // Opcional: cerrar el panel después de la selección
  app.panel.close();
});

  //firebase//
  
var sentMessagesRef = firebase.firestore().collection("mensajesEnviados");
var receivedMessagesRef = firebase.firestore().collection("mensajesRecibidos");

//guarda las reglas definidas para el bot//
function guardarConfiguracion() {
    var rolBot = document.getElementById('rol-bot').value;
    var reglasMensaje = $$('reglas-mensaje').value;
  
    // Almacenar en Firestore
    colReglas.add({
      rolBot: rolBot,
      reglasMensaje: reglasMensaje,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
      console.log("Configuración guardada con éxito");
      // Opcional: Mostrar un mensaje de confirmación al usuario
    })
    .catch(error => {
      console.error("Error al guardar la configuración:", error);
      // Opcional: Manejar errores y mostrar mensajes de error al usuario
    });
  }
  
  

  $$('.eliminar-regla').on('click', function() {
      const idRegla = $$(this).attr('data-id');
       // Lógica para eliminar la regla en Firebase
    firebase.firestore().collection('ruta/a/las/reglas').doc(idRegla).delete()
    .then(() => {
        console.log('Regla eliminada');
        // Código adicional para actualizar la UI, si es necesario
    })
    .catch(error => {
        console.error('Error al eliminar la regla:', error);
    });
});
  //notificaciones//
  colMensajesRecibidos.onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
      if (change.type === "added") {
        console.log("Nuevo mensaje recibido:", change.doc.data());
        mostrarNotificacion(change.doc.data());
      }
    });
  });
  function mostrarNotificacion(mensaje) {
    app.dialog.alert(`Nuevo mensaje: ${mensaje.texto}`);
  }
  function guardarMensaje() {
    var mensajeTexto = $$('mensajeInput').value;
    if (!mensajeTexto) {
      alert("Por favor, escribe un mensaje.");
      return;
    }
  


// Función para enviar mensaje
function enviarMensaje() {
  var mensajeTexto = document.getElementById('mensajeInput').value;
  db.collection('mensajes').add({
    texto: mensajeTexto,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });
}

// Función para cargar mensajes
function cargarMensajes() {
  db.collection('mensajes').orderBy('timestamp').onSnapshot(snapshot => {
    document.getElementById('listaMensajes').innerHTML = '';
    snapshot.forEach(doc => {
      var mensaje = doc.data();
      document.getElementById('listaMensajes').innerHTML += `<p>${mensaje.texto}</p>`;
    });
  });
}

// Cargar mensajes al iniciar
cargarMensajes()};
//ajustes//
$$('#configuracionBotForm').on('form:submit', function (e) {
  e.preventDefault();
  var formData = app.form.convertToData('#configuracionBotForm');
  // Guardar datos en Firebase
  firebase.firestore().collection('ajustes').doc('configuracionBot').set(formData)
    .then(() => {
      app.dialog.alert('Configuración guardada con éxito.');
    })
    .catch((error) => {
      console.error("Error al guardar la configuración: ", error);
    });
});

function cargarConfiguracionBot() {
  firebase.firestore().collection('ajustes').doc('configuracionBot').get()
    .then((doc) => {
      if (doc.exists) {
        app.form.fillFromData('#configuracionBotForm', doc.data());
      }
    });
}

// Llamada a la función al cargar la página
cargarConfiguracionBot();

// Función para guardar la configuración del bot
function guardarConfiguracion() {
  var rolBot = document.getElementById('rol-bot').value;
  var reglasMensaje = document.getElementById('reglas-mensaje').value;


  var docId = 'ID_DEL_DOCUMENTO'; // Asegúrate de tener un ID válido aquí

  colReglas.doc(docId).set({
      rolBot: rolBot,
      reglasMensaje: reglasMensaje,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
      console.log("Configuración guardada con éxito");
      // Aquí puedes agregar lo que sea necesario para confirmar al usuario que la operación fue exitosa
  })
  .catch(error => {
      console.error("Error al guardar la configuración:", error);
      // Manejar los errores aquí
  });
}

// Función para cargar la configuración del bot al iniciar la página
function cargarConfiguracionBot() {
  var docId = 'ID_DEL_DOCUMENTO';

  colReglas.doc(docId).get()
  .then(doc => {
      if (doc.exists) {
          var datos = doc.data();
          var rolBot = $$('#rol-bot').val();
          var reglasMensaje = $$('#reglas-mensaje').val();
          // Aquí puedes agregar más lógica si hay más campos para cargar
      } else {
          console.log("No se encontraron datos de configuración");
          // Manejar el caso de que no haya datos
      }
  })
  .catch(error => {
      console.error("Error al cargar la configuración:", error);
      // Manejar los errores aquí
  })
}

// Llamar a cargarConfiguracionBot al iniciar la app o cuando sea necesario
cargarConfiguracionBot();


// Función para guardar la API de WhatsApp en Firestore
function guardarApiWhatsapp(apiData) {
  var db = firebase.firestore();
  var configuracionRef = db.collection("configuracion").doc("apiWhatsApp");

  configuracionRef.set(apiData)
    .then(function() {
      console.log("Detalles de la API de WhatsApp guardados con éxito!");
    })
    .catch(function(error) {
      console.error("Error al guardar los detalles de la API:", error);
    });
}

// Ejemplo de cómo usar la función
// Suponiendo que 'apiData' es un objeto con los detalles de la API
var apiData = {
  token: "TU_TOKEN_DE_WHATSAPP",
  // Otros detalles relevantes que necesites guardar
};

guardarApiWhatsapp(apiData);

//Recuperación de la API de WhatsApp
function obtenerApiWhatsapp() {
  var db = firebase.firestore();
  var configuracionRef = db.collection("configuracion").doc("apiWhatsApp");

  configuracionRef.get()
    .then(function(doc) {
      if (doc.exists) {
        var apiData = doc.data();
        console.log("Datos de la API de WhatsApp:", apiData);
        // Aquí puedes usar 'apiData' como necesites
      } else {
        console.log("No se encontraron detalles de la API de WhatsApp");
      }
    })
    .catch(function(error) {
      console.error("Error al obtener los detalles de la API:", error);
    });
  }

