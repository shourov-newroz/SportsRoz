const capitalize = (text: string): string => {
  const words = text.split(' ');

  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  );

  return capitalizedWords.join(' ');
};

const replaceColonBySpaceAndCapitalize = (text: string): string => {
  const replacedText = text.replace(/-/g, ' ');
  return capitalize(replacedText);
};

const dynamicRoutePaths = ['edit', 'info'];
export default function generateTitle(path: string): string {
  // Remove any query parameters, as those aren't included in breadcrumbs
  const asPathWithoutQuery = path.split('?')[0];

  // Break down the path between "/"s, removing empty entities
  // Ex:"/my/nested/path" --> ["my", "nested", "path"]
  const asPathNestedRoutes = asPathWithoutQuery
    .split('/')
    .filter((v) => v.length > 0);

  // finding is dynamic path present
  const isDynamicRoute = asPathNestedRoutes.find((asPath) =>
    dynamicRoutePaths.includes(asPath)
  );

  // in dynamic route removing the id
  if (isDynamicRoute) {
    asPathNestedRoutes.pop();
  }

  // Iterate over the list of nested route parts and build
  // a "crumb" object for each one.
  let breadCrumbString = '';
  asPathNestedRoutes.forEach((subpath) => {
    breadCrumbString = `${replaceColonBySpaceAndCapitalize(
      subpath
    )} ${breadCrumbString}`;
  });
  return breadCrumbString.trim();
}
