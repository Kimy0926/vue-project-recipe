import { ref } from 'vue';

const isLoggedin = ref(false);

const isLoginModalVisible = ref(false);

const doLogin = () => {
  isLoggedin.value = true;
};

const doLogout = () => {
  isLoggedin.value = false;
};

const showLoginModal = () => {
  isLoginModalVisible.value = true;
};

const hideLoginModal = () => {
  isLoginModalVisible.value = false;
};

export { isLoggedin, isLoginModalVisible, showLoginModal, hideLoginModal, doLogin, doLogout };
