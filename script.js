const apikey = "b2dd8175-8d86-422a-9555-814473585ffd";
const apihost = "https://todo-api.coderslab.pl";

function apiCreateTask(title, description) {
  return fetch(`https://todo-api.coderslab.pl/api/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: apikey,
    },
    body: JSON.stringify({
      title: title,
      description: description,
      status: "open",
    }),
  })
    .then(function (response) {
      return response.json();
    })
    .catch(function (error) {
      console.error(error);
    });
}

function apiUpdateTask(taskId, title, description, status) {
  return fetch(`https://todo-api.coderslab.pl/api/tasks/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: apikey,
    },
    body: JSON.stringify({
      title: title,
      description: description,
      status: status,
    }),
  })
    .then(function (response) {
      return response.json();
    })
    .catch(function (error) {
      console.error(error);
    });
}

function apiUpdateOperation(operationId, description, timeSpent) {
  return fetch(`https://todo-api.coderslab.pl/api/operations/${operationId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: apikey,
    },
    body: JSON.stringify({
      description: description,
      timeSpent: timeSpent,
    }),
  })
    .then(function (response) {
      return response.json();
    })
    .catch(function (error) {
      console.error(error);
    });
}

function apiListTask() {
  return fetch("https://todo-api.coderslab.pl/api/tasks", {
    headers: {
      Authorization: apikey,
    },
  })
    .then(function (response) {
      return response.json();
    })
    .catch(function (error) {
      console.error(error);
    });
}

function apiDeleteTask(taskId) {
  return fetch(`https://todo-api.coderslab.pl/api/tasks/${taskId}`, {
    method: "DELETE",
    headers: {
      Authorization: apikey,
    },
  })
    .then(function (response) {
      return response.json();
    })
    .catch(function (error) {
      console.error(error);
    });
}

function apiListOperationForTask(taskId) {
  return fetch(`https://todo-api.coderslab.pl/api/tasks/${taskId}/operations`, {
    headers: {
      Authorization: apikey,
    },
  })
    .then(function (response) {
      return response.json();
    })
    .catch(function (error) {
      console.error(error);
    });
}

function apiCreateOperationForTask(taskId, description) {
  return fetch(`https://todo-api.coderslab.pl/api/tasks/${taskId}/operations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: apikey,
    },
    body: JSON.stringify({
      description: description,
      timeSpent: 0,
    }),
  })
    .then(function (response) {
      return response.json();
    })
    .catch(function (error) {
      console.error(error);
    });
}

function apiDeleteOperation(operationId) {
  return fetch(`https://todo-api.coderslab.pl/api/operations/${operationId}`, {
    method: "DELETE",
    headers: {
      Authorization: apikey,
    },
  })
    .then(function (response) {
      return response.json();
    })
    .catch(function (error) {
      console.error(error);
    });
}

function renderTask(taskId, title, description, status) {
  const section = document.createElement("section");
  section.className = "card mt-5 shadow-sm";
  document.querySelector("main").appendChild(section);

  const mainDiv = document.createElement("div");
  mainDiv.className =
    "card-header d-flex justify-content-between align-items-center";
  section.appendChild(mainDiv);

  const divInner = document.createElement("div");
  mainDiv.appendChild(divInner);

  const h5 = document.createElement("h5");
  h5.innerText = title;
  divInner.appendChild(h5);

  const h6 = document.createElement("h6");
  h6.className = "card-subtitle text-muted";
  h6.innerText = description;
  divInner.appendChild(h6);

  const divInner2 = document.createElement("div");
  mainDiv.appendChild(divInner2);

  if (status == "open") {
    const finishButton = document.createElement("button");
    finishButton.className = "btn btn-dark btn-sm js-task-open-only";
    finishButton.innerText = "Finish";
    divInner2.appendChild(finishButton);
    finishButton.addEventListener("click", function () {
      apiUpdateTask(taskId, title, description, "closed");
      section
        .querySelectorAll(".js-task-open-only")
        .forEach(function (element) {
          element.parentElement.removeChild(element);
        });
    });
  }

  const deleteButton = document.createElement("button");
  deleteButton.className = "btn btn-outline-danger btn-sm ml-2";
  deleteButton.innerText = "Delete";
  divInner2.appendChild(deleteButton);

  deleteButton.addEventListener("click", function () {
    apiDeleteTask(taskId).then(function () {
      section.parentElement.removeChild(section);
    });
  });

  const ul = document.createElement("ul");
  ul.className = "list-group list-group-flush";
  section.appendChild(ul);

  apiListOperationForTask(taskId).then(function (response) {
    response.data.forEach(function (operation) {
      renderOperation(
        ul,
        status,
        operation.id,
        operation.description,
        operation.timeSpent
      );
    });
  });

  if (status == "open") {
    const divInput = document.createElement("div");
    divInput.className = "card-body js-task-open-only";
    section.appendChild(divInput);

    const form = document.createElement("form");
    divInput.appendChild(form);

    const divInput1 = document.createElement("div");
    divInput1.className = "input-group";
    form.appendChild(divInput1);

    const input = document.createElement("input");
    input.className = "form-control";
    input.setAttribute("type", "text");
    input.setAttribute("placeholder", "Operation description");
    input.setAttribute("minlength", "5");
    divInput1.appendChild(input);

    const divInput2 = document.createElement("div");
    divInput2.className = "input-group-append";
    divInput1.appendChild(divInput2);

    const buttonAdd = document.createElement("button");
    buttonAdd.className = "btn btn-info";
    buttonAdd.innerText = "Add";
    divInput2.appendChild(buttonAdd);

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      apiCreateOperationForTask(taskId, input.value).then(function (response) {
        renderOperation(
          ul,
          status,
          response.data.id,
          response.data.description,
          response.data.timeSpent
        );
      });
      form.reset();
    });
  }
}

