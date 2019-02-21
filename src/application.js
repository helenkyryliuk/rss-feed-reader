import axios from 'axios';
import validator from 'validator';
import {
  watch
} from 'melanke-watchjs';

export default () => {
  const state = {
    menu: {
      isValidLink: null,
    },
  };

  watch(state, 'menu', () => {
    if (state.menu.isValidLink === false) {

      const currentBodyEl = document.getElementById('rssLink');
      currentBodyEl.classList.remove('is-valid');
      currentBodyEl.classList.add('is-invalid');

      const prevousBodyEl = document.getElementById('feedback');
      prevousBodyEl.classList.remove('valid-feedback');
      prevousBodyEl.classList.add('invalid-feedback');
      prevousBodyEl.textContent = 'Please provide a valid RSS feed link.';

    } else if (state.menu.isValidLink === true) {
      const currentBodyEl = document.getElementById('rssLink');
      currentBodyEl.classList.remove('is-invalid');
      currentBodyEl.classList.add('is-valid');

      const prevousBodyEl = document.getElementById('feedback');
      prevousBodyEl.classList.remove('invalid-feedback');
      prevousBodyEl.classList.add('valid-feedback');
      prevousBodyEl.textContent = 'Success!';
    } else {
      return;
    }
  });

  const elements = document.getElementById('buttonOnSubmit');
  elements.addEventListener('click', (e) => {
    const value = document.getElementById("rssLink").value;
    if (validator.isEmpty(value) || !validator.isURL(value)) {
      state.menu = {
        isValidLink: false
      };
    } else {
      state.menu = {
        isValidLink: true
      };
      const corsApiUrl = 'https://cors-anywhere.herokuapp.com/';
      axios.get(`${corsApiUrl}${value}`).then((res) => {
        console.log(res.data);
        const domParser = new DOMParser();
        const doc = domParser.parseFromString(res.data, 'text/xml');
       
        const divContainer = document.createElement('div');
        divContainer.classList.add('container');
        const divRow = document.createElement('div');
        divRow.classList.add('row');
        const el = document.querySelector("div.container");
        el.append(divRow);


        doc.querySelectorAll('item').forEach((item) => {
          const col4 = document.createElement('div');
          col4.classList.add('col-md-4');
          divRow.append(col4);
          const h2 = document.createElement('h2');
          h2.textContent = item.querySelector('title').textContent;
          col4.appendChild(h2);
          const p = document.createElement('p');
          p.textContent = item.querySelector('description').textContent;
          col4.appendChild(p);
          const paragraphLink = document.createElement('p');
          col4.appendChild(paragraphLink);
          const link = document.createElement('a');
          link.classList.add('btn', 'btn-info');
          link.textContent = 'View details';
          link.setAttribute('href', item.querySelector('link').textContent);
          paragraphLink.appendChild(link);


        })
      })
    }
  });
};