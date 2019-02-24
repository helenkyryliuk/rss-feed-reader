import axios from 'axios';
import validator from 'validator';
import {
  watch,
} from 'melanke-watchjs';
import parseXML from './XMLparser';
import renderChannel from './renderers';

export default () => {
  const state = {
    isValidLink: null,
    channels: [],
    channelLinks: [],
    isChannelLoaded: null,
  };

  watch(state, 'isValidLink', () => {
    const rssLinkInputBorder = document.getElementById('rssLinkInput');
    const validationMessage = document.getElementById('feedback');
    if (state.isValidLink === 'notvalid') {
      rssLinkInputBorder.classList.remove('is-valid');
      rssLinkInputBorder.classList.add('is-invalid');
      validationMessage.classList.remove('valid-feedback');
      validationMessage.classList.add('invalid-feedback');
      validationMessage.textContent = 'Please provide a valid RSS feed link.';
    } else if (state.isValidLink === 'valid') {
      rssLinkInputBorder.classList.remove('is-invalid');
      rssLinkInputBorder.classList.add('is-valid');
      validationMessage.classList.remove('invalid-feedback');
      validationMessage.classList.add('valid-feedback');
      validationMessage.textContent = 'Success!';
    } else if (state.isValidLink === 'linkAlreadyExists') {
      rssLinkInputBorder.classList.remove('is-valid');
      rssLinkInputBorder.classList.add('is-invalid');
      validationMessage.classList.remove('valid-feedback');
      validationMessage.classList.add('invalid-feedback');
      validationMessage.textContent = 'This channel has already been added. Please choose another one.';
    } else {
      rssLinkInputBorder.classList.remove('is-invalid');
      validationMessage.classList.remove('invalid-feedback');
      rssLinkInputBorder.classList.remove('is-valid');
      validationMessage.classList.remove('valid-feedback');
      validationMessage.textContent = '';
    }
  });

  watch(state, 'isChannelLoaded', () => {
    const rssLinkInputBorder = document.getElementById('rssLinkInput');
    const validationMessage = document.getElementById('feedback');
    const submitButton = document.getElementById('buttonOnSubmit');
    const alert = document.querySelector('div.alert');
    if (state.isChannelLoaded === 'inProgress') {
      alert.classList.remove('alert-warning');
      alert.classList.remove('alert-success');
      alert.classList.add('alert-info');
      alert.textContent = 'Loading...';
      rssLinkInputBorder.classList.remove('is-valid');
      submitButton.classList.add('disabled');
      rssLinkInputBorder.setAttribute('readonly', true);
      validationMessage.textContent = '';
    } else if (state.isChannelLoaded === 'succeeded') {
      alert.classList.remove('alert-info');
      alert.classList.remove('alert-warning');
      alert.classList.add('alert-success');
      alert.textContent = 'The channel has successfully been added to the feed!';
      submitButton.classList.remove('disabled');
      rssLinkInputBorder.removeAttribute('readonly');
      rssLinkInputBorder.value = '';
      rssLinkInputBorder.classList.remove('is-valid');
      validationMessage.classList.remove('valid-feedback');
      validationMessage.textContent = '';
    } else if (state.isChannelLoaded === 'failed') {
      alert.classList.remove('alert-info');
      alert.classList.add('alert-warning');
      alert.textContent = 'Failed to load the channel. Please try again.';
      submitButton.classList.remove('disabled');
      rssLinkInputBorder.value = '';
      rssLinkInputBorder.removeAttribute('readonly');
      rssLinkInputBorder.classList.remove('is-valid');
      validationMessage.classList.remove('valid-feedback');
      validationMessage.textContent = '';
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

  watch(state, 'channels', () => {
    const items = state.channels;
    items.map(e => renderChannel(e.channelTitle, e.channelDescription, e.channelArticles));
  });

  const inputField = document.getElementById('rssLinkInput');
  inputField.addEventListener('input', (e) => {
    state.isChannelLoaded = null;
    const checkIfChannelExists = state.channelLinks.filter(link => link === e.target.value);
    if (validator.isURL(e.target.value) && (checkIfChannelExists.length === 0)) {
      state.isValidLink = 'valid';
    } else if (checkIfChannelExists.length > 0) {
      state.isValidLink = 'linkAlreadyExists';
    } else if (e.target.value === '') {
      state.isValidLink = null;
    } else {
      state.isValidLink = 'notvalid';
    }
  });

  const element = document.getElementById('buttonOnSubmit');
  element.addEventListener('click', () => {
    const channelLink = document.getElementById('rssLinkInput').value;
    if ((channelLink === '')) {
      state.isValidLink = 'notvalid';
      return;
    }
    if (state.isValidLink === 'linkAlreadyExists') {
      return;
    }
    state.isChannelLoaded = 'inProgress';
    const corsApiUrl = 'https://cors-anywhere.herokuapp.com/';
    axios.get(`${corsApiUrl}${channelLink}`).then((res) => {
      state.isValidLink = null;
      state.channels = [parseXML(res.data), ...state.channels];
      state.channelLinks = [channelLink, ...state.channelLinks];
      state.isChannelLoaded = 'succeeded';
    }).catch(() => {
      state.isChannelLoaded = 'failed';
      state.isValidLink = null;
    });
  });
};
