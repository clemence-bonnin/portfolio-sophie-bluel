// **** fonction pour récupérer les projets depuis l'API **** // 
async function fetchProjects() {
  try {
    const apiUrl = "http://localhost:5678/api/works";
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Erreur : ${response.status}`);
    }

    const projects = await response.json();
    return projects; 
  } catch (error) {
    console.error("Erreur lors de la récupération des projets :", error);
  }
}

// **** fonction pour récupérer les catégories depuis l'API **** // 
async function getCategories() {
  try {
    const apiUrl = "http://localhost:5678/api/categories";
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Erreur : ${response.status}`);
    }

    const categories = await response.json();
    return categories;  
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories :", error);
  }
}

// **** fonction pour afficher les projets dans la gallery **** // 
function displayProjects(projects) {
  const gallery = document.querySelector(".gallery");

  gallery.innerHTML = ""; // vide la galerie avant d'ajouter des éléments // 

  projects.forEach((project) => {
    const projectCard = document.createElement("projectCard");

    const img = document.createElement("img");
    img.src = project.imageUrl; 
    img.alt = project.title; 

    const figcaption = document.createElement("figcaption");
    figcaption.textContent = project.title; 

    projectCard.appendChild(img);
    projectCard.appendChild(figcaption);

    gallery.appendChild(projectCard); 
  });
}

// appel des fonctions // 
fetchProjects().then((projects) => {
  if (projects) {
    displayProjects(projects);
  }
});

// **** fonction pour créer les boutons pour filtrer les travaux **** //
function createButtons(categories, works) {

  // création d'un conteneur de boutons  // 
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "buttons-portfolio"; 
  const filter = document.querySelector(".filter");
  filter.appendChild(buttonContainer);

  // création du bouton "Tous" qui affiche tous les travaux // 
  const allButton = document.createElement("button");
  allButton.className = "filter-button"; 
  allButton.innerText = "Tous"; 
  buttonContainer.appendChild(allButton); 

  // ajout d'un événement au clic sur le bouton "Tous" // 
  allButton.addEventListener("click", () => displayProjects(works));  

  // pour chaque catégorie on crée un bouton // 
  categories.forEach(category => {

  const button = document.createElement("button");
  button.className = "filter-button"; 
  button.innerText = category.name;  // le texte du bouton est le nom de la catégorie // 
  buttonContainer.appendChild(button);  // ajout du bouton au conteneur // 

  button.addEventListener("click", () => {
  const filteredWorks = works.filter(work => work.categoryId === category.id);
  displayProjects(filteredWorks);  // affichage des travaux filtrés en fonction de la catégorie //
  });
  });

  // activer le bouton "Tous" par défaut // 
  allButton.classList.add("active");
  displayProjects(works);  // affiche tous les projets au chargement //

}


// **** fonction pour initaliser le projet et la gestion des boutons pour filtrer **** //
async function init() {
  const categories = await getCategories();
  const projects = await fetchProjects();

  createButtons(categories, projects);
  displayProjects(projects);

  // sélectionne tous les boutons après leur création //
  const buttons = document.querySelectorAll(".filter-button");

  // ajoute un évenement de clic à chaque bouton //
  buttons.forEach(button => {
    button.addEventListener("click", () => {
      // supprime la classe 'active' de tous les boutons //
      buttons.forEach(btn => btn.classList.remove("active"));
  
      // ajoute la classe 'active' uniquement au bouton cliqué //
      button.classList.add("active");
    });
  });
}

// **** lancement du script **** //
init(); 
loginLogout();

// **** ouverture/fermeture de la modale **** //
function showModal() {
  let modal = document.getElementById("modal");

  if (!modal) {
    modal = document.createElement("div");
    modal.id = "modal";
    modal.className = "modal";
    modal.innerHTML = `
      <div class="modal-content">
        <div class="close-first-view-modal">
          <span class="close"><i class="fa-solid fa-xmark"></i></span>
        </div>
        <p class="modal-title">Galerie photo</p>
        <div class="galleryModal"></div>
        <hr />
        <button class="add-photo-btn">Ajouter une photo</button>
      </div>
    `;
    document.body.appendChild(modal);
  }

  modal.style.display = "block";

  // revenir à la vue 1 de la modale à chaque fois qu'on l'ouvre //
  resetModalContent();

  // gérer la fermeture de la modale avec la croix //
  const closeButton = modal.querySelector(".close");
  closeButton.addEventListener("click", () => {
    resetModalContent();  
    modal.style.display = "none";  
  });

  // la modale se ferme quand on clique en dehors de la modale //
  window.addEventListener("click", (e) => e.target === modal && (modal.style.display = "none"));
  
  // quand on clique sur "ajouter une photo" on passe à la vue 2 de la modale //
  modal.querySelector(".add-photo-btn").addEventListener("click", showAddPhotoView);
}


