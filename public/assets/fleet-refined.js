/* Fleet-only presentation enhancement; existing content, forms and routes remain intact. */
(() => {
  if (document.body.dataset.page !== 'fleet') return;
  const main = document.querySelector('main#app');
  const software = main?.querySelector('.sys');
  const services = main?.querySelector('.offers');
  if (!software || !services) return;

  software.classList.add('fleet-software');
  const originalHeading = software.querySelector('h2');
  const paragraphs = Array.from(software.querySelectorAll(':scope > p'));
  if (!originalHeading || paragraphs.length < 6) return;

  const top = document.createElement('div');
  top.className = 'fleet-software-heading';
  const eyebrow = document.createElement('span');
  eyebrow.className = 'fleet-eyebrow';
  eyebrow.textContent = 'BUILT AROUND YOUR WORKFLOW';
  top.append(eyebrow, originalHeading, paragraphs[0]);

  const grid = document.createElement('div');
  grid.className = 'fleet-software-grid';
  const labels = ['Driver portals','Pre-check & inspections','Fleet management','Custom systems'];
  paragraphs.slice(1, 5).forEach((p, i) => {
    const article = document.createElement('article');
    article.className = 'fleet-feature';
    const label = document.createElement('span');
    label.className = 'fleet-feature-index';
    label.textContent = String(i + 1).padStart(2, '0');
    const h = document.createElement('h3');
    h.textContent = labels[i];
    const b = p.querySelector('b');
    if (b) b.remove();
    article.append(label,h,p);
    grid.append(article);
  });
  const note = document.createElement('div');
  note.className = 'fleet-software-note';
  const noteLabel = document.createElement('span');
  noteLabel.textContent = 'MADE FOR YOUR OPERATION';
  noteLabel.className = 'fleet-eyebrow';
  note.append(noteLabel, paragraphs[5]);
  software.replaceChildren(top,grid,note);

  services.classList.add('fleet-service-list');
  const sectionIntro = document.createElement('div');
  sectionIntro.className = 'fleet-services-heading';
  const headingLabel = document.createElement('span');
  headingLabel.className = 'fleet-eyebrow';
  headingLabel.textContent = 'THE DAY-TO-DAY';
  const heading = document.createElement('h2');
  heading.textContent = 'The work that keeps a fleet moving.';
  sectionIntro.append(headingLabel,heading);
  services.prepend(sectionIntro);
  Array.from(services.querySelectorAll(':scope > div:not(.fleet-services-heading)')).forEach((row,i) => {
    row.classList.add('fleet-service-row');
    const h = row.querySelector('h3');
    if(h){h.style.removeProperty('padding-top')}
    const badge = document.createElement('span');
    badge.className='fleet-service-number';
    badge.textContent=String(i+1).padStart(2,'0');
    row.prepend(badge);
  });
})();
