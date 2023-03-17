'use es6'; // Added this as a one off to fix the post filter widget. This wiring was
// previously included in public_common via common_init.js

export default class PostFilterWidget {
  constructor() {
    this.getShowAllFiltersLinkEventHandler = link => {
      return event => {
        const {
          previousElementSibling: {
            children
          }
        } = link;

        if (children) {
          [].slice.call(children, 0).forEach(child => {
            child.style.display = 'block';
          });
        }

        link.style.display = 'none';
        event.preventDefault();
        event.stopPropagation();
      };
    };
  }

  setup() {
    const filterLinksNodes = [].slice.call(document.querySelectorAll('.filter-expand-link'), 0);
    filterLinksNodes.forEach(link => {
      link.addEventListener('click', this.getShowAllFiltersLinkEventHandler(link));
    });
  }

}