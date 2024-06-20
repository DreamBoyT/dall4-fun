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
                  if (size === '1600x900' || size === '1080x1920' || size === '1920x1080') {
                      const [width, height] = size.split('x').map(Number);
                      resizeImage(url, width, height).then(resizedUrl => {
                          const imageWrapper = createImageWrapper(resizedUrl, width, height);
                          imageContainer.appendChild(imageWrapper);
                      });
                  } else {
                      const [width, height] = size.split('x').map(Number);
                      const imageWrapper = createImageWrapper(url, width, height);
                      imageContainer.appendChild(imageWrapper);
                  }
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

  function resizeImage(url, width, height) {
      return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');

              canvas.width = width;
              canvas.height = height;

              ctx.drawImage(img, 0, 0, width, height);

              canvas.toBlob(blob => {
                  const reader = new FileReader();
                  reader.onload = () => {
                      resolve(reader.result);
                  };
                  reader.readAsDataURL(blob);
              }, 'image/png');
          };
          img.onerror = reject;
          img.src = url;
      });
  }

  function createImageWrapper(url, width, height) {
      const imageWrapper = document.createElement('div');
      imageWrapper.className = 'relative bg-white dark:bg-gray-700 p-2 rounded-lg shadow-lg';

      const img = document.createElement('img');
      img.src = url;
      img.alt = 'Generated Image';
      img.className = 'w-full h-auto rounded-lg';
      img.style.width = `${width}px`;
      img.style.height = `${height}px`;

      const buttonRow = document.createElement('div');
      buttonRow.className = 'button-row';

      const addButton = createIconButton('fas fa-plus', function () {
          generateImage();
      });

      const downloadButton = createIconButton('fas fa-download', function () {
          const link = document.createElement('a');
          link.href = url;
          link.download = `generated_image_${width}x${height}.png`;
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
      button.className = 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded';
      button.innerHTML = `<i class="${iconClass}"></i>`;
      button.addEventListener('click', onClick);
      return button;
  }
});
