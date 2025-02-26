
const form = document.getElementById("login-form");
  
    form.addEventListener("submit", async (event) => {
      event.preventDefault(); 
  
      const email = document.getElementById("email").value; 
      const password = document.getElementById("password").value; 
  
      try {
    
        const response = await fetch("http://localhost:5678/api/users/login", {
          method: "POST", 
          headers: { "Content-Type": "application/json" }, 
          body: JSON.stringify({ email, password }) 
        });
  
      
        if (!response.ok) {
          throw new Error("Erreur dans l’identifiant ou le mot de passe");
        }
  
       
        const data = await response.json();
  
       
        const token = data.token;
  
      
        localStorage.setItem("authToken", token);
  
        
        window.location.href = "index.html"; 
      } catch (error) {
        
        const errorMessage = document.createElement("p");
        errorMessage.classList.add("error-message");
        errorMessage.style.color = "red"; 
        errorMessage.textContent = error.message; 
  
        
        form.appendChild(errorMessage);
      }
    });
