import axios from 'axios';
import validator from 'validator';
import {
  watch,
} from 'melanke-watchjs';
import _ from 'lodash';
import parseXML from './XMLparser';
import renderChannel from './renderers';

export default () => {
  const state = {
    menu: {
      isValidLink: null,
      channels: {},
      isFormSubmitted: false,
    },
  };

  watch(state, 'menu', () => {
    const channelValues = _.values(state.menu.channels);
    channelValues.map(e => renderChannel(e.channelTitle, e.channelDescription, e.channelArticles));
    const rssLinkInputBorder = document.getElementById('rssLinkInput');
    const validationMessage = document.getElementById('feedback');
    const submitButton = document.getElementById('buttonOnSubmit');
    if (state.menu.isValidLink === 'notvalid') {
      rssLinkInputBorder.classList.remove('is-valid');
      rssLinkInputBorder.classList.add('is-invalid');
      validationMessage.classList.remove('valid-feedback');
      validationMessage.classList.add('invalid-feedback');
      validationMessage.textContent = 'Please provide a valid RSS feed link.';
    } else if (state.menu.isValidLink === 'valid') {
      rssLinkInputBorder.classList.remove('is-invalid');
      rssLinkInputBorder.classList.add('is-valid');
      validationMessage.classList.remove('invalid-feedback');
      validationMessage.classList.add('valid-feedback');
      validationMessage.textContent = 'Success!';
    } else if (state.menu.isValidLink === 'linkAlreadyExist') {
      rssLinkInputBorder.classList.remove('is-valid');
      rssLinkInputBorder.classList.add('is-invalid');
      validationMessage.classList.remove('valid-feedback');
      validationMessage.classList.add('invalid-feedback');
      validationMessage.textContent = 'This channel has already been added. Please choose another one.';
    } else if (state.menu.isFormSubmitted === true) {
      rssLinkInputBorder.classList.remove('is-valid');
      submitButton.setAttribute('disabled', true);
      submitButton.setAttribute('aria-disabled', true);
      // rssLinkInputBorder.setAttribute('readonly', true);
      validationMessage.textContent = '';
    } else {
      rssLinkInputBorder.classList.remove('is-invalid');
      validationMessage.classList.remove('invalid-feedback');
      rssLinkInputBorder.classList.remove('is-valid');
      validationMessage.classList.remove('valid-feedback');
    }
  });

  const inputField = document.getElementById('rssLinkInput');
  inputField.addEventListener('input', (e) => {
    const checkIfChannelExists = _.has(state.menu.channels, e.target.value);
    if (validator.isURL(e.target.value) && (checkIfChannelExists === false)) {
      state.menu = {
        isValidLink: 'valid',
      };
    } else if (checkIfChannelExists === false) {
      state.menu = {
        isValidLink: 'linkAlreadyExist',
      };
    } else if (e.target.value === '') {
      state.menu = {
        isValidLink: null,
      };
    } else {
      state.menu = {
        isValidLink: 'notvalid',
      };
    }
  });

  const element = document.getElementById('buttonOnSubmit');
  element.addEventListener('click', () => {
    state.menu = {
      isFormSubmitted: true,
    };
    const channelLink = document.getElementById('rssLinkInput').value;

    const corsApiUrl = 'https://cors-anywhere.herokuapp.com/';
    axios.get(`${corsApiUrl}${channelLink}`).then((res) => {
      document.getElementById('rssLinkForm').reset();
      state.menu = {
        isValidLink: null,
        channels: {
          channelLink: parseXML(res.data),
          ...state.menu.channels,
        },
      };
    });
  });
};