function renderOperation(
  ul,
  status,
  operationId,
  operationDescription,
  timeSpent
) {
  const li = document.createElement("li");
  li.className =
    "list-group-item d-flex justify-content-between align-items-center";
  ul.appendChild(li);

  const descriptionDiv = document.createElement("div");
  descriptionDiv.innerText = operationDescription;
  li.appendChild(descriptionDiv);

  const time = document.createElement("span");
  time.className = "badge badge-success badge-pill ml-2";
  time.innerText = formatTime(timeSpent);
  descriptionDiv.appendChild(time);

  if (status == "open") {
    const controlDiv = document.createElement("div");
    controlDiv.className = "js-task-open-only";
    li.appendChild(controlDiv);

    const add15minButton = document.createElement("button");
    add15minButton.className = "btn btn-outline-success btn-sm mr-2";
    add15minButton.innerText = "+15m";
    controlDiv.appendChild(add15minButton);

    add15minButton.addEventListener("click", function () {
      apiUpdateOperation(
        operationId,
        operationDescription,
        timeSpent + 15
      ).then(function (response) {
        time.innerText = formatTime(response.data.timeSpent);
        timeSpent = response.data.timeSpent;
      });
    });

    const add1hButton = document.createElement("button");
    add1hButton.className = "btn btn-outline-success btn-sm mr-2";
    add1hButton.innerText = "+60m";
    controlDiv.appendChild(add1hButton);

    add1hButton.addEventListener("click", function () {
      apiUpdateOperation(
        operationId,
        operationDescription,
        timeSpent + 60
      ).then(function (response) {
        time.innerText = formatTime(response.data.timeSpent);
        timeSpent = response.data.timeSpent;
      });
    });

    const deleteButton = document.createElement("button");
    deleteButton.className = "btn btn-outline-danger btn-sm";
    deleteButton.innerText = "Delete";
    controlDiv.appendChild(deleteButton);

    deleteButton.addEventListener("click", function () {
      apiDeleteOperation(operationId).then(function () {
        li.parentElement.removeChild(li);
      });
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  apiListTask().then(function (response) {
    response.data.forEach(function (task) {
      renderTask(task.id, task.title, task.description, task.status);
    });
  });

  const form2 = document.querySelector(".js-task-adding-form");
  form2.addEventListener("submit", function (event) {
    event.preventDefault();
    apiCreateTask(
      event.target.elements.title.value,
      event.target.elements.description.value
    ).then(function (response) {
      renderTask(
        response.data.id,
        response.data.title,
        response.data.description,
        response.data.status
      );
    });
    form2.reset();
  });
});

function formatTime(timeSpent) {
  const hours = Math.floor(timeSpent / 60);
  const minutes = timeSpent % 60;

  if (hours > 0) {
    return hours + "h " + minutes + "m";
  } else {
    return minutes + "m";
  }
}
