import $ from 'jquery';

const renderChannelList = (channels) => {
  const newList = document.createElement('div');
  newList.classList.add('container');
  channels.forEach((e) => {
    const divRow = document.createElement('div');
    divRow.classList.add('row');
    const headerRow = document.createElement('div');
    headerRow.classList.add('card-header');
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card', 'bg-light', 'mb-3');
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    cardDiv.append(headerRow);
    cardDiv.append(cardBody);
    cardBody.append(divRow);
    newList.append(cardDiv);
    const headerForChannel = document.createElement('h5');
    headerForChannel.classList.add('card-title', 'text-center');
    const descriptionForChannel = document.createElement('p');
    descriptionForChannel.classList.add('card-text', 'text-center');
    headerForChannel.textContent = e.channelTitle;
    descriptionForChannel.textContent = e.channelDescription;
    headerRow.append(headerForChannel);
    headerRow.append(descriptionForChannel);
    e.channelArticles.map((article) => {
      const col4 = document.createElement('div');
      col4.classList.add('col-md-4');
      divRow.append(col4);
      const headerLink = document.createElement('a');
      headerLink.setAttribute('href', article.articleLink);
      headerLink.textContent = article.articleTitle;
      col4.appendChild(headerLink);
      const p = document.createElement('p');
      p.textContent = article.articleDescription;
      col4.appendChild(p);
      const paragraphLink = document.createElement('p');
      col4.appendChild(paragraphLink);
      const link = document.createElement('button');
      link.classList.add('btn', 'btn-info');
      link.textContent = 'View details';
      link.setAttribute('data-toggle', 'modal');
      link.setAttribute('data-target', '#exampleModalCenter');
      link.setAttribute('data-title', article.articleTitle);
      link.setAttribute('data-content', article.articleDescription);
      paragraphLink.appendChild(link);
      return $('#exampleModalCenter').on('show.bs.modal', function (event) {
        const button = $(event.relatedTarget);
        const header = button.data('title');
        const content = button.data('content');
        const modal = $(this);
        modal.find('.modal-title').text(header);
        modal.find('.modal-body').text(content);
      });
    });
  });
  const oldList = document.querySelector('div.container');
  oldList.replaceWith(newList);
};

export default renderChannelList;
