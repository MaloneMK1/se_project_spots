import "./index.css";
import Api from "../utils/Api.js";
import { apiConfig } from "../utils/constants.js";
import {
  enableValidation,
  resetValidation,
  validationConfig,
} from "../scripts/validation.js";

const api = new Api(apiConfig);

const cardTemplate = document.querySelector("#card-template");
const cardsContainer = document.querySelector(".cards__list");

const profileAvatar = document.querySelector(".profile__avatar");
const profileAvatarEditButton = document.querySelector(
  ".profile__avatar-edit-btn",
);
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");

const editProfileButton = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const nameInput = editProfileModal.querySelector('input[name="name"]');
const descriptionInput = editProfileModal.querySelector(
  'input[name="description"]',
);

const newPostButton = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostForm = newPostModal.querySelector(".modal__form");
const imageInput = newPostModal.querySelector('input[name="image-link"]');
const captionInput = newPostModal.querySelector('input[name="caption"]');

const editAvatarModal = document.querySelector("#edit-avatar-modal");
const editAvatarForm = editAvatarModal.querySelector(".modal__form");
const avatarInput = editAvatarModal.querySelector('input[name="avatar"]');

const deleteCardModal = document.querySelector("#delete-card-modal");
const deleteCardForm = deleteCardModal.querySelector(".modal__form");

const previewModal = document.querySelector("#preview-modal");
const previewImage = previewModal.querySelector(".modal__preview-image");
const previewCaption = previewModal.querySelector(".modal__preview-caption");

let selectedCard = null;
let selectedCardId = null;

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", handleEscape);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleEscape);
}

function handleEscape(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_is-opened");

    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

function renderLoading(button, isLoading, loadingText) {
  if (isLoading) {
    button.dataset.originalText = button.textContent;
    button.textContent = loadingText;
    return;
  }

  button.textContent = button.dataset.originalText;
}

function updateUserInfo({ name, about, avatar }) {
  profileTitle.textContent = name;
  profileDescription.textContent = about;
  profileAvatar.src = avatar;
  profileAvatar.alt = name;
}

function handleEditProfileSubmit(evt) {
  evt.preventDefault();

  const submitButton = evt.submitter;
  renderLoading(submitButton, true, "Saving...");

  api
    .editUserInfo({
      name: nameInput.value,
      about: descriptionInput.value,
    })
    .then((userData) => {
      updateUserInfo(userData);
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      renderLoading(submitButton, false);
    });
}

function handleNewPostSubmit(evt) {
  evt.preventDefault();

  const submitButton = evt.submitter;
  renderLoading(submitButton, true, "Saving...");

  api
    .addCard({
      name: captionInput.value,
      link: imageInput.value,
    })
    .then((cardData) => {
      const cardElement = getCardElement(cardData);

      cardsContainer.prepend(cardElement);
      newPostForm.reset();
      resetValidation(newPostForm);
      closeModal(newPostModal);
    })
    .catch(console.error)
    .finally(() => {
      renderLoading(submitButton, false);
    });
}

function handleEditAvatarSubmit(evt) {
  evt.preventDefault();

  const submitButton = evt.submitter;
  renderLoading(submitButton, true, "Saving...");

  api
    .updateAvatar(avatarInput.value)
    .then((userData) => {
      updateUserInfo(userData);
      editAvatarForm.reset();
      resetValidation(editAvatarForm);
      closeModal(editAvatarModal);
    })
    .catch(console.error)
    .finally(() => {
      renderLoading(submitButton, false);
    });
}

function handleDeleteCard(cardElement, cardData) {
  selectedCard = cardElement;
  selectedCardId = cardData._id;
  openModal(deleteCardModal);
}

function handleDeleteCardSubmit(evt) {
  evt.preventDefault();

  if (!selectedCard || !selectedCardId) {
    return;
  }

  const submitButton = evt.submitter;
  renderLoading(submitButton, true, "Deleting...");

  api
    .removeCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteCardModal);
      selectedCard = null;
      selectedCardId = null;
    })
    .catch(console.error)
    .finally(() => {
      renderLoading(submitButton, false);
    });
}

function handleCardLike(likeButton, cardData) {
  const isLiked = likeButton.classList.contains("card__like-btn_active");
  const likeRequest = isLiked
    ? api.unlikeCard(cardData._id)
    : api.likeCard(cardData._id);

  likeRequest
    .then((updatedCard) => {
      likeButton.classList.toggle("card__like-btn_active", updatedCard.isLiked);
    })
    .catch(console.error);
}

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-btn");
  const likeButton = cardElement.querySelector(".card__like-btn");

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;
  likeButton.classList.toggle("card__like-btn_active", data.isLiked);

  cardImage.addEventListener("click", function () {
    previewImage.src = data.link;
    previewImage.alt = data.name;
    previewCaption.textContent = data.name;

    openModal(previewModal);
  });

  deleteButton.addEventListener("click", function () {
    handleDeleteCard(cardElement, data);
  });

  likeButton.addEventListener("click", function () {
    handleCardLike(likeButton, data);
  });

  return cardElement;
}

editProfileButton.addEventListener("click", function () {
  nameInput.value = profileTitle.textContent;
  descriptionInput.value = profileDescription.textContent;
  resetValidation(editProfileForm);

  openModal(editProfileModal);
});

newPostButton.addEventListener("click", function () {
  openModal(newPostModal);
});

profileAvatarEditButton.addEventListener("click", function () {
  editAvatarForm.reset();
  resetValidation(editAvatarForm);

  openModal(editAvatarModal);
});

document.querySelectorAll(".modal__close-btn").forEach((closeButton) => {
  const modal = closeButton.closest(".modal");

  closeButton.addEventListener("click", function () {
    closeModal(modal);
  });
});

document.querySelectorAll(".modal").forEach(function (modal) {
  modal.addEventListener("click", function (evt) {
    if (evt.target === modal) {
      closeModal(modal);
    }
  });
});

editProfileForm.addEventListener("submit", handleEditProfileSubmit);
newPostForm.addEventListener("submit", handleNewPostSubmit);
editAvatarForm.addEventListener("submit", handleEditAvatarSubmit);
deleteCardForm.addEventListener("submit", handleDeleteCardSubmit);

enableValidation(validationConfig);

api
  .getAppInfo()
  .then(([userData, cards]) => {
    updateUserInfo(userData);

    cards.forEach((cardData) => {
      const cardElement = getCardElement(cardData);

      cardsContainer.append(cardElement);
    });
  })
  .catch(console.error);
