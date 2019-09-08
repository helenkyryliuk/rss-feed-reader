const parseXML = (data) => {
  const domParser = new DOMParser();
  const doc = domParser.parseFromString(data, 'text/xml');

  const items = doc.querySelectorAll('item');
  const parseArticles = [...items].map(item => ({
    link: item.querySelector('link').textContent,
    title: item.querySelector('title').textContent,
    description: item.querySelector('description').textContent,
    channelMedia: item.querySelector('thumbnail') && item.querySelector('thumbnail').textContent,
  }));

  return ({
    channelTitle: doc.querySelector('title').textContent,
    channelDescription: doc.querySelector('description').textContent,
    channelArticles: parseArticles,
  });
};

export default parseXML;
