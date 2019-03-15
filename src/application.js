import axios from 'axios';
import validator from 'validator';
import {
  watch,
} from 'melanke-watchjs';
import ls from 'local-storage';
import parseXML from './XMLparser';
import renderChannelList from './renderers';


const runUpdateEveryFiveSeconds = async (links, corsUrl) => {
  const promises = links.map(item => axios.get(`${corsUrl}${item}`));
  const result = await axios.all(promises);
  return result.map(item => parseXML(item.data));
};

const corsApiUrl = 'https://cors-anywhere.herokuapp.com/';

export default () => {
  const state = {
    linkValidationState: 'emptyByDefault',
    channels: ls.get('channels'),
    channelLinks: ls.get('channelLinks') || [],
    channelLoadingState: null,
  };

  watch(state, 'linkValidationState', () => {
    const rssLinkInputBorder = document.getElementById('rssLinkInput');
    const validationMessage = document.getElementById('feedback');
    switch (state.linkValidationState) {
      case 'notvalid':
        rssLinkInputBorder.classList.remove('is-valid');
        rssLinkInputBorder.classList.add('is-invalid');
        validationMessage.classList.remove('valid-feedback');
        validationMessage.classList.add('invalid-feedback');
        validationMessage.textContent = 'Please provide a valid RSS feed link.';
        break;
      case 'valid':
        rssLinkInputBorder.classList.remove('is-invalid');
        rssLinkInputBorder.classList.add('is-valid');
        validationMessage.classList.remove('invalid-feedback');
        validationMessage.classList.add('valid-feedback');
        validationMessage.textContent = 'Success!';
        break;
      case 'linkAlreadyExists':
        rssLinkInputBorder.classList.remove('is-valid');
        rssLinkInputBorder.classList.add('is-invalid');
        validationMessage.classList.remove('valid-feedback');
        validationMessage.classList.add('invalid-feedback');
        validationMessage.textContent = 'This channel has already been added. Please choose another one.';
        break;
      default:
        rssLinkInputBorder.classList.remove('is-invalid');
        validationMessage.classList.remove('invalid-feedback');
        rssLinkInputBorder.classList.remove('is-valid');
        validationMessage.classList.remove('valid-feedback');
        validationMessage.textContent = '';
    }
  });

  watch(state, 'channelLoadingState', () => {
    const rssLinkInputBorder = document.getElementById('rssLinkInput');
    const validationMessage = document.getElementById('feedback');
    const submitButton = document.getElementById('buttonOnSubmit');
    const alert = document.querySelector('div.alert');
    switch (state.channelLoadingState) {
      case 'inProgress':
        alert.classList.remove('alert-warning');
        alert.classList.remove('alert-success');
        alert.classList.add('alert-info');
        alert.textContent = 'Loading...';
        rssLinkInputBorder.classList.remove('is-valid');
        submitButton.classList.add('disabled');
        rssLinkInputBorder.setAttribute('readonly', true);
        validationMessage.textContent = '';
        break;
      case 'succeeded':
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
        break;
      case 'failed':
        alert.classList.remove('alert-info');
        alert.classList.add('alert-warning');
        alert.textContent = 'Failed to load the channel. Please try again.';
        submitButton.classList.remove('disabled');
        rssLinkInputBorder.removeAttribute('readonly');
        rssLinkInputBorder.classList.remove('is-valid');
        validationMessage.classList.remove('valid-feedback');
        validationMessage.textContent = '';
        break;
      default:
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
    renderChannelList(state.channels);
  });

  renderChannelList(state.channels);
  const inputField = document.getElementById('rssLinkInput');
  inputField.addEventListener('input', (e) => {
    state.channelLoadingState = null;
    const checkIfChannelExists = state.channelLinks.includes(e.target.value);
    if (validator.isURL(e.target.value) && (checkIfChannelExists === false)) {
      state.linkValidationState = 'valid';
    } else if (checkIfChannelExists === true) {
      state.linkValidationState = 'linkAlreadyExists';
    } else if (e.target.value === '') {
      state.linkValidationState = 'emptyByDefault';
    } else {
      state.linkValidationState = 'notvalid';
    }
  });

  const runUpdate = async () => {
    const newchannels = await runUpdateEveryFiveSeconds(state.channelLinks, corsApiUrl);
    state.channels = newchannels;
    ls.set('channels', state.channels);
    setTimeout(runUpdate, 5000);
  };

  const element = document.getElementById('buttonOnSubmit');
  element.addEventListener('click', () => {
    const channelLink = document.getElementById('rssLinkInput').value;
    if ((state.linkValidationState === 'emptyByDefault')) {
      state.linkValidationState = 'notvalid';
      return;
    }
    if (state.linkValidationState === 'linkAlreadyExists') {
      return;
    }
    state.channelLoadingState = 'inProgress';
    axios.get(`${corsApiUrl}${channelLink}`).then((res) => {
      state.linkValidationState = 'emptyByDefault';

      state.channels = [parseXML(res.data), ...state.channels];
      ls.set('channels', state.channels);
      state.channelLinks = [channelLink, ...state.channelLinks];
      ls.set('channelLinks', state.channelLinks);
      state.channelLoadingState = 'succeeded';
      runUpdate();
    }).catch(() => {
      state.channelLoadingState = 'failed';
      state.linkValidationState = 'emptyByDefault';
    });
  });
};
