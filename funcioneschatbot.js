 
// Reemplaza 'API_KEY' con tu clave API válida de OpenAI
const API_KEY = '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';


$$('.send-link').on('click', function () {
  var messageText = $$('.toolbar-inner input[type="text"]').val().trim();
  if (messageText.length === 0) {
    return;
  }
  // Agrega el mensaje del usuario a la interfaz
  $$('.messages').append('<div class="message message-sent">' + messageText + '</div>');

 
  function askOpenAI(question) {
    // Almacenar mensaje enviado en Firestore
    sentMessagesRef.add({
      text: question,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
  
    return new Promise((resolve, reject) => {
      var requestOptions = {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + 'tu-clave-api-aqui',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: question,
          max_tokens: 150,
          temperature: 0.7
        })
      };
  
      fetch('https://api.openai.com/v1/engines/davinci-codex/completions', requestOptions)
        .then(response => response.json())
        .then(data => {
          const respuesta = data.choices[0].text.trim();
  
          // Almacenar mensaje recibido en Firestore
          receivedMessagesRef.add({
            text: respuesta,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
          });
  
          resolve(respuesta);
        })
        .catch(error => reject(error));
    });
  }
  
  // Manejador de eventos para enviar mensajes
  $$('.send-link').on('click', function () {
    var messageText = $$('.toolbar-inner input[type="text"]').val().trim();
    if (messageText.length === 0) {
      return;
    }
  
    // Agregar mensaje del usuario a la interfaz
    $$('.messages').append('<div class="message message-sent">' + messageText + '</div>');
  
    // Llamar a askOpenAI y manejar la respuesta
    askOpenAI(messageText).then(respuesta => {
      // Agregar respuesta del chatbot a la interfaz
      $$('.messages').append('<div class="message message-received">' + respuesta + '</div>');
    });
  
    // Limpiar campo de entrada
    $$('.toolbar-inner input[type="text"]').val('');
  });
  
      // Realizar la solicitud a la API de OpenAI
      fetch('https://api.openai.com/v1/engines/davinci-codex/completions', requestOptions)
        .then(response => response.json())
        .then(data => {
          const respuesta = data.choices[0].text.trim();
          resolve(respuesta);
        })
        .catch(error => reject(error));
    });
  

  // Limpia el campo de entrada
  $$('.toolbar-inner input[type="text"]').val('');

$(document).ready(function() {
  $('#submit-btn').click(function() {
    // Obtener entrada del usuario
    const prompt = $('#prompt').val();
    // Lógica para enviar solicitud a OpenAI y manejar la respuesta...
  });
});

function guardarReglas() {
  var reglas = document.getElementById('reglas-input').value;
  console.log("Reglas guardadas:", reglas);

  // Aquí puedes añadir el código para hacer algo con las reglas,
  // como enviarlas a un servidor o almacenarlas en Firebase
}