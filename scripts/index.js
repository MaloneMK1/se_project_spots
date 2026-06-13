const editProfileButton = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseButton =
  editProfileModal.querySelector(".modal__close-btn");

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");

const editProfileForm = editProfileModal.querySelector(".modal__form");

editProfileForm.addEventListener("submit", handleEditProfileSubmit);

const nameInput = editProfileModal.querySelector('input[name="name"]');

const descriptionInput = editProfileModal.querySelector(
  'input[name="description"]',
);
const newPostButton = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseButton = newPostModal.querySelector(".modal__close-btn");

const newPostForm = newPostModal.querySelector(".modal__form");
const imageInput = newPostModal.querySelector('input[name="image-link"]');
const captionInput = newPostModal.querySelector('input[name="caption"]');

editProfileButton.addEventListener("click", function () {
  nameInput.value = profileTitle.textContent;
  descriptionInput.value = profileDescription.textContent;

  editProfileModal.classList.add("modal_is-opened");
});

editProfileCloseButton.addEventListener("click", function () {
  editProfileModal.classList.remove("modal_is-opened");
});

newPostButton.addEventListener("click", function () {
  newPostModal.classList.add("modal_is-opened");
});

newPostCloseButton.addEventListener("click", function () {
  newPostModal.classList.remove("modal_is-opened");
});

function handleEditProfileSubmit(evt) {
  evt.preventDefault();

  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = descriptionInput.value;

  editProfileModal.classList.remove("modal_is-opened");
}

function handleNewPostSubmit(evt) {
  evt.preventDefault();

  console.log(imageInput.value);
  console.log(captionInput.value);

  newPostModal.classList.remove("modal_is-opened");
}

newPostForm.addEventListener("submit", handleNewPostSubmit);
