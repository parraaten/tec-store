<template>
  <div class="account-container">
    <!-- Encabezado -->
    <div class="account-header">
      <h2 class="account-title">👤 Mi Cuenta</h2>
      <p class="account-subtitle">Información personal</p>
    </div>

    <!-- Tarjeta de información -->
    <div v-if="user" class="account-card">
      <div class="info-row">
        <span class="label">Nombre:</span>
        <span class="value">{{ user.name }}</span>
      </div>
      <div class="info-row">
        <span class="label">Correo:</span>
        <span class="value">{{ user.email }}</span>
      </div>

      <!-- Botones -->
      <div class="action-buttons" >
        <button @click="showChangePassword = true" class="btn-change-password">
          🔒 Cambiar Contraseña
        </button>

        <button @click="confirmDeleteAccount" class="btn-delete-account">
          🗑️ Eliminar Cuenta
        </button>
      </div>

      <!-- Formulario cambiar contraseña -->
      <div v-if="showChangePassword" class="password-form">
        <h3>🔒 Cambiar Contraseña</h3>

        <label>Contraseña actual</label>
        <input
          v-model="passwordData.current_password"
          type="password"
          placeholder="Ingresa tu contraseña actual"
          class="input-field"
        />

        <label>Nueva contraseña</label>
        <input
          v-model="passwordData.new_password"
          type="password"
          placeholder="Ingresa tu nueva contraseña"
          class="input-field"
        />

        <div class="form-actions">
          <button @click="changePassword" class="btn-confirm">Confirmar</button>
          <button @click="showChangePassword = false" class="btn-cancel">Cancelar</button>
        </div>
      </div>
    </div>

    <!-- Mensajes -->
    <div v-if="error" class="error-box">{{ error }}</div>
    <div v-if="successMessage" class="success-box">{{ successMessage }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const user = ref(null);
const error = ref(null);
const successMessage = ref(null);
const showChangePassword = ref(false);
const passwordData = ref({ new_password: "" });

onMounted(async () => {
  try {
    const response = await axios.get("/user");
    user.value = response.data;
  } catch (err) {
    error.value = "No se pudo cargar la información del usuario.";
    console.error(err);
  }
});

const changePassword = async () => {
  try {
    await axios.post("/user/change-password", passwordData.value);
    successMessage.value = "Contraseña cambiada exitosamente";
    showChangePassword.value = false;
    passwordData.value.new_password = "";
  } catch (err) {
    error.value = err.response?.data?.message || "Error al cambiar la contraseña";
  }
};

const confirmDeleteAccount = () => {
  if (confirm("¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.")) {
    deleteAccount();
  }
};

const deleteAccount = async () => {
  try {
    await axios.delete(`/users/${user.value.id}`);
    router.push("/");
  } catch (err) {
    error.value = "Error al eliminar la cuenta";
  }
};
</script>

<style scoped>
.account-container {
  max-width: 600px;
  margin: auto;
  padding: 25px;
  color: #fff;
  font-family: 'Segoe UI', sans-serif;
}

.account-header {
  margin-bottom: 30px;
  text-align: center;
}

.account-title {
  font-size: 28px;
  font-weight: bold;
}

.account-subtitle {
  color: #bbb;
}

.account-card {
  background-color: #1e1e2f;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #333;
}

.label {
  color: #aaa;
}

.value {
  font-weight: bold;
}

.action-buttons {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  flex-wrap: wrap;
  justify-content: space-between;
}

.btn-change-password,
.btn-delete-account {
  padding: 10px 15px;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
}

.btn-change-password {
  background-color: #6c5ce7;
  color: white;
}

.btn-delete-account {
  background-color: #d63031;
  color: white;
}

.btn-change-password:hover {
  background-color: #5e4cc0;
}

.btn-delete-account:hover {
  background-color: #b02424;
}

.password-form {
  margin-top: 25px;
  background-color: #2a2a40;
  padding: 20px;
  border-radius: 8px;
}

.password-form h3 {
  margin-bottom: 15px;
  color: #a29bfe;
  font-size: 20px;
}

.password-form label {
  display: block;
  margin-top: 10px;
  margin-bottom: 5px;
  color: #ccc;
  font-weight: 500;
}

.input-field {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: #3d3d3d;
  color: white;
  margin-bottom: 10px;
}

.input-field::placeholder {
  color: #aaa;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.btn-confirm {
  background-color: #00b894;
  color: white;
}

.btn-cancel {
  background-color: #636e72;
  color: white;
}

.error-box,
.success-box {
  margin-top: 20px;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  font-weight: bold;
}

.error-box {
  background-color: #e17055;
  color: white;
}

.success-box {
  background-color: #00b894;
  color: white;
}
</style>