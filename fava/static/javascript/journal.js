import { $, $$ } from './helpers';
import e from './events';
import router from './router';

e.on('page-loaded', () => {
  const journal = $('#journal-table');
  if (!journal) return;

  // Toggle postings by clicking on transaction row.
  $.delegate(journal, 'click', '.transaction', (event) => {
    if (event.target.tagName === 'A') {
      return;
    }
    // Filter for tags and links when clicking on them.
    if (event.target.className === 'tag' || event.target.className === 'link') {
      const filter = $('#filter-filter');
      filter.value += ` ${event.target.innerText}`;
      e.trigger('form-submit-filters', filter.form);
      return;
    }
    // Filter for metadata when clicking on the value.
    if (event.target.tagName === 'DD') {
      const filter = $('#filter-filter');
      filter.value += ` ${event.target.previousElementSibling.innerText}:"${event.target.innerText}"`;
      e.trigger('form-submit-filters', filter.form);
      return;
    }
    const clickedTransaction = event.target.closest('.transaction');
    $('.postings', clickedTransaction).classList.toggle('hidden');
    if ($('.metadata', clickedTransaction)) {
      $('.metadata', clickedTransaction).classList.toggle('hidden');
    }
  });

  // Toggle entries with buttons.
  $$('#entry-filters button').forEach((button) => {
    button.addEventListener('click', () => {
      const type = button.getAttribute('data-type');
      const shouldShow = button.classList.contains('inactive');

      button.classList.toggle('inactive', !shouldShow);
      if (type === 'transaction' || type === 'custom' || type === 'document') {
        $$(`#entry-filters .${type}-toggle`).forEach((el) => {
          el.classList.toggle('inactive', !shouldShow);
        });
      }

      $$(`#journal-table .${type}`).forEach((el) => {
        el.classList.toggle('hidden', !shouldShow);
      });

      // Modify get params
      const filterShow = [];
      $$('#entry-filters button').forEach((el) => {
        if (!el.classList.contains('inactive')) {
          filterShow.push(el.getAttribute('data-type'));
        }
      });

      const url = new URL(window.location);
      url.searchParams.delete('show');
      filterShow.forEach((filter) => {
        url.searchParams.append('show', filter);
      });
      router.navigate(url.toString(), false);
    });
  });
});
