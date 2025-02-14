// ** fonction pour récupérer les projets depuis l'API ** // 
async function fetchProjects() {
  try {
    const apiUrl = "http://localhost:5678/api/works";
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Erreur : ${response.status}`);
    }

    const projects = await response.json();
    return projects; // retourne les projets récupérés // 
  } catch (error) {
    console.error("Erreur lors de la récupération des projets :", error);
  }
}

async function getCategories() {
  try {
    const apiUrl = "http://localhost:5678/api/categories";
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Erreur : ${response.status}`);
    }

    const projects = await response.json();
    return projects; // retourne les catégories récupérés // 
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories :", error);
  }
}

// ** fonction pour afficher les projets dans la galerie ** // 
function displayProjects(projects) {
  const gallery = document.querySelector(".gallery");

  gallery.innerHTML = ""; // vide la galerie avant d'ajouter des éléments // 

  projects.forEach((project) => {
    const figure = document.createElement("figure");

    const img = document.createElement("img");
    img.src = project.imageUrl; 
    img.alt = project.title; 

    const figcaption = document.createElement("figcaption");
    figcaption.textContent = project.title; 

    figure.appendChild(img);
    figure.appendChild(figcaption);

    gallery.appendChild(figure); // ajoute la figure à la galerie // 
  });
}

// ** appel des fonctions ** // 
fetchProjects().then((projects) => {
  if (projects) {
    displayProjects(projects);
  }
});


// ** création des boutons pour filtrer les travaux **
function createButtons(categories, works) {
// création d'un conteneur de boutons
const buttonContainer = document.createElement("div");
buttonContainer.className = "buttons-portfolio";  // ajout d'une classe CSS pour styliser le conteneur
const filter = document.querySelector(".filter");
filter.appendChild(buttonContainer);

// création du bouton "Tous" qui affiche tous les travaux
const allButton = document.createElement("button");
allButton.className = "filter-button"; 
allButton.innerText = "Tous";  // le texte du bouton
buttonContainer.appendChild(allButton);  // ajout du bouton "Tous" au conteneur

// //   // ajout d'un événement au clic sur le bouton "Tous"
allButton.addEventListener("click", () => displayProjects(works));  // lors du clic, on affiche tous les travaux

// //   // pour chaque catégorie, on crée un bouton spécifique
categories.forEach(category => {
// //     // création d'un bouton pour chaque catégorie
const button = document.createElement("button");
button.className = "filter-button"; 
button.innerText = category.name;  // le texte du bouton est le nom de la catégorie
buttonContainer.appendChild(button);  // ajout du bouton au conteneur

// //     // ajout d'un événement au clic sur ce bouton
button.addEventListener("click", () => {
const filteredWorks = works.filter(work => work.categoryId === category.id);
displayProjects(filteredWorks);  // affichage des travaux filtrés en fonction de la catégorie
});
});
}

async function init() {
  const categories = await getCategories();
  const projects = await fetchProjects();

  createButtons(categories, projects);
  displayProjects(projects);

  // Sélectionne tous les boutons après leur création
  const buttons = document.querySelectorAll(".filter-button");

  // Ajoute un gestionnaire de clic à chaque bouton
  buttons.forEach(button => {
    button.addEventListener("click", () => {
      // Supprime la classe 'active' de tous les boutons
      buttons.forEach(btn => btn.classList.remove("active"));
  
      // Ajoute la classe 'active' uniquement au bouton cliqué
      button.classList.add("active");
    });
  });
}

// // // ** lancement du script **
init();  // appel de la fonction `init` pour démarrer le processus
loginLogout();


/* AUTHENTIFICATION ET MODE LOGIN/LOGOUT */ 

function loginLogout () {

  // btn login, bandeau d'édition et btn modifier 
  const authButton = document.getElementById("login");
  const editBanner = document.querySelector(".loggedUserBanner");
  const openModalBtn = document.querySelector(".open-modal-btn");

  // on vérifie que l'utilisateur est connecté (le token est dans le localStorage)
  const token = localStorage.getItem("authToken");

  if (token) {
    // si un token existe l'utilisateur est connecté
    authButton.innerText = "logout"; // on change le texte du bouton en logout
    editBanner.style.display = "flex"; // affiche le bandeau d'édition
    openModalBtn.hidden = false; // affiche le btn modifier

    // si on clique on se déconnecte
    authButton.addEventListener("click", function () {
      localStorage.removeItem("authToken"); // on supprime le token
      location.reload(); // on recharge la page
    });

    // on ajoute un événement pour ouvrir la modale
    openModalBtn.addEventListener("click", () => {
      const modal = document.getElementById("modal");
      modal.style.display = "block";
      updateGalleryModal(); // galerie dans la modale
    });

  } else {
    // si aucun token l'utilisateur n'est pas connecté
    authButton.innerText = "login"; // le bouton reste login
    editBanner.style.display = "none"; // masque le bandeau d'édition
    openModalBtn.hidden = true; // masque le btn modifier

    // si on clique sur logout on va vers la page de connexion
    authButton.addEventListener("click", function () {
      window.location.href = "login.html"; 
    });
  }
}

