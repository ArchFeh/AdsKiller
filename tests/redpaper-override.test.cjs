const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');
const { test } = require('node:test');

const file = path.join(__dirname, '../stash/overrides/redpaper.stoverride');
const config = JSON.parse(execFileSync('ruby', [
  '-ryaml', '-rjson', '-e', 'puts JSON.generate(YAML.load_file(ARGV.fetch(0)))', file,
], { encoding: 'utf8' }));
const hosts = ['edith', 'rec', 'www'].flatMap((prefix) =>
  ['xiaohongshu.com', 'rnote.com'].map((domain) => `${prefix}.${domain}`));
const paths = ['/api/sns/v1/note/imagefeed', '/api/sns/v2/note/feed'];
const scriptPath = process.env.ADSKILLER_REDPAPER_SCRIPT;

function hookFor(url) {
  const hooks = config.http.script.filter((hook) => new RegExp(hook.match).test(url));
  assert.equal(hooks.length, 1, `Expected exactly one script hook for ${url}`);
  assert.equal(hooks[0].type, 'response');
  assert.equal(hooks[0]['require-body'], true);
  return hooks[0];
}

function imageFeed(padding = '') {
  return JSON.stringify({
    code: 0,
    data: [{ note_list: [{
      id: 'regression-fixture',
      title: '保留笔记正文',
      media_save_config: { disable_watermark: false, disable_save: false, disable_weibo_cover: false },
      images_list: [{ url: 'https://ci.xiaohongshu.com/fixture.jpg', width: 2048, height: 2048 }],
    }] }],
    padding,
  });
}

function runScript(url, body) {
  const hook = hookFor(url);
  assert.ok(Buffer.byteLength(body) <= hook['max-size'], 'Stash would skip this response as oversized');
  const provider = config['script-providers'][hook.name];
  assert.equal(provider.url, 'https://kelee.one/Resource/JavaScript/RedPaper/RedPaper_remove_ads.js');
  let result;
  let calls = 0;
  vm.runInNewContext(fs.readFileSync(scriptPath, 'utf8'), {
    $request: { url },
    $response: { status: 200, body },
    $persistentStore: { read() { return null; }, write() { return true; } },
    $done(value) { calls += 1; result = value; },
    console: { log() {} },
  }, { timeout: 2000 });
  assert.equal(calls, 1);
  return JSON.parse(result.body);
}

test('image note endpoints on both domains have a single hook and a MitM host', () => {
  for (const host of hosts) {
    assert.ok(config.http.mitm.includes(host), `Missing MitM host: ${host}`);
    for (const endpoint of paths) hookFor(`https://${host}${endpoint}?note_id=fixture`);
  }
  for (const host of ['edith.rnote.com.example.org', 'api.example.com']) {
    assert.ok(config.http.script.every((hook) => !new RegExp(hook.match).test(`https://${host}${paths[0]}`)));
  }
});

test('image responses larger than the old 1 MiB cap are eligible for processing', () => {
  const size = Buffer.byteLength(imageFeed('x'.repeat(1048576)));
  assert.ok(size > 1048576);
  for (const endpoint of paths) {
    assert.ok(hookFor(`https://rec.rnote.com${endpoint}`)['max-size'] >= size);
  }
});

test('watermark configuration gets the transparent image on both domains', () => {
  for (const domain of ['xiaohongshu.com', 'rnote.com']) {
    const host = `ci.${domain}`;
    assert.ok(config.http.mitm.includes(host));
    const mocks = config.http.mock.filter((mock) => new RegExp(mock.match).test(`https://${host}/system_config/watermark/fixture.png`));
    assert.equal(mocks.length, 1);
    assert.equal(mocks[0]['status-code'], 200);
    const gif = Buffer.from(mocks[0].base64, 'base64');
    assert.equal(gif.toString('ascii', 0, 6), 'GIF89a');
    assert.equal(gif.readUInt16LE(6), 1);
    assert.equal(gif.readUInt16LE(8), 1);
    const control = gif.indexOf(Buffer.from([0x21, 0xf9, 0x04]));
    assert.ok(control >= 0);
    assert.equal(gif[control + 3] & 1, 1, 'GIF transparency flag');
  }
});

test('current upstream script disables image watermarks without changing image URLs or note text', { skip: !scriptPath }, () => {
  const original = JSON.parse(imageFeed());
  for (const host of hosts) {
    for (const endpoint of paths) {
      const result = runScript(`https://${host}${endpoint}?note_id=fixture`, imageFeed());
      const note = result.data[0].note_list[0];
      assert.equal(note.media_save_config.disable_watermark, true);
      assert.deepEqual(note.images_list, original.data[0].note_list[0].images_list);
      assert.equal(note.title, original.data[0].note_list[0].title);
    }
  }
});

test('a large image response is actually rewritten by the current upstream script', { skip: !scriptPath }, () => {
  const result = runScript(`https://rec.rnote.com${paths[0]}?note_id=fixture`, imageFeed('x'.repeat(1048576)));
  assert.equal(result.data[0].note_list[0].media_save_config.disable_watermark, true);
});
