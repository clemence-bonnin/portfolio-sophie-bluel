// on récupère l'id du formulaire dans le html
const form = document.getElementById("login-form");
  
    // quand l'utilisateur clique sur le bouton "se connecter"
    form.addEventListener("submit", async (event) => {
      event.preventDefault(); // on empêche la page de se recharger
  
      // on récupère les valeurs saisies par l'utilisateur
      const email = document.getElementById("email").value; // email
      const password = document.getElementById("password").value; // mot de passe
  
      try {
        // on envoie ces données au serveur
        const response = await fetch("http://localhost:5678/api/users/login", {
          method: "POST", // on envoie des données
          headers: { "Content-Type": "application/json" }, // on précise qu'on envoie du JSON
          body: JSON.stringify({ email, password }) // on transforme nos données en JSON
        });
  
        // si le serveur renvoie une erreur (exemple : mauvais identifiants)
        if (!response.ok) {
          throw new Error("Erreur dans l’identifiant ou le mot de passe");
        }
  
        // on récupère les données JSON de la réponse
        const data = await response.json();
  
        // connexion réussie : on récupère le token du serveur
        const token = data.token;
  
        // on stocke le token dans le localStorage
        localStorage.setItem("authToken", token);
  
        // on redirige l'utilisateur vers la page avec les boutons d'action
        window.location.href = "index.html"; 
      } catch (error) {
        // en cas d'erreur, on affiche un message sous le formulaire
        const errorMessage = document.createElement("p");
        errorMessage.classList.add("error-message");
        errorMessage.style.color = "red"; 
        errorMessage.textContent = error.message; 
  
        // on l'ajoute en bas du formulaire
        form.appendChild(errorMessage);
      }
    });
