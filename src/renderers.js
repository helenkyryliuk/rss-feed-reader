import $ from 'jquery';

const renderChannel = (channelTitle, channelDescription, articles) => {
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
  headerForChannel.textContent = channelTitle;
  descriptionForChannel.textContent = channelDescription;
  headerRow.append(headerForChannel);
  headerRow.append(descriptionForChannel);
  articles.map((article) => {
    const col4 = document.createElement('div');
    col4.classList.add('col-md-4');
    divRow.append(col4);
    const headerLink = document.createElement('a');
    headerLink.textContent = article.title;
    col4.appendChild(headerLink);
    const p = document.createElement('p');
    p.textContent = article.description;
    col4.appendChild(p);
    const paragraphLink = document.createElement('p');
    col4.appendChild(paragraphLink);
    const link = document.createElement('button');
    link.classList.add('btn', 'btn-info');
    link.textContent = 'View details';
    link.setAttribute('data-toggle', 'modal');
    link.setAttribute('data-target', '#exampleModalCenter');
    link.setAttribute('data-title', article.title);
    link.setAttribute('data-content', article.description);
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
};

export default renderChannel;
