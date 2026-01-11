// Variables globales
let selectedImage = null;
let imageCounter = 0;

// URLs de imágenes por defecto (para pruebas)
const sampleImages = [
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
    'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07',
    'https://images.unsplash.com/photo-1501854140801-50d01698950b'
].map(url => `${url}?w=600&h=600&fit=crop&crop=center`);

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const gallery = document.getElementById('gallery');
    const imageUrlInput = document.getElementById('imageUrl');
    const addImageBtn = document.getElementById('addImageBtn');
    const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const addSampleBtn = document.getElementById('addSampleBtn');
    const imageCount = document.getElementById('imageCount');
    const selectedInfo = document.getElementById('selectedInfo');
    
    // Inicializar la galería con 3 imágenes al inicio
    initializeGallery();
    
    // Event Listeners
    addImageBtn.addEventListener('click', addImageFromInput);
    
    imageUrlInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addImageFromInput();
        }
    });
    
    deleteSelectedBtn.addEventListener('click', deleteSelectedImage);
    
    clearAllBtn.addEventListener('click', clearGallery);
    
    addSampleBtn.addEventListener('click', addSampleImages);
    
    // Event listener para la tecla Delete
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Delete' && selectedImage) {
            deleteSelectedImage();
        }
    });
    
    // Funciones principales
    
    function initializeGallery() {
        // Agregar 3 imágenes de ejemplo al cargar
        for (let i = 0; i < 3; i++) {
            addImageToGallery(sampleImages[i]);
        }
        
        updateGalleryInfo();
    }
    
    function addImageFromInput() {
        const url = imageUrlInput.value.trim();
        
        if (!url) {
            showError('Por favor, ingresa una URL de imagen');
            return;
        }
        
        if (!isValidImageUrl(url)) {
            showError('Por favor, ingresa una URL válida de imagen');
            return;
        }
        
        addImageToGallery(url);
        
        // Limpiar el input
        imageUrlInput.value = '';
        imageUrlInput.focus();
    }
    
    function addImageToGallery(imageUrl) {
        // Eliminar mensaje de galería vacía si existe
        const emptyGallery = document.querySelector('.empty-gallery');
        if (emptyGallery) {
            emptyGallery.remove();
        }
        
        // Crear contenedor de imagen
        const imageItem = document.createElement('div');
        imageItem.className = 'image-item';
        imageCounter++;
        imageItem.dataset.id = imageCounter;
        
        // Crear imagen
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = `Imagen ${imageCounter}`;
        img.loading = 'lazy';
        
        // Manejar error en carga de imagen
        img.onerror = function() {
            showError('No se pudo cargar la imagen. Verifica la URL.');
            imageItem.remove();
            updateGalleryInfo();
        };
        
        // Crear overlay con número
        const overlay = document.createElement('div');
        overlay.className = 'image-overlay';
        overlay.innerHTML = `<small>Imagen ${imageCounter}</small>`;
        
        const numberBadge = document.createElement('div');
        numberBadge.className = 'image-number';
        numberBadge.textContent = imageCounter;
        
        // Agregar elementos al contenedor
        imageItem.appendChild(img);
        imageItem.appendChild(overlay);
        imageItem.appendChild(numberBadge);
        
        // Event listener para seleccionar la imagen
        imageItem.addEventListener('click', function() {
            selectImage(imageItem);
        });
        
        // Agregar a la galería
        gallery.appendChild(imageItem);
        
        // Actualizar información de la galería
        updateGalleryInfo();
    }
    
    function selectImage(imageElement) {
        // Si ya está seleccionada, deseleccionar
        if (selectedImage === imageElement) {
            imageElement.classList.remove('selected');
            selectedImage = null;
            deleteSelectedBtn.disabled = true;
            selectedInfo.textContent = 'Ninguna imagen seleccionada';
        } else {
            // Deseleccionar la imagen anterior si existe
            if (selectedImage) {
                selectedImage.classList.remove('selected');
            }
            
            // Seleccionar la nueva imagen
            imageElement.classList.add('selected');
            selectedImage = imageElement;
            deleteSelectedBtn.disabled = false;
            
            // Actualizar información de selección
            const imageNumber = imageElement.querySelector('.image-number').textContent;
            selectedInfo.textContent = `Imagen ${imageNumber} seleccionada`;
        }
    }
    
    function deleteSelectedImage() {
        if (!selectedImage) return;
        
        // Animación de desvanecimiento
        selectedImage.classList.add('fade-out');
        
        // Eliminar después de la animación
        setTimeout(() => {
            selectedImage.remove();
            selectedImage = null;
            deleteSelectedBtn.disabled = true;
            selectedInfo.textContent = 'Ninguna imagen seleccionada';
            
            // Mostrar mensaje de galería vacía si no hay imágenes
            if (gallery.children.length === 0) {
                showEmptyGalleryMessage();
            }
            
            updateGalleryInfo();
        }, 300);
    }
    
    function clearGallery() {
        // Confirmar antes de limpiar
        if (gallery.children.length === 0) return;
        
        const confirmClear = confirm('¿Estás seguro de que quieres eliminar todas las imágenes?');
        if (!confirmClear) return;
        
        // Animar y eliminar todas las imágenes
        const images = document.querySelectorAll('.image-item');
        images.forEach(img => {
            img.classList.add('fade-out');
        });
        
        setTimeout(() => {
            gallery.innerHTML = '';
            selectedImage = null;
            deleteSelectedBtn.disabled = true;
            selectedInfo.textContent = 'Ninguna imagen seleccionada';
            showEmptyGalleryMessage();
            updateGalleryInfo();
        }, 400);
    }
    
    function addSampleImages() {
        // Agregar imágenes de ejemplo que no estén ya en la galería
        sampleImages.forEach(url => {
            // Verificar si ya existe
            const existingImages = Array.from(document.querySelectorAll('.image-item img'));
            const alreadyExists = existingImages.some(img => img.src === url);
            
            if (!alreadyExists) {
                addImageToGallery(url);
            }
        });
    }
    
    // Funciones auxiliares
    
    function updateGalleryInfo() {
        const imageItems = document.querySelectorAll('.image-item');
        const count = imageItems.length;
        
        imageCount.textContent = `${count} imagen${count !== 1 ? 'es' : ''}`;
        
        // Actualizar números de imagen
        imageItems.forEach((item, index) => {
            const numberBadge = item.querySelector('.image-number');
            if (numberBadge) {
                numberBadge.textContent = index + 1;
                
                // Actualizar overlay
                const overlay = item.querySelector('.image-overlay');
                if (overlay) {
                    overlay.innerHTML = `<small>Imagen ${index + 1}</small>`;
                }
            }
        });
    }
    
    function showEmptyGalleryMessage() {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'empty-gallery';
        emptyDiv.innerHTML = `
            <i class="fas fa-image"></i>
            <p>La galería está vacía</p>
            <p class="empty-hint">Agrega imágenes usando el formulario superior</p>
        `;
        gallery.appendChild(emptyDiv);
    }
    
    function isValidImageUrl(url) {
        // Expresión regular para validar URLs de imagen
        const imagePattern = /\.(jpeg|jpg|png|gif|bmp|webp|svg)(\?.*)?$/i;
        return imagePattern.test(url) || url.includes('unsplash.com');
    }
    
    function showError(message) {
        // Crear elemento de error temporal
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #e74c3c;
            color: white;
            padding: 12px 18px;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 1000;
            font-size: 0.9rem;
        `;
        
        // Agregar al body
        document.body.appendChild(errorDiv);
        
        // Eliminar después de 3 segundos
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }
});