// **** fonction pour l'authentification et la gestion de login/logout **** //
function loginLogout () {
  const authButton = document.getElementById("login");
  const editBanner = document.querySelector(".loggedUserBanner");
  const openModalBtn = document.querySelector(".open-modal-btn");
  const filterBar = document.querySelector(".filter"); 
  const token = localStorage.getItem("authToken");

  if (token) {
    authButton.innerText = "logout";
    editBanner.style.display = "flex";
    openModalBtn.hidden = false;
    filterBar.hidden = true;

    authButton.addEventListener("click", function () {
      localStorage.removeItem("authToken");
      location.reload();
    });

    openModalBtn.addEventListener("click", () => {
      showModal();
      updateGalleryModal();
    });
  } else {
    authButton.innerText = "login";
    editBanner.style.display = "none";
    openModalBtn.hidden = true;

    authButton.addEventListener("click", function () {
      window.location.href = "login.html"; 
    });
  }
}

// **** fonction pour gérer les vues de la modale **** //
async function resetModalContent() {
  const modalContent = document.querySelector(".modal-content");

  // réinitialise le contenu de la modale pour revenir à la vue 1 //
  modalContent.innerHTML = `
    <div class="close-first-view-modal">
      <span class="close"><i class="fa-solid fa-xmark"></i></span>
    </div>
    <p class="modal-title">Galerie photo</p>
    <div class="galleryModal"></div>
    <hr />
    <button class="add-photo-btn">Ajouter une photo</button>
  `;

  // événement pour montrer la vue 2 au clic sur le bouton "ajouter une photo" //
  modalContent.querySelector(".add-photo-btn").addEventListener("click", showAddPhotoView);

  // rafraîchit la galerie et attend la fin du chargement //
  await updateGalleryModal();
}





// **** fonction pour récupérer et afficher les travaux dans la modale **** //
async function updateGalleryModal() {
  try {
    const works = await fetchProjects(); // récupère les projets depuis l'API //
    const galleryModal = document.querySelector(".galleryModal");

    if (galleryModal) {
      galleryModal.innerHTML = ""; // vide la galerie avant d'ajouter les nouvelles images //

      // pour chaque projet on crée les éléments nécessaires //
      works.forEach((work) => {
        const workElement = document.createElement("div");
        workElement.classList.add("work-item");

        const img = document.createElement("img");
        img.src = work.imageUrl;
        img.alt = work.title;

        // création de l'icône poubelle //
        const trashIcon = document.createElement("i");
        trashIcon.classList.add("fa-solid", "fa-trash-can", "delete-icon");
        trashIcon.dataset.id = work.id; // on stocke l'ID du projet dans l'icône //

        // événement de suppression sur l'icône poubelle //
        trashIcon.addEventListener("click", async (event) => {
          event.stopPropagation(); // empêche le déclenchement d'autres événements //

          // suppression du projet via l'API //
          await deleteProject(work.id);

          // réactualise la gallery de la modale //
          await updateGalleryModal(); 

          // rafraîchit la gallery principale //
          fetchProjects().then(displayProjects);
        });

        workElement.appendChild(img);
        galleryModal.appendChild(workElement);
        workElement.appendChild(trashIcon);
      });
    }
  } catch (error) {
    console.error("Erreur lors du chargement de la galerie de la modale :", error);
  }
}

