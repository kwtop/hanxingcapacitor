import {test} from 'node:test';
import assert from 'node:assert/strict';
import {localizeSchema} from '../src/i18n/localizeSchema.ts';

const origin = 'https://www.hanxingcapacitor.com';
const route = '/resources/example/';
const options = {
  sourcePath: route,
  modifiedAt: '2026-11-18',
  translatedPaths: new Set(['/', route, '/about/']),
  translate: value => ({'Test guide': 'Guía de prueba', 'Technical team': 'Equipo técnico'}[value] || value),
};

test('localizes article content and URLs without turning entity references into dated articles', () => {
  const input = {'@type': 'TechArticle', headline: 'Test guide', inLanguage: 'en', datePublished: '2026-11-01',
    dateModified: '2026-11-12', url: origin + route,
    publisher: {'@id': origin + '/#organization'}, author: {'@id': origin + '/#organization'},
    citation: [origin + '/about/#supplier-records', 'https://example.com/reference.pdf'],
    mainEntityOfPage: {'@id': origin + route + '#webpage'}, image: {'@id': origin + '/images/sample.webp'}};
  const output = localizeSchema(input, options);
  assert.equal(output.headline, 'Guía de prueba');
  assert.equal(output.inLanguage, 'es');
  assert.equal(output.dateModified, '2026-11-18');
  assert.equal(output.datePublished, '2026-11-01');
  assert.equal(output.url, origin + '/es' + route);
  assert.deepEqual(output.publisher, input.publisher);
  assert.deepEqual(output.author, input.author);
  assert.deepEqual(output.citation, [origin + '/es/about/#supplier-records', input.citation[1]]);
  assert.deepEqual(output.mainEntityOfPage, {'@id': origin + '/es' + route + '#webpage'});
  assert.deepEqual(output.image, input.image);
  assert.equal(input.dateModified, '2026-11-12', 'English source remains unchanged');
});

test('retains shared organization, brand, website and facility identity throughout a graph', () => {
  const input = {'@graph': [
    {'@type': 'Organization', '@id': origin + '/#organization', name: 'Hangzhou Zebang Refrigeration Equipment Co., Ltd.', url: origin + '/', brand: {'@id': origin + '/#brand'}, location: {'@id': origin + '/#manufacturing-facility'}},
    {'@type': 'WebSite', '@id': origin + '/#website', name: 'HAN XING', url: origin + '/', inLanguage: ['en', 'es'], publisher: {'@id': origin + '/#organization'}},
    {'@type': 'CollectionPage', url: origin + route, inLanguage: 'en', publisher: {'@id': origin + '/#organization'}, about: {'@type': 'Thing', name: 'Test guide'}},
  ]};
  const [organization, website, page] = localizeSchema(input, options)['@graph'];
  assert.deepEqual(organization, input['@graph'][0]);
  assert.deepEqual(website, input['@graph'][1]);
  assert.equal(page.dateModified, options.modifiedAt);
  assert.deepEqual(page.publisher, {'@id': origin + '/#organization'});
  assert.equal(page.about.dateModified, undefined);
});

test('handles explicitly typed content arrays and never invents author or publication date', () => {
  const input = {'@type': ['Article', 'TechArticle'], name: 'Test guide', publisher: {'@id': origin + '/#organization'}};
  const output = localizeSchema(input, options);
  assert.equal(output.dateModified, options.modifiedAt);
  assert.equal(output.author, undefined);
  assert.equal(output.datePublished, undefined);
  assert.equal(localizeSchema(input, {...options, modifiedAt: undefined}).dateModified, undefined);
});
