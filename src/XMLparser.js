const parseXML = (data) => {
  const domParser = new DOMParser();
  const doc = domParser.parseFromString(data, 'text/xml');

  const items = doc.querySelectorAll('item');
  const parseArticles = [...items].map(item => ({
    title: item.querySelector('title').textContent,
    description: item.querySelector('description').textContent,
  }));

  return ({
    channelTitle: doc.querySelector('title').textContent,
    channelDescription: doc.querySelector('description').textContent,
    channelArticles: parseArticles,
  });
};

export default parseXML;
