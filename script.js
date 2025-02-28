document.addEventListener("DOMContentLoaded", () => {
    fetch('json/bahiacaraquez.json')
        .then(response => response.json())
        .then(data => {
            loadTidesData(data);
        })
        .catch(error => console.error('Error loading data:', error));
});

function loadTidesData(data) {
    const headerRow = document.getElementById("header-row");
    const subheaderRow = document.getElementById("subheader-row");
    const tbody = document.getElementById("tides-data");

    // Reinicia la tabla
    headerRow.innerHTML = "<th rowspan='2'>Fecha</th>";
    subheaderRow.innerHTML = "";
    tbody.innerHTML = "";

    // Extrae puertos y fechas únicas
    const puertos = [...new Set(data.map(item => item.puerto))];
    const fechas = [...new Set(data.map(item => item.fecha))];

    // Crea los encabezados para cada puerto y sus sub-encabezados
    puertos.forEach(puerto => {
        const th = document.createElement("th");
        th.classList.add("puerto-column");
        th.textContent = puerto;
        th.colSpan = 2;
        headerRow.appendChild(th);

        const thHora = document.createElement("th");
        thHora.textContent = "Hora";
        subheaderRow.appendChild(thHora);

        const thMarea = document.createElement("th");
        thMarea.textContent = "Marea";
        subheaderRow.appendChild(thMarea);
    });

    // Rellena la tabla con los datos correspondientes
    fechas.forEach(fecha => {
        const row = document.createElement("tr");
        const tdFecha = document.createElement("td");
        tdFecha.textContent = fecha;
        row.appendChild(tdFecha);

        puertos.forEach(puerto => {
            const portData = data.filter(item => item.puerto === puerto && item.fecha === fecha);
            const tdHora = document.createElement("td");
            const tdMarea = document.createElement("td");

            if (portData.length > 0) {
                portData.forEach(item => {
                    tdHora.innerHTML += `${item.hora}<br>`;
                    tdMarea.innerHTML += `${item.marea}<br>`;
                });
            } else {
                tdHora.innerHTML = "-";
                tdMarea.innerHTML = "-";
            }
            row.appendChild(tdHora);
            row.appendChild(tdMarea);
        });
        tbody.appendChild(row);
    });
}

// Implementación de debounce para optimizar la búsqueda
let debounceTimer;
function searchPorts() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        const query = document.getElementById("search-box").value.toLowerCase();
        fetch('json/bahiacaraquez.json')
            .then(response => response.json())
            .then(data => {
                const filteredData = data.filter(item =>
                    item.puerto.toLowerCase().includes(query)
                );
                loadTidesData(filteredData);
            })
            .catch(error => console.error('Error loading data:', error));
    }, 300);
}