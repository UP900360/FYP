/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-syntax */
const url = '/uploadfile';
const input = document.getElementById('myFile');
const list = document.getElementById('list');
const body = document.getElementById('body');
let formElem = document.getElementById('formElem');

// Call back to be called when form is submitted
const onFormSubmit = async (e) => {
  e.preventDefault();
  console.log('Submitting');
  const response = await fetch(url, {
    method: 'POST',
    body: new FormData(formElem),
  });

  const { indexes } = await response.json();
  console.log('Indexes: ', indexes);
  let unorderedList = document.getElementById('list');

  // Unordered list could have been removed
  if (!unorderedList) {
    unorderedList = document.createElement('ul');
    unorderedList.id = 'li';
    body.appendChild(unorderedList);
  }
  showList(indexes, unorderedList);
};

function showForm() {
  const form = document.createElement('form');
  form.id = 'formElem';
  form.onsubmit = onFormSubmit;
  const input = document.createElement('input');
  input.type = 'file';
  input.id = 'myFile';
  input.name = 'myFile';

  const button = document.createElement('input');
  button.type = 'submit';
  button.value = 'Upload a file';

  form.appendChild(input);
  form.appendChild(button);
  body.appendChild(form);
  formElem = document.getElementById('formElem');
}


function showList(indexes, list) {
  list.innerHTML = '';
  for (const element of indexes) {
    const listElement = document.createElement('li');
    listElement.style.color = 'white';
    listElement.style.display = 'flex';
    listElement.style.marginBottom = '20px';
    listElement.style.justifyContent = 'space-between';
    listElement.innerText = 'Filename : ' + element.file + ', Similarity percentage is : ' + Math.round(element.similarity * 100);

    const inputElement = document.createElement('input');
    inputElement.type = 'button';
    inputElement.value = 'See File';
    inputElement.style.display = 'inline';
    inputElement.style.marginLeft = '20px';
    inputElement.addEventListener('click', () => showHighlitedFile(element, indexes));
    listElement.appendChild(inputElement);
    list.appendChild(listElement);
  }
}


function showHighlitedFile(element, indexes) {
  let { file, content, similarity, similarContent } = element;
  const color = similarity >= 0.75 ? 'red' : similarity <= 0.25 ? 'green' : 'orange';
  const pElement = document.createElement('p');
  pElement.style.color = 'white';

  content = content.replace(/\r/g, '');
  for (const item of similarContent) {
    content = content.split(item).join(`<span style="color:${color};">${item}</span>`);
  }

  pElement.innerHTML = content;
  body.innerHTML = '';

  const inputElement = document.createElement('input');
  inputElement.type = 'button';
  inputElement.value = 'Back';
  inputElement.id = 'back';

  inputElement.style.display = 'inline';

  inputElement.addEventListener('click', () => {
    // Removing code content from DOM
    const paragraphs = body.getElementsByTagName('p');
    const paragrapsArray = Array.prototype.slice.call(paragraphs);
    const paragraph = paragrapsArray.pop();
    paragraph.innerHTML = '';

    // Removing back button
    const back = document.getElementById('back');
    back.remove();

    showForm();

    const unorderedList = document.createElement('ul');
    unorderedList.id = 'list';
    body.appendChild(unorderedList);
    showList(indexes, unorderedList);
  });

  body.appendChild(inputElement);
  body.appendChild(pElement);
}

formElem.onsubmit = onFormSubmit;
