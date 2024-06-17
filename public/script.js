document.addEventListener('DOMContentLoaded', function () {
    const themeToggle = document.getElementById('themeToggle');
    const generateBtn = document.getElementById('generateBtn');
    const loadingIndicator = document.getElementById('loading');
    const imageContainer = document.getElementById('imageContainer');
  
    // Event listener for theme toggle
    themeToggle.addEventListener('change', function () {
      document.body.classList.toggle('dark', themeToggle.checked);
    });
  
    generateBtn.addEventListener('click', function () {
      generateImage();
    });
  
    function generateImage() {
      const prompt = document.getElementById('text').value;
      const size = document.getElementById('sizeSelect').value;
      const style = document.getElementById('styleSelect').value;
      const quality = document.getElementById('qualitySelect').value;
  
      if (!prompt) {
        alert('Please enter a description or keyword.');
        return;
      }
  
      loadingIndicator.classList.remove('hidden');
      imageContainer.innerHTML = '';
  
      fetch('/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, size, style, quality })
      })
        .then(response => response.json())
        .then(data => {
          if (data.imageUrls) {
            data.imageUrls.forEach(url => {
              const imageWrapper = createImageWrapper(url);
              imageContainer.appendChild(imageWrapper);
            });
          }
        })
        .catch(error => {
          console.error('Error generating image:', error);
          alert('Failed to generate image.');
        })
        .finally(() => {
          loadingIndicator.classList.add('hidden');
        });
    }
  
    function createImageWrapper(url) {
      const imageWrapper = document.createElement('div');
      imageWrapper.className = 'relative bg-white dark:bg-gray-700 p-2 rounded-lg shadow-lg';
  
      const img = document.createElement('img');
      img.src = url;
      img.alt = 'Generated Image';
      img.className = 'w-full h-auto rounded-lg';
  
      const buttonRow = document.createElement('div');
      buttonRow.className = 'button-row';
  
      const addButton = createIconButton('fas fa-plus', function () {
        fetch('/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: document.getElementById('text').value, size: document.getElementById('sizeSelect').value, style: document.getElementById('styleSelect').value, quality: document.getElementById('qualitySelect').value })
        })
          .then(response => response.json())
          .then(data => {
            if (data.imageUrls) {
              data.imageUrls.forEach(url => {
                const newImageWrapper = createImageWrapper(url);
                imageContainer.appendChild(newImageWrapper);
              });
            }
          })
          .catch(error => {
            console.error('Error generating image:', error);
            alert('Failed to generate image.');
          });
      });
  
      const downloadButton = createIconButton('fas fa-download', function () {
        const link = document.createElement('a');
        link.href = url;
        link.download = 'generated-image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
  
      const trashButton = createIconButton('fas fa-trash', function () {
        imageWrapper.remove();
      });
  
      buttonRow.appendChild(addButton);
      buttonRow.appendChild(downloadButton);
      buttonRow.appendChild(trashButton);
  
      imageWrapper.appendChild(img);
      imageWrapper.appendChild(buttonRow);
  
      return imageWrapper;
    }
  
    function createIconButton(iconClass, onClick) {
      const button = document.createElement('button');
      button.className = 'icon-button';
      const icon = document.createElement('i');
      icon.className = iconClass;
      button.appendChild(icon);
      button.addEventListener('click', onClick);
      return button;
    }
  });
  