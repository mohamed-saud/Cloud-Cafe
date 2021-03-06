const cafeLest = document.querySelector("#cafe-list");
const form = document.querySelector("#add-cafe-form");
const db_collection = db.collection("cafes");
const emtyLest = document.querySelector("#emty");

function renderCafe(doc) {
  let li = document.createElement("li");
  let name = document.createElement("span");
  let city = document.createElement("span");
  let crus = document.createElement("div");

  li.setAttribute("data-id", doc.id);

  name.textContent = doc.data().name;
  city.textContent = doc.data().city;
  crus.textContent = "x";

  li.appendChild(name);
  li.appendChild(city);
  li.appendChild(crus);

  cafeLest.appendChild(li);

  //////Delet elment
  crus.addEventListener("click", (e) => {
    let id = crus.parentElement.getAttribute("data-id");
    db_collection.doc(id).delete();
  });
}
///////get datat from firebas
// db.collection("cafes")
//   .get()
//   .then((snaoshot) => {
//     snaoshot.docs.forEach((doc) => {
//       renderCafe(doc);
//     });
//   });

///////////////real time lesntener
db_collection.orderBy("city").onSnapshot((snapshot) => {
  let changes = snapshot.docChanges();
  changes.forEach((change) => {
    if (change.type == "added") {
      renderCafe(change.doc);
    } else if (change.type == "removed") {
      let li = document.querySelector("[data-id=" + change.doc.id + "]");
      cafeLest.removeChild(li);
    }
    if (cafeLest.children.length > 0) {
      emtyLest.textContent = "";
    } else {
      emtyLest.textContent = "Cafe name is emty ";
    }
  });
});

//////////// send datat to firebase
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (form.name.value == "") {
    swal("pleas add Cafe name");
  } else {
    db_collection.add({
      name: form.name.value,
      city: form.city.value,
    });
    swal("you'r Cafe is add", "Cafe name is :" + form.name.value, "success");
  }

  form.name.value = "";
  form.city.value = "";
});

window.onload = function () {
  if (cafeLest.children.length > 0) {
    emtyLest.textContent = "";
  } else {
    emtyLest.textContent = "Cafe name is emty ";
  }
};
