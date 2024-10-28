import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, push, set, onValue } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const hourOptionsContainer = document.getElementById('hourOptions');

// Generar opciones de horas y días
const generateOptions = () => {
    hourOptionsContainer.innerHTML = '';
    for (let i = 0; i < 24; i++) {
        const hourLabel = document.createElement('label');
        hourLabel.innerHTML = `<input type="checkbox" class="hourCheckbox" value="${i}"> ${i.toString().padStart(2, '0')}:00`;
        hourOptionsContainer.appendChild(hourLabel);
    }
};

generateOptions(); // Generar opciones al cargar

document.getElementById('submitBtn').addEventListener('click', () => {
    const name = document.getElementById('nameInput').value;
    const selectedDays = Array.from(document.querySelectorAll('.dayCheckbox:checked')).map(cb => cb.value);
    const selectedHours = Array.from(document.querySelectorAll('.hourCheckbox:checked')).map(cb => cb.value);
    const timeZone = document.getElementById('timeZoneSelect').value;

    if (!name || selectedDays.length === 0 || selectedHours.length === 0) {
        alert('Completa todos los campos');
        return;
    }

    const availability = { name, days: selectedDays, hours: selectedHours, timeZone, timestamp: Date.now() };
    const newRef = push(ref(database, 'availability'));
    set(newRef, availability).then(() => {
        alert('Disponibilidad guardada! Comparte el enlace para agregar disponibilidad.');
        displayAvailability();
    }).catch(error => console.error('Error: ', error));
});

// Mostrar disponibilidad y encontrar coincidencias
const displayAvailability = () => {
    const availabilityList = document.getElementById('availabilityList');
    availabilityList.innerHTML = '';

    onValue(ref(database, 'availability'), (snapshot) => {
        let availabilityData = [];
        snapshot.forEach((childSnapshot) => {
            availabilityData.push(childSnapshot.val());
        });

        // Aquí iría la lógica para calcular los horarios más comunes
        // (ejemplo de coincidencia de horarios)
        let commonTimes = calculateCommonTimes(availabilityData);
        availabilityList.innerText = `Horarios comunes sugeridos: ${commonTimes}`;
    });
};

// Calcular horarios más comunes
const calculateCommonTimes = (availabilityData) => {
    // Aquí agregaremos la lógica para determinar las mejores coincidencias de horarios
    return "8:00 - 10:00, 14:00 - 16:00";
};

// Cambiar idioma y zonas horarias
const languageBtn = document.getElementById('languageBtn');
let isSpanish = true;

languageBtn.addEventListener('click', () => {
    isSpanish = !isSpanish;
    document.getElementById('appTitle').innerText = isSpanish ? 'AgendAppT' : 'AgendAppT (in English)';
    languageBtn.innerText = isSpanish ? 'English' : 'Español';
    document.querySelectorAll('.dayCheckbox').forEach((cb, index) => {
        const daysSpanish = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const daysEnglish = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        cb.nextSibling.textContent = isSpanish ? daysSpanish[index] : daysEnglish[index];
    });
});
