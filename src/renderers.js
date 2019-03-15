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
    headerRow.innerHTML = `<h5 class="card-title text-center">${e.channelTitle}</h5>\n
    <p class="card-text text-center">${e.channelDescription}</p>`;
    e.channelArticles.map((article) => {
      const cardBodyColumn = document.createElement('div');
      cardBodyColumn.classList.add('col-md-4');
      divRow.append(cardBodyColumn);
      cardBodyColumn.innerHTML = `<a href="${article.link}">${article.title}</a><p>${article.description}</p>`;
      const paragraphLink = document.createElement('p');
      cardBodyColumn.appendChild(paragraphLink);
      paragraphLink.innerHTML = `<button class="btn btn-info" data-content="${article.description}" \n
      data-title="${article.title}" data-toggle='modal' data-target="#exampleModalCenter">View details</button>`;
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
