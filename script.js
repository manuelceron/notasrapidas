document.addEventListener("DOMContentLoaded", () => {
      const tareas = JSON.parse(localStorage.getItem("tareas")) || [];
      let sigTareaId = JSON.parse(localStorage.getItem("sigTareaId")) || 1;

      const searchInput = document.getElementById("search");
      const listadoTareas = document.getElementById("listado-tareas");
      const botonAgregar = document.querySelector(".stylebutton");

      function guardar() {
        localStorage.setItem("tareas", JSON.stringify(tareas));
        localStorage.setItem("sigTareaId", JSON.stringify(sigTareaId));
      }

      function crearElementoTarea(tarea, index) {
        const li = document.createElement("li");
        li.id = tarea.id;

        const a = document.createElement("a");
        a.href = "#";

        const btnEliminar = document.createElement("span");
        btnEliminar.className = "xbutton";
        btnEliminar.textContent = "x";
        btnEliminar.title = "Eliminar";
        btnEliminar.addEventListener("click", () => {
          if (confirm("¿Estás seguro de eliminar esta nota?")) {
            tareas.splice(index, 1);
            guardar();
            render();
          }
        });

        const btnToggle = document.createElement("span");
        btnToggle.className = "tbutton";
        btnToggle.textContent = "✓";
        btnToggle.title = tarea.estado === "Pendiente" ? "Marcar como Terminada" : "Marcar como Pendiente";
        btnToggle.addEventListener("click", () => {
          tarea.estado = tarea.estado === "Pendiente" ? "Terminada" : "Pendiente";
          guardar();
          render();
        });

        const p = document.createElement("p");
        p.contentEditable = true;
        p.textContent = tarea.titulo;
        p.id = "item" + tarea.id;
        p.setAttribute("item", tarea.id);
        p.addEventListener("blur", () => {
          tareas[index].titulo = p.innerText;
          guardar();
        });

        a.appendChild(btnEliminar);
        a.appendChild(btnToggle);
        a.appendChild(p);
        li.appendChild(a);

        return li;
      }

      function render() {
        const searchText = searchInput.value.toLowerCase().trim();
        const filtradas = tareas.filter(t => t.titulo.toLowerCase().includes(searchText));

        const ulPendientes = document.createElement("ul");
        const ulTerminadas = document.createElement("ul");

        filtradas.forEach((tarea, index) => {
          const li = crearElementoTarea(tarea, index);
          if (tarea.estado === "Pendiente") {
            ulPendientes.appendChild(li);
          } else {
            ulTerminadas.appendChild(li);
          }
        });

        listadoTareas.innerHTML = `
          <h1>Pendientes</h1>
          <ul id="pendientes"></ul>
          <h1>Terminadas</h1>
          <ul id="terminadas"></ul>
        `;

        listadoTareas.querySelector("#pendientes").replaceWith(ulPendientes);
        listadoTareas.querySelector("#terminadas").replaceWith(ulTerminadas);
        listadoTareas.appendChild(botonAgregar); // Volver a insertar el botón
      }

      botonAgregar.addEventListener("click", () => {
        const nuevaTarea = {
          id: sigTareaId++,
          titulo: "Nueva nota",
          estado: "Pendiente"
        };
        tareas.push(nuevaTarea);
        guardar();
        render();
      });

      searchInput.addEventListener("input", render);

      render();
    });
