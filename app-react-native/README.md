# 🏀 Proyecto React Native - Producto 3

Este archivo contiene la guía completa de configuración del entorno de desarrollo y la vinculación con **Firebase Realtime Database**. Siga estos pasos para asegurar que la aplicación compile y se conecte correctamente a los servicios en la nube.

**Archivos necesarios en Discord**

---

## 🛠️ 1. Requisitos Previos (Software)

Antes de configurar el proyecto, es obligatorio tener instalados y configurados los siguientes componentes en el sistema:

* **Node.js (LTS):** Versión 18 o superior.
```bash
npm install
```
* **JDK 17 (Java Development Kit):** Necesario para compilar el código nativo de Android. 

(desde IntelliJ se puede hacer)

* **Android Studio:**
    * Instalar el SDK de Android (versión 34 o superior).
    * Configurar un **AVD (Android Virtual Device)** como emulador. (Probado en pixel 10)

* **Variables de Entorno del SO:**

    * `ANDROID_HOME`: Apuntando a la ruta del SDK de android. 
    (Ej-> C:\Users\${NOMBREUSUARIO}\AppData\Local\Android\Sdk)

    * `JAVA_HOME`: Apuntando a la ruta del SDK de java 17. 
    (Ej-> C:\Users\${NOMBREUSUARIO}\ .jdks\temurin-17.0.18)
    
    * Añadir al PATH del sistema 
    `%ANDROID_HOME%\platform-tools`, 
    `%ANDROID_HOME%\emulator`, 
    `%ANDROID_HOME%\tools\bin`  
    para usar comandos `adb`.

---

## 🔧 2. Configuración del Entorno de Trabajo

Para que **VS Code** se comunique correctamente con el emulador de Android Studio:

* **Crear en la carpeta ./android un archivo llamado local.properties con la siguiente línea:**
`sdk.dir=C:/Users/${NOMBREUSUARIO}/AppData/Local/Android/Sdk`

* **Ejecute el siguiente comando una vez el emulador esté abierto:**

```bash
# Mapeo de puertos para el servidor Metro
adb reverse tcp:8081 tcp:8081
```

Para verificar que el entorno es correcto, ejecute el diagnóstico oficial:
```bash
npx react-native doctor
```

---

## 🔥 3. Configuración de Firebase (Android)

La aplicación utiliza Firebase para el almacenamiento en tiempo real. Se han realizado las siguientes modificaciones técnicas:

1.  **Credenciales:** Colocar el archivo `google-services.json` en la ruta: `android/app/`.

2.  **Gradle Nivel Proyecto (`android/build.gradle`):**
    ```gradle
    dependencies {
        classpath("com.google.gms:google-services:4.4.1")
    }
    ```

3.  **Gradle Nivel Aplicación (`android/app/build.gradle`):**
    ```gradle
    apply plugin: "com.google.gms.google-services"
    ```

---

## 🔐 4. Seguridad y Variables de Entorno

Para proteger la URL de la base de datos y evitar el error de instancia nula (Null Instance), se ha implementado la librería `react-native-dotenv`:

1.  **Archivo .env:** Crear un archivo llamado `.env`

2.  **Babel:** Se ha configurado `babel.config.js` para permitir la importación de estas variables mediante `@env`.

---

## 🚀 5. Comandos de Ejecución

Siga este orden para asegurar una compilación limpia sin errores de caché:

```bash
# 1. Limpiar archivos temporales de Android
cd android
gradlew clean
cd ..

# 2. Iniciar servidor Metro con limpieza de caché
npx react-native start --reset-cache

# 3. Abrir una terminal y Lanzar Metro por si acaso
npm start

# 4. Abrir una segunda terminal y Lanzar la aplicación en el emulador, con este mismo comando os da la posibilidad de abrir una terminal fuera de vs code para lanzar Metro, recordad que ya hay 1 abierta y funcional por eso detecta que el puerto se esta usando.
npx react-native run-android


```

---

## 📝 6. Gestión de Git (.gitignore)

Para mantener el repositorio limpio y seguro, se han excluido los siguientes elementos:

* **Secretos:** `.env` y `google-services.json`.
* **Temporales de Gradle:** Carpetas `.gradle/` y todas las carpetas `build/`.
* **Configuración Local:** `local.properties` (específico de cada PC).

---

## 📸 7. Evidencia de Conexión

Una vez configurado todo, el componente **ListadoScreen** debería mostrar el estado de conexión:

*Semáforo de conexión en verde indicando comunicación exitosa con Europe-West1.*

---
**Producto 3 (2026)** 
```
