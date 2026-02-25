<template>
  <div class="image-manager">
    <div class="manager-header">
      <h3>Управление изображениями</h3>
      <button @click="showAddModal = true" class="add-btn">
        + Добавить изображение
      </button>
    </div>
    
    <div class="images-list">
      <div 
        v-for="(image, index) in images" 
        :key="index"
        class="image-item"
      >
        <img :src="image" :alt="`Image ${index + 1}`" class="preview" />
        <div class="image-controls">
          <button @click="moveUp(index)" :disabled="index === 0" class="control-btn">
            ↑
          </button>
          <button @click="moveDown(index)" :disabled="index === images.length - 1" class="control-btn">
            ↓
          </button>
          <button @click="removeImage(index)" class="control-btn remove">
            ×
          </button>
        </div>
      </div>
    </div>

    <!-- Модальное окно добавления изображения -->
    <div v-if="showAddModal" class="modal-overlay" @click="closeAddModal">
      <div class="modal" @click.stop>
        <h3>Добавить изображение</h3>
        <div class="add-options">
          <div class="option">
            <label>URL изображения:</label>
            <input 
              v-model="newImageUrl" 
              type="text" 
              placeholder="https://example.com/image.jpg"
              class="url-input"
            />
          </div>
          <div class="option">
            <label>Или загрузить файл:</label>
            <input 
              @change="handleFileUpload" 
              type="file" 
              accept="image/*"
              class="file-input"
            />
          </div>
        </div>
        <div class="modal-actions">
          <button @click="addImage" class="btn-primary" :disabled="!newImageUrl">
            Добавить
          </button>
          <button @click="closeAddModal" class="btn-secondary">
            Отмена
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImageManager',
  props: {
    images: {
      type: Array,
      required: true
    }
  },
  emits: ['update:images'],
  data() {
    return {
      showAddModal: false,
      newImageUrl: ''
    }
  },
  methods: {
    moveUp(index) {
      if (index > 0) {
        const newImages = [...this.images]
        ;[newImages[index], newImages[index - 1]] = [newImages[index - 1], newImages[index]]
        this.$emit('update:images', newImages)
      }
    },
    
    moveDown(index) {
      if (index < this.images.length - 1) {
        const newImages = [...this.images]
        ;[newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]]
        this.$emit('update:images', newImages)
      }
    },
    
    removeImage(index) {
      const newImages = this.images.filter((_, i) => i !== index)
      this.$emit('update:images', newImages)
    },
    
    addImage() {
      if (this.newImageUrl.trim()) {
        const newImages = [...this.images, this.newImageUrl.trim()]
        this.$emit('update:images', newImages)
        this.closeAddModal()
      }
    },
    
    handleFileUpload(event) {
      const file = event.target.files[0]
      if (file) {
        // В реальном приложении здесь была бы загрузка файла на сервер
        // Для демонстрации создаем временный URL
        const reader = new FileReader()
        reader.onload = (e) => {
          this.newImageUrl = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    
    closeAddModal() {
      this.showAddModal = false
      this.newImageUrl = ''
    }
  }
}
</script>

<style scoped>
.image-manager {
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 20px;
  background: #f9f9f9;
}

.manager-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.manager-header h3 {
  margin: 0;
  color: #333;
}

.add-btn {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.add-btn:hover {
  background: var(--primary-dark);
}

.images-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

.image-item {
  position: relative;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background: white;
}

.preview {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.image-controls {
  position: absolute;
  top: 5px;
  right: 5px;
  display: flex;
  gap: 5px;
}

.control-btn {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.control-btn:hover {
  background: rgba(0, 0, 0, 0.9);
}

.control-btn:disabled {
  background: rgba(0, 0, 0, 0.3);
  cursor: not-allowed;
}

.control-btn.remove {
  background: #dc3545;
}

.control-btn.remove:hover {
  background: #c82333;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 30px;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal h3 {
  margin-top: 0;
  margin-bottom: 20px;
}

.add-options {
  margin-bottom: 20px;
}

.option {
  margin-bottom: 15px;
}

.option label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.url-input, .file-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.btn-primary, .btn-secondary {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-dark);
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
}

@media (max-width: 768px) {
  .images-list {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
  
  .modal {
    padding: 20px;
  }
}
</style>
