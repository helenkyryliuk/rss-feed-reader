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
      channelLinks: [],
      isFormSubmitted: 'notSubmitted',
      isChannelLoaded: null,
    },
  };

  watch(state, 'menu', () => {
    console.log(state.menu.channels);
    const channelValues = _.values(state.menu.channels);
    channelValues.map(e => renderChannel(e.channelTitle, e.channelDescription, e.channelArticles));
    const rssLinkInputBorder = document.getElementById('rssLinkInput');
    const validationMessage = document.getElementById('feedback');
    const submitButton = document.getElementById('buttonOnSubmit');
    const alert = document.querySelector('div.alert');
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
    } else if ((state.menu.isFormSubmitted === 'submitted') && (state.menu.isChannelLoaded === 'inProgress')) {
      alert.classList.remove('alert-warning');
      alert.classList.add('alert-info');
      alert.textContent = 'Loading...';
      rssLinkInputBorder.classList.remove('is-valid');
      submitButton.classList.add('disabled');
      rssLinkInputBorder.setAttribute('readonly', true);
      validationMessage.textContent = '';
    } else if (state.menu.isChannelLoaded === 'failed') {
      alert.classList.remove('alert-info');
      alert.classList.add('alert-warning');
      alert.textContent = 'Failed to load the channel. Please try again.';
      submitButton.classList.remove('disabled');
      rssLinkInputBorder.value = '';
      rssLinkInputBorder.removeAttribute('readonly');
    } else if (state.menu.isChannelLoaded === 'succeeded') {
      alert.classList.remove('alert-info');
      alert.classList.remove('alert-warning');
      alert.classList.add('alert-success');
      alert.textContent = 'The channel has successfully been added to the feed!';
      submitButton.classList.remove('disabled');
      rssLinkInputBorder.removeAttribute('readonly');
      rssLinkInputBorder.value = '';
    } else {
      alert.classList.remove('alert-info');
      alert.classList.remove('alert-warning');
      alert.classList.remove('alert-success');
      rssLinkInputBorder.classList.remove('is-invalid');
      validationMessage.classList.remove('invalid-feedback');
      rssLinkInputBorder.classList.remove('is-valid');
      validationMessage.classList.remove('valid-feedback');
      validationMessage.textContent = '';
      alert.textContent = '';
    }
  });

  const inputField = document.getElementById('rssLinkInput');
  inputField.addEventListener('input', (e) => {
    const checkIfChannelExists = state.menu.channelLinks.filter(link => link === e.target.value);
    console.log(checkIfChannelExists);
    if (validator.isURL(e.target.value) && (checkIfChannelExists.length === 0)) {
      state.menu = {
        isValidLink: 'valid',
        channels: state.menu.channels,
        channelLinks: state.menu.channelLinks,
      };
    } else if (checkIfChannelExists > 0) {
      state.menu = {
        isValidLink: 'linkAlreadyExist',
        channels: state.menu.channels,
        channelLinks: state.menu.channelLinks,
      };
    } else if (e.target.value === '') {
      state.menu = {
        isValidLink: null,
        isChannelLoaded: null,
        channels: state.menu.channels,
        channelLinks: state.menu.channelLinks,
      };
    } else {
      state.menu = {
        isValidLink: 'notvalid',
        channels: state.menu.channels,
        channelLinks: state.menu.channelLinks,
      };
    }
  });

  const element = document.getElementById('buttonOnSubmit');
  element.addEventListener('click', () => {
    state.menu = {
      isFormSubmitted: 'submitted',
      isChannelLoaded: 'inProgress',
      channels: state.menu.channels,
      channelLinks: state.menu.channelLinks,
    };
    const channelLink = document.getElementById('rssLinkInput').value;
    console.log(channelLink);
    if (channelLink === '') {
      state.menu = {
        isValidLink: 'notvalid',
        channels: state.menu.channels,
        channelLinks: state.menu.channelLinks,
      };
      return;
    }
    const corsApiUrl = 'https://cors-anywhere.herokuapp.com/';
    axios.get(`${corsApiUrl}${channelLink}`).then((res) => {
      state.menu = {
        isValidLink: null,
        channels: {
          channelLink: parseXML(res.data),
          ...state.menu.channels,
        },
        channelLinks: [channelLink, ...state.menu.channelLinks],
        isChannelLoaded: 'succeeded',
      };
    }).catch(() => {
      state.menu = {
        isChannelLoaded: 'failed',
        channels: state.menu.channels,
        channelLinks: state.menu.channelLinks,
      };
    });
  });
};
