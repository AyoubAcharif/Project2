#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 20, 4);

// Broches des capteurs à obstacle
const int capteur1Pin = 18;
const int capteur2Pin = 19;  // Nouveau capteur
const int btn = 3;

// Variables pour mesurer le temps
unsigned long tempsInitial = 0;
unsigned long tempsFinal = 0;
unsigned long tempsInitial2 = 0;
unsigned long tempsFinal2 = 0;

// Constante de conversion de millisecondes en secondes
const float secondesEnMilliseconds = 1000.0;

// Seuil de temps minimum pour considérer une mesure valide
const int seuilTempsMinimum = 100;  // En millisecondes

// Debounce delay
const int debounceDelay = 10;  // Adjust as needed

unsigned long tempsEcoule = 0;

// Distance entre les capteurs (en unités arbitraires)
const float distanceEntreCapteur = 29.5;  // Modifier la valeur en fonction de la distance réelle

void setup() {
  // Initialisation des broches des capteurs en entrée
  pinMode(capteur1Pin, INPUT);
  pinMode(capteur2Pin, INPUT);
  pinMode(btn, INPUT_PULLUP);

  

  lcd.init();
  lcd.backlight();

  // Début de la communication série
  Serial.begin(9600);
}

void loop() {
  // Vérification du premier capteur
  if (digitalRead(capteur1Pin) == LOW && tempsInitial == 0) {
    // Objet détecté par le premier capteur
    delay(debounceDelay);  // Debounce delay
    if (digitalRead(capteur1Pin) == LOW) {
      tempsInitial = millis();
    }
  }

  // Vérification si l'objet n'est plus détecté par le premier capteur
  if (digitalRead(capteur1Pin) == HIGH && tempsInitial != 0 && tempsFinal == 0) {
    // Objet n'est plus détecté par le premier capteur
    delay(debounceDelay);  // Debounce delay
    if (digitalRead(capteur1Pin) == HIGH) {
      tempsFinal = millis();

      // Calcul du temps écoulé en millisecondes
      tempsEcoule = tempsFinal - tempsInitial;

      // Vérification si le temps écoulé est valide
      if (tempsEcoule > seuilTempsMinimum) {
        // Enregistrement du temps initial pour le deuxième capteur
        tempsInitial2 = tempsInitial;
      }

      // Réinitialisation du temps pour la prochaine mesure
      tempsInitial = 0;
      tempsFinal = 0;
    }
  }

  // Vérification du deuxième capteur
  if (digitalRead(capteur2Pin) == LOW && tempsInitial2 != 0 && tempsFinal2 == 0) {
    // Objet détecté par le deuxième capteur
    delay(debounceDelay);  // Debounce delay
    if (digitalRead(capteur2Pin) == LOW) {
      tempsFinal2 = millis();

      // Calcul du temps écoulé entre les deux capteurs en millisecondes
      unsigned long tempsEcoule2C = tempsFinal2 - tempsInitial2;

      // Calcul de la vitesse du convoyeur en unités par seconde
      float vitesseConvoyeur = distanceEntreCapteur / (tempsEcoule2C / 1000.0);

      float longueur = vitesseConvoyeur * tempsEcoule;


      lcd.setCursor(0, 0);
      lcd.print("Vitesse : ");
      lcd.print(vitesseConvoyeur);
      lcd.print(" cm/s");

      lcd.setCursor(0, 1);
      lcd.print("Longueur : ");
      lcd.print(longueur / 1000);
      lcd.print(" cm");

      Serial.println(longueur/1000);




      // Réinitialisation des temps pour la prochaine mesure
      tempsInitial2 = 0;
      tempsFinal2 = 0;
    }
  }

  if (digitalRead(btn) == LOW){

    lcd.clear();
  
  }

}

