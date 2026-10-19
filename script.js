// تحديث الوقت الحالي والتاريخ الميلادي والهجري
function updateClock() {
    const now = new Date();
    document.getElementById('current-time').innerText = now.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    // التاريخ الميلادي
    const optionsGregorian = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date').innerText = now.toLocaleDateString('ar-SA', optionsGregorian);

    // التاريخ الهجري
    try {
        const optionsHijri = { calendar: 'islamic-umalqura', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('hijri-date').innerText = now.toLocaleDateString('ar-SA-u-ca-islamic-umalqura', optionsHijri);
    } catch (e) {
        document.getElementById('hijri-date').innerText = '';
    }
}
setInterval(updateClock, 1000);
updateClock();

// جلب أوقات الصلاة والطقس لمدينة جدة
async function fetchDashboardData() {
    try {
        const prayerRes = await fetch('https://api.aladhan.com/v1/timingsByCity?city=Jeddah&country=Saudi+Arabia&method=4');
        const prayerData = await prayerRes.json();
        const timings = prayerData.data.timings;

        const prayers = [
            { name: 'الفجر', time: timings.Fajr },
            { name: 'الظهر', time: timings.Dhuhr },
            { name: 'العصر', time: timings.Asr },
            { name: 'المغرب', time: timings.Maghrib },
            { name: 'العشاء', time: timings.Isha }
        ];

        const scheduleContainer = document.getElementById('prayer-schedule');
        scheduleContainer.innerHTML = '';

        prayers.forEach(p => {
            scheduleContainer.innerHTML += `
                <div class="prayer-item">
                    <div class="name">${p.name}</div>
                    <div class="time">${p.time}</div>
                </div>
            `;
        });

        document.getElementById('next-prayer-name').innerText = prayers[0].name;
        document.getElementById('next-prayer-time').innerText = prayers[0].time;
        document.getElementById('prayer-countdown').innerText = 'مواقيت محدثة حسب تقويم أم القرى';

    } catch (e) {
        console.error('خطأ في جلب أوقات الصلاة:', e);
    }

    try {
        const weatherRes = await fetch('https://api.open-meteo.com/v1/forecast?latitude=21.5433&longitude=39.1728&current_weather=true');
        const weatherData = await weatherRes.json();
        const temp = weatherData.current_weather.temperature;
        
        document.getElementById('temperature').innerText = `${temp}°C`;
        document.getElementById('weather-desc').innerText = 'صافٍ / أجواء جدة';
    } catch (e) {
        console.error('خطأ في جلب الطقس:', e);
    }
}

fetchDashboardData();
setInterval(fetchDashboardData, 30 * 60 * 1000);