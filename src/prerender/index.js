const getProcessor = require("./processor");
const processAnnotations = require("./annotation-processor");

module.exports = async function preRender(data, options) {
  const { annotations = [] } = options;
  const chapter = Object.assign({ annotations }, data);
  const processor = getProcessor(options);
  const tree = await processor.run(data.contents, { data: {} });
  chapter.stylesheets = tree.data.stylesheets;
  chapter.contents = await processor.stringify(tree);
  chapter.navigation = getNavigation(chapter);
  chapter.annotations = await processAnnotations(chapter.annotations);
  return chapter;
};

function getNavigation({ book, resource }) {
  const navigation = {};
  navigation.index = book.readingOrder
    .map(item => item.url)
    .indexOf(resource.url.replace(".json", ""));
  const nextItem = book.readingOrder[navigation.index + 1];
  if (nextItem) {
    navigation.next = nextItem;
  }
  const prevItem = book.readingOrder[navigation.index - 1];
  if (prevItem) {
    navigation.previous = prevItem;
  }
  return navigation;
}
