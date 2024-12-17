document.addEventListener('DOMContentLoaded', () => {
    const starsContainer = document.querySelector('#firstsection');
    let mouseX = 0;
    let mouseY = 0;
  
    document.addEventListener('mousemove', (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });
  
    for (let i = 0; i < 60; i++) {
      createStar();
    }
  
    function createStar() {
      const star = document.createElement('div');
      star.classList.add('star');
      star.style.top = `${Math.random() * 100}%`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.animationDuration = `${Math.random() * 6 + 1}s`;
      starsContainer.appendChild(star);
    }
  
    function showStarName(star) {
      const nameElement = document.createElement('div');
      nameElement.classList.add('star-name');
      nameElement.textContent = star.dataset.name;
      
      const rect = star.getBoundingClientRect();
      const containerRect = starsContainer.getBoundingClientRect();
      
      let left = rect.left - containerRect.left + 15;
      let top = rect.top - containerRect.top - 15;
      
      // Ensure the name doesn't go off-screen
      if (left + 100 > containerRect.width) left = rect.left - containerRect.left - 115;
      if (top < 0) top = rect.top - containerRect.top + 25;
      
      nameElement.style.left = `${left}px`;
      nameElement.style.top = `${top}px`;
      
      starsContainer.appendChild(nameElement);
    }

    function hideStarName() {
      const nameElement = document.querySelector('.star-name');
      if (nameElement) {
          nameElement.remove();
      }
    }

    function createConstellation() {
      const padding = 20; // Increase padding to keep stars further from edges
      const width = window.innerWidth - 2 * padding;
      const height = window.innerHeight - 2 * padding;
      const scale = Math.min(width / 100, height / 100);
      const centerX = width / 2;
      const centerY = height / 2;
      const rotation = Math.random() * 2 * Math.PI; // Random rotation in radians

      const littleBearStars = [
        {x: 30, y: 45, name: 'Pherkad'},
        {x: 30, y: 55, name: 'Zeta UMi'},
        {x: 15, y: 55, name: 'Pherkad'},
        {x: 13, y: 45, name: 'Kochab'},
        {x: 52, y: 20, name: 'Polaris'},
        {x: 40, y: 40, name: 'Epsilon UMi'},
        {x: 48, y: 30, name: 'Yildun'},
      ];

      const transformedStars = littleBearStars.map(star => {
        const x = star.x - 50;
        const y = star.y - 50;
        const rotatedX = x * Math.cos(rotation) - y * Math.sin(rotation);
        const rotatedY = x * Math.sin(rotation) + y * Math.cos(rotation);
        return {
          x: ((rotatedX * scale + centerX) / window.innerWidth * 100).toFixed(2),
          y: ((rotatedY * scale + centerY) / window.innerHeight * 100).toFixed(2),
          name: star.name
        };
      });

      // Use transformedStars instead of littleBearStars in the rest of the function
      transformedStars.forEach((star, index) => {
        const starContainer = document.createElement('div');
        starContainer.classList.add('star-container');
        starContainer.style.top = `${star.y}%`;
        starContainer.style.left = `${star.x}%`;
        starContainer.dataset.name = star.name;

        const starElement = document.createElement('div');
        starElement.classList.add('star', 'constellation-star');

        // Make Polaris (North Star) slightly bigger and brighter by default
        if (index === 4) {
          starElement.classList.add('polaris');
        }

        starContainer.appendChild(starElement);
        starsContainer.appendChild(starContainer);

        // Add hover effect to the container
        starContainer.addEventListener('mouseenter', (e) => {
          starElement.classList.add('hovered');
          showStarName(starContainer);
        });
        starContainer.addEventListener('mouseleave', (e) => {
          starElement.classList.remove('hovered');
          hideStarName();
        });
      });

      // Update the line drawing code to use transformedStars
      const lineOrder = [0, 1, 2, 3, 0, 5, 6, 4];
      for (let i = 1; i < lineOrder.length; i++) {
        const star = transformedStars[lineOrder[i]];
        const prevStar = transformedStars[lineOrder[i-1]];
        drawLine(prevStar, star);
      }

      // Function to show the constellation
      function showConstellation() {
        document.querySelectorAll('.constellation-star:not(.polaris)').forEach(star => {
          star.classList.add('bright');
        });
        document.querySelectorAll('.constellation-line').forEach(line => {
          line.classList.add('visible');
        });

        // Hide after 2 seconds
        setTimeout(hideConstellation, 2000);
      }

      // Function to hide the constellation
      function hideConstellation() {
        document.querySelectorAll('.constellation-star:not(.polaris)').forEach(star => {
          star.classList.remove('bright');
        });
        document.querySelectorAll('.constellation-line').forEach(line => {
          line.classList.remove('visible');
        });
      }

      // Show constellation every 10 seconds
      setInterval(showConstellation, 7000);
    }
  
    function drawLine(start, end) {
      const line = document.createElement('div');
      line.classList.add('constellation-line');
      
      // Get the actual dimensions of the container
      const containerRect = starsContainer.getBoundingClientRect();
      
      // Calculate start and end positions in pixels
      const startX = (start.x / 100) * containerRect.width;
      const startY = (start.y / 100) * containerRect.height;
      const endX = (end.x / 100) * containerRect.width;
      const endY = (end.y / 100) * containerRect.height;
      
      // Calculate length and angle using pixel values
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const angle = Math.atan2(deltaY, deltaX);
      
      // Set line properties
      line.style.width = `${length}px`;
      line.style.left = `${start.x}%`;
      line.style.top = `${start.y}%`;
      line.style.transform = `rotate(${angle}rad)`;
      line.style.transformOrigin = '0 0';
      
      starsContainer.appendChild(line);
    }
  
    createConstellation(); // DISABLE ursa minor
  
    function updateStarsPosition() {
      const stars = document.querySelectorAll('.star');
  
      stars.forEach((star) => {
        const speed = parseFloat(star.style.animationDuration) || 1;
        const offsetX = mouseX * speed * 2; // Adjust the sensitivity factor
        const offsetY = -mouseY * speed * 2; // Adjust the sensitivity factor
  
        star.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      });
  
      requestAnimationFrame(updateStarsPosition);
    }
  
    updateStarsPosition();
  
    // DISABLE ursa minor
    /*
    document.addEventListener('click', () => {
      document.querySelectorAll('.constellation-star').forEach(star => {
        star.style.width = star.style.width === '3px' ? '1px' : '3px';
        star.style.height = star.style.height === '3px' ? '1px' : '3px';
        star.style.boxShadow = star.style.boxShadow ? '' : '0 0 10px 2px white';
      });
      document.querySelectorAll('.constellation-line').forEach(line => {
        line.style.opacity = line.style.opacity === '1' ? '0' : '1';
      });
    });
    */
});
