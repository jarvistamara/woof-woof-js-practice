const DOGS_URL = 'http://localhost:3000/pups';

document.addEventListener('DOMContentLoaded', () => {
  getDogs();
  toggleButton();
});

const getDogs = () => {
  const dogParent = document.querySelector('#dog-bar');
  clearAllChildNodes(dogParent);
  fetch(DOGS_URL)
    .then( (response) => response.json() )
    .then( (dogs) => {      
      dogs.forEach(dog => dogSpan(dog))
    });
}

const dogSpan = (dog) => {
  const dogNode = document.createElement('span');
  dogNode.innerText = dog.name;

  dogNode.addEventListener('click', () =>{
    dogInfo(dog);
  })

  const dogParent = document.querySelector('#dog-bar')
  dogParent.appendChild(dogNode);
}

const dogInfo = (dog) => {
  const imgNode = document.createElement('img');
  imgNode.src = dog.image;
  
  const nameNode = document.createElement('h1');
  nameNode.innerText = dog.name;
  
  const statusNode = document.createElement('button');
  buttonStatus(statusNode, dog);

  statusNode.addEventListener('click', (event) => {
    buttonStatusClick(event, dog);
  })
  
  const infoParent = document.querySelector('#dog-info')
  clearAllChildNodes(infoParent);

  infoParent.appendChild(imgNode);
  infoParent.appendChild(nameNode);
  infoParent.appendChild(statusNode);
}

const clearAllChildNodes = (parent) => {
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
}

const buttonStatus = (button, dog) => {
  if (dog.isGoodDog) {
    button.innerText = 'Good Dog!';
  } else {
    button.innerText = 'Bad Dog!';
  }
}

const buttonStatusClick = (event, dog) => {
  dog.isGoodDog = !dog.isGoodDog;
  buttonStatus(event.target, dog);
  updateStatusFetch(dog);
}

const toggleButton = () => {
  const toggleBtn = document.querySelector('#good-dog-filter');
  toggleBtn.addEventListener('click', (event) => {
      toggleStatus(event);
  })
}

let clicked = false;
const toggleStatus = (event) => {
  clicked = !clicked;
  if (clicked) {
    toggleStatusFetch();
    event.target.innerText = 'Filter good dogs: ON';
  } else {
    getDogs();
    event.target.innerText = 'Filter good dogs: OFF';
  }
}

const toggleStatusFetch = () => {
  const dogParent = document.querySelector('#dog-bar');
  clearAllChildNodes(dogParent);

  fetch(DOGS_URL)
    .then( (response) => response.json() )
    .then( (dogs) =>  goodDogsFilter(dogs) );
}

const goodDogsFilter = (dogs) => {
  const goodDogs = dogs.filter(dog => { return dog.isGoodDog === true });
  goodDogs.forEach(dog => renderDogSpan(dog));
}

const updateStatusFetch = (dog) => {
  const data = { isGoodDog: dog.isGoodDog }

  const options = {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
			'Accept' : 'application/json'
		},
		body: JSON.stringify(data)
	}

	fetch(`${DOGS_URL}/${dog.id}`, options)
		.then( (response) => response.json() )
		.then( (dog) => dogInfo(dog) );
}