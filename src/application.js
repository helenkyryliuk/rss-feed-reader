import axios from 'axios';
import validator from 'validator';
import {
  watch,
} from 'melanke-watchjs';
import $ from 'jquery';

export default () => {
  const state = {
    menu: {
      isValidLink: null,
      channels: [],
    },
  };

  watch(state, 'menu', () => {
    const currentBodyEl = document.getElementById('rssLinkInput');
    const prevousBodyEl = document.getElementById('feedback');
    if (state.menu.isValidLink === 'notvalid') {
      currentBodyEl.classList.remove('is-valid');
      currentBodyEl.classList.add('is-invalid');
      prevousBodyEl.classList.remove('valid-feedback');
      prevousBodyEl.classList.add('invalid-feedback');
      prevousBodyEl.textContent = 'Please provide a valid RSS feed link.';
    } else if (state.menu.isValidLink === 'valid') {
      currentBodyEl.classList.remove('is-invalid');
      currentBodyEl.classList.add('is-valid');
      prevousBodyEl.classList.remove('invalid-feedback');
      prevousBodyEl.classList.add('valid-feedback');
      prevousBodyEl.textContent = 'Success!';
    } else if (state.menu.isValidLink === 'linkAlreadyExist') {
      currentBodyEl.classList.remove('is-valid');
      currentBodyEl.classList.add('is-invalid');
      prevousBodyEl.classList.remove('valid-feedback');
      prevousBodyEl.classList.add('invalid-feedback');
      prevousBodyEl.textContent = 'This channel has already been added. Please choose another one.';
    } else {
      currentBodyEl.classList.remove('is-invalid');
      prevousBodyEl.classList.remove('invalid-feedback');
      currentBodyEl.classList.remove('is-valid');
      prevousBodyEl.classList.remove('valid-feedback');
      prevousBodyEl.textContent = '';
    }
  });
  const inputField = document.getElementById('rssLinkInput');
  inputField.addEventListener('input', (e) => {
    const filteredChannels = state.menu.channels.filter(elem => elem === e.target.value);
    if (validator.isURL(e.target.value) && (filteredChannels.length === 0)) {
      state.menu = {
        isValidLink: 'valid',
        channels: state.menu.channels,
      };
    } else if (filteredChannels.length > 0) {
      state.menu = {
        isValidLink: 'linkAlreadyExist',
        channels: state.menu.channels,
      };
    } else if (e.target.value === '') {
      state.menu = {
        isValidLink: null,
        channels: state.menu.channels,
      };
    } else {
      state.menu = {
        isValidLink: 'notvalid',
        channels: state.menu.channels,
      };
    }
  });

  const element = document.getElementById('buttonOnSubmit');
  element.addEventListener('click', () => {
    const inputValue = document.getElementById('rssLinkInput').value;

    const corsApiUrl = 'https://cors-anywhere.herokuapp.com/';
    axios.get(`${corsApiUrl}${inputValue}`).then((res) => {
      state.menu = {
        isValidLink: null,
        channels: state.menu.channels,
      };
      document.getElementById('rssLinkForm').reset();
      const domParser = new DOMParser();
      const doc = domParser.parseFromString(res.data, 'text/xml');


      const divRow = document.createElement('div');
      divRow.classList.add('row');

      const headerRow = document.createElement('div');
      headerRow.classList.add('card-header');
      const cardDiv = document.createElement('div');
      cardDiv.classList.add('card');
      cardDiv.append(headerRow);
      cardDiv.append(divRow);

      const el = document.querySelector('div.container');
      el.append(cardDiv);


      const headerForChannel = document.createElement('h5');
      headerForChannel.classList.add('card-title');
      const descriptionForChannel = document.createElement('p');
      headerForChannel.textContent = doc.querySelector('title').textContent;
      descriptionForChannel.textContent = doc.querySelector('description').textContent;

      headerRow.append(headerForChannel);
      headerRow.append(descriptionForChannel);

      state.menu = {
        isValidLink: null,
        channels: [inputValue, ...state.menu.channels],
      };

      $('#exampleModalCenter').on('show.bs.modal', function (event) {
        const button = $(event.relatedTarget);
        const header = button.data('title');
        const content = button.data('content');
        const modal = $(this);
        modal.find('.modal-title').text(header);
        modal.find('.modal-body').text(content);
      });


      doc.querySelectorAll('item').forEach((item) => {
        const col4 = document.createElement('div');
        col4.classList.add('col-md-4');
        divRow.append(col4);
        const headerLink = document.createElement('a');
        headerLink.textContent = item.querySelector('title').textContent;
        headerLink.setAttribute('href', item.querySelector('link').textContent);
        col4.appendChild(headerLink);
        const p = document.createElement('p');
        p.textContent = item.querySelector('description').textContent;
        col4.appendChild(p);
        const paragraphLink = document.createElement('p');
        col4.appendChild(paragraphLink);
        const link = document.createElement('button');
        link.classList.add('btn', 'btn-info');
        link.textContent = 'View details';
        link.setAttribute('data-toggle', 'modal');
        link.setAttribute('data-target', '#exampleModalCenter');
        link.setAttribute('data-title', item.querySelector('title').textContent);
        link.setAttribute('data-content', item.querySelector('description').textContent);
        paragraphLink.appendChild(link);
      });
    });
  });
};
