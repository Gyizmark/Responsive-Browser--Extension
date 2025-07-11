import data from './assets/data.json' assert { type: 'json' };
const { animate, scroll } = Motion;

// DOM references
const browserExtension = document.getElementById('card');
const filterButton = document.querySelector('#filter');
const filterButtons = document.querySelectorAll('li');
const popup = document.getElementById("popup-model");
const cancelBtn = document.getElementById('cancel-btn');
const confirmBtn = document.getElementById('confirm-btn');
const toggleBtn = document.getElementById('toggleMode');
const html = document.documentElement;

let cardsRef = [];
// Reference for the current card to remove
let cardToRemove = null; 

// Apply theme from localStorage immediately
if (localStorage.getItem('theme') === 'dark') {
  html.classList.add('dark');
}

// Dark mode toggle
toggleBtn.addEventListener('click', () => {
  html.classList.toggle('dark');
  localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
});

// Create a card element
function createCard(cardData) {
  const cardContainer = document.createElement('div');
  cardContainer.className = 'card-container list';

  // Flex wrapper
  const flexWrapper = document.createElement('div');
  flexWrapper.className = 'flex';

  // Logo section
  const logoDiv = document.createElement('div');
  logoDiv.className = 'card-logo';
  const logoImg = document.createElement('img');
  logoImg.src = cardData.logo;
  logoImg.alt = 'thumbnail image';
  logoDiv.appendChild(logoImg);

  // Text content
  const textDiv = document.createElement('div');
  textDiv.className = 'px-4 mb-6';
  const title = document.createElement('h4');
  title.className = 'card-name';
  title.textContent = cardData.name;
  const description = document.createElement('p');
  description.className = 'card-description';
  description.textContent = cardData.description;

  textDiv.appendChild(title);
  textDiv.appendChild(description);

  flexWrapper.appendChild(logoDiv);
  flexWrapper.appendChild(textDiv);

  // Bottom row
  const bottomRow = document.createElement('div');
  bottomRow.className = 'flex justify-between items-center';

  // Remove button
  const buttonWrapper = document.createElement('div');
  buttonWrapper.className = 'remove-btn isActive';
  const removeBtn = document.createElement('button');
  removeBtn.className = 'border border-neutral-300 rounded-full px-3 py-1';
  removeBtn.textContent = 'Remove';
  buttonWrapper.appendChild(removeBtn);

  // Toggle switch
  const toggleWrapper = document.createElement('div');
  toggleWrapper.className = 'toggle-btn';
  const label = document.createElement('label');
  label.className = 'relative inline-block w-[50px] h-[24px] cursor-pointer';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'sr-only peer';
  checkbox.checked = cardData.isActive;

  const track = document.createElement('div');
  track.className = 'absolute inset-0 bg-gray-300 rounded-full transition peer-checked:bg-red-500 peer-focus:ring-2 peer-focus:ring-red-300';

  const thumb = document.createElement('div');
  thumb.className = 'absolute left-1 top-1 w-[16px] h-[16px] bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-[26px]';

  label.appendChild(checkbox);
  label.appendChild(track);
  label.appendChild(thumb);
  toggleWrapper.appendChild(label);

  bottomRow.appendChild(buttonWrapper);
  bottomRow.appendChild(toggleWrapper);

  // Assemble card
  cardContainer.appendChild(flexWrapper);
  cardContainer.appendChild(bottomRow);

  // Append to DOM
  browserExtension.appendChild(cardContainer);

  removeBtn.addEventListener('click', () => {
    popup.showModal();
    cardToRemove = cardContainer;

    animate(popup, {
      opacity: 1,
      scale: 1,
      translateY: 0
    }, {
      duration: 0.3,
      easing: "ease-in-out"
    });
  });

 
  checkbox.addEventListener('change', () => {
    cardData.isActive = checkbox.checked;
  });

  return cardContainer;
}

// Render all cards
data.forEach((cardData) => {
  const cardElement = createCard(cardData);
  cardsRef.push({ data: cardData, element: cardElement });
});

// Confirm and cancel popup actions
confirmBtn.addEventListener('click', () => {
  if (cardToRemove) {
    cardToRemove.classList.add('hidden');
    cardToRemove = null;
    popup.close();
  }
});

cancelBtn.addEventListener('click', () => {
  popup.close();
  cardToRemove = null;
});

filterButton.addEventListener('click', (e) => {
  const status = e.target.dataset.status;

  filterButtons.forEach(btn => {
    btn.classList.toggle('active', btn === e.target);
  });

  if (!status) return;

  cardsRef.forEach(({ data, element }) => {
    const shouldShow =
      (status === 'active' && data.isActive) ||
      (status === 'inactive' && !data.isActive) ||
      (status === 'all');
    element.classList.add('active')
    element.classList.toggle('hidden', !shouldShow);
  });
});
