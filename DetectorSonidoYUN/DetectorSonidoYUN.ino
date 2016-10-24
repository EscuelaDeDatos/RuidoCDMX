/*
 * Arduino YUN + Detector de sonido Sparkfun S-SEN-12642
 * Este proyecto busca generar data del ruido ambiental
 * by @PhiRequiem
 * #hagamosdata
 * @EscuelaDeDatos
 */

#include <Bridge.h>
#include <HttpClient.h>
#include <Servo.h>

/* entrada de valor del sensor - ENVELOP */
#define PIN_ANALOG_IN A0

Servo myservo;
int servo_val = 0;
int value;
int send_data_control = 1;

void setup() {
  // Bridge takes about two seconds to start up
  // it can be helpful to use the on-board LED
  // as an indicator for when it has initialized
  pinMode(13, OUTPUT);
  digitalWrite(13, LOW);
  Bridge.begin();
  digitalWrite(13, HIGH);
  myservo.attach(9);
  
  SerialUSB.begin(9600);
  //while (!SerialUSB);
}

void loop() {
  value = analogRead(PIN_ANALOG_IN);
  
  if (send_data_control == 20) //cuando se cumplen 2seg envio lectura
  {
   String apiUrl = "http://urldelservidor.com/api/insert"; //Aquí la url de donde guardaras los data
   String sensorValue = apiUrl + "?arduino_id=001&valor=" + String(value); //arduino_id es el identificador, valor medida del sensor
    HttpClient client;
    client.get(sensorValue);
    while (client.available()) {
      char c = client.read();
      SerialUSB.print(c);
    }
    SerialUSB.flush();
    SerialUSB.println(" ");
    send_data_control = 1;
  }
  
  
  servo_val = map(value, 1023, 0, 0, 180); //interpreto la medida del sensor y se transforma a un valor entre 0º - 180º
  myservo.write(servo_val);


  SerialUSB.println(String(send_data_control) + " -- lectura: " + String(value) + " = " + String(servo_val) + "º");
  
  //contador control para enviar datos al servidor cada 10 seg
  ++send_data_control;
  //en este caso refresco el servo cada 0.5seg,
  //10 siclos = a 1seg
  
  delay(100); //refrescar servo cada 0.1seg
}