// **** fonction pour supprimer un projet **** //
async function deleteProject(id) {
  const token = localStorage.getItem("authToken"); 

  if (!token) {
    alert("Vous devez être connecté pour supprimer un projet.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`, 
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Erreur lors de la suppression : ${response.status}`);
    }

    console.log(`Projet ${id} supprimé avec succès`);
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
  }
}

// **** fonction pour récupérer les catégories dans le formulaire **** //
async function loadCategories() {
  try {
    const categories = await getCategories();
    const categorySelect = document.querySelector("#category");

    // vide les options existantes //
    categorySelect.innerHTML = "";

    // ajoute une option vide au début //
    const defaultOption = document.createElement("option");
    defaultOption.value = ""; 
    defaultOption.textContent = ""; 
    categorySelect.appendChild(defaultOption);

    categories.forEach(category => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      categorySelect.appendChild(option);
    });

  } catch (error) {
    console.error("Erreur lors du chargement des catégories :", error);
  }
}


// **** fonction pour afficher la vue 1 de la modale avec la gallery  **** //
function showGalleryView() {
  const modalContent = document.querySelector(".modal-content");

  modalContent.innerHTML = `
    <div class="close-first-view-modal">
      <span class="close"><i class="fa-solid fa-xmark"></i></span>
    </div>
    <p class="modal-title">Galerie photo</p>
    <div class="galleryModal"></div>
    <hr />
    <button class="add-photo-btn">Ajouter une photo</button>
  `;

  updateGalleryModal();

  // montrer la vue 2 au clic sur "ajouter une photo" //
  modalContent.querySelector(".add-photo-btn").addEventListener("click", showAddPhotoView);

  // fermer la modale avec la croix //
  const closeButton = modalContent.querySelector(".close");
  closeButton.addEventListener("click", () => {
    const modal = document.getElementById("modal");
    modal.style.display = "none";  
  });

  // fermer la modale si on clique en dehors //
  window.addEventListener("click", (e) => {
    const modal = document.getElementById("modal");
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
}

// **** fonction pour afficher la vue 2 de la modale avec le formulaire **** //
function showAddPhotoView() {
  const modalContent = document.querySelector(".modal-content");

  modalContent.innerHTML = `
    <div class="add-photo-modal"> 
      <div class="add-photo-modal-nav">
        <i class="fa-solid fa-arrow-left" id="back-btn"></i>
        <i class="close fa-solid fa-xmark"></i>
      </div>
      <p class="modal-title">Ajout photo</p>
      <div class="img-upload-zone">
        <div id="preview-container">
          <i class="fa-regular fa-image"></i>
          <img id="filePreview" src="" alt="Prévisualisation">
        </div>
        <label for="img-upload-btn" class="img-upload-btn">+ Ajouter photo</label>
        <input type="file" name="work-title" id="img-upload-btn" required hidden>
        <p class="add-photo-legend">jpg, png : 4mo max</p>
      </div>
      <form id="add-photo-form">
        <label for="work-title">Titre</label>
        <input type="work-title" name="work-title" id="work-title" required>
        <label for="category">Catégorie</label>
        <select id="category"></select>
        <hr />
        <button class="btnValider" disabled>Valider</button>
      </form>
    </div>
  `;

  loadCategories(); // liste des catégories dans le formulaire //
  setupFileUpload(); // gère l'upload et la prévisualisation de l'image //

  // revenir à la vue 1 au clic sur la fléche //
  document.getElementById("back-btn").addEventListener("click", function () {
    showGalleryView();
  });

  // fermer la modale avec la croix //
  document.querySelector(".close").addEventListener("click", () => {
    const modal = document.getElementById("modal");
    modal.style.display = "none"; 
  });

  // vérifie si tous les champs sont remplis //
  const form = document.getElementById("add-photo-form");
  form.addEventListener("input", () => {
    const titleInput = document.getElementById("work-title");
    const categorySelect = document.getElementById("category");
    const fileInput = document.getElementById("img-upload-btn");

    const validateButton = form.querySelector(".btnValider");
    if (titleInput.value && categorySelect.value && fileInput.files.length > 0) {
      validateButton.disabled = false;  // active le bouton //
    } else {
      validateButton.disabled = true;  // désactive le bouton //
    }
  });

  // envoi du formulaire //
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    await addNewWork();
  });
}


// **** fonction prévisualisation de l’image **** //
function setupFileUpload() {
  const fileInput = document.getElementById("img-upload-btn");

  fileInput.addEventListener("change", () => {
      previewPhoto();
  });
}

function previewPhoto() {
  const fileInput = document.getElementById("img-upload-btn");
  const file = fileInput.files[0];
  const preview = document.getElementById("filePreview");
  const previewContainer = document.getElementById("preview-container");
  const addPhotoBtn = document.querySelector(".img-upload-btn");  
  const addPhotoLegend = document.querySelector(".add-photo-legend");  


  if (file) {
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
          preview.src = event.target.result;
          preview.style.display = "block";
          previewContainer.querySelector("i").style.display = "none"; 
          addPhotoBtn.style.display = "none";  
          addPhotoLegend.style.display = "none"; 
      };
      fileReader.readAsDataURL(file);
  }
}

// **** fonction envoi photo et mise à jour de la galerie **** //
async function addNewWork() {

  const form = document.getElementById("add-photo-form"); 
  const fileInput = document.getElementById("img-upload-btn"); 
  const titleInput = document.getElementById("work-title"); 
  const categorySelect = document.getElementById("category"); 

  const formData = new FormData(); 

  if (!fileInput.files[0] || !titleInput.value || !categorySelect.value) { // vérifie que les champs sont bien remplis //
    alert("Veuillez remplir tous les champs et ajouter une image.");
    return;
  }

  formData.append("image", fileInput.files[0]); 
  formData.append("title", titleInput.value); 
  formData.append("category", categorySelect.value);

  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
       headers: {
          Authorization: `Bearer ${token}`, 
        },
        body: formData,
      });

      if (!response.ok) {
          throw new Error(`Erreur ${response.status} : Impossible d'ajouter la photo`);
      }

      await updateGalleryModal(); // met à jour la gallery de la modale //
      fetchProjects().then(displayProjects); // met à jour la gallery principale //
      
      showAddPhotoView(); 

  } catch (error) {
      console.error("Erreur lors de l'ajout du projet :", error);
  }
}