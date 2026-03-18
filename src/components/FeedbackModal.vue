<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="feedback-overlay" @click.self="close">
        <div class="feedback-modal">
          <button type="button" class="feedback-close" aria-label="Закрыть" @click="close">×</button>
          <h2 class="feedback-title">Обратная связь</h2>
          <p class="feedback-desc">Напишите нам — ответим на почту или перезвоним.</p>

          <form v-if="!success" class="feedback-form" @submit.prevent="onSubmit">
            <div class="form-row">
              <label for="fb-name">Имя *</label>
              <input
                id="fb-name"
                v-model="form.name"
                type="text"
                required
                placeholder="Как к вам обращаться"
              />
            </div>
            <div class="form-row">
              <label for="fb-email">Email *</label>
              <input
                id="fb-email"
                v-model="form.email"
                type="email"
                required
                placeholder="example@mail.ru"
              />
            </div>
            <div class="form-row">
              <label for="fb-phone">Телефон</label>
              <input
                id="fb-phone"
                v-model="form.phone"
                type="tel"
                placeholder="+7 (999) 123-45-67"
              />
            </div>
            <div class="form-row">
              <label for="fb-message">Сообщение *</label>
              <textarea
                id="fb-message"
                v-model="form.message"
                required
                rows="4"
                placeholder="Опишите задачу или вопрос"
              ></textarea>
            </div>
            <p v-if="error" class="form-error">{{ error }}</p>
            <button type="submit" class="btn btn-submit" :disabled="sending">
              {{ sending ? 'Отправка…' : 'Отправить' }}
            </button>
          </form>

          <div v-else class="feedback-success">
            <p class="success-text">Сообщение отправлено. Мы ответим вам на указанный email или перезвоним.</p>
            <button type="button" class="btn" @click="close">Закрыть</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
export default {
  name: 'FeedbackModal',
  props: {
    open: { type: Boolean, default: false }
  },
  emits: ['close'],
  data() {
    return {
      form: {
        name: '',
        email: '',
        phone: '',
        message: ''
      },
      sending: false,
      success: false,
      error: ''
    }
  },
  watch: {
    open(val) {
      if (!val) {
        this.success = false
        this.error = ''
      }
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    async onSubmit() {
      this.error = ''
      const formspreeId = import.meta.env.VITE_FORMSPREE_ID
      if (formspreeId) {
        this.sending = true
        try {
          const payload = {
              name: this.form.name,
              email: this.form.email,
              _replyto: this.form.email,
              phone: this.form.phone,
              message: this.form.message
            }
          const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
          })
          const data = await res.json().catch(() => ({}))
          if (res.ok) {
            this.success = true
            this.form = { name: '', email: '', phone: '', message: '' }
          } else {
            const msg = data.error || data.message || (data.errors && data.errors.map(e => e.message).join('. '))
            if (msg && msg.toLowerCase().includes('confirm')) {
              this.error = 'Форма Formspree не активирована: подтвердите email в письме от formspree.io (проверьте спам).'
            } else if (msg) {
              this.error = msg
            } else {
              this.error = 'Не удалось отправить. Проверьте, что форма на formspree.io подтверждена, или напишите на polo.zakaz@list.ru'
            }
          }
        } catch {
          this.error = 'Ошибка сети. Напишите нам на polo.zakaz@list.ru'
        }
        this.sending = false
      } else {
        const subject = encodeURIComponent('Обратная связь с сайта Фабрика Поло')
        const body = encodeURIComponent(
          `Имя: ${this.form.name}\nEmail: ${this.form.email}\nТелефон: ${this.form.phone}\n\nСообщение:\n${this.form.message}`
        )
        window.location.href = `mailto:polo.zakaz@list.ru?subject=${subject}&body=${body}`
        this.close()
      }
    }
  }
}
</script>

<style scoped>
.feedback-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.feedback-modal {
  background: white;
  border-radius: 16px;
  max-width: 480px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 28px 24px;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.feedback-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border: none;
  background: #f0f0f0;
  border-radius: 50%;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  color: #666;
  -webkit-tap-highlight-color: transparent;
}

.feedback-close:hover {
  background: #e0e0e0;
  color: #333;
}

.feedback-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--primary-color);
  margin: 0 0 8px 0;
}

.feedback-desc {
  font-size: 15px;
  color: var(--text-light);
  margin-bottom: 24px;
}

.feedback-form .form-row {
  margin-bottom: 16px;
}

.feedback-form label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 6px;
}

.feedback-form input,
.feedback-form textarea {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 16px;
  font-family: inherit;
  box-sizing: border-box;
}

.feedback-form input:focus,
.feedback-form textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(114, 47, 55, 0.15);
}

.feedback-form textarea {
  resize: vertical;
  min-height: 100px;
}

.form-error {
  color: #c00;
  font-size: 14px;
  margin-bottom: 12px;
}

.btn-submit {
  width: 100%;
  margin-top: 8px;
}

.feedback-success {
  text-align: center;
}

.success-text {
  font-size: 16px;
  color: var(--text-dark);
  margin-bottom: 20px;
  line-height: 1.5;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .feedback-modal,
.modal-leave-active .feedback-modal {
  transition: transform 0.25s ease;
}

.modal-enter-from .feedback-modal,
.modal-leave-to .feedback-modal {
  transform: scale(0.95);
}
</style>