/* AJOUT DES PROJETS DANS LA GALERIE DE LA MODALE */ 

// fonction pour récupérer et afficher les travaux dans la modale
async function updateGalleryModal() {
  try {
    const works = await fetchProjects(); // récupère les projets depuis l'API
    const galleryModal = document.querySelector(".galleryModal");

    if (galleryModal) {
      galleryModal.innerHTML = ""; // vide la galerie avant d'ajouter les nouvelles images

      works.forEach((work) => {
        const workElement = document.createElement("div");
        workElement.classList.add("work-item");

        const img = document.createElement("img");
        img.src = work.imageUrl;
        img.alt = work.title;

        // création de l'icône poubelle
        const deleteIcon = document.createElement("i");
        deleteIcon.classList.add("fa-solid", "fa-trash-can", "delete-icon");
        deleteIcon.dataset.id = work.id; // on stocke l'ID du projet dans l'icône

        // ajoute un événement de suppression sur l'icône
        deleteIcon.addEventListener("click", async (event) => {
        event.stopPropagation(); // empêche le déclenchement d'autres événements
        await deleteProject(work.id); // supprime le projet via l'API
        updateGalleryModal(); // rafraîchit la galerie après suppression
        fetchProjects().then(displayProjects); // met à jour la galerie principale
        });

        // ajouter l'image et le bouton dans l'élément de la galerie
        workElement.appendChild(img);
        galleryModal.appendChild(workElement);
        workElement.appendChild(deleteIcon);
      });

    }
  } catch (error) {
    console.error("Erreur lors du chargement de la galerie de la modale :", error);
  }
}


// fonction pour supprimer un projet

async function deleteProject(id) {
  const token = localStorage.getItem("authToken"); // Récupère le token pour l'authentification

  if (!token) {
    alert("Vous devez être connecté pour supprimer un projet.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`, // Authentification
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


/* OUVERTURE/FERMETURE DE LA MODALE */ 

// fermer la modale en cliquant sur la croix
const closeModalBtn = document.querySelector(".close");
closeModalBtn.addEventListener("click", () => {
  const modal = document.getElementById("modal");
  modal.style.display = "none";
});

// fermer la modale en cliquant à côté
window.addEventListener("click", (event) => {
  const modal = document.getElementById("modal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

/* AFFICHAGE MODALE AJOUT PHOTO */

// Sélection des éléments nécessaires

const modalContent = document.querySelector(".modal-content");
const addPhotoButton = document.querySelector(".add-photo-btn");

// Fonction pour afficher le formulaire d'ajout de photo
function showAddPhotoView() {
    modalContent.innerHTML = `

        <div class="add-photo-modal"> 

          <div class="add-photo-modal-nav">
          <i class="fa-solid fa-arrow-left" id="back-btn"></i>
          <i class="close fa-solid fa-xmark"></i>
          </div>
        
          <p class="modal-title">Ajout photo</p>

          <div class="img-upload-zone">
            <i class="fa-regular fa-image"></i>

            <label for="img-upload-btn" class="img-upload-btn">+ Ajouter photo</label>
            <input type="file" name="work-title" id="img-upload-btn" required hidden>

            <p class="add-photo-legend">jpg, png : 4mo max</p>

          </div>

          <form id="add-photo-form">
            <label for="work-title">Titre</label>
            <input type="work-title" name="work-title" id="work-title" required>
                
            <label for="password">Catégorie</label>
            <select id="category">
            </select>
                        
            <hr />
            <button class="btnValider">Valider</button>
          </form>


        </div>
    `;


  // Ajoute l'événement pour revenir à la galerie
  document.getElementById("back-btn").addEventListener("click", function () {
    const modal = document.querySelector(".modal-content");
    // modal.innerHTML = ""; // vide la galerie avant d'ajouter des éléments // 
    
    updateGalleryModal();

  });

  // Re-sélectionne le bouton de fermeture après mise à jour
  document.querySelector(".close").addEventListener("click", () => {
  modal.style.display = "none";
  });



}

// Ajoute l'événement au bouton "Ajouter une photo"
addPhotoButton.addEventListener("click", showAddPhotoView);